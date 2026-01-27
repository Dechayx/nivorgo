import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import axios from 'axios';

// Make Bootstrap globally available
if (typeof window !== 'undefined') {
  window.bootstrap = bootstrap;
}

// Import Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AboutUs from './pages/AboutUs';
import Ayurveda from './pages/Ayurveda';

const apiBase = 'http://localhost:5000';
const images = ['/assets/1.png', '/assets/2.png', '/assets/3.png', '/assets/4.png', '/assets/5.png'];

const defaultProducts = [{ name: 'Keshypushti Hair Oil', category: 'Ayurvedic Hair Oils', price: 1609, mrp: 1909, desc: 'Deep nourishment for volume & vitality.', benefits: ['Volume', 'Vitality'] },
{ name: 'Pratidarunaka Hair Oil', category: 'Ayurvedic Hair Oils', price: 1609, mrp: 1909, desc: 'Effective relief from dandruff & itchiness.', benefits: ['Anti-Dandruff', 'Scalp Care'] },
{ name: 'Prati Palitya Hair Oil', category: 'Ayurvedic Hair Oils', price: 1699, mrp: 1999, desc: 'Prevents premature greying & restores shine.', benefits: ['Restores Pigment', 'Shine'] },
{ name: 'Shirodhara Hair Oil', category: 'Ayurvedic Hair Oils', price: 1609, mrp: 1909, desc: 'Relieves stress & promotes deep sleep.', benefits: ['Better Sleep', 'Calming'] },
{ name: 'Keshyadharni Hair Oil', category: 'Ayurvedic Hair Oils', price: 1609, mrp: 1909, desc: 'Strengthens roots to reduce hair fall.', benefits: ['Strength', 'Reduced Breakage'] }
];

// --- Sub-Components (Internal for simplicity) ---

const Navbar = ({ user, cartCount, handleLogout, searchActive, setSearchActive }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top custom-navbar ${isScrolled || location.pathname !== '/' ? 'scrolled' : ''}`}
      style={location.pathname !== '/' ? { backgroundImage: "url('/assets/image.png')", backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      <div className="container d-flex flex-wrap align-items-center justify-content-between">
        <Link className="navbar-brand me-auto d-flex align-items-center gap-2" to="/">
          <img src="/assets/niv orgo logo.png" alt="Nivorgo Logo" className="nav-logo" />
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

            {user ? (
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
            {user && (
              <Link to="/profile" className="d-lg-none btn btn-link text-light p-2" style={{ color: isScrolled || location.pathname !== '/' ? '#333 !important' : '' }}>
                <img src="/assets/user.png" alt="User" className="nav-icon-img" />
              </Link>
            )}
          </div>

          <button className="btn btn-link position-relative text-light p-2" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas" style={{ color: isScrolled || location.pathname !== '/' ? '#333 !important' : '' }}>
            <img src="/assets/carts.png" alt="Cart" className="nav-icon-img" /> <span className="badge rounded-pill bg-danger">{cartCount}</span>
          </button>
        </div>

        {/* Hamburger (Mobile: Pos 3) */}
        <button className="navbar-toggler border-0 order-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu (Mobile: Pos 4 (Order 3 but width 100% forces break), Desktop: Pos 2) */}
        <div className="collapse navbar-collapse order-3 order-lg-2" id="navbarContent">
          <div className="navbar-nav mx-auto text-center">
            <a className="nav-link px-3" href="/">Home</a>
            <Link className="nav-link px-3" to="/about">About</Link>
            <a className="nav-link px-3" href="/#products">Products</a>
            <Link className="nav-link px-3" to="/why-ayurveda">Why Ayurveda</Link>
            <a className="nav-link px-3" href="/#contact">Contact</a>
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
            <img src="/assets/niv orgo logo.png" alt="Nivorgo Logo" className="nav-logo-foo" />
            <img src="/assets/nivorgo 2.png" alt="NIVORGO" className="brand-text-img-foo" />
          </div>
          <p className="text-muted pe-lg-5 mb-5">Bringing ancient Ayurvedic wisdom to your modern ritual. Pure, potent, and thoughtfully sourced.</p>
          <div className="contact-details mt-4">
            <div className="d-flex mb-3"><span className="me-3">📍</span><p className="small mb-0">Pune, Maharashtra, India</p></div>
            <div className="d-flex mb-3"><span className="me-3">✉️</span><p className="small mb-0">nivorgo@gmail.com</p></div>
            <div className="d-flex mb-3"><span className="me-3">📞</span><p className="small mb-0">+91 80820 60888</p></div>
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
            <a href="#" className="me-3 text-decoration-none">
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

// --- MAIN APP ---

function MainApp() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('nivorgoCart') || '[]'));
  const [user, setUser] = useState(() => {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('nivorgoToken');
    // Also try to retrieve address
    const address = JSON.parse(localStorage.getItem('userAddress') || '{}');
    return name ? { name, email, token, address } : null;
  });
  const [searchActive, setSearchActive] = useState(false);
  const [authSection, setAuthSection] = useState('login');
  const [pendingEmail, setPendingEmail] = useState(localStorage.getItem('pendingEmail') || '');

  // States for modals
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Forms
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [checkoutData, setCheckoutData] = useState({ street: '', city: '', zip: '', state: 'Maharashtra', mobile: '' });
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    fetchProducts();
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
    localStorage.setItem('nivorgoCart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${apiBase}/products`);
      setProducts(res.data);
    } catch (err) {
      console.warn('Using default products due to API error');
      setProducts(defaultProducts);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const addToBag = (product) => {
    const newItem = { name: product.name, price: product.price };
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

  // Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first");
    const payload = {
      email: user.email,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price, 0),
      address: {
        street: checkoutData.street,
        city: checkoutData.city,
        zipCode: checkoutData.zip,
        state: checkoutData.state,
        mobile_number: checkoutData.mobile,
      }
    };
    try {
      await axios.post(`${apiBase}/place-order`, payload, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setCart([]);
      alert("Order Confirmed! 🍃");
      const bsModal = window.bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
      bsModal.hide();
      window.location.href = "/profile";
    } catch (err) {
      alert("Order failed.");
    }
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
        <Route path="/profile" element={
          <Profile user={user} setUser={setUser} />
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
              if (!user) return alert("Please Login First");

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
                      className="btn btn-success w-100 py-3 text-uppercase fw-bold"
                      style={{ letterSpacing: '2px', borderRadius: '0' }}
                      onClick={() => {
                        addToBag(quickViewProduct);
                        window.bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();
                      }}
                    >
                      Add to Collection
                    </button>
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
              <div className="d-flex justify-content-between mb-4">
                <span>Total Amount:</span>
                <strong>{formatPrice(cart.reduce((sum, item) => sum + item.price, 0))}</strong>
              </div>
              <button type="submit" className="btn btn-success w-100 py-3">PLACE ORDER</button>
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
