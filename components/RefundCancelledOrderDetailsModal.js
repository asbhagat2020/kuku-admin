"use client";

import React from 'react';

const RefundCancelledOrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Buyer Name:</strong> {order.buyerName}</p>
        <p><strong>Total Amount:</strong> AED {order.totalAmount}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Full Refunded Amount:</strong> AED {order.fullRefundedAmount}</p>
        <p><strong>Refunded:</strong> {order.isFullRefunded ? 'Yes' : 'No'}</p>
        {order.isFullRefunded && (
          <p><strong>Refunded Date:</strong> {formatDate(order.statusUpdatedAt)}</p>
        )}
        <h3 className="text-lg font-semibold mt-4">Products:</h3>
        {order.products.map((prod, idx) => (
          <div key={idx} className="mb-4 border-b pb-2">
            <h4 className="font-medium">{prod.productName}</h4>
            <p><strong>Quantity:</strong> {prod.quantity}</p>
            <p><strong>Price:</strong> AED {prod.price}</p>
            <p><strong>Size:</strong> {prod.size}</p>
            <p><strong>Description:</strong> {prod.product.description}</p>
            <p><strong>Brand:</strong> {prod.product.brand.brandName}</p>
            <p><strong>Condition:</strong> {prod.product.condition.conditionName}</p>
          </div>
        ))}
        <button 
          onClick={onClose} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RefundCancelledOrderDetailsModal;