import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
  "/assets/testimonials/23.png",
  "/assets/testimonials/24.png",
  "/assets/testimonials/25.png",
  "/assets/testimonials/26.png",
  "/assets/testimonials/27.png",
  "/assets/testimonials/28.png",
  "/assets/testimonials/29.png",
  "/assets/testimonials/30.png",
  "/assets/testimonials/31.png",
  "/assets/testimonials/32.png"
];

const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
        if (i <= floor) {
            stars.push(<span key={i} style={{ color: '#B4846C', fontSize: '0.95rem' }}>★</span>);
        } else if (i - 0.5 <= rating) {
            stars.push(
                <span key={i} style={{ color: '#B4846C', fontSize: '0.95rem', position: 'relative', display: 'inline-block' }}>
                    ★
                </span>
            );
        } else {
            stars.push(<span key={i} style={{ color: '#D3CACA', fontSize: '0.95rem' }}>★</span>);
        }
    }
    return <div className="d-flex gap-1">{stars}</div>;
};


const Home = ({ products, addToBag, openQuickView, formatPrice, images }) => {
    const [selectedTestimonial, setSelectedTestimonial] = React.useState(null);
    const marqueeRef = React.useRef(null);

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedTestimonial(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    React.useEffect(() => {
        const container = marqueeRef.current;
        if (!container) return;

        let frameId;
        const update3D = () => {
            const rect = container.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const cards = container.querySelectorAll('.testimonial-card');
            const range = 500;

            cards.forEach((card) => {
                const cr = card.getBoundingClientRect();
                const cardCenter = cr.left + cr.width / 2;
                const dist = Math.abs(cardCenter - center);

                if (dist < range) {
                    const factor = 1 - dist / range;
                    const scale = 1 + 0.1 * factor;
                    const z = 60 * factor;
                    card.style.transform = `perspective(900px) translate3d(0, 0, ${z}px) scale(${scale})`;
                    card.style.zIndex = Math.round(100 * factor);
                } else {
                    card.style.transform = 'perspective(900px) translate3d(0,0,0) scale(1)';
                    card.style.zIndex = '1';
                }
            });

            frameId = requestAnimationFrame(update3D);
        };

        frameId = requestAnimationFrame(update3D);
        return () => cancelAnimationFrame(frameId);
    }, []);


    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="container text-center" data-aos="fade-up">
                    <p className="hero-sub">Healing from roots. No chemicals.</p>
                    <h1>Pure Ayurveda for<br />Modern Life</h1>
                    <a href="#products" className="btn btn-lg btn-success">Explore Collection</a>
                </div>
            </section>

            {/* About */}
            <section id="about" className="section py-5">
                <div className="container">
                    <div className="row g-5 align-items-center" style={{ padding: '2rem' }}>
                        <div className="col-lg-6" data-aos="fade-right">
                            <span className="category-tag">The Standard</span>
                            <h2 className="display-5 font-serif mt-2 mb-4">Ancient Wisdom,<br />Thoughtfully Sourced.</h2>
                            <p className="lead">NIVORGO brings pure, handpicked botanicals to your daily ritual, restoring balance through gentle production.</p>
                            <div className="row mt-4">
                                <div className="col-6"><div className="feature-item">🌿 <h6 style={{ fontWeight: 'bold', fontSize: '1rem' }}>100% Natural</h6></div></div>
                                <div className="col-6"><div className="feature-item">🔬 <h6 style={{ fontWeight: 'bold', fontSize: '1rem' }}>Clinically Minded</h6></div></div>
                            </div>
                        </div>
                        <div className="col-lg-6" data-aos="zoom-in">
                            <div className="about-image-frame">
                                <img src="/assets/new.png" className="img-fluid rounded" alt="Nivorgo" loading="lazy" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Offers Banner */}
            <section className="promo-section py-5" style={{ backgroundColor: '#1C2820', color: '#fff' }}>
                <div className="container py-4 text-center">
                    <span className="category-tag text-light opacity-75 mb-3" style={{ letterSpacing: '5px' }}>Seasonal Wellness</span>
                    <h2 className="display-4 font-serif mb-4">Celebrate Your Ritual<br />with Up to 5% Off</h2>
                    <p className="lead mb-5 opacity-75">Restore your natural balance with our handcrafted therapy oils.<br />Limited quantities available for this harvest.</p>
                    <a href="#products" className="btn btn-outline-light px-5 py-3" style={{ borderRadius: '0', letterSpacing: '2px' }}>SHOP THE SALE</a>
                </div>
            </section>

            {/* Products */}
            <section id="products" className="section-products">
                <div className="container">
                    <h2 className="text-center font-serif mb-5" data-aos="fade-up">Our Hero Products</h2>
                    <div className="product-slider">
                        <Swiper
                            modules={[Pagination, Navigation]}
                            spaceBetween={40}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 4 },
                            }}
                            loop={true}
                        >
                            {products.map((p, i) => {
                                const imgUrl = p.img ? `/assets/${p.img}` : images[i % images.length];
                                return (
                                    <SwiperSlide key={i}>
                                        <div className="product-card">
                                            <div className="product-image-wrapper">
                                                {p.mrp && p.price && (
                                                    <div className="discount-badge-overlay">
                                                        {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                                                    </div>
                                                )}
                                                <img src={imgUrl} alt={p.name} className="main-img" loading="lazy" />
                                                <div className="product-actions">
                                                    <button
                                                        className="action-btn quick-view-btn"
                                                        onClick={() => openQuickView(p, imgUrl)}
                                                    >
                                                        Quick View
                                                    </button>
                                                    <button
                                                        className="action-btn cart-btn"
                                                        onClick={() => addToBag(p)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="product-info">
                                                <h3 className="font-serif">
                                                    <Link to={`/moreinfo/${p.id}`} className="text-decoration-none text-dark">
                                                        {p.name}
                                                    </Link>
                                                </h3>
                                                <div className="d-flex justify-content-center align-items-center gap-2">
                                                    {p.mrp && (
                                                        <>
                                                            <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.85rem' }}>{formatPrice(p.mrp)}</span>
                                                            <span className="text-success fw-bold small">({Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF)</span>
                                                        </>
                                                    )}
                                                    <p className="price-tag mb-0">{formatPrice(p.price)}</p>
                                                </div>
                                                <p className="product-card-desc">{p.desc}</p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="section-testimonials">
                <div className="testimonial-blur-1"></div>
                <div className="testimonial-blur-2"></div>
                
                <div className="container position-relative z-3 text-center mb-3">
                    <span className="category-tag" style={{ color: '#a8d5a2', borderColor: 'rgba(168,213,162,0.4)', letterSpacing: '4px' }}>HEALING JOURNEYS</span>
                    <h2 className="display-5 font-serif mt-2 mb-1" style={{ fontWeight: '800', letterSpacing: '-0.01em', color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>What Our Community Says</h2>
                    <p className="lead mx-auto mb-0" style={{ maxWidth: '540px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)' }}>Real stories of transformation, balance, and pure botanical nourishment.</p>
                </div>

                <div ref={marqueeRef} className="testimonials-marquee-container">
                    <div className="testimonials-marquee-track">
                        {/* Group 1 */}
                        <div className="testimonials-marquee-group">
                            {testimonials.map((imgUrl, idx) => (
                                <div key={idx} className="testimonial-card" onClick={() => setSelectedTestimonial(imgUrl)}>
                                    <img src={imgUrl} alt={`Testimonial ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                        {/* Group 2 — duplicate for seamless loop */}
                        <div className="testimonials-marquee-group" aria-hidden="true">
                            {testimonials.map((imgUrl, idx) => (
                                <div key={`dup-${idx}`} className="testimonial-card" onClick={() => setSelectedTestimonial(imgUrl)}>
                                    <img src={imgUrl} alt={`Testimonial ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick View Testimonial Modal */}
                <div className={`testimonial-modal-overlay ${selectedTestimonial ? 'show' : ''}`} onClick={() => setSelectedTestimonial(null)}>
                    {selectedTestimonial && (
                        <div className="testimonial-modal-content" style={{ padding: 0, overflow: 'hidden', maxWidth: '700px', width: '92%', background: 'transparent', border: 'none', boxShadow: 'none' }} onClick={(e) => e.stopPropagation()}>
                            <button className="testimonial-modal-close" style={{ color: '#fff', background: 'rgba(0, 0, 0, 0.5)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', top: '15px', right: '15px', zIndex: 10 }} onClick={() => setSelectedTestimonial(null)}>✕</button>
                            <img src={selectedTestimonial} alt="Testimonial Detail" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '24px', boxShadow: '0 30px 60px -10px rgba(0, 0, 0, 0.35)' }} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
