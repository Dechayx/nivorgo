document.addEventListener('DOMContentLoaded', () => {
  console.log('[main] NIVORGO Premium Engine Initialized');

  // --- 1. INITIALIZATION & AOS ---
  if (typeof AOS !== 'undefined' && typeof AOS.init === 'function') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  const apiBase = 'http://localhost:5000';
  const images = ['assets/1.png', 'assets/2.png', 'assets/3.png', 'assets/4.png', 'assets/5.png'];

  // Luxury Price Formatter (en-IN)
  function formatPrice(price) {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(price);
    } catch {
      return '₹' + price;
    }
  }

  // Define missing counter function
  function initCounters() {
    console.log('[stats] Premium Counters Active');
  }

  // --- 2. CART & PERSISTENCE ---
  function getCartCount() { return parseInt(localStorage.getItem('cartCount') || '0', 10); }
  function setCartCount(n) {
    localStorage.setItem('cartCount', String(n));
    const el = document.getElementById('cart-count');
    if (el) el.textContent = String(n);
  }
  function addToBag(item) {
    const n = getCartCount() + 1;
    setCartCount(n);
    console.log('[cart] added', item.name);
    // Custom premium toast/alert instead of native alert for better UX
    showPremiumToast(`${item.name} added to your collection`);
  }

  function showPremiumToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'premium-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('reveal'), 100);
    setTimeout(() => {
      toast.classList.remove('reveal');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  try { setCartCount(getCartCount()); } catch (e) {}

  // --- 3. RENDERING ENGINE (Editorial Slider) ---
  let productSwiper = null;
  let productsCache = null;
  const defaultProducts = [
    { name: 'Keshyadharni Hair Oil', price: 1609 },
    { name: 'Shirodhara Hair Oil', price: 1699 },
    { name: 'Pratidarunaka Hair Oil', price: 1609 },
    { name: 'Ayurvedic Wellness Serum', price: 1850 }
  ];

  function renderProducts(data) {
    const swiperEl = document.querySelector('.product-slider');
    const wrapper = document.getElementById('product-swiper-wrapper');

    if (swiperEl && wrapper) {
      wrapper.innerHTML = data.map((p, i) => `
        <div class="swiper-slide">
          <div class="product-card">
            <div class="product-image-wrapper">
              <img src="${images[i % images.length]}" alt="${p.name}" class="main-img">
              <div class="product-sweeper" aria-hidden="true"></div>
              <div class="product-actions">
                <button class="action-btn quick-view">Quick View</button>
                <button class="action-btn cart-btn btn-add-to-bag" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
              </div>
            </div>
            <div class="product-info">
              <h3 class="font-serif">${p.name}</h3>
              <p class="price-tag">${formatPrice(p.price)}</p>
            </div>
          </div>
        </div>
      `).join('');

      if (productSwiper) {
        productSwiper.update();
      } else if (typeof Swiper !== 'undefined') {
        productSwiper = new Swiper('.product-slider', {
          slidesPerView: 1,
          spaceBetween: 40,
          loop: true,
          pagination: { el: '.swiper-pagination', clickable: true },
          navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
          breakpoints: { 
            640: { slidesPerView: 2 }, 
            1024: { slidesPerView: 4 } 
          }
        });
      }
    } else {
      // Fallback Grid Rendering
      const container = document.getElementById('product-list');
      if (container) {
        container.innerHTML = data.map((p, i) => `
          <div class="col-md-4 mb-4" data-aos="fade-up">
            <div class="product-card">
               <div class="product-image-wrapper">
                  <img src="${images[i % images.length]}" class="main-img">
                  <div class="product-actions">
                    <button class="action-btn btn-add-to-bag" data-name="${p.name}" data-price="${p.price}">Add to Bag</button>
                  </div>
               </div>
               <div class="product-info"><h3>${p.name}</h3><p>${formatPrice(p.price)}</p></div>
            </div>
          </div>
        `).join('');
      }
    }

    attachProductListeners();
    initCounters();
  }

  function attachProductListeners() {
    document.querySelectorAll('.btn-add-to-bag').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        addToBag({ name: btn.dataset.name, price: parseFloat(btn.dataset.price) || 0 });
      };
    });

    // Premium Glide/Sweep Logic
    document.querySelectorAll('.product-image-wrapper').forEach(wrap => {
      const sweeper = wrap.querySelector('.product-sweeper');
      wrap.onmouseenter = () => { if(sweeper) sweeper.style.transform = 'translate3d(120%,0,0)'; };
      wrap.onmouseleave = () => { if(sweeper) sweeper.style.transform = ''; };
    });
  }

  // --- 4. API & DATA LOADING ---
  async function loadProducts() {
    try {
      const res = await fetch(apiBase + '/products');
      if (!res.ok) throw new Error('Using local data');
      const data = await res.json();
      productsCache = data;
      renderProducts(data);
    } catch (err) {
      console.warn('API Offline - Using Premium Fallback');
      productsCache = defaultProducts;
      renderProducts(defaultProducts);
    }
  }

  // --- 5. UI COMPONENTS (Hero Parallax & Navbar) ---
  const navbarEl = document.querySelector('.custom-navbar');
  const heroEl = document.querySelector('.hero');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Navbar Scroll Effect
    if (navbarEl) {
      scrollPos > 50 ? navbarEl.classList.add('scrolled') : navbarEl.classList.remove('scrolled');
    }

    // Hero Parallax Effect
    if (heroEl) {
      heroEl.style.backgroundPositionY = (scrollPos * 0.4) + 'px';
    }
  });

  // Search Logic (merged from original)
  const searchOpenBtn = document.getElementById('search-open');
  const searchOverlay = document.getElementById('search-overlay');
  const overlayInput = document.getElementById('overlay-search-input');
  
  if(searchOpenBtn && searchOverlay) {
    searchOpenBtn.onclick = () => {
      searchOverlay.classList.add('active');
      overlayInput.focus();
    };
    document.getElementById('search-close').onclick = () => searchOverlay.classList.remove('active');
  }

  // --- 6. START ---
  renderProducts(defaultProducts); 
  loadProducts(); 

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('premium-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Show premium toast if you have it, else use alert
            alert("Thank you! Your message has been sent to NIVORGO.");
            contactForm.reset();
        });
    }
});
});