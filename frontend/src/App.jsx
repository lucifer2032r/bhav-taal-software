import { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactTransliterate } from 'react-transliterate';
import "react-transliterate/dist/index.css";
import { LayoutDashboard, ShoppingCart, PackageSearch, PlusCircle, LogOut, Menu, Moon, Sun, ChevronLeft, Edit3, Trash2, Printer, Search, Download, Settings, Image as ImageIcon, Percent, IndianRupee, X, AlertTriangle, Receipt, Box, Clock, CreditCard, CheckCircle2, Lock, Pencil, FileText, ArrowDownRight, ArrowUpRight } from 'lucide-react';

// ==========================================
// 🚀 CLOUD CONNECTION - PASTE RENDER URL BELOW
// ==========================================
const API_URL = "https://bhav-taal-software.onrender.com"; // Example: "https://bhav-taal-backend.onrender.com"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); const [isRegistering, setIsRegistering] = useState(false); const [currentShopId, setCurrentShopId] = useState(null); 
  const [loginUser, setLoginUser] = useState(""); const [loginPass, setLoginPass] = useState(""); const [confirmPass, setConfirmPass] = useState(""); const [regShopName, setRegShopName] = useState(""); const [authMessage, setAuthMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // RAGE-CLICK SHIELD STATE
  const [isLoading, setIsLoading] = useState(false);

  const [subEndDate, setSubEndDate] = useState(null); const [timeLeftStr, setTimeLeftStr] = useState(""); const [timeColor, setTimeColor] = useState(""); const [isExpired, setIsExpired] = useState(false);
  const [activeTab, setActiveTab] = useState("ledger");
  
  const [inventory, setInventory] = useState([]); const [transactions, setTransactions] = useState([]); const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({ shop_name: "", gst_number: "", logo_url: "", owner_name: "", address: "", category: "", email: "", contact_number: "", bank_name: "", account_no: "", ifsc_code: "" });
  const [categorySearch, setCategorySearch] = useState(""); const [isCatSearchOpen, setIsCatSearchOpen] = useState(false);

  const businessCategories = [ "Construction Materials Supply", "Hardware Store", "Cement Dealership", "Steel & TMT Bars", "Paints & Chemicals", "Electrical Fittings", "Plumbing & Sanitaryware", "Tiles & Ceramics", "Timber & Plywood", "Glass & Mirrors", "Furniture & Decor", "Electronics & Appliances", "Medical Pharmacy", "Other" ];

  const [englishName, setEnglishName] = useState(""); const [regionalName, setRegionalName] = useState(""); const [stock, setStock] = useState(""); const [minAlert, setMinAlert] = useState(""); const [gst, setGst] = useState(""); const [hsnCode, setHsnCode] = useState(""); 
  const [itemRate, setItemRate] = useState(""); const [purchasePrice, setPurchasePrice] = useState(""); const [isGstInclusive, setIsGstInclusive] = useState(true); const [language, setLanguage] = useState("gu");
  
  const [cart, setCart] = useState([]); 
  const [partyName, setPartyName] = useState(""); const [partyGst, setPartyGst] = useState(""); const [transType, setTransType] = useState("SELL"); 
  const [billStatus, setBillStatus] = useState("Settled"); 
  const [settlementDate, setSettlementDate] = useState(""); 
  const [discountVal, setDiscountVal] = useState(""); const [discountType, setDiscountType] = useState("percent");
  const [searchQuery, setSearchQuery] = useState(""); const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  const [editBillId, setEditBillId] = useState(null);
  const [editingId, setEditingId] = useState(null); const [editData, setEditData] = useState({ name_english: "", name_regional: "", current_stock: "", min_stock_alert: "", gst_rate: "", hsn_code: "", item_rate: "", purchase_price: "", is_gst_inclusive: true });

  const t = isDarkMode ? { bg: '#0f172a', sidebar: '#1e293b', card: '#1e293b', text: '#f8fafc', textMuted: '#94a3b8', border: '#334155', primary: '#818cf8', inputBg: '#0f172a', success: '#10b981', danger: '#ef4444', warning: '#f39c12' } : { bg: '#f1f5f9', sidebar: '#ffffff', card: '#ffffff', text: '#0f172a', textMuted: '#64748b', border: '#e2e8f0', primary: '#6366f1', inputBg: '#f8fafc', success: '#10b981', danger: '#ef4444', warning: '#f39c12' };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    :root, #root { max-width: 100vw !important; width: 100vw !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }
    body { display: block !important; margin: 0 !important; padding: 0 !important; font-family: 'Inter', sans-serif; overflow: hidden; width: 100vw; height: 100vh; background-color: ${t.bg} !important; }
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    @media print { 
      @page { size: A4 portrait; margin: 5mm; } html, body { width: 100% !important; height: 100% !important; background: white !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; }
      .no-print { display: none !important; } .print-only { display: block !important; width: 100%; background: white; margin: 0; padding: 0; } 
      .page-break { page-break-after: always; height: 97vh; width: 100%; box-sizing: border-box; position: relative; display: flex; flex-direction: column; background: white; } .avoid-break { page-break-inside: avoid; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
    .print-only { display: none; }
    .soft-input:focus { box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); border-color: ${t.primary} !important; }
    .react-transliterate-container { width: 100%; position: relative; } .react-transliterate-menu { background-color: ${t.card} !important; border: 1px solid ${t.border} !important; border-radius: 12px !important; box-shadow: 0 15px 50px -5px rgba(0,0,0,${isDarkMode ? '0.5' : '0.15'}) !important; padding: 8px !important; margin-top: 6px !important; z-index: 10000 !important; } .react-transliterate-menu-item { padding: 10px 16px !important; color: ${t.text} !important; border-radius: 8px !important; margin-bottom: 2px !important; transition: all 0.2s ease !important; font-size: 15px !important; background: transparent !important; } .react-transliterate-menu-item--active, .react-transliterate-menu-item:hover { background-color: ${t.primary}20 !important; color: ${t.primary} !important; font-weight: 600 !important; }
    .pdf-table { width: 100%; border-collapse: collapse; border: none; margin: 0; height: 100%; display: table; } .pdf-table th, .pdf-table td { border-left: 1px solid black; border-right: 1px solid black; padding: 6px 8px; font-size: 10pt; } .pdf-table th { font-weight: bold; text-align: center; border-top: 1px solid black; border-bottom: 1px solid black; }
    
    /* SHIELD ANIMATIONS */
    .loader { width: 48px; height: 48px; border: 5px solid #FFF; border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite; }
    @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .glass-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 99999; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 15px; color: white; font-weight: bold; letter-spacing: 1px; }
  `;

  const showMessage = (msg) => { setMessage(msg); setTimeout(() => setMessage(""), 4000); };

  useEffect(() => {
    if (!subEndDate) return;
    const interval = setInterval(() => {
      const distance = new Date(subEndDate).getTime() - new Date().getTime();
      if (distance < 0) { setTimeLeftStr("EXPIRED"); setTimeColor(t.danger); setIsExpired(true); setActiveTab("subscribe"); clearInterval(interval); return; }
      setIsExpired(false);
      const days = Math.floor(distance / (1000 * 60 * 60 * 24)); const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (days <= 7) { setTimeLeftStr(`${days}d ${hours}h ${minutes}m ${seconds}s`); if (days <= 1) setTimeColor(t.danger); else if (days <= 3) setTimeColor(t.warning); else setTimeColor(t.success); } 
      else { setTimeLeftStr(`Ends: ${new Date(subEndDate).toLocaleDateString()}`); setTimeColor(t.textMuted); }
    }, 1000);
    return () => clearInterval(interval);
  }, [subEndDate, t]);

  const handleAuth = async (e) => {
    e.preventDefault(); setAuthMessage(""); setIsLoading(true);
    if (isRegistering) {
      if (loginPass !== confirmPass) { setIsLoading(false); return setAuthMessage("❌ Passwords do not match!"); }
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passRegex.test(loginPass)) { setIsLoading(false); return setAuthMessage("❌ Password must be 8+ chars, uppercase, lowercase, number, special char."); }
      try {
        const res = await axios.post(`${API_URL}/api/register`, { shopName: regShopName, username: loginUser, password: loginPass });
        if (res.data.success) { setIsLoggedIn(true); setCurrentShopId(res.data.shop_id); setSubEndDate(res.data.subscription_end); fetchProfile(res.data.shop_id); fetchInventory(res.data.shop_id); fetchTransactions(res.data.shop_id); setActiveTab("ledger"); }
      } catch (err) { setAuthMessage(err.response ? err.response.data.message : "❌ Registration failed."); }
    } else {
      try {
        const res = await axios.post(`${API_URL}/api/login`, { username: loginUser, password: loginPass });
        if (res.data.success) { setIsLoggedIn(true); setCurrentShopId(res.data.shop_id); setSubEndDate(res.data.subscription_end); fetchProfile(res.data.shop_id); fetchInventory(res.data.shop_id); fetchTransactions(res.data.shop_id); setActiveTab("ledger"); }
      } catch (err) { setAuthMessage(err.response ? err.response.data.message : "❌ Invalid Credentials."); }
    }
    setIsLoading(false);
  };

  const handlePurchase = async (months) => { setIsLoading(true); try { const res = await axios.post(`${API_URL}/api/subscribe`, { shop_id: currentShopId, months }); setSubEndDate(res.data.new_end); setIsExpired(false); setActiveTab("ledger"); showMessage("🎉 Payment Successful!"); } catch (err) { showMessage("❌ Payment Failed."); } setIsLoading(false); };

  const handleAddToCart = (product) => { const existing = cart.find(c => c.product_id === product.product_id); if (existing) setCart(cart.map(c => c.product_id === product.product_id ? { ...c, qty: c.qty + 1 } : c)); else setCart([...cart, { ...product, qty: 1, rate: parseFloat(product.item_rate) }]); setSearchQuery(""); setIsSearchOpen(false); };
  const updateCartQty = (id, newQty) => { if (newQty < 1) return; setCart(cart.map(c => c.product_id === id ? { ...c, qty: parseInt(newQty) } : c)); };
  const updateCartRate = (id, newRate) => { setCart(cart.map(c => c.product_id === id ? { ...c, rate: parseFloat(newRate) || 0 } : c)); };
  const removeCartItem = (id) => { setCart(cart.filter(c => c.product_id !== id)); };

  let grossTotal = 0; let totalTaxable = 0; let totalGst = 0; let totalPurchaseCost = 0;
  cart.forEach(item => { const itemTotal = item.rate * item.qty; const ppTotal = (parseFloat(item.purchase_price) || 0) * item.qty; const gstPercent = parseFloat(item.gst_rate) || 0; let itemTaxable, itemGst; if (item.is_gst_inclusive) { itemTaxable = itemTotal / (1 + (gstPercent / 100)); itemGst = itemTotal - itemTaxable; } else { itemTaxable = itemTotal; itemGst = itemTaxable * (gstPercent / 100); } grossTotal += (item.is_gst_inclusive ? itemTotal : (itemTaxable + itemGst)); totalTaxable += itemTaxable; totalGst += itemGst; totalPurchaseCost += ppTotal; });
  let finalDiscount = 0; if (discountVal && parseFloat(discountVal) > 0) finalDiscount = discountType === 'percent' ? (grossTotal * (parseFloat(discountVal) / 100)) : parseFloat(discountVal);
  const finalTotalAmount = grossTotal - finalDiscount; const halfGst = totalGst / 2; const currentMargin = totalTaxable - totalPurchaseCost - finalDiscount;

  const fetchProfile = async (id = currentShopId) => { if (!id) return; try { const res = await axios.get(`${API_URL}/api/shop/${id}`); setProfile(res.data); } catch (e) {} };
  const fetchInventory = async (id = currentShopId) => { if (!id) return; try { const res = await axios.get(`${API_URL}/api/products/${id}`); setInventory(res.data); } catch (e) {} };
  const fetchTransactions = async (id = currentShopId) => { if (!id) return; try { const res = await axios.get(`${API_URL}/api/transactions/${id}`); setTransactions(res.data); } catch (e) {} };
  const handleLogoUpload = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setProfile({ ...profile, logo_url: reader.result }); reader.readAsDataURL(file); } };
  const saveProfile = async (e) => { e.preventDefault(); setIsLoading(true); try { await axios.put(`${API_URL}/api/shop/${currentShopId}`, profile); showMessage("✅ Profile Settings Updated!"); } catch (e) {} setIsLoading(false); };
  const triggerPrint = (invoiceNo, buyerName) => { const cleanBuyerName = buyerName ? buyerName.replace(/[^a-zA-Z0-9]/g, '_') : "Customer"; const originalTitle = document.title; document.title = `${invoiceNo}_to_${cleanBuyerName}`; setTimeout(() => { window.print(); document.title = originalTitle; }, 500); };

  const loadBillForEdit = (tx) => {
    const loadedCart = tx.receipt_details.cartItems.map(ci => { const invItem = inventory.find(i => i.product_id === ci.product_id); return invItem ? { ...invItem, qty: ci.qty, rate: ci.rate } : { product_id: ci.product_id, name_english: ci.name.split(' (')[0], name_regional: "", qty: ci.qty, rate: ci.rate, gst_rate: 0, purchase_price: 0, is_gst_inclusive: true }; });
    setCart(loadedCart); setPartyName(tx.party_name); setPartyGst(tx.receipt_details.partyGst || ""); setTransType(tx.transaction_type); setDiscountVal(tx.discount_amount || ""); setDiscountType("flat");
    setBillStatus(tx.status || "Settled"); setSettlementDate(tx.settlement_date ? tx.settlement_date.split('T')[0] : "");
    setEditBillId(tx.transaction_id); setActiveTab("billing"); showMessage("✏️ Bill loaded. Khata details and stock will update upon saving.");
  };

  const processBill = async (e) => {
    e.preventDefault(); if (cart.length === 0) return showMessage("❌ Cart is empty.");
    if (billStatus === 'Unsettled' && !partyName.trim()) return showMessage("❌ Party / Wholesaler Name required for Unsettled bills.");
    
    setIsLoading(true); // START SHIELD

    try {
      const currentReceiptData = { shopName: profile.shop_name, owner: profile.owner_name, address: profile.address, gstNum: profile.gst_number, logo: profile.logo_url, phone: profile.contact_number, email: profile.email, bank: profile.bank_name, acc: profile.account_no, ifsc: profile.ifsc_code, partyName, partyGst, transType, cartItems: cart.map(item => ({ product_id: item.product_id, name: `${item.name_english} (${item.name_regional})`, hsn: item.hsn_code, qty: item.qty, rate: item.rate, amount: (item.rate * item.qty) })), grossAmount: grossTotal, discount: finalDiscount, taxable: totalTaxable, totalGst: totalGst, cgst: halfGst, sgst: halfGst, finalTotal: finalTotalAmount, date: new Date().toLocaleDateString('en-IN') };
      const payload = { shop_id: currentShopId, party_name: partyName, transaction_type: transType, cart_items: cart, total_amount: finalTotalAmount, total_gst: totalGst, discount_amount: finalDiscount, receipt_details: currentReceiptData, status: billStatus, settlement_date: billStatus === 'Unsettled' ? settlementDate : "" };
      let response;
      if (editBillId) { response = await axios.put(`${API_URL}/api/billing/${editBillId}`, payload); setEditBillId(null); } else { response = await axios.post(`${API_URL}/api/billing`, payload); }
      setReceiptData(response.data.receipt); showMessage(`✅ Transaction saved successfully!`); setPartyName(""); setPartyGst(""); setCart([]); setDiscountVal(""); setSearchQuery(""); setBillStatus("Settled"); setSettlementDate(""); fetchInventory(); fetchTransactions(); triggerPrint(response.data.receipt.invoiceNo, response.data.receipt.partyName);
    } catch (error) { 
      showMessage("❌ Error processing bill."); 
    } finally {
      setIsLoading(false); // END SHIELD
    }
  };

  const handleReprint = (receiptDetailsStr) => { if (!receiptDetailsStr) return showMessage("❌ Old format bill. Data not available."); const data = typeof receiptDetailsStr === 'string' ? JSON.parse(receiptDetailsStr) : receiptDetailsStr; setReceiptData(data); triggerPrint(data.invoiceNo, data.partyName); };
  
  const saveToVault = async (e) => { 
    e.preventDefault(); 
    setIsLoading(true); 
    try { 
      await axios.post(`${API_URL}/api/products`, { shop_id: currentShopId, name_english: englishName, name_regional: regionalName, current_stock: parseInt(stock), min_stock_alert: parseInt(minAlert), gst_rate: parseFloat(gst), hsn_code: hsnCode, item_rate: parseFloat(itemRate), purchase_price: parseFloat(purchasePrice), is_gst_inclusive: isGstInclusive }); 
      showMessage("✅ Material added!"); setEnglishName(""); setRegionalName(""); setStock(""); setMinAlert(""); setGst(""); setHsnCode(""); setItemRate(""); setPurchasePrice(""); fetchInventory(); 
    } catch (error) { 
      showMessage("❌ Error saving product."); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveEdit = async (id) => { setIsLoading(true); try { await axios.put(`${API_URL}/api/products/${id}`, editData); showMessage("✅ Material updated!"); setEditingId(null); fetchInventory(); } catch (error) { showMessage("❌ Error updating."); } setIsLoading(false); };
  const deleteMaterial = async (id) => { if (window.confirm("Permanently delete this item?")) { setIsLoading(true); try { await axios.delete(`${API_URL}/api/products/${id}`); showMessage("🗑️ Material deleted."); fetchInventory(); } catch (error) {} setIsLoading(false); } };

  // --- BULLETPROOF HSN & ALPHABETICAL SORTING ENGINE ---
  const sortedInventory = [...inventory].sort((a, b) => { const hsnA = (a.hsn_code || "").toString().trim(); const hsnB = (b.hsn_code || "").toString().trim(); if (hsnA && hsnB) { if (hsnA !== hsnB) { return hsnA.localeCompare(hsnB, undefined, { numeric: true }); } } if (hsnA && !hsnB) return -1; if (!hsnA && hsnB) return 1; const nameA = (a.name_english || "").toString().toLowerCase().trim(); const nameB = (b.name_english || "").toString().toLowerCase().trim(); return nameA.localeCompare(nameB); });
  const filteredInventory = sortedInventory.filter(item => item.name_english.toLowerCase().includes(searchQuery.toLowerCase()) || item.name_regional.includes(searchQuery));
  const filteredCategories = businessCategories.filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase()));

  const unsettledBills = transactions.filter(tx => tx.status === 'Unsettled');
  const todayObj = new Date(); todayObj.setHours(0,0,0,0);
  const fiveDaysFromNow = new Date(todayObj); fiveDaysFromNow.setDate(todayObj.getDate() + 5);

  unsettledBills.sort((a, b) => {
    const dateA = a.settlement_date ? new Date(a.settlement_date) : null; const dateB = b.settlement_date ? new Date(b.settlement_date) : null;
    const getGroup = (d) => { if (!d) return 2; if (d <= fiveDaysFromNow) return 1; return 3; };
    const groupA = getGroup(dateA); const groupB = getGroup(dateB);
    if (groupA !== groupB) return groupA - groupB;
    if (dateA && dateB) return dateA - dateB;
    return 0;
  });

  const totalToReceive = unsettledBills.filter(tx => tx.transaction_type === 'SELL').reduce((sum, tx) => sum + parseFloat(tx.total_amount), 0);
  const totalToPay = unsettledBills.filter(tx => tx.transaction_type === 'PURCH').reduce((sum, tx) => sum + parseFloat(tx.total_amount), 0);
  const duePaymentsCount = unsettledBills.filter(tx => tx.settlement_date && new Date(tx.settlement_date) <= todayObj).length;
  const todayBillsCount = transactions.filter(tx => new Date(tx.transaction_date).toDateString() === new Date().toDateString()).length;
  const lowStockItems = inventory.filter(item => item.current_stock <= item.min_stock_alert);

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${t.border}`, backgroundColor: t.inputBg, color: t.text, fontSize: '15px', outline: 'none', transition: 'all 0.2s', marginTop: '6px' };
  const cardStyle = { backgroundColor: t.card, borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', border: `1px solid ${t.border}`, position: 'relative' };
  const labelStyle = { fontSize: '14px', fontWeight: '600', color: t.textMuted };
  const btnPrimary = { padding: '14px 24px', backgroundColor: t.primary, color: 'white', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' };

  const chunkArray = (arr, size) => { const chunked = []; for (let i = 0; i < arr.length; i += size) { chunked.push(arr.slice(i, i + size)); } return chunked; };
  const printChunks = receiptData && receiptData.cartItems ? chunkArray(receiptData.cartItems, 25) : [];

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: t.bg, fontFamily: "'Inter', sans-serif", transition: 'all 0.3s', position: 'relative' }}>
        <style>{globalStyles}</style>
        <form onSubmit={handleAuth} style={{ ...cardStyle, width: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '16px', overflow: 'hidden', margin: '0 auto 15px auto', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <img src="/bhav-taal_logo1.jpg" alt="Bhav taal Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h2 style={{ color: t.text, margin: '0 0 5px 0', fontSize: '28px' }}>Bhav taal</h2>
            <p style={{ color: t.textMuted, margin: 0, fontSize: '15px' }}>{isRegistering ? "Create a New Business" : "Secure License Gateway"}</p>
          </div>
          {authMessage && <div style={{ backgroundColor: `${t.danger}20`, color: t.danger, padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>{authMessage}</div>}
          {isRegistering && (<div style={{ marginBottom: '15px' }}><label style={labelStyle}>Business Name</label><input type="text" required value={regShopName} onChange={(e) => setRegShopName(e.target.value)} className="soft-input" style={inputStyle} /></div>)}
          <div style={{ marginBottom: '15px' }}><label style={labelStyle}>Username</label><input type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="soft-input" style={inputStyle} /></div>
          <div style={{ marginBottom: isRegistering ? '15px' : '30px' }}><label style={labelStyle}>Password</label><input type="password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="soft-input" style={inputStyle} /></div>
          {isRegistering && (<div style={{ marginBottom: '30px' }}><label style={labelStyle}>Confirm Password</label><input type="password" required value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="soft-input" style={inputStyle} /></div>)}
          <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}>{isRegistering ? "Start 7-Day Free Trial" : "Authenticate User"}</button>
          <div style={{ textAlign: 'center', marginTop: '20px' }}><button type="button" onClick={() => { setIsRegistering(!isRegistering); setAuthMessage(""); }} style={{ background: 'none', border: 'none', color: t.primary, fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>{isRegistering ? "Already have an account? Log In" : "Don't have an account? Sign Up"}</button></div>
        </form>
        <div style={{ position: 'absolute', bottom: '20px', color: t.textMuted, fontSize: '13px', fontWeight: '600' }}>©Developed by Lakshyadeepsinh Chauhan</div>
        
        {/* SHIELD */}
        {isLoading && (
          <div className="glass-overlay">
            <span className="loader"></span>
            <div>Authenticating...</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: t.bg, color: t.text, transition: 'all 0.3s' }}>
      <style>{globalStyles}</style>
      {isSearchOpen && (<div onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 900 }} />)}
      {isCatSearchOpen && (<div onClick={() => setIsCatSearchOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 900 }} />)}

      <div className="no-print" style={{ width: isSidebarOpen ? '260px' : '80px', backgroundColor: t.sidebar, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10 }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', borderBottom: `1px solid ${t.border}` }}>
          {isSidebarOpen && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><img src="/bhav-taal_logo1.jpg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} /><h2 style={{ margin: 0, fontSize: '20px', color: t.primary }}>Bhav taal</h2></div>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: '5px' }}><Menu size={24} /></button>
        </div>
        
        <div style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isExpired ? (
            <button onClick={() => setActiveTab("subscribe")} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: `${t.danger}15`, color: t.danger, fontWeight: '600' }}><Lock size={22} /> {isSidebarOpen && <span style={{ fontSize: '15px' }}>License Expired</span>}</button>
          ) : (
            [ { id: 'ledger', icon: LayoutDashboard, label: 'Dashboard' }, { id: 'billing', icon: ShoppingCart, label: 'Point of Sale' }, { id: 'list', icon: PackageSearch, label: 'Inventory' }, { id: 'add', icon: PlusCircle, label: 'Add Material' }, { id: 'profile', icon: Settings, label: 'Shop Settings' } ].map((nav) => (
              <button key={nav.id} onClick={() => { setActiveTab(nav.id); setMessage(""); }} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: activeTab === nav.id ? `${t.primary}15` : 'transparent', color: activeTab === nav.id ? t.primary : t.textMuted, fontWeight: activeTab === nav.id ? '600' : '500' }}>
                <nav.icon size={22} /> {isSidebarOpen && <span style={{ fontSize: '15px' }}>{nav.label}</span>}
              </button>
            ))
          )}
        </div>

        <div style={{ padding: '20px', borderTop: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {isSidebarOpen && (
            <div style={{ backgroundColor: `${timeColor}15`, padding: '12px', borderRadius: '12px', border: `1px solid ${timeColor}40` }}>
              <div style={{ fontSize: '11px', color: t.textMuted, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>License Valid Until</div>
              <div style={{ color: timeColor, fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> {timeLeftStr}</div>
            </div>
          )}
          {isSidebarOpen && (<button onClick={() => setActiveTab("subscribe")} style={{ width: '100%', padding: '10px', backgroundColor: t.primary, color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Upgrade Plan</button>)}
          <div style={{ display: 'flex', gap: '10px', justifyContent: isSidebarOpen ? 'space-between' : 'center' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: '5px' }}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => {setIsLoggedIn(false); setLoginUser(""); setLoginPass(""); setConfirmPass(""); setCart([]);}} style={{ background: 'none', border: 'none', color: t.danger, cursor: 'pointer', padding: '5px' }}><LogOut size={20} /></button>
          </div>
        </div>
      </div>

      <div className="no-print" style={{ flex: 1, overflowY: 'auto', padding: '40px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', flex: 1 }}>
          {message && (<div style={{ position: 'fixed', top: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: t.card, color: t.text, padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderLeft: `5px solid ${message.includes('❌') ? t.danger : t.success}`, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 100, fontWeight: '500', animation: 'fadeIn 0.3s ease' }}>{message}</div>)}

          {!isExpired && duePaymentsCount > 0 && activeTab !== "subscribe" && (
             <div style={{ backgroundColor: `${t.danger}15`, border: `1px solid ${t.danger}40`, color: t.danger, padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
               <AlertTriangle size={20} /> Alert: You have {duePaymentsCount} Party Payments that are DUE TODAY or OVERDUE! Check the Dashboard Unsettled List.
             </div>
          )}

          <div style={{ marginBottom: '40px', textAlign: 'center' }}><h1 style={{ fontSize: '32px', margin: '0 0 5px 0', color: t.text }}>{profile.shop_name || "Welcome"}</h1><p style={{ color: t.textMuted, margin: 0, fontWeight: '500' }}>System Online • {new Date().toLocaleDateString()}</p></div>

          {activeTab === "subscribe" && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}><h2 style={{ color: t.text, fontSize: '32px', margin: '0 0 10px 0' }}>Choose Your License Plan</h2><p style={{ color: t.textMuted, fontSize: '16px' }}>Secure, full-stack POS and Inventory management for your business.</p></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                <div style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '30px', display: 'flex', flexDirection: 'column' }}><h3 style={{ margin: '0 0 10px 0', color: t.text }}>Monthly Plan</h3><div style={{ fontSize: '36px', fontWeight: 'bold', color: t.primary, marginBottom: '20px' }}>₹299 <span style={{ fontSize: '16px', color: t.textMuted, fontWeight: 'normal' }}>/mo</span></div><ul style={{ padding: 0, listStyle: 'none', margin: '0 0 30px 0', flex: 1 }}><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Full POS Access</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Email Receipts</li></ul><button onClick={() => handlePurchase(1)} style={{ ...btnPrimary, backgroundColor: t.bg, color: t.primary, border: `1px solid ${t.primary}` }}>Subscribe Monthly</button></div>
                <div style={{ backgroundColor: t.card, border: `2px solid ${t.primary}`, borderRadius: '20px', padding: '30px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: `0 10px 30px ${t.primary}20` }}><div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: t.primary, color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>MOST POPULAR</div><h3 style={{ margin: '0 0 10px 0', color: t.text }}>Half-Yearly</h3><div style={{ fontSize: '36px', fontWeight: 'bold', color: t.primary, marginBottom: '20px' }}>₹1599 <span style={{ fontSize: '16px', color: t.textMuted, fontWeight: 'normal' }}>/6 mo</span></div><ul style={{ padding: 0, listStyle: 'none', margin: '0 0 30px 0', flex: 1 }}><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Save ₹195 immediately</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Full POS Access</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Priority Support</li></ul><button onClick={() => handlePurchase(6)} style={{ ...btnPrimary, boxShadow: `0 4px 15px ${t.primary}40` }}>Subscribe for 6 Months</button></div>
                <div style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '30px', display: 'flex', flexDirection: 'column' }}><h3 style={{ margin: '0 0 10px 0', color: t.text }}>Yearly Plan</h3><div style={{ fontSize: '36px', fontWeight: 'bold', color: t.primary, marginBottom: '20px' }}>₹2999 <span style={{ fontSize: '16px', color: t.textMuted, fontWeight: 'normal' }}>/yr</span></div><ul style={{ padding: 0, listStyle: 'none', margin: '0 0 30px 0', flex: 1 }}><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Save ₹589 immediately</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Full POS Access</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Custom Domains</li></ul><button onClick={() => handlePurchase(12)} style={{ ...btnPrimary, backgroundColor: t.bg, color: t.primary, border: `1px solid ${t.primary}` }}>Subscribe Yearly</button></div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '30px', color: t.textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><CreditCard size={18} /> Payments secured by Razorpay</div>
            </div>
          )}

          {activeTab === "profile" && !isExpired && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              <form onSubmit={saveProfile} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}><Settings color={t.primary} size={28}/><h2 style={{ margin: 0, color: t.text }}>Business Profile Setup</h2></div>
                <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}><div style={{ width: '100px', height: '100px', borderRadius: '12px', border: `2px dashed ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: t.inputBg }}>{profile.logo_url ? <img src={profile.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <ImageIcon color={t.textMuted} size={32} />}</div><div><label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>Business Logo (Optional)</label><input type="file" accept="image/*" onChange={handleLogoUpload} style={{ color: t.textMuted }} /></div></div>
                <h3 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '10px', marginBottom: '20px' }}>General Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div><label style={labelStyle}>Business Name</label><input type="text" required value={profile.shop_name || ""} onChange={(e) => setProfile({...profile, shop_name: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>GST Number (Compulsory)</label><input type="text" required value={profile.gst_number || ""} onChange={(e) => setProfile({...profile, gst_number: e.target.value})} placeholder="24AAACC1206D1Z1" className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Owner Name</label><input type="text" required value={profile.owner_name || ""} onChange={(e) => setProfile({...profile, owner_name: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Address</label><input type="text" required value={profile.address || ""} onChange={(e) => setProfile({...profile, address: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Contact Number</label><input type="tel" value={profile.contact_number || ""} onChange={(e) => setProfile({...profile, contact_number: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Email Address</label><input type="email" value={profile.email || ""} onChange={(e) => setProfile({...profile, email: e.target.value})} className="soft-input" style={inputStyle} /></div>
                </div>
                <h3 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '10px', marginBottom: '20px' }}>Bank Details (Printed on Bill)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div><label style={labelStyle}>Bank Name</label><input type="text" value={profile.bank_name || ""} onChange={(e) => setProfile({...profile, bank_name: e.target.value})} placeholder="HDFC Bank" className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>A/C Number</label><input type="text" value={profile.account_no || ""} onChange={(e) => setProfile({...profile, account_no: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>IFSC Code</label><input type="text" value={profile.ifsc_code || ""} onChange={(e) => setProfile({...profile, ifsc_code: e.target.value})} className="soft-input" style={inputStyle} /></div>
                </div>
                <div style={{ position: 'relative', marginBottom: '30px' }}>
                  <label style={labelStyle}>Business Category</label>
                  <div style={{ position: 'relative' }}><Search color={t.textMuted} size={20} style={{ position: 'absolute', left: '12px', top: '16px', zIndex: 10 }} /><input type="text" required value={categorySearch || profile.category || ""} placeholder="Search from 50+ categories..." className="soft-input" style={{ ...inputStyle, paddingLeft: '40px' }} onChange={(e) => { setCategorySearch(e.target.value); setIsCatSearchOpen(true); setProfile({...profile, category: e.target.value}); }} onFocus={() => setIsCatSearchOpen(true)} /></div>
                  {isCatSearchOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', marginTop: '8px', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', zIndex: 990 }}>
                      {filteredCategories.map((cat, i) => (<div key={i} onClick={() => { setProfile({...profile, category: cat}); setCategorySearch(cat); setIsCatSearchOpen(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${t.border}`, color: t.text }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${t.primary}15`} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>{cat}</div>))}
                    </div>
                  )}
                </div>
                <button type="submit" style={btnPrimary}>Save Business Profile</button>
              </form>
            </div>
          )}

          {activeTab === "ledger" && !isExpired && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div onClick={() => { setActiveTab("list"); setMessage(""); }} style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.primary}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><PackageSearch size={16}/> Quick Action</p>
                  <h3 style={{ margin: '10px 0 0 0', color: t.primary, fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>Manage Inventory <ChevronLeft style={{ transform: 'rotate(180deg)' }} size={20}/></h3>
                </div>
                <div style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.success}` }}><p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><Receipt size={16}/> Bills Today</p><h3 style={{ margin: '10px 0 0 0', color: t.text, fontSize: '28px' }}>{todayBillsCount}</h3></div>
                <div style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.textMuted}` }}><p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><Box size={16}/> Total Materials</p><h3 style={{ margin: '10px 0 0 0', color: t.text, fontSize: '28px' }}>{inventory.length}</h3></div>
                <div style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.success}` }}><p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowDownRight size={16}/> To Receive (Khata)</p><h3 style={{ margin: '10px 0 0 0', color: t.success, fontSize: '28px' }}>₹{totalToReceive.toFixed(2)}</h3></div>
                <div style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.danger}` }}><p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={16}/> To Pay (Payables)</p><h3 style={{ margin: '10px 0 0 0', color: t.danger, fontSize: '28px' }}>₹{totalToPay.toFixed(2)}</h3></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 15px 0', color: t.text, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}><AlertTriangle size={20} color={lowStockItems.length > 0 ? t.danger : t.success} /> Stock Alerts</h3>
                    {lowStockItems.length === 0 ? (<div style={{ padding: '15px', textAlign: 'center', backgroundColor: `${t.success}10`, color: t.success, borderRadius: '12px', fontWeight: '500' }}>All optimal!</div>) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                        {lowStockItems.map(item => (
                          <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: `1px solid ${t.danger}40`, backgroundColor: `${t.danger}05`, borderRadius: '10px' }}>
                            <div><div style={{ fontWeight: '600', color: t.text, fontSize: '14px' }}>{item.name_english}</div><div style={{ color: t.textMuted, fontSize: '12px' }}>Alert at {item.min_stock_alert}</div></div>
                            <div style={{ backgroundColor: t.danger, color: 'white', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}>{item.current_stock} Left</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 15px 0', color: t.text, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}><FileText size={20} color={t.text} /> Unsettled Bills</h3>
                    {unsettledBills.length === 0 ? (<div style={{ padding: '15px', textAlign: 'center', backgroundColor: `${t.success}10`, color: t.success, borderRadius: '12px', fontWeight: '500' }}>No pending payments!</div>) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                        {unsettledBills.map(tx => {
                          const sDate = tx.settlement_date ? new Date(tx.settlement_date) : null;
                          let dateColor = t.textMuted; let dateText = "No Date Set";
                          if (sDate) {
                            if (sDate <= todayObj) { dateColor = t.danger; dateText = `DUE: ${sDate.toLocaleDateString()}`; }
                            else if (sDate <= fiveDaysFromNow) { dateColor = t.warning; dateText = `Due Soon: ${sDate.toLocaleDateString()}`; }
                            else { dateColor = t.textMuted; dateText = `Due: ${sDate.toLocaleDateString()}`; }
                          }
                          const isReceiving = tx.transaction_type === 'SELL';
                          const boxColor = isReceiving ? t.success : t.danger;

                          return (
                            <div key={tx.transaction_id} onClick={() => loadBillForEdit(tx)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: `1px solid ${boxColor}40`, backgroundColor: `${boxColor}05`, borderRadius: '10px', cursor: 'pointer' }}>
                              <div>
                                <div style={{ fontWeight: '600', color: t.text, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  {isReceiving ? <ArrowDownRight size={14} color={t.success}/> : <ArrowUpRight size={14} color={t.danger}/>}
                                  {tx.party_name || "Unknown"}
                                </div>
                                <div style={{ color: dateColor, fontSize: '12px', fontWeight: 'bold' }}>{dateText}</div>
                              </div>
                              <div style={{ fontWeight: 'bold', fontSize: '14px', color: boxColor }}>₹{tx.total_amount}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ ...cardStyle, overflowX: 'auto', padding: '0', height: 'fit-content' }}>
                  <div style={{ padding: '25px', borderBottom: `1px solid ${t.border}` }}><h3 style={{ margin: 0, color: t.text }}>Recent Transactions</h3></div>
                  <div style={{ overflowX: 'auto', padding: '0 25px 25px 25px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '15px' }}>
                      <thead><tr style={{ borderBottom: `2px solid ${t.border}` }}><th style={{ padding: '15px', color: t.textMuted }}>Date</th><th style={{ padding: '15px', color: t.textMuted }}>Party</th><th style={{ padding: '15px', color: t.textMuted }}>Status</th><th style={{ padding: '15px', color: t.textMuted, textAlign: 'right' }}>Total</th><th style={{ padding: '15px', color: t.textMuted, textAlign: 'center' }}>Actions</th></tr></thead>
                      <tbody>
                        {transactions.length === 0 ? (<tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: t.textMuted }}>No transactions yet.</td></tr>) : (
                          transactions.map((tx) => (
                            <tr key={tx.transaction_id} style={{ borderBottom: `1px solid ${t.border}` }}>
                              <td style={{ padding: '15px', color: t.text }}>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                              <td style={{ padding: '15px', fontWeight: '500', color: t.text }}>{tx.party_name || "Cash"}</td>
                              <td style={{ padding: '15px' }}><span style={{ backgroundColor: tx.status === 'Settled' ? `${t.success}20` : `${t.danger}20`, color: tx.status === 'Settled' ? t.success : t.danger, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{tx.status || 'Settled'}</span></td>
                              <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: t.text }}>₹{tx.total_amount}</td>
                              <td style={{ padding: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {tx.receipt_details ? (<>
                                  <button onClick={() => loadBillForEdit(tx)} style={{ background: 'none', border: `1px solid ${t.primary}`, borderRadius: '6px', color: t.primary, cursor: 'pointer', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '12px' }}><Pencil size={14}/> Edit</button>
                                  <button onClick={() => handleReprint(tx.receipt_details)} style={{ background: t.primary, border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '12px' }}><Download size={14}/> Print</button>
                                </>) : (<span style={{ fontSize: '12px', color: t.textMuted }}>Old Bill</span>)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && !isExpired && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
              {!profile.gst_number && <div style={{ backgroundColor: `${t.danger}20`, color: t.danger, padding: '15px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', textAlign: 'center' }}>⚠️ Warning: You have not set your GST Number. Go to Shop Settings to add it!</div>}
              
              <form onSubmit={processBill} style={cardStyle}>
                <div style={{ position: 'absolute', top: '25px', right: '30px', backgroundColor: `${t.success}15`, color: t.success, border: `1px solid ${t.success}50`, padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>Live Margin: ₹{currentMargin.toFixed(2)}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}><ShoppingCart color={t.primary} size={28}/>
                  <h2 style={{ margin: 0, color: t.text }}>{editBillId ? `Editing Bill (INV-${editBillId})` : "Checkout Terminal"}</h2>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div><label style={labelStyle}>Transaction Type</label><select value={transType} onChange={(e) => setTransType(e.target.value)} className="soft-input" style={{ ...inputStyle, fontWeight: 'bold', color: transType === 'SELL' ? t.success : t.danger }}><option value="SELL">SELL (Customer)</option><option value="PURCH">PURCHASE (Wholesaler)</option></select></div>
                  <div><label style={labelStyle}>{transType === 'SELL' ? "Customer Name" : "Wholesaler Name"}</label><input type="text" required={billStatus === 'Unsettled'} value={partyName} onChange={(e) => setPartyName(e.target.value)} placeholder="Name (Req for Khata)" className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>{transType === 'SELL' ? "Customer GSTIN" : "Wholesaler GSTIN"} (Optional)</label><input type="text" value={partyGst} onChange={(e) => setPartyGst(e.target.value)} placeholder="GST Number" className="soft-input" style={inputStyle} /></div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', padding: '15px', backgroundColor: t.bg, borderRadius: '12px', border: `1px dashed ${t.border}` }}>
                   <div style={{ flex: 1 }}>
                     <label style={labelStyle}>{transType === 'SELL' ? "Payment from Customer" : "Payment to Wholesaler"}</label>
                     <select value={billStatus} onChange={(e) => setBillStatus(e.target.value)} className="soft-input" style={{ ...inputStyle, fontWeight: 'bold', color: billStatus === 'Settled' ? t.success : t.danger }}>
                       <option value="Settled">Settled (Paid)</option>
                       <option value="Unsettled">{transType === 'SELL' ? "Unsettled (Khata / To Receive)" : "Unsettled (Due / To Pay)"}</option>
                     </select>
                   </div>
                   {billStatus === 'Unsettled' && (
                     <div style={{ flex: 1 }}>
                       <label style={labelStyle}>Promised Settlement Date (Optional)</label>
                       <input type="date" value={settlementDate} onChange={(e) => setSettlementDate(e.target.value)} className="soft-input" style={inputStyle} />
                     </div>
                   )}
                </div>

                <div style={{ position: 'relative', marginBottom: '30px', zIndex: 1000 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}><label style={labelStyle}>Search & Add Material to Cart</label><div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: t.textMuted }}><span>Keyboard:</span><select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ background: 'transparent', border: 'none', color: t.primary, fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}><option value="en">English</option><option value="gu">Gujarati</option></select></div></div>
                  <div style={{ position: 'relative' }}><Search color={t.textMuted} size={20} style={{ position: 'absolute', left: '12px', top: '16px', zIndex: 10 }} /><ReactTransliterate value={searchQuery} onChangeText={(text) => { setSearchQuery(text); setIsSearchOpen(true); }} lang={language} renderComponent={(props) => (<input {...props} placeholder="Type name to search..." className="soft-input" style={{ ...inputStyle, paddingLeft: '40px', marginTop: 0 }} onFocus={() => setIsSearchOpen(true)} />)} /></div>
                  {isSearchOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', marginTop: '8px', maxHeight: '300px', overflowY: 'auto', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', zIndex: 990 }}>
                      {filteredInventory.length === 0 ? (<div style={{ padding: '15px', color: t.textMuted, textAlign: 'center' }}>No materials found.</div>) : (filteredInventory.map((item) => (
                        <div key={item.product_id} onClick={() => handleAddToCart(item)} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: t.text }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${t.primary}15`} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <div><span style={{ fontWeight: '600' }}>{item.name_english}</span><span style={{ color: t.textMuted, marginLeft: '8px', fontSize: '14px' }}>{item.name_regional}</span></div>
                          <div style={{ display: 'flex', gap: '10px' }}><span style={{ backgroundColor: `${t.primary}20`, color: t.primary, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>₹{item.item_rate}</span><span style={{ backgroundColor: item.current_stock <= item.min_stock_alert ? `${t.danger}20` : `${t.success}20`, color: item.current_stock <= item.min_stock_alert ? t.danger : t.success, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Stock: {item.current_stock}</span></div>
                        </div>
                      )))}
                    </div>
                  )}
                </div>
                
                <div style={{ border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '30px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: `${t.primary}05` }}><tr><th style={{ padding: '12px', color: t.textMuted, fontSize: '13px' }}>Item</th><th style={{ padding: '12px', color: t.textMuted, fontSize: '13px', width: '130px' }}>Rate (₹)</th><th style={{ padding: '12px', color: t.textMuted, fontSize: '13px', width: '100px' }}>Qty</th><th style={{ padding: '12px', color: t.textMuted, fontSize: '13px', textAlign: 'right', width: '120px' }}>Amount</th><th style={{ padding: '12px', width: '50px' }}></th></tr></thead>
                    <tbody>
                      {cart.length === 0 ? (<tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: t.textMuted }}>Cart is empty. Search above to add items.</td></tr>) : (
                        cart.map((item) => (
                          <tr key={item.product_id} style={{ borderTop: `1px solid ${t.border}`, color: t.text }}>
                            <td style={{ padding: '12px', fontWeight: '500' }}>{item.name_english}</td>
                            <td style={{ padding: '12px' }}><input type="number" step="0.01" value={item.rate} onChange={(e) => updateCartRate(item.product_id, e.target.value)} className="soft-input" style={{ ...inputStyle, marginTop: 0, padding: '6px' }} /></td>
                            <td style={{ padding: '12px' }}><input type="number" min="1" value={item.qty} onChange={(e) => updateCartQty(item.product_id, e.target.value)} className="soft-input" style={{ ...inputStyle, marginTop: 0, padding: '6px' }} /></td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>₹{(item.rate * item.qty).toFixed(2)}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}><button type="button" onClick={() => removeCartItem(item.product_id)} style={{ background: 'none', border: 'none', color: t.danger, cursor: 'pointer' }}><X size={18} /></button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', padding: '15px', backgroundColor: t.bg, borderRadius: '12px', border: `1px dashed ${t.border}` }}>
                  <div style={{ flex: 1 }}><label style={labelStyle}>Apply Overall Discount (Optional)</label><input type="number" step="0.01" value={discountVal} onChange={(e) => setDiscountVal(e.target.value)} placeholder="0" className="soft-input" style={inputStyle} /></div>
                  <div style={{ display: 'flex', gap: '5px', marginTop: '22px' }}><button type="button" onClick={() => setDiscountType('percent')} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${discountType === 'percent' ? t.primary : t.border}`, backgroundColor: discountType === 'percent' ? `${t.primary}20` : t.card, color: discountType === 'percent' ? t.primary : t.textMuted }}><Percent size={18} /></button><button type="button" onClick={() => setDiscountType('flat')} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${discountType === 'flat' ? t.primary : t.border}`, backgroundColor: discountType === 'flat' ? `${t.primary}20` : t.card, color: discountType === 'flat' ? t.primary : t.textMuted }}><IndianRupee size={18} /></button></div>
                </div>
                <div style={{ backgroundColor: `${t.primary}10`, padding: '20px', borderRadius: '16px', textAlign: 'right', marginBottom: '20px' }}>
                   {finalDiscount > 0 && <div style={{ fontSize: '14px', color: t.danger, marginBottom: '5px' }}>Discount Applied: -₹{finalDiscount.toFixed(2)}</div>}
                  <span style={{ fontSize: '14px', color: t.textMuted }}>{transType === 'SELL' ? "Final Amount Payable" : "Total Amount to Pay"} (GST Inc.)</span>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: t.primary }}>₹{finalTotalAmount.toFixed(2)}</div>
                  <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '5px' }}>(Gross: ₹{grossTotal.toFixed(2)} | Taxable: ₹{totalTaxable.toFixed(2)} | CGST: ₹{halfGst.toFixed(2)} | SGST: ₹{halfGst.toFixed(2)})</div>
                </div>
                <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}><Printer size={20}/> {editBillId ? "Save Changes & Re-Print" : "Generate Multi-Item Invoice"}</button>
                {editBillId && (
                  <button type="button" onClick={() => { setEditBillId(null); setCart([]); setPartyName(""); setDiscountVal(""); setBillStatus("Settled"); setSettlementDate(""); }} style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'transparent', border: `1px solid ${t.textMuted}`, borderRadius: '12px', color: t.textMuted, cursor: 'pointer', fontWeight: 'bold' }}>Cancel Editing</button>
                )}
              </form>
            </div>
          )}

          {activeTab === "list" && !isExpired && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ ...cardStyle, padding: '0' }}>
                <div style={{ padding: '30px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 style={{ margin: 0, color: t.text, display: 'flex', alignItems: 'center', gap: '10px' }}><PackageSearch color={t.primary}/> Inventory Management</h3><button onClick={() => setActiveTab("add")} style={{ padding: '10px 20px', backgroundColor: `${t.primary}15`, color: t.primary, borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>+ Add New Item</button></div>
                <div style={{ overflowX: 'auto', padding: '0 30px 30px 30px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
                    <thead><tr style={{ borderBottom: `2px solid ${t.border}` }}><th style={{ padding: '15px', color: t.textMuted }}>Material (HSN Sorted)</th><th style={{ padding: '15px', color: t.textMuted }}>HSN</th><th style={{ padding: '15px', color: t.textMuted }}>Purch. (₹)</th><th style={{ padding: '15px', color: t.textMuted }}>Sell Rate (₹)</th><th style={{ padding: '15px', color: t.textMuted }}>Stock</th><th style={{ padding: '15px', color: t.textMuted }}>Alert</th><th style={{ padding: '15px', color: t.textMuted, textAlign: 'right' }}>Actions</th></tr></thead>
                    <tbody>
                      {filteredInventory.map((item) => (
                        <tr key={item.product_id} style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: item.current_stock <= item.min_stock_alert ? `${t.danger}05` : 'transparent', color: t.text }}>
                          {editingId === item.product_id ? (
                            <>
                              <td style={{ padding: '10px' }}><div style={{display:'flex', gap:'8px', flexDirection:'column'}}><input type="text" value={editData.name_english} onChange={(e) => setEditData({...editData, name_english: e.target.value})} className="soft-input" style={{...inputStyle, padding:'8px', margin:0}} /><input type="text" value={editData.name_regional} onChange={(e) => setEditData({...editData, name_regional: e.target.value})} className="soft-input" style={{...inputStyle, padding:'8px', margin:0}} /></div></td>
                              <td style={{ padding: '10px' }}><input type="text" value={editData.hsn_code} onChange={(e) => setEditData({...editData, hsn_code: e.target.value})} className="soft-input" style={{...inputStyle, padding:'8px', width:'80px', margin:0}} /></td>
                              <td style={{ padding: '10px' }}><input type="number" step="0.01" value={editData.purchase_price} onChange={(e) => setEditData({...editData, purchase_price: e.target.value})} className="soft-input" style={{...inputStyle, padding:'8px', width:'80px', margin:0}} /></td>
                              <td style={{ padding: '10px' }}><input type="number" step="0.01" value={editData.item_rate} onChange={(e) => setEditData({...editData, item_rate: e.target.value})} className="soft-input" style={{...inputStyle, padding:'8px', width:'80px', margin:0}} /></td>
                              <td style={{ padding: '10px' }}><input type="number" value={editData.current_stock} onChange={(e) => setEditData({...editData, current_stock: e.target.value})} className="soft-input" style={{...inputStyle, padding:'8px', width:'60px', margin:0}} /></td>
                              <td style={{ padding: '10px' }}><input type="number" value={editData.min_stock_alert} onChange={(e) => setEditData({...editData, min_stock_alert: e.target.value})} className="soft-input" style={{...inputStyle, padding:'8px', width:'60px', margin:0}} /></td>
                              <td style={{ padding: '10px', textAlign: 'right' }}><button onClick={() => saveEdit(item.product_id)} style={{ padding: '8px 12px', backgroundColor: t.success, color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', marginRight: '8px' }}>Save</button><button onClick={() => setEditingId(null)} style={{ padding: '8px 12px', backgroundColor: t.textMuted, color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Cancel</button></td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: '15px' }}><div style={{ fontWeight: '600' }}>{item.name_english}</div><div style={{ color: t.textMuted, fontSize: '14px' }}>{item.name_regional}</div></td>
                              <td style={{ padding: '15px', color: t.textMuted, fontWeight: 'bold' }}>{item.hsn_code || "-"}</td>
                              <td style={{ padding: '15px', fontWeight: 'bold', color: t.textMuted }}>₹{item.purchase_price}</td>
                              <td style={{ padding: '15px', fontWeight: 'bold' }}>₹{item.item_rate}</td>
                              <td style={{ padding: '15px' }}><span style={{ padding: '6px 12px', backgroundColor: item.current_stock <= item.min_stock_alert ? `${t.danger}20` : `${t.success}20`, color: item.current_stock <= item.min_stock_alert ? t.danger : t.success, borderRadius: '20px', fontWeight: 'bold' }}>{item.current_stock}</span></td>
                              <td style={{ padding: '15px', color: t.textMuted }}>{item.min_stock_alert}</td>
                              <td style={{ padding: '15px', textAlign: 'right' }}><button onClick={() => {setEditingId(item.product_id); setEditData(item);}} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: '5px' }}><Edit3 size={18} /></button><button onClick={() => deleteMaterial(item.product_id)} style={{ background: 'none', border: 'none', color: t.danger, cursor: 'pointer', padding: '5px', marginLeft: '5px' }}><Trash2 size={18} /></button></td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "add" && !isExpired && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              <form onSubmit={saveToVault} style={cardStyle}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}><PlusCircle color={t.primary} size={28}/><h2 style={{ margin: 0, color: t.text }}>New Material</h2></div>
                 <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Keyboard Mode</label> <select value={language} onChange={(e) => setLanguage(e.target.value)} className="soft-input" style={inputStyle}><option value="en">English (Standard)</option><option value="gu">Gujarati (Phonetic Magic)</option></select></div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                   <div><label style={labelStyle}>Material Name (English)</label> <input type="text" required value={englishName} onChange={(e) => setEnglishName(e.target.value)} className="soft-input" style={inputStyle} /></div>
                   <div><label style={labelStyle}>Regional Name (Gujarati)</label> <ReactTransliterate value={regionalName} onChangeText={setRegionalName} lang={language} renderComponent={(props) => <input {...props} className="soft-input" style={inputStyle} />} /></div>
                 </div>
                 
                 <h3 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}>Pricing & Taxation</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                   <div><label style={labelStyle}>Purchase Price (₹)</label> <input type="number" step="0.01" required value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="Cost" className="soft-input" style={inputStyle} /></div>
                   <div><label style={labelStyle}>Default Sell Rate (₹)</label> <input type="number" step="0.01" required value={itemRate} onChange={(e) => setItemRate(e.target.value)} placeholder="Sale" className="soft-input" style={inputStyle} /></div>
                   <div><label style={labelStyle}>Rate Includes GST?</label><select value={isGstInclusive} onChange={(e) => setIsGstInclusive(e.target.value === 'true')} className="soft-input" style={inputStyle}><option value={'true'}>Yes (Inclusive)</option><option value={'false'}>No (Exclusive)</option></select></div>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div><label style={labelStyle}>GST / Tax (%)</label><input type="number" step="0.01" required value={gst} onChange={(e) => setGst(e.target.value)} className="soft-input" style={inputStyle} /></div>
                    <div><label style={labelStyle}>HSN / SAC Code</label> <input type="text" required value={hsnCode} onChange={(e) => setHsnCode(e.target.value)} className="soft-input" style={inputStyle} /></div>
                 </div>

                 <h3 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '10px', marginBottom: '20px', marginTop: '10px' }}>Stock Control</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div><label style={labelStyle}>Initial Stock</label><input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="soft-input" style={inputStyle} /></div>
                    <div><label style={labelStyle}>Alert Below</label><input type="number" required value={minAlert} onChange={(e) => setMinAlert(e.target.value)} className="soft-input" style={inputStyle} /></div>
                 </div>
                 <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}>Save to Vault</button>
              </form>
            </div>
          )}
        </div>

        {/* --- BRANDING FOOTER --- */}
        <div style={{ marginTop: '40px', textAlign: 'center', color: t.textMuted, fontSize: '13px', fontWeight: '600' }}>
          ©Developed by Lakshyadeepsinh Chauhan
        </div>
      </div>

      {receiptData && (
        <div className="print-only" style={{ color: 'black', fontFamily: 'Arial, sans-serif' }}>
          {printChunks.map((chunk, index) => (
            <div key={index} className="page-break">
              <div style={{ border: '1px solid black', padding: '10px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid black' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', fontWeight: 'bold' }}><span>ORIGINAL</span><span>Page {index + 1} of {printChunks.length}</span></div>
                  {receiptData.logo && <img src={receiptData.logo} alt="Logo" style={{ maxHeight: '60px', marginTop: '5px' }} />}
                  <h1 style={{ margin: '5px 0', fontSize: '18pt', textTransform: 'uppercase' }}>{receiptData.shopName}</h1>
                  <p style={{ margin: '2px 0', fontSize: '10pt' }}>{receiptData.address}</p>
                  <p style={{ margin: '2px 0', fontSize: '10pt' }}>MO - {receiptData.phone}</p>
                  <p style={{ margin: '2px 0', fontSize: '10pt', fontWeight: 'bold' }}>GSTIN: {receiptData.gstNum || "N/A"}</p>
                </div>
                <div style={{ display: 'flex', fontSize: '10pt', borderBottom: '1px solid black', paddingBottom: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1, paddingRight: '10px', borderRight: '1px solid black' }}><p style={{ margin: '2px 0', fontWeight: 'bold' }}>BUYER: {receiptData.partyName}</p><p style={{ margin: '2px 0', fontWeight: 'bold' }}>GSTIN: {receiptData.partyGst || ""}</p><p style={{ margin: '2px 0', fontWeight: 'bold' }}>STATE/CODE: 24- GUJARAT</p></div>
                  <div style={{ flex: 1, paddingLeft: '10px' }}><p style={{ margin: '2px 0', fontWeight: 'bold' }}>INVOICE NO: {receiptData.invoiceNo || "N/A"}</p><p style={{ margin: '2px 0', fontWeight: 'bold' }}>DATE: {receiptData.date}</p></div>
                </div>
                <div style={{ flex: 1 }}>
                  <table className="pdf-table" style={{ margin: 0, border: 'none' }}>
                    <thead style={{ borderBottom: '1px solid black' }}><tr><th style={{ width: '8%', borderTop: 'none' }}>SR. NO</th><th style={{ width: '42%', borderTop: 'none' }}>DESCRIPTION OF ITEM</th><th style={{ width: '15%', borderTop: 'none' }}>HSN/SAC</th><th style={{ width: '10%', borderTop: 'none' }}>QTY</th><th style={{ width: '10%', borderTop: 'none' }}>RATE</th><th style={{ width: '15%', borderTop: 'none' }}>AMOUNT</th></tr></thead>
                    <tbody style={{ verticalAlign: 'top' }}>
                      {chunk.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          <td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{(index * 35) + itemIndex + 1}</td><td style={{ borderBottom: 'none', borderTop: 'none' }}>{item.name}</td><td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{item.hsn || "-"}</td><td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{item.qty}</td><td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{item.rate.toFixed(2)}</td><td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr style={{ height: '100%' }}><td style={{ borderTop: 'none', borderBottom: 'none' }}></td><td style={{ borderTop: 'none', borderBottom: 'none' }}></td><td style={{ borderTop: 'none', borderBottom: 'none' }}></td><td style={{ borderTop: 'none', borderBottom: 'none' }}></td><td style={{ borderTop: 'none', borderBottom: 'none' }}></td><td style={{ borderTop: 'none', borderBottom: 'none' }}></td></tr>
                    </tbody>
                  </table>
                </div>
                {index === printChunks.length - 1 && (
                  <div className="avoid-break" style={{ display: 'flex', borderTop: '1px solid black', fontSize: '10pt', marginTop: 'auto' }}>
                    <div style={{ flex: '60%', padding: '10px', borderRight: '1px solid black' }}>
                      <h4 style={{ margin: '0 0 5px 0', textDecoration: 'underline' }}>BANK DETAILS:-</h4>
                      <p style={{ margin: '2px 0', fontWeight: 'bold' }}>NAME: {receiptData.shopName}</p><p style={{ margin: '2px 0', fontWeight: 'bold' }}>A/C NO: {receiptData.acc || ""}</p><p style={{ margin: '2px 0', fontWeight: 'bold' }}>IFSC: {receiptData.ifsc || ""}</p><p style={{ margin: '2px 0', fontWeight: 'bold' }}>BANK: {receiptData.bank || ""}</p>
                      <div style={{ marginTop: '30px', fontWeight: 'bold' }}>FOR. {receiptData.shopName.toUpperCase()}</div>
                    </div>
                    <div style={{ flex: '40%' }}>
                      <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>TOTAL AMOUNT IN RS.</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>{receiptData.grossAmount.toFixed(2)}</div></div>
                      {receiptData.discount > 0 && <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>DISCOUNT</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>-{receiptData.discount.toFixed(2)}</div></div>}
                      <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>TAXABLE AMOUNT IN RS.</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>{receiptData.taxable.toFixed(2)}</div></div>
                      <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>CGST</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>{receiptData.cgst.toFixed(2)}</div></div>
                      <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>SGST</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>{receiptData.sgst.toFixed(2)}</div></div>
                      <div style={{ display: 'flex' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold', fontSize: '11pt' }}>GRAND TOTAL IN RS.</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right', fontWeight: 'bold', fontSize: '11pt' }}>{receiptData.finalTotal.toFixed(2)}</div></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RAGE-CLICK SHIELD */}
      {isLoading && (
        <div className="glass-overlay">
          <span className="loader"></span>
          <div>Processing Task... Please Wait</div>
        </div>
      )}

    </div>
  );
}

export default App;
