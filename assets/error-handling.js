function handleCustomizerError(error) {
  console.error('Customizer Error:', error);
  
  // Show user-friendly error message
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('customizer-error');
  errorContainer.textContent = 'Unable to load product options. Please try again.';
  
  container.appendChild(errorContainer);
} 