import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Import Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AboutUs from './pages/AboutUs';
import Ayurveda from './pages/Ayurveda';
import SingleBlog from './pages/SingleBlog';
import Product from './pages/product';
import MoreInfo from './pages/moreinfo';
import { catalogProducts } from './data/catalogData';

const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://api.nivorgo.com';
const images = ['/assets/1.webp', '/assets/2.webp', '/assets/3.webp', '/assets/4.webp', '/assets/5.webp'];

const defaultProducts = catalogProducts.map(p => ({
  ...p,
  name: p.title
}));

// --- Sub-Components (Internal for simplicity) ---

const Navbar = ({ user, cartCount, handleLogout, searchActive, setSearchActive, isMounted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top custom-navbar ${isScrolled || location.pathname !== '/' ? 'scrolled' : ''}`}>
      <div className="container d-flex flex-wrap align-items-center justify-content-between">
        <Link className="navbar-brand me-auto d-flex align-items-center gap-2" to="/">
          <img src="/assets/nivorgo logo Green.png" alt="Nivorgo Logo" className="nav-logo" />
          <img src="/assets/nivorgo 2.png" alt="NIVORGO" className="brand-text-img" />
        </Link>

        {/* Icons (Mobile: Pos 2, Desktop: Pos 3) */}
        <div className="d-flex align-items-center gap-2 mobile-nav-icons order-1 order-lg-3">
          <div className="d-flex align-items-center" id="user-nav-wrapper">
            <form id="search-form" className={`d-flex search-container ${searchActive ? 'active' : ''}`}>
              <input type="text" className="form-control me-2" placeholder="Search products..." />
            </form>
            <button onClick={() => setSearchActive(!searchActive)} className="btn btn-link text-light p-2" style={{ color: isScrolled || location.pathname !== '/' ? '#333 !important' : '' }}>
              <img src="/assets/search.png" alt="Search" className="nav-icon-img" />
            </button>

            {!isMounted ? (
              <button className="btn btn-link text-light p-2" data-bs-toggle="modal" data-bs-target="#authModal" title="Login or Sign Up" style={{ color: isScrolled || location.pathname !== '/' ? '#333 !important' : '' }}>
                <img src="/assets/user.png" alt="User" className="nav-icon-img" />
              </button>
            ) : user ? (
              <div className="d-flex align-items-center gap-3 animate-fade-in d-none d-lg-flex">
                <Link to="/profile" className="text-light small fw-bold text-decoration-none" style={{ letterSpacing: '1px', color: isScrolled || location.pathname !== '/' ? '#333 !important' : '' }}>
                  WELCOME, {user.name.toUpperCase()}
                </Link>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-light px-3" style={{ fontSize: '0.7rem', borderRadius: '20px', color: isScrolled || location.pathname !== '/' ? '#333' : '' }}>LOGOUT</button>
              </div>
            ) : (
              <button className="btn btn-link text-light p-2" data-bs-toggle="modal" data-bs-target="#authModal" title="Login or Sign Up" style={{ color: isScrolled || location.pathname !== '/' ? '#333 !important' : '' }}>
                <img src="/assets/user.png" alt="User" className="nav-icon-img" />
              </button>
            )}

            {/* Mobile Profile Link (Icon only) */}
            {isMounted && user && (
              <Link to="/profile" className="d-lg-none btn btn-link text-light p-2" style={{ color: isScrolled || location.pathname !== '/' ? '#333 !important' : '' }}>
                <img src="/assets/user.png" alt="User" className="nav-icon-img" />
              </Link>
            )}
          </div>

          <button className="btn btn-link position-relative text-light p-2" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas" style={{ color: isScrolled || location.pathname !== '/' ? '#333 !important' : '' }}>
            <img src="/assets/carts.png" alt="Cart" className="nav-icon-img" /> <span className="badge rounded-pill bg-danger">{isMounted ? cartCount : 0}</span>
          </button>
        </div>

        {/* Hamburger (Mobile: Pos 3) */}
        <button onClick={() => setIsNavOpen(!isNavOpen)} className="navbar-toggler border-0 order-2" type="button" aria-controls="navbarContent" aria-expanded={isNavOpen} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu (Mobile: Pos 4 (Order 3 but width 100% forces break), Desktop: Pos 2) */}
        <div className={`collapse navbar-collapse order-3 order-lg-2 ${isNavOpen ? 'show' : ''}`} id="navbarContent">
          <div className="navbar-nav mx-auto text-center">
            <Link className="nav-link px-3" to="/" onClick={() => setIsNavOpen(false)}>Home</Link>
            <Link className="nav-link px-3" to="/about" onClick={() => setIsNavOpen(false)}>About</Link>
            <Link className="nav-link px-3" to="/products" onClick={() => setIsNavOpen(false)}>Products</Link>
            <Link className="nav-link px-3" to="/why-ayurveda" onClick={() => setIsNavOpen(false)}>Blogs</Link>
            <a className="nav-link px-3" href="/#contact" onClick={() => setIsNavOpen(false)}>Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ contactData, setContactData, handleContactSubmit }) => (
  <footer id="contact" className="footer-contact-section">
    <div className="container">
      <div className="row g-5">
        <div className="col-lg-4 footer-logo-col" data-aos="fade-up">
          <div className="d-flex align-items-center gap-3 mb-2">
            <img src="/assets/nivorgo logo Green.png" alt="Nivorgo Logo" className="nav-logo-foo" />
            <img src="/assets/nivorgo 2.png" alt="NIVORGO" className="brand-text-img-foo" />
          </div>
          <p className="text-muted pe-lg-5 mb-5">Bringing ancient Ayurvedic wisdom to your modern ritual. Pure, potent, and thoughtfully sourced.</p>
          <div className="contact-details mt-4">
            <div className="d-flex mb-3"><span className="me-3">📍</span><p className="small mb-0">Pune, Maharashtra, India</p></div>
            <div className="d-flex mb-3"><span className="me-3">✉️</span><p className="small mb-0">nivorgo@gmail.com</p></div>
            <div className="d-flex mb-3"><span className="me-3">📞</span><p className="small mb-0">+91 98332 89760</p></div>
          </div>
        </div>
        <div className="col-lg-8" data-aos="fade-up" data-aos-delay="200">
          <div className="footer-form-wrapper p-4 p-md-5">
            <span className="category-tag mb-2">Connect with us</span>
            <h3 className="font-serif mb-4">Have a question?</h3>
            <form onSubmit={handleContactSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control premium-input" placeholder="Your name" required
                    value={contactData.name} onChange={(e) => setContactData({ ...contactData, name: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control premium-input" placeholder="Your email" required
                    value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea className="form-control premium-input" rows="2" placeholder="Tell us what's on your mind..." required
                    value={contactData.message} onChange={(e) => setContactData({ ...contactData, message: e.target.value })}></textarea>
                </div>
                <div className="col-12 text-end"><button type="submit" className="btn btn-success px-5">Send Message</button></div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="row mt-5 pt-4 border-top">
        <div className="col-md-6 text-center text-md-start"><p className="small text-muted">© 2026 NIVORGO. All Rights Reserved.</p></div>
        <div className="col-md-6 text-center text-md-end">
          <div className="social-links d-flex align-items-center justify-content-end">
            <a href="https://www.instagram.com/niv_orgo?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="me-3 text-decoration-none">
              <img src="/assets/image copy.png" alt="Instagram" className="footer-icon-img" />
            </a>
            <a href="#" className="me-3 text-decoration-none">
              <img src="/assets/image copy 2.png" alt="LinkedIn" className="footer-icon-img" />
            </a>
            <a href="#" className="text-muted small text-decoration-none">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// --- PREDEFINED CHATBOT RESPONSES ---
const botReplies = {
  hairfall: "For hair loss and activating new growth, we recommend our **Keshyadharni Therapy Oil**. It contains 24 selected herbs like Bhringraj, Amla, and Brahmi that nourish the hair root and activate dormant follicles. Apply it generously to the scalp, massage, and leave it on overnight.",
  volume: "Thinning hair caused by styling damage or stress can be treated with **Shirodhara Volumizing Oil**. Rich in onion seeds and rice water extracts, it strengthens hair shafts and adds visual density. Use every alternate day for 45 days for optimal volumizing effects.",
  dandruff: "If you have dandruff or scalp itching, we recommend **Pratidarunaka Therapy Oil**. Formulated with Neem, Lemon Peel, and Tea Tree, it contains powerful botanical antifungals. Apply it to the scalp 40 minutes before washing, then rinse with warm water.",
  greying: "Premature greying is a Pitta (heat) imbalance. **PratiPalitya Therapy Oil** utilizes cooling herbs like Indigo, Henna, and Ratanjot to restore natural pigment and protect follicles from UV damage. Best used as a nightly leave-in treatment.",
  general: "Hello! I am your Nivorgo Ayurvedic Consultant. How can I help you choose the right therapy oil today? You can select one of the popular topics below or describe your concern."
};

// --- MAIN APP ---

export function MainApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: botReplies.general }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Bot Answer Generator
  const handleChatQuestion = (topic, label) => {
    // Add user message
    const userMsg = { sender: 'user', text: label };
    setChatMessages((prev) => [...prev, userMsg]);

    // Answer delay simulated
    setTimeout(() => {
      const answer = botReplies[topic] || botReplies.general;
      setChatMessages((prev) => [...prev, { sender: 'bot', text: answer }]);
    }, 600);
  };

  // Handle typed chat input
  const handleSendChatText = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.toLowerCase();
    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      let reply = "I understand your concern. To provide the best help, could you select one of our therapy topics below or consult with our experts at nivorgo@gmail.com?";
      if (query.includes('fall') || query.includes('growth') || query.includes('grow') || query.includes('loss')) {
        reply = botReplies.hairfall;
      } else if (query.includes('thin') || query.includes('volume') || query.includes('density') || query.includes('thick')) {
        reply = botReplies.volume;
      } else if (query.includes('dandruff') || query.includes('itch') || query.includes('flak') || query.includes('scalp')) {
        reply = botReplies.dandruff;
      } else if (query.includes('grey') || query.includes('white') || query.includes('color') || query.includes('pigment')) {
        reply = botReplies.greying;
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [authSection, setAuthSection] = useState('login');
  const [pendingEmail, setPendingEmail] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // States for modals
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Forms
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [checkoutData, setCheckoutData] = useState({ street: '', city: '', zip: '', state: 'Maharashtra', mobile: '' });
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [discountCode, setDiscountCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [discountMessage, setDiscountMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    fetchProducts();

    // Safely load initial state from localStorage on client side
    try {
      const storedCart = localStorage.getItem('nivorgoCart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      const name = localStorage.getItem('userName');
      const email = localStorage.getItem('userEmail');
      const token = localStorage.getItem('nivorgoToken');
      const address = localStorage.getItem('userAddress');
      if (name && token) {
        setUser({
          name,
          email,
          token,
          address: address ? JSON.parse(address) : {}
        });
      }
      const storedPendingEmail = localStorage.getItem('pendingEmail');
      if (storedPendingEmail) {
        setPendingEmail(storedPendingEmail);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }

    setIsMounted(true);
  }, []);

  // Sync checkout data with user address
  useEffect(() => {
    if (user && user.address) {
      setCheckoutData({
        street: user.address.street || '',
        city: user.address.city || '',
        zip: user.address.zipCode || '',
        state: user.address.state || 'Maharashtra',
        mobile: user.address.mobile_number || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('nivorgoCart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const fetchProducts = async () => {
    // We prioritize catalog products for now as per user request
    console.log('Using catalog products as source');
    setProducts(defaultProducts);

    /* 
    try {
      const res = await axios.get(`${apiBase}/products`);
      // Optional: merge or overwrite if API is desired
      // setProducts(res.data);
    } catch (err) {
      console.warn('API error, sticking with catalog data');
    }
    */
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const addToBag = (product) => {
    const newItem = { name: product.title || product.name, price: product.price };
    setCart([...cart, newItem]);
    const cartEl = document.getElementById('cartOffcanvas');
    if (cartEl) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(cartEl);
      bsOffcanvas.show();
    }
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/login`, loginData);
      const data = res.data;
      localStorage.setItem('nivorgoToken', data.token);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      if (data.user.address) localStorage.setItem('userAddress', JSON.stringify(data.user.address));
      if (data.user.cart) localStorage.setItem('nivorgoCart', JSON.stringify(data.user.cart));

      setUser({ name: data.user.name, email: data.user.email, token: data.token, address: data.user.address || {} });
      alert('Login successful!');
      window.bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
    } catch (err) {
      if (err.response?.status === 401 && err.response?.data?.message?.includes("verify")) {
        alert("⚠️ Your email is not verified yet. Please enter the OTP.");
        setPendingEmail(loginData.email);
        localStorage.setItem('pendingEmail', loginData.email);
        setAuthSection('otp');
      } else {
        alert("❌ " + (err.response?.data?.message || 'Login failed'));
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBase}/register`, signupData);
      localStorage.setItem('pendingEmail', signupData.email);
      setPendingEmail(signupData.email);
      alert("✅ OTP Sent! Check your inbox.");
      setAuthSection('otp');
    } catch (err) {
      alert("⚠️ " + (err.response?.data?.message || 'Signup failed'));
    }
  };

  const verifyOTP = async () => {
    if (!pendingEmail) return alert("Session expired. Please register again.");
    if (otp.length !== 6) return alert("Please enter a 6-digit code.");
    try {
      await axios.post(`${apiBase}/verify-otp`, { email: pendingEmail, otp });
      alert("🎉 Email Verified! Please log in.");
      localStorage.removeItem('pendingEmail');
      setPendingEmail('');
      setAuthSection('login');
    } catch (err) {
      alert("❌ Verification failed.");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (processing) return;
    setProcessing(true);
    if (!user) {
      setProcessing(false);
      // Open login modal and switch to login section
      setAuthSection('login');
      const modalEl = document.getElementById('authModal');
      if (modalEl && window.bootstrap) {
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      }
      return;
    }

    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const discountedTotal = Math.round(cartTotal * (1 - discountRate));
    const totalAmount = discountedTotal;

    const payload = {
      email: user.email,
      items: cart,
      total: totalAmount,
      discount: discountRate,
      address: {
        street: checkoutData.street,
        city: checkoutData.city,
        zipCode: checkoutData.zip,
        state: checkoutData.state,
        mobile_number: checkoutData.mobile,
      }
    };

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // Create order via backend
      const { data: orderData } = await axios.post(`${apiBase}/create-razorpay-order`, { total: totalAmount }, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use the Live or Test key from Environment Variables
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nivorgo Ayurveda",
        description: "Ayurvedic products purchase",
        order_id: orderData.id,
        handler: async function (response) {
          const verifyPayload = {
            ...payload,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          try {
            await axios.post(`${apiBase}/verify-payment`, verifyPayload, {
              headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setCart([]);
            alert("Payment Successful & Order Confirmed! 🍃");
            const bsModal = window.bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
            if (bsModal) bsModal.hide();
            navigate("/profile");
          } catch (verifyErr) {
            alert("Payment Verification Failed!");
            console.error(verifyErr);
          }
        },
        prefill: {
          name: user.name || "Customer",
          email: user.email || "",
          contact: checkoutData.mobile || ""
        },
        theme: {
          color: "#4A5D45" // Match site aesthetics
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment Failed - " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error("Payment initiation error:", err.response?.data || err.message);
      alert("Failed to initiate payment: " + (err.response?.data?.message || err.message));
    }
    setProcessing(false);
  };

  // Contact
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBase}/contact`, contactData);
      alert("Message sent! We will get back to you soon. 🌿");
      setContactData({ name: '', email: '', message: '' });
    } catch (err) {
      alert("Failed to send message.");
    }
  };
  const applyDiscount = () => {
    const discounts = {
      NIVORGODec10: 0.10,
      SPRING12320: 0.12,
    };
    const code = discountCode.trim().toUpperCase();
    if (discounts[code]) {
      setDiscountRate(discounts[code]);
      setDiscountMessage(`✅ ${code} applied – ${discounts[code] * 100}% off`);
    } else {
      setDiscountRate(0);
      setDiscountMessage('❌ Invalid or expired code');
    }
  };
  const openQuickView = (product, img) => {
    setQuickViewProduct({ ...product, img });

    // Use setTimeout to ensure React has updated the state and DOM
    setTimeout(() => {
      const modalEl = document.getElementById('quickViewModal');
      if (modalEl && window.bootstrap) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      } else {
        console.error('Bootstrap or modal element not found');
      }
    }, 100);
  };

  return (
    <div>
      {/* Navbar with Router capabilities - Hide on Admin Portal */}
      {location.pathname !== '/admin-portal' && (
        <Navbar
          user={user}
          cartCount={cart.length}
          handleLogout={handleLogout}
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          isMounted={isMounted}
        />
      )}

      <Routes>
        <Route path="/" element={
          <Home
            products={products}
            addToBag={addToBag}
            openQuickView={openQuickView}
            formatPrice={formatPrice}
            images={images}
          />
        } />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/why-ayurveda" element={<Ayurveda />} />
        <Route path="/blog/:id" element={<SingleBlog />} />
        <Route path="/products" element={
          <Product
            products={products}
            addToBag={addToBag}
            openQuickView={openQuickView}
            formatPrice={formatPrice}
            images={images}
          />
        } />
        <Route path="/moreinfo/:id" element={<MoreInfo
          products={products}
          addToBag={addToBag}
          openQuickView={openQuickView}
          formatPrice={formatPrice}
          images={images} />} />
        <Route path="/profile" element={
          <Profile user={user} setUser={setUser} handleLogout={handleLogout} />
        } />
        <Route path="/admin-portal" element={<Admin />} />
      </Routes>

      {/* Conditional Footer - not on Admin */}
      {location.pathname !== '/admin-portal' && (
        <Footer
          contactData={contactData}
          setContactData={setContactData}
          handleContactSubmit={handleContactSubmit}
        />
      )}

      {/* --- MODALS (Global) --- */}

      {/* Cart Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel" style={{ backgroundColor: '#F9F7F2', width: '400px' }}>
        <div className="offcanvas-header border-bottom p-4">
          <h5 className="font-serif mb-0" id="cartOffcanvasLabel">Your Collection</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-4">
          {cart.length === 0 ? (
            <div className="text-center mt-5"><p className="text-muted">Your bag is empty.</p></div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item d-flex align-items-center mb-4 pb-3 border-bottom animate-fade-in">
                <div className="flex-grow-1">
                  <h6 className="mb-0 font-serif" style={{ fontSize: '0.9rem' }}>{item.name}</h6>
                  <small className="text-muted">{formatPrice(item.price)}</small>
                </div>
                <button className="btn btn-sm text-danger p-0" onClick={() => removeFromCart(index)}>✕</button>
              </div>
            ))
          )}
        </div>
        <div className="offcanvas-footer p-4 border-top">
          <div className="d-flex justify-content-between mb-3">
            <span className="text-muted">Subtotal</span>
            <strong>{formatPrice(cart.reduce((sum, item) => sum + item.price, 0))}</strong>
          </div>
          <button
            className="btn btn-success w-100 py-3"
            onClick={() => {
              if (cart.length === 0) return alert("Bag is empty");
              if (!user) {
                setAuthSection('login');
                const modalEl = document.getElementById('authModal');
                if (modalEl && window.bootstrap) {
                  const cartOffcanvas = window.bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
                  if (cartOffcanvas) cartOffcanvas.hide();

                  const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
                  modal.show();
                }
                return;
              }

              // Check if Bootstrap is loaded
              if (!window.bootstrap) {
                console.error('Bootstrap not loaded yet');
                return;
              }

              const cartOffcanvas = window.bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
              if (cartOffcanvas) {
                cartOffcanvas.hide();
              }

              // Small delay to ensure offcanvas closes before modal opens
              setTimeout(() => {
                const checkoutModalEl = document.getElementById('checkoutModal');
                if (checkoutModalEl && window.bootstrap) {
                  const modal = new window.bootstrap.Modal(checkoutModalEl);
                  modal.show();
                }
              }, 300);
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      <div className="modal fade" id="quickViewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: '#F9F7F2' }}>
            <div className="modal-body p-0">
              <button type="button" className="btn-close position-absolute top-0 end-0 m-3 z-3" data-bs-dismiss="modal" aria-label="Close"></button>
              {quickViewProduct && (
                <div className="row g-0">
                  <div className="col-md-6">
                    <div className="qv-image-container h-100" style={{ background: '#EBE8E2' }}>
                      <img src={quickViewProduct.img} className="img-fluid w-100 h-100" style={{ objectFit: 'cover', minHeight: '450px' }} alt="Product" />
                    </div>
                  </div>
                  <div className="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-center">
                    <span className="category-tag mb-2">AUTHENTIC AYURVEDA</span>
                    <h2 className="font-serif mb-2" style={{ fontSize: '2rem' }}>{quickViewProduct.name}</h2>
                    <h4 className="price-tag mb-4">{formatPrice(quickViewProduct.price)}</h4>
                    <p className="text-muted mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{quickViewProduct.desc || 'Pure Ayurvedic Formulation.'}</p>
                    <div className="benefits-wrapper mb-5">
                      <h6 className="small fw-bold text-uppercase mb-3" style={{ letterSpacing: '1px' }}>Key Benefits:</h6>
                      <ul className="list-unstyled small">
                        {(quickViewProduct.benefits || []).map((b, idx) => (
                          <li key={idx} className="mb-2">✨ {b}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className="btn btn-success w-100 py-3 text-uppercase fw-bold mb-3"
                      style={{ letterSpacing: '2px', borderRadius: '0' }}
                      onClick={() => {
                        addToBag(quickViewProduct);
                        window.bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();
                      }}
                    >
                      Add to Collection
                    </button>
                    <Link
                      to={`/moreinfo/${quickViewProduct.id}`}
                      className="btn btn-outline-success w-100 py-2 text-uppercase fw-bold"
                      style={{ letterSpacing: '1px', borderRadius: '0', fontSize: '0.8rem' }}
                      onClick={() => {
                        window.bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();
                      }}
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <div className="modal fade" id="checkoutModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg p-4">
            <h3 className="font-serif mb-4">Shipping Details</h3>
            <form onSubmit={handlePlaceOrder}>
              <input
                type="text" className="form-control mb-3" placeholder="Street Address" required
                value={checkoutData.street} onChange={(e) => setCheckoutData({ ...checkoutData, street: e.target.value })}
              />
              <div className="row">
                <div className="col-6">
                  <input
                    type="text" className="form-control mb-3" placeholder="City" required
                    value={checkoutData.city} onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text" className="form-control mb-3" placeholder="Zip Code" required
                    value={checkoutData.zip} onChange={(e) => setCheckoutData({ ...checkoutData, zip: e.target.value })}
                  />
                </div>
              </div>
              <input
                type="text" className="form-control mb-4" placeholder="State" required
                value={checkoutData.state} onChange={(e) => setCheckoutData({ ...checkoutData, state: e.target.value })}
              />
              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel" className="form-control" maxLength="10" pattern="\d{10}" placeholder="Enter mob no" required
                  value={checkoutData.mobile} onChange={(e) => setCheckoutData({ ...checkoutData, mobile: e.target.value.replace(/[^0-9]/g, '') })}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Discount Code</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control premium-input border-end-0"
                    placeholder="Enter code (e.g. NIVORGO10)"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-dark"
                    type="button"
                    style={{ borderRadius: '0' }}
                    onClick={applyDiscount}
                  >
                    APPLY
                  </button>
                </div>
                {discountMessage && <div className="mt-2">{discountMessage}</div>}
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span>{formatPrice(cart.reduce((sum, item) => sum + item.price, 0))}</span>
              </div>
              {discountRate > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount ({discountRate * 100}%):</span>
                  <span>-{formatPrice(cart.reduce((sum, item) => sum + item.price, 0) * discountRate)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-4">
                <span>Total Amount:</span>
                <strong>{formatPrice(Math.round(cart.reduce((sum, item) => sum + item.price, 0) * (1 - discountRate)))}</strong>
              </div>
              <button type="submit" className="btn btn-success w-100 py-3" disabled={processing}>
                {processing ? 'Processing...' : 'PLACE ORDER'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <div className="modal fade" id="authModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-body p-5">
              {authSection === 'login' && (
                <div id="login-section animate-fade-in">
                  <h3 className="font-serif text-center mb-4">Login to Nivorgo</h3>
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input
                        type="email" className="form-control premium-input" required
                        value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-bold">Password</label>
                      <input
                        type="password" className="form-control premium-input" required
                        value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-success w-100 py-2">Sign In</button>
                  </form>
                  <p className="text-center mt-4 small text-muted">New to Nivorgo? <a href="#" onClick={(e) => { e.preventDefault(); setAuthSection('signup'); }} className="text-success fw-bold">Create Account</a></p>
                </div>
              )}

              {authSection === 'signup' && (
                <div id="signup-section animate-fade-in">
                  <h3 className="font-serif text-center mb-4">Join Nivorgo</h3>
                  <form onSubmit={handleSignup}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Full Name</label>
                      <input
                        type="text" className="form-control premium-input" required
                        value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input
                        type="email" className="form-control premium-input" required
                        value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-bold">Create Password</label>
                      <input
                        type="password" className="form-control premium-input" required
                        value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-success w-100 py-2">Register</button>
                  </form>
                  <p className="text-center mt-4 small text-muted">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setAuthSection('login'); }} className="text-success fw-bold">Sign In</a></p>
                </div>
              )}

              {authSection === 'otp' && (
                <div id="otp-section animate-fade-in">
                  <h3 className="font-serif text-center mb-2">Verify Email</h3>
                  <p className="text-center text-muted small mb-4">We've sent a 6-digit code to your email.</p>
                  <div className="mb-4">
                    <input
                      type="text" className="form-control premium-input text-center fw-bold" placeholder="000000" maxLength="6" style={{ letterSpacing: '10px', fontSize: '1.5rem' }}
                      value={otp} onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <button onClick={verifyOTP} className="btn btn-success w-100 py-2">Verify & Register</button>
                  <p className="text-center mt-4 small text-muted">Incorrect email? <a href="#" onClick={(e) => { e.preventDefault(); setAuthSection('signup'); }} className="text-success">Try Again</a></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Bubble */}
      {location.pathname !== '/admin-portal' && (
        <div className="floating-chat-bubble" onClick={() => setIsChatOpen(!isChatOpen)} title="Ayurvedic Consultation Chat">
          <svg width="26" height="26" fill="white" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
        </div>
      )}

      {/* Chat Widget Box */}
      {isChatOpen && location.pathname !== '/admin-portal' && (
        <div className="chat-widget-box animate-fade-in">

          {/* Header */}
          <div className="chat-widget-header">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.2rem' }}>🌿</span>
              <div className="lh-sm">
                <div className="fw-bold" style={{ fontSize: '0.9rem' }}>Nivorgo Assistant</div>
                <div className="small opacity-75" style={{ fontSize: '0.7rem' }}>Online consultation</div>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="btn btn-link text-white p-0 m-0 border-0"
              style={{ textDecoration: 'none', fontSize: '1.2rem' }}
            >
              ✕
            </button>
          </div>

          {/* Chat Logs */}
          <div className="chat-widget-body">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-msg ${msg.sender === 'bot' ? 'bot' : 'user'}`}>
                {msg.text.split('\n').map((para, i) => (
                  <p key={i} className="mb-2 last-mb-0" dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </div>
            ))}

            {/* Quick Consultation Suggestions */}
            <div className="chat-suggestions mt-3">
              <div className="small text-muted mb-1 fw-bold">Select a concern:</div>
              <button
                className="chat-suggest-btn"
                onClick={() => handleChatQuestion('hairfall', 'I am experiencing hair loss and want growth.')}
              >
                🍂 Hair Loss & Thinning
              </button>
              <button
                className="chat-suggest-btn"
                onClick={() => handleChatQuestion('volume', 'How do I add density and volume?')}
              >
                🌿 Rebuilding Hair Density
              </button>
              <button
                className="chat-suggest-btn"
                onClick={() => handleChatQuestion('dandruff', 'What is the remedy for dry flakiness/dandruff?')}
              >
                ❄️ Dandruff & Scalp Relief
              </button>
              <button
                className="chat-suggest-btn"
                onClick={() => handleChatQuestion('greying', 'How do I control premature greying?')}
              >
                🖤 Premature Greying Control
              </button>
            </div>
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSendChatText} className="chat-widget-footer">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your scalp concerns..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Wrapper component to provide Router context
function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

export default App;
