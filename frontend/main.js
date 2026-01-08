document.addEventListener('DOMContentLoaded', () => {
    console.log('[main] NIVORGO Premium Engine Initialized');

    // --- 1. INITIALIZATION & AOS ---
    if (typeof AOS !== 'undefined' && typeof AOS.init === 'function') {
        AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    }

    const apiBase = 'http://localhost:5000';
    const images = ['assets/1.png', 'assets/2.png', 'assets/3.png', 'assets/4.png', 'assets/5.png'];

    // --- 2. AUTHENTICATION UI LOGIC ---
    function updateNavbarForUser(name) {
        const userIconBtn = document.getElementById('user-icon');
        if (!userIconBtn) return;

        if (name) {
            userIconBtn.parentElement.innerHTML = `
                <div class="d-flex align-items-center gap-3 animate-fade-in">
                  <span class="text-light small fw-bold" style="letter-spacing: 1px;">WELCOME, ${name.toUpperCase()}</span>
                  <button id="logout-btn" class="btn btn-sm btn-outline-light px-3" style="font-size: 0.7rem; border-radius: 20px;">LOGOUT</button>
                </div>
            `;

            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.clear();
                window.location.href = "/";
            });
        }
    }

    // --- 3. TOOLS & CART ENGINE ---
    function formatPrice(price) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
    }

    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('nivorgoCart') || '[]');
        const el = document.getElementById('cart-count');
        if (el) el.textContent = String(cart.length);
    }

    function renderCartWindow() {
        const cartContainer = document.getElementById('cart-items-container');
        const totalEl = document.getElementById('cart-total-price');
        const cart = JSON.parse(localStorage.getItem('nivorgoCart') || '[]');

        if (!cartContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = `<div class="text-center mt-5"><p class="text-muted">Your bag is empty.</p></div>`;
            if (totalEl) totalEl.textContent = "₹0";
            return;
        }

        let total = 0;
        cartContainer.innerHTML = cart.map((item, index) => {
            total += item.price;
            return `
                <div class="cart-item d-flex align-items-center mb-4 pb-3 border-bottom animate-fade-in">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 font-serif" style="font-size: 0.9rem;">${item.name}</h6>
                        <small class="text-muted">${formatPrice(item.price)}</small>
                    </div>
                    <button class="btn btn-sm text-danger p-0" onclick="removeFromCart(${index})">✕</button>
                </div>
            `;
        }).join('');

        if (totalEl) totalEl.textContent = formatPrice(total);
    }

    window.removeFromCart = async function(index) {
        let cart = JSON.parse(localStorage.getItem('nivorgoCart') || '[]');
        cart.splice(index, 1);
        localStorage.setItem('nivorgoCart', JSON.stringify(cart));
        
        const email = localStorage.getItem('userEmail');
        if (email) {
            await fetch(`${apiBase}/sync-cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, cartItems: cart })
            });
        }
        renderCartWindow();
        updateCartBadge();
    };

    async function addToBag(item) {
        let cart = JSON.parse(localStorage.getItem('nivorgoCart') || '[]');
        cart.push(item);
        localStorage.setItem('nivorgoCart', JSON.stringify(cart));

        const email = localStorage.getItem('userEmail');
        if (email) {
            await fetch(`${apiBase}/sync-cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, cartItems: cart })
            });
        }

        updateCartBadge();
        renderCartWindow();
        bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('cartOffcanvas')).show();
    }

    // --- 4. PRODUCT RENDERING ---
    const defaultProducts = [
        { name: 'Keshyadharni Hair Oil', price: 1609, desc: 'Deeply nourishes scalp.', benefits: ['Prevents hair fall'] },
        { name: 'Shirodhara Hair Oil', price: 1699, desc: 'Stress relief blend.', benefits: ['Relieves stress'] },
        { name: 'Pratidarunaka Hair Oil', price: 1609, desc: 'Anti-dandruff formula.', benefits: ['Anti-dandruff'] },
        { name: 'Ayurvedic Wellness Serum', price: 1850, desc: 'Daily shine serum.', benefits: ['Instant shine'] }
    ];

    function renderProducts(data) {
        const wrapper = document.getElementById('product-swiper-wrapper');
        if (!wrapper) return;

        wrapper.innerHTML = data.map((p, i) => `
            <div class="swiper-slide">
                <div class="product-card">
                  <div class="product-image-wrapper">
                    <img src="${images[i % images.length]}" alt="${p.name}" class="main-img">
                    <div class="product-actions">
                      <button class="action-btn quick-view-btn" 
                        data-name="${p.name}" 
                        data-desc="${p.desc || ''}" 
                        data-benefits="${p.benefits ? p.benefits.join(', ') : ''}">
                        Quick View
                      </button>
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

        if (typeof Swiper !== 'undefined') {
            new Swiper('.product-slider', {
                slidesPerView: 1, spaceBetween: 40, loop: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }
            });
        }
        attachProductListeners();
    }

    function attachProductListeners() {
        document.querySelectorAll('.btn-add-to-bag').forEach(btn => {
            btn.onclick = (e) => { e.preventDefault(); addToBag({ name: btn.dataset.name, price: parseFloat(btn.dataset.price) }); };
        });

        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const card = btn.closest('.product-card');
                const name = btn.dataset.name;
                const desc = btn.dataset.desc;
                const benefits = btn.dataset.benefits ? btn.dataset.benefits.split(', ') : [];
                const priceText = card.querySelector('.price-tag').textContent;
                const img = card.querySelector('.main-img').src;

                document.getElementById('qv-name').textContent = name;
                document.getElementById('qv-price').textContent = priceText;
                document.getElementById('qv-image').src = img;
                if(document.getElementById('qv-desc')) document.getElementById('qv-desc').textContent = desc;
                const bEl = document.getElementById('qv-benefits');
                if(bEl) bEl.innerHTML = benefits.map(b => `<li class="mb-2">✨ ${b}</li>`).join('');

                document.getElementById('qv-add-to-cart').onclick = () => {
                    const priceNum = parseFloat(priceText.replace(/[^0-9.-]+/g,""));
                    addToBag({ name, price: priceNum });
                };

                new bootstrap.Modal(document.getElementById('quickViewModal')).show();
            };
        });
    }

    // --- 5. AUTH HANDLERS ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            try {
                const res = await fetch(`${apiBase}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    alert("Account Created! Please Sign In.");
                    document.getElementById('to-login').click(); // Switches view back to login
                } else {
                    alert(data.message);
                }
            } catch (err) { alert("Registration error. Check server."); }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const res = await fetch(`${apiBase}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('nivorgoToken', data.token);
                    localStorage.setItem('userName', data.user.name);
                    localStorage.setItem('userEmail', data.user.email);
                    if (data.user.cart) localStorage.setItem('nivorgoCart', JSON.stringify(data.user.cart));
                    window.location.href = "/";
                } else { alert(data.message); }
            } catch (err) { alert("Login failed."); }
        });
    }

    // Modal View Toggles
    const toSignup = document.getElementById('to-signup');
    const toLogin = document.getElementById('to-login');
    if(toSignup) toSignup.onclick = (e) => { e.preventDefault(); document.getElementById('login-section').style.display='none'; document.getElementById('signup-section').style.display='block'; };
    if(toLogin) toLogin.onclick = (e) => { e.preventDefault(); document.getElementById('signup-section').style.display='none'; document.getElementById('login-section').style.display='block'; };

    // --- 6. CHECKOUT LOGIC ---
    window.openCheckout = function() {
        const cart = JSON.parse(localStorage.getItem('nivorgoCart') || '[]');
        if (cart.length === 0) return alert("Bag is empty");
        if (!localStorage.getItem('nivorgoToken')) return alert("Please Login First");
        
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('checkout-total').textContent = formatPrice(total);
        
        // Hide Cart Offcanvas and Show Checkout Modal
        bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas')).hide();
        new bootstrap.Modal(document.getElementById('checkoutModal')).show();
    };

   const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 1. Get Data from LocalStorage
            const cart = JSON.parse(localStorage.getItem('nivorgoCart') || '[]');
            const token = localStorage.getItem('nivorgoToken');
            const email = localStorage.getItem('userEmail');

            // 2. Safety Checks
            if (cart.length === 0) return alert("Your bag is empty!");
            if (!token || !email) {
                alert("Please login to complete your order.");
                return;
            }

            // 3. Construct Payload
            const payload = {
                email: email,
                items: cart,
                total: cart.reduce((sum, item) => sum + item.price, 0),
                address: {
                    street: document.getElementById('ship-street').value.trim(),
                    city: document.getElementById('ship-city').value.trim(),
                    zipCode: document.getElementById('ship-zip').value.trim(),
                    state: document.getElementById('ship-state').value.trim()
                }
            };

            // 4. Submit to Server
            try {
                // Show a loading state on the button
                const submitBtn = checkoutForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = "Processing...";

                const res = await fetch(`${apiBase}/place-order`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Passing the JWT token for security
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    // Success Logic
                    localStorage.setItem('nivorgoCart', '[]'); // Clear local cart
                    updateCartBadge(); // Reset the red circle in navbar
                    
                    // Hide Modal manually if it stays stuck
                    const modalEl = document.getElementById('checkoutModal');
                    const modalInstance = bootstrap.Modal.getInstance(modalEl);
                    if (modalInstance) modalInstance.hide();

                    alert("Order Confirmed! Your Ayurvedic ritual is on its way. 🍃");
                    window.location.href = "/"; // Refresh to clear state
                } else { 
                    const data = await res.json();
                    alert(data.message || "Failed to place order."); 
                }
            } catch (err) { 
                console.error("Order error:", err);
                alert("Server error during checkout. Please check your connection."); 
            } finally {
                // Re-enable button if it failed
                const submitBtn = checkoutForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = "PLACE ORDER";
            }
        });
    }
    // --- STARTUP ---
    const savedName = localStorage.getItem('userName');
    if (savedName) updateNavbarForUser(savedName);
    updateCartBadge();

    fetch(`${apiBase}/products`).then(r => r.json()).then(renderProducts).catch(() => renderProducts(defaultProducts));

    const navbarEl = document.querySelector('.custom-navbar');
    window.addEventListener('scroll', () => {
        if (navbarEl) window.scrollY > 50 ? navbarEl.classList.add('scrolled') : navbarEl.classList.remove('scrolled');
    });

    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.onclick = (e) => { e.preventDefault(); renderCartWindow(); bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('cartOffcanvas')).show(); };
    }
});