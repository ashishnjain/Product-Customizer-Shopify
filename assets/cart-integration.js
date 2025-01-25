function addToCart(productId, customizations) {
  const data = {
    items: [{
      id: productId,
      quantity: 1,
      properties: customizations
    }]
  };

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    // Handle success
  })
  .catch(error => {
    // Handle error
  });
} 