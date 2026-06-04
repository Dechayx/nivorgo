import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogArticles } from '../data/blogData';
import AOS from 'aos';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find current blog
  const currentBlog = blogArticles.find(a => a.id === id);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    window.scrollTo(0, 0);
  }, [id]);

  if (!currentBlog) {
    return (
      <div className="container py-5 text-center" style={{ paddingTop: '150px' }}>
        <h2 className="font-serif">Article Not Found</h2>
        <p className="text-muted mt-3">The article you are looking for does not exist or has been moved.</p>
        <Link to="/why-ayurveda" className="btn btn-success mt-4 rounded-pill">
          Back to Blogs
        </Link>
      </div>
    );
  }

  // Filter related articles (excluding the current one)
  const relatedArticles = blogArticles
    .filter(a => a.id !== currentBlog.id)
    .filter(a => {
      if (!searchTerm) return true;
      return (
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .slice(0, 3); // Show top 3 recommendations

  // Handlers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Article link copied to clipboard! 🌿');
  };

  const handleShare = () => {
    alert(`Thank you for sharing: "${currentBlog.title}"!`);
  };

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
  };

  return (
    <div className="single-blog-wrapper" style={{ paddingTop: '110px' }}>
      
      {/* Scenic Header Banner with Breadcrumbs */}
      <div 
        className="single-blog-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${currentBlog.image})`
        }}
      >
        <div className="single-blog-banner-content text-center">
          <div className="single-blog-breadcrumbs">
            <Link to="/">Home</Link> / <Link to="/why-ayurveda">Blog</Link> / <span>Single_Blog</span>
          </div>
          <h1 className="mt-3 font-serif px-3">{currentBlog.category}</h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container">
        <div className="row g-5">
          
          {/* Left Column - Article Details */}
          <article className="col-lg-8" data-aos="fade-up">
            
            {/* Meta Actions Bar */}
            <div className="single-blog-meta-wrapper">
              <div className="single-blog-author-info">
                <img 
                  src={currentBlog.authorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'} 
                  alt={currentBlog.author} 
                  className="single-blog-avatar" 
                />
                <div className="single-blog-author-details">
                  <h6>{currentBlog.author}</h6>
                  <p>⭐ {currentBlog.rating} • {currentBlog.location}</p>
                </div>
              </div>

              <div className="single-blog-actions">
                <button 
                  onClick={handleShare} 
                  className="single-blog-action-btn" 
                  title="Share Article"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 9.744A6 6 0 1121 11.64v.36m-18 0h18" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                </button>
                <button 
                  onClick={handleCopyLink} 
                  className="single-blog-action-btn" 
                  title="Copy link"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsLiked(!isLiked)} 
                  className="single-blog-action-btn" 
                  title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                  style={{ color: isLiked ? 'red' : '' }}
                >
                  <svg width="18" height="18" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
                <button 
                  onClick={() => navigate('/why-ayurveda')} 
                  className="single-blog-action-btn" 
                  title="Back to Blogs list"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Title & Category info */}
            <h1 className="font-serif fw-bold text-dark display-5 mb-3">{currentBlog.title}</h1>
            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="blog-badge m-0">{currentBlog.category}</span>
              <span className="text-muted small">• {currentBlog.readTime}</span>
            </div>

            {/* Featured Image */}
            <div className="mb-5 overflow-hidden rounded-4 shadow-sm" style={{ maxHeight: '420px' }}>
              <img 
                src={currentBlog.image} 
                alt={currentBlog.title} 
                className="w-100 h-100" 
                style={{ objectFit: 'cover' }} 
              />
            </div>

            {/* Post details details section */}
            <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4 bg-white border">
              <div className="small text-muted">
                <strong>Post Details</strong>
              </div>
              <div className="small text-muted">
                Hosted by {currentBlog.date} • <span className="text-dark fw-bold">{currentBlog.author}</span>
              </div>
            </div>

            {/* Main Rich text body description */}
            <div className="single-blog-content" style={{ fontSize: '1.08rem', lineHeight: '1.8', color: '#333' }}>
              {currentBlog.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h4 key={index} className="font-serif mt-5 mb-3 fw-bold text-dark" style={{ borderLeft: '4px solid var(--accent-terracotta)', paddingLeft: '15px' }}>
                      {paragraph.replace(/\*\*/g, '')}
                    </h4>
                  );
                }
                
                if (paragraph.startsWith('1.')) {
                  return (
                    <ol key={index} className="mb-4 ps-4">
                      {paragraph.split('\n').map((line, idx) => (
                        <li key={idx} className="mb-2">
                          {line.replace(/^\d+\.\s*/, '')}
                        </li>
                      ))}
                    </ol>
                  );
                }

                return (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Tags wrapper */}
            <div className="blog-tags-wrapper mt-5 border-top pt-4">
              {currentBlog.tags.map((tag) => (
                <span key={tag} className="blog-tag p-2 px-3 me-2" style={{ fontSize: '0.8rem' }}>#{tag}</span>
              ))}
            </div>

          </article>

          {/* Right Column - Sidebar */}
          <aside className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
            
            {/* Search Widget */}
            <div className="sidebar-widget">
              <h5 className="sidebar-widget-title">Search Related</h5>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control premium-input border-end-0"
                  placeholder="Filter recommendations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: '30px 0 0 30px' }}
                />
                <button
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  style={{ borderRadius: '0 30px 30px 0', border: '1px solid #eee' }}
                >
                  🔍
                </button>
              </div>
            </div>

            {/* Categories Widget */}
            <div className="sidebar-widget">
              <h5 className="sidebar-widget-title">Categories</h5>
              <div className="d-flex flex-column">
                {['Hair Growth', 'Hair Volume', 'Scalp Care', 'Greying Control', 'Ingredients', 'Hair Damage'].map((cat) => (
                  <Link 
                    key={cat} 
                    to="/why-ayurveda" 
                    className="sidebar-category-link"
                  >
                    <span>{cat}</span>
                    <span className="small text-muted">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Posts Widget */}
            <div className="sidebar-widget">
              <h5 className="sidebar-widget-title">Related Posts</h5>
              <div className="related-posts-list">
                {relatedArticles.length === 0 ? (
                  <p className="text-muted small mb-0">No matches found.</p>
                ) : (
                  relatedArticles.map((article) => (
                    <div key={article.id} className="related-post-item">
                      <img src={article.image} alt={article.title} className="related-post-thumb" />
                      <div className="related-post-info">
                        <h6>
                          <Link to={`/blog/${article.id}`}>{article.title}</Link>
                        </h6>
                        <span>🕒 {article.readTime} • {article.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Subscribe Newsletter Widget */}
            <div className="newsletter-card">
              <h4>Subscribe</h4>
              <p>To Newsletter</p>
              
              {subscribed ? (
                <div className="animate-fade-in py-2">
                  <h6 className="fw-bold mb-0">✨ Subscribed!</h6>
                  <span className="small opacity-75">Thank you for joining our herbal journey.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit}>
                  <input
                    type="email"
                    className="newsletter-input text-center"
                    placeholder="Enter email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                  <button type="submit" className="newsletter-submit-btn">
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </aside>

        </div>
      </div>

    </div>
  );
};

export default SingleBlog;
