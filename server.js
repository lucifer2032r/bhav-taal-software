const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_9mbkZBO3GEpu@ep-twilight-poetry-an5yt2g3.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

// ==========================================
// ✉️ EMAIL CONFIGURATION (NODEMAILER)
// ==========================================
// ⚠️ IMPORTANT: CHANGE THESE TWO LINES TO YOUR REAL DETAILS!
const YOUR_GMAIL_ID = "YOUR_REAL_EMAIL@gmail.com"; 
const YOUR_GMAIL_APP_PASSWORD = "xxxx xxxx xxxx xxxx"; // <-- The 16-letter App Password from Google Security

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: bhav.taal.manager@gmail.com,
    pass: imqqunpawixvtjfg
  }
});

// ==========================================
// 🚀 DEEP WAKE (FOR CRONJOB)
// ==========================================
app.get('/api/keepalive', async (req, res) => {
  try {
    await db.query('SELECT 1'); 
    res.status(200).send('Deep Wake Successful: Render & Neon are awake.');
  } catch (err) {
    res.status(500).send('Deep Wake Failed.');
  }
});

// ==========================================
// 🔐 AUTHENTICATION, OTP & SUBSCRIPTION
// ==========================================

// 1. Send OTP (For Registration OR Forgot Password)
app.post('/api/send-otp', async (req, res) => {
  const { email, type } = req.body;
  
  try {
    const shopRes = await db.query('SELECT * FROM shops WHERE email = $1', [email]);
    
    if (type === 'register' && shopRes.rows.length > 0) {
      return res.status(400).json({ success: false, message: "This email is already registered." });
    }
    if (type === 'forgot' && shopRes.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Email not found in our system." });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60000); // Expires in 10 minutes

    // A. TRY SENDING THE EMAIL FIRST
    await transporter.sendMail({
      from: `"Bhav-Taal Security" <${YOUR_GMAIL_ID}>`,
      to: email,
      subject: type === 'register' ? 'Your Bhav-Taal Verification Code' : 'Bhav-Taal Password Reset OTP',
      html: `<h2>Hello!</h2><p>Your 6-digit verification code is: <b style="font-size:24px; color:#6366f1;">${otp}</b></p><p>This code will expire in 10 minutes.</p>`
    });

    // B. IF EMAIL IS SUCCESSFUL, SAVE TO DATABASE
    await db.query(
      `INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET otp = $2, expires_at = $3`,
      [email, otp, expires_at]
    );

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("Mail Error Detail:", err);
    res.status(500).json({ success: false, message: "Failed to send email. Check your email credentials lines 20 & 21." });
  }
});

// 2. Register
app.post('/api/register', async (req, res) => {
  const { shopName, username, password, email, phone, otp } = req.body;
  
  try {
    const otpRes = await db.query('SELECT * FROM otps WHERE email = $1 AND otp = $2', [email, otp]);
    if (otpRes.rows.length === 0) return res.status(400).json({ success: false, message: "Invalid OTP Code." });
    if (new Date(otpRes.rows[0].expires_at) < new Date()) return res.status(400).json({ success: false, message: "OTP has expired. Request a new one." });

    const existingUser = await db.query('SELECT * FROM shops WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) return res.status(400).json({ success: false, message: "Username already taken." });

    const subEnd = new Date();
    subEnd.setDate(subEnd.getDate() + 7);

    const result = await db.query(
      'INSERT INTO shops (shop_name, username, password, email, contact_number, subscription_end) VALUES ($1, $2, $3, $4, $5, $6) RETURNING shop_id, subscription_end',
      [shopName, username, password, email, phone, subEnd]
    );

    await db.query('DELETE FROM otps WHERE email = $1', [email]);

    res.json({ success: true, shop_id: result.rows[0].shop_id, subscription_end: result.rows[0].subscription_end });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: "Email or Username already exists." });
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// 3. Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM shops WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length === 0) return res.status(400).json({ success: false, message: "Invalid credentials" });
    res.json({ success: true, shop_id: result.rows[0].shop_id, subscription_end: result.rows[0].subscription_end });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 4. Verify OTP for Forgot Password
app.post('/api/verify-forgot-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRes = await db.query('SELECT * FROM otps WHERE email = $1 AND otp = $2', [email, otp]);
    if (otpRes.rows.length === 0) return res.status(400).json({ success: false, message: "Invalid OTP Code." });
    if (new Date(otpRes.rows[0].expires_at) < new Date()) return res.status(400).json({ success: false, message: "OTP has expired." });
    res.json({ success: true, message: "OTP Verified." });
  } catch (err) { res.status(500).json({ success: false, message: "Error verifying OTP" }); }
});

// 5. Reveal Password
app.post('/api/reveal-password', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRes = await db.query('SELECT * FROM otps WHERE email = $1 AND otp = $2', [email, otp]);
    if (otpRes.rows.length === 0) return res.status(400).json({ success: false, message: "Security check failed." });

    const userRes = await db.query('SELECT password FROM shops WHERE email = $1', [email]);
    await db.query('DELETE FROM otps WHERE email = $1', [email]);

    res.json({ success: true, password: userRes.rows[0].password });
  } catch (err) { res.status(500).json({ success: false, message: "Failed to reveal password." }); }
});

// 6. Reset Password
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword, otp } = req.body;
  try {
    const otpRes = await db.query('SELECT * FROM otps WHERE email = $1 AND otp = $2', [email, otp]);
    if (otpRes.rows.length === 0) return res.status(400).json({ success: false, message: "Security check failed." });

    await db.query('UPDATE shops SET password = $1 WHERE email = $2', [newPassword, email]);
    await db.query('DELETE FROM otps WHERE email = $1', [email]);

    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) { res.status(500).json({ success: false, message: "Failed to reset password." }); }
});

app.post('/api/subscribe', async (req, res) => {
  const { shop_id, months } = req.body;
  try {
    const shop = await db.query('SELECT subscription_end FROM shops WHERE shop_id = $1', [shop_id]);
    let currentEnd = new Date(shop.rows[0].subscription_end);
    if (currentEnd < new Date()) currentEnd = new Date();
    currentEnd.setMonth(currentEnd.getMonth() + parseInt(months));

    await db.query('UPDATE shops SET subscription_end = $1 WHERE shop_id = $2', [currentEnd, shop_id]);
    res.json({ success: true, new_end: currentEnd });
  } catch (err) { res.status(500).json({ success: false, message: "Subscription failed" }); }
});

// ==========================================
// PROFILE MANAGEMENT
// ==========================================
app.get('/api/shop/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM shops WHERE shop_id = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/shop/:id', async (req, res) => {
  const { shop_name, gst_number, logo_url, owner_name, address, category, email, contact_number, bank_name, account_no, ifsc_code } = req.body;
  try {
    await db.query(
      `UPDATE shops SET shop_name=$1, gst_number=$2, logo_url=$3, owner_name=$4, address=$5, category=$6, email=$7, contact_number=$8, bank_name=$9, account_no=$10, ifsc_code=$11 WHERE shop_id=$12`,
      [shop_name, gst_number, logo_url, owner_name, address, category, email, contact_number, bank_name, account_no, ifsc_code, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// INVENTORY MANAGEMENT
// ==========================================
app.get('/api/products/:shopId', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE shop_id = $1 ORDER BY product_id DESC', [req.params.shopId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', async (req, res) => {
  const { shop_id, name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive } = req.body;
  try {
    await db.query(
      `INSERT INTO products (shop_id, name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [shop_id, name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  const { name_english, name_regional, current_stock, min_stock_alert, hsn_code, item_rate, purchase_price } = req.body;
  try {
    await db.query(
      `UPDATE products SET name_english=$1, name_regional=$2, current_stock=$3, min_stock_alert=$4, hsn_code=$5, item_rate=$6, purchase_price=$7 WHERE product_id=$8`,
      [name_english, name_regional, current_stock, min_stock_alert, hsn_code, item_rate, purchase_price, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE product_id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// BILLING & TRANSACTIONS
// ==========================================
app.get('/api/transactions/:shopId', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM transactions WHERE shop_id = $1 ORDER BY transaction_id DESC', [req.params.shopId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/billing', async (req, res) => {
  const { shop_id, party_name, transaction_type, cart_items, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date } = req.body;
  try {
    const tx = await db.query(
      `INSERT INTO transactions (shop_id, party_name, transaction_type, total_amount, gst_amount, discount_amount, receipt_details, status, settlement_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING transaction_id`,
      [shop_id, party_name, transaction_type, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date || null]
    );
    
    const invoiceNo = `INV-${tx.rows[0].transaction_id}`;
    receipt_details.invoiceNo = invoiceNo;
    await db.query(`UPDATE transactions SET receipt_details = $1 WHERE transaction_id = $2`, [receipt_details, tx.rows[0].transaction_id]);

    for (const item of cart_items) {
      if (transaction_type === 'SELL') {
        await db.query('UPDATE products SET current_stock = current_stock - $1 WHERE product_id = $2', [item.qty, item.product_id]);
      } else {
        await db.query('UPDATE products SET current_stock = current_stock + $1 WHERE product_id = $2', [item.qty, item.product_id]);
      }
    }
    res.json({ success: true, receipt: receipt_details });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
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
    await db.query(
      `UPDATE transactions SET party_name=$1, transaction_type=$2, total_amount=$3, gst_amount=$4, discount_amount=$5, receipt_details=$6, status=$7, settlement_date=$8 WHERE transaction_id=$9`,
      [party_name, transaction_type, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date || null, txId]
    );

    res.json({ success: true, receipt: receipt_details });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bhav taal brain running on port ${PORT}`));
