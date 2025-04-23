import { useEffect, useState } from "react";
import { Product } from "../pages/ProductDetailsPage";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";
import axiosSecure from "../hooks/useAxios";
import toast from "react-hot-toast";

interface CollectionCardProps {
  collection: {
    _id: string;
    storeName: string;
    productCode: string;
  };
  refetch: () => void;
}

const CollectionCard = ({ collection, refetch }: CollectionCardProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState<boolean>(true);
  const { storeName, productCode } = collection;
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://cnfans.com/search-api/detail/product-info?platform=${storeName.toLowerCase()}&productID=${productCode}&forceReload=false&site=cnfans&lang=en&wmc-currency=USD`
        );
        const data = await res.json();
        const productData = data?.data?.productInfo || null;
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setProductLoading(false);
      }
    };

    if (productCode) {
      fetchProduct();
    }
  }, [productCode]);

  if (productLoading) return <Loader />;
  if (!product?.title) {
    return (
      <div className="text-center pt-40 md:pt-24 pb-10 px-4">
        <p className="text-4xl">Product not found!</p>
      </div>
    );
  }

  const handleCollectionDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .post(`/users/removeFromCollection?productCode=${productCode}`)
          .then((res) => {
            if (res.status === 200) {
              refetch();
              Swal.fire("Deleted!", "Varient has been deleted.", "success");
            }
          })
          .catch((error) => {
            toast.error(error.response.data.message || "Something went wrong!");
            console.log(error);
          });
      }
    });
  };
  return (
    <div className="flex rounded-lg shadow-lg border dark:border-shadow dark:shadow-shadow">
      {/* Product Image */}
      <div className="w-40 mx-auto">
        <img
          src={product?.imgList[0]}
          alt={product?.title}
          className="w-full h-full object-cover object-center rounded-l-lg"
        />
      </div>

      {/* Product Description */}
      <div className="relative p-5 flex flex-col flex-1">
        <h2 className="font-semibold line-clamp-2 mb-2">{product?.title}</h2>

        {/* Price */}
        <p className="mb-3">Price: ¥ {product?.price}</p>

        {/* Description */}
        <Link
          to={`/product/${storeName}/${productCode}`}
          className="absolute bottom-3 left-3 right-3 text-white px-4 py-2 rounded-lg bg-btn hover:bg-green-500 duration-200 text-center"
        >
          Details
        </Link>
        <div
          onClick={handleCollectionDelete}
          className="absolute top-2 right-4 cursor-pointer"
        >
          <Trash className="text-red-500 bg-red-200 rounded p-1 size-6" />
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
