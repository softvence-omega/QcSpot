import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PLatformLink from "../components/PlatformLink";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Slider from "react-slick";
import { ProdNextArrow, ProdPrevArrow } from "../components/SlickComponents";
import Loader from "../components/Loader";
import Magnifier from "../components/Magnifier";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import axiosSecure from "../hooks/useAxios";
import useCollection from "../hooks/useCollection";
import { CollectionProps } from "./Collection";

export interface Sku {
  skuID: string;
  name: string;
  nameTrans: string;
  imgUrl: string;
  stock: number;
  propsID: string;
  propsCode: number[];
  specId: string;
  price: string;
}

export interface Product {
  title: string;
  propsTrans: any;
  price: number;
  imgList: string[];
  skus: Sku[];
}

// Slick settings
const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  nextArrow: <ProdNextArrow />,
  prevArrow: <ProdPrevArrow />,
};

const ProductDetailsPage = () => {
  const { shopType, id } = useParams<{ shopType: string; id: string }>();
  const { collectionData } = useCollection();
  const [product, setProduct] = useState<Product | null>(null);
  const [qc, setQc] = useState<string[] | null>(null);
  const [productLoading, setProductLoading] = useState<boolean>(true);
  const [qcLoading, setQcLoading] = useState<boolean>(true);
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [isOpen, setIsOpen] = useState({ img: "", state: false });
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const _id = queryParams.get("_id");

  let isProductInCollection;
  if (collectionData?.length > 0) {
    isProductInCollection = collectionData.some(
      (collection: CollectionProps) => collection.productCode === id
    );
  }
  console.log(isProductInCollection);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://cnfans.com/search-api/detail/product-info?platform=${shopType}&productID=${id}&forceReload=false&site=cnfans&lang=en&wmc-currency=USD`
        );
        const data = await res.json();
        const productData = data?.data?.productInfo || null;
        setProduct(productData);

        // Initialize selected SKU with the first available SKU
        // Select the first SKU that has a non-empty imgUrl
        const validSku = productData?.skus?.find((sku: Sku) =>
          sku.imgUrl?.trim()
        );
        if (validSku) {
          setSelectedSku(validSku);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setProductLoading(false);
      }
    };

    const fetchQcPhotos = async () => {
      try {
        const response1 = await axiosSecure.get(`/qc-photos/${id}`);
        const data1 = response1.data.data.photos;
        const response2 = await axios.get(
          `https://www.lovegobuy.com/index.php?s=/api/open/qc&shopType=${shopType}&goodsId=${id}`
        );
        const data2 = response2?.data?.data[0]?.imgs;
        setQc([...data1, ...data2]);
      } catch (error) {
        console.error("Error fetching QC photos:", error);
        setQc(null);
      } finally {
        setQcLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      fetchQcPhotos();
    }
  }, [id]);

  if (productLoading) return <Loader />;
  if (!product?.title) {
    if (_id) navigate(`/product/${_id}`);
    else
      return (
        <div className="text-center pt-40 md:pt-24 pb-10 px-4">
          <p className="text-4xl">Product not found!</p>
          <p className="text-sm mt-3 text-red-500">
            Oops! The product code seems to be incorrect.
          </p>
        </div>
      );
  }

  const handleAddToCollection = async () => {
    if (!user) toast.error("Please login to add to collection");
    try {
      const res = await axiosSecure.post(
        `/users/addToCollection?productCode=${id}&storeName=${shopType}`
      );
      if (res?.status === 200) {
        toast.success("Product added to collection successfully!");
      } else {
        toast.success("Failed to add product to collection.");
      }
    } catch (error: any) {
      if (error.response)
        toast.error(error.response.data?.message || "Something went wrong!");
      else toast.error("An error occurred while adding to collection.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-40 md:pt-24 pb-10 px-4">
      <div className="flex flex-col lg:flex-row rounded-lg shadow-lg overflow-hidden border dark:border-shadow dark:shadow-shadow">
        {/* Product Image */}
        <div className="w-96 p-3 mx-auto">
          {selectedSku?.imgUrl && <Magnifier imageUrl={selectedSku.imgUrl} />}
          <p className="text-center mt-2">{selectedSku?.nameTrans}</p>

          {product?.imgList && product?.imgList.length > 4 ? (
            <Slider {...settings} className="my-3">
              {product?.imgList?.map((img, index) => (
                <img
                  key={index}
                  className="w-16 h-16 object-cover object-center px-2 rounded-lg cursor-grab"
                  src={img}
                  alt="IMAGE"
                />
              ))}
            </Slider>
          ) : (
            <div className="grid grid-cols-4 mt-3">
              {product?.imgList?.map((img, index) => (
                <img
                  key={index}
                  className="w-16 h-16 object-cover object-center rounded-lg cursor-grab"
                  src={img}
                  alt="IMAGE"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Description */}
        <div className="p-5 flex flex-col flex-1">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            {product?.title}
          </h2>

          <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-5 items-center space-y-5 sm:space-y-0 a justify-between my-5">
            {/* Price */}
            <button className="w-full rounded-lg text-xl font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-4 py-2 transition text-black">
              Price: ¥ {selectedSku?.price || product?.price}
            </button>
            {/* Stock */}
            <button className="w-full text-white rounded-lg text-xl font-semibold bg-gray-500 duration-200 px-4 py-2 ">
              Stock: {selectedSku?.stock}
            </button>
            {/* Description */}
            <button
              onClick={() => setShowDescription(true)}
              disabled={Object.keys(product?.propsTrans || {}).length === 0}
              className="w-full text-white px-4 py-2 rounded-lg bg-btn hover:bg-green-500 duration-200"
            >
              Description
            </button>
          </div>

          {/* Classification */}
          <h2 className="font-bold text-sm">Classification: </h2>
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
          </div>

          {/* Action Buttons */}
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <PLatformLink
              className="bg-btn hover:bg-green-500 duration-200 px-4 py-2 rounded-lg text-white  w-full"
              id={id}
              shopType={shopType}
            />
            <div className="relative group">
              <button
                onClick={handleAddToCollection}
                disabled={!user || isProductInCollection}
                className="bg-gray-500 px-4 py-2 rounded-lg text-white flex justify-center items-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus /> <p>Add to Collection</p>
              </button>
              {!user && (
                <span className="absolute z-30 left-1/2 bottom-1/2 mb-2 w-max -translate-x-1/2 scale-0 disabled:opacity-100 transition-all rounded bg-btn px-1 text-sm text-white group-hover:scale-100">
                  Please login to add this product to collection
                </span>
              )}
            </div>
            {/* <button className="bg-gray-500 px-4 py-2 rounded-lg text-white flex justify-center items-center gap-2 w-full">
              <Share2 /> Affiliate Share
            </button> */}
          </div>
        </div>
      </div>

      {/* QC Photos Section */}
      {qcLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-16 h-16 animate-spin" />
        </div>
      ) : qc && qc.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mt-5">QC Photos:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-3">
            {qc.map((img, index) => (
              <img
                key={index}
                onClick={() => setIsOpen({ img, state: true })}
                src={img}
                alt={`product-image`}
                className="w-full h-[480px] object-cover rounded hover:shadow-xl cursor-pointer"
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center py-10 text-xl">No QC photos available</p>
      )}
      {showDescription && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowDescription(false)}
        >
          <div
            className=" py-10 max-h-[720px] overflow-y-scroll bg-white p-5 rounded-lg max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl text-red-500"
              onClick={() => setShowDescription(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-5 text-btn">
              Product Details
            </h2>
            {Object.entries(product?.propsTrans || {}).map(([key, value]) => (
              <p key={key} className="mb-1">
                <strong>{key}:</strong> {String(value)}
              </p>
            ))}
          </div>
        </div>
      )}
      {isOpen.state && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsOpen({ img: "", state: false })}
        >
          <div
            className="rounded-lg shadow-lg max-w-xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={isOpen?.img}
              alt={`product-image`}
              className="w-full h-full object-cover rounded hover:shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
