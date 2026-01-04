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

            <!-- BACK -->
            <div class="flip-card-back">
              <div class="card h-100 border-0 d-flex flex-column justify-content-center align-items-center">
                <div class="p-3 text-center">
                  <h5 class="mb-2">Quick Details</h5>
                  <p class="small mb-3">Pure Ayurvedic formula. No chemicals.</p>
                  <a href="#" class="btn btn-success btn-sm">View / Buy</a>
                  <button class="btn btn-outline-success btn-sm btn-add-to-bag mt-2" data-name="${p.name}" data-price="${p.price}">Add to bag</button>
                </div>
              </div>
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
      if(!res.ok){
        const text = await res.text().catch(()=>res.statusText||'');
        const msg = `API error: ${res.status} ${res.statusText}`;
        console.error(msg, text);
        setStatus(msg, 'danger', text);
        // show fallback cards so UI is usable
        setStatus('Using fallback products', 'warning', text);
        productsCache = defaultProducts;
        renderProducts(defaultProducts);
        return;
      }
      const data = await res.json();
      if(!Array.isArray(data) || data.length===0){
        setStatus('No products found', 'warning');
        renderProducts(defaultProducts);
        return;
      }
      
      // cache fetched products for search
      productsCache = data;
      renderProducts(data);
      if(window.AOS && AOS.refresh) AOS.refresh();
    }catch(err){
      console.error('Failed to load products', err);
      setStatus('Network error: ' + err.message, 'danger');
      // render fallback products so UI shows cards
      setStatus('Using fallback products', 'warning', err.message);
      productsCache = defaultProducts;
      renderProducts(defaultProducts);
    }
  }

  // State for pagination
  let offset = 0;
  const limit = 3;
  let total = null;

  // Wire up Load more button
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadProducts(true, true);
    });
  }

  // Search overlay handling (open overlay, submit to filter products)
  const searchOpenBtn = document.getElementById('search-open');
  const searchOverlay = document.getElementById('search-overlay');
  const overlayForm = document.getElementById('overlay-search-form');
  const overlayInput = document.getElementById('overlay-search-input');
  const searchCloseBtn = document.getElementById('search-close');

  if(searchOpenBtn && searchOverlay && overlayInput){
    searchOpenBtn.addEventListener('click', ()=>{
      searchOverlay.classList.add('active');
      overlayInput.focus();
    });
    if(searchCloseBtn) searchCloseBtn.addEventListener('click', ()=> searchOverlay.classList.remove('active'));
    searchOverlay.addEventListener('click', (e)=>{ if(e.target === searchOverlay) searchOverlay.classList.remove('active'); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && searchOverlay.classList.contains('active')) searchOverlay.classList.remove('active'); });
  }

  if(overlayForm){
    overlayForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const q = overlayInput.value.trim().toLowerCase();
      searchOverlay.classList.remove('active');
      if(!q){ if(productsCache) renderProducts(productsCache); return; }
      if(!productsCache){ // no cached results yet; try loading then filtering
        loadProducts().then(()=>{ if(productsCache) renderProducts(productsCache.filter(p=>p.name.toLowerCase().includes(q))); });
        return;
      }
      const results = productsCache.filter(p => (p.name || '').toLowerCase().includes(q));
      renderProducts(results.length ? results : [{ name: 'No results for "' + q + '"', price: 0 }]);
    });
  }

  // Navbar scroll behaviour: add .scrolled when page is scrolled down
  const navbarEl = document.querySelector('.custom-navbar');
  function updateNavbarScroll(){ if(!navbarEl) return; if(window.scrollY > 40) navbarEl.classList.add('scrolled'); else navbarEl.classList.remove('scrolled'); }
  window.addEventListener('scroll', updateNavbarScroll);
  updateNavbarScroll();

  // --- 6. START ---
  renderProducts(defaultProducts); // Show immediately
  loadProducts();                  // Then try to fetch fresh data
});