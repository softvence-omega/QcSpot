import useProduct from "../../hooks/useProducts";

const ManageProducts = () => {
  const { productData } = useProduct();

  console.log(productData);
  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Manage Products
      </h2>

      <section>{}</section>
    </div>
  );
};

export default ManageProducts;
