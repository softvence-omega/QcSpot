import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { TProduct } from "../../types/product.type";

const Trending = () => {
  const [products, setProducts] = useState<TProduct[]>([]);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [setProducts]);

  return (
    <div className="container">
      <h2 className="text-center pt-40 md:pt-28 duration-300 text-4xl mb-6">
        Trending Products
      </h2>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              image={product.thumbnail}
              title={product.name}
              price={product.price}
              views={product.views}
              likes={product.views}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;
