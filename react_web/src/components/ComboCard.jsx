import React from 'react';
import { Link } from 'react-router-dom';

const ComboCard = ({ combo, addToBag, openQuickView, formatPrice }) => {
  const imgUrl = `/assets/${combo.img}`;
  const savings = combo.mrp - combo.price;
  const discountPercent = Math.round((savings / combo.mrp) * 100);

  return (
    <div className="product-card combo-card-item">
      <div className="product-image-wrapper">
        <img src={imgUrl} alt={combo.name} className="main-img" loading="lazy" style={{ height: '240px', objectFit: 'contain' }} />
        <div className="product-actions">
          <button
            className="action-btn quick-view-btn"
            onClick={() => openQuickView(combo, imgUrl)}
          >
            Quick View
          </button>
          <button
            className="action-btn cart-btn"
            onClick={() => addToBag(combo)}
          >
            Add Bundle
          </button>
        </div>
      </div>
      <div className="product-info">
        <span className="combo-badge-text" style={{ fontSize: '0.7rem', color: '#B4846C', letterSpacing: '1.5px', fontWeight: 'bold', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>
          Value Bundle
        </span>
        <h3 className="font-serif" style={{ fontSize: '1.2rem', marginTop: '5px' }}>
          <span className="text-decoration-none text-dark">{combo.name}</span>
        </h3>
        
        {/* Included products */}
        <div className="included-items-text" style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px', fontStyle: 'italic' }}>
          {combo.products.join(' + ')}
        </div>

        <div className="d-flex justify-content-center align-items-center gap-2">
          <p className="price-tag mb-0">{formatPrice(combo.price)}</p>
        </div>
        <p className="product-card-desc">{combo.desc}</p>
      </div>
    </div>
  );
};

export default ComboCard;
