

// import React, { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import axios from "axios";
// import OrderTable from "./OrderTable";
// import OrderFilters from "./OrderFilters";
// import OrderStatusBadges from "./OrderStatusBadges";
// import OrderModel from "./OrderModel";
// import OrderDetailsModal from "./OrderDetailsModal";
// import RentedOrderModel from "./RentedOrderModel";
// import ReturnNormalOrder from "./ReturnNormalOrder";

// // Define status hierarchy with proper permission mapping
// const statusHierarchy = {
//   "All orders": { statuses: [], permission: "Orders" },
//   Pending: { statuses: ["Pending"], permission: "PendingOrders" },
//   "Customer Care": { statuses: ["Confirmed"], permission: "CustomerCare" },
//   "Pick Up Team": {
//     statuses: ["Assigned to Pickup"],
//     permission: "PickedOrders",
//   },
//   "Quality Check": {
//     statuses: ["Assigned to Quality check"],
//     permission: "QualityCheck",
//   },
//   Delivered: {
//     statuses: ["Delivered", "Rented Return Delivered"],
//     permission: "Delivered",
//   },
//   Cancelled: {
//     statuses: ["Cancelled", "QC-Rejected RTO Delivered"],
//     permission: "CancelledOrders",
//   },
//   Returned: {
//     statuses: ["Rented Return Delivered"],
//     permission: "ReturnedOrders",
//   },
// };

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("All orders");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [adminPermissions, setAdminPermissions] = useState([]);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [isRentedModalOpen, setIsRentedModalOpen] = useState(false);
//   const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
//   const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);

//   const ordersPerPage = 5;

//   // Helper function to check if user has permission
//   const hasPermission = (permission) => {
//     return isSuperAdmin || adminPermissions.includes(permission);
//   };

//   // Get admin permissions
//   const getAdminPermissions = async () => {
//     try {
//       const token = JSON.parse(Cookies.get("token"));
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get-permissions`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Permissions:", res.data);
//       setAdminPermissions(res.data.permissions || []);
//       setIsSuperAdmin(res.data.superAdmin || false);
//     } catch (error) {
//       console.log("Error fetching permissions:", error);
//     }
//   };

//   // Get available tabs based on permissions
//   const getAvailableTabs = () => {
//     const allTabs = Object.keys(statusHierarchy);
//     return allTabs.filter((tab) => {
//       const tabConfig = statusHierarchy[tab];
//       return hasPermission(tabConfig.permission);
//     });
//   };

//   useEffect(() => {
//     getAdminPermissions();
//   }, []);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all`
//         );
//         const data = await response.json();
//         setOrders(data.orders);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     if (hasPermission("Orders")) {
//       fetchOrders();
//     }
//   }, [adminPermissions, isSuperAdmin]);

//   useEffect(() => {
//     let updatedOrders = [...(orders || [])];

//     // Filter by tab
//     if (activeTab !== "All orders") {
//       const tabConfig = statusHierarchy[activeTab];
//       if (tabConfig && tabConfig.statuses.length > 0) {
//         updatedOrders = updatedOrders.filter((order) =>
//           tabConfig.statuses.includes(order.orderStatus)
//         );
//       }
//     }

//     // Filter by search term
//     if (searchTerm) {
//       updatedOrders = updatedOrders.filter(
//         (order) =>
//           order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order._id.toString().includes(searchTerm) ||
//           order.products.some((product) =>
//             product.productName.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//       );
//     }

//     // Sort
//     if (sortOption === "date") {
//       updatedOrders.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//     } else if (sortOption === "amount") {
//       updatedOrders.sort((a, b) => b.finalAmount - a.finalAmount);
//     }

//     setFilteredOrders(updatedOrders);
//   }, [searchTerm, sortOption, activeTab, orders]);


//   const handleReturnNormalOrder = (order) => {
//     setSelectedReturnOrder(order);
//     setIsReturnModalOpen(true);
//   };

//   const handleProcessOrder = (order) => {
//     setSelectedOrder(order);
//     setIsProcessingModalOpen(true); // Always open OrderModel for "Process" button
//   };

//   const handleRentedOrderProcess = (order) => {
//     setSelectedOrder(order);
//     setIsRentedModalOpen(true); // Open RentedOrderModel for "Process Return" button
//   };

//   const handleViewDetails = (order) => {
//     setSelectedOrder(order);
//     setIsDetailsModalOpen(true);
//   };

//   // Existing handler for normal order updates (unchanged)
//   const handleUpdateOrderStatus = async (
//     orderId,
//     newStatus,
//     processingDetails = null,
//     rejectionReason = null,
//     orderStatusHistory = null
//   ) => {
//     try {
//       console.log(
//         orderId,
//         newStatus,
//         processingDetails,
//         rejectionReason ?? "No rejection reason",
//         orderStatusHistory,
//         "Order update data"
//       );

//       // Prepare the request body
//       const requestBody = {
//         orderStatus: newStatus,
//       };

//       // Add processing details if provided
//       if (processingDetails) {
//         requestBody.processingDetails = processingDetails;

//         // Update status-specific timestamps and assignments based on the new status
//         const currentDate = new Date();

//         switch (newStatus) {
//           case "Customer Care":
//             requestBody.CustomerCareAssignedDate = currentDate;
//             break;
//           case "Assigned to Pickup":
//             requestBody.pickupAgentAssignedDate = currentDate;
//             break;
//           case "Assigned to Quality check":
//             requestBody.QualitycheckAssignedDate = currentDate;
//             break;
//           case "Out for delivery":
//             requestBody.deliveryAgentAssignedDate = currentDate;
//             break;
//           case "Return Scheduled":
//             requestBody.returnScheduledDate = currentDate;
//             break;
//           case "Return Picked Up":
//             requestBody.returnPickedUpDate = currentDate;
//             break;
//           case "Return Delivered":
//             requestBody.returnDeliveredDate = currentDate;
//             break;
//         }

//         requestBody.statusUpdatedAt = currentDate;
//       }

//       // NEW: Add rejectionReason if provided (e.g., for quality fail)
//       if (rejectionReason) {
//         requestBody.rejectionReason = rejectionReason;
//       }

//       // NEW: Add orderStatusHistory if provided (updated array from child components)
//       if (orderStatusHistory) {
//         requestBody.orderStatusHistory = orderStatusHistory;
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/updateOrder/${orderId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update order status");
//       }

//       const data = await response.json();
//       console.log("Order updated successfully:", data);

//       // Re-fetch orders to get the latest data
//       const fetchUpdatedOrders = async () => {
//         try {
//           const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all`
//           );
//           const data = await response.json();
//           setOrders(data.orders);
//         } catch (error) {
//           console.error("Error fetching updated orders:", error);
//         }
//       };

//       await fetchUpdatedOrders();
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       throw error; // Re-throw to handle in the calling component
//     }
//   };

//   // NEW: Separate handler for return order updates (uses returnProcessingDetails and new endpoint)
//   const handleUpdateReturnStatus = async (
//     orderId,
//     newStatus,
//     returnDetails = null,
//     rejectionReason = null,
//     orderStatusHistory = null
//   ) => {
//     try {
//       console.log(
//         orderId,
//         newStatus,
//         returnDetails,
//         rejectionReason ?? "No rejection reason",
//         orderStatusHistory,
//         "Return order update data"
//       );

//       // Prepare the request body
//       const requestBody = {
//         orderStatus: newStatus,
//       };

//       // Add return details if provided
//       if (returnDetails) {
//         requestBody.returnProcessingDetails = returnDetails; // Key change: Use returnProcessingDetails

//         // Update status-specific timestamps for return flow
//         const currentDate = new Date();
//         switch (newStatus) {
//           case "Return In Progress":
//             // Customer Care approve/reject
//             break;
//           case "Return In KukuWarehouse":
//             requestBody.returnScheduledDate = currentDate;
//             break;
//           case "Return Quality Check Done":
//             requestBody.returnQualityCheckedDate = currentDate;
//             break;
//           case "Return Delivered to Seller":
//             requestBody.returnDeliveredDate = currentDate;
//             break;
//           default:
//             requestBody.statusUpdatedAt = currentDate;
//         }
//       }

//       // Add rejectionReason if provided
//       if (rejectionReason) {
//         requestBody.rejectionReason = rejectionReason;
//       }

//       // Add orderStatusHistory if provided
//       if (orderStatusHistory) {
//         requestBody.orderStatusHistory = orderStatusHistory;
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/updateReturnOrder/${orderId}`, // NEW ENDPOINT
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update return order status");
//       }

//       const data = await response.json();
//       console.log("Return order updated successfully:", data);

//       // Re-fetch orders to get the latest data
//       const fetchUpdatedOrders = async () => {
//         try {
//           const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all`
//           );
//           const data = await response.json();
//           setOrders(data.orders);
//         } catch (error) {
//           console.error("Error fetching updated orders:", error);
//         }
//       };

//       await fetchUpdatedOrders();
//     } catch (error) {
//       console.error("Error updating return order status:", error);
//       throw error;
//     }
//   };

//   // Get count for each tab
//   const getTabCount = (tabName) => {
//     if (tabName === "All orders") {
//       return orders?.length || 0;
//     }
//     const tabConfig = statusHierarchy[tabName];
//     if (!tabConfig) return 0;

//     return (
//       orders?.filter((order) => tabConfig.statuses.includes(order.orderStatus))
//         .length || 0
//     );
//   };

//   // Check if user has access to view orders
//   if (!hasPermission("Orders")) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             Access Denied
//           </h1>
//           <p className="text-gray-600">
//             You don&apos;t have permission to view orders.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const availableTabs = getAvailableTabs();

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Orders Management
//             </h1>
//             <p className="text-gray-500 mt-2">
//               Track and manage all orders in one place
//             </p>
//           </div>
//           <OrderStatusBadges orders={orders} />
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <OrderFilters
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             sortOption={sortOption}
//             setSortOption={setSortOption}
//             setIsFilterOpen={setIsFilterOpen}
//           />

//           <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
//             {availableTabs.map((status) => (
//               <button
//                 key={status}
//                 onClick={() => setActiveTab(status)}
//                 className={`px-4 py-2 rounded-md text-sm whitespace-nowrap transition-all duration-200 ${
//                   activeTab === status
//                     ? "bg-blue-600 text-white shadow-md transform scale-105"
//                     : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
//                 }`}
//               >
//                 {status} ({getTabCount(status)})
//               </button>
//             ))}
//           </div>

//           <OrderTable
//             orders={filteredOrders.slice(
//               (currentPage - 1) * ordersPerPage,
//               currentPage * ordersPerPage
//             )}
//             onProcessOrder={handleProcessOrder}
//             onRentedOrderProcess={handleRentedOrderProcess} // Pass new handler
//             onViewDetails={handleViewDetails}
//             onReturnNormalOrder={handleReturnNormalOrder}
//           />

//           <div className="flex justify-between items-center mt-6">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
//             >
//               Previous
//             </button>
//             <span className="text-sm text-gray-600">
//               Page {currentPage} of{" "}
//               {Math.ceil(filteredOrders.length / ordersPerPage)}
//             </span>
//             <button
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//               disabled={currentPage * ordersPerPage >= filteredOrders.length}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {isProcessingModalOpen && selectedOrder && (
//         <OrderModel
//           isOpen={isProcessingModalOpen}
//           onClose={() => {
//             setIsProcessingModalOpen(false);
//             setSelectedOrder(null);
//           }}
//           order={selectedOrder}
//           onUpdateStatus={handleUpdateOrderStatus}
//         />
//       )}

//       {isRentedModalOpen && selectedOrder && (
//         <RentedOrderModel
//           isOpen={isRentedModalOpen}
//           onClose={() => {
//             setIsRentedModalOpen(false);
//             setSelectedOrder(null);
//           }}
//           order={selectedOrder}
//           onUpdateStatus={handleUpdateOrderStatus}
//         />
//       )}

//       {isDetailsModalOpen && selectedOrder && (
//         <OrderDetailsModal
//           isOpen={isDetailsModalOpen}
//           onClose={() => {
//             setIsDetailsModalOpen(false);
//             setSelectedOrder(null);
//           }}
//           order={selectedOrder}
//         />
//       )}

//       {isReturnModalOpen && selectedReturnOrder && (
//         <ReturnNormalOrder
//           isOpen={isReturnModalOpen}
//           onClose={() => {
//             setIsReturnModalOpen(false);
//             setSelectedReturnOrder(null);
//           }}
//           order={selectedReturnOrder}
//           onUpdateReturnStatus={handleUpdateReturnStatus} // NEW: Pass the return-specific handler
//         />
//       )}
//     </div>
//   );
// };

// export default Orders;












'use client';

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import OrderTable from "./OrderTable";
import OrderFilters from "./OrderFilters";
import OrderStatusBadges from "./OrderStatusBadges";
import OrderModel from "./OrderModel";
import OrderDetailsModal from "./OrderDetailsModal";
import RentedOrderModel from "./RentedOrderModel";
import ReturnNormalOrder from "./ReturnNormalOrder";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Define status hierarchy with proper permission mapping
const statusHierarchy = {
  "All orders": { statuses: [], permission: "Orders" },
  Pending: { statuses: ["Pending"], permission: "PendingOrders" },
  "Customer Care": { statuses: ["Confirmed"], permission: "CustomerCare" },
  "Pick Up Team": {
    statuses: ["Assigned to Pickup"],
    permission: "PickedOrders",
  },
  "Quality Check": {
    statuses: ["Assigned to Quality check"],
    permission: "QualityCheck",
  },
  Delivered: {
    statuses: ["Delivered", "Rented Return Delivered"],
    permission: "Delivered",
  },
  Cancelled: {
    statuses: ["Cancelled", "QC-Rejected RTO Delivered"],
    permission: "CancelledOrders",
  },
  Returned: {
    statuses: ["Rented Return Delivered"],
    permission: "ReturnedOrders",
  },
};

const Orders = () => {
  // Next.js URL handling
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlOrderId = searchParams.get('orderId') || '';
  const urlSort = searchParams.get('sort') || '';

  // State
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState(urlOrderId);
  const [sortOption, setSortOption] = useState(urlSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All orders");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [adminPermissions, setAdminPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isRentedModalOpen, setIsRentedModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);

  const ordersPerPage = 5;

  // Helper function to check if user has permission
  const hasPermission = (permission) => {
    return isSuperAdmin || adminPermissions.includes(permission);
  };

  // Get admin permissions
  const getAdminPermissions = async () => {
    try {
      const token = JSON.parse(Cookies.get("token"));
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get-permissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Permissions:", res.data);
      setAdminPermissions(res.data.permissions || []);
      setIsSuperAdmin(res.data.superAdmin || false);
    } catch (error) {
      console.log("Error fetching permissions:", error);
    }
  };

  // Get available tabs based on permissions
  const getAvailableTabs = () => {
    const allTabs = Object.keys(statusHierarchy);
    return allTabs.filter((tab) => {
      const tabConfig = statusHierarchy[tab];
      return hasPermission(tabConfig.permission);
    });
  };

  // 1. Fetch permissions on mount
  useEffect(() => {
    getAdminPermissions();
  }, []);

  // 2. Sync state → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('orderId', searchTerm);
    if (sortOption) params.set('sort', sortOption);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchTerm, sortOption, router, pathname]);

  // 3. Sync URL → state (on page load / back button)
  useEffect(() => {
    if (urlOrderId !== searchTerm) setSearchTerm(urlOrderId);
    if (urlSort !== sortOption) setSortOption(urlSort);
  }, [urlOrderId, urlSort]);

  // 4. Fetch Orders — smart search by ID
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let fetchedOrders = [];

        // Exact Order ID search (24-char hex)
        if (searchTerm && /^[0-9a-fA-F]{24}$/.test(searchTerm)) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/${searchTerm}`
          );
          if (res.ok) {
            const data = await res.json();
            fetchedOrders = data.order ? [data.order] : [];
          }
        } else {
          // Fetch all
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all`
          );
          const data = await res.json();
          fetchedOrders = data.orders || [];
        }

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (hasPermission("Orders")) {
      fetchOrders();
    }
  }, [searchTerm, adminPermissions, isSuperAdmin]);

  // 5. Filter + Sort (frontend)
  useEffect(() => {
    let updatedOrders = [...(orders || [])];

    // Filter by tab
    if (activeTab !== "All orders") {
      const tabConfig = statusHierarchy[activeTab];
      if (tabConfig && tabConfig.statuses.length > 0) {
        updatedOrders = updatedOrders.filter((order) =>
          tabConfig.statuses.includes(order.orderStatus)
        );
      }
    }

    // Filter by search term (name, product, partial ID) — only if not exact ID
    if (searchTerm && !/^[0-9a-fA-F]{24}$/.test(searchTerm)) {
      updatedOrders = updatedOrders.filter(
        (order) =>
          order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id.toString().includes(searchTerm) ||
          order.products.some((product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Sort
    if (sortOption === "date") {
      updatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "amount") {
      updatedOrders.sort((a, b) => b.finalAmount - a.finalAmount);
    }

    setFilteredOrders(updatedOrders);
  }, [searchTerm, sortOption, activeTab, orders]);

  const handleReturnNormalOrder = (order) => {
    setSelectedReturnOrder(order);
    setIsReturnModalOpen(true);
  };

  const handleProcessOrder = (order) => {
    setSelectedOrder(order);
    setIsProcessingModalOpen(true);
  };

  const handleRentedOrderProcess = (order) => {
    setSelectedOrder(order);
    setIsRentedModalOpen(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };



  const handleUpdateRentedReturnStatus = async (
  orderId,
  newStatus,
  rentedReturnDetails = null,
  rejectionReason = null,
  orderStatusHistory = null
) => {
  try {
    const requestBody = { orderStatus: newStatus };

    if (rentedReturnDetails) {
      requestBody.RentedReturnProcessingDetails = rentedReturnDetails;
    }
    if (rejectionReason) requestBody.rejectionReason = rejectionReason;
    if (orderStatusHistory) requestBody.orderStatusHistory = orderStatusHistory;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/updateRentedReturnOrder/${orderId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Update failed");
    }

    // Refresh orders list
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all`);
    const data = await res.json();
    setOrders(data.orders);

  } catch (error) {
    console.error("Error updating rented return:", error);
    alert(error.message || "Failed to update");
  }
};


  // Update Normal Order
  const handleUpdateOrderStatus = async (
    orderId,
    newStatus,
    processingDetails = null,
    rejectionReason = null,
    orderStatusHistory = null
  ) => {
    try {
      const requestBody = { orderStatus: newStatus };

      if (processingDetails) {
        requestBody.processingDetails = processingDetails;
        const currentDate = new Date();

        switch (newStatus) {
          case "Customer Care":
            requestBody.CustomerCareAssignedDate = currentDate;
            break;
          case "Assigned to Pickup":
            requestBody.pickupAgentAssignedDate = currentDate;
            break;
          case "Assigned to Quality check":
            requestBody.QualitycheckAssignedDate = currentDate;
            break;
          case "Out for delivery":
            requestBody.deliveryAgentAssignedDate = currentDate;
            break;
          case "Return Scheduled":
            requestBody.returnScheduledDate = currentDate;
            break;
          case "Return Picked Up":
            requestBody.returnPickedUpDate = currentDate;
            break;
          case "Return Delivered":
            requestBody.returnDeliveredDate = currentDate;
            break;
        }
        requestBody.statusUpdatedAt = currentDate;
      }

      if (rejectionReason) requestBody.rejectionReason = rejectionReason;
      if (orderStatusHistory) requestBody.orderStatusHistory = orderStatusHistory;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/updateOrder/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to update order status");

      const fetchUpdatedOrders = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all`);
        const data = await res.json();
        setOrders(data.orders);
      };

      await fetchUpdatedOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  // Update Return Order
  const handleUpdateReturnStatus = async (
    orderId,
    newStatus,
    returnDetails = null,
    rejectionReason = null,
    orderStatusHistory = null
  ) => {
    try {
      const requestBody = { orderStatus: newStatus };

      if (returnDetails) {
        requestBody.returnProcessingDetails = returnDetails;
        const currentDate = new Date();

        switch (newStatus) {
          case "Return In KukuWarehouse":
            requestBody.returnScheduledDate = currentDate;
            break;
          case "Return Quality Check Done":
            requestBody.returnQualityCheckedDate = currentDate;
            break;
          case "Return Delivered to Seller":
            requestBody.returnDeliveredDate = currentDate;
            break;
          default:
            requestBody.statusUpdatedAt = currentDate;
        }
      }

      if (rejectionReason) requestBody.rejectionReason = rejectionReason;
      if (orderStatusHistory) requestBody.orderStatusHistory = orderStatusHistory;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/updateReturnOrder/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to update return order status");

      const fetchUpdatedOrders = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all`);
        const data = await res.json();
        setOrders(data.orders);
      };

      await fetchUpdatedOrders();
    } catch (error) {
      console.error("Error updating return order status:", error);
      throw error;
    }
  };

  // Tab count
  const getTabCount = (tabName) => {
    if (tabName === "All orders") return orders?.length || 0;
    const tabConfig = statusHierarchy[tabName];
    if (!tabConfig) return 0;
    return (
      orders?.filter((order) => tabConfig.statuses.includes(order.orderStatus))
        .length || 0
    );
  };

  // Access denied
  if (!hasPermission("Orders")) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to view orders.</p>
        </div>
      </div>
    );
  }

  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-500 mt-2">Track and manage all orders in one place</p>
          </div>
          <OrderStatusBadges orders={orders} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <OrderFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOption={sortOption}
            setSortOption={setSortOption}
            setIsFilterOpen={setIsFilterOpen}
          />

          <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
            {availableTabs.map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-2 rounded-md text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === status
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {status} ({getTabCount(status)})
              </button>
            ))}
          </div>

          <OrderTable
            orders={filteredOrders.slice(
              (currentPage - 1) * ordersPerPage,
              currentPage * ordersPerPage
            )}
            onProcessOrder={handleProcessOrder}
            onRentedOrderProcess={handleRentedOrderProcess}
            onViewDetails={handleViewDetails}
            onReturnNormalOrder={handleReturnNormalOrder}
          />

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of{" "}
              {Math.ceil(filteredOrders.length / ordersPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage * ordersPerPage >= filteredOrders.length}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isProcessingModalOpen && selectedOrder && (
        <OrderModel
          isOpen={isProcessingModalOpen}
          onClose={() => {
            setIsProcessingModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}

  {isRentedModalOpen && selectedOrder && (
  <RentedOrderModel
    isOpen={isRentedModalOpen}
    onClose={() => {
      setIsRentedModalOpen(false);
      setSelectedOrder(null);
    }}
    order={selectedOrder}
    onUpdateRentedReturnStatus={handleUpdateRentedReturnStatus}  // ← YEH ADD KAR
  />
)}

      {isDetailsModalOpen && selectedOrder && (
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}

      {isReturnModalOpen && selectedReturnOrder && (
        <ReturnNormalOrder
          isOpen={isReturnModalOpen}
          onClose={() => {
            setIsReturnModalOpen(false);
            setSelectedReturnOrder(null);
          }}
          order={selectedReturnOrder}
          onUpdateReturnStatus={handleUpdateReturnStatus}
        />
      )}
    </div>
  );
};

export default Orders;