import React from "react";

export const Pagination = ({
  currentPage,
  totalPages,
  handleNextPage,
  handlePrevPage,
  handlePageChange,
  handleCouponsPerPageChange,
  couponsPerPage,
}) => {
  // Helper to create a range of pages
  const getDisplayedPages = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const displayedPages = getDisplayedPages();

  return (
    <div className="flex items-center justify-between mt-6 mb-14 space-x-0">
      <div className="flex items-center space-x-2">
        <label htmlFor="datasPerPage" className="text-gray-700">
          Data per page:
        </label>
        <select
          id="datasPerPage"
          onChange={handleCouponsPerPageChange}
          value={couponsPerPage}
          className="border rounded px-3 py-1 text-gray-700 bg-gray-100 focus:outline-none focus:ring-0"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center justify-center space-x-0">
        {/* Previous Button */}
        <button
          onClick={() => handlePrevPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`ml-2 w-8 h-8 p-4 border-[1px] rounded-l-md flex items-center justify-center ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-black hover:bg-gray-200"
          }`}
        >
          &lt;
        </button>

        {/* Page Numbers */}
        {displayedPages.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`w-8 h-8 p-4 border-[1px] flex items-center justify-center ${
              number === currentPage
                ? "bg-gray-200 text-gray-400"
                : "hover:bg-gray-100"
            }`}
          >
            {number}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handleNextPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 p-4 border-[1px] rounded-r-md flex items-center justify-center ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-black hover:bg-gray-200"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
