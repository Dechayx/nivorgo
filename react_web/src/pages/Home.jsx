import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = ({ products, addToBag, openQuickView, formatPrice, images }) => {
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
                                <img src="/assets/bg.png" className="img-fluid rounded" alt="Nivorgo" />
                            </div>
                        </div>
                    </div>
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
                                const imgUrl = images[i % images.length];
                                return (
                                    <SwiperSlide key={i}>
                                        <div className="product-card">
                                            <div className="product-image-wrapper">
                                                <img src={imgUrl} alt={p.name} className="main-img" />
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
                                                <h3 className="font-serif">{p.name}</h3>
                                                <div className="d-flex justify-content-center align-items-center gap-2">
                                                    {p.mrp && <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.9rem' }}>{formatPrice(p.mrp)}</span>}
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
        </div>
    );
};

export default Home;
