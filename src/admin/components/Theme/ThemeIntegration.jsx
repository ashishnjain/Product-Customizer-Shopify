import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ThemeIntegration = ({ onBack }) => {
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState({
    id: '174724251948',
    name: 'Dawn',
    role: 'main'
  });

  // Check if app is already embedded when component mounts
  useEffect(() => {
    checkAppStatus();
  }, []);

  const checkAppStatus = async () => {
    try {
      const response = await fetch('/api/shopify/theme/status');
      const data = await response.json();
      if (data.isEmbedded) {
        setIsEmbedded(true);
      }
    } catch (err) {
      console.error('Error checking app status:', err);
    }
  };

  const handleEmbedClick = async () => {
    try {
      setIsEmbedding(true);
      
      // Call to backend to embed the app
      const response = await axios.post('/api/shopify/embed-app', {
        shop: process.env.SHOP_DOMAIN
      });

      if (response.data.success) {
        toast.success('App successfully embedded!');
      } else {
        throw new Error('Failed to embed app');
      }
    } catch (error) {
      console.error('Embed Error:', error);
      toast.error('Failed to embed app. Please try again.');
    } finally {
      setIsEmbedding(false);
    }
  };

  const handleThemeEditorClick = () => {
    const shop = 'quick-start-b5afd779';
    const editorUrl = `https://admin.shopify.com/store/${shop}/themes/${currentTheme.id}/editor`;
    window.open(editorUrl, '_blank');
  };

  const handleHelpClick = (e) => {
    e.preventDefault();
    window.open('https://help.shopify.com/manual/online-store/themes/theme-structure/app-embeddings', '_blank');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Theme Setup</h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={onBack}
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      {/* App Embed Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>App embed</h5>
          <div className="d-flex align-items-center gap-3">
            <button 
              className={`btn ${isEmbedded ? 'btn-success' : 'btn-primary'}`}
              onClick={handleEmbedClick}
              disabled={isEmbedding || isEmbedded}
            >
              {isEmbedding ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Embedding...
                </>
              ) : (
                isEmbedded ? 'App Embedded ✓' : 'Click to Embed App'
              )}
            </button>
            {isEmbedded && (
              <span className="text-success">
                <i className="fas fa-check-circle me-1"></i>
                Successfully embedded
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Theme Selection Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Select Theme</h5>
          <select className="form-select mb-3" disabled>
            <option>{currentTheme.name} (Current theme)</option>
          </select>

          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-secondary"
              onClick={handleThemeEditorClick}
              disabled={!isEmbedded}
            >
              Go to Theme Editor
            </button>
            <a 
              href="#"
              onClick={handleHelpClick}
              className="text-primary text-decoration-none"
            >
              How to enable app embed?
            </a>
          </div>

          {!isEmbedded && (
            <div className="alert alert-info mt-3">
              <i className="fas fa-info-circle me-2"></i>
              Please activate app embed first to customize it in Theme Editor
            </div>
          )}
        </div>
      </div>

      {/* Instructions Section */}
      <div className="card">
        <div className="card-body">
          <h5>Instructions</h5>
          <ol className="mb-0">
            <li>Click the "Click to Embed App" button to add the app block to your theme</li>
            <li>Once embedded, click "Go to Theme Editor" to customize the appearance</li>
            <li>In the Theme Editor, locate the app block and adjust settings as needed</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ThemeIntegration; 