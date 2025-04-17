import { useState } from "react";
import ManageReviewTableRow from "../../components/ManageReviewTableRow";
import useReview from "../../hooks/useReviews";
import { IReview } from "../../types/review.type";
import { Loader2, X } from "lucide-react";
const Managereview = () => {
  const [filters, setFilters] = useState({ status: "", product_code: "" });

  const queryParams = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== "")
  );

  const { reviewData, reviewLoading, reviewRefetch } = useReview(queryParams);

  const handleClearFilters = () => {
    setFilters({ status: "", product_code: "" });
  };

  return (
    <div className="max-w-5xl mx-8 lg:mx-auto py-20 md:pt-24 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Manage review</h2>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3 sm:gap-5">
        {/* Status */}
        <div className="flex flex-col">
          <label className="text-xs mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="border rounded px-2 py-1 outline-none focus:border-green-500 bg-white dark:bg-black text-sm cursor-pointer"
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Product code */}
        <div className="flex flex-col">
          <label className="text-xs mb-1">Product Code</label>
          <input
            type="text"
            value={filters.product_code}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, product_code: e.target.value }))
            }
            placeholder="Search by product code"
            className="border rounded px-2 py-1 outline-none focus:border-green-500 bg-white dark:bg-black text-sm"
          />
        </div>

        {/* Clear Filters */}
        <button
          onClick={handleClearFilters}
          className="mt-2 md:mt-0 px-2 py-1 text-red-500 hover:text-red-600 duration-300 rounded text-2xl relative group w-fit"
        >
          <X />
          <span className="absolute z-30 left-1/2 top-full mt-1 mb-2 w-max -translate-x-1/2 scale-0 transition-all rounded bg-red-500 px-1 text-xs text-white group-hover:scale-100">
            Clear filters
          </span>
        </button>
      </div>

      {reviewLoading ? (
        <div className="flex justify-center items-center py-20 text-4xl">
          <Loader2 className="w-16 h-16 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-hidden">
          {reviewData.length > 0 ? (
            <table className="text-center text-black dark:text-white w-full">
              <thead>
                <tr className="text-sm sm:text-base bg-zinc-200 dark:bg-zinc-700 border-b dark:border-shadow h-12">
                  <th>Sl</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>User Name</th>
                  <th>Comment</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reviewData?.map((review: IReview, index: number) => (
                  <ManageReviewTableRow
                    key={review?._id}
                    review={review}
                    index={index}
                    refetch={reviewRefetch}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <p className="text-center">No Review Found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Managereview;
