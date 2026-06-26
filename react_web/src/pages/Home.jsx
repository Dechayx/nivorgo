import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
  {
    id: 1,
    name: "Dr. Aarav Mehta",
    role: "Ayurvedic Practitioner",
    rating: 5,
    date: "June 15, 2026",
    avatar: "AM",
    bg: "linear-gradient(135deg, #1C2820, #427e56)",
    preview: "Nivorgo's Shirodhara oil has completely changed how I recommend hair therapies. The purity of their botanicals is unmatched.",
    text: "As an Ayurvedic practitioner with over 15 years of experience, finding brands that respect ancient sourcing rules is rare. Nivorgo's Shirodhara Volumizing Oil has completely changed how I recommend hair therapies to my clients. The cold-pressed purity of their botanicals is unmatched, showing visible results in follicle strength and scalp hydration within just three weeks of consistent ritual."
  },
  {
    id: 2,
    name: "Ananya Sharma",
    role: "Wellness Editor & Blogger",
    rating: 5,
    date: "May 28, 2026",
    avatar: "AS",
    bg: "linear-gradient(135deg, #B4846C, #d4a373)",
    preview: "My go-to recommendation for clean, botanical hair care. Shirodhara oil adds incredible shine and depth naturally.",
    text: "I write about clean beauty for a living, and Nivorgo is my absolute go-to recommendation for botanical hair care. The Pratidarunaka Therapy Oil relieved my persistent seasonal dry scalp when high-end salon treatments failed. It is rare to find a brand that doesn't hide behind artificial fragrances. This is the real deal."
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    role: "Yoga & Meditation Instructor",
    rating: 4.8,
    date: "April 12, 2026",
    avatar: "VM",
    bg: "linear-gradient(135deg, #2c3e50, #3498db)",
    preview: "Perfect for post-practice relaxation. The scent alone induces a sense of deep, mindful tranquility.",
    text: "Incorporating the Keshyadharni Therapy Oil into my nightly routine has been a grounding ritual. The soothing, earthy fragrance acts as an immediate signal to my nervous system that it is time to rest, while the light hydration has eliminated dry ends and left my hair soft, manageable, and full of natural life."
  },
  {
    id: 4,
    name: "Priya Sharma",
    role: "Certified Yoga Instructor",
    rating: 5,
    date: "May 10, 2026",
    avatar: "PS",
    bg: "linear-gradient(135deg, #8e44ad, #9b59b6)",
    preview: "The most authentic Ayurvedic oils I've ever used. My students love the calming aroma during our sessions.",
    text: "I use Nivorgo's oils during my restorative yoga sessions, and the feedback from my students has been phenomenal. The authentic fragrance helps create a serene, meditative environment, and the oils feel incredibly nourishing on the skin. It's clear that they source their ingredients with the utmost respect for nature."
  },
  {
    id: 5,
    name: "Rohan Mehta",
    role: "Software Engineer",
    rating: 4.7,
    date: "June 2, 2026",
    avatar: "RM",
    bg: "linear-gradient(135deg, #27ae60, #2ecc71)",
    preview: "Excellent for relieving stress and computer-related eye fatigue. A must-have for tech professionals.",
    text: "Working in front of a screen for 10 hours a day causes a lot of tension. I start my evenings with a gentle scalp massage using Nivorgo's Shirodhara oil. It helps relieve stress, relaxes my mind, and has significantly improved my sleep quality. It is a premium product that is worth every penny."
  },
  {
    id: 6,
    name: "Dr. Aisha Khan",
    role: "Clinical Dietitian",
    rating: 5,
    date: "April 29, 2026",
    avatar: "AK",
    bg: "linear-gradient(135deg, #c0392b, #e74c3c)",
    preview: "A scientific approach to ancient holistic wellness. The results speak for themselves.",
    text: "We often overlook the skin and scalp as major absorption pathways. Nivorgo's clean, non-toxic formulations are exactly what the modern holistic lifestyle needs. The results my patients and I have experienced are scientifically backed by the cellular health of the scalp. A brilliant fusion of nature and care."
  },
  {
    id: 7,
    name: "Kavita Rao",
    role: "Organic Tea Grower",
    rating: 4.9,
    date: "May 15, 2026",
    avatar: "KR",
    bg: "linear-gradient(135deg, #d35400, #e67e22)",
    preview: "Correctly processed botanical extracts. You can immediately smell the fresh ingredients.",
    text: "I grow organic tea for a living, so I understand the difference between raw herbs and low-grade commercial extracts. When I used Nivorgo, I could immediately smell the fresh, correctly processed extracts of Bhringraj and Brahmi. They aren't cooking the life out of their botanicals. Highly recommended!"
  },
  {
    id: 8,
    name: "Siddharth Sen",
    role: "Wellness Coach",
    rating: 5,
    date: "June 8, 2026",
    avatar: "SS",
    bg: "linear-gradient(135deg, #130f40, #30336b)",
    preview: "Truly premium quality that supports local farmers. Highly recommend for daily wellness.",
    text: "Nivorgo is a brand that truly delivers on its promise of purity and quality. I recommend their wellness products to all my clients who want to transition to a cleaner, chemical-free lifestyle. The visible improvement in their hair health and overall well-being is testament to the efficacy of these traditional formulations."
  }
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
        const update3DCardEffects = () => {
            const rect = container.getBoundingClientRect();
            const containerCenter = rect.left + rect.width / 2;
            const cards = container.querySelectorAll('.testimonial-card');
            
            // Range from center of the screen
            const range = 600;

            cards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = cardCenter - containerCenter;
                const absDistance = Math.abs(distance);
                const isHovered = card.matches(':hover');

                if (absDistance < range) {
                    const factor = 1 - absDistance / range;
                    
                    let scale = 1 + 0.12 * factor;
                    let translateZ = 70 * factor;
                    const rotateY = -15 * (distance / range) * (1 - factor);
                    
                    if (isHovered) {
                        scale += 0.04;
                        translateZ += 20;
                    }

                    const shadowOpacity = 0.02 + 0.08 * factor;
                    const glowOpacity = 0.15 * factor;

                    card.style.transform = `perspective(1000px) translate3d(0, 0, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`;
                    card.style.boxShadow = `
                        0 ${10 + 20 * factor}px ${25 + 25 * factor}px rgba(28, 40, 32, ${shadowOpacity}),
                        0 0 ${15 + 15 * factor}px rgba(66, 126, 86, ${glowOpacity})
                    `;
                    card.style.zIndex = Math.round(100 * factor);
                } else {
                    let scale = 1;
                    let translateZ = 0;
                    if (isHovered) {
                        scale = 1.04;
                        translateZ = 10;
                    }
                    card.style.transform = `perspective(1000px) translate3d(0, 0, ${translateZ}px) scale(${scale}) rotateY(0deg)`;
                    card.style.boxShadow = isHovered 
                        ? '0 15px 30px rgba(28, 40, 32, 0.05), 0 0 15px rgba(66, 126, 86, 0.08)' 
                        : '0 10px 30px rgba(0, 0, 0, 0.02)';
                    card.style.zIndex = '1';
                }
            });

            frameId = requestAnimationFrame(update3DCardEffects);
        };

        frameId = requestAnimationFrame(update3DCardEffects);
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
            <section id="testimonials" className="section-testimonials py-5">
                <div className="testimonial-blur-1"></div>
                <div className="testimonial-blur-2"></div>
                
                <div className="container position-relative z-3 text-center mb-4" data-aos="fade-up">
                    <span className="category-tag">HEALING JOURNEYS</span>
                    <h2 className="display-5 font-serif mt-2 mb-3" style={{ fontWeight: '800', letterSpacing: '-0.01em' }}>What Our Community Says</h2>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1rem' }}>Real stories of transformation, balance, and pure botanical nourishment.</p>
                </div>

                <div ref={marqueeRef} className="testimonials-marquee-container" data-aos="fade-up" data-aos-delay="200">
                    <div className="testimonials-marquee-track">
                        {/* Group 1 */}
                        <div className="testimonials-marquee-group">
                            {testimonials.map((t) => (
                                <div key={t.id} className="testimonial-card" onClick={() => setSelectedTestimonial(t)}>
                                    <div className="testimonial-card-quote">“</div>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="testimonial-avatar" style={{ background: t.bg }}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <h6 className="mb-0 fw-bold" style={{ fontSize: '0.95rem' }}>{t.name}</h6>
                                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>✓ VERIFIED</span>
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t.role}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        {renderStars(t.rating)}
                                    </div>
                                    <p className="testimonial-text mb-0">
                                        "{t.preview}"
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Group 2 (Duplicate for loop) */}
                        <div className="testimonials-marquee-group" aria-hidden="true">
                            {testimonials.map((t) => (
                                <div key={`dup-${t.id}`} className="testimonial-card" onClick={() => setSelectedTestimonial(t)}>
                                    <div className="testimonial-card-quote">“</div>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="testimonial-avatar" style={{ background: t.bg }}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center gap-2">
                                                <h6 className="mb-0 fw-bold" style={{ fontSize: '0.95rem' }}>{t.name}</h6>
                                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>✓ VERIFIED</span>
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t.role}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        {renderStars(t.rating)}
                                    </div>
                                    <p className="testimonial-text mb-0">
                                        "{t.preview}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick View Testimonial Modal */}
                <div className={`testimonial-modal-overlay ${selectedTestimonial ? 'show' : ''}`} onClick={() => setSelectedTestimonial(null)}>
                    {selectedTestimonial && (
                        <div className="testimonial-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="testimonial-modal-close" onClick={() => setSelectedTestimonial(null)}>✕</button>
                            
                            <div className="row g-4 align-items-center">
                                <div className="col-md-4 text-center">
                                    <div className="testimonial-modal-avatar" style={{ background: selectedTestimonial.bg }}>
                                        {selectedTestimonial.avatar}
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <h3 className="font-serif mb-0">{selectedTestimonial.name}</h3>
                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>✓ VERIFIED CUSTOMER</span>
                                    </div>
                                    <p className="text-muted small mb-2">{selectedTestimonial.role} • {selectedTestimonial.date}</p>
                                    <div className="mb-3">
                                        {renderStars(selectedTestimonial.rating)}
                                    </div>
                                    <p className="testimonial-modal-text font-serif">
                                        "{selectedTestimonial.text}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
