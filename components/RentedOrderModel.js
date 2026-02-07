


// import React, { useEffect, useState, useMemo } from "react";
// import Cookies from "js-cookie";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   Truck,
//   CheckCircle,
//   Clock,
//   Loader2,
//   X,
//   AlertCircle,
//   MapPin,
// } from "lucide-react";

// const RentedOrderModel = ({ isOpen, onClose, order, onUpdateStatus }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [returnDetails, setReturnDetails] = useState({
//     trackingNumber: "",
//     returnStatus: "",
//     returnStatusHistory: [],
//   });
//   const [isShipmentButtonDisabled, setIsShipmentButtonDisabled] = useState(true);
//   const [orderStatusHistory, setOrderStatusHistory] = useState([]);
//   const [isRefundLoading, setIsRefundLoading] = useState(false);

//   const steps = [
//     {
//       id: "return_shipment_creation",
//       title: "Return Shipment Creation",
//       icon: MapPin,
//       description: "Create reverse shipment to pick up rented item from buyer",
//       subSteps: [
//         "Generate AWB for reverse shipment",
//         "Schedule pickup from buyer",
//       ],
//       permission: "ReturnedOrders",
//     },
//     {
//       id: "return_pickup",
//       title: "Return Pickup",
//       icon: Truck,
//       description: "Track pickup of rented item from buyer",
//       subSteps: [
//         "Item pickup scheduled",
//         "Item picked up from buyer (auto-updated)",
//       ],
//       permission: "ReturnedOrders",
//     },
//     {
//       id: "return_delivery",
//       title: "Return Delivery",
//       icon: CheckCircle,
//       description: "Track delivery of rented item to seller",
//       subSteps: [
//         "Item in transit to seller",
//         "Item delivered to seller (auto-updated)",
//       ],
//       permission: "ReturnedOrders",
//     },
//   ];

//   const filteredSteps = useMemo(() => {
//     return isSuperAdmin
//       ? steps
//       : steps.filter((step) => userPermissions.includes(step.permission));
//   }, [userPermissions, isSuperAdmin]);

//   // Fetch admin permissions
//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const token = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;
//         if (!token) throw new Error("No token found");
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get-permissions`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setUserPermissions(response.data.permissions || []);
//         setIsSuperAdmin(response.data.superAdmin || false);
//       } catch (err) {
//         console.error("Error fetching permissions:", err);
//         setError("Failed to fetch permissions. Please try again.");
//       }
//     };
//     fetchPermissions();
//   }, []);

//   // Initialize return details from order data
//   useEffect(() => {
//     if (order && order.processingDetails) {
//       setReturnDetails({
//         trackingNumber: order.processingDetails.returnDetails?.trackingNumber || "",
//         returnStatus: order.processingDetails.returnDetails?.returnStatus || "",
//         returnStatusHistory: order.processingDetails.returnDetails?.returnStatusHistory || [],
//       });
//       setOrderStatusHistory(order.orderStatusHistory || []);
//     }
//   }, [order]);

//   // Check if rental end date has passed to enable/disable shipment creation
//   useEffect(() => {
//     if (
//       order?.products?.length > 0 &&
//       order.products[0]?.product?.rent?.length > 0 &&
//       order.products[0].product.rent[0]?.endDate
//     ) {
//       const endDate = new Date(order.products[0].product.rent[0].endDate);
//       const now = new Date();
//       setIsShipmentButtonDisabled(now < endDate);
//     } else {
//       setIsShipmentButtonDisabled(true);
//       setError("Rental data is missing or incomplete. Please check the order details.");
//     }
//   }, [order]);

//   // Determine active step based on order status
//   useEffect(() => {
//     if (order && filteredSteps.length > 0) {
//       const statusMap = {
//         "Rented Return Scheduled": 0,
//         "Rented Return Picked Up": 1,
//         "Rented Return Delivered": 2,
//       };
//       const stepIndex = statusMap[order.orderStatus] || 0;

//       let currentStepIndex = stepIndex;

//       if (filteredSteps[stepIndex]) {
//         if (
//           order.processingDetails.returnDetails?.returnStatus === "Return Scheduled" &&
//           stepIndex <= 0
//         ) {
//           currentStepIndex = filteredSteps.findIndex(
//             (step) => step.id === "return_pickup"
//           );
//         }
//         if (
//           order.processingDetails.returnDetails?.returnStatus === "Picked Up" &&
//           stepIndex <= 1
//         ) {
//           currentStepIndex = filteredSteps.findIndex(
//             (step) => step.id === "return_delivery"
//           );
//         }
//         if (
//           order.processingDetails.returnDetails?.returnStatus === "Return Delivered" &&
//           order.orderStatus === "Rented Return Delivered"
//         ) {
//           currentStepIndex = filteredSteps.length; // Mark as complete
//         }
//       } else {
//         currentStepIndex = filteredSteps.length;
//       }
//       setActiveStep(
//         currentStepIndex < filteredSteps.length
//           ? currentStepIndex
//           : filteredSteps.length
//       );
//     }
//   }, [order, filteredSteps]);

//   // Helper function to calculate pickup date (avoiding Sunday)
//   const calculatePickupDate = () => {
//     const now = new Date();
//     const dubaiOffset = 4 * 60; // Dubai is UTC+4
//     const dubaiTime = new Date(
//       now.getTime() + (dubaiOffset - now.getTimezoneOffset()) * 60000
//     );

//     const currentHour = dubaiTime.getHours();
//     let pickupDate = new Date(dubaiTime);

//     if (currentHour >= 16) {
//       pickupDate.setDate(pickupDate.getDate() + 1);
//     }

//     while (pickupDate.getDay() === 0) {
//       pickupDate.setDate(pickupDate.getDate() + 1);
//     }

//     const year = pickupDate.getFullYear();
//     const month = String(pickupDate.getMonth() + 1).padStart(2, "0");
//     const day = String(pickupDate.getDate()).padStart(2, "0");
//     const formattedPickupDate = `${year}-${month}-${day}`;
//     const pickupTime = "09:00";

//     return { pickup_date: formattedPickupDate, pickup_time: pickupTime };
//   };

//   // Handle refund deposit with toast notification
//   const handleRefundDeposit = async () => {
//     try {
//       setIsRefundLoading(true);
//       setError("");
//       const token = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;
//       if (!token) throw new Error("No token found");
//       await axios.patch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/rentedrefund/${order._id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Deposit refunded successfully");
//     } catch (err) {
//       toast.error(`Failed to refund deposit: ${err.message}`);
//       setError(`Failed to refund deposit: ${err.message}`);
//     } finally {
//       setIsRefundLoading(false);
//     }
//   };

//   // Handle status update
//   const handleUpdateStatus = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const currentStep = filteredSteps[activeStep];
//       if (!currentStep) {
//         onClose();
//         return;
//       }

//       const statusMap = {
//         return_shipment_creation: "Rented Return Scheduled",
//         return_pickup: "Rented Return Picked Up",
//         return_delivery: "Rented Return Delivered",
//       };

//       let orderStatus = statusMap[currentStep.id] || currentStep.id;
//       const orderId = order?._id || (typeof order === "string" ? order : null);
//       if (!orderId) {
//         throw new Error("Order ID is not available");
//       }

//       // Fetch order data
//       const token = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;
//       if (!token) throw new Error("No token found");
//       const orderData = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/OrderDetails/${orderId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const fetchedOrder = orderData.data.order;

//       const currentOrderStatusHistory = [...(fetchedOrder.orderStatusHistory || [])];

//       let processingDetails = { ...fetchedOrder.processingDetails };
//       processingDetails.returnDetails = {
//         ...processingDetails.returnDetails || {},
//         ...returnDetails,
//         returnStatusHistory: [
//           ...(processingDetails.returnDetails?.returnStatusHistory || []),
//           ...returnDetails.returnStatusHistory || [],
//         ],
//       };

//       if (currentStep.id === "return_shipment_creation") {
//         const shippingAddress = fetchedOrder.shippingAddress;
//         const pickupAddress = fetchedOrder.products?.[0]?.product?.pickupAddress;

//         if (!shippingAddress) {
//           throw new Error("Buyer shipping address is missing");
//         }
//         if (!pickupAddress) {
//           throw new Error("Seller pickup address is missing");
//         }

//         const { pickup_date, pickup_time } = calculatePickupDate();

//         const reversePayload = {
//           delivery_type: "Next Day",
//           load_type: "Non-document",
//           consignment_type: "REVERSE",
//           description: `Return for rented Order #${order._id}`,
//           weight:
//             fetchedOrder.products && fetchedOrder.products.length > 0
//               ? fetchedOrder.products.reduce(
//                   (sum, p) => sum + (p.weight || 1),
//                   0
//                 )
//               : 2,
//           payment_type: "PREPAID",
//           // cod_amount removed for REVERSE shipments to avoid Jeebly validation error
//           num_pieces:
//             fetchedOrder.products && fetchedOrder.products.length > 0
//               ? fetchedOrder.products.length
//               : 1,
//           customer_reference_number: order._id,
//           origin_address_name: shippingAddress.name || "Unknown Buyer",
//           origin_address_mob_no_country_code: shippingAddress.mob_no_country_code || "971",
//           origin_address_mobile_number: shippingAddress.mobile_number || "50186403",
//           origin_address_house_no: shippingAddress.house_no || "48",
//           origin_address_building_name: shippingAddress.building_name || "Default Building",
//           origin_address_area: shippingAddress.area || "Default Area",
//           origin_address_landmark: shippingAddress.landmark || "Default Landmark",
//           origin_address_city: shippingAddress.city || "Dubai",
//           origin_address_type: shippingAddress.address_type || "Normal",
//           destination_address_name: pickupAddress.name || "Unknown Seller",
//           destination_address_mob_no_country_code: pickupAddress.mob_no_country_code || "971",
//           destination_address_mobile_number: pickupAddress.mobile_number || "501234567",
//           destination_address_house_no: pickupAddress.house_no || "A-15",
//           destination_address_building_name: pickupAddress.building_name || "Default Building",
//           destination_address_area: pickupAddress.area || "Default Area",
//           destination_address_landmark: pickupAddress.landmark || "Default Landmark",
//           destination_address_city: pickupAddress.city || "Dubai",
//           destination_address_type: pickupAddress.address_type || "Normal",
//           pickup_date,
//           pickup_time,
//         };

//         console.log("📦 Return Shipment Payload:", reversePayload);
//         const jeeblyResponse = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create-reverse`,
//           reversePayload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (jeeblyResponse.data.awbNo) {
//           processingDetails.returnDetails.trackingNumber = jeeblyResponse.data.awbNo;
//           processingDetails.returnDetails.returnStatus = "Return Scheduled";
//           processingDetails.returnDetails.returnStatusHistory.push({
//             status: "Return Scheduled",
//             timestamp: new Date(),
//           });

//           if (orderStatus !== fetchedOrder.orderStatus) {
//             currentOrderStatusHistory.push({
//               status: orderStatus,
//               timestamp: new Date(),
//             });
//           }
//           await onUpdateStatus(order._id, orderStatus, processingDetails, null, currentOrderStatusHistory);
//           setReturnDetails({
//             ...returnDetails,
//             trackingNumber: jeeblyResponse.data.awbNo,
//             returnStatus: "Rented Return Scheduled",
//           });
//           setOrderStatusHistory(currentOrderStatusHistory);
//           console.log("Return shipment initiated, AWB No:", jeeblyResponse.data.awbNo);
//           alert("Return shipment initiated with AWB #" + jeeblyResponse.data.awbNo);
//         } else {
//           throw new Error("Failed to initiate return shipment");
//         }
//       } else {
//         if (orderStatus !== fetchedOrder.orderStatus) {
//           currentOrderStatusHistory.push({
//             status: orderStatus,
//             timestamp: new Date(),
//           });
//         }
//         await onUpdateStatus(order._id, orderStatus, processingDetails, null, currentOrderStatusHistory);
//       }

//       if (activeStep < filteredSteps.length - 1) {
//         setActiveStep((prev) => {
//           const nextStep = prev + 1;
//           console.log(`Moving to step: ${filteredSteps[nextStep]?.title || "Complete"}`);
//           return nextStep;
//         });
//       } else {
//         console.log("All return steps completed, closing modal");
//         onClose();
//       }
//     } catch (err) {
//       console.error("Error updating return status:", err);
//       setError(`Failed to update return status. Please try again. Details: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (
//     !isOpen ||
//     (!isSuperAdmin && !userPermissions.includes("ReturnedOrders"))
//   ) {
//     return null;
//   }

//   const rentalStartDate = order?.products?.[0]?.product?.rent?.[0]?.startDate;
//   const rentalEndDate = order?.products?.[0]?.product?.rent?.[0]?.endDate;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//       <Toaster position="top-right" reverseOrder={false} />
//       <div className="bg-white rounded-xl w-full max-w-5xl relative">
//         <div className="p-6 space-y-6">
//           <button
//             onClick={() => {
//               console.log("Closing modal via X button");
//               onClose();
//             }}
//             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X size={24} />
//           </button>
//           <div className="border-b pb-4">
//             <h2 className="text-2xl font-bold text-gray-900">
//               Process Return for Rented Order #{order?._id || "N/A"}
//             </h2>
//             <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
//               <span className="flex items-center">
//                 <MapPin className="w-4 h-4 mr-1" />
//                 Return from {order?.buyerName || "Unknown Buyer"} to Seller
//               </span>
//               <span className="flex items-center">
//                 <Clock className="w-4 h-4 mr-1" />
//                 Rental Period:{" "}
//                 {rentalStartDate && rentalEndDate
//                   ? `${new Date(rentalStartDate).toLocaleDateString()} - ${new Date(
//                       rentalEndDate
//                     ).toLocaleDateString()}`
//                   : "Rental dates unavailable"}
//               </span>
//             </div>
//           </div>
//           <div className="mt-4">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr>
//                   <th className="py-2 px-4 bg-gray-100 font-semibold">Step</th>
//                   <th className="py-2 px-4 bg-gray-100 font-semibold">Sub-Steps</th>
//                   <th className="py-2 px-4 bg-gray-100 font-semibold">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSteps.map((step, index) => {
//                   const StepIcon = step.icon;
//                   const isCompleted =
//                     index < activeStep ||
//                     (step.id === "return_shipment_creation" && returnDetails.trackingNumber) ||
//                     (step.id === "return_pickup" && returnDetails.returnStatus === "Return Picked Up") ||
//                     (step.id === "return_delivery" && returnDetails.returnStatus === "Return Delivered");
//                   const isActive = index === activeStep;

//                   return (
//                     <tr
//                       key={step.id}
//                       className={`${
//                         isActive
//                           ? "bg-blue-50"
//                           : isCompleted
//                           ? "bg-green-50"
//                           : index % 2 === 0
//                           ? "bg-gray-50"
//                           : ""
//                       }`}
//                     >
//                       <td className="py-3 px-4">
//                         <div className="flex items-center">
//                           <StepIcon size={24} className="mr-2" />
//                           <div>
//                             <div className="font-medium">{step.title}</div>
//                             <div className="text-xs text-gray-500">{step.description}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4">
//                         <ul className="text-sm space-y-1">
//                           {step.subSteps.map((subStep, subIndex) => (
//                             <li key={subIndex} className="flex items-center">
//                               <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
//                               {subStep}
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                       <td className="py-3 px-4">
//                         {isCompleted ? (
//                           <CheckCircle className="text-green-500" size={24} />
//                         ) : isActive ? (
//                           <Loader2 className="animate-spin text-blue-600" size={24} />
//                         ) : (
//                           <Clock className="text-gray-400" size={24} />
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           <div className="bg-gray-50 p-6 rounded-lg mt-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//               {filteredSteps[activeStep]?.title || "Return Process Complete"}
//             </h3>
//             <p className="text-gray-600 mb-6">
//               {filteredSteps[activeStep]?.description || "All return steps have been successfully completed."}
//             </p>
//             <div className="space-y-4">
//               {filteredSteps[activeStep]?.id === "return_shipment_creation" && (
//                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                   <h4 className="font-medium text-blue-800 mb-3 flex items-center">
//                     <MapPin className="w-4 h-4 mr-2" />
//                     Return Shipment Details
//                   </h4>
//                   <p className="text-sm text-gray-500">
//                     Click &quot;Complete&quot; to initiate the return shipment from the buyer to the seller.
//                     {isShipmentButtonDisabled && rentalEndDate && (
//                       <span className="text-red-500">
//                         {" "}
//                         (Shipment creation is disabled until rental end date:{" "}
//                         {new Date(rentalEndDate).toLocaleString()})
//                       </span>
//                     )}
//                     {!rentalEndDate && (
//                       <span className="text-red-500"> (Rental end date is missing)</span>
//                     )}
//                   </p>
//                 </div>
//               )}
//               {filteredSteps[activeStep]?.id === "return_pickup" && (
//                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                   <h4 className="font-medium text-blue-800 mb-3 flex items-center">
//                     <Truck className="w-4 h-4 mr-2" />
//                     Return Pickup Tracking
//                   </h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         AWB Number
//                       </label>
//                       <input
//                         type="text"
//                         value={returnDetails.trackingNumber}
//                         readOnly
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Return Pickup Status
//                       </label>
//                       <input
//                         type="text"
//                         value={returnDetails.returnStatus}
//                         readOnly
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                       />
//                     </div>
//                   </div>
//                   <p className="mt-2 text-sm text-gray-500">
//                     Note: Pickup is handled by Jeebly. Status will auto-update via webhook.
//                   </p>
//                 </div>
//               )}
//               {filteredSteps[activeStep]?.id === "return_delivery" && (
//                 <div className="bg-green-50 p-4 rounded-lg border border-blue-200">
//                   <h4 className="font-medium text-green-800 mb-3 flex items-center">
//                     <Truck className="w-4 h-4 mr-2" />
//                     Return Delivery Tracking
//                   </h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Tracking Number (AWB No)
//                       </label>
//                       <input
//                         type="text"
//                         value={returnDetails.trackingNumber}
//                         readOnly
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Return Delivery Status
//                       </label>
//                       <input
//                         type="text"
//                         value={returnDetails.returnStatus}
//                         readOnly
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//                       />
//                     </div>
//                   </div>
//                   <p className="mt-2 text-sm text-gray-500">
//                     Note: Delivery is handled by Jeebly. Status will auto-update via webhook.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//           {error && (
//             <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
//               <AlertCircle className="mr-2" size={20} />
//               {error}
//             </div>
//           )}
//           <div className="flex justify-end space-x-3 pt-4 border-t">
//             <button
//               onClick={() => {
//                 console.log("Closing modal via Cancel button");
//                 onClose();
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//             >
//               Cancel
//             </button>
//             {order?.orderStatus === "Rented Return Delivered" && returnDetails.returnStatus === "Return Delivered" && (
//               <button
//                 onClick={handleRefundDeposit}
//                 disabled={isRefundLoading || order?.depositRefunded}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center transition-colors"
//               >
//                 {isRefundLoading ? (
//                   <>
//                     <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                     Refunding...
//                   </>
//                 ) : order?.depositRefunded ? (
//                   "Refunded Deposit"
//                 ) : (
//                   "Refund Deposit"
//                 )}
//               </button>
//             )}
//             <button
//               onClick={handleUpdateStatus}
//               disabled={
//                 loading ||
//                 activeStep >= filteredSteps.length ||
//                 (filteredSteps[activeStep]?.id === "return_shipment_creation" &&
//                   isShipmentButtonDisabled) ||
//                 (filteredSteps[activeStep]?.id === "return_pickup" &&
//                   returnDetails.returnStatus !== "Return Picked Up") ||
//                 (filteredSteps[activeStep]?.id === "return_delivery" &&
//                   returnDetails.returnStatus !== "Return Delivered")
//               }
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center transition-colors"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                   Processing...
//                 </>
//               ) : (
//                 `Complete ${filteredSteps[activeStep]?.title || "Process"}`
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RentedOrderModel;




import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import {
  Users,
  Box,
  ClipboardCheck,
  Truck,
  CheckCircle,
  Clock,
  Loader2,
  X,
  Camera,
  AlertCircle,
  MapPin,
  Calendar,
  Tag,
} from "lucide-react";
import axios from "axios";
import WarehouseModal from "./WarehouseModal";

const RentedOrderModel = ({
  isOpen,
  onClose,
  order,
  onUpdateRentedReturnStatus,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [qualityResult, setQualityResult] = useState("");
  const [customerCareDecision, setCustomerCareDecision] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState({});
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  const rrp = order?.RentedReturnProcessingDetails || null;

  const steps = useMemo(
    () => [
      {
        id: "customer_care",
        title: "Customer Care",
        icon: Users,
        description: "Approve/Reject & Assign",
        permission: "ReturnedOrders",
      },
      {
        id: "pickup_team",
        title: "Pickup from Buyer",
        icon: Box,
        description: "Jeebly picks up from buyer",
        permission: "ReturnedOrders",
      },
      {
        id: "quality_check",
        title: "Quality Check",
        icon: ClipboardCheck,
        description: "Inspect & mark Pass/Fail",
        permission: "ReturnedOrders",
      },
      {
        id: "delivery_team",
        title: "Delivery to Seller",
        icon: Truck,
        description: "Jeebly delivers to seller",
        permission: "ReturnedOrders",
      },
    ],
    []
  );

  const filteredSteps = useMemo(() => {
    return isSuperAdmin
      ? steps
      : steps.filter((step) => userPermissions.includes(step.permission));
  }, [userPermissions, isSuperAdmin, steps]);

  const allSteps = useMemo(() => {
    const completeStep = {
      id: "complete",
      title: "Rented Return Completed",
      icon: CheckCircle,
      description: "Item delivered to seller",
    };
    return [...filteredSteps, completeStep];
  }, [filteredSteps]);

  // Fetch Permissions & Warehouses (only when modal opens)
  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(Cookies.get("token"));
      try {
        const [permRes, whRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get-permissions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warehouse`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUserPermissions(permRes.data.permissions);
        setIsSuperAdmin(permRes.data.superAdmin);
        setWarehouses(whRes.data);
      } catch (err) {
        setError("Failed to load data");
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  // Load existing data from order
  useEffect(() => {
    if (!rrp) return;

    if (rrp.customerCare?.confirmationStatus) {
      setCustomerCareDecision(rrp.customerCare.confirmationStatus);
    }

    if (rrp.qualityCheck?.qualityCheckProof?.[0]) {
      const qc = rrp.qualityCheck.qualityCheckProof[0];
      setQualityResult(qc.status);
      setRejectionReason(qc.desc || "");
      setPhotos(qc.images || []);
    }

    if (rrp.warehouseId) {
      setSelectedWarehouseId(rrp.warehouseId);
    }
  }, [rrp]);

  useEffect(() => {
    if (selectedWarehouseId && warehouses.length > 0) {
      const selected = warehouses.find((wh) => wh._id === selectedWarehouseId);
      if (selected) setWarehouseAddress(selected);
    }
  }, [selectedWarehouseId, warehouses]);

  // AUTO JUMP LOGIC — FULLY FIXED
  useEffect(() => {
    if (!rrp) return;

    if (!rrp.customerCare?.confirmationStatus) {
      setActiveStep(0);
      return;
    }

    if (rrp.customerCare.confirmationStatus === "Reject") {
      setActiveStep(-1);
      return;
    }

    if (
      rrp.sellerDelivery?.deliveryStatus === "Rented Return Delivered" ||
      rrp.sellerDelivery?.deliveryStatus === "Delivered to Seller"
    ) {
      setActiveStep(filteredSteps.length);
      return;
    }

    if (
      rrp.customerCare.confirmationStatus === "Approve" &&
      rrp.buyerPickup?.trackingNumber &&
      !rrp.buyerPickup?.pickedUpAt &&
      rrp.buyerPickup?.pickupStatus !== "Delivered to Warehouse"
    ) {
      setActiveStep(1);
      return;
    }

    if (
      rrp.buyerPickup?.pickupStatus === "Delivered to Warehouse" &&
      (!rrp.qualityCheck?.qualityCheckProof?.[0]?.images?.length || !rrp.qualityCheck?.qualityResult)
    ) {
      setActiveStep(2);
      return;
    }

    if (
      rrp.qualityCheck?.qualityCheckProof?.[0]?.images?.length > 0 &&
      rrp.qualityCheck?.qualityResult &&
      rrp.sellerDelivery?.trackingNumber &&
      rrp.sellerDelivery?.deliveryStatus !== "Rented Return Delivered"
    ) {
      setActiveStep(3);
      return;
    }

    setActiveStep(0);
  }, [rrp, filteredSteps.length]);

  // const calculatePickupDate = () => {
  //   const now = new Date();
  //   const dubaiOffset = 4 * 60;
  //   const localOffset = now.getTimezoneOffset();
  //   const dubaiTime = new Date(now.getTime() + (dubaiOffset + localOffset) * 60 * 1000);

  //   let pickupDate = new Date(dubaiTime);
  //   pickupDate.setHours(9, 0, 0, 0);

  //   if (dubaiTime.getHours() >= 16) {
  //     pickupDate.setDate(pickupDate.getDate() + 1);
  //   }

  //   while (pickupDate.getDay() === 0) {
  //     pickupDate.setDate(pickupDate.getDate() + 1);
  //   }

  //   return {
  //     pickup_date: pickupDate.toISOString().split("T")[0],
  //     pickup_time: "09:00",
  //   };
  // };

  const calculatePickupDate = () => {
  const now = new Date();
  const dubaiOffset = 4 * 60; // UTC+4
  const localOffset = now.getTimezoneOffset();
  const dubaiTime = new Date(now.getTime() + (dubaiOffset + localOffset) * 60 * 1000);

  let pickupDate = new Date(dubaiTime);
  pickupDate.setHours(9, 0, 0, 0); // 9 AM Dubai

  // Agar 4 PM ke baad hai → next day
  if (dubaiTime.getHours() >= 16) {
    pickupDate.setDate(pickupDate.getDate() + 1);
  }

  // Skip Sunday (0) only — Jeebly allows Saturday, NOT Sunday
  while (pickupDate.getDay() === 0) {
    pickupDate.setDate(pickupDate.getDate() + 1); // Sunday → Monday
  }

  return {
    pickup_date: pickupDate.toISOString().split("T")[0], // YYYY-MM-DD
    pickup_time: "09:00",
  };
};

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    const currentStep = filteredSteps[activeStep];
    const token = JSON.parse(Cookies.get("token"));
    const adminId = JSON.parse(Cookies.get("user"))._id;

    try {
      // === CUSTOMER CARE ===
      if (currentStep.id === "customer_care") {
        if (!customerCareDecision) {
          setError("Please select Approve or Reject");
          setLoading(false);
          return;
        }

        const updateData = {
          customerCare: {
            assignedTo: adminId,
            assignedAt: new Date(),
            confirmationStatus: customerCareDecision,
          },
        };

        if (customerCareDecision === "Approve") {
          if (!selectedWarehouseId) {
            setError("Please select warehouse");
            setShowWarehouseModal(true);
            setLoading(false);
            return;
          }

          const { pickup_date, pickup_time } = calculatePickupDate();
          const buyerAddress = order.shippingAddress;

          const payload = {
            delivery_type: "Next Day",
            load_type: "Non-document",
            consignment_type: "REVERSE",
            description: `Rented Return Pickup #${order._id}`,
            weight: order.products.reduce((s, p) => s + (p.weight || 1), 0) || 2,
            payment_type: "PREPAID",
            cod_amount: 0,
            num_pieces: order.products.length,
            customer_reference_number: order._id,
            origin_address_name: buyerAddress.name || "Buyer",
            origin_address_mob_no_country_code: buyerAddress.mob_no_country_code || "971",
            origin_address_mobile_number: buyerAddress.mobile_number || "501234567",
            origin_address_house_no: buyerAddress.house_no || "",
            origin_address_building_name: buyerAddress.building_name || "",
            origin_address_area: buyerAddress.area || "",
            origin_address_landmark: buyerAddress.landmark || "",
            origin_address_city: buyerAddress.city || "Dubai",
            origin_address_type: buyerAddress.address_type || "Normal",
            destination_address_name: warehouseAddress.name,
            destination_address_mob_no_country_code: warehouseAddress.mob_no_country_code || "971",
            destination_address_mobile_number: String(warehouseAddress.mobile_number || "505186403"),
            destination_address_house_no: warehouseAddress.house_no || "",
            destination_address_building_name: warehouseAddress.building_name || "",
            destination_address_area: warehouseAddress.area || "",
            destination_address_landmark: warehouseAddress.landmark || "",
            destination_address_city: warehouseAddress.city || "Dubai",
            destination_address_type: warehouseAddress.address_type || "Normal",
            pickup_date,
            pickup_time,
            returnStep: "customerCare",
            updatedBy: adminId,
            warehouseId: selectedWarehouseId,
          };

          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create-rented-return-reverse`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data.awbNo) {
            updateData.buyerPickup = {
              trackingNumber: res.data.awbNo,
              pickupStatus: "Pickup Scheduled",
              pickupStatusHistory: [
                { status: "Pickup Scheduled", timestamp: new Date(), updatedBy: adminId },
              ],
              assignedAt: new Date(),
            };
            updateData.warehouseId = selectedWarehouseId;
          }
        }

        await onUpdateRentedReturnStatus(order._id, "Rented Return Scheduled", updateData);
        alert(`Rented Return ${customerCareDecision === "Approve" ? "Approved" : "Rejected"}`);
        if (customerCareDecision === "Approve") {
          setActiveStep(1);
        } else {
          onClose();
        }
      }

      // === QUALITY CHECK → FORWARD SHIPMENT (PASS OR FAIL) ===
      else if (currentStep.id === "quality_check") {
        if (!photos.length) {
          setError("Upload at least one photo");
          setLoading(false);
          return;
        }
        if (!qualityResult) {
          setError("Select Pass or Fail");
          setLoading(false);
          return;
        }
        if (!selectedWarehouseId) {
          setError("Please select warehouse for return to seller");
          setShowWarehouseModal(true);
          setLoading(false);
          return;
        }

        const updateData = {
          qualityCheck: {
            assignedTo: adminId,
            assignedAt: new Date(),
            checkedAt: new Date(),
            qualityResult,
            rejectionReason: qualityResult === "Fail" ? rejectionReason : "",
            qualityCheckProof: [
              {
                images: photos,
                desc: rejectionReason,
                status: qualityResult,
              },
            ],
          },
        };

        // CREATE FORWARD SHIPMENT
        const sellerAddress = order.products[0]?.product?.pickupAddress || {};
        const { pickup_date, pickup_time } = calculatePickupDate();

        const description = qualityResult === "Pass"
          ? `QC Passed - Rented Return to Seller #${order._id}`
          : `QC Failed - Rented Return to Seller #${order._id}`;

        const payload = {
          delivery_type: "Next Day",
          load_type: "Non-document",
          consignment_type: "FORWARD",
          description,
          weight: 2,
          payment_type: "PREPAID",
          cod_amount: 0,
          num_pieces: 1,
          customer_reference_number: order._id,
          origin_address_name: warehouseAddress.name || "Kuku Warehouse",
          origin_address_mob_no_country_code: warehouseAddress.mob_no_country_code || "971",
          origin_address_mobile_number: String(warehouseAddress.mobile_number || "505186403"),
          origin_address_house_no: warehouseAddress.house_no || "",
          origin_address_building_name: warehouseAddress.building_name || "",
          origin_address_area: warehouseAddress.area || "",
          origin_address_landmark: warehouseAddress.landmark || "",
          origin_address_city: warehouseAddress.city || "Dubai",
          origin_address_type: warehouseAddress.address_type || "Normal",
          destination_address_name: sellerAddress.name || "Seller",
          destination_address_mob_no_country_code: sellerAddress.mob_no_country_code || "971",
          destination_address_mobile_number: String(sellerAddress.mobile_number || "501234567"),
          destination_address_house_no: sellerAddress.house_no || "",
          destination_address_building_name: sellerAddress.building_name || "",
          destination_address_area: sellerAddress.area || "",
          destination_address_landmark: sellerAddress.landmark || "",
          destination_address_city: sellerAddress.city || "Dubai",
          destination_address_type: sellerAddress.address_type || "Normal",
          pickup_date,
          pickup_time,
          returnStep: "qualityCheckComplete",
          updatedBy: adminId,
          notes: qualityResult === "Fail" ? rejectionReason : "QC Passed",
          warehouseId: selectedWarehouseId,
        };

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create-rented-return-forword`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.awbNo) {
          updateData.sellerDelivery = {
            trackingNumber: res.data.awbNo,
            deliveryStatus: "Pickup Scheduled",
            deliveryStatusHistory: [
              { status: "Pickup Scheduled", timestamp: new Date(), updatedBy: adminId },
            ],
            assignedAt: new Date(),
          };
        }

        await onUpdateRentedReturnStatus(order._id, "Rented Return In KukuWarehouse", updateData);
        alert(`QC: ${qualityResult} - Forward shipment created (AWB: ${res.data.awbNo})`);
        setActiveStep(3); // Jump to Delivery Team
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-5xl relative max-h-[90vh] flex flex-col">
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>

            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Process Rented Return #{order._id}
              </h2>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  ${order.finalAmount.toFixed(2)}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {order.buyer?.name || "Unknown Buyer"}
                </span>
              </div>
            </div>

            {/* Steps Table */}
            <div className="mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-100 font-semibold">Step</th>
                    <th className="py-2 px-4 bg-gray-100 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allSteps.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i === activeStep;
                    const isDone = i < activeStep;
                    const isAuto = step.id === "pickup_team" || step.id === "delivery_team";
                    const isComplete = step.id === "complete";

                    return (
                      <tr
                        key={step.id}
                        className={
                          isComplete && activeStep === allSteps.length - 1
                            ? "bg-green-100"
                            : isActive
                            ? "bg-orange-50"
                            : isDone
                            ? "bg-green-50"
                            : isAuto && activeStep > i
                            ? "bg-blue-50 opacity-70"
                            : ""
                        }
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Icon size={24} className={isComplete && activeStep === allSteps.length - 1 ? "text-green-600 mr-2" : "mr-2"} />
                            <div>
                              <div className={`font-medium ${isComplete && activeStep === allSteps.length - 1 ? "text-green-800" : ""}`}>
                                {step.title}
                              </div>
                              <div className="text-xs text-gray-500">{step.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isComplete && activeStep === allSteps.length - 1 ? (
                            <CheckCircle className="text-green-600" size={28} />
                          ) : isDone ? (
                            <CheckCircle className="text-green-500" size={24} />
                          ) : isActive ? (
                            <Loader2 className="animate-spin text-orange-600" size={24} />
                          ) : (
                            <Clock className="text-gray-400" size={24} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Current Step Content */}
            <div className="bg-gray-50 p-6 rounded-lg mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {activeStep === allSteps.length - 1 ? "Rented Return Completed" : filteredSteps[activeStep]?.title || "Process Complete"}
              </h3>

              {/* Completion Message */}
              {activeStep === allSteps.length - 1 && (
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="text-green-600 mr-3" size={32} />
                    <div>
                      <h4 className="font-semibold text-green-800 text-lg">Rented Return Successfully Completed!</h4>
                      <p className="text-green-700 text-sm mt-1">Item has been delivered back to the seller.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-3 rounded border border-green-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Buyer Pickup AWB</label>
                      <p className="text-sm font-mono text-gray-800">{rrp.buyerPickup?.trackingNumber || "N/A"}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Seller Delivery AWB</label>
                      <p className="text-sm font-mono text-gray-800">{rrp.sellerDelivery?.trackingNumber || "N/A"}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Quality Result</label>
                      <p className={`text-sm font-medium ${rrp.qualityCheck?.qualityResult === "Pass" ? "text-green-600" : "text-red-600"}`}>
                        {rrp.qualityCheck?.qualityResult || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Final Status</label>
                      <p className="text-sm font-medium text-gray-800">{rrp.sellerDelivery?.deliveryStatus || "Delivered"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Care */}
              {filteredSteps[activeStep]?.id === "customer_care" && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-3">Return Decision</h4>
                    <select
                      value={customerCareDecision}
                      onChange={(e) => setCustomerCareDecision(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="">Select Decision</option>
                      <option value="Approve">Approve</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </div>

                  {customerCareDecision === "Approve" && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <label className="block text-sm font-medium text-yellow-800 mb-2">
                        Select Warehouse
                      </label>
                      <button
                        onClick={() => setShowWarehouseModal(true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
                      >
                        <span>
                          {selectedWarehouseId
                            ? `${warehouseAddress.name || ""} (${warehouseAddress.city || ""})`
                            : "Select warehouse"}
                        </span>
                        <MapPin size={20} />
                      </button>
                      {selectedWarehouseId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Selected: {warehouseAddress.name}, {warehouseAddress.city}, +{warehouseAddress.mob_no_country_code} {warehouseAddress.mobile_number}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pickup Team */}
              {filteredSteps[activeStep]?.id === "pickup_team" && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-3">Pickup Tracking</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">AWB Number</label>
                      <input type="text" value={rrp.buyerPickup?.trackingNumber || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Status</label>
                      <input type="text" value={rrp.buyerPickup?.pickupStatus || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Note: Pickup is handled by Jeebly. Status will auto-update via webhook.</p>
                </div>
              )}

              {/* Quality Check */}
              {filteredSteps[activeStep]?.id === "quality_check" && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <label className="block text-sm font-medium text-yellow-800 mb-2">
                      Select Warehouse (for return to seller)
                    </label>
                    <button
                      onClick={() => setShowWarehouseModal(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
                    >
                      <span>
                        {selectedWarehouseId
                          ? `${warehouseAddress.name || ""} (${warehouseAddress.city || ""})`
                          : "Select warehouse"}
                      </span>
                      <MapPin size={20} />
                    </button>
                    {selectedWarehouseId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {warehouseAddress.name}, {warehouseAddress.city}, +{warehouseAddress.mob_no_country_code} {warehouseAddress.mobile_number}
                      </p>
                    )}
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photos
                    </h4>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                          <span>Upload files</span>
                          <input type="file" className="sr-only" multiple onChange={handlePhotoUpload} accept="image/*" />
                        </label>
                      </div>
                    </div>
                    {photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {photos.map((photo, i) => (
                          <div key={i} className="relative group">
                            <img src={photo} alt={`QC ${i + 1}`} className="h-24 w-full object-cover rounded border" />
                            <button
                              onClick={() => removePhoto(i)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-3">Quality Result</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {["Pass", "Fail"].map((result) => (
                        <button
                          key={result}
                          onClick={() => setQualityResult(result)}
                          className={`p-3 rounded-lg border-2 font-medium transition-all ${
                            qualityResult === result
                              ? "bg-orange-600 text-white border-orange-600"
                              : "bg-white border-gray-300 hover:border-orange-400"
                          }`}
                        >
                          {result}
                        </button>
                      ))}
                    </div>
                  </div>

                  {qualityResult === "Fail" && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-800 mb-2">Rejection Reason</h4>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Why rejected?"
                        className="w-full p-3 border rounded-lg"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Team */}
              {filteredSteps[activeStep]?.id === "delivery_team" && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-3">Delivery Tracking</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">AWB Number</label>
                      <input type="text" value={rrp.sellerDelivery?.trackingNumber || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                      <input type="text" value={rrp.sellerDelivery?.deliveryStatus || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Note: Delivery is handled by Jeebly. Status will auto-update via webhook.</p>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button 
                onClick={onClose} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {activeStep !== allSteps.length - 1 && (
                <button
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    (activeStep === 0 && !customerCareDecision) ||
                    (activeStep === 2 && (!qualityResult || !selectedWarehouseId || photos.length === 0)) ||
                    [1, 3].includes(activeStep)
                  }
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Processing...
                    </>
                  ) : activeStep === 0 ? (
                    "Submit Decision"
                  ) : activeStep === 1 || activeStep === 3 ? (
                    "Awaiting Jeebly Update"
                  ) : (
                    `Complete ${filteredSteps[activeStep]?.title}`
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <WarehouseModal
        isOpen={showWarehouseModal}
        onClose={() => setShowWarehouseModal(false)}
        warehouses={warehouses}
        onSelectWarehouse={(id) => {
          setSelectedWarehouseId(id);
          setShowWarehouseModal(false);
        }}
      />
    </>
  );
};

export default RentedOrderModel;