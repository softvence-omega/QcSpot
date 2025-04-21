import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useCountry from "../hooks/useCountry";
import useCategory from "../hooks/useCategory";
import { FaTimes } from "react-icons/fa";
import { ICategory, ICategoryChild, ICountry } from "../types/estimation.type";
import { Loader2 } from "lucide-react";
import EstimationCard from "../components/EstimationCard";
import axiosSecure from "../hooks/useAxios";

export interface TEstimation {
  destination: string;
  weight?: number;
  features?: string[];
  length?: number;
  width?: number;
  height?: number;
}

const Estimation = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedItemCode, setSelectedItemCode] = useState<string[]>([]);
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [estimationData, setEstimationData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const { countryData } = useCountry();
  const { categoryData } = useCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TEstimation>();

  const onSubmit = async (data: TEstimation) => {
    const submittedData = {
      destination: selectedCountryCode,
      weight: data.weight,
      features: selectedItemCode.join(","),
      length: data.length,
      width: data.width,
      height: data.height,
    };
    try {
      setLoading(true);
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
      setLoading(false);
      setSubmitted(true);
    }
  };

  //-----------------------------------------------------------------//
  //              Dropdown Logics for country and items
  //-----------------------------------------------------------------//
  const destinationRef = useRef<HTMLDivElement>(null);
  const itemsWrapperRef = useRef<HTMLDivElement>(null);
  const itemsBoxRef = useRef<HTMLDivElement>(null); // new ref for the click box

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
  return (
    <div className="max-w-7xl mx-auto pt-40 md:pt-24 pb-10 px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Shipping Calculator
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-4 gap-5 w-full"
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
            type="number"
            {...register("height")}
            className="w-full mt-1 p-2 border rounded outline-none focus:border-green-500 bg-white dark:bg-black dark:border-shadow"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-btn text-white py-2 rounded hover:bg-green-500 transition mt-6"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            "calculate"
          )}
        </button>
      </form>

      <section className="mt-10">
        {submitted &&
          (estimationData.length > 0 ? (
            <div>
              {estimationData.map((item: any) => (
                <EstimationCard key={item.id} data={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          ))}
      </section>
    </div>
  );
};

export default Estimation;
