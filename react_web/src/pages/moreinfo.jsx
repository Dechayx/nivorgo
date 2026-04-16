import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogProducts } from '../data/catalogData';

const MoreInfo = () => {
    const { id } = useParams();
    const product = catalogProducts.find(p => p.id === id);
    const [mainImage, setMainImage] = useState(product?.img || '');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (product) setMainImage(product.img);
    }, [product]);

    if (!product) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '150px' }}>
                <h2>Product not found</h2>
                <Link to="/products" className="btn btn-success mt-3">Back to Products</Link>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
    };

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    return (
        <div className="more-info-page" style={{ paddingTop: '120px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <div className="container py-4">
                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb small">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none text-muted">Shop</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{product.title}</li>
                    </ol>
                </nav>

                {/* Top Section: Photo & Quick Purchase */}
                <div className="row g-5 mb-5 align-items-center">
                    {/* Left: Photos */}
                    <div className="col-lg-7">
                        <div className="row g-3">
                            <div className="col-lg-2 order-2 order-lg-1">
                                <div className="d-flex flex-lg-column gap-3 overflow-auto pb-2">
                                    {product.gallery?.map((gImg, idx) => (
                                        <div
                                            key={idx}
                                            className={`thumbnail-box border ${mainImage === gImg ? 'border-success border-2' : ''}`}
                                            style={{ cursor: 'pointer', padding: '2px', overflow: 'hidden', height: '80px', flex: '0 0 auto' }}
                                            onClick={() => setMainImage(gImg)}
                                        >
                                            <img src={`/assets/${gImg}`} alt="thumb" className="img-fluid w-100 h-100" style={{ objectFit: 'contain' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-10 order-1 order-lg-2">
                                <div className="main-image-wrapper p-2 p-md-4 border bg-white d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '550px' }}>
                                    <img
                                        src={`/assets/${mainImage}`}
                                        alt={product.title}
                                        className="img-fluid"
                                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Pricing & Meta */}
                    <div className="col-lg-5">
                        <div className="product-summary-panel">
                            <span className="badge bg-success-subtle text-success border border-success mb-2 px-3">PREMIUM THERAPY</span>
                            <h1 className="font-serif h1 mb-1">{product.title}</h1>
                            <p className="text-muted mb-4">{product.tagline}</p>

                            <div className="d-flex align-items-center gap-2 mb-4">
                                <span className="badge bg-success d-flex align-items-center gap-1">{product.rating} ★</span>
                                <span className="text-muted small">({product.reviews} Verified Reviews)</span>
                            </div>

                            <div className="pricing-box mb-4">
                                <div className="d-flex align-items-baseline gap-3">
                                    <h1 className="display-6 fw-bold mb-0">{formatPrice(product.price)}</h1>
                                    <span className="text-muted text-decoration-line-through">{formatPrice(product.mrp)}</span>
                                    <span className="text-success fw-bold">({discount}% OFF)</span>
                                </div>
                                <p className="text-muted small mt-1">Inclusive of all taxes & Courier</p>
                            </div>

                            <div className="benefits-highlight p-3 mb-4 rounded" style={{ backgroundColor: '#F0F4EF' }}>
                                <h6 className="fw-bold mb-3 small text-uppercase">Highlights</h6>
                                {product.benefits.slice(0, 2).map((benefit, idx) => (
                                    <p key={idx} className="small mb-2 d-flex gap-2 mb-1">
                                        <span className="text-success">✓</span> {benefit}
                                    </p>
                                ))}
                            </div>

                            <div className="action-buttons d-flex gap-3 mb-4">
                                <button className="btn btn-outline-dark flex-grow-1 py-3 fw-bold" style={{ borderRadius: '0' }}>ADD TO BAG</button>
                                <button className="btn btn-success flex-grow-1 py-3 fw-bold" style={{ borderRadius: '0', backgroundColor: '#3A4B36' }}>BUY NOW</button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-5" />

                {/* Bottom Section: Full Width Detailed Info */}
                <div className="row g-5">
                    <div className="col-lg-12">
                        <div className="detailed-info-horizontal">

                            {/* Detailed Benefits - Full Width Row */}
                            <div className="mb-5 py-4">
                                <h3 className="font-serif mb-4 text-center">Complete Health Benefits</h3>
                                <div className="row g-4 pt-3">
                                    {product.benefits.map((benefit, idx) => (
                                        <div key={idx} className="col-md-4">
                                            <div className="p-4 border text-center h-100 shadow-sm bg-white" style={{ borderRadius: '12px' }}>
                                                <div className="h1 text-success mb-3">🌿</div>
                                                <p className="small mb-0 text-muted" style={{ lineHeight: '1.6' }}>{benefit}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="row g-5">
                                {/* Left Side of Info Row */}
                                <div className="col-md-6">
                                    <div className="mb-5">
                                        <h4 className="font-serif mb-4 border-bottom pb-3">Herbal Composition</h4>
                                        <div className="row g-3">
                                            {product.ingredientsDetails?.map((item, idx) => (
                                                <div key={idx} className="col-12">
                                                    <div className="p-3 border-bottom d-flex justify-content-between align-items-start">
                                                        <span className="fw-bold text-success" style={{ minWidth: '120px' }}>{item.name}</span>
                                                        <span className="small text-muted text-end ps-3">{item.benefit}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="small text-muted mt-3 italic">*Formulated with 24+ synergistic natural herbs.</p>
                                    </div>
                                </div>

                                {/* Right Side of Info Row */}
                                <div className="col-md-6">
                                    <div className="mb-5">
                                        <h4 className="font-serif mb-4 border-bottom pb-3">Therapeutic Description</h4>
                                        <p className="text-muted" style={{ lineHeight: '2', fontSize: '1.05rem' }}>{product.longDesc}</p>
                                    </div>

                                    <div className="ritual-box p-5 bg-light-subtle shadow-sm text-center" style={{ border: '2px dashed #3A4B36', borderRadius: '15px' }}>
                                        <h4 className="font-serif mb-3">The Application Ritual</h4>
                                        <p className="small text-muted mb-0" style={{ lineHeight: '1.8' }}>{product.usage}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoreInfo;
