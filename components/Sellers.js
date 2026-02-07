// Seller.js
import React, { useState } from 'react';
import SellerDetails from './SellerDetails ';


export const Sellers = () => {
  const [sellers, setSellers] = useState([
    {
      id: '1',
      sellerName: 'Alex Johnson',
      email: 'alex@techcorp.com',
      phone: '1234567890',
      address: '123 5th Ave, New York',
      totalSales: 120,
      orders: [{ orderId: 'Order101' }, { orderId: 'Order102' }],
    },
    {
      id: '2',
      sellerName: 'Lisa Brown',
      email: 'lisa@bizsolutions.com',
      phone: '0987654321',
      address: '789 Market St, San Francisco',
      totalSales: 85,
      orders: [{ orderId: 'Order103' }, { orderId: 'Order104' }],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [filterField, setFilterField] = useState('sellerName');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSellerClick = (seller) => {
    setSelectedSeller(seller);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSeller(null);
  };

  const filteredSellers = sellers.filter((seller) =>
    seller[filterField].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sellers</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder={`Search by ${filterField}`}
          className="border rounded px-2 py-1 bg-gray-100 focus:outline-none w-64"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <div className="relative">
          <label htmlFor="filterField" className="mr-2">Filter By:</label>
          <select
            id="filterField"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="border rounded px-4 py-2 bg-gray-100 focus:outline-none"
          >
            <option value="sellerName">Seller Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="phone">Phone</option>
          </select>
        </div>
      </div>

      <table className="min-w-full bg-white border rounded-lg shadow-lg">
        <thead className="bg-pink-50">
          <tr>
            <th className="p-2">Orders</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Total Sales</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSellers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">No sellers found.</td>
            </tr>
          ) : (
            filteredSellers.map((seller) => (
              <tr
                key={seller.id}
                onClick={() => handleSellerClick(seller)}
                className="hover:bg-pink-50 cursor-pointer"
              >
                <td className="p-2">{seller.orders.map(order => order.orderId).join(', ')}</td>
                <td className="p-2">{seller.sellerName}</td>
                <td className="p-2">{seller.email}</td>
                <td className="p-2">{seller.phone}</td>
                <td className="p-2">{seller.totalSales}</td>
                <td className="p-2">
                  <button className="bg-pink-600 text-white px-2 py-1 rounded hover:bg-pink-700">
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <SellerDetails seller={selectedSeller} closeModal={closeModal} />
      )}
    </div>
  );
};


