// Initialize the product customizer
function initProductCustomizer() {
  const container = document.getElementById('product-customizer-root');
  if (!container) return;

  const config = window.productCustomizerConfig || {};
  
  // Get product data
  const productId = container.dataset.productId;
  const variantId = container.dataset.variantId;
  const shopDomain = container.dataset.shopDomain;

  // Initialize your app
  renderCustomizer({
    productId,
    variantId,
    shopDomain,
    container
  });
}

// Render customizer function
function renderCustomizer(props) {
  const { container } = props;

  // Add loading state
  container.innerHTML = '<div class="customizer-loading">Loading customizer...</div>';

  // Fetch options from your app's backend
  fetch(`/apps/product-customizer/options?productId=${props.productId}`)
    .then(response => response.json())
    .then(data => {
      // Render options
      const optionsHtml = data.options.map(option => {
        return `
          <div class="customizer-option">
            <div class="customizer-option-label">${option.label}</div>
            <div class="option-radio-group">
              ${option.values.map(value => `
                <div class="option-radio-item" data-value="${value.id}">
                  ${value.image ? `<img src="${value.image}" class="option-image" alt="${value.label}">` : ''}
                  <div class="option-label">${value.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = optionsHtml;

      // Add event listeners
      initializeEventListeners(container);
    })
    .catch(error => {
      console.error('Error loading customizer:', error);
      container.innerHTML = '<div class="customizer-error">Failed to load customizer options</div>';
    });
}

// Initialize event listeners
function initializeEventListeners(container) {
  const radioItems = container.querySelectorAll('.option-radio-item');
  
  radioItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove selected class from siblings
      const group = item.closest('.option-radio-group');
      group.querySelectorAll('.option-radio-item').forEach(sibling => {
        sibling.classList.remove('selected');
      });

      // Add selected class to clicked item
      item.classList.add('selected');

      // Trigger change event
      const event = new CustomEvent('customizer:option:change', {
        detail: {
          value: item.dataset.value
        }
      });
      container.dispatchEvent(event);
    });
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initProductCustomizer); 