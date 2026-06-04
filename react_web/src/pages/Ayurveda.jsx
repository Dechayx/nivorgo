import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import { blogArticles } from '../data/blogData';

const Ayurveda = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeResource, setActiveResource] = useState('Blog'); // 'Blog' or 'Academy'

    useEffect(() => {
        AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
        window.scrollTo(0, 0);
    }, []);

    // Filtering Logic
    const filteredArticles = blogArticles.filter((article) => {
        const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
        const matchesSearch =
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Handle Search Submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    // Social Share Action
    const shareAlert = (platform) => {
        alert(`Thank you for sharing this article on ${platform}!`);
    };

    return (
        <div className="blog-bg-silk" style={{ paddingTop: '110px' }}>

            {/* Floating Share Bar (Mock) */}
            <div className="floating-share-bar">
                <button onClick={() => shareAlert('Facebook')} className="share-btn fb" title="Share on Facebook">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.72-1 1-1h2V2h-3a4 4 0 00-4 4v2z" />
                    </svg>
                </button>
                <button onClick={() => shareAlert('Twitter')} className="share-btn tw" title="Share on Twitter">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                </button>
                <button onClick={() => shareAlert('LinkedIn')} className="share-btn in" title="Share on LinkedIn">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </button>
                <button onClick={() => shareAlert('General Link')} className="share-btn sh" title="Copy Article Link">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                </button>
            </div>

            {/* Top Search Bar Block */}
            <div className="search-bar-wrapper">
                <div className="container">
                    <form onSubmit={handleSearchSubmit} className="row justify-content-center">
                        <div className="col-lg-6 col-md-8 d-flex">
                            <input
                                type="text"
                                className="form-control blog-search-input"
                                placeholder="Search resources, ingredients, hair tips..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="blog-search-btn">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Two-Column Layout */}
            <div className="container py-5">
                <div className="row g-5">

                    {/* Left Sidebar */}
                    <aside className="col-lg-3 col-md-4">

                        {/* Resources Navigation */}
                        <div className="blog-sidebar-title">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="me-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-16.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-16.25v16.25" />
                            </svg>
                            Resources
                        </div>
                        <ul className="blog-sidebar-list">
                            <li
                                className={`blog-sidebar-item ${activeResource === 'Blog' ? 'active' : ''}`}
                                onClick={() => { setActiveResource('Blog'); setActiveCategory('All'); }}
                            >
                                Blog
                                <span className="badge rounded-pill bg-secondary small">{blogArticles.length}</span>
                            </li>
                            <li
                                className={`blog-sidebar-item ${activeResource === 'Academy' ? 'active' : ''}`}
                                onClick={() => setActiveResource('Academy')}
                            >
                                Academy
                                <span className="badge bg-secondary rounded-pill text-uppercase" style={{ fontSize: '0.6rem' }}>Soon</span>
                            </li>
                        </ul>

                        {/* Categories Navigation (Shown only for Blog) */}
                        {activeResource === 'Blog' && (
                            <>
                                <div className="blog-sidebar-title">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="me-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.462 1.462 0 002.068 0l4.318-4.318a1.462 1.462 0 000-2.068L10.05 3.659A2.25 2.25 0 009.568 3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                    </svg>
                                    Categories
                                </div>
                                <ul className="blog-sidebar-list">
                                    {['All', 'Hair Growth', 'Hair Volume', 'Scalp Care', 'Greying Control', 'Ingredients', 'Hair Damage'].map((cat) => {
                                        const count = cat === 'All'
                                            ? blogArticles.length
                                            : blogArticles.filter(a => a.category === cat).length;
                                        return (
                                            <li
                                                key={cat}
                                                className={`blog-sidebar-item ${activeCategory === cat ? 'active' : ''}`}
                                                onClick={() => setActiveCategory(cat)}
                                            >
                                                {cat}
                                                <span className="badge rounded-pill bg-light text-dark border small">{count}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        )}
                    </aside>

                    {/* Right Content Area */}
                    <main className="col-lg-9 col-md-8">

                        {activeResource === 'Academy' ? (

                            /* Academy Coming Soon Display */
                            <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5 animate-fade-in">
                                <span className="blog-badge">NIVORGO ACADEMY</span>
                                <h2 className="font-serif display-6 mt-2 mb-4" style={{ color: '#1C2820' }}>Ancient Science, Guided Classes</h2>
                                <p className="text-muted mx-auto" style={{ maxWidth: '600px', lineHeight: '1.8' }}>
                                    We are developing certified digital courses, live hair-care seminars, and video masterclasses hosted by leading Ayurvedic practitioners and herbal doctors.
                                </p>
                                <div className="mt-5 p-4 rounded-4" style={{ backgroundColor: '#FAF9F6', border: '1px dashed var(--accent-terracotta)', display: 'inline-block' }}>
                                    <h6 className="fw-bold mb-2" style={{ color: 'var(--accent-terracotta)' }}>Interested in Early Enrollment?</h6>
                                    <p className="small mb-0 text-muted">Sign up in our contact form below to be notified as soon as classes open.</p>
                                </div>
                            </div>

                        ) : (

                            /* Blog Grid */
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="fw-bold text-uppercase m-0" style={{ letterSpacing: '1px', fontSize: '1.1rem', color: '#555' }}>
                                        {activeCategory} Articles ({filteredArticles.length})
                                    </h4>
                                    {searchTerm && (
                                        <button
                                            className="btn btn-sm btn-outline-secondary rounded-pill"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            Clear search: "{searchTerm}"
                                        </button>
                                    )}
                                </div>

                                {filteredArticles.length === 0 ? (

                                    /* No Results State */
                                    <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5">
                                        <h5>No articles found matching your criteria.</h5>
                                        <p className="text-muted small mt-2">Try checking for spelling errors or choosing another category.</p>
                                        <button
                                            className="btn btn-success mt-4 px-4 rounded-pill"
                                            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                                        >
                                            Reset Filter
                                        </button>
                                    </div>

                                ) : (

                                    /* Cards Grid */
                                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 animate-fade-in">
                                        {filteredArticles.map((article) => (
                                            <div key={article.id} className="col d-flex">
                                                <div className="card blog-card w-100">
                                                    <div className="blog-card-img-wrapper">
                                                        <img src={article.image} alt={article.title} className="blog-card-img" />
                                                    </div>
                                                    <div className="card-body p-4 d-flex flex-column">
                                                        <div>
                                                            <span className="blog-badge">{article.category}</span>
                                                            <h5 className="blog-title" title={article.title}>{article.title}</h5>
                                                            <p className="blog-excerpt">{article.excerpt}</p>
                                                        </div>

                                                        <div className="mt-auto">
                                                            <div className="blog-tags-wrapper">
                                                                {article.tags.map((tag) => (
                                                                    <span key={tag} className="blog-tag">#{tag}</span>
                                                                ))}
                                                            </div>
                                                            <button
                                                                onClick={() => navigate(`/blog/${article.id}`)}
                                                                className="blog-read-more-btn"
                                                            >
                                                                Read More
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                )}
                            </div>

                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Ayurveda;
