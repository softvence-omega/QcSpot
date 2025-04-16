import {
  ExternalLink,
  Loader2,
  MessageSquare,
  Plus,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import useSingleProduct from "../hooks/useSingleProduct";
import { ICategory, ICategoryChild, ICountry } from "../types/estimation.type";
import useCountry from "../hooks/useCountry";
import useCategory from "../hooks/useCategory";
import { useForm } from "react-hook-form";
import { TEstimation } from "./Estimation";
import { FaTimes } from "react-icons/fa";
import EstimationCard from "../components/EstimationCard";
import useReview from "../hooks/useReviews";
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

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

// rating style
const ratingStyles = {
  itemShapes: Star,
  activeFillColor: "#ffb33e",
  inactiveFillColor: "#a78f6d",
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
  // -------------------- Estimation hooks starts ---------------------
  const [estimationDataLoading, setEstimationDataLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedItemCode, setSelectedItemCode] = useState<string[]>([]);
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [estimationData, setEstimationData] = useState([]);
  const [isEstimationExpanded, setIsEstimationExpanded] = useState(false);
  const { countryData } = useCountry();
  const { categoryData } = useCategory();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TEstimation>();
  const destinationRef = useRef<HTMLDivElement>(null);
  const itemsWrapperRef = useRef<HTMLDivElement>(null);
  const itemsBoxRef = useRef<HTMLDivElement>(null);
  // -------------------- Estimation hooks ends ---------------------
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const queryParams = new URLSearchParams(location.search);
  const _id = queryParams.get("_id");
  const { singleProductData, singleProductLoading } = useSingleProduct(
    _id as string
  );
  const { reviewData, reviewLoading } = useReview();
  const isProductInCollection =
    collectionData?.length > 0
      ? collectionData.some(
          (collection: CollectionProps) => collection.productCode === id
        )
      : false;

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
        if (data1 && data2) setQc([...data1, ...data2]);
        else if (data1) setQc(data1);
        else if (data2) setQc(data2);
        else setQc([]);
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

  // Close dropdown on outside click on destination
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDestination = destinationRef.current?.contains(target);
      const clickedInsideItems =
        itemsWrapperRef.current?.contains(target) ||
        itemsBoxRef.current?.contains(target);

      if (!clickedInsideDestination && !clickedInsideItems) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on outside click on items
  useEffect(() => {
    const handleClickOutsideItems = (event: MouseEvent) => {
      if (
        itemsWrapperRef.current &&
        !itemsWrapperRef.current.contains(event.target as Node) &&
        itemsBoxRef.current &&
        !itemsBoxRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideItems);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideItems);
    };
  }, []);

  // Set default active option as trhe first option when dropdown opens
  useEffect(() => {
    if (dropdownOpen && !activeOption) {
      setActiveOption(categoryData[0].name);
    }
  }, [dropdownOpen]);

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

  const onEstimationSubmit = async (data: TEstimation) => {
    const submittedData = {
      destination: selectedCountryCode,
      weight: data.weight,
      features: selectedItemCode.join(","),
      length: data.length,
      width: data.width,
      height: data.height,
    };
    try {
      setEstimationDataLoading(true);
      const res = await axiosSecure.post("get_estimation", submittedData);
      console.log(res?.data?.data);
      const result = res?.data?.data;
      if (res.status !== 200) toast.error("Something went wrong!");
      setEstimationData(result);
      reset();
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch data!";
      toast.error(errorMessage);
    } finally {
      setEstimationDataLoading(false);
      setIsEstimationExpanded(true);
    }
  };

  //-----------------------------------------------------------------//
  //              Dropdown Logics for country and items
  //-----------------------------------------------------------------//

  // Handle country search
  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedCountry(value);
    if (value.trim().length === 0) {
      setFilteredCountries([]);
      setShowDropdown(false);
      return;
    }
    const filtered = countryData.filter(
      (c: any) =>
        c.name.toLowerCase().includes(value.toLowerCase()) ||
        c.code.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCountries(filtered);
    setShowDropdown(true);
  };

  // Handle country selection
  const handleCountrySelection = (country: ICountry) => {
    setSelectedCountry(country.name);
    setSelectedCountryCode(country.code);
    setShowDropdown(false);
  };

  // Handle option selection (select/deselect all sub-options in a category)
  const handleOptionToggle = (option: string) => {
    const current = categoryData.find((o: ICategory) => o.name === option);
    if (!current) return;

    const allSubs = current.children.map((s: ICategoryChild) => ({
      label: `${option}/${s.name}`,
      id: s.id,
    }));

    const isFullySelected = allSubs.every((item: any) =>
      selectedOption.includes(item.label)
    );

    if (isFullySelected) {
      setSelectedOption((prev) =>
        prev.filter((item) => !item.startsWith(`${option}/`))
      );
      setSelectedItemCode((prev) =>
        prev.filter(
          (id) =>
            !current.children.some((child: ICategoryChild) => child.id === id)
        )
      );
    } else {
      const newSelection = allSubs.filter(
        (item: any) => !selectedOption.includes(item.label)
      );
      setSelectedOption((prev) => [
        ...prev,
        ...newSelection.map((item: any) => item.label),
      ]);
      setSelectedItemCode((prev) => [
        ...prev,
        ...newSelection.map((item: any) => item.id),
      ]);
    }
  };

  // Handle sub-option selection
  const handleSubOptionToggle = (option: string, subOption: string) => {
    const value = `${option}/${subOption}`;
    const category = categoryData.find((c: ICategory) => c.name === option);
    const child = category?.children.find(
      (c: ICategoryChild) => c.name === subOption
    );
    if (!child) return;

    if (selectedOption.includes(value)) {
      setSelectedOption((prev) => prev.filter((item) => item !== value));
      setSelectedItemCode((prev) => prev.filter((id) => id !== child.id));
    } else {
      setSelectedOption((prev) => [...prev, value]);
      setSelectedItemCode((prev) => [...prev, child.id]);
    }
  };

  // Handle item removal
  const removeItem = (item: string) => {
    const [option, subOption] = item.split("/");
    const category = categoryData.find((c: ICategory) => c.name === option);
    const child = category?.children.find(
      (c: ICategoryChild) => c.name === subOption
    );
    if (!child) return;

    setSelectedOption((prev) => prev.filter((i) => i !== item));
    setSelectedItemCode((prev) => prev.filter((id) => id !== child.id));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please enter a comment and select a rating.");
      return;
    }

    const reviewData = {
      store_name: shopType == "ali_1688" ? "1688" : shopType,
      product_code: id,
      name: user?.name,
      comment,
      rating,
    };

    // onSubmitReview({ comment, rating });

    console.log(reviewData);
    setComment("");
    setRating(0);
  };

  // Finding out the length, width and height from dimensions
  const dimensionsString = singleProductData?.product?.dimensions || "";
  const [length, width, height] = dimensionsString
    .split(/\s*x\s*/i)
    .map((dim: any) => dim.trim());

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
                  className="w-16 h-16 object-cover object-center rounded-lg"
                  src={img}
                  alt="IMAGE"
                />
              ))}
            </div>
          )}

          {/* Estimation Form starts */}
          <form
            onSubmit={handleSubmit(onEstimationSubmit)}
            className="grid grid-cols-2 gap-2 w-full mt-5 mx-2"
          >
            {/* --------------- Destination -------------- */}
            <div className="relative col-span-2" ref={destinationRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Destination <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full outline-none focus:border-green-500 bg-white dark:bg-black border dark:border-shadow py-3 px-5"
                placeholder="Start typing a country..."
              />
              {showDropdown && filteredCountries.length > 0 && (
                <ul className="absolute z-10 w-full bg-white dark:bg-zinc-900 border dark:border-zinc-700 max-h-60 overflow-y-auto scrollbar-visible shadow-lg rounded mt-1 transition-all duration-200 ease-in-out">
                  {filteredCountries.map((country) => (
                    <li
                      key={country.code}
                      className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer"
                      onClick={() => handleCountrySelection(country)}
                    >
                      {country.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* --------------- Items -------------- */}
            <div
              className="relative w-full max-w-xl col-span-2"
              ref={itemsWrapperRef}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Items Category
              </label>
              {/* Display Box */}
              <div
                ref={itemsBoxRef}
                className="min-h-[48px] rounded px-3 py-2 cursor-pointer flex flex-wrap gap-2 items-center  bg-white dark:bg-black border dark:border-shadow"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedOption.length === 0 ? (
                  <span className="text-gray-400">Click to select...</span>
                ) : (
                  selectedOption.map((item) => (
                    <span
                      key={item}
                      className="bg-blue-100 dark:bg-zinc-700 text-btn dark:text-white px-2 py-1 text-xs rounded flex items-center gap-1"
                    >
                      {item}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item);
                        }}
                      >
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute z-20 mt-2 w-full bg-white dark:bg-black border dark:border-zinc-700 shadow-lg flex rounded-lg overflow-hidden max-h-64">
                  {/* Left: Options */}
                  <div className="w-1/2 overflow-y-auto scrollbar-visible border-r dark:border-zinc-700">
                    {categoryData.map((opt: ICategory) => {
                      const allChecked = opt.children.every((s) =>
                        selectedOption.includes(`${opt.name}/${s.name}`)
                      );
                      return (
                        <div
                          key={opt.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOption(opt.name);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <input
                            type="checkbox"
                            checked={allChecked}
                            className="cursor-pointer bg-white"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleOptionToggle(opt.name);
                            }}
                          />
                          <span>{opt.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Sub Options */}
                  <div className="w-1/2 overflow-y-auto scrollbar-visible">
                    {activeOption &&
                      categoryData
                        .find((opt: ICategory) => opt.name === activeOption)
                        ?.children.map((sub: ICategoryChild) => {
                          const fullValue = `${activeOption}/${sub.name}`;
                          return (
                            <div
                              key={fullValue}
                              className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                              <input
                                type="checkbox"
                                className="cursor-pointer"
                                checked={selectedOption.includes(fullValue)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleSubOptionToggle(activeOption, sub.name);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span>{sub.name}</span>
                            </div>
                          );
                        })}
                  </div>
                </div>
              )}
            </div>

            {/* --------------- Weight -------------- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Weight(g) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                defaultValue={singleProductData?.product?.weight}
                {...register("weight", { required: "Weight is required" })}
                className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
              />
              {errors.weight && (
                <p className="text-red-500 text-sm">{errors.weight.message}</p>
              )}
            </div>

            {/* --------------- Length -------------- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Length(cm)
              </label>
              <input
                defaultValue={length}
                type="number"
                {...register("length")}
                className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
              />
            </div>

            {/* --------------- Width -------------- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Width(cm)
              </label>
              <input
                defaultValue={width}
                type="number"
                {...register("width")}
                className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
              />
            </div>

            {/* --------------- Height -------------- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Height(cm)
              </label>
              <input
                defaultValue={height}
                type="number"
                {...register("height")}
                className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={estimationDataLoading}
              className="col-span-2 w-full bg-btn text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-500 transition mt-3 mb-2"
            >
              {estimationDataLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                <>
                  <MessageSquare size={20} />
                  Calculate Shipping
                  <ExternalLink size={16} />
                </>
              )}
            </button>
            {/* <button className="w-full hover:bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 bg-btn transition-colors duration-200 ">
                <MessageSquare size={20} />
                Calculate Shipping
                <ExternalLink size={16} />
              </button> */}
          </form>
          {/* Estimation Form ends */}
        </div>

        {/* Product Description */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-center gap-5">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              {product?.title}
            </h2>

            <div>
              <p>Average rating:</p>
              <p>Number of reviews:</p>
            </div>
          </div>

          <div className="sm:grid grid-cols-2 md:grid-cols-3 gap-5 items-center space-y-5 sm:space-y-0 a justify-between my-5">
            {/* Price */}
            <p className="w-full rounded-lg text-xl font-semibold bg-gray-100 hover:bg-gray-300 duration-200 px-4 py-2 transition text-black text-center">
              Price: ¥ {selectedSku?.price || product?.price}
            </p>
            {/* Stock */}
            <p
              className={`w-full text-white rounded-lg text-xl font-semibold  duration-200 px-4 py-2 text-center ${
                selectedSku?.stock == 0 ? "bg-red-500/50" : "bg-gray-500"
              }`}
            >
              Stock: {selectedSku?.stock}
            </p>
            {/* Description */}
            <button
              onClick={() => setShowDescription(true)}
              disabled={Object.keys(product?.propsTrans || {}).length === 0}
              className="w-full text-white px-4 py-2 rounded-lg bg-btn hover:bg-green-500 duration-200 disabled:bg-green-500/50 cursor-pointer disabled:cursor-not-allowed"
            >
              Description
            </button>
          </div>
          <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-2 md:gap-5">
            <h2 className="font-bold text-sm">Classification: </h2>
            {!singleProductLoading &&
              singleProductData?.product?.dimensions && (
                <p className="font-bold">
                  Dimensions:{" "}
                  <span className="text-red-500">
                    {singleProductData?.product?.dimensions}
                  </span>
                </p>
              )}
            {!singleProductLoading && singleProductData?.product?.weight && (
              <p className="font-bold">
                weight:{" "}
                <span className="text-red-500">
                  {singleProductData?.product?.weight}g
                </span>
              </p>
            )}
          </div>

          {/* Classification */}
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
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            {/* <Link to="/estimation">
              <button className="w-full hover:bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 bg-btn transition-colors duration-200 ">
                <MessageSquare size={20} />
                Calculate Shipping
                <ExternalLink size={16} />
              </button>
            </Link> */}
          </div>
        </div>
      </div>

      {/* Estimated data show */}
      {isEstimationExpanded &&
        (estimationData.length > 0 ? (
          <div className="mt-10">
            <button
              className="underline text-blue-500 mb-3 cursor-pointer text-sm"
              onClick={() => setIsEstimationExpanded(false)}
            >
              Collapse Shipping data
            </button>
            {estimationData.map((item: any) => (
              <EstimationCard key={item.id} data={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        ))}

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

      {/* Reviews and Ratings */}
      {reviewLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-16 h-16 animate-spin" />
        </div>
      ) : reviewData && reviewData.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mt-5">Reviews:</h2>
          <div className="mt-3">
            {reviewData.map((data: any, index: number) => (
              <div
                key={index}
                className="flex items-center p-3 rounded border dark:border-shadow mb-2"
              >
                <User className="rounded-full border dark:border-shadow size-8 p-1 min-w-8" />
                <div className="px-3">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-green-500 text-sm">{data?.name}</p>
                    <p className="text-zinc-500 dark:text-zinc-300 text-xs">
                      3 days ago
                    </p>
                    <Rating
                      className="max-w-20 ml-5"
                      readOnly
                      value={data?.rating || 0}
                      itemStyles={ratingStyles}
                    />
                  </div>
                  <p className="text-sm">{data?.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center py-10 text-xl">No Reviews available</p>
      )}

      <h2 className="text-2xl font-semibold mt-5 mb-3">Add a Review:</h2>
      <form
        className="flex flex-col sm:flex-row gap-5 items-center"
        onSubmit={handleReviewSubmit}
      >
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment"
          className="w-full bg-white dark:bg-black border dark:border-shadow outline-none px-3 py-2 rounded scrollbar-visible"
        />

        {/* ⭐ Star Rating Input */}
        <Rating
          style={{ maxWidth: 120 }}
          value={rating}
          onChange={setRating}
          items={5}
        />

        <input
          className="bg-btn hover:bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
          type="submit"
          value="Submit"
        />
      </form>
      {showDescription && (
        <div
          className="fixed scrollbar-visible inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowDescription(false)}
        >
          <div
            className=" py-10 max-h-[720px] overflow-y-scroll bg-white dark:bg-gray-500 p-5 rounded-lg max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl text-red-500"
              onClick={() => setShowDescription(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-5 text-btn dark:text-green-500">
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
