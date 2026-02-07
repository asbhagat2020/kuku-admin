// SellerDetails.js
import React from 'react';

const SellerDetails = ({ seller, closeModal }) => {
  if (!seller) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">{seller.sellerName}</h2>
        <p><strong>Email:</strong> {seller.email}</p>
        <p><strong>Phone:</strong> {seller.phone}</p>
        <p><strong>Address:</strong> {seller.address}</p>
        <p><strong>Total Products Sold:</strong> {seller.totalSales}</p>
        <p><strong>Orders:</strong> {seller.orders.map(order => order.orderId).join(', ')}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={closeModal}
            className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDetails;
