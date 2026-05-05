const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_9mbkZBO3GEpu@ep-twilight-poetry-an5yt2g3.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
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
// AUTH & SUBSCRIPTION
// ==========================================
app.post('/api/register', async (req, res) => {
  const { shopName, username, password } = req.body;
  try {
    const existing = await db.query('SELECT * FROM shops WHERE username = $1', [username]);
    if (existing.rows.length > 0) return res.status(400).json({ success: false, message: "Username exists" });

    // 7-day trial
    const subEnd = new Date();
    subEnd.setDate(subEnd.getDate() + 7);

    const result = await db.query(
      'INSERT INTO shops (shop_name, username, password, subscription_end) VALUES ($1, $2, $3, $4) RETURNING shop_id, subscription_end',
      [shopName, username, password, subEnd]
    );
    res.json({ success: true, shop_id: result.rows[0].shop_id, subscription_end: result.rows[0].subscription_end });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

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

app.post('/api/subscribe', async (req, res) => {
  const { shop_id, months } = req.body;
  try {
    const shop = await db.query('SELECT subscription_end FROM shops WHERE shop_id = $1', [shop_id]);
    let currentEnd = new Date(shop.rows[0].subscription_end);
    if (currentEnd < new Date()) currentEnd = new Date(); // Reset if expired
    currentEnd.setMonth(currentEnd.getMonth() + parseInt(months));

    await db.query('UPDATE shops SET subscription_end = $1 WHERE shop_id = $2', [currentEnd, shop_id]);
    res.json({ success: true, new_end: currentEnd });
  } catch (err) {
    res.status(500).json({ success: false, message: "Subscription failed" });
  }
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
    // 1. Save Transaction
    const tx = await db.query(
      `INSERT INTO transactions (shop_id, party_name, transaction_type, total_amount, gst_amount, discount_amount, receipt_details, status, settlement_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING transaction_id`,
      [shop_id, party_name, transaction_type, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date || null]
    );
    
    // 2. Add Invoice Number to Receipt Data
    const invoiceNo = `INV-${tx.rows[0].transaction_id}`;
    receipt_details.invoiceNo = invoiceNo;
    await db.query(`UPDATE transactions SET receipt_details = $1 WHERE transaction_id = $2`, [receipt_details, tx.rows[0].transaction_id]);

    // 3. Update Inventory Stock
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
  const { party_name, transaction_type, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date } = req.body;
  try {
    receipt_details.invoiceNo = `INV-${req.params.id}`; // Re-apply ID as invoice
    await db.query(
      `UPDATE transactions SET party_name=$1, transaction_type=$2, total_amount=$3, gst_amount=$4, discount_amount=$5, receipt_details=$6, status=$7, settlement_date=$8 WHERE transaction_id=$9`,
      [party_name, transaction_type, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date || null, req.params.id]
    );
    res.json({ success: true, receipt: receipt_details });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bhav taal brain running on port ${PORT}`));
