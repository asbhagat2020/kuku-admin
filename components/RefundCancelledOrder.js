"use client"

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RefundCancelledOrderDetailsModal from "./RefundCancelledOrderDetailsModal";

const RefundCancelledOrder = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    const fetchCancelledOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all-cancelled`);
        const data = await response.json();
        // Filter orders with status "Cancelled"
        const cancelled = data.orders.filter(order => order.orderStatus === 'Cancelled');
        setCancelledOrders(cancelled);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchCancelledOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleRefundAction = async (orderId) => {
    if (processing[orderId]) return;

    setProcessing(prev => ({ ...prev, [orderId]: true }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/cancelledrefund/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      // Refetch orders to update the list
      const refetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all-cancelled`);
      const refetchData = await refetchResponse.json();
      const cancelled = refetchData.orders.filter(order => order.orderStatus === 'Cancelled');
      setCancelledOrders(cancelled);
    } catch (error) {
      toast.error('Error processing refund');
    } finally {
      setProcessing(prev => ({ ...prev, [orderId]: false }));
    }
  };

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cancelled Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Sr.</th>
              <th className="py-2 px-4 border-b text-left">Order ID</th>
              <th className="py-2 px-4 border-b text-left">Product Name</th>
              <th className="py-2 px-4 border-b text-left">Amount</th>
              <th className="py-2 px-4 border-b text-left">Refunded Date</th>
              <th className="py-2 px-4 border-b text-left">Details</th>
              <th className="py-2 px-4 border-b text-left">Refund Action</th>
            </tr>
          </thead>
          <tbody>
            {cancelledOrders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{order._id}</td>
                <td className="py-2 px-4 border-b">
                  {order.products.map(product => product.productName).join(', ')}
                </td>
                <td className="py-2 px-4 border-b">AED {order.finalAmount}</td>
                <td className="py-2 px-4 border-b">
                  {order.isFullRefunded ? formatDate(order.statusUpdatedAt) : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    View
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleRefundAction(order._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={order.isFullRefunded || processing[order._id]}
                  >
                    {order.isFullRefunded ? 'Refunded' : processing[order._id] ? 'Processing...' : 'Process Refund'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RefundCancelledOrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RefundCancelledOrder;