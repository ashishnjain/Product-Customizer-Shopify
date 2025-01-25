// Lazy load options
function lazyLoadOptions() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadOptionData(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.option-container').forEach(option => {
    observer.observe(option);
  });
} 