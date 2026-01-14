const apiBase = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
    console.log('[main] NIVORGO Premium Engine Initialized');

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
            // Updated to link to /profile when clicking the name
            userIconBtn.parentElement.innerHTML = `
                <div class="d-flex align-items-center gap-3 animate-fade-in">
                  <a href="/profile" class="text-light small fw-bold text-decoration-none" style="letter-spacing: 1px; border-bottom: 1px solid transparent;" onmouseover="this.style.borderBottom='1px solid white'" onmouseout="this.style.borderBottom='1px solid transparent'">
                    WELCOME, ${name.toUpperCase()}
                  </a>
                  <button id="logout-btn" class="btn btn-sm btn-outline-light px-3" style="font-size: 0.7rem; border-radius: 20px;">LOGOUT</button>
                </div>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.clear();
                window.location.href = "/";
            });
        }
    }

    // --- 3. AUTH HANDLERS ---
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

    // Toggle logic for Modals
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
        const cartEl = document.getElementById('cartOffcanvas');
        if (cartEl) bootstrap.Offcanvas.getOrCreateInstance(cartEl).show();
    }

    // --- 5. PRODUCT RENDERING (Checks if Wrapper exists) ---
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
        
        document.querySelectorAll('.btn-add-to-bag').forEach(btn => {
            btn.onclick = (e) => { e.preventDefault(); addToBag({ name: btn.dataset.name, price: parseFloat(btn.dataset.price) }); };
        });
        
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                const desc = btn.dataset.desc;
                const img = btn.dataset.image;
                const benefits = btn.dataset.benefits ? btn.dataset.benefits.split(',') : [];

                document.getElementById('qv-name').textContent = name;
                document.getElementById('qv-price').textContent = formatPrice(price);
                document.getElementById('qv-desc').textContent = desc;
                document.getElementById('qv-image').src = img;
                
                const benefitsList = document.getElementById('qv-benefits');
                if (benefitsList) {
                    benefitsList.innerHTML = benefits.map(b => `<li class="mb-2">✨ ${b}</li>`).join('');
                }

                const addBtn = document.getElementById('qv-add-to-cart');
                const newAddBtn = addBtn.cloneNode(true);
                addBtn.parentNode.replaceChild(newAddBtn, addBtn);
                
                newAddBtn.onclick = () => {
                    addToBag({ name, price });
                    bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();
                };

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
                    window.location.href = "/profile"; // Redirect to profile to see order
                } else { alert("Order failed."); }
            } catch (err) { alert("Server error."); }
        });
    }

    // --- 7. PROFILE PAGE LOGIC (Fills data if on Profile Page) ---
    const profileNameEl = document.getElementById('profile-name');
    if (profileNameEl) {
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        const address = JSON.parse(localStorage.getItem('userAddress') || '{}');

        if (!name) {
            window.location.href = "/";
        } else {
            profileNameEl.textContent = name;
            document.getElementById('profile-email').textContent = email;
            if (address.street) {
                document.getElementById('profile-address').innerHTML = `
                    ${address.street}<br>${address.city}, ${address.state} - ${address.zipCode}
                `;
            }
            
            // Populate Edit Form if fields exist
            if (document.getElementById('edit-street')) {
                document.getElementById('edit-street').value = address.street || '';
                document.getElementById('edit-city').value = address.city || '';
                document.getElementById('edit-zip').value = address.zipCode || '';
            }
        }

        const editForm = document.getElementById('editProfileForm');
      // Inside main.js
if (editForm) {
    editForm.onsubmit = async (e) => {
        e.preventDefault();
        
        const userEmail = localStorage.getItem('userEmail');
        const newAddress = {
            street: document.getElementById('edit-street').value,
            city: document.getElementById('edit-city').value,
            zipCode: document.getElementById('edit-zip').value,
            state: "Maharashtra" 
        };

        try {
            // URL must match the app.put route in server.js
            const res = await fetch(`${apiBase}/api/user/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, address: newAddress })
            });

            if (res.ok) {
                const data = await res.json();
                // 1. Update localStorage so the page reflects changes immediately
                localStorage.setItem('userAddress', JSON.stringify(data.address));
                alert("Address saved to your account! 🍃");
                location.reload();
            } else {
                alert("Server found, but update failed.");
            }
        } catch (err) {
            console.error("Connection Error:", err);
            alert("Could not reach the server. Is it running?");
        }
    };
}
    }

    // --- 8. STARTUP & GLOBALS ---
    const savedName = localStorage.getItem('userName');
    if (savedName) updateNavbarForUser(savedName);
    updateCartBadge();

    // Fetch products only if we are on a page that displays them
    if (document.getElementById('product-swiper-wrapper')) {
        const defaultProducts = [
            { name: 'Keshypushti Hair Oil', price: 1609, desc: 'Deep nourishment.', benefits: ['Volume', 'Vitality'] },
            { name: 'Prati Darunaka Hair Oil', price: 1699, desc: 'Combats dandruff.', benefits: ['Anti-Dandruff', 'Scalp Care'] },
            { name: 'Prati Palitya Hair Oil', price: 1699, desc: 'Premature greying care.', benefits: ['Restores Pigment', 'Shine'] },
            { name: 'Shirodhara Hair Oil', price: 1609, desc: 'Stress relief.', benefits: ['Better Sleep', 'Calming'] },
            { name: 'Keshyadharni Hair Oil', price: 1609, desc: 'Growth formula.', benefits: ['Strength', 'Reduced Breakage'] }
        ];
        fetch(`${apiBase}/products`).then(r => r.json()).then(renderProducts).catch(() => renderProducts(defaultProducts));
    }

    // Navbar Scroll Effect
    const navbarEl = document.querySelector('.custom-navbar');
    window.addEventListener('scroll', () => {
        if (navbarEl) window.scrollY > 50 ? navbarEl.classList.add('scrolled') : navbarEl.classList.remove('scrolled');
    });

    // Contact Form Logic (only if exists)
    const contactForm = document.getElementById('premium-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent; 
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            const name = contactForm.querySelector('input[placeholder="Your name"]').value;
            const email = contactForm.querySelector('input[placeholder="Your email"]').value;
            const message = contactForm.querySelector('textarea').value;

            try {
                const res = await fetch(`${apiBase}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                if (res.ok) {
                    alert("Message sent! We will get back to you soon. 🌿");
                    contactForm.reset();
                } else {
                    alert("Failed to send message.");
                }
            } catch (err) { alert("Server error."); }
            finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Global Cart Click
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.onclick = (e) => { 
            e.preventDefault(); 
            const cartOffcanvasEl = document.getElementById('cartOffcanvas');
            if (cartOffcanvasEl) {
                renderCartWindow(); 
                bootstrap.Offcanvas.getOrCreateInstance(cartOffcanvasEl).show();
            } else {
                // Redirect logic if on a page without a cart offcanvas
                alert("Redirecting to Home to view your cart...");
                window.location.href = "/";
            }
        };
    }
});
// --- LOAD USER ORDERS ---
const userEmailForOrders = localStorage.getItem('userEmail');
const ordersTable = document.getElementById('orders-tbody');

if (ordersTable && userEmailForOrders) {
    fetch(`${apiBase}/api/user/orders/${userEmailForOrders}`)
        .then(res => {
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, server sent HTML. Check route order in server.js");
            }
            return res.json();
        })
        .then(orders => {
            if (orders.length === 0) {
                ordersTable.innerHTML = '<tr><td colspan="5" class="text-center">You haven\'t placed any orders yet.</td></tr>';
                return;
            }

            ordersTable.innerHTML = orders.map(order => {
                // Determine badge color based on status
                let badgeClass = 'bg-secondary'; // Default
                if (order.status === 'Pending') badgeClass = 'bg-warning text-dark';
                if (order.status === 'Completed') badgeClass = 'bg-success';

                return `
                <tr>
                    <td class="fw-bold">#${order._id.slice(-6).toUpperCase()}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                        <span class="badge rounded-pill ${badgeClass}">
                            ${order.status}
                        </span>
                    </td>
                    <td>₹${order.totalAmount}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-success" onclick='viewOrderItems(${JSON.stringify(order.items)})'>
                            View Items
                        </button>
                    </td>
                </tr>
            `}).join('');
        })
        .catch(err => {
            console.error("Order Fetch Error:", err);
            ordersTable.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load orders.</td></tr>';
        });
}
// Inside your fetchOrders block in main.js
ordersTable.innerHTML = orders.map(order => {
    // 1. Logic to choose badge color
    let badgeStyle = "bg-warning text-dark"; // Default for 'Pending'
    
    if (order.status === 'Completed') {
        badgeStyle = "bg-success text-white";
    } else if (order.status === 'Cancelled') {
        badgeStyle = "bg-danger text-white";
    }

    // 2. Return the row with the dynamic badge
    return `
        <tr>
            <td class="fw-bold">#${order._id.slice(-6).toUpperCase()}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <span class="badge rounded-pill ${badgeStyle}">
                    ${order.status}
                </span>
            </td>
            <td>₹${order.totalAmount}</td>
            <td>
                <button class="btn btn-sm btn-outline-success" onclick='viewOrderItems(${JSON.stringify(order.items)})'>
                    View Items
                </button>
            </td>
        </tr>
    `;
}).join('');