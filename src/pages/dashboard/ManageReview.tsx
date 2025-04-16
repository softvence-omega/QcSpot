import Loader from "../../components/Loader";
import ManageReviewTableRow from "../../components/ManageReviewTableRow";
import useReview from "../../hooks/useReviews";
import { IReview } from "../../types/review.type";

const Managereview = () => {
  const { reviewData, reviewLoading, reviewRefetch } = useReview();
  if (reviewLoading) return <Loader />;

  return (
    <div className="max-w-5xl mx-8 lg:mx-auto py-20 md:pt-24 lg:px-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Manage review</h2>

      <div className="overflow-x-auto">
        <table className="text-center text-black dark:text-white w-full">
          {/* head */}
          <thead>
            <tr className="text-sm sm:text-base bg-zinc-200 dark:bg-zinc-700 border-b dark:border-shadow h-12">
              <th>Sl</th>
              <th>Name</th>
              <th>Comment</th>
              <th>Rating</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
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
      </div>
    </div>
  );
};

export default Managereview;
