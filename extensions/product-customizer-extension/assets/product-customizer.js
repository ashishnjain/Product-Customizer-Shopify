(function() {
  // Initialize the customizer
  const container = document.getElementById('customizer-root');
  if (!container) return;

  const productId = container.closest('.product-customizer').getAttribute('data-product-id');
  const shopDomain = container.closest('.product-customizer').getAttribute('data-shop-domain');

  // Load your app's main script
  const script = document.createElement('script');
  script.src = `https://${shopDomain}/apps/product-customizer/customizer.js`;
  script.onload = function() {
    if (window.ProductCustomizer) {
      window.ProductCustomizer.init({
        container: 'customizer-root',
        productId: productId
      });
    }
  };
  document.head.appendChild(script);
})(); 