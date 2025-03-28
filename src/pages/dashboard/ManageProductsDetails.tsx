import { useParams } from "react-router-dom";
import axiosSecure from "../../hooks/useAxios";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const ManageProductsDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosSecure
      .get(`/products/findProductById?product_Id=${id}`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  console.log(product);

  if (loading)
    return (
      <div className="flex justify-center items-center py-40 text-4xl">
        <Loader2 className="w-20 h-20 animate-spin" />
      </div>
    );
  if (!product) return <p>Product not found.</p>;

  const {
    _id,
    name,
    productCode,
    price,
    inStock,
    storeName,
    shippingTime,
    weight,
    dimensions,
    isDeleted,
    onTrend,
    totalView,
    totalPhoto,
    searchField,
    thumbnailImg,
    variants,
  } = product.product;
  return (
    <div className="max-w-5xl mx-auto py-20 md:pt-24 px-8 lg:px-4">
      <div className="flex flex-col lg:flex-row rounded-lg shadow-lg overflow-hidden border dark:border-shadow dark:shadow-shadow">
        {/* Product Image */}
        <div className="w-96 p-3 mx-auto">
          {thumbnailImg && (
            <img
              className="w-full max-h-96 object-cover object-center rounded-lg mx-auto"
              src={thumbnailImg}
              alt={name}
            />
          )}
          <p className="text-center mt-2">{name}</p>
        </div>

        {/* Product Description */}
        <div className="p-5 flex flex-col flex-1">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">{name}</h2>

          <div className="flex gap-5 items-center justify-between my-5">
            {/* Price */}
            <button className="w-full rounded-lg text-xl font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-4 py-2 transition text-black">
              Price: ¥ {price}
            </button>
            {/* Stock */}
            {/* <button className="w-full text-white rounded-lg text-xl font-semibold bg-gray-500 duration-200 px-4 py-2 ">
              Stock: {selectedSku?.stock}
            </button> */}
          </div>

          {/* Classification */}
          {/* <h2 className="font-bold text-sm">Classification: </h2>
          <div className="flex flex-wrap gap-2 my-3">
            {product?.skus
              ?.filter((sku) => sku.imgUrl?.trim())
              .map((sku) => (
                <img
                  key={sku.skuID}
                  className={`w-10 object-cover cursor-pointer border-2 ${
                    selectedSku?.skuID === sku.skuID
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  src={sku.imgUrl}
                  alt={sku.nameTrans}
                  onClick={() => setSelectedSku(sku)}
                />
              ))}
          </div> */}

          {/* Action Buttons */}
          {/* <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <PLatformLink id={id} shopType={shopType} />
            <button className="bg-gray-500 px-4 py-2 rounded-lg text-white flex justify-center items-center gap-2 w-full">
              <Plus /> Add to Collection
            </button>
            <button className="bg-gray-500 px-4 py-2 rounded-lg text-white flex justify-center items-center gap-2 w-full">
              <Share2 /> Affiliate Share
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ManageProductsDetails;
