const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); 

const app = express();
const port = 3000;

app.use(cors({ limit: '10mb' })); 
app.use(express.json({ limit: '10mb' }));

// --- HEALTH CHECK FOR CRON JOB ---
app.get('/', (req, res) => {
  res.status(200).send('Bhav taal backend is awake and running!');
});

const db = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_9mbkZBO3GEpu@ep-twilight-poetry-an5yt2g3.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false } 
});

db.connect().then(() => console.log('Successfully connected to the Bhav taal vault!'));

// --- 1. AUTH ROUTES ---
app.post('/api/register', async (req, res) => {
  try {
    const { shopName, username, password } = req.body;
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const licenseKey = `BHAV-${randomString}-TRIAL`;
    const subscriptionEnd = new Date(); subscriptionEnd.setDate(subscriptionEnd.getDate() + 7);

    const result = await db.query(`INSERT INTO shops (shop_name, username, password, license_key, subscription_end) VALUES ($1, $2, $3, $4, $5) RETURNING shop_id, shop_name, subscription_end`, [shopName, username, password, licenseKey, subscriptionEnd]);
    res.json({ success: true, shop_id: result.rows[0].shop_id, shop_name: result.rows[0].shop_name, subscription_end: result.rows[0].subscription_end });
  } catch (err) { res.status(500).json({ success: false, message: 'Username already exists or database error.' }); }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM shops WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: '❌ Invalid Username or Password.' });
    res.json({ success: true, shop_id: result.rows[0].shop_id, shop_name: result.rows[0].shop_name, subscription_end: result.rows[0].subscription_end });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/subscribe', async (req, res) => {
  const { shop_id, months } = req.body;
  try {
    const newEnd = new Date(); newEnd.setMonth(newEnd.getMonth() + months);
    await db.query('UPDATE shops SET subscription_end = $1 WHERE shop_id = $2', [newEnd, shop_id]);
    res.json({ success: true, new_end: newEnd });
  } catch (err) { res.status(500).send('Server Error'); }
});

// --- 2. PROFILE ROUTES ---
app.get('/api/shop/:shop_id', async (req, res) => {
  try { const result = await db.query('SELECT shop_name, gst_number, logo_url, owner_name, address, category, email, contact_number, bank_name, account_no, ifsc_code FROM shops WHERE shop_id = $1', [req.params.shop_id]); res.json(result.rows[0] || {}); } catch (err) { res.status(500).send('Server Error'); }
});
app.put('/api/shop/:shop_id', async (req, res) => {
  try {
    const { shop_name, gst_number, logo_url, owner_name, address, category, email, contact_number, bank_name, account_no, ifsc_code } = req.body;
    await db.query(`UPDATE shops SET shop_name = $1, gst_number = $2, logo_url = $3, owner_name = $4, address = $5, category = $6, email = $7, contact_number = $8, bank_name = $9, account_no = $10, ifsc_code = $11 WHERE shop_id = $12`, [shop_name, gst_number, logo_url, owner_name, address, category, email, contact_number, bank_name, account_no, ifsc_code, req.params.shop_id]);
    res.json({ success: true });
  } catch (err) { res.status(500).send('Server Error'); }
});

// --- 3. INVENTORY ROUTES ---
app.get('/api/products/:shop_id', async (req, res) => {
  try { const result = await db.query('SELECT * FROM products WHERE shop_id = $1', [req.params.shop_id]); res.json(result.rows); } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/products', async (req, res) => {
  try {
    const { shop_id, name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive } = req.body;
    await db.query(`INSERT INTO products (shop_id, name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [shop_id, name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive]);
    res.json({ success: true });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive } = req.body;
    await db.query(`UPDATE products SET name_english = $1, name_regional = $2, current_stock = $3, min_stock_alert = $4, gst_rate = $5, hsn_code = $6, item_rate = $7, purchase_price = $8, is_gst_inclusive = $9 WHERE product_id = $10`, [name_english, name_regional, current_stock, min_stock_alert, gst_rate, hsn_code, item_rate, purchase_price, is_gst_inclusive, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).send('Server Error'); }
});

app.delete('/api/products/:id', async (req, res) => {
  try { await db.query('DELETE FROM products WHERE product_id = $1', [req.params.id]); res.json({ success: true }); } catch (err) { res.status(500).send('Server Error'); }
});

// --- 4. BILLING & TRANSACTIONS (WITH KHATA ENGINE) ---
app.post('/api/billing', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN'); 
    const { shop_id, party_name, transaction_type, cart_items, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date } = req.body;
    
    // Convert empty date string to null for postgres
    const sDate = settlement_date === "" ? null : settlement_date;

    const result = await client.query(`INSERT INTO transactions (shop_id, party_name, transaction_type, total_amount, gst_amount, discount_amount, receipt_details, status, settlement_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING transaction_id`, [shop_id, party_name, transaction_type, total_amount, total_gst, discount_amount, receipt_details, status, sDate]);
    const transaction_id = result.rows[0].transaction_id;
    
    receipt_details.invoiceNo = `INV-${transaction_id}`;
    await client.query(`UPDATE transactions SET receipt_details = $1 WHERE transaction_id = $2`, [receipt_details, transaction_id]);

    for (let item of cart_items) {
      const stockChange = transaction_type === 'SELL' ? -item.qty : item.qty;
      await client.query(`UPDATE products SET current_stock = current_stock + $1 WHERE product_id = $2`, [stockChange, item.product_id]);
    }
    
    await client.query('COMMIT'); res.json({ message: 'Success', receipt: receipt_details });
  } catch (err) { await client.query('ROLLBACK'); res.status(500).send('Server Error'); } finally { client.release(); }
});

app.put('/api/billing/:id', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { party_name, transaction_type, cart_items, total_amount, total_gst, discount_amount, receipt_details, status, settlement_date } = req.body;
    
    const sDate = settlement_date === "" ? null : settlement_date;

    const oldTx = await client.query('SELECT transaction_type, receipt_details FROM transactions WHERE transaction_id = $1', [req.params.id]);
    const oldCart = oldTx.rows[0].receipt_details.cartItems || [];
    const oldType = oldTx.rows[0].transaction_type;
    for(let item of oldCart) {
      const reverseQty = oldType === 'SELL' ? item.qty : -item.qty;
      await client.query('UPDATE products SET current_stock = current_stock + $1 WHERE product_id = $2', [reverseQty, item.product_id]);
    }

    receipt_details.invoiceNo = oldTx.rows[0].receipt_details.invoiceNo;

    for(let item of cart_items) {
      const applyQty = transaction_type === 'SELL' ? -item.qty : item.qty;
      await client.query('UPDATE products SET current_stock = current_stock + $1 WHERE product_id = $2', [applyQty, item.product_id]);
    }

    await client.query(`UPDATE transactions SET party_name=$1, transaction_type=$2, total_amount=$3, gst_amount=$4, discount_amount=$5, receipt_details=$6, status=$7, settlement_date=$8 WHERE transaction_id=$9`, [party_name, transaction_type, total_amount, total_gst, discount_amount, receipt_details, status, sDate, req.params.id]);
    
    await client.query('COMMIT'); res.json({ message: 'Success', receipt: receipt_details });
  } catch (err) { await client.query('ROLLBACK'); res.status(500).send('Server Error'); } finally { client.release(); }
});

app.get('/api/transactions/:shop_id', async (req, res) => {
  try { const result = await db.query('SELECT * FROM transactions WHERE shop_id = $1 ORDER BY transaction_date DESC', [req.params.shop_id]); res.json(result.rows); } catch (err) { res.status(500).send('Server Error'); }
});

app.listen(port, () => console.log(`Bhav taal server running on http://localhost:${port}`));
