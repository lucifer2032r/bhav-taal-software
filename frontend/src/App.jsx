import { useState, useEffect } from 'react';
import axios from 'axios';
import { ReactTransliterate } from 'react-transliterate';
import "react-transliterate/dist/index.css";
import { LayoutDashboard, ShoppingCart, PackageSearch, PlusCircle, LogOut, Menu, Moon, Sun, ChevronLeft, Edit3, Trash2, Printer, Search, Download, Settings, Image as ImageIcon, Percent, IndianRupee, X, AlertTriangle, Receipt, Box, Clock, CreditCard, CheckCircle2, Lock, Pencil, FileText, ArrowDownRight, ArrowUpRight, Globe, Eye, EyeOff, Mail, ShieldAlert, KeyRound, ToggleLeft, ToggleRight, QrCode } from 'lucide-react';

// ==========================================
// 🚀 CLOUD CONNECTION & RAZORPAY FRONTEND
// ==========================================
const API_URL = "https://bhav-taal-software.onrender.com"; 
const RAZORPAY_KEY_ID = "rzp_test_T13wSE9FIt2rjT"; 

// ==========================================
// 🌐 TRANSLATION DICTIONARY
// ==========================================
const translations = {
  en: {
    login_title: "Secure License Gateway", reg_title: "Create a New Business", biz_name: "Business Name", user: "Username", pass: "Password", conf_pass: "Confirm Password", btn_trial: "Start 7-Day Free Trial", btn_auth: "Authenticate User", switch_login: "Already have an account? Log In", switch_reg: "Don't have an account? Sign Up", dev: "©Developed by Lakshyadeepsinh Chauhan", auth_wait: "Authenticating...", license_exp: "License Expired", nav_dash: "Dashboard", nav_pos: "Point of Sale", nav_inv: "Inventory", nav_add: "Add Material", nav_shop: "Shop Settings", valid_until: "License Valid Until", upgrade_plan: "Upgrade Plan", alert_due: "Alert: You have {count} Party Payments that are DUE TODAY or OVERDUE!", system_online: "System Online", quick_act: "Quick Action", manage_inv: "Manage Inventory", bills_today: "Bills Today", tot_mat: "Total Materials", to_recv: "To Receive (Khata)", to_pay: "To Pay (Payables)", stock_alerts: "Stock Alerts", all_opt: "All optimal!", left: "Left", alert_at: "Alert at", unsettled_bills: "Unsettled Bills", no_pending: "No pending payments!", due: "Due", recent_tx: "Recent Transactions", date: "Date", party: "Party", status: "Status", total: "Total", actions: "Actions", no_tx: "No transactions yet.", edit: "Edit", print: "Print", old_bill: "Old Bill", warning_gst: "⚠️ Warning: You have not set your GST Number.", live_margin: "Live Margin", checkout: "Checkout Terminal", editing_bill: "Editing Bill", tx_type: "Transaction Type", sell: "SELL (Customer)", purch: "PURCHASE (Wholesaler)", cust_name: "Customer Name", wholesaler_name: "Wholesaler Name", cust_gst: "Customer GSTIN (Optional)", whole_gst: "Wholesaler GSTIN (Optional)", pay_from_cust: "Payment from Customer", pay_to_whole: "Payment to Wholesaler", settled: "Settled (Paid)", unsettled_recv: "Unsettled (Khata / To Receive)", unsettled_pay: "Unsettled (Due / To Pay)", promised_date: "Promised Settlement Date (Optional)", search_add: "Search & Add Material to Cart", kb_mode: "Keyboard", item: "Item", rate: "Rate (₹)", qty: "Qty", amount: "Amount", cart_empty: "Cart is empty.", discount: "Apply Overall Discount (Optional)", final_pay: "Final Amount Payable", tot_pay: "Total Amount to Pay", gst_inc: "(GST Inc.)", gross: "Gross", taxable: "Taxable", btn_save_print: "Save Changes & Re-Print", btn_gen_inv: "Generate Multi-Item Invoice", cancel_edit: "Cancel Editing", inv_mgmt: "Inventory Management", btn_add_new: "+ Add New Item", mat_hsn: "Material (HSN Sorted)", purch_rs: "Purch. (₹)", sell_rs: "Sell Rate (₹)", stock: "Stock", alert: "Alert", btn_save: "Save", btn_cancel: "Cancel", new_mat: "New Material", kb_en: "English (Standard)", kb_gu: "Gujarati (Phonetic Magic)", mat_en: "Material Name (English)", mat_gu: "Regional Name (Gujarati)", pricing: "Pricing & Taxation", rate_inc_gst: "Rate Includes GST?", yes_inc: "Yes (Inclusive)", no_exc: "No (Exclusive)", gst_pct: "GST / Tax (%)", hsn_code: "HSN / SAC Code", stock_ctrl: "Stock Control", init_stock: "Initial Stock", alert_below: "Alert Below", btn_vault: "Save to Vault", biz_prof: "Business Profile Setup", biz_logo: "Business Logo (Optional)", upi_qr: "UPI QR Code (Optional)", gen_info: "General Information", gst_comp: "GST Number (Optional)", owner_name: "Owner Name", address: "Address", contact: "Contact Number", email: "Email Address", bank_details: "Bank Details (Printed on Bill)", bank_name: "Bank Name", ac_no: "A/C Number", ifsc: "IFSC Code", biz_cat: "Business Category", btn_save_prof: "Save Business Profile", choose_plan: "Choose Your License Plan", sub_subtitle: "Secure, full-stack POS and Inventory management for your business.", monthly: "Monthly Plan", half_yearly: "Half-Yearly", yearly: "Yearly Plan", most_pop: "MOST POPULAR", sub_month: "Subscribe Monthly", sub_6mo: "Subscribe for 6 Months", sub_yr: "Subscribe Yearly", secured_by: "Payments secured by Razorpay", processing: "Processing Task... Please Wait", email_req: "Email Address", phone_req: "Phone Number", get_otp: "Get OTP to Register", enter_otp: "Enter 6-Digit OTP", verify_reg: "Verify OTP & Start Trial", forgot_pass: "Forgot Password?", forgot_title: "Account Recovery", send_recovery: "Send Recovery OTP", verify_recovery: "Verify OTP", opt_reveal: "Reveal Password", opt_reset: "Create New Password", new_pass: "New Password", update_pass: "Update Password", back_login: "Back to Login", pass_hide: "Password hiding in", your_pass: "Your password is:"
  },
  gu: {
    login_title: "સુરક્ષિત લાયસન્સ ગેટવે", reg_title: "નવો વ્યાપાર બનાવો", biz_name: "વ્યાપારનું નામ", user: "યુઝરનેમ", pass: "પાસવર્ડ", conf_pass: "પાસવર્ડ કન્ફર્મ કરો", btn_trial: "7-દિવસની ફ્રી ટ્રાયલ શરૂ કરો", btn_auth: "લોગિન કરો", switch_login: "પહેલેથી એકાઉન્ટ છે? લોગિન કરો", switch_reg: "એકાઉન્ટ નથી? નવું બનાવો", dev: "©લક્ષ્યદીપસિંહ ચૌહાણ દ્વારા નિર્મિત", auth_wait: "પ્રમાણિત કરી રહ્યા છીએ...", license_exp: "લાયસન્સ સમાપ્ત", nav_dash: "ડેશબોર્ડ", nav_pos: "પોઇન્ટ ઓફ સેલ (બિલિંગ)", nav_inv: "ઇન્વેન્ટરી (સ્ટોક)", nav_add: "નવો માલ ઉમેરો", nav_shop: "દુકાન સેટિંગ્સ", valid_until: "લાયસન્સની માન્યતા", upgrade_plan: "પ્લાન અપગ્રેડ કરો", alert_due: "એલર્ટ: તમારી પાસે {count} પાર્ટીના પેમેન્ટ આજે બાકી છે!", system_online: "સિસ્ટમ ઓનલાઇન", quick_act: "ઝડપી ક્રિયા", manage_inv: "ઇન્વેન્ટરી મેનેજ કરો", bills_today: "આજના બિલ", tot_mat: "કુલ માલ", to_recv: "લેવાના બાકી (ખાતા)", to_pay: "ચૂકવવાના બાકી", stock_alerts: "સ્ટોક એલર્ટ્સ", all_opt: "બધું બરાબર છે!", left: "બાકી", alert_at: "એલર્ટ:", unsettled_bills: "બાકી બિલ", no_pending: "કોઈ બાકી ચૂકવણી નથી!", due: "બાકી:", recent_tx: "તાજેતરના વ્યવહારો", date: "તારીખ", party: "પાર્ટી", status: "સ્થિતિ", total: "કુલ", actions: "ક્રિયાઓ", no_tx: "કોઈ વ્યવહારો નથી.", edit: "એડિટ", print: "પ્રિન્ટ", old_bill: "જૂનું બિલ", warning_gst: "⚠️ ચેતવણી: તમે તમારો GST નંબર સેટ કર્યો નથી.", live_margin: "લાઇવ માર્જિન", checkout: "બિલિંગ ટર્મિનલ", editing_bill: "બિલ એડિટ થઈ રહ્યું છે", tx_type: "વ્યવહારનો પ્રકાર", sell: "વેચાણ (ગ્રાહકને)", purch: "ખરીદી (વેપારી પાસેથી)", cust_name: "ગ્રાહકનું નામ", wholesaler_name: "વેપારીનું નામ", cust_gst: "ગ્રાહકનો GSTIN (વૈકલ્પિક)", whole_gst: "વેપારીનો GSTIN (વૈકલ્પિક)", pay_from_cust: "ગ્રાહક તરફથી ચૂકવણી", pay_to_whole: "વેપારીને ચૂકવણી", settled: "ચૂકવેલ (જમા)", unsettled_recv: "બાકી (લેવાના)", unsettled_pay: "બાકી (ચૂકવવાના)", promised_date: "ચૂકવણીની તારીખ (વૈકલ્પિક)", search_add: "માલ શોધો અને બિલમાં ઉમેરો", kb_mode: "કીબોર્ડ", item: "વસ્તુ", rate: "ભાવ (₹)", qty: "જથ્થો", amount: "રકમ", cart_empty: "કાર્ટ ખાલી છે.", discount: "કુલ ડિસ્કાઉન્ટ (વૈકલ્પિક)", final_pay: "ચૂકવવાપાત્ર અંતિમ રકમ", tot_pay: "કુલ ચૂકવવાની રકમ", gst_inc: "(GST સાથે)", gross: "કુલ", taxable: "કરપાત્ર", btn_save_print: "સાચવો અને પ્રિન્ટ કરો", btn_gen_inv: "બિલ બનાવો", cancel_edit: "એડિટિંગ રદ કરો", inv_mgmt: "ઇન્વેન્ટરી મેનેજમેન્ટ", btn_add_new: "+ નવી વસ્તુ ઉમેરો", mat_hsn: "વસ્તુ (HSN પ્રમાણે)", purch_rs: "ખરીદ કિંમત (₹)", sell_rs: "વેચાણ કિંમત (₹)", stock: "સ્ટોક", alert: "એલર્ટ", btn_save: "સાચવો", btn_cancel: "રદ કરો", new_mat: "નવી વસ્તુ", kb_en: "અંગ્રેજી (સામાન્ય)", kb_gu: "ગુજરાતી (ફોનેટિક)", mat_en: "વસ્તુનું નામ (અંગ્રેજી)", mat_gu: "વસ્તુનું નામ (ગુજરાતી)", pricing: "કિંમત અને ટેક્સ", rate_inc_gst: "શું ભાવમાં GST શામેલ છે?", yes_inc: "હા (શામેલ છે)", no_exc: "ના (શામેલ નથી)", gst_pct: "GST / ટેક્સ (%)", hsn_code: "HSN / SAC કોડ", stock_ctrl: "સ્ટોક કંટ્રોલ", init_stock: "શરૂઆતનો સ્ટોક", alert_below: "સ્ટોક એલર્ટ", btn_vault: "સાચવો", biz_prof: "વ્યાપાર પ્રોફાઇલ સેટઅપ", biz_logo: "વ્યાપારનો લોગો (વૈકલ્પિક)", upi_qr: "UPI QR કોડ (વૈકલ્પિક)", gen_info: "સામાન્ય માહિતી", gst_comp: "GST નંબર (વૈકલ્પિક)", owner_name: "માલિકનું નામ", address: "સરનામું", contact: "સંપર્ક નંબર", email: "ઈમેલ આઈડી", bank_details: "બેંકની વિગતો (બિલ પર છાપવા માટે)", bank_name: "બેંકનું નામ", ac_no: "એકાઉન્ટ નંબર", ifsc: "IFSC કોડ", biz_cat: "વ્યાપારની શ્રેણી", btn_save_prof: "પ્રોફાઇલ સાચવો", choose_plan: "તમારો લાયસન્સ પ્લાન પસંદ કરો", sub_subtitle: "તમારા વ્યવસાય માટે સુરક્ષિત POS અને ઇન્વેન્ટરી મેનેજમેન્ટ.", monthly: "માસિક પ્લાન", half_yearly: "અર્ધ-વાર્ષિક", yearly: "વાર્ષિક પ્લાન", most_pop: "સૌથી લોકપ્રિય", sub_month: "માસિક સબ્સ્ક્રાઇબ કરો", sub_6mo: "6 મહિના માટે સબ્સ્ક્રાઇબ કરો", sub_yr: "વાર્ષિક સબ્સ્ક્રાઇબ કરો", secured_by: "Razorpay દ્વારા સુરક્ષિત", processing: "પ્રક્રિયા ચાલુ છે... કૃપા કરીને રાહ જુઓ", email_req: "ઈમેલ આઈડી", phone_req: "ફોન નંબર", get_otp: "OTP મેળવો", enter_otp: "6-અંકનો OTP દાખલ કરો", verify_reg: "ચકાસો અને નોંધણી કરો", forgot_pass: "પાસવર્ડ ભૂલી ગયા છો?", forgot_title: "એકાઉન્ટ પુનઃપ્રાપ્તિ", send_recovery: "OTP મોકલો", verify_recovery: "OTP ચકાસો", opt_reveal: "પાસવર્ડ બતાવો", opt_reset: "નવો પાસવર્ડ બનાવો", new_pass: "નવો પાસવર્ડ", update_pass: "પાસવર્ડ અપડેટ કરો", back_login: "લોગિન પર પાછા ફરો", pass_hide: "પાસવર્ડ છુપાઈ જશે", your_pass: "તમારો પાસવર્ડ છે:"
  }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); const [currentShopId, setCurrentShopId] = useState(null); 
  const [authMode, setAuthMode] = useState("login");
  const [authMessage, setAuthMessage] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [regShopName, setRegShopName] = useState(""); const [loginUser, setLoginUser] = useState(""); 
  const [regEmail, setRegEmail] = useState(""); const [regPhone, setRegPhone] = useState("");
  const [loginPass, setLoginPass] = useState(""); const [confirmPass, setConfirmPass] = useState(""); 
  const [regStep, setRegStep] = useState(1); 
  const [otpToken, setOtpToken] = useState("");
  
  const [forgotStep, setForgotStep] = useState(1); 
  const [revealedPass, setRevealedPass] = useState("");
  const [revealTimer, setRevealTimer] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState(false); const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [uiLang, setUiLang] = useState("en");
  const tText = (key) => translations[uiLang]?.[key] || translations['en'][key] || key;

  const [isLoading, setIsLoading] = useState(false);

  const [subEndDate, setSubEndDate] = useState(null); const [timeLeftStr, setTimeLeftStr] = useState(""); const [timeColor, setTimeColor] = useState(""); const [isExpired, setIsExpired] = useState(false);
  const [activeTab, setActiveTab] = useState("ledger");
  
  const [inventory, setInventory] = useState([]); const [transactions, setTransactions] = useState([]); const [message, setMessage] = useState("");
  
  // NEW STATE: Added upi_qr_url
  const [profile, setProfile] = useState({ shop_name: "", gst_number: "", logo_url: "", upi_qr_url: "", owner_name: "", address: "", category: "", email: "", contact_number: "", bank_name: "", account_no: "", ifsc_code: "" });
  const [categorySearch, setCategorySearch] = useState(""); const [isCatSearchOpen, setIsCatSearchOpen] = useState(false);

  const businessCategories = [ "Construction Materials Supply", "Hardware Store", "Cement Dealership", "Steel & TMT Bars", "Paints & Chemicals", "Electrical Fittings", "Plumbing & Sanitaryware", "Tiles & Ceramics", "Timber & Plywood", "Glass & Mirrors", "Furniture & Decor", "Electronics & Appliances", "Medical Pharmacy", "Other" ];

  const [englishName, setEnglishName] = useState(""); const [regionalName, setRegionalName] = useState(""); const [stock, setStock] = useState(""); const [minAlert, setMinAlert] = useState(""); const [gst, setGst] = useState("18"); const [hsnCode, setHsnCode] = useState(""); 
  const [itemRate, setItemRate] = useState(""); const [purchasePrice, setPurchasePrice] = useState(""); const [isGstInclusive, setIsGstInclusive] = useState(true); const [language, setLanguage] = useState("gu");
  
  const [cart, setCart] = useState([]); 
  const [partyName, setPartyName] = useState(""); const [partyGst, setPartyGst] = useState(""); const [transType, setTransType] = useState("SELL"); 
  const [billStatus, setBillStatus] = useState("Settled"); 
  const [settlementDate, setSettlementDate] = useState(""); 
  const [discountVal, setDiscountVal] = useState(""); const [discountType, setDiscountType] = useState("percent");
  const [searchQuery, setSearchQuery] = useState(""); const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isGstBill, setIsGstBill] = useState(true);

  const [editBillId, setEditBillId] = useState(null);
  const [editingId, setEditingId] = useState(null); const [editData, setEditData] = useState({ name_english: "", name_regional: "", current_stock: "", min_stock_alert: "", gst_rate: "", hsn_code: "", item_rate: "", purchase_price: "", is_gst_inclusive: true });

  const t = isDarkMode ? { bg: '#0f172a', sidebar: '#1e293b', card: '#1e293b', text: '#f8fafc', textMuted: '#94a3b8', border: '#334155', primary: '#818cf8', inputBg: '#0f172a', success: '#10b981', danger: '#ef4444', warning: '#f39c12' } : { bg: '#f1f5f9', sidebar: '#ffffff', card: '#ffffff', text: '#0f172a', textMuted: '#64748b', border: '#e2e8f0', primary: '#6366f1', inputBg: '#f8fafc', success: '#10b981', danger: '#ef4444', warning: '#f39c12' };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@800&display=swap');
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
    .loader { width: 48px; height: 48px; border: 5px solid #FFF; border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite; }
    @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .glass-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 99999; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 15px; color: white; font-weight: bold; letter-spacing: 1px; }
  `;

  const showMessage = (msg) => { setMessage(msg); setTimeout(() => setMessage(""), 4000); };

  useEffect(() => {
    if (revealTimer > 0) {
      const timerId = setTimeout(() => setRevealTimer(revealTimer - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (revealTimer === 0 && revealedPass !== "") {
      setRevealedPass(""); setAuthMode("login"); setAuthMessage("Session timed out for security.");
    }
  }, [revealTimer, revealedPass]);

  useEffect(() => {
    if (!subEndDate) return;
    const interval = setInterval(() => {
      const distance = new Date(subEndDate).getTime() - new Date().getTime();
      if (distance < 0) { setTimeLeftStr("EXPIRED"); setTimeColor(t.danger); setIsExpired(true); setActiveTab("subscribe"); clearInterval(interval); return; }
      setIsExpired(false);
      const days = Math.floor(distance / (1000 * 60 * 60 * 24)); const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (days <= 7) { setTimeLeftStr(`${days}d ${hours}h ${minutes}m ${seconds}s`); if (days <= 1) setTimeColor(t.danger); else if (days <= 3) setTimeColor(t.warning); else setTimeColor(t.success); } 
      else { setTimeLeftStr(`Ends: ${new Date(subEndDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`); setTimeColor(t.textMuted); }
    }, 1000);
    return () => clearInterval(interval);
  }, [subEndDate, t]);

  const resetAuthStates = () => { setAuthMessage(""); setAuthSuccess(""); setRegStep(1); setForgotStep(1); setOtpToken(""); setRevealedPass(""); setRevealTimer(0); };

  const handleLogin = async (e) => {
    e.preventDefault(); setAuthMessage(""); setAuthSuccess(""); setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/login`, { username: loginUser, password: loginPass });
      if (res.data.success) { setIsLoggedIn(true); setCurrentShopId(res.data.shop_id); setSubEndDate(res.data.subscription_end); fetchProfile(res.data.shop_id); fetchInventory(res.data.shop_id); fetchTransactions(res.data.shop_id); setActiveTab("ledger"); }
    } catch (err) { setAuthMessage(err.response ? err.response.data.message : "❌ Invalid Credentials."); }
    setIsLoading(false);
  };

  const handleRegisterRequestOtp = async (e) => {
    e.preventDefault(); setAuthMessage(""); setAuthSuccess(""); 
    if (loginPass !== confirmPass) return setAuthMessage("❌ Passwords do not match!");
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passRegex.test(loginPass)) return setAuthMessage("❌ Password must be 8+ chars, uppercase, lowercase, number, special char.");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/send-otp`, { email: regEmail, type: 'register' });
      if (res.data.success) { setRegStep(2); setAuthSuccess("✅ OTP sent to your email!"); }
    } catch (err) { setAuthMessage(err.response ? err.response.data.message : "❌ Failed to send OTP."); }
    setIsLoading(false);
  };

  const handleRegisterVerify = async (e) => {
    e.preventDefault(); setAuthMessage(""); setAuthSuccess(""); 
    if (otpToken.length < 6) return setAuthMessage("❌ Please enter all 6 digits.");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/register`, { shopName: regShopName, username: loginUser, password: loginPass, email: regEmail, phone: regPhone, otp: otpToken });
      if (res.data.success) { setIsLoggedIn(true); setCurrentShopId(res.data.shop_id); setSubEndDate(res.data.subscription_end); fetchProfile(res.data.shop_id); fetchInventory(res.data.shop_id); fetchTransactions(res.data.shop_id); setActiveTab("ledger"); }
    } catch (err) { setAuthMessage(err.response ? err.response.data.message : "❌ Registration failed."); }
    setIsLoading(false);
  };

  const handleForgotSendOtp = async (e) => {
    e.preventDefault(); setAuthMessage(""); setAuthSuccess(""); setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/send-otp`, { email: regEmail, type: 'forgot' });
      if (res.data.success) { setForgotStep(2); setAuthSuccess("✅ Recovery OTP sent to your email!"); }
    } catch (err) { setAuthMessage(err.response ? err.response.data.message : "❌ Failed to send OTP."); }
    setIsLoading(false);
  };

  const handleForgotVerifyOtp = async (e) => {
    e.preventDefault(); setAuthMessage(""); setAuthSuccess(""); 
    if (otpToken.length < 6) return setAuthMessage("❌ Please enter all 6 digits.");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/verify-forgot-otp`, { email: regEmail, otp: otpToken });
      if (res.data.success) { setForgotStep(3); setAuthSuccess("✅ OTP Verified! Choose an option below."); }
    } catch (err) { setAuthMessage(err.response ? err.response.data.message : "❌ Invalid OTP."); }
    setIsLoading(false);
  };

  const handleRevealPassword = async () => {
    setAuthMessage(""); setAuthSuccess(""); setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/reveal-password`, { email: regEmail, otp: otpToken });
      if (res.data.success) { setForgotStep(5); setRevealedPass(res.data.password); setRevealTimer(20); }
    } catch (err) { setAuthMessage("❌ Failed to reveal password."); }
    setIsLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); setAuthMessage(""); setAuthSuccess("");
    if (loginPass !== confirmPass) return setAuthMessage("❌ Passwords do not match!");
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/reset-password`, { email: regEmail, newPassword: loginPass, otp: otpToken });
      if (res.data.success) { setAuthMode("login"); resetAuthStates(); setLoginPass(""); setConfirmPass(""); setAuthSuccess("✅ Password updated successfully! Please log in."); }
    } catch (err) { setAuthMessage("❌ Failed to reset password."); }
    setIsLoading(false);
  };

  // ==========================================
  // 💳 RAZORPAY INTEGRATION LOGIC
  // ==========================================
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async (days, priceInRupees) => { 
    setIsLoading(true); 
    try { 
      const resLoad = await loadRazorpayScript();
      if (!resLoad) { showMessage("❌ Razorpay failed to load."); setIsLoading(false); return; }

      const orderRes = await axios.post(`${API_URL}/api/create-subscription-order`, { amount: priceInRupees, days });
      if (!orderRes.data.success) { showMessage("❌ Failed to initiate checkout."); setIsLoading(false); return; }

      const options = {
        key: RAZORPAY_KEY_ID, 
        amount: orderRes.data.amount, 
        currency: "INR",
        name: profile.shop_name || "Bhav-Taal Pro",
        description: `${days} Days License Extension`,
        image: profile.logo_url || "/bhav-taal_logo1.png",
        order_id: orderRes.data.order_id,
        handler: async function (response) {
          try {
            setIsLoading(true);
            const verifyRes = await axios.post(`${API_URL}/api/verify-subscription`, {
              shop_id: currentShopId, days: days,
              razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) { setSubEndDate(verifyRes.data.new_end); setIsExpired(false); setActiveTab("ledger"); showMessage("🎉 " + verifyRes.data.message); } 
            else { showMessage("❌ " + verifyRes.data.message); }
          } catch (verificationError) { showMessage("❌ Payment Verification Error."); } 
          finally { setIsLoading(false); }
        },
        prefill: {
          name: profile.owner_name || "Shop Owner", email: profile.email || "owner@example.com", contact: profile.contact_number || "9999999999"
        },
        theme: { color: "#6366f1" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on('payment.failed', function (response) { showMessage("❌ Payment Failed. Please try again."); });
    } catch (err) { showMessage("❌ Checkout error."); } 
    setIsLoading(false); 
  };
  
  // ==========================================
  // DASHBOARD HANDLERS
  // ==========================================
  const handleAddToCart = (product) => { const existing = cart.find(c => c.product_id === product.product_id); if (existing) setCart(cart.map(c => c.product_id === product.product_id ? { ...c, qty: c.qty + 1 } : c)); else setCart([...cart, { ...product, qty: 1, rate: parseFloat(product.item_rate) }]); setSearchQuery(""); setIsSearchOpen(false); };
  const updateCartQty = (id, newQty) => { if (newQty < 1) return; setCart(cart.map(c => c.product_id === id ? { ...c, qty: parseInt(newQty) } : c)); };
  const updateCartRate = (id, newRate) => { setCart(cart.map(c => c.product_id === id ? { ...c, rate: parseFloat(newRate) || 0 } : c)); };
  const removeCartItem = (id) => { setCart(cart.filter(c => c.product_id !== id)); };

  let grossTotal = 0; let totalTaxable = 0; let totalGst = 0; let totalPurchaseCost = 0;
  cart.forEach(item => { 
    const itemTotal = item.rate * item.qty; const ppTotal = (parseFloat(item.purchase_price) || 0) * item.qty; 
    const activeGstPercent = isGstBill ? (parseFloat(item.gst_rate) || 0) : 0; 
    let itemTaxable, itemGst; 
    if (item.is_gst_inclusive && isGstBill) { itemTaxable = itemTotal / (1 + (activeGstPercent / 100)); itemGst = itemTotal - itemTaxable; } else { itemTaxable = itemTotal; itemGst = itemTaxable * (activeGstPercent / 100); } 
    grossTotal += (item.is_gst_inclusive && isGstBill ? itemTotal : (itemTaxable + itemGst)); totalTaxable += itemTaxable; totalGst += itemGst; totalPurchaseCost += ppTotal; 
  });
  let finalDiscount = 0; if (discountVal && parseFloat(discountVal) > 0) finalDiscount = discountType === 'percent' ? (grossTotal * (parseFloat(discountVal) / 100)) : parseFloat(discountVal);
  const finalTotalAmount = grossTotal - finalDiscount; const halfGst = totalGst / 2; const currentMargin = totalTaxable - totalPurchaseCost - finalDiscount;

  const fetchProfile = async (id = currentShopId) => { if (!id) return; try { const res = await axios.get(`${API_URL}/api/shop/${id}`); setProfile(res.data); } catch (e) {} };
  const fetchInventory = async (id = currentShopId) => { if (!id) return; try { const res = await axios.get(`${API_URL}/api/products/${id}`); setInventory(res.data); } catch (e) {} };
  const fetchTransactions = async (id = currentShopId) => { if (!id) return; try { const res = await axios.get(`${API_URL}/api/transactions/${id}`); setTransactions(res.data); } catch (e) {} };
  
  // NEW GENERIC IMAGE UPLOAD HANDLER
  const handleImageUpload = (e, field) => { 
    const file = e.target.files[0]; 
    if (file) { 
      const reader = new FileReader(); 
      reader.onloadend = () => setProfile({ ...profile, [field]: reader.result }); 
      reader.readAsDataURL(file); 
    } 
  };
  
  const saveProfile = async (e) => { e.preventDefault(); setIsLoading(true); try { await axios.put(`${API_URL}/api/shop/${currentShopId}`, profile); showMessage("✅ Profile Settings Updated!"); } catch (e) {} setIsLoading(false); };
  const triggerPrint = (invoiceNo, buyerName) => { const cleanBuyerName = buyerName ? buyerName.replace(/[^a-zA-Z0-9]/g, '_') : "Customer"; const originalTitle = document.title; document.title = `${invoiceNo}_to_${cleanBuyerName}`; setTimeout(() => { window.print(); document.title = originalTitle; }, 500); };

  const loadBillForEdit = (tx) => {
    const loadedCart = tx.receipt_details.cartItems.map(ci => { const invItem = inventory.find(i => i.product_id === ci.product_id); return invItem ? { ...invItem, qty: ci.qty, rate: ci.rate } : { product_id: ci.product_id, name_english: ci.name.split(' (')[0], name_regional: "", qty: ci.qty, rate: ci.rate, gst_rate: 0, purchase_price: 0, is_gst_inclusive: true }; });
    setCart(loadedCart); setPartyName(tx.party_name); setPartyGst(tx.receipt_details.partyGst || ""); setTransType(tx.transaction_type); setDiscountVal(tx.discount_amount || ""); setDiscountType("flat");
    setBillStatus(tx.status || "Settled"); setSettlementDate(tx.settlement_date ? tx.settlement_date.split('T')[0] : "");
    setIsGstBill(tx.receipt_details.isGstBill !== false);
    setEditBillId(tx.transaction_id); setActiveTab("billing"); showMessage("✏️ Bill loaded. Khata details and stock will update upon saving.");
  };

  const processBill = async (e) => {
    e.preventDefault(); if (cart.length === 0) return showMessage("❌ Cart is empty.");
    if (billStatus === 'Unsettled' && !partyName.trim()) return showMessage("❌ Party / Wholesaler Name required for Unsettled bills.");
    setIsLoading(true);
    try {
      // INJECT UPI QR CODE URL INTO RECEIPT DATA
      const currentReceiptData = { shopName: profile.shop_name, owner: profile.owner_name, address: profile.address, gstNum: profile.gst_number, logo: profile.logo_url, upiQr: profile.upi_qr_url, phone: profile.contact_number, email: profile.email, bank: profile.bank_name, acc: profile.account_no, ifsc: profile.ifsc_code, partyName, partyGst, transType, isGstBill, cartItems: cart.map(item => ({ product_id: item.product_id, name: `${item.name_english} (${item.name_regional})`, hsn: item.hsn_code, qty: item.qty, rate: item.rate, amount: (item.rate * item.qty) })), grossAmount: grossTotal, discount: finalDiscount, taxable: totalTaxable, totalGst: totalGst, cgst: halfGst, sgst: halfGst, finalTotal: finalTotalAmount, date: new Date().toLocaleDateString('en-IN') };
      const payload = { shop_id: currentShopId, party_name: partyName, transaction_type: transType, cart_items: cart, total_amount: finalTotalAmount, total_gst: totalGst, discount_amount: finalDiscount, receipt_details: currentReceiptData, status: billStatus, settlement_date: billStatus === 'Unsettled' ? settlementDate : "" };
      let response;
      if (editBillId) { response = await axios.put(`${API_URL}/api/billing/${editBillId}`, payload); setEditBillId(null); } else { response = await axios.post(`${API_URL}/api/billing`, payload); }
      setReceiptData(response.data.receipt); showMessage(`✅ Transaction saved successfully!`); setPartyName(""); setPartyGst(""); setCart([]); setDiscountVal(""); setSearchQuery(""); setBillStatus("Settled"); setSettlementDate(""); setIsGstBill(true); fetchInventory(); fetchTransactions(); triggerPrint(response.data.receipt.invoiceNo, response.data.receipt.partyName);
    } catch (error) { showMessage("❌ Error processing bill."); } finally { setIsLoading(false); }
  };

  const handleReprint = (receiptDetailsStr) => { if (!receiptDetailsStr) return showMessage("❌ Old format bill. Data not available."); const data = typeof receiptDetailsStr === 'string' ? JSON.parse(receiptDetailsStr) : receiptDetailsStr; setReceiptData(data); triggerPrint(data.invoiceNo, data.partyName); };
  
  const saveToVault = async (e) => { 
    e.preventDefault(); setIsLoading(true); 
    try { await axios.post(`${API_URL}/api/products`, { shop_id: currentShopId, name_english: englishName, name_regional: regionalName, current_stock: parseInt(stock), min_stock_alert: parseInt(minAlert), gst_rate: parseFloat(gst), hsn_code: hsnCode, item_rate: parseFloat(itemRate), purchase_price: parseFloat(purchasePrice), is_gst_inclusive: isGstInclusive }); showMessage("✅ Material added!"); setEnglishName(""); setRegionalName(""); setStock(""); setMinAlert(""); setGst("18"); setHsnCode(""); setItemRate(""); setPurchasePrice(""); setIsGstInclusive(true); fetchInventory(); } catch (error) { showMessage("❌ Error saving product."); } finally { setIsLoading(false); }
  };
  
  const saveEdit = async (id) => { setIsLoading(true); try { await axios.put(`${API_URL}/api/products/${id}`, editData); showMessage("✅ Material updated!"); setEditingId(null); fetchInventory(); } catch (error) { showMessage("❌ Error updating."); } setIsLoading(false); };
  const deleteMaterial = async (id) => { if (window.confirm("Permanently delete this item?")) { setIsLoading(true); try { await axios.delete(`${API_URL}/api/products/${id}`); showMessage("🗑️ Material deleted."); fetchInventory(); } catch (error) {} setIsLoading(false); } };

  const sortedInventory = [...inventory].sort((a, b) => { const hsnA = (a.hsn_code || "").toString().trim(); const hsnB = (b.hsn_code || "").toString().trim(); if (hsnA && hsnB) { if (hsnA !== hsnB) { return hsnA.localeCompare(hsnB, undefined, { numeric: true }); } } if (hsnA && !hsnB) return -1; if (!hsnA && hsnB) return 1; const nameA = (a.name_english || "").toString().toLowerCase().trim(); const nameB = (b.name_english || "").toString().toLowerCase().trim(); return nameA.localeCompare(nameB); });
  const filteredInventory = sortedInventory.filter(item => (item.name_english || "").toLowerCase().includes(searchQuery.toLowerCase()) || (item.name_regional || "").includes(searchQuery) || (item.hsn_code || "").toString().toLowerCase().includes(searchQuery.toLowerCase()));
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

  // ==========================================
  // AUTHENTICATION SCREEN RENDER
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: t.bg, fontFamily: "'Inter', sans-serif", transition: 'all 0.3s', position: 'relative' }}>
        <style>{globalStyles}</style>
        
        {/* Language Toggle for Login Screen */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setUiLang(uiLang === 'en' ? 'gu' : 'en')} style={{ background: t.card, border: `1px solid ${t.border}`, color: t.text, cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
            <Globe size={18} /> {uiLang === 'en' ? 'ગુજરાતી' : 'English'}
          </button>
        </div>

        <div style={{ ...cardStyle, width: '450px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '75px', height: '75px', borderRadius: '16px', overflow: 'hidden', margin: '0 auto 15px auto', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <img src="/bhav-taal_logo1.png" alt="Bhav taal Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '28px', fontFamily: "'Montserrat', sans-serif", fontWeight: '800', letterSpacing: '0.5px' }}>
              <span style={{ color: isDarkMode ? '#f8fafc' : '#0b3858' }}>BHAV</span><span style={{ color: '#26a69a' }}>-TAAL</span>
            </h2>
            <p style={{ color: t.textMuted, margin: 0, fontSize: '15px' }}>
              {authMode === 'login' && tText('login_title')}
              {authMode === 'register' && tText('reg_title')}
              {authMode === 'forgot' && tText('forgot_title')}
            </p>
          </div>

          {authMessage && <div style={{ backgroundColor: `${t.danger}20`, color: t.danger, padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>{authMessage}</div>}
          {authSuccess && <div style={{ backgroundColor: `${t.success}20`, color: t.success, padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>{authSuccess}</div>}

          {/* === LOGIN MODE === */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '15px' }}><label style={labelStyle}>{tText('user')}</label><input type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="soft-input" style={inputStyle} /></div>
              <div style={{ marginBottom: '15px', position: 'relative' }}>
                <label style={labelStyle}>{tText('pass')}</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="soft-input" style={{ ...inputStyle, paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 0, display: 'flex' }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginBottom: '30px' }}>
                <button type="button" onClick={() => { setAuthMode('forgot'); resetAuthStates(); }} style={{ background: 'none', border: 'none', color: t.primary, fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>{tText('forgot_pass')}</button>
              </div>
              <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}>{tText('btn_auth')}</button>
              <div style={{ textAlign: 'center', marginTop: '20px' }}><button type="button" onClick={() => { setAuthMode('register'); resetAuthStates(); }} style={{ background: 'none', border: 'none', color: t.primary, fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>{tText('switch_reg')}</button></div>
            </form>
          )}

          {/* === REGISTER MODE === */}
          {authMode === 'register' && regStep === 1 && (
            <form onSubmit={handleRegisterRequestOtp}>
              <div style={{ marginBottom: '15px' }}><label style={labelStyle}>{tText('biz_name')}</label><input type="text" required value={regShopName} onChange={(e) => setRegShopName(e.target.value)} className="soft-input" style={inputStyle} /></div>
              <div style={{ marginBottom: '15px' }}><label style={labelStyle}>{tText('user')}</label><input type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="soft-input" style={inputStyle} /></div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div><label style={labelStyle}>{tText('email_req')}</label><input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="soft-input" style={inputStyle} /></div>
                <div><label style={labelStyle}>{tText('phone_req')}</label><input type="tel" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="soft-input" style={inputStyle} /></div>
              </div>

              <div style={{ marginBottom: '15px', position: 'relative' }}>
                <label style={labelStyle}>{tText('pass')}</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="soft-input" style={{ ...inputStyle, paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 0, display: 'flex' }}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>
              <div style={{ marginBottom: '30px', position: 'relative' }}>
                <label style={labelStyle}>{tText('conf_pass')}</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} required value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="soft-input" style={{ ...inputStyle, paddingRight: '40px' }} />
                </div>
              </div>

              <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}><Mail size={20}/> {tText('get_otp')}</button>
              <div style={{ textAlign: 'center', marginTop: '20px' }}><button type="button" onClick={() => { setAuthMode('login'); resetAuthStates(); }} style={{ background: 'none', border: 'none', color: t.primary, fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>{tText('switch_login')}</button></div>
            </form>
          )}

          {authMode === 'register' && regStep === 2 && (
            <form onSubmit={handleRegisterVerify}>
              <div style={{ backgroundColor: `${t.primary}10`, border: `1px solid ${t.primary}40`, padding: '15px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', color: t.text }}>
                <Mail color={t.primary} size={30} style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 'bold' }}>OTP Sent to {regEmail}</div>
                <div style={{ fontSize: '12px', color: t.textMuted }}>Please check your inbox and spam folder.</div>
              </div>

              {/* INVISIBLE OVERLAY OTP INPUT */}
              <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <label style={{...labelStyle, display: 'block', marginBottom: '15px'}}>{tText('enter_otp')}</label>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ width: '45px', height: '55px', backgroundColor: t.inputBg, border: `2px solid ${otpToken.length === i ? t.primary : t.border}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: otpToken[i] ? t.text : t.textMuted, transition: 'all 0.2s', boxShadow: otpToken.length === i ? `0 0 0 3px ${t.primary}20` : 'none' }}>
                      {otpToken[i] || '-'}
                    </div>
                  ))}
                  <input type="text" value={otpToken} onChange={(e) => setOtpToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'text', zIndex: 10 }} autoFocus />
                </div>
              </div>

              <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}>{tText('verify_reg')}</button>
              <div style={{ textAlign: 'center', marginTop: '20px' }}><button type="button" onClick={() => setRegStep(1)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '14px' }}>Go Back</button></div>
            </form>
          )}

          {/* === FORGOT PASSWORD MODE === */}
          {authMode === 'forgot' && forgotStep === 1 && (
            <form onSubmit={handleForgotSendOtp}>
              <div style={{ marginBottom: '30px' }}><label style={labelStyle}>{tText('email_req')}</label><input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="soft-input" style={inputStyle} /></div>
              <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}><ShieldAlert size={20}/> {tText('send_recovery')}</button>
              <div style={{ textAlign: 'center', marginTop: '20px' }}><button type="button" onClick={() => { setAuthMode('login'); resetAuthStates(); }} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '14px' }}>{tText('back_login')}</button></div>
            </form>
          )}

          {authMode === 'forgot' && forgotStep === 2 && (
            <form onSubmit={handleForgotVerifyOtp}>
              <div style={{ backgroundColor: `${t.primary}10`, border: `1px solid ${t.primary}40`, padding: '15px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', color: t.text }}><div style={{ fontWeight: 'bold' }}>Recovery OTP Sent to {regEmail}</div></div>
              
              {/* INVISIBLE OVERLAY OTP INPUT */}
              <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <label style={{...labelStyle, display: 'block', marginBottom: '15px'}}>{tText('enter_otp')}</label>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ width: '45px', height: '55px', backgroundColor: t.inputBg, border: `2px solid ${otpToken.length === i ? t.primary : t.border}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: otpToken[i] ? t.text : t.textMuted, transition: 'all 0.2s', boxShadow: otpToken.length === i ? `0 0 0 3px ${t.primary}20` : 'none' }}>
                      {otpToken[i] || '-'}
                    </div>
                  ))}
                  <input type="text" value={otpToken} onChange={(e) => setOtpToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'text', zIndex: 10 }} autoFocus />
                </div>
              </div>

              <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}>{tText('verify_recovery')}</button>
              <div style={{ textAlign: 'center', marginTop: '20px' }}><button type="button" onClick={() => setForgotStep(1)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '14px' }}>Go Back</button></div>
            </form>
          )}

          {authMode === 'forgot' && forgotStep === 3 && (
            <div>
               <div style={{ marginBottom: '20px', textAlign: 'center', color: t.textMuted, fontSize: '14px' }}>Identity verified. What would you like to do?</div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 <button onClick={handleRevealPassword} disabled={isLoading} style={{ padding: '15px', backgroundColor: t.bg, border: `2px dashed ${t.primary}`, borderRadius: '12px', color: t.primary, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><Eye size={20}/> {tText('opt_reveal')}</button>
                 <button onClick={() => setForgotStep(4)} style={{ padding: '15px', backgroundColor: t.primary, border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><KeyRound size={20}/> {tText('opt_reset')}</button>
               </div>
            </div>
          )}

          {authMode === 'forgot' && forgotStep === 4 && (
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '15px', position: 'relative' }}>
                <label style={labelStyle}>{tText('new_pass')}</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="soft-input" style={{ ...inputStyle, paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 0, display: 'flex' }}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>
              <div style={{ marginBottom: '30px', position: 'relative' }}>
                <label style={labelStyle}>{tText('conf_pass')}</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} required value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="soft-input" style={{ ...inputStyle, paddingRight: '40px' }} />
                </div>
              </div>
              <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}>{tText('update_pass')}</button>
            </form>
          )}

          {authMode === 'forgot' && forgotStep === 5 && (
            <div style={{ textAlign: 'center' }}>
               <div style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                 <div style={{ color: t.textMuted, fontSize: '14px', marginBottom: '10px' }}>{tText('your_pass')}</div>
                 <div style={{ fontSize: '24px', fontWeight: 'bold', color: t.primary, letterSpacing: '2px' }}>{revealedPass}</div>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: t.danger, fontWeight: 'bold', fontSize: '15px' }}>
                 <Clock size={18}/> {tText('pass_hide')} {revealTimer}s
               </div>
            </div>
          )}

        </div>
        <div style={{ position: 'absolute', bottom: '20px', color: t.textMuted, fontSize: '13px', fontWeight: '600' }}>{tText('dev')}</div>
        
        {/* SHIELD */}
        {isLoading && (
          <div className="glass-overlay">
            <span className="loader"></span>
            <div>{tText('auth_wait')}</div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // DASHBOARD SCREEN RENDER
  // ==========================================
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: t.bg, color: t.text, transition: 'all 0.3s' }}>
      <style>{globalStyles}</style>
      {isSearchOpen && (<div onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 900 }} />)}
      {isCatSearchOpen && (<div onClick={() => setIsCatSearchOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 900 }} />)}

      <div className="no-print" style={{ width: isSidebarOpen ? '260px' : '80px', backgroundColor: t.sidebar, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10 }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', borderBottom: `1px solid ${t.border}` }}>
          {isSidebarOpen && (<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><img src="/bhav-taal_logo1.png" alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} /><h2 style={{ margin: 0, fontSize: '22px', fontFamily: "'Montserrat', sans-serif", fontWeight: '800', letterSpacing: '0.5px' }}><span style={{ color: isDarkMode ? '#f8fafc' : '#0b3858' }}>BHAV</span><span style={{ color: '#26a69a' }}>-TAAL</span></h2></div>)}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: '5px' }}><Menu size={24} /></button>
        </div>
        
        <div style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isExpired ? (
            <button onClick={() => setActiveTab("subscribe")} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: `${t.danger}15`, color: t.danger, fontWeight: '600' }}><Lock size={22} /> {isSidebarOpen && <span style={{ fontSize: '15px' }}>{tText('license_exp')}</span>}</button>
          ) : (
            [ { id: 'ledger', icon: LayoutDashboard, label: tText('nav_dash') }, { id: 'billing', icon: ShoppingCart, label: tText('nav_pos') }, { id: 'list', icon: PackageSearch, label: tText('nav_inv') }, { id: 'add', icon: PlusCircle, label: tText('nav_add') }, { id: 'profile', icon: Settings, label: tText('nav_shop') } ].map((nav) => (
              <button key={nav.id} onClick={() => { setActiveTab(nav.id); setMessage(""); }} style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: activeTab === nav.id ? `${t.primary}15` : 'transparent', color: activeTab === nav.id ? t.primary : t.textMuted, fontWeight: activeTab === nav.id ? '600' : '500' }}>
                <nav.icon size={22} /> {isSidebarOpen && <span style={{ fontSize: '15px' }}>{nav.label}</span>}
              </button>
            ))
          )}
        </div>

        <div style={{ padding: '20px', borderTop: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {isSidebarOpen && (
            <div style={{ backgroundColor: `${timeColor}15`, padding: '12px', borderRadius: '12px', border: `1px solid ${timeColor}40` }}>
              <div style={{ fontSize: '11px', color: t.textMuted, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>{tText('valid_until')}</div>
              <div style={{ color: timeColor, fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16}/> {isExpired ? tText('license_exp') : timeLeftStr}</div>
            </div>
          )}
          {isSidebarOpen && (<button onClick={() => setActiveTab("subscribe")} style={{ width: '100%', padding: '10px', backgroundColor: t.primary, color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>{tText('upgrade_plan')}</button>)}
          <div style={{ display: 'flex', gap: '10px', justifyContent: isSidebarOpen ? 'space-between' : 'center' }}>
            <button onClick={() => setUiLang(uiLang === 'en' ? 'gu' : 'en')} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Globe size={20} />{isSidebarOpen && <span style={{ fontSize: '9px', fontWeight: 'bold', marginTop: '2px' }}>{uiLang.toUpperCase()}</span>}</button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: '5px' }}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => {setIsLoggedIn(false); setLoginUser(""); setLoginPass(""); setConfirmPass(""); setCart([]);}} style={{ background: 'none', border: 'none', color: t.danger, cursor: 'pointer', padding: '5px' }}><LogOut size={20} /></button>
          </div>
        </div>
      </div>

      <div className="no-print" style={{ flex: 1, overflowY: 'auto', padding: '40px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', flex: 1 }}>
          {message && (<div style={{ position: 'fixed', top: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: t.card, color: t.text, padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderLeft: `5px solid ${message.includes('❌') ? t.danger : t.success}`, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 100, fontWeight: '500', animation: 'fadeIn 0.3s ease' }}>{message}</div>)}

          {!isExpired && duePaymentsCount > 0 && activeTab !== "subscribe" && (<div style={{ backgroundColor: `${t.danger}15`, border: `1px solid ${t.danger}40`, color: t.danger, padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}><AlertTriangle size={20} /> {tText('alert_due').replace('{count}', duePaymentsCount)}</div>)}

          <div style={{ marginBottom: '40px', textAlign: 'center' }}><h1 style={{ fontSize: '32px', margin: '0 0 5px 0', color: t.text }}>{profile.shop_name || "Welcome"}</h1><p style={{ color: t.textMuted, margin: 0, fontWeight: '500' }}>{tText('system_online')} • {new Date().toLocaleDateString()}</p></div>

          {activeTab === "subscribe" && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}><h2 style={{ color: t.text, fontSize: '32px', margin: '0 0 10px 0' }}>{tText('choose_plan')}</h2><p style={{ color: t.textMuted, fontSize: '16px' }}>{tText('sub_subtitle')}</p></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                <div style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '30px', display: 'flex', flexDirection: 'column' }}><h3 style={{ margin: '0 0 10px 0', color: t.text }}>{tText('monthly')}</h3><div style={{ fontSize: '36px', fontWeight: 'bold', color: t.primary, marginBottom: '20px' }}>₹299 <span style={{ fontSize: '16px', color: t.textMuted, fontWeight: 'normal' }}>/mo</span></div><ul style={{ padding: 0, listStyle: 'none', margin: '0 0 30px 0', flex: 1 }}><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Unlimited POS Invoices</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Secure Cloud Auto-Backup</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Standard Email Support</li></ul><button disabled={true} style={{ ...btnPrimary, backgroundColor: t.bg, color: t.textMuted, border: `1px solid ${t.border}`, cursor: 'not-allowed', opacity: 0.6 }}>Gateway Pending</button></div>
                <div style={{ backgroundColor: t.card, border: `2px solid ${t.primary}`, borderRadius: '20px', padding: '30px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: `0 10px 30px ${t.primary}20` }}><div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: t.primary, color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>{tText('most_pop')}</div><h3 style={{ margin: '0 0 10px 0', color: t.text }}>{tText('half_yearly')}</h3><div style={{ fontSize: '36px', fontWeight: 'bold', color: t.primary, marginBottom: '20px' }}>₹1599 <span style={{ fontSize: '16px', color: t.textMuted, fontWeight: 'normal' }}>/6 mo</span></div><ul style={{ padding: 0, listStyle: 'none', margin: '0 0 30px 0', flex: 1 }}><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> All Monthly Features</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Advanced GST & Khata Reports</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> High Priority Tech Support</li></ul><button disabled={true} style={{ ...btnPrimary, backgroundColor: t.textMuted, color: 'white', border: 'none', cursor: 'not-allowed', opacity: 0.6, boxShadow: 'none' }}>Gateway Pending</button></div>
                <div style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '30px', display: 'flex', flexDirection: 'column' }}><h3 style={{ margin: '0 0 10px 0', color: t.text }}>{tText('yearly')}</h3><div style={{ fontSize: '36px', fontWeight: 'bold', color: t.primary, marginBottom: '20px' }}>₹2999 <span style={{ fontSize: '16px', color: t.textMuted, fontWeight: 'normal' }}>/yr</span></div><ul style={{ padding: 0, listStyle: 'none', margin: '0 0 30px 0', flex: 1 }}><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> Save ₹589 immediately</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> 24/7 Dedicated Support Line</li><li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: t.text }}><CheckCircle2 color={t.success} size={18}/> 1-on-1 Software Onboarding</li></ul><button disabled={true} style={{ ...btnPrimary, backgroundColor: t.bg, color: t.textMuted, border: `1px solid ${t.border}`, cursor: 'not-allowed', opacity: 0.6 }}>Gateway Pending</button></div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '30px', color: t.textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><CreditCard size={18} /> {tText('secured_by')}</div>
            </div>
          )}

          {activeTab === "profile" && !isExpired && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              <form onSubmit={saveProfile} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}><Settings color={t.primary} size={28}/><h2 style={{ margin: 0, color: t.text }}>{tText('biz_prof')}</h2></div>
                
                {/* LOGO AND QR UPLOAD ROW */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '12px', border: `2px dashed ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: t.inputBg }}>{profile.logo_url ? <img src={profile.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <ImageIcon color={t.textMuted} size={32} />}</div>
                    <div><label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>{tText('biz_logo')}</label><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo_url')} style={{ color: t.textMuted }} /></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '12px', border: `2px dashed ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: t.inputBg }}>{profile.upi_qr_url ? <img src={profile.upi_qr_url} alt="UPI QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <QrCode color={t.textMuted} size={32} />}</div>
                    <div><label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>{tText('upi_qr')}</label><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'upi_qr_url')} style={{ color: t.textMuted }} /></div>
                  </div>
                </div>

                <h3 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '10px', marginBottom: '20px' }}>{tText('gen_info')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div><label style={labelStyle}>{tText('biz_name')}</label><input type="text" required value={profile.shop_name || ""} onChange={(e) => setProfile({...profile, shop_name: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>{tText('gst_comp')}</label><input type="text" value={profile.gst_number || ""} onChange={(e) => setProfile({...profile, gst_number: e.target.value})} placeholder="24AAACC1206D1Z1" className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>{tText('owner_name')}</label><input type="text" required value={profile.owner_name || ""} onChange={(e) => setProfile({...profile, owner_name: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>{tText('address')}</label><input type="text" required value={profile.address || ""} onChange={(e) => setProfile({...profile, address: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>{tText('contact')}</label><input type="tel" value={profile.contact_number || ""} onChange={(e) => setProfile({...profile, contact_number: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>{tText('email')}</label><input type="email" value={profile.email || ""} onChange={(e) => setProfile({...profile, email: e.target.value})} className="soft-input" style={inputStyle} /></div>
                </div>
                <h3 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '10px', marginBottom: '20px' }}>{tText('bank_details')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div><label style={labelStyle}>{tText('bank_name')}</label><input type="text" value={profile.bank_name || ""} onChange={(e) => setProfile({...profile, bank_name: e.target.value})} placeholder="HDFC Bank" className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>{tText('ac_no')}</label><input type="text" value={profile.account_no || ""} onChange={(e) => setProfile({...profile, account_no: e.target.value})} className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>{tText('ifsc')}</label><input type="text" value={profile.ifsc_code || ""} onChange={(e) => setProfile({...profile, ifsc_code: e.target.value})} className="soft-input" style={inputStyle} /></div>
                </div>
                <div style={{ position: 'relative', marginBottom: '30px' }}>
                  <label style={labelStyle}>{tText('biz_cat')}</label>
                  <div style={{ position: 'relative' }}><Search color={t.textMuted} size={20} style={{ position: 'absolute', left: '12px', top: '16px', zIndex: 10 }} /><input type="text" required value={categorySearch || profile.category || ""} placeholder="Search from 50+ categories..." className="soft-input" style={{ ...inputStyle, paddingLeft: '40px' }} onChange={(e) => { setCategorySearch(e.target.value); setIsCatSearchOpen(true); setProfile({...profile, category: e.target.value}); }} onFocus={() => setIsCatSearchOpen(true)} /></div>
                  {isCatSearchOpen && (<div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', marginTop: '8px', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', zIndex: 990 }}>{filteredCategories.map((cat, i) => (<div key={i} onClick={() => { setProfile({...profile, category: cat}); setCategorySearch(cat); setIsCatSearchOpen(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${t.border}`, color: t.text }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${t.primary}15`} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>{cat}</div>))}</div>)}
                </div>
                <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}>{tText('btn_save_prof')}</button>
              </form>
            </div>
          )}

          {activeTab === "ledger" && !isExpired && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div onClick={() => { setActiveTab("list"); setMessage(""); }} style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.primary}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><PackageSearch size={16}/> {tText('quick_act')}</p><h3 style={{ margin: '10px 0 0 0', color: t.primary, fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>{tText('manage_inv')} <ChevronLeft style={{ transform: 'rotate(180deg)' }} size={20}/></h3></div>
                <div style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.success}` }}><p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><Receipt size={16}/> {tText('bills_today')}</p><h3 style={{ margin: '10px 0 0 0', color: t.text, fontSize: '28px' }}>{todayBillsCount}</h3></div>
                <div style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.textMuted}` }}><p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><Box size={16}/> {tText('tot_mat')}</p><h3 style={{ margin: '10px 0 0 0', color: t.text, fontSize: '28px' }}>{inventory.length}</h3></div>
                <div style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.success}` }}><p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowDownRight size={16}/> {tText('to_recv')}</p><h3 style={{ margin: '10px 0 0 0', color: t.success, fontSize: '28px' }}>₹{totalToReceive.toFixed(2)}</h3></div>
                <div style={{ backgroundColor: t.card, padding: '20px', borderRadius: '20px', border: `1px solid ${t.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderBottom: `4px solid ${t.danger}` }}><p style={{ margin: 0, color: t.textMuted, fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={16}/> {tText('to_pay')}</p><h3 style={{ margin: '10px 0 0 0', color: t.danger, fontSize: '28px' }}>₹{totalToPay.toFixed(2)}</h3></div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 15px 0', color: t.text, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}><AlertTriangle size={20} color={lowStockItems.length > 0 ? t.danger : t.success} /> {tText('stock_alerts')}</h3>
                    {lowStockItems.length === 0 ? (<div style={{ padding: '15px', textAlign: 'center', backgroundColor: `${t.success}10`, color: t.success, borderRadius: '12px', fontWeight: '500' }}>{tText('all_opt')}</div>) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>{lowStockItems.map(item => (<div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: `1px solid ${t.danger}40`, backgroundColor: `${t.danger}05`, borderRadius: '10px' }}><div><div style={{ fontWeight: '600', color: t.text, fontSize: '14px' }}>{uiLang === 'en' ? item.name_english : item.name_regional || item.name_english}</div><div style={{ color: t.textMuted, fontSize: '12px' }}>{tText('alert_at')} {item.min_stock_alert}</div></div><div style={{ backgroundColor: t.danger, color: 'white', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}>{item.current_stock} {tText('left')}</div></div>))}</div>
                    )}
                  </div>

                  <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 15px 0', color: t.text, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}><FileText size={20} color={t.text} /> {tText('unsettled_bills')}</h3>
                    {unsettledBills.length === 0 ? (<div style={{ padding: '15px', textAlign: 'center', backgroundColor: `${t.success}10`, color: t.success, borderRadius: '12px', fontWeight: '500' }}>{tText('no_pending')}</div>) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                        {unsettledBills.map(tx => {
                          const sDate = tx.settlement_date ? new Date(tx.settlement_date) : null; let dateColor = t.textMuted; let dateText = "No Date Set";
                          if (sDate) { if (sDate <= todayObj) { dateColor = t.danger; dateText = `${tText('due')} ${sDate.toLocaleDateString('en-IN')}`; } else if (sDate <= fiveDaysFromNow) { dateColor = t.warning; dateText = `${tText('due')} ${sDate.toLocaleDateString('en-IN')}`; } else { dateColor = t.textMuted; dateText = `${tText('due')} ${sDate.toLocaleDateString('en-IN')}`; } }
                          const isReceiving = tx.transaction_type === 'SELL'; const boxColor = isReceiving ? t.success : t.danger;
                          return (<div key={tx.transaction_id} onClick={() => loadBillForEdit(tx)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: `1px solid ${boxColor}40`, backgroundColor: `${boxColor}05`, borderRadius: '10px', cursor: 'pointer' }}><div><div style={{ fontWeight: '600', color: t.text, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>{isReceiving ? <ArrowDownRight size={14} color={t.success}/> : <ArrowUpRight size={14} color={t.danger}/>}{tx.party_name || "Unknown"}</div><div style={{ color: dateColor, fontSize: '12px', fontWeight: 'bold' }}>{dateText}</div></div><div style={{ fontWeight: 'bold', fontSize: '14px', color: boxColor }}>₹{tx.total_amount}</div></div>);
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ ...cardStyle, overflowX: 'auto', padding: '0', height: 'fit-content' }}>
                  <div style={{ padding: '25px', borderBottom: `1px solid ${t.border}` }}><h3 style={{ margin: 0, color: t.text }}>{tText('recent_tx')}</h3></div>
                  <div style={{ overflowX: 'auto', padding: '0 25px 25px 25px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '15px' }}>
                      <thead><tr style={{ borderBottom: `2px solid ${t.border}` }}><th style={{ padding: '15px', color: t.textMuted }}>{tText('date')}</th><th style={{ padding: '15px', color: t.textMuted }}>{tText('party')}</th><th style={{ padding: '15px', color: t.textMuted }}>{tText('status')}</th><th style={{ padding: '15px', color: t.textMuted, textAlign: 'right' }}>{tText('total')}</th><th style={{ padding: '15px', color: t.textMuted, textAlign: 'center' }}>{tText('actions')}</th></tr></thead>
                      <tbody>
                        {transactions.length === 0 ? (<tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: t.textMuted }}>{tText('no_tx')}</td></tr>) : (
                          transactions.map((tx) => (
                            <tr key={tx.transaction_id} style={{ borderBottom: `1px solid ${t.border}` }}>
                              <td style={{ padding: '15px', color: t.text }}>{new Date(tx.transaction_date).toLocaleDateString('en-IN')}</td>
                              <td style={{ padding: '15px', fontWeight: '500', color: t.text }}>{tx.party_name || "Cash"}</td>
                              <td style={{ padding: '15px' }}><span style={{ backgroundColor: tx.status === 'Settled' ? `${t.success}20` : `${t.danger}20`, color: tx.status === 'Settled' ? t.success : t.danger, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{tx.status === 'Settled' ? tText('settled') : tText('unsettled_recv')}</span></td>
                              <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: t.text }}>₹{tx.total_amount}</td>
                              <td style={{ padding: '15px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {tx.receipt_details ? (<><button onClick={() => loadBillForEdit(tx)} style={{ background: 'none', border: `1px solid ${t.primary}`, borderRadius: '6px', color: t.primary, cursor: 'pointer', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '12px' }}><Pencil size={14}/> {tText('edit')}</button><button onClick={() => handleReprint(tx.receipt_details)} style={{ background: t.primary, border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '12px' }}><Download size={14}/> {tText('print')}</button></>) : (<span style={{ fontSize: '12px', color: t.textMuted }}>{tText('old_bill')}</span>)}
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
              {isGstBill && !profile.gst_number && <div style={{ backgroundColor: `${t.danger}20`, color: t.danger, padding: '15px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', textAlign: 'center' }}>{tText('warning_gst')}</div>}
              
              <form onSubmit={processBill} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><ShoppingCart color={t.primary} size={28}/><h2 style={{ margin: 0, color: t.text }}>{editBillId ? `${tText('editing_bill')} (INV-${editBillId})` : tText('checkout')}</h2></div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ backgroundColor: `${t.success}15`, color: t.success, border: `1px solid ${t.success}50`, padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>{tText('live_margin')}: ₹{currentMargin.toFixed(2)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: isGstBill ? `${t.primary}10` : t.inputBg, padding: '8px 16px', borderRadius: '12px', border: `1px solid ${isGstBill ? t.primary : t.border}`, transition: 'all 0.3s' }}><span style={{ fontSize: '14px', fontWeight: 'bold', color: isGstBill ? t.primary : t.textMuted }}>{isGstBill ? "GST Bill" : "Estimate (No GST)"}</span><button type="button" onClick={() => setIsGstBill(!isGstBill)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: isGstBill ? t.primary : t.textMuted, display: 'flex', alignItems: 'center' }}>{isGstBill ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}</button></div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div><label style={labelStyle}>{tText('tx_type')}</label><select value={transType} onChange={(e) => setTransType(e.target.value)} className="soft-input" style={{ ...inputStyle, fontWeight: 'bold', color: transType === 'SELL' ? t.success : t.danger }}><option value="SELL">{tText('sell')}</option><option value="PURCH">{tText('purch')}</option></select></div>
                  <div><label style={labelStyle}>{transType === 'SELL' ? tText('cust_name') : tText('wholesaler_name')}</label><input type="text" required={billStatus === 'Unsettled'} value={partyName} onChange={(e) => setPartyName(e.target.value)} placeholder="Name" className="soft-input" style={inputStyle} /></div>
                  <div><label style={labelStyle}>{transType === 'SELL' ? tText('cust_gst') : tText('whole_gst')}</label><input type="text" value={partyGst} onChange={(e) => setPartyGst(e.target.value)} placeholder="GST Number" className="soft-input" style={inputStyle} disabled={!isGstBill} /></div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', padding: '15px', backgroundColor: t.bg, borderRadius: '12px', border: `1px dashed ${t.border}` }}>
                   <div style={{ flex: 1 }}><label style={labelStyle}>{transType === 'SELL' ? tText('pay_from_cust') : tText('pay_to_whole')}</label><select value={billStatus} onChange={(e) => setBillStatus(e.target.value)} className="soft-input" style={{ ...inputStyle, fontWeight: 'bold', color: billStatus === 'Settled' ? t.success : t.danger }}><option value="Settled">{tText('settled')}</option><option value="Unsettled">{transType === 'SELL' ? tText('unsettled_recv') : tText('unsettled_pay')}</option></select></div>
                   {billStatus === 'Unsettled' && (<div style={{ flex: 1 }}><label style={labelStyle}>{tText('promised_date')}</label><input type="date" value={settlementDate} onChange={(e) => setSettlementDate(e.target.value)} className="soft-input" style={inputStyle} /></div>)}
                </div>

                <div style={{ position: 'relative', marginBottom: '30px', zIndex: 1000 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}><label style={labelStyle}>{tText('search_add')} (By Name or HSN)</label><div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: t.textMuted }}><span>{tText('kb_mode')}:</span><select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ background: 'transparent', border: 'none', color: t.primary, fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}><option value="en">English</option><option value="gu">Gujarati</option></select></div></div>
                  <div style={{ position: 'relative' }}><Search color={t.textMuted} size={20} style={{ position: 'absolute', left: '12px', top: '16px', zIndex: 10 }} /><ReactTransliterate value={searchQuery} onChangeText={(text) => { setSearchQuery(text); setIsSearchOpen(true); }} lang={language} renderComponent={(props) => (<input {...props} placeholder="Type name or HSN code..." className="soft-input" style={{ ...inputStyle, paddingLeft: '40px', marginTop: 0 }} onFocus={() => setIsSearchOpen(true)} />)} /></div>
                  {isSearchOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', marginTop: '8px', maxHeight: '300px', overflowY: 'auto', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', zIndex: 990 }}>
                      {filteredInventory.length === 0 ? (<div style={{ padding: '15px', color: t.textMuted, textAlign: 'center' }}>No materials found.</div>) : (filteredInventory.map((item) => (
                        <div key={item.product_id} onMouseDown={(e) => { e.preventDefault(); handleAddToCart(item); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: t.text }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${t.primary}15`} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <div>
                            <span style={{ fontWeight: '600' }}>{item.name_english}</span>
                            <span style={{ color: t.textMuted, marginLeft: '8px', fontSize: '14px' }}>{item.name_regional}</span>
                            {item.hsn_code && <div style={{ fontSize: '11px', color: t.primary, fontWeight: 'bold', marginTop: '2px' }}>HSN: {item.hsn_code}</div>}
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}><span style={{ backgroundColor: `${t.primary}20`, color: t.primary, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>₹{item.item_rate}</span><span style={{ backgroundColor: item.current_stock <= item.min_stock_alert ? `${t.danger}20` : `${t.success}20`, color: item.current_stock <= item.min_stock_alert ? t.danger : t.success, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Stock: {item.current_stock}</span></div>
                        </div>
                      )))}
                    </div>
                  )}
                </div>
                
                <div style={{ border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '30px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: `${t.primary}05` }}><tr><th style={{ padding: '12px', color: t.textMuted, fontSize: '13px' }}>{tText('item')}</th><th style={{ padding: '12px', color: t.textMuted, fontSize: '13px', width: '130px' }}>{tText('rate')}</th><th style={{ padding: '12px', color: t.textMuted, fontSize: '13px', width: '100px' }}>{tText('qty')}</th><th style={{ padding: '12px', color: t.textMuted, fontSize: '13px', textAlign: 'right', width: '120px' }}>{tText('amount')}</th><th style={{ padding: '12px', width: '50px' }}></th></tr></thead>
                    <tbody>
                      {cart.length === 0 ? (<tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: t.textMuted }}>{tText('cart_empty')}</td></tr>) : (
                        cart.map((item) => (
                          <tr key={item.product_id} style={{ borderTop: `1px solid ${t.border}`, color: t.text }}>
                            <td style={{ padding: '12px', fontWeight: '500' }}>{uiLang === 'en' ? item.name_english : item.name_regional || item.name_english}</td>
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
                  <div style={{ flex: 1 }}><label style={labelStyle}>{tText('discount')}</label><input type="number" step="0.01" value={discountVal} onChange={(e) => setDiscountVal(e.target.value)} placeholder="0" className="soft-input" style={inputStyle} /></div>
                  <div style={{ display: 'flex', gap: '5px', marginTop: '22px' }}><button type="button" onClick={() => setDiscountType('percent')} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${discountType === 'percent' ? t.primary : t.border}`, backgroundColor: discountType === 'percent' ? `${t.primary}20` : t.card, color: discountType === 'percent' ? t.primary : t.textMuted }}><Percent size={18} /></button><button type="button" onClick={() => setDiscountType('flat')} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${discountType === 'flat' ? t.primary : t.border}`, backgroundColor: discountType === 'flat' ? `${t.primary}20` : t.card, color: discountType === 'flat' ? t.primary : t.textMuted }}><IndianRupee size={18} /></button></div>
                </div>
                <div style={{ backgroundColor: `${t.primary}10`, padding: '20px', borderRadius: '16px', textAlign: 'right', marginBottom: '20px' }}>
                   {finalDiscount > 0 && <div style={{ fontSize: '14px', color: t.danger, marginBottom: '5px' }}>Discount Applied: -₹{finalDiscount.toFixed(2)}</div>}
                  <span style={{ fontSize: '14px', color: t.textMuted }}>{transType === 'SELL' ? tText('final_pay') : tText('tot_pay')} {isGstBill ? tText('gst_inc') : ""}</span>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: t.primary }}>₹{finalTotalAmount.toFixed(2)}</div>
                  {isGstBill && (<div style={{ fontSize: '12px', color: t.textMuted, marginTop: '5px' }}>({tText('gross')}: ₹{grossTotal.toFixed(2)} | {tText('taxable')}: ₹{totalTaxable.toFixed(2)} | CGST: ₹{halfGst.toFixed(2)} | SGST: ₹{halfGst.toFixed(2)})</div>)}
                </div>
                <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}><Printer size={20}/> {editBillId ? tText('btn_save_print') : tText('btn_gen_inv')}</button>
                {editBillId && (<button type="button" onClick={() => { setEditBillId(null); setCart([]); setPartyName(""); setDiscountVal(""); setBillStatus("Settled"); setSettlementDate(""); setIsGstBill(true); }} style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'transparent', border: `1px solid ${t.textMuted}`, borderRadius: '12px', color: t.textMuted, cursor: 'pointer', fontWeight: 'bold' }}>{tText('cancel_edit')}</button>)}
              </form>
            </div>
          )}

          {activeTab === "list" && !isExpired && (
            <div style={{ animation: 'fadeIn 0.4s ease', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ ...cardStyle, padding: '0' }}>
                <div style={{ padding: '30px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 style={{ margin: 0, color: t.text, display: 'flex', alignItems: 'center', gap: '10px' }}><PackageSearch color={t.primary}/> {tText('inv_mgmt')}</h3><button onClick={() => setActiveTab("add")} style={{ padding: '10px 20px', backgroundColor: `${t.primary}15`, color: t.primary, borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>{tText('btn_add_new')}</button></div>
                <div style={{ overflowX: 'auto', padding: '0 30px 30px 30px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
                    <thead><tr style={{ borderBottom: `2px solid ${t.border}` }}><th style={{ padding: '15px', color: t.textMuted }}>{tText('mat_hsn')}</th><th style={{ padding: '15px', color: t.textMuted }}>HSN</th><th style={{ padding: '15px', color: t.textMuted }}>{tText('purch_rs')}</th><th style={{ padding: '15px', color: t.textMuted }}>{tText('sell_rs')}</th><th style={{ padding: '15px', color: t.textMuted }}>{tText('stock')}</th><th style={{ padding: '15px', color: t.textMuted }}>{tText('alert')}</th><th style={{ padding: '15px', color: t.textMuted, textAlign: 'right' }}>{tText('actions')}</th></tr></thead>
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
                              <td style={{ padding: '10px', textAlign: 'right' }}><button onClick={() => saveEdit(item.product_id)} disabled={isLoading} style={{ padding: '8px 12px', backgroundColor: t.success, color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', marginRight: '8px', opacity: isLoading ? 0.7 : 1 }}>{tText('btn_save')}</button><button onClick={() => setEditingId(null)} style={{ padding: '8px 12px', backgroundColor: t.textMuted, color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>{tText('btn_cancel')}</button></td>
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
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}><PlusCircle color={t.primary} size={28}/><h2 style={{ margin: 0, color: t.text }}>{tText('new_mat')}</h2></div>
                 <div style={{ marginBottom: '20px' }}><label style={labelStyle}>{tText('kb_mode')}</label> <select value={language} onChange={(e) => setLanguage(e.target.value)} className="soft-input" style={inputStyle}><option value="en">{tText('kb_en')}</option><option value="gu">{tText('kb_gu')}</option></select></div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                   <div><label style={labelStyle}>{tText('mat_en')}</label> <input type="text" required value={englishName} onChange={(e) => setEnglishName(e.target.value)} className="soft-input" style={inputStyle} /></div>
                   <div><label style={labelStyle}>{tText('mat_gu')}</label> <ReactTransliterate value={regionalName} onChangeText={setRegionalName} lang={language} renderComponent={(props) => <input {...props} className="soft-input" style={inputStyle} />} /></div>
                 </div>
                 
                 <h3 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}>{tText('pricing')}</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                   <div><label style={labelStyle}>{tText('purch_rs')}</label> <input type="number" step="0.01" required value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="Cost" className="soft-input" style={inputStyle} /></div>
                   <div><label style={labelStyle}>{tText('sell_rs')}</label> <input type="number" step="0.01" required value={itemRate} onChange={(e) => setItemRate(e.target.value)} placeholder="Sale" className="soft-input" style={inputStyle} /></div>
                   <div><label style={labelStyle}>{tText('rate_inc_gst')}</label><select value={isGstInclusive} onChange={(e) => setIsGstInclusive(e.target.value === 'true')} className="soft-input" style={inputStyle}><option value={'true'}>{tText('yes_inc')}</option><option value={'false'}>{tText('no_exc')}</option></select></div>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div><label style={labelStyle}>{tText('gst_pct')}</label><input type="number" step="0.01" required value={gst} onChange={(e) => setGst(e.target.value)} className="soft-input" style={inputStyle} /></div>
                    <div><label style={labelStyle}>{tText('hsn_code')}</label> <input type="text" required value={hsnCode} onChange={(e) => setHsnCode(e.target.value)} className="soft-input" style={inputStyle} /></div>
                 </div>

                 <h3 style={{ color: t.text, borderBottom: `1px solid ${t.border}`, paddingBottom: '10px', marginBottom: '20px', marginTop: '10px' }}>{tText('stock_ctrl')}</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div><label style={labelStyle}>{tText('init_stock')}</label><input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="soft-input" style={inputStyle} /></div>
                    <div><label style={labelStyle}>{tText('alert_below')}</label><input type="number" required value={minAlert} onChange={(e) => setMinAlert(e.target.value)} className="soft-input" style={inputStyle} /></div>
                 </div>
                 <button type="submit" disabled={isLoading} style={{ ...btnPrimary, opacity: isLoading ? 0.7 : 1 }}>{tText('btn_vault')}</button>
              </form>
            </div>
          )}
        </div>

        {/* --- BRANDING FOOTER --- */}
        <div style={{ marginTop: '40px', textAlign: 'center', color: t.textMuted, fontSize: '13px', fontWeight: '600' }}>
          {tText('dev')}
        </div>
      </div>

      {/* RAGE-CLICK SHIELD */}
      {isLoading && (
        <div className="glass-overlay">
          <span className="loader"></span>
          <div>{tText('processing')}</div>
        </div>
      )}

      {/* --- ENGLISH PDF RECEIPT SYSTEM --- */}
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
                  {receiptData.isGstBill !== false && receiptData.gstNum && <p style={{ margin: '2px 0', fontSize: '10pt', fontWeight: 'bold' }}>GSTIN: {receiptData.gstNum}</p>}
                </div>
                <div style={{ display: 'flex', fontSize: '10pt', borderBottom: '1px solid black', paddingBottom: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1, paddingRight: '10px', borderRight: '1px solid black' }}>
                    <p style={{ margin: '2px 0', fontWeight: 'bold' }}>BUYER: {receiptData.partyName}</p>
                    {receiptData.isGstBill !== false && receiptData.partyGst && <p style={{ margin: '2px 0', fontWeight: 'bold' }}>GSTIN: {receiptData.partyGst}</p>}
                    <p style={{ margin: '2px 0', fontWeight: 'bold' }}>STATE/CODE: 24- GUJARAT</p>
                  </div>
                  <div style={{ flex: 1, paddingLeft: '10px' }}>
                    <p style={{ margin: '2px 0', fontWeight: 'bold' }}>INVOICE NO: {receiptData.invoiceNo || "N/A"}</p>
                    <p style={{ margin: '2px 0', fontWeight: 'bold' }}>DATE: {receiptData.date}</p>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <table className="pdf-table" style={{ margin: 0, border: 'none' }}>
                    <thead style={{ borderBottom: '1px solid black' }}>
                      <tr>
                        <th style={{ width: '8%', borderTop: 'none' }}>SR. NO</th>
                        <th style={{ width: receiptData.isGstBill !== false ? '42%' : '57%', borderTop: 'none' }}>DESCRIPTION OF ITEM</th>
                        {receiptData.isGstBill !== false && <th style={{ width: '15%', borderTop: 'none' }}>HSN/SAC</th>}
                        <th style={{ width: '10%', borderTop: 'none' }}>QTY</th>
                        <th style={{ width: '10%', borderTop: 'none' }}>RATE</th>
                        <th style={{ width: '15%', borderTop: 'none' }}>AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody style={{ verticalAlign: 'top' }}>
                      {chunk.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          <td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{(index * 35) + itemIndex + 1}</td>
                          <td style={{ borderBottom: 'none', borderTop: 'none' }}>{item.name}</td>
                          {receiptData.isGstBill !== false && <td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{item.hsn || "-"}</td>}
                          <td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{item.qty}</td>
                          <td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{item.rate.toFixed(2)}</td>
                          <td style={{ textAlign: 'center', borderBottom: 'none', borderTop: 'none' }}>{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr style={{ height: '100%' }}>
                        <td style={{ borderTop: 'none', borderBottom: 'none' }}></td>
                        <td style={{ borderTop: 'none', borderBottom: 'none' }}></td>
                        {receiptData.isGstBill !== false && <td style={{ borderTop: 'none', borderBottom: 'none' }}></td>}
                        <td style={{ borderTop: 'none', borderBottom: 'none' }}></td>
                        <td style={{ borderTop: 'none', borderBottom: 'none' }}></td>
                        <td style={{ borderTop: 'none', borderBottom: 'none' }}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {index === printChunks.length - 1 && (
                  <div className="avoid-break" style={{ display: 'flex', borderTop: '1px solid black', fontSize: '10pt', marginTop: 'auto' }}>
                    <div style={{ flex: '60%', padding: '10px', borderRight: '1px solid black', display: 'flex' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', textDecoration: 'underline' }}>BANK DETAILS:-</h4>
                        <p style={{ margin: '2px 0', fontWeight: 'bold' }}>NAME: {receiptData.shopName}</p><p style={{ margin: '2px 0', fontWeight: 'bold' }}>A/C NO: {receiptData.acc || ""}</p><p style={{ margin: '2px 0', fontWeight: 'bold' }}>IFSC: {receiptData.ifsc || ""}</p><p style={{ margin: '2px 0', fontWeight: 'bold' }}>BANK: {receiptData.bank || ""}</p>
                        <div style={{ marginTop: '30px', fontWeight: 'bold' }}>FOR. {receiptData.shopName.toUpperCase()}</div>
                      </div>
                      
                      {/* --- INJECTED QR CODE IN PRINT LAYOUT --- */}
                      {receiptData.upiQr && (
                        <div style={{ width: '150px', marginLeft: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={receiptData.upiQr} alt="Scan to Pay" style={{ width: '130px', height: '130px', objectFit: 'contain', border: '1px solid #000', padding: '4px', borderRadius: '4px' }} />
                          <div style={{ fontSize: '10pt', fontWeight: 'bold', marginTop: '6px', textAlign: 'center' }}>SCAN TO PAY</div>
                        </div>
                      )}

                    </div>
                    <div style={{ flex: '40%' }}>
                      <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>TOTAL AMOUNT IN RS.</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>{receiptData.grossAmount.toFixed(2)}</div></div>
                      {receiptData.discount > 0 && <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>DISCOUNT</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>-{receiptData.discount.toFixed(2)}</div></div>}
                      
                      {receiptData.isGstBill !== false && (
                        <>
                          <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>TAXABLE AMOUNT IN RS.</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>{receiptData.taxable.toFixed(2)}</div></div>
                          <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>CGST</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>{receiptData.cgst.toFixed(2)}</div></div>
                          <div style={{ display: 'flex', borderBottom: '1px solid black' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold' }}>SGST</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right' }}>{receiptData.sgst.toFixed(2)}</div></div>
                        </>
                      )}
                      
                      <div style={{ display: 'flex' }}><div style={{ flex: 1, padding: '4px 8px', borderRight: '1px solid black', fontWeight: 'bold', fontSize: '11pt' }}>GRAND TOTAL IN RS.</div><div style={{ width: '100px', padding: '4px 8px', textAlign: 'right', fontWeight: 'bold', fontSize: '11pt' }}>{receiptData.finalTotal.toFixed(2)}</div></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
