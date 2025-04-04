import Slider from "react-slick";
import { ProdNextArrow, ProdPrevArrow } from "./SlickComponents";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";
import axiosSecure from "../hooks/useAxios";
import { IVarient } from "../types";
import { useAuth } from "../context/AuthContext";

interface VarientCardProps {
  varient: IVarient;
  varientKeys: string[];
  refetch: () => void;
}

// Slick settings
const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <ProdNextArrow />,
  prevArrow: <ProdPrevArrow />,
};

const VarientCard = ({ varient, varientKeys, refetch }: VarientCardProps) => {
  const { user } = useAuth();
  const handleVarientDelete = () => {
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
          .delete(`/products/deleteVarient?varient_id=${varient?._id}`)
          .then((res) => {
            if (res.status === 200) {
              refetch();
              Swal.fire("Deleted!", "Varient has been deleted.", "success");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <div className="relative flex flex-col gap-3">
      {varient?.photos.length > 1 && (
        <Slider {...settings} key={varient?._id} className="">
          {varient?.photos?.map((img: string, index: number) => (
            <img
              key={index}
              className="h-96 sm:h-[420px] md:h-96 xl:h-[420px] object-cover object-center px-2 rounded-lg cursor-grab"
              src={img}
              alt="IMAGE"
            />
          ))}
        </Slider>
      )}
      {varient?.photos.length == 1 && (
        <img
          key={varient?._id}
          className="w-full h-96 sm:h-[420px] md:h-96 xl:h-[420px] object-cover object-center px-2 rounded-lg cursor-grab"
          src={varient?.photos[0]}
          alt="IMAGE"
        />
      )}
      <p className="mx-auto">
        <b>Quantity:</b> {varient?.quantity};{" "}
        {varientKeys.map((key) => (
          <span>
            <b>{key}</b>: {varient[`${key}`]};{" "}
          </span>
        ))}
      </p>
      {user?.role === "admin" && (
        <div
          onClick={handleVarientDelete}
          className="absolute top-2 right-4 cursor-pointer"
        >
          <Trash className="text-red-500 bg-red-200 rounded p-1 size-6" />
        </div>
      )}
    </div>
  );
};

export default VarientCard;
