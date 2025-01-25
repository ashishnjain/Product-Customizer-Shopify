import { extend } from "@shopify/shopify-app-extensions";

extend("Product::Customizer", async (root, { settings }) => {
  // Create container
  const container = root.appendChild(document.createElement("div"));
  container.id = "product-customizer-container";

  // Add some basic styling
  container.style.padding = "20px";
  container.style.margin = "10px 0";
  container.style.border = "1px solid #ddd";

  // Add content
  container.innerHTML = `
    <h3>Product Customizer</h3>
    <div>Template: ${settings.template || "Default"}</div>
  `;

  // Return cleanup function
  return () => {
    root.removeChild(container);
  };
});
