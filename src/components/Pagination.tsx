import { FaBackward, FaForward } from "react-icons/fa";

// components/Pagination.tsx
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
    const pageCountToShow = 10;
    const half = Math.floor(pageCountToShow / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + pageCountToShow - 1);

    if (end - start + 1 < pageCountToShow) {
      start = Math.max(1, end - pageCountToShow + 1);
    }

    const pages: (number | "...")[] = [];

    if (start > 1) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) pages.push("...");

    return pages;
  };

  const pages = getPaginationRange();

  return (
    <div className="sticky bottom-5 opacity-100 flex justify-center mt-6 duration-100">
      <div className="join">
        <button
          className="join-item btn  disabled:hidden"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <FaBackward />
        </button>
        {pages.map((page, idx) =>
          page === "..." ? (
            <button disabled key={idx} className="join-item btn">
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
