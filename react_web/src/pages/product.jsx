import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import { Link } from 'react-router-dom';
import ComboCard from '../components/ComboCard';

const Product = ({ products, comboProducts = [], addToBag, openQuickView, formatPrice, images }) => {
    const [activeTab, setActiveTab] = useState('oils');

    useEffect(() => {
        AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="product-page-wrapper">
            {/* Header / Hero for Products Page */}
            <section className="hero" style={{ minHeight: '40vh', height: '50vh' }}>
                <div className="hero-overlay" style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.4)', zIndex: -1
                }}></div>
                <div className="container text-center" data-aos="fade-up">
                    <p className="hero-sub" style={{ color: '#fff' }}>The Holistic Collection</p>
                    <h1 style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)' }}>Our Healing<br />Formulations</h1>
                </div>
            </section>

            {/* TAB SELECTOR */}
            <section className="pt-5" style={{ backgroundColor: '#F9F7F2' }}>
                <div className="container text-center">
                    <div className="d-inline-flex gap-2 p-1 bg-white rounded-pill shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                        <button 
                            className="btn px-4 py-2 rounded-pill border-0 text-uppercase fw-bold" 
                            style={{ 
                                fontSize: '0.8rem', 
                                letterSpacing: '1px', 
                                backgroundColor: activeTab === 'oils' ? 'var(--primary-forest)' : 'transparent',
                                color: activeTab === 'oils' ? '#fff' : '#555',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => setActiveTab('oils')}
                        >
                            Therapy Oils
                        </button>
                        <button 
                            className="btn px-4 py-2 rounded-pill border-0 text-uppercase fw-bold"
                            style={{ 
                                fontSize: '0.8rem', 
                                letterSpacing: '1px', 
                                backgroundColor: activeTab === 'combos' ? 'var(--primary-forest)' : 'transparent',
                                color: activeTab === 'combos' ? '#fff' : '#555',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => setActiveTab('combos')}
                        >
                            Value Combos
                        </button>
                    </div>
                </div>
            </section>

            <section className="section-products-zigzag" style={{ backgroundColor: '#F9F7F2', padding: '50px 0 100px 0' }}>
                <div className="container">
                    {activeTab === 'oils' ? (
                        products.map((item, i) => (
                            <div key={i} className={`row align-items-center mb-5 g-4 g-lg-5 ${i % 2 !== 0 ? 'flex-md-row-reverse' : ''}`} data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}>
                                <div className="col-lg-6">
                                    <div className="product-page-img shadow-lg" style={{ background: '#fff' }}>
                                        <img 
                                            src={`/assets/${item.img}`} 
                                            alt={item.title} 
                                            className="img-fluid w-100" 
                                            style={{ height: '500px', objectFit: 'contain' }} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 px-lg-5">
                                    <div className="product-content py-4">
                                        <span className="category-tag mb-2">Exclusive Formulation</span>
                                        <h2 className="font-serif mb-3" style={{ fontSize: '2.5rem' }}>{item.title}</h2>
                                        <p className="lead text-muted mb-5" style={{ fontSize: '1.1rem' }}>{item.desc}</p>
                                        <div className="d-flex gap-3">
                                            <Link to={`/moreinfo/${item.id}`} className="btn btn-success px-4 py-2 text-decoration-none">Discover More</Link>
                                            <button className="btn btn-outline-dark px-4 py-2" style={{ borderRadius: '0' }} onClick={() => addToBag(item)}>Add to Ritual</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="row g-5 justify-content-center">
                            {comboProducts.map((combo, i) => (
                                <div key={i} className="col-md-6 col-lg-5">
                                    <ComboCard
                                        combo={combo}
                                        addToBag={addToBag}
                                        openQuickView={openQuickView}
                                        formatPrice={formatPrice}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Nivorgo Section (Optional Polish) */}
            <section className="py-5" style={{ backgroundColor: '#fff' }}>
                <div className="container text-center py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8" data-aos="fade-up">
                            <span className="category-tag">Guaranteed Purity</span>
                            <h2 className="font-serif mb-4">Ethically Created, Botanically Inspired.</h2>
                            <p className="text-muted">Every NIVORGO product is a result of meticulous research into ancient Charaka Samhita manuscripts, ensuring you receive the most authentic Ayurvedic care.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Product;

