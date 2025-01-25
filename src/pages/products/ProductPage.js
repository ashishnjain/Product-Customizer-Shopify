import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PocketCustomizer from "../../components/Customizer/PocketCustomizer";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <div className="container mt-4">
      {product ? (
        <div>
          <h1>{product.title}</h1>
          <PocketCustomizer product={product} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
