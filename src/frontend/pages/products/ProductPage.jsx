import React from 'react';
import CustomizationPreview from '../../components/CustomizationPreview';

const ProductPage = () => {
  // Get saved elements from localStorage or your backend
  const elements = JSON.parse(localStorage.getItem('globoElements') || '[]');

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6">
          {/* Product images and details */}
        </div>
        <div className="col-md-6">
          <CustomizationPreview elements={elements} />
          <button className="btn btn-primary w-100 mt-4">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
