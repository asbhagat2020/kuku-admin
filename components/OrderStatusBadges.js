// OrderStatusBadges.js
import React from 'react';

const OrderStatusBadges = ({ orders }) => {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <span className="text-sm text-gray-600">
          Pending ({orders?.filter((o) => o.orderStatus === "Pending").length})
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
        <span className="text-sm text-gray-600">
          Processing (
          {orders?.filter((o) => ["Confirmed"].includes(o.orderStatus)).length}
          )
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <span className="text-sm text-gray-600">
          {/* Completed ({orders?.filter((o) => o.orderStatus === "Delivered").length}) */}
          Completed ({orders?.filter((o) => ["Delivered", "Rented Return Delivered"].includes(o.orderStatus)).length})
        </span>
      </div>
    </div>
  );
};

export default OrderStatusBadges;
