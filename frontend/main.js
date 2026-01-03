document.addEventListener('DOMContentLoaded', () => {
  console.log('[main] DOMContentLoaded');

  if (typeof AOS !== 'undefined' && typeof AOS.init === 'function') {
    AOS.init();
  }

  const apiBase = 'http://localhost:5000';
  const images = ['assets/1.png','assets/2.png','assets/3.png','assets/4.png','assets/5.png'];

  function formatPrice(price){
    try { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price); } catch { return '₹' + price; }
  }

  function setStatus(message, type = 'info', details = ''){
    const container = document.getElementById('product-list');
    if(!container) return;
    let el = document.getElementById('api-debug');
    if(!el){
      el = document.createElement('div');
      el.id = 'api-debug';
      container.parentNode.insertBefore(el, container);
    }
    el.className = `alert alert-${type} py-2`;
    el.innerHTML = `<div class="d-flex justify-content-between align-items-center">
      <div>${message}${details ? (' <small class="text-monospace">' + details + '</small>') : ''}</div>
      <div><button id="api-retry" class="btn btn-sm btn-outline-light">Retry</button></div>
    </div>`;
    const btn = document.getElementById('api-retry');
    if(btn){ btn.onclick = (e)=>{ e.preventDefault(); loadProducts(true); }; }
  }

  // Fallback static products used if API fails
  const defaultProducts = [
    { name: 'Keshyadharni Hair Oil', price: 1609 },
    { name: 'Shirodhara Hair Oil', price: 1699 },
    { name: 'Herbal Shampoo', price: 1609 }
  ];

  // Client-side cache and cart helpers
  let productsCache = null;
  function getCartCount(){ return parseInt(localStorage.getItem('cartCount')||'0', 10); }
  function setCartCount(n){ localStorage.setItem('cartCount', String(n)); const el = document.getElementById('cart-count'); if(el) el.textContent = String(n); }
  function addToBag(item){ const n = getCartCount() + 1; setCartCount(n); console.log('[cart] added', item.name); }

  // Initialize cart badge
  try{ setCartCount(getCartCount()); }catch(e){}

  // Counter animation: animate number elements when visible
  function initCounters(){
    const els = document.querySelectorAll('.number[data-target]');
    if(!els.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target')||'0', 10);
        const duration = 1200; // ms
        let start = 0;
        const stepTime = 30;
        const increment = Math.max(1, Math.floor(target / (duration / stepTime)));
        const timer = setInterval(()=>{
          start += increment;
          if(start >= target){ el.textContent = String(target); clearInterval(timer); }
          else el.textContent = String(start);
        }, stepTime);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    els.forEach(e => observer.observe(e));
  }

  // Ribbon-cut reveal overlay for About image
  function initRibbonReveal(){
    const wrapper = document.querySelector('.about-image-wrapper');
    if(!wrapper) return;
    const ribbon = wrapper.querySelector('.ribbon-overlay');
    if(!ribbon) return;

    let isDown = false;
    let startX = 0;
    let cut = false;

    function doCut(direction){
      if(cut) return;
      cut = true;
      ribbon.classList.add('cut');
      wrapper.classList.add('revealed');
      ribbon.setAttribute('aria-hidden','true');
      ribbon.addEventListener('transitionend', ()=> { try{ ribbon.remove(); }catch(e){} }, { once:true });
    }

    function onPointerDown(e){
      isDown = true;
      startX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
      ribbon.classList.add('active');
      ribbon.style.transition = 'transform 0.2s linear';
    }
    function onPointerMove(e){
      if(!isDown || cut) return;
      const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
      const dx = x - startX;
      ribbon.style.transform = `skewX(-15deg) translateX(${dx}px)`;
      if(Math.abs(dx) > (ribbon.offsetWidth * 0.25)){
        doCut(dx > 0 ? 'right' : 'left');
      }
    }
    function onPointerUp(){
      isDown = false;
      ribbon.classList.remove('active');
      if(!cut) ribbon.style.transform = '';
    }

    ribbon.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    ribbon.addEventListener('click', (e)=>{ e.preventDefault(); doCut('right'); });
    ribbon.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doCut('right'); }});
  }

  // initialize ribbon overlay on load
  initRibbonReveal();

  // also initialize after AOS refresh just in case
  if(window.AOS && AOS.refresh) AOS.refresh();
  window.addEventListener('load', ()=> initRibbonReveal());
  // Cart button click (shows simple summary for now)
  const cartBtn = document.getElementById('cart-button');
  if(cartBtn){ cartBtn.addEventListener('click', ()=>{ alert(`You have ${getCartCount()} item(s) in your bag`); }); }


  function renderProducts(data){
    const container = document.getElementById('product-list');
    if(!container) return;
    container.innerHTML = data.map((p,i)=>`
      <div class="col-md-4 mb-4">
        <div class="flip-card" tabindex="0">
          <div class="flip-card-inner h-100">
            <!-- FRONT -->
            <div class="flip-card-front card h-100 text-center">
              <img src="${images[i % images.length]}" alt="${p.name}" class="product-image card-img-top">
              <div class="card-body">
                <h5 class="card-title">${p.name}</h5>
                <p class="price">${formatPrice(p.price)}</p>
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
      </div>
    `).join('');
    console.log('[products] rendered', data.length);
    const flipCards = Array.from(document.querySelectorAll('.flip-card'));
    flipCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // don't toggle when clicking links
        card.classList.toggle('is-flipped');
      });
    });
    console.log('[products] flip listeners attached to', flipCards.length, 'cards');

    // Attach add-to-bag handlers
    const addButtons = Array.from(document.querySelectorAll('.btn-add-to-bag'));
    addButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price')) || 0;
        addToBag({ name, price });
      });
    });

    // After products are rendered ensure counters will animate when visible
    initCounters();
  }

  async function loadProducts(showLoading = false){
    const container = document.getElementById('product-list');
    if(!container) return;
    if(showLoading) container.innerHTML = '<div class="col-12 text-center py-4">Retrying…</div>';
    
    try{
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

  // Render fallback immediately so users see products even if API fails
  renderProducts(defaultProducts);
  offset = defaultProducts.length;
  // show button if there are likely more (will be corrected when API responds)
  if (loadMoreBtn) loadMoreBtn.style.display = 'inline-block';

  // Initial attempt to load server products
  loadProducts(true, false);
});
