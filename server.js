const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_9mbkZBO3GEpu@ep-twilight-poetry-an5yt2g3.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

// ==========================================
// ✉️ EMAIL CONFIGURATION (GOOGLE SCRIPT)
// ==========================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvXXbKWaaNSPOHKyyMsdnz3_VlHavKEdj9cvbpiH7OlwMataQecOSb6HB3dD81O7lhjA/exec"; 

// ==========================================
// 💳 RAZORPAY CONFIGURATION
// ==========================================
// Pulls securely from Render Environment Variables
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_T13wSE9FIt2rjT", // Fallback for local testing
  key_secret: process.env.RAZORPAY_KEY_SECRET || "bVdoXv4bkYmMVg5L7oSrpTda"
});

// ==========================================
// 🚀 DEEP WAKE (FOR CRONJOB)
// ==========================================
app.get('/api/keepalive', async (req, res) => {
  try { await db.query('SELECT 1'); res.status(200).send('Deep Wake Successful.'); } 
  catch (err) { res.status(500).send('Deep Wake Failed.'); }
});

// ==========================================
// 🔐 AUTHENTICATION & OTP
// ==========================================
app.post('/api/send-otp', async (req, res) => {
  const { email, username, type } = req.body;
  try {
    let targetEmail = email;
    
    // NEW SECURITY: Lookup by exact username first
    if (type === 'forgot') {
      const shopRes = await db.query('SELECT email FROM shops WHERE username = $1', [username]);
      if (shopRes.rows.length === 0) return res.status(400).json({ success: false, message: "Username not found in our system." });
      targetEmail = shopRes.rows[0].email;
    } else {
      const shopRes = await db.query('SELECT * FROM shops WHERE email = $1', [email]);
      if (shopRes.rows.length > 0) return res.status(400).json({ success: false, message: "This email is already registered." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60000); 

    await db.query(`INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET otp = $2, expires_at = $3`, [targetEmail, otp, expires_at]);

    console.log(`\n🔑 DEV OTP FOR ${targetEmail}: ${otp}\n`);

    const emailPayload = {
      email: targetEmail,
      subject: type === 'register' ? 'Your Bhav-Taal Verification Code' : 'Bhav-Taal Password Reset OTP',
      body: `<div style="font-family:Arial, sans-serif; text-align:center; padding:20px; color:#333;"><h2 style="color:#6366f1;">Bhav-Taal Security</h2><p>Your 6-digit verification code is:</p><div style="font-size:32px; font-weight:bold; letter-spacing:5px; color:#10b981; margin:20px 0;">${otp}</div><p style="color:#888; font-size:12px;">This code will expire in 10 minutes. Do not share it with anyone.</p></div>`
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(emailPayload), redirect: 'follow' });
      const result = await response.json();
      if (!result.success) throw new Error("Google Script failed");
      
      if (type === 'forgot') {
        const split = targetEmail.split('@');
        const masked = split[0].substring(0, 2) + "****@" + split[1];
        return res.json({ success: true, message: `OTP sent securely to registered email (${masked})` });
      }
      res.json({ success: true, message: "OTP sent successfully!" });
    } catch (apiError) { res.json({ success: true, message: "Email delayed, but check Render Logs for your OTP!" }); }
  } catch (err) { res.status(500).json({ success: false, message: "Database Error." }); }
});

app.post('/api/verify-forgot-otp', async (req, res) => {
  const { username, otp } = req.body;
  try {
    const shopRes = await db.query('SELECT email FROM shops WHERE username = $1', [username]);
    if (shopRes.rows.length === 0) return res.status(400).json({ success: false, message: "Security check failed." });
    const email = shopRes.rows[0].email;

    const otpRes = await db.query('SELECT * FROM otps WHERE email = $1 AND otp = $2', [email, otp]);
    if (otpRes.rows.length === 0) return res.status(400).json({ success: false, message: "Invalid OTP Code." });
    if (new Date(otpRes.rows[0].expires_at) < new Date()) return res.status(400).json({ success: false, message: "OTP has expired." });
    res.json({ success: true, message: "OTP Verified." });
  } catch (err) { res.status(500).json({ success: false, message: "Error verifying OTP" }); }
});

app.post('/api/reveal-password', async (req, res) => {
  const { username, otp } = req.body;
  try {
    const shopRes = await db.query('SELECT email, password FROM shops WHERE username = $1', [username]);
    if (shopRes.rows.length === 0) return res.status(400).json({ success: false, message: "Security check failed." });
    const { email, password } = shopRes.rows[0];

    const otpRes = await db.query('SELECT * FROM otps WHERE email = $1 AND otp = $2', [email, otp]);
    if (otpRes.rows.length === 0) return res.status(400).json({ success: false, message: "Security check failed." });
    
    await db.query('DELETE FROM otps WHERE email = $1', [email]);
    res.json({ success: true, password: password });
  } catch (err) { res.status(500).json({ success: false, message: "Failed to reveal password." }); }
});

app.post('/api/reset-password', async (req, res) => {
  const { username, newPassword, otp } = req.body;
  try {
    const shopRes = await db.query('SELECT email FROM shops WHERE username = $1', [username]);
    if (shopRes.rows.length === 0) return res.status(400).json({ success: false, message: "Security check failed." });
    const email = shopRes.rows[0].email;

    const otpRes = await db.query('SELECT * FROM otps WHERE email = $1 AND otp = $2', [email, otp]);
    if (otpRes.rows.length === 0) return res.status(400).json({ success: false, message: "Security check failed." });
    
    // THE BUG FIX: Target the exact username row, eliminating case-sensitivity mismatches!
    await db.query('UPDATE shops SET password = $1 WHERE username = $2', [newPassword, username]);
    await db.query('DELETE FROM otps WHERE email = $1', [email]);
    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) { res.status(500).json({ success: false, message: "Failed to reset password." }); }
});

// ==========================================
// 💳 SUBSCRIPTION & PAYMENT ROUTES (RAZORPAY)
// ==========================================

// 1. Create Order
app.post('/api/create-subscription-order', async (req, res) => {
  const { amount } = req.body; // Amount received in Rupees
  
  if (!amount || amount < 1) {
    return res.status(400).json({ success: false, message: "Invalid amount." });
  }

  try {
    const options = {
      amount: amount * 100, // Convert to paise (Razorpay requirement)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };
    
    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order_id: order.id, amount: order.amount });
  } catch (err) {
    console.error("Order Creation Error:", err);
    res.status(500).json({ success: false, message: "Failed to create payment order." });
  }
});

// 2. Verify Signature & Update Database
app.post('/api/verify-subscription', async (req, res) => {
  const { shop_id, days, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing payment fields." });
  }

  try {
    // Cryptographic verification
    const secret = process.env.RAZORPAY_KEY_SECRET || "bVdoXv4bkYmMVg5L7oSrpTda";
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed. Invalid signature." });
    }

    // Payment is valid! Update the database.
    const shop = await db.query('SELECT subscription_end FROM shops WHERE shop_id = $1', [shop_id]);
    let currentEnd = new Date(shop.rows[0].subscription_end);
    
    if (currentEnd < new Date()) currentEnd = new Date(); // Reset to today if expired
    currentEnd.setDate(currentEnd.getDate() + parseInt(days));
    
    await db.query('UPDATE shops SET subscription_end = $1 WHERE shop_id = $2', [currentEnd, shop_id]);
    
    res.json({ success: true, new_end: currentEnd, message: "Subscription activated successfully!" });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ success: false, message: "Server error during verification." });
  }
});

// ==========================================
// PROFILE, INVENTORY & BILLING ROUTES
// ==========================================
app.get('/api/shop/:id', async (req, res) => {
  try { const result = await db.query('SELECT * FROM shops WHERE shop_id = $1', [req.params.id]); res.json(result.rows[0] || {}); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/shop/:id', async (req, res) => {
  const { shop_name, gst_number, logo_url, upi_qr_url, owner_name, address, category, email, contact_number, bank_name, account_no, ifsc_code } = req.body;
  try { 
    await db.query(
      `UPDATE shops SET shop_name=$1, gst_number=$2, logo_url=$3, owner_name=$4, address=$5, category=$6, email=$7, contact_number=$8, bank_name=$9, account_no=$10, ifsc_code=$11, upi_qr_url=$12 WHERE shop_id=$13`, 
      [shop_name, gst_number, logo_url, owner_name, address, category, email, contact_number, bank_name, account_no, ifsc_code, upi_qr_url, req.params.id]
    ); 
    res.json({ success: true }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.get('/api/products/:shopId', async (req, res) => {
  try { const result = await db.query('SELECT * FROM products WHERE shop_id = $1 ORDER BY product_id DESC', [req.params.shopId]); res.json(result.rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', async (req, res) => {
  const { shop_id, name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive } = req.body;
  try { await db.query(`INSERT INTO products (shop_id, name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [shop_id, name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive]); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  const { name_english, name_regional, current_stock, min_stock_alert, hsn_code, item_rate, purchase_price } = req.body;
  try { await db.query(`UPDATE products SET name_english=$1, name_regional=$2, current_stock=$3, min_stock_alert=$4, hsn_code=$5, item_rate=$6, purchase_price=$7 WHERE product_id=$8`, [name_english, name_regional, current_stock, min_stock_alert, hsn_code, item_rate, purchase_price, req.params.id]); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try { await db.query('DELETE FROM products WHERE product_id = $1', [req.params.id]); res.json({ success: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/transactions/:shopId', async (req, res) => {
  try { const result = await db.query('SELECT * FROM transactions WHERE shop_id = $1 ORDER BY transaction_id DESC', [req.params.shopId]); res.json(result.rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/billing', async (req, res) => {
  const { shop_id, party_name, transaction_type, cart_items, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date } = req.body;
  try {
    const tx = await db.query(`INSERT INTO transactions (shop_id, party_name, transaction_type, total_amount, gst_amount, discount_amount, receipt_details, status, settlement_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING transaction_id`, [shop_id, party_name, transaction_type, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date || null]);
    receipt_details.invoiceNo = `INV-${tx.rows[0].transaction_id}`;
    await db.query(`UPDATE transactions SET receipt_details = $1 WHERE transaction_id = $2`, [receipt_details, tx.rows[0].transaction_id]);

    for (const item of cart_items) {
      if (transaction_type === 'SELL') await db.query('UPDATE products SET current_stock = current_stock - $1 WHERE product_id = $2', [item.qty, item.product_id]);
      else await db.query('UPDATE products SET current_stock = current_stock + $1 WHERE product_id = $2', [item.qty, item.product_id]);
    }
    res.json({ success: true, receipt: receipt_details });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/billing/:id', async (req, res) => {
  const { party_name, transaction_type, cart_items, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date } = req.body;
  const txId = req.params.id;
  try {
    const oldTx = await db.query('SELECT transaction_type, receipt_details FROM transactions WHERE transaction_id = $1', [txId]);
    if (oldTx.rows.length > 0 && oldTx.rows[0].receipt_details && oldTx.rows[0].receipt_details.cartItems) {
      const oldType = oldTx.rows[0].transaction_type;
      const oldCart = oldTx.rows[0].receipt_details.cartItems;
      for (const item of oldCart) {
        const qtyChange = oldType === 'SELL' ? item.qty : -item.qty;
        await db.query('UPDATE products SET current_stock = current_stock + $1 WHERE product_id = $2', [qtyChange, item.product_id]);
      }
    }
    for (const item of cart_items) {
      const qtyChange = transaction_type === 'SELL' ? -item.qty : item.qty;
      await db.query('UPDATE products SET current_stock = current_stock + $1 WHERE product_id = $2', [qtyChange, item.product_id]);
    }
    receipt_details.invoiceNo = `INV-${txId}`; 
    await db.query(`UPDATE transactions SET party_name=$1, transaction_type=$2, total_amount=$3, gst_amount=$4, discount_amount=$5, receipt_details=$6, status=$7, settlement_date=$8 WHERE transaction_id=$9`, [party_name, transaction_type, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date || null, txId]);
    res.json({ success: true, receipt: receipt_details });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bhav taal brain running on port ${PORT}`));
