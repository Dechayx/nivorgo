import React, { useEffect } from 'react';
import AOS from 'aos';

const Ayurveda = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    }, []);

    return (
        <div style={{ marginTop: '80px' }}>
            {/* Hero Header */}
            <header
                className="text-center text-white d-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(rgba(74, 93, 69, 0.6), rgba(160, 117, 44, 0.6)), url("/assets/ayurveda-hero.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '60vh'
                }}
            >
                <div data-aos="fade-up">
                    <h1 className="display-2 font-serif mb-3">Wisdom of the Ages</h1>
                    <p className="lead text-uppercase" style={{ letterSpacing: '3px' }}>The Legacy of Acharyas & Nature</p>
                </div>
            </header>

            {/* Our Roots Section */}
            <section className="py-5" style={{ backgroundColor: '#F9F7F2' }}>
                <div className="container py-5">
                    <div className="row justify-content-center mb-5">
                        <div className="col-lg-8 text-center" data-aos="fade-up">
                            <span className="text-uppercase fw-bold" style={{ color: '#B4846C', letterSpacing: '2px' }}>Our Roots</span>
                            <h2 className="display-5 font-serif mt-2" style={{ color: '#4A5D45' }}>A Science Beyond Comparison</h2>
                            <hr className="mx-auto" style={{ width: '80px', height: '3px', backgroundColor: '#B4846C', opacity: 1 }} />
                            <p className="lead text-muted mt-4" style={{ lineHeight: '1.8' }}>
                                "The scale that can be compared to Ayurveda has not been made yet. Thousands of years ago, Acharyas like Charak, Sushruta, and Vagbhat passed on their research and penances to us in the form of sacred codes. At NIVORGO, we don't just use it; we cherish it."
                            </p>
                        </div>
                    </div>

                    {/* Two Cards */}
                    <div className="row g-4 mt-5">
                        <div className="col-md-6" data-aos="fade-right">
                            <div
                                className="p-5 h-100 shadow-sm border-0"
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    borderLeft: '5px solid #4A5D45'
                                }}
                            >
                                <h4 className="font-serif" style={{ color: '#4A5D45' }}>The Law of Nature</h4>
                                <p className="text-muted mt-3">
                                    Ayurveda is often misunderstood as "slow." However, we must remember: just because a generation is advanced does not mean our internal organs are. Our anatomy remains original, requiring natural time to align and heal.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6" data-aos="fade-left">
                            <div
                                className="p-5 h-100 shadow-sm border-0"
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    borderLeft: '5px solid #B4846C'
                                }}
                            >
                                <h4 className="font-serif" style={{ color: '#B4846C' }}>Modern Ancient Balance</h4>
                                <p className="text-muted mt-3">
                                    While an ancient lifestyle is difficult today, we can choose what we eat and apply. Ayurveda is the only science with zero harm, connecting us directly to natural plants for internal and external health.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-5 text-white text-center" style={{ backgroundColor: '#4A5D45' }}>
                <div className="container py-4">
                    <h2 className="font-serif italic display-6">"If you can't eat it, don't apply it on your skin."</h2>
                    <p className="mt-3 opacity-75">— An Ayurvedic Gold Standard</p>
                </div>
            </section>

            {/* NIVORGO Bridge Section */}
            <section className="py-5">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-md-6" data-aos="zoom-in">
                            <img src="/assets/background.jpeg" alt="Ayurveda" className="img-fluid rounded-4 shadow" />
                        </div>
                        <div className="col-md-6 ps-md-5" data-aos="fade-up">
                            <h3 className="font-serif mb-4" style={{ color: '#4A5D45' }}>NIVORGO: Your Bridge to Nature</h3>
                            <p className="text-muted">
                                In the golden era of the Great Acharyas, Ayurvedic potency was synonymous with immediate preparation; herbs were harvested at dawn and crushed into fresh Lepas to be used while their "Prana" or life force was at its peak. Today, while our modern fast-paced world has replaced the forest pharmacy with cityscapes and replaced time-consuming DIY rituals with hectic schedules, the biological needs of our skin remain unchanged. NIVORGO bridges this millennial gap through "Conscious Preservation," utilizing only the mildest, eco-certified safe chemicals—strictly where necessary—to act as a protective vessel for nature's purity. By taking on the meticulous labor of sourcing and stabilizing these ancient decoctions, we ensure that the "fresh-crushed" efficacy of traditional ointments is delivered to your doorstep with modern convenience, proving that true Ayurveda is not a retreat into the past, but a sophisticated step toward a healthy, balanced lifestyle.
                            </p>
                            <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#F9F7F2', borderLeft: '4px solid #B4846C' }}>
                                <p className="mb-0 fw-bold" style={{ color: '#B4846C' }}>
                                    'Ayurveda is not just about medicine; it's all about a healthy lifestyle.'
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Ayurveda;
