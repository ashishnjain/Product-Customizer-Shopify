import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const ProductCollectionSelector = ({ onSelect }) => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products and collections from Shopify
  useEffect(() => {
    const fetchShopifyData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const productsResponse = await fetch('/api/shopify/products');
        const productsData = await productsResponse.json();
        setProducts(productsData.map(p => ({
          value: p.id,
          label: p.title
        })));

        // Fetch collections
        const collectionsResponse = await fetch('/api/shopify/collections');
        const collectionsData = await collectionsResponse.json();
        setCollections(collectionsData.map(c => ({
          value: c.id,
          label: c.title
        })));
      } catch (error) {
        console.error('Error fetching Shopify data:', error);
      }
      setLoading(false);
    };

    fetchShopifyData();
  }, []);

  const handleProductChange = (selected) => {
    setSelectedProducts(selected || []);
    onSelect({
      products: selected || [],
      collections: selectedCollections
    });
  };

  const handleCollectionChange = (selected) => {
    setSelectedCollections(selected || []);
    onSelect({
      products: selectedProducts,
      collections: selected || []
    });
  };

  return (
    <div className="shopify-selector mb-4">
      <div className="mb-3">
        <label className="form-label">Select Products</label>
        <Select
          isMulti
          isLoading={loading}
          options={products}
          value={selectedProducts}
          onChange={handleProductChange}
          placeholder="Search and select products..."
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <small className="text-muted">
          Selected products: {selectedProducts.length}
        </small>
      </div>

      <div className="mb-3">
        <label className="form-label">Select Collections</label>
        <Select
          isMulti
          isLoading={loading}
          options={collections}
          value={selectedCollections}
          onChange={handleCollectionChange}
          placeholder="Search and select collections..."
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <small className="text-muted">
          Selected collections: {selectedCollections.length}
        </small>
      </div>
    </div>
  );
};

export default ProductCollectionSelector; 