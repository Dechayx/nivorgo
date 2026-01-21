import React, { useEffect } from 'react';
import AOS from 'aos';

const AboutUs = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    }, []);

    return (
        <div style={{ marginTop: '80px' }}>
            {/* Hero Header */}
            <header
                className="text-center text-white d-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(rgba(93, 169, 179, 0.6), rgba(160, 117, 44, 0.6)), url("/assets/ayurveda-hero.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '60vh'
                }}
            >
                <div data-aos="fade-up">
                    <h1 className="display-3 font-serif">The Nivorgo Legacy</h1>
                    <p className="lead px-3 px-md-5">
                        In the sacred silence of the forest laboratories thousands of years ago, the great Acharyas—Charak, Sushruta, and Vagbhat—decoded the rhythms of life. They discovered that true healing isn't found in a laboratory, but in the "Prana" of a freshly crushed leaf and the purity of unpolished oils. They left behind a legacy of penance and research in the form of sacred codes, a science so profound that its scale remains incomparable even today.
                    </p>
                </div>
            </header>

            {/* What is NIVORGO Section */}
            <section className="section py-5">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4">
                            <h2 className="font-serif mb-4" style={{ color: '#4A5D45' }}>What is NIVORGO?</h2>
                            <p className="lead text-muted">
                                NIVORGO is India's first purest therapy brand, born from a vision to bring back the true essence of Ayurveda into modern lifestyle care.
                            </p>
                            <p>
                                In today's world of harmful chemicals, many adverse changes take place in our bodies, affecting every age group. We often suffer from unforeseen health problems and try countless products in the market to "fire" them, yet results are rare and consequences are many.
                            </p>
                            <p>
                                Our team conducted a deep market survey, consulting many people to understand their common struggles. We found that instead of getting better, many were getting worse due to incorrect treatments. NIVORGO was created as the right solution—a remedy expert in the Ayurvedic market.
                            </p>
                        </div>
                        <div className="col-lg-6 text-center">
                            <div className="p-5 rounded shadow" style={{ backgroundColor: '#f9f7f2' }}>
                                <h3 className="font-serif" style={{ color: '#B4846C' }}>Secret Behind the Name</h3>
                                <hr className="mx-auto w-25" />
                                <p className="display-6 font-serif mt-3" style={{ letterSpacing: '2px' }}>NIV + ORGO</p>
                                <p className="text-uppercase fw-bold" style={{ color: '#4A5D45' }}>The Purest Foundation of Organic</p>
                                <p className="text-muted small mt-4">
                                    Reflecting our commitment to natural, unpolished, and chemical-free solutions. We are more than just a brand – we are a movement towards conscious living.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Objective & Purpose Section */}
            <section className="py-5" style={{ backgroundColor: '#4A5D45', color: 'white' }}>
                <div className="container">
                    <div className="row text-center g-4">
                        <div className="col-md-6 border-end border-light">
                            <h2 className="font-serif mb-3">Our Objective</h2>
                            <p className="px-lg-5">
                                To spread pure and sattvic Ayurveda to all in a scientific way and to solve everyone's problem in a natural way.
                            </p>
                        </div>
                        <div className="col-md-6">
                            <h2 className="font-serif mb-3">Our Purpose</h2>
                            <p className="px-lg-5">
                                To provide 100% organic products at low cost and low profit margins, while unknowingly following the cycle of giving back to nature what we receive from nature.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Crafted for Well-being */}
            <section className="section py-5">
                <div className="container py-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="font-serif mb-4" style={{ color: '#4A5D45' }}>Crafted for Your Well-being</h2>
                            <p className="lead text-muted mb-4">
                                We believe true wellness comes from nature, not a laboratory. Every NIVORGO remedy is a bridge between ancient wisdom and your modern lifestyle.
                            </p>
                            <img src="/assets/background.jpeg" className="img-fluid rounded shadow" alt="NIVORGO Ayurvedic ingredients" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
