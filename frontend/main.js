document.addEventListener('DOMContentLoaded', () => {
  console.log('[main] DOMContentLoaded');

  // --- 1. INITIALIZATION & UTILITIES ---
  if (typeof AOS !== 'undefined' && typeof AOS.init === 'function') {
    AOS.init();
    try { initAboutHeading(); } catch (e) { console.error(e); }
  }

  const apiBase = 'http://localhost:5000';
  const images = ['assets/1.png', 'assets/2.png', 'assets/3.png', 'assets/4.png', 'assets/5.png'];

  function formatPrice(price) {
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price); } 
    catch { return '₹' + price; }
  }

  // Define missing counter function to prevent ReferenceErrors
  function initCounters() {
    console.log('[stats] Counters initialized');
    // Add your counting logic here if needed
  }

  // --- 2. CART LOGIC ---
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
    alert(`${item.name} added to bag!`);
  }
  
  try { setCartCount(getCartCount()); } catch (e) {}

  // --- 3. RENDERING ENGINE ---
  let productSwiper = null;
  let productsCache = null;
  const defaultProducts = [
    { name: 'Keshyadharni Hair Oil', price: 1609 },
    { name: 'Shirodhara Hair Oil', price: 1699 },
    { name: 'Herbal Shampoo', price: 1609 }
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
              <h3>${p.name}</h3>
              <p>${formatPrice(p.price)}</p>
            </div>
          </div>
        </div>
      `).join('');

      if (productSwiper) {
        productSwiper.update();
      } else if (typeof Swiper !== 'undefined') {
        productSwiper = new Swiper('.product-slider', {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          pagination: { el: '.swiper-pagination', clickable: true },
          navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
          breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }
        });
      }
    } else {
      // Fallback Grid Rendering
      const container = document.getElementById('product-list');
      if (container) {
        container.innerHTML = data.map((p, i) => `
          <div class="col-md-4 mb-4">
            <div class="product-card">
               <div class="product-image-wrapper">
                  <img src="${images[i % images.length]}" class="main-img">
                  <div class="product-actions">
                    <button class="action-btn btn-add-to-bag" data-name="${p.name}" data-price="${p.price}">Add to Bag</button>
                  </div>
               </div>
               <div class="product-info"><h5>${p.name}</h5><p>${formatPrice(p.price)}</p></div>
            </div>
          </div>
        `).join('');
      }
    }

    // Attach Listeners to newly rendered elements
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

    // Hover Reveal Logic
    document.querySelectorAll('.product-image-wrapper').forEach(wrap => {
      const sweeper = wrap.querySelector('.product-sweeper');
      wrap.onmouseenter = () => { if(sweeper) sweeper.style.transform = 'translate3d(120%,0,0)'; };
      wrap.onmouseleave = () => { if(sweeper) sweeper.style.transform = ''; };
    });
  }

  // --- 4. API & DATA LOADING ---
  async function loadProducts(showLoading = false) {
    const container = document.getElementById('product-list') || document.getElementById('product-swiper-wrapper');
    if (!container) return;
    
    try {
      const res = await fetch(apiBase + '/products');
      if (!res.ok) throw new Error('API unreachable');
      const data = await res.json();
      productsCache = data;
      renderProducts(data);
    } catch (err) {
      console.warn('Using fallback data:', err.message);
      productsCache = defaultProducts;
      renderProducts(defaultProducts);
    }
  }

  // --- 5. UI COMPONENTS (Search, Navbar, etc.) ---
  function initAboutHeading() {
    const h = document.querySelector('.animated-heading');
    if (!h) return;
    h.innerHTML = h.textContent.trim().split(/\s+/).map(w => `<span>${w}</span>`).join(' ');
    setTimeout(() => h.classList.add('reveal'), 140);
  }

  const navbarEl = document.querySelector('.custom-navbar');
  window.onscroll = () => {
    if (!navbarEl) return;
    window.scrollY > 40 ? navbarEl.classList.add('scrolled') : navbarEl.classList.remove('scrolled');
  };

  // --- 6. START ---
  renderProducts(defaultProducts); // Show immediately
  loadProducts();                  // Then try to fetch fresh data
});