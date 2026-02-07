// import React from 'react';
// import { Download } from 'lucide-react';

// const OrderTable = ({ orders, onProcessOrder, onRentedOrderProcess, onViewDetails }) => {
//   // Define a mapping for status display
//   const statusDisplayMap = {
//     "Pending": { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
//     "Conform": { color: "bg-blue-100 text-blue-800", label: "Conform" },
//     "Assigned to Pickup": { color: "bg-blue-100 text-blue-800", label: "Assigned to Pickup" },
//     "Picked": { color: "bg-blue-100 text-blue-800", label: "Picked" },
//     "Assigned to Quality check": { color: "bg-blue-100 text-blue-800", label: "Assigned to Quality Check" },
//     "Quality check Done": { color: "bg-blue-100 text-blue-800", label: "Quality Check Done" },
//     "Packed": { color: "bg-blue-100 text-blue-800", label: "Packed" },
//     "Out for delivery": { color: "bg-blue-100 text-blue-800", label: "Out for Delivery" },
//     "Delivered": { color: "bg-green-100 text-green-800", label: "Delivered" },
//     "Returned": { color: "bg-red-100 text-red-800", label: "Returned" },
//     "Cancelled": { color: "bg-red-100 text-red-800", label: "Cancelled" },
//     "Customer Care": { color: "bg-blue-100 text-blue-800", label: "Customer Care" },
//     "Confirmed": { color: "bg-blue-100 text-blue-800", label: "Confirmed" },
//     "Return Scheduled": { color: "bg-blue-100 text-blue-800", label: "Return Scheduled" },
//     "Return Picked Up": { color: "bg-blue-100 text-blue-800", label: "Return Picked Up" },
//     "Return Delivered": { color: "bg-green-100 text-green-800", label: "Return Delivered" },
//     "Rented Return Scheduled": { color: "bg-blue-100 text-blue-800", label: "Rented Return Scheduled" },
//     "Rented Return Delivered": { color: "bg-green-100 text-green-800", label: "Rented Return Delivered" },
//   };

//   // Function to determine the mode based on products
//   const getOrderModel = (products) => {
//     return products.some(product => product.isRental) ? "Rent" : "Purchase";
//   };

//   // NEW: Get Product Types as comma-separated string
//   const getProductTypes = (products) => {
//     return products
//       .map(p => p?.product?.productType || "Unknown")
//       .filter((type, index, arr) => arr.indexOf(type) === index) // Remove duplicates
//       .join(", ");
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full text-left border-collapse">
//         <thead>
//           <tr className="bg-gray-100 text-gray-700">
//             <th className="py-3 px-4 font-semibold rounded-tl-lg">Sl No</th>
//             <th className="py-3 px-4 font-semibold">Order ID</th>
//             <th className="py-3 px-4 font-semibold">Buyer Name</th>
//             <th className="py-3 px-4 font-semibold">Product Names</th>
//             <th className="py-3 px-4 font-semibold">Amount</th>
//             <th className="py-3 px-4 font-semibold">Order Date</th>
//             <th className="py-3 px-4 font-semibold">Mode</th>
//             <th className="py-3 px-4 font-semibold">Product Type</th>
//             <th className="py-3 px-4 font-semibold">Status</th>
//             <th className="py-3 px-4 font-semibold">View Detail</th>
//             <th className="py-3 px-4 font-semibold">Actions</th>
//             <th className="py-3 px-4 font-semibold rounded-tr-lg">Rented Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((el, index) => {
//             const statusInfo = statusDisplayMap[el.orderStatus] || { color: "bg-gray-100 text-gray-800", label: el.orderStatus };
//             const isRented = getOrderModel(el.products) === "Rent";
//             const showRentedActions = isRented && 
//               (el.orderStatus === "Delivered" || 
//                el.orderStatus.includes("Return"));  

//             const isReturnComplete = el.orderStatus === "Rented Return Delivered";
//             const isCancelled = el.orderStatus === "Cancelled";

//             return (
//               <tr key={el._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition-colors"}>
//                 <td className="py-3 px-4 border-t">{index + 1}</td>
//                 <td className="py-3 px-4 border-t">{el?._id}</td>
//                 <td className="py-3 px-4 border-t">{el?.buyer?.name}</td>
//                 <td className="py-3 px-4 border-t">
//                   {el?.products.map((e, i) => (
//                     <div key={e._id}>
//                       {e?.productName}
//                       {i < el.products.length - 1 && ", "}
//                     </div>
//                   ))}
//                 </td>
//                 <td className="py-3 px-4 border-t font-medium">${el.finalAmount.toFixed(2)}</td>
//                 <td className="py-3 px-4 border-t">{new Date(el.createdAt).toLocaleDateString()}</td>
//                 <td className="py-3 px-4 border-t">{getOrderModel(el.products)}</td>

//                 {/* PRODUCT TYPE COLUMN - DYNAMIC */}
//                 <td className="py-3 px-4 border-t">
//                   <span className={`px-2 py-1 rounded text-xs font-medium ${
//                     getProductTypes(el.products).includes("Kukit Purchase")
//                       ? "bg-purple-100 text-purple-800"
//                       : "bg-indigo-100 text-indigo-800"
//                   }`}>
//                     {getProductTypes(el.products)}
//                   </span>
//                 </td>

//                 <td className="py-3 px-4 border-t">
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
//                     {statusInfo.label}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap border-t">
//                   <button
//                     onClick={() => onViewDetails(el)}
//                     className="inline-flex items-center px-2 py-1 border border-transparent text-[10px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                   >
//                     View Details
//                   </button>
//                 </td>
//                 <td className="py-3 px-4 border-t">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => onProcessOrder(el)}
//                       disabled={isCancelled}
//                       className={`px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors ${isCancelled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     >
//                       Process
//                     </button>
//                   </div>
//                 </td>
//                 <td className="py-3 px-4 border-t">
//                   {showRentedActions ? (
//                     <button
//                       onClick={() => onRentedOrderProcess(el)}
//                       className={`px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors ${isReturnComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     >
//                       {isReturnComplete ? "Return Completed" : "Process Return"}
//                     </button>
//                   ) : (
//                     <span className="text-gray-400 text-sm">N/A</span>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrderTable;













import React from "react";
import { Download } from "lucide-react";

const OrderTable = ({ orders, onProcessOrder, onRentedOrderProcess, onViewDetails, onReturnNormalOrder }) => {
  const statusDisplayMap = {
    Pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    Conform: { color: "bg-blue-100 text-blue-800", label: "Conform" },
    "Assigned to Pickup": { color: "bg-blue-100 text-blue-800", label: "Assigned to Pickup" },
    Picked: { color: "bg-blue-100 text-blue-800", label: "Picked" },
    "Assigned to Quality check": { color: "bg-blue-100 text-blue-800", label: "Assigned to Quality Check" },
    "Quality check Done": { color: "bg-blue-100 text-blue-800", label: "Quality Check Done" },
    Packed: { color: "bg-blue-100 text-blue-800", label: "Packed" },
    "Out for delivery": { color: "bg-blue-100 text-blue-800", label: "Out for Delivery" },
    Delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
    Returned: { color: "bg-red-100 text-red-800", label: "Returned" },
    Cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    "Customer Care": { color: "bg-blue-100 text-blue-800", label: "Customer Care" },
    Confirmed: { color: "bg-blue-100 text-blue-800", label: "Confirmed" },
    "Return Scheduled": { color: "bg-blue-100 text-blue-800", label: "Return Scheduled" },
    "Return Picked Up": { color: "bg-blue-100 text-blue-800", label: "Return Picked Up" },
    "Return Delivered": { color: "bg-green-100 text-green-800", label: "Return Delivered" },
    "Rented Return Scheduled": { color: "bg-blue-100 text-blue-800", label: "Rented Return Scheduled" },
    "Rented Return Delivered": { color: "bg-green-100 text-green-800", label: "Rented Return Delivered" },

    // NORMAL PURCHASE RETURN
    "Buyer Wanted Return Item": { color: "bg-orange-100 text-orange-800", label: "Return Requested" },
    "Return In Progress": { color: "bg-blue-100 text-blue-800", label: "Return In Progress" },
    "Return Picked Up": { color: "bg-blue-100 text-blue-800", label: "Return Picked Up" },
    "Return Quality Done": { color: "bg-indigo-100 text-indigo-800", label: "Quality Done" },
    "Return Refunded": { color: "bg-green-100 text-green-800", label: "Refunded" },
    "Return Rejected": { color: "bg-red-100 text-red-800", label: "Return Rejected" },
    "Normal Return Completed": { color: "bg-green-100 text-green-800", label: "Normal Return Completed" },

    // FINAL FROM WEBHOOK
    "Return Delivered to Seller": { color: "bg-green-100 text-green-800", label: "Normal Return Completed" },
    "Delivered to Seller": { color: "bg-green-100 text-green-800", label: "Normal Return Completed" },
  };

  const getOrderModel = (products) => {
    return products.some((product) => product.isRental) ? "Rent" : "Purchase";
  };

  const getProductTypes = (products) => {
    return products
      .map((p) => p?.product?.productType || "Unknown")
      .filter((type, index, arr) => arr.indexOf(type) === index)
      .join(", ");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-800">
            <th className="py-3 px-4 font-semibold rounded-tl-lg">Sl No</th>
            <th className="py-3 px-4 font-semibold">Order ID</th>
            <th className="py-3 px-4 font-semibold">Buyer Name</th>
            <th className="py-3 px-4 font-semibold">Product Names</th>
            <th className="py-3 px-4 font-semibold">Amount</th>
            <th className="py-3 px-4 font-semibold">Order Date</th>
            <th className="py-3 px-4 font-semibold">Mode</th>
            <th className="py-3 px-4 font-semibold">Product Type</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">View Detail</th>
            <th className="py-3 px-4 font-semibold">Actions</th>
            <th className="py-3 px-4 font-semibold">Rented Return Actions</th>
            <th className="py-3 px-4 font-semibold rounded-tr-lg"> Return Item Action </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((el, index) => {
            const statusInfo = statusDisplayMap[el.orderStatus] || { color: "bg-gray-100 text-gray-800", label: el.orderStatus };
            const isRented = getOrderModel(el.products) === "Rent";
            const isNormalPurchase = !isRented;

            // Rented Return Logic
            const showRentedActions = isRented && (el.orderStatus === "Delivered" || el.orderStatus.includes("Return"));
            const isRentedReturnComplete = el.orderStatus === "Rented Return Delivered";

            // Normal Purchase Return Logic
            const hasReturnInitiatedInHistory = el.orderStatusHistory && 
              el.orderStatusHistory.some(item => item.status === "Buyer Wanted Return Item");

            const isReturnDeliveredToSeller = 
              el.orderStatus === "Return Delivered to Seller" || 
              el.orderStatus === "Delivered to Seller";

            const isNormalReturnActive = isNormalPurchase && hasReturnInitiatedInHistory && !isReturnDeliveredToSeller;
            
            // NEW: Show modal even if completed
            const isNormalReturnCompleted = 
              isReturnDeliveredToSeller || 
              el.orderStatus === "Normal Return Completed";

            const isCancelled = el.orderStatus === "Cancelled";

            return (
              <tr key={el._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition-colors"}>
                <td className="py-3 px-4 border-t">{index + 1}</td>
                <td className="py-3 px-4 border-t">{el?._id}</td>
                <td className="py-3 px-4 border-t">{el?.buyer?.name}</td>
                <td className="py-3 px-4 border-t">
                  {el?.products.map((e, i) => (
                    <div key={e._id}>
                      {e?.productName}
                      {i < el.products.length - 1 && ", "}
                    </div>
                  ))}
                </td>
                <td className="py-3 px-4 border-t font-medium">
                  ${el.finalAmount.toFixed(2)}
                </td>
                <td className="py-3 px-4 border-t">
                  {new Date(el.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 border-t">
                  {getOrderModel(el.products)}
                </td>
                <td className="py-3 px-4 border-t">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    getProductTypes(el.products).includes("Kukit Purchase") ? "bg-purple-100 text-purple-800" : "bg-indigo-100 text-indigo-800"
                  }`}>
                    {getProductTypes(el.products)}
                  </span>
                </td>
                <td className="py-3 px-4 border-t">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-t">
                  <button
                    onClick={() => onViewDetails(el)}
                    className="inline-flex items-center px-2 py-1 border border-transparent text-[10px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    View Details
                  </button>
                </td>
                <td className="py-3 px-4 border-t">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onProcessOrder(el)}
                      disabled={isCancelled}
                      className={`px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors ${
                        isCancelled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Process
                    </button>
                  </div>
                </td>
                {/* RENTED RETURN ACTIONS */}
                <td className="py-3 px-4 border-t">
                  {showRentedActions ? (
                    <button
                      onClick={() => onRentedOrderProcess(el)}
                      className={`px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors ${
                        isRentedReturnComplete ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isRentedReturnComplete ? "Return Completed" : "Process Return"}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </td>
                {/* RETURN ITEM ACTION - NOW CLICKABLE EVEN WHEN COMPLETED */}
                <td className="py-3 px-4 border-t">
                  {isNormalReturnActive ? (
                    <button
                      onClick={() => onReturnNormalOrder?.(el)}
                      className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Process Return
                    </button>
                  ) : isNormalReturnCompleted ? (
                    <button
                      onClick={() => onReturnNormalOrder?.(el)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Normal Return Completed
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;