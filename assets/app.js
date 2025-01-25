document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('product-customizer-root');
  if (!container) return;

  const productId = container.dataset.productId;
  const shopUrl = container.dataset.shopUrl;

  // Initialize customizer
  initializeCustomizer(container, {
    productId,
    shopUrl
  });
});

function initializeCustomizer(container, config) {
  // Load product options
  fetchProductOptions(config.productId)
    .then(options => {
      renderOptions(container, options);
    });
} 