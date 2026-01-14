document.addEventListener('DOMContentLoaded', () => {
    console.log('[main] NIVORGO Premium Engine Initialized');

    const apiBase = 'http://localhost:5000';
    // Product Images
    const images = ['assets/1.png', 'assets/2.png', 'assets/3.png', 'assets/4.png', 'assets/5.png'];

    // --- 1. INITIALIZATION & AOS ---
    if (typeof AOS !== 'undefined' && typeof AOS.init === 'function') {
        AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    }

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

    // --- 3. AUTH HANDLERS (OTP & REGISTRATION) ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = signupForm.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

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
                    localStorage.setItem('pendingEmail', email);
                    alert("✅ OTP Sent! Check your inbox.");
                    document.getElementById('signup-section').style.display = 'none';
                    document.getElementById('otp-section').style.display = 'block';
                } else { 
                    alert("⚠️ " + data.message); 
                }
            } catch (err) { 
                console.error(err);
                alert("❌ Connection error. Check console."); 
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    window.verifyOTP = async function() {
        const email = localStorage.getItem('pendingEmail');
        const otpInput = document.getElementById('otpInput');
        const otp = otpInput.value;

        if (!email) return alert("Session expired. Please register again.");
        if (otp.length !== 6) return alert("Please enter a 6-digit code.");

        try {
            const res = await fetch(`${apiBase}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();

            if (res.ok) {
                alert("🎉 Email Verified! Please log in.");
                localStorage.removeItem('pendingEmail');
                document.getElementById('otp-section').style.display = 'none';
                document.getElementById('login-section').style.display = 'block';
            } else { alert("❌ " + data.message); }
        } catch (err) { alert("Verification failed."); }
    };

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
                    if (data.user.address) localStorage.setItem('userAddress', JSON.stringify(data.user.address));
                    if (data.user.cart) localStorage.setItem('nivorgoCart', JSON.stringify(data.user.cart));
                    window.location.href = "/";
                } else {
                    if (res.status === 401 && data.message.includes("verify")) {
                        alert("⚠️ Your email is not verified yet. Please enter the OTP.");
                        localStorage.setItem('pendingEmail', email);
                        document.getElementById('login-section').style.display = 'none';
                        document.getElementById('otp-section').style.display = 'block';
                    } else { alert("❌ " + data.message); }
                }
            } catch (err) { alert("Login failed."); }
        });
    }

    const toSignup = document.getElementById('to-signup');
    const toLogin = document.getElementById('to-login');
    if(toSignup) toSignup.onclick = (e) => { e.preventDefault(); document.getElementById('login-section').style.display='none'; document.getElementById('otp-section').style.display='none'; document.getElementById('signup-section').style.display='block'; };
    if(toLogin) toLogin.onclick = (e) => { e.preventDefault(); document.getElementById('signup-section').style.display='none'; document.getElementById('otp-section').style.display='none'; document.getElementById('login-section').style.display='block'; };

    // --- 4. CART & CHECKOUT LOGIC ---
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
        renderCartWindow();
        updateCartBadge();
    };

    async function addToBag(item) {
        let cart = JSON.parse(localStorage.getItem('nivorgoCart') || '[]');
        cart.push(item);
        localStorage.setItem('nivorgoCart', JSON.stringify(cart));
        updateCartBadge();
        renderCartWindow();
        bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('cartOffcanvas')).show();
    }

    // --- 5. PRODUCT RENDERING (FIXED QUICK VIEW) ---
    const defaultProducts = [
        { name: 'Keshypushti Hair Oil', price: 1609, desc: 'Deep nourishment.', benefits: ['Volume', 'Vitality'] },
        { name: 'Prati Darunaka Hair Oil', price: 1699, desc: 'Combats dandruff.', benefits: ['Anti-Dandruff', 'Scalp Care'] },
        { name: 'Prati Palitya Hair Oil', price: 1699, desc: 'Premature greying care.', benefits: ['Restores Pigment', 'Shine'] },
        { name: 'Shirodhara Hair Oil', price: 1609, desc: 'Stress relief.', benefits: ['Better Sleep', 'Calming'] },
        { name: 'Keshyadharni Hair Oil', price: 1609, desc: 'Growth formula.', benefits: ['Strength', 'Reduced Breakage'] }
    ];

    function renderProducts(data) {
        const wrapper = document.getElementById('product-swiper-wrapper');
        if (!wrapper) return;

        wrapper.innerHTML = data.map((p, i) => {
            const imgUrl = images[i % images.length];
            const benefitsStr = p.benefits ? p.benefits.join(',') : '';
            
            return `
            <div class="swiper-slide">
                <div class="product-card">
                  <div class="product-image-wrapper">
                    <img src="${imgUrl}" alt="${p.name}" class="main-img">
                    <div class="product-actions">
                      <button class="action-btn quick-view-btn" 
                        data-name="${p.name}" 
                        data-price="${p.price}" 
                        data-desc="${p.desc || 'Pure Ayurvedic Formulation.'}" 
                        data-image="${imgUrl}"
                        data-benefits="${benefitsStr}">
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
        `}).join('');

        if (typeof Swiper !== 'undefined') {
            new Swiper('.product-slider', {
                slidesPerView: 1, spaceBetween: 40, loop: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }
            });
        }
        
        // Attach Cart Listeners
        document.querySelectorAll('.btn-add-to-bag').forEach(btn => {
            btn.onclick = (e) => { e.preventDefault(); addToBag({ name: btn.dataset.name, price: parseFloat(btn.dataset.price) }); };
        });
        
        // Attach Quick View Listeners
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                
                // 1. Get Data
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                const desc = btn.dataset.desc;
                const img = btn.dataset.image;
                const benefits = btn.dataset.benefits ? btn.dataset.benefits.split(',') : [];

                // 2. Populate Modal
                document.getElementById('qv-name').textContent = name;
                document.getElementById('qv-price').textContent = formatPrice(price);
                document.getElementById('qv-desc').textContent = desc;
                document.getElementById('qv-image').src = img;
                
                // Populate List
                const benefitsList = document.getElementById('qv-benefits');
                if (benefitsList) {
                    benefitsList.innerHTML = benefits.map(b => `<li class="mb-2">✨ ${b}</li>`).join('');
                }

                // 3. Set Add to Cart Button Logic
                const addBtn = document.getElementById('qv-add-to-cart');
                // Remove old listeners to prevent duplicates (cloning hack)
                const newAddBtn = addBtn.cloneNode(true);
                addBtn.parentNode.replaceChild(newAddBtn, addBtn);
                
                newAddBtn.onclick = () => {
                    addToBag({ name, price });
                    bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();
                };

                // 4. Show Modal
                new bootstrap.Modal(document.getElementById('quickViewModal')).show();
            };
        });
    }

    // --- 6. CHECKOUT ---
    window.openCheckout = function() {
        const cart = JSON.parse(localStorage.getItem('nivorgoCart') || '[]');
        if (cart.length === 0) return alert("Bag is empty");
        if (!localStorage.getItem('nivorgoToken')) return alert("Please Login First");
        
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('checkout-total').textContent = formatPrice(total);

        const savedAddress = JSON.parse(localStorage.getItem('userAddress') || '{}');
        if (savedAddress.street) {
            document.getElementById('ship-street').value = savedAddress.street;
            document.getElementById('ship-city').value = savedAddress.city;
            document.getElementById('ship-zip').value = savedAddress.zipCode;
            document.getElementById('ship-state').value = savedAddress.state;
        }
        
        bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas')).hide();
        new bootstrap.Modal(document.getElementById('checkoutModal')).show();
    };

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const cart = JSON.parse(localStorage.getItem('nivorgoCart') || '[]');
            const token = localStorage.getItem('nivorgoToken');
            const email = localStorage.getItem('userEmail');

            const payload = {
                email: email,
                items: cart,
                total: cart.reduce((sum, item) => sum + item.price, 0),
                address: {
                    street: document.getElementById('ship-street').value,
                    city: document.getElementById('ship-city').value,
                    zipCode: document.getElementById('ship-zip').value,
                    state: document.getElementById('ship-state').value
                }
            };

            try {
                const res = await fetch(`${apiBase}/place-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    localStorage.setItem('nivorgoCart', '[]');
                    updateCartBadge();
                    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
                    alert("Order Confirmed! 🍃");
                    window.location.href = "/";
                } else { alert("Order failed."); }
            } catch (err) { alert("Server error."); }
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