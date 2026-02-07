import React, { useState, useEffect } from 'react';

// Sample data to simulate fetched bidding details
const sampleBiddings = [
  { id: 1, item: 'Vintage Painting', bidAmount: 1500, status: 'Won' },
  { id: 2, item: 'Antique Vase', bidAmount: 2000, status: 'Pending' },
  { id: 3, item: 'Classic Watch', bidAmount: 1000, status: 'Lost' },
];

export const Bidding = () => {
  const [biddings, setBiddings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    setBiddings(sampleBiddings); // Initialize with sample data
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);
  const handleSort = (e) => setSortOption(e.target.value);

  const filteredBiddings = biddings
    .filter(
      (bid) =>
        bid.item.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter ? bid.status === statusFilter : true)
    )
    .sort((a, b) => {
      if (sortOption === 'Item') return a.item.localeCompare(b.item);
      if (sortOption === 'BidAmount') return b.bidAmount - a.bidAmount;
      return 0;
    });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bidding Details</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search items"
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-md w-1/3"
        />
        <div className="flex items-center space-x-4">
          <select
            value={sortOption}
            onChange={handleSort}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sort by</option>
            <option value="Item">Item Name</option>
            <option value="BidAmount">Bid Amount</option>
          </select>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Status</option>
            <option value="Won">Won</option>
            <option value="Pending">Pending</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-6 py-3">INDEX</th>
              <th className="px-6 py-3">ITEM</th>
              <th className="px-6 py-3">BID AMOUNT</th>
              <th className="px-6 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBiddings.length > 0 ? (
              filteredBiddings.map((bid, index) => (
                <tr key={bid.id} className="border-b">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{bid.item}</td>
                  <td className="px-6 py-4">${bid.bidAmount}</td>
                  <td className="px-6 py-4">{bid.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 text-center" colSpan="4">
                  No bidding details available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
