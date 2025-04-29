import { FaBackward, FaForward } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPaginationRange = () => {
    const pageCountToShow = 5; // Adjust window size if needed
    const half = Math.floor(pageCountToShow / 2);
    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

    if (end - start + 1 < pageCountToShow) {
      if (start === 2) {
        end = Math.min(
          totalPages - 1,
          end + (pageCountToShow - (end - start + 1))
        );
      } else if (end === totalPages - 1) {
        start = Math.max(2, start - (pageCountToShow - (end - start + 1)));
      }
    }

    const pages: (number | "...")[] = [];

    // Always add 1st page
    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    // Always add last page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPaginationRange();

  return (
    <div className="sticky bottom-5 opacity-100 flex justify-center mt-6 duration-100">
      <div className="join">
        <button
          className="join-item btn disabled:hidden"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <FaBackward />
        </button>
        {pages.map((page, idx) =>
          page === "..." ? (
            <button
              disabled
              key={`ellipsis-${idx}`}
              className="join-item btn !bg-gray-500 !text-white"
            >
              ...
            </button>
          ) : (
            <button
              key={page}
              className={`join-item btn ${
                page === currentPage ? "btn-active bg-green-500 text-white" : ""
              }`}
              onClick={() => onPageChange(Number(page))}
            >
              {page}
            </button>
          )
        )}
        <button
          className="join-item btn disabled:hidden"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <FaForward />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
