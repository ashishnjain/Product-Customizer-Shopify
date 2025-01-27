(function() {
  // Initialize options
  class ProductOptionsManager {
    constructor() {
      this.container = document.getElementById('product-options-container');
      this.productId = this.container.dataset.productId;
      this.shopDomain = this.container.dataset.shop;
      this.init();
    }

    async init() {
      try {
        // Fetch options configuration
        const response = await fetch(`/apps/product-options/api/options/${this.productId}`);
        const options = await response.json();
        
        // Render options
        this.renderOptions(options);
        
        // Setup event listeners
        this.setupEventListeners();
      } catch (error) {
        console.error('Failed to initialize product options:', error);
      }
    }

    renderOptions(options) {
      // Create option elements based on configuration
      options.forEach(option => {
        const optionElement = this.createOptionElement(option);
        this.container.appendChild(optionElement);
      });
    }

    createOptionElement(option) {
      switch(option.type) {
        case 'dropdown':
          return this.createDropdown(option);
        case 'color_swatch':
          return this.createColorSwatch(option);
        case 'text':
          return this.createTextField(option);
        // Add more option types as needed
      }
    }

    setupEventListeners() {
      // Handle option changes
      this.container.addEventListener('change', (event) => {
        if (event.target.matches('.product-option')) {
          this.handleOptionChange(event);
        }
      });
    }

    handleOptionChange(event) {
      // Update price, validate options, trigger conditional logic
      this.updatePrice();
      this.validateOptions();
      this.checkConditions();
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    new ProductOptionsManager();
  });
})(); 