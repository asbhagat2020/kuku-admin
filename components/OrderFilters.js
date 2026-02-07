



// OrderFilters.js
import React from 'react';
import { Search, Filter } from 'lucide-react';

const OrderFilters = ({ searchTerm, setSearchTerm, sortOption, setSortOption, setIsFilterOpen }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sort by</option>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
      </div>
    </div>
  );
};

export default OrderFilters;
