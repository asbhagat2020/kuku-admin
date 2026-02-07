

// import { X } from "lucide-react";

// const KukuitDetails = ({
//   selectedKukuit,
//   customerCareForm,
//   setCustomerCareForm,
//   handleCustomerCareAction,
//   setCurrentStage,
//   previousStage, // New prop to track previous stage
// }) => {
//   const isStageComplete =
//     selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "approved" ||
//     selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "rejected";

//   let customerCareHistory = selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatusHistory || [];
  
//   if (customerCareHistory.length === 0 && selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus) {
//     customerCareHistory = [{
//       status: selectedKukuit.kukuitProcessingDetails.customerCare.confirmationStatus,
//       timestamp: selectedKukuit.kukuitProcessingDetails.customerCare.assignedDate,
//       _id: "current"
//     }];
//   }

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//       <div className="grid grid-cols-2 gap-6">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Seller Information</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-sm text-gray-600">Name</label>
//               <p className="font-medium">{selectedKukuit?.seller?.name}</p>
//             </div>
//             <div>
//               <label className="text-sm text-gray-600">Email</label>
//               <p className="font-medium">{selectedKukuit?.seller?.email}</p>
//             </div>
//             <div>
//               <label className="text-sm text-gray-600">Phone</label>
//               <p className="font-medium">{selectedKukuit?.seller?.phone}</p>
//             </div>
//             <div>
//               <label className="text-sm text-gray-600">Number of Items</label>
//               <p className="font-medium">{selectedKukuit?.numberOfItems}</p>
//             </div>
//           </div>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Processing Status</h3>
//           <div className="space-y-3">
//             <div>
//               <label className="text-sm text-gray-600">Overall Status</label>
//               <span
//                 className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
//                   selectedKukuit?.status === "pending"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : selectedKukuit?.status === "approved"
//                     ? "bg-blue-100 text-blue-800"
//                     : selectedKukuit?.status === "rejected"
//                     ? "bg-red-100 text-red-800"
//                     : selectedKukuit?.status === "in_quality"
//                     ? "bg-purple-100 text-purple-800"
//                     : selectedKukuit?.status === "completed"
//                     ? "bg-green-100 text-green-800"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 {selectedKukuit?.status}
//               </span>
//             </div>
//             <div>
//               <label className="text-sm text-gray-600">Customer Care</label>
//               <p className="font-medium">{selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus || "Pending"}</p>
//             </div>
//             <div>
//               <label className="text-sm text-gray-600">Pickup Status</label>
//               <p className="font-medium">{selectedKukuit?.kukuitProcessingDetails?.pickupDetails?.pickupStatus || "Not Assigned"}</p>
//             </div>
//             <div>
//               <label className="text-sm text-gray-600">Quality Status</label>
//               <p className="font-medium">{selectedKukuit?.kukuitProcessingDetails?.qualityDetails?.qualityStatus || "Not Started"}</p>
//             </div>
//             <div>
//               <label className="text-sm text-gray-600">Listed / Giveaway</label>
//               <p className="font-medium">
//                 {selectedKukuit?.kukuitProcessingDetails?.qualityDetails?.listingSummary?.totalListed || 0} / {selectedKukuit?.kukuitProcessingDetails?.qualityDetails?.listingSummary?.totalGiveaway || 0}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="mt-4 space-y-2">
//         <label className="text-sm text-gray-600">Pickup Location</label>
//         <p className="font-medium">
//           {selectedKukuit?.pickupLocation?.house_no},{" "}
//           {selectedKukuit?.pickupLocation?.building_name},{" "}
//           {selectedKukuit?.pickupLocation?.landmark},{" "}
//           {selectedKukuit?.pickupLocation?.area},{" "}
//           {selectedKukuit?.pickupLocation?.city},{" "}
//           {selectedKukuit?.pickupLocation?.country}
//         </p>
//         <label className="text-sm text-gray-600">Barcode</label>
//         <p className="font-medium">{selectedKukuit?.barcode}</p>
//       </div>
      
//       {/* Customer Care History Section */}
//       {customerCareHistory.length > 0 && (
//         <div className="mt-4 p-4 bg-gray-50 rounded-md">
//           <h4 className="text-md font-medium mb-2 text-gray-800">Customer Care History</h4>
//           <ul className="space-y-2">
//             {customerCareHistory.map((item) => (
//               <li key={item._id} className="text-sm text-gray-600 flex justify-between">
//                 <span>{item.status.replace(/_/g, ' ').toUpperCase()}</span>
//                 <span className="text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
      
//       {!isStageComplete && (
//         <div className="mt-4 flex gap-2">
//           <select
//             value={customerCareForm.action}
//             onChange={(e) => setCustomerCareForm({ ...customerCareForm, action: e.target.value })}
//             className="p-2 border rounded-md"
//             disabled={isStageComplete}
//           >
//             <option value="approve">Approve</option>
//             <option value="reject">Reject</option>
//           </select>
//           {customerCareForm.action === "reject" && (
//             <input
//               type="text"
//               placeholder="Rejection reason"
//               value={customerCareForm.rejectionReason}
//               onChange={(e) => setCustomerCareForm({ ...customerCareForm, rejectionReason: e.target.value })}
//               className="p-2 border rounded-md flex-1"
//               disabled={isStageComplete}
//             />
//           )}
//           <button
//             onClick={handleCustomerCareAction}
//             className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400"
//             disabled={isStageComplete}
//           >
//             {customerCareForm.action.charAt(0).toUpperCase() + customerCareForm.action.slice(1)}
//           </button>
//         </div>
//       )}
//       <div className="flex justify-between mt-4">
//         <button
//           onClick={() => setCurrentStage(previousStage || "dashboard")} // Fallback to dashboard if no previous
//           className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//         >
//           <X className="w-4 h-4 mr-2" />
//           Back
//         </button>
//         {isStageComplete && selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "approved" && (
//           <button
//             onClick={() => setCurrentStage("pickup")}
//             className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
//           >
//             Next: Pickup
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default KukuitDetails;











// import { X } from "lucide-react";

// const KukuitDetails = ({
//   selectedKukuit,
//   customerCareForm,
//   setCustomerCareForm,
//   handleCustomerCareAction,
//   setCurrentStage,
//   previousStage,
// }) => {
//   const isStageComplete =
//     selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "approved" ||
//     selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "rejected";

//   let customerCareHistory = selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatusHistory || [];

//   if (customerCareHistory.length === 0 && selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus) {
//     customerCareHistory = [{
//       status: selectedKukuit.kukuitProcessingDetails.customerCare.confirmationStatus,
//       timestamp: selectedKukuit.kukuitProcessingDetails.customerCare.assignedDate,
//       _id: "current"
//     }];
//   }

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Care Processing</h3>
//       <div className="space-y-3">
//         <div>
//           <label className="text-sm text-gray-600">Customer Care Status</label>
//           <p className="font-medium">{selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus || "Pending"}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-600">Overall Status</label>
//           <span
//             className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
//               selectedKukuit?.status === "pending"
//                 ? "bg-yellow-100 text-yellow-800"
//                 : selectedKukuit?.status === "approved"
//                 ? "bg-blue-100 text-blue-800"
//                 : selectedKukuit?.status === "rejected"
//                 ? "bg-red-100 text-red-800"
//                 : selectedKukuit?.status === "in_quality"
//                 ? "bg-purple-100 text-purple-800"
//                 : selectedKukuit?.status === "completed"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-gray-100 text-gray-800"
//             }`}
//           >
//             {selectedKukuit?.status}
//           </span>
//         </div>
//       </div>

//       {/* Customer Care History Section */}
//       {customerCareHistory.length > 0 && (
//         <div className="mt-4 p-4 bg-gray-50 rounded-md">
//           <h4 className="text-md font-medium mb-2 text-gray-800">Customer Care History</h4>
//           <ul className="space-y-2">
//             {customerCareHistory.map((item) => (
//               <li key={item._id} className="text-sm text-gray-600 flex justify-between">
//                 <span>{item.status.replace(/_/g, ' ').toUpperCase()}</span>
//                 <span className="text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {!isStageComplete && (
//         <div className="mt-4 flex gap-2">
//           <select
//             value={customerCareForm.action}
//             onChange={(e) => setCustomerCareForm({ ...customerCareForm, action: e.target.value })}
//             className="p-2 border rounded-md"
//             disabled={isStageComplete}
//           >
//             <option value="approve">Approve</option>
//             <option value="reject">Reject</option>
//           </select>
//           {customerCareForm.action === "reject" && (
//             <input
//               type="text"
//               placeholder="Rejection reason"
//               value={customerCareForm.rejectionReason}
//               onChange={(e) => setCustomerCareForm({ ...customerCareForm, rejectionReason: e.target.value })}
//               className="p-2 border rounded-md flex-1"
//               disabled={isStageComplete}
//             />
//           )}
//           <button
//             onClick={handleCustomerCareAction}
//             className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400"
//             disabled={isStageComplete}
//           >
//             {customerCareForm.action.charAt(0).toUpperCase() + customerCareForm.action.slice(1)}
//           </button>
//         </div>
//       )}
//       <div className="flex justify-end mt-4">
//         {isStageComplete && selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "approved" && (
//           <button
//             onClick={() => setCurrentStage("pickup")}
//             className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
//           >
//             Next: Pickup
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default KukuitDetails;



// import { useState, useEffect } from "react";
// import { X, Phone, Calendar, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react";
// import axios from "axios";
// import Cookies from "js-cookie"; // Corrected import (assuming you're using js-cookie)
// import WarehouseModal from "./WarehouseModal";

// const KukuitDetails = ({
//   selectedKukuit,
//   customerCareForm,
//   setCustomerCareForm,
//   handleCustomerCareAction: handleCustomerCareProp, // Renamed prop to avoid conflict
//   setCurrentStage,
//   previousStage,
// }) => {
//   const [warehouses, setWarehouses] = useState([]);
//   const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
//   const [warehouseAddress, setWarehouseAddress] = useState({});
//   const [showWarehouseModal, setShowWarehouseModal] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const isStageComplete =
//     selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "approved" ||
//     selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "rejected";

//   let customerCareHistory =
//     selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatusHistory || [];

//   if (
//     customerCareHistory.length === 0 &&
//     selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus
//   ) {
//     customerCareHistory = [
//       {
//         status: selectedKukuit.kukuitProcessingDetails.customerCare.confirmationStatus,
//         timestamp: selectedKukuit.kukuitProcessingDetails.customerCare.assignedDate,
//         _id: "current",
//       },
//     ];
//   }

//   useEffect(() => {
//     const fetchWarehouses = async () => {
//       try {
//         const token = JSON.parse(Cookies.get("token"));
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/warehouse`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setWarehouses(response.data);
//       } catch (err) {
//         console.error("Error fetching warehouses:", err);
//         setError("Failed to fetch warehouses. Please try again.");
//       }
//     };
//     fetchWarehouses();

//     if (selectedKukuit?.kukuitProcessingDetails?.warehouseId) {
//       setSelectedWarehouseId(selectedKukuit.kukuitProcessingDetails.warehouseId);
//     }
//   }, [selectedKukuit]);

//   useEffect(() => {
//     if (selectedWarehouseId && warehouses.length > 0) {
//       const selected = warehouses.find((wh) => wh._id === selectedWarehouseId);
//       if (selected) {
//         setWarehouseAddress(selected);
//       }
//     }
//   }, [selectedWarehouseId, warehouses]);

//   const handleSelectWarehouse = (id) => {
//     const selected = warehouses.find((wh) => wh._id === id);
//     if (selected) {
//       setSelectedWarehouseId(id);
//       setWarehouseAddress(selected);
//     }
//     setShowWarehouseModal(false);
//   };

//   const calculatePickupDate = () => {
//     const now = new Date();
//     const dubaiOffset = 4 * 60; // Dubai is UTC+4
//     const dubaiTime = new Date(now.getTime() + (dubaiOffset - now.getTimezoneOffset()) * 60000);
//     let pickupDate = new Date(dubaiTime);

//     if (dubaiTime.getHours() >= 16) {
//       pickupDate.setDate(pickupDate.getDate() + 1);
//     }

//     let skipCount = 0;
//     while (pickupDate.getDay() === 0) {
//       skipCount++;
//       pickupDate.setDate(pickupDate.getDate() + 1);
//       if (skipCount > 7) break;
//     }

//     const year = pickupDate.getFullYear();
//     const month = String(pickupDate.getMonth() + 1).padStart(2, "0");
//     const day = String(pickupDate.getDate()).padStart(2, "0");
//     const formattedPickupDate = `${year}-${month}-${day}`;
//     const pickupTime = "09:00";

//     return { pickup_date: formattedPickupDate, pickup_time: pickupTime };
//   };

//   const handleCustomerCareSubmit = async () => {
//     if (customerCareForm.action === "approve" && !selectedWarehouseId) {
//       setError("Please select a warehouse first");
//       setShowWarehouseModal(true);
//       return;
//     }

//     if (customerCareForm.action === "reject" && !customerCareForm.rejectionReason.trim()) {
//       setError("Please enter a rejection reason");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       const token = JSON.parse(Cookies.get("token"));

//       let kukuitStatus = customerCareForm.action === "approve" ? "Assigned to Pickup" : "rejected";
//       let processingDetails = {
//         customerCare: {
//           confirmationStatus: customerCareForm.action === "approve" ? "approved" : "rejected",
//           date: customerCareForm.date,
//           time: customerCareForm.time,
//           location: customerCareForm.location,
//           confirmationStatusHistory: [
//             ...customerCareHistory,
//             { status: customerCareForm.action === "approve" ? "approved" : "rejected", timestamp: new Date() },
//           ],
//           rejectionReason: customerCareForm.action === "reject" ? customerCareForm.rejectionReason : "",
//         },
//       };

//       if (customerCareForm.action === "approve") {
//         const { pickup_date, pickup_time } = calculatePickupDate();
//         const pickupAddress = selectedKukuit?.pickupLocation || {};

//         const shipmentPayload = {
//           delivery_type: "Next Day",
//           load_type: "Non-document",
//           consignment_type: "REVERSE",
//           description: `Pickup for Kukuit #${selectedKukuit._id}`,
//           weight: selectedKukuit?.numberOfItems || 1,
//           payment_type: "PREPAID",
//           cod_amount: 0,
//           num_pieces: selectedKukuit?.numberOfItems || 1,
//           customer_reference_number: selectedKukuit._id,
//           origin_address_name: selectedKukuit?.seller?.name || "Unknown Seller",
//           origin_address_mob_no_country_code: pickupAddress.mob_no_country_code || "971",
//           origin_address_mobile_number: pickupAddress.mobile_number || selectedKukuit?.seller?.phone || "501234567",
//           origin_address_house_no: pickupAddress.house_no || "A-15",
//           origin_address_building_name: pickupAddress.building_name || "Default Building",
//           origin_address_area: pickupAddress.area || "Default Area",
//           origin_address_landmark: pickupAddress.landmark || "Default Landmark",
//           origin_address_city: pickupAddress.city || "Dubai",
//           origin_address_type: pickupAddress.address_type || "Normal",
//           destination_address_name: warehouseAddress.name || "Kuku Warehouse",
//           destination_address_mob_no_country_code: warehouseAddress.mob_no_country_code || "971",
//           destination_address_mobile_number: warehouseAddress.mobile_number || "501234567",
//           destination_address_house_no: warehouseAddress.house_no || "WH-1",
//           destination_address_building_name: warehouseAddress.building_name || "Kuku Warehouse",
//           destination_address_area: warehouseAddress.area || "Default Area",
//           destination_address_landmark: warehouseAddress.landmark || "Default Landmark",
//           destination_address_city: warehouseAddress.city || "Dubai",
//           destination_address_type: warehouseAddress.address_type || "Normal",
//           pickup_date,
//           pickup_time,
//           warehouseId: selectedWarehouseId, // Added warehouseId to payload
//         };

//         const jeeblyResponse = await axios.post(
//           `${process.env.REACT_APP_API_BASE_URL}/shipment/create-reverse`,
//           shipmentPayload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (jeeblyResponse.data.awbNo) {
//           processingDetails = {
//             ...processingDetails,
//             pickupDetails: {
//               pickupStatus: "Pickup Scheduled",
//               awbNumber: jeeblyResponse.data.awbNo,
//               pickupStatusHistory: [
//                 ...(selectedKukuit?.kukuitProcessingDetails?.pickupDetails?.pickupStatusHistory || []),
//                 { status: "Pickup Scheduled", timestamp: new Date() },
//               ],
//             },
//             warehouseId: selectedWarehouseId,
//           };
//         } else {
//           throw new Error("AWB not received from Jeebly");
//         }
//       }

//       await axios.patch(
//         `${process.env.REACT_APP_API_BASE_URL}/kukuit/${selectedKukuit._id}`,
//         {
//           status: kukuitStatus,
//           kukuitProcessingDetails: processingDetails,
//           kukuitStatusHistory: [
//             ...(selectedKukuit.kukuitStatusHistory || []),
//             { status: kukuitStatus, timestamp: new Date() },
//           ],
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setCurrentStage(customerCareForm.action === "approve" ? "pickup" : "dashboard");
//       // Assuming showNotification is defined globally or passed as a prop
//       showNotification(
//         `Kukuit ${customerCareForm.action === "approve" ? "approved and assigned to pickup" : "rejected"} successfully`,
//         "success"
//       );
//     } catch (err) {
//       console.error("Error updating customer care status:", err);
//       setError(`Failed to update status: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Care Processing</h3>
//       <div className="space-y-3">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Customer Care Status</label>
//           <p className="font-medium">
//             {selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus || "Pending"}
//           </p>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Overall Status</label>
//           <span
//             className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
//               selectedKukuit?.status === "pending"
//                 ? "bg-yellow-100 text-yellow-800"
//                 : selectedKukuit?.status === "approved"
//                 ? "bg-blue-100 text-blue-800"
//                 : selectedKukuit?.status === "rejected"
//                 ? "bg-red-100 text-red-800"
//                 : selectedKukuit?.status === "in_quality"
//                 ? "bg-purple-100 text-purple-800"
//                 : selectedKukuit?.status === "completed"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-gray-100 text-gray-800"
//             }`}
//           >
//             {selectedKukuit?.status}
//           </span>
//         </div>
//       </div>

//       {/* Customer Care Form */}
//       {!isStageComplete && (
//         <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
//           <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
//             <Phone className="w-4 h-4 mr-2" />
//             Seller Contact & Confirmation
//           </h4>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Contact Status</label>
//               <select
//                 value={customerCareForm.action}
//                 onChange={(e) => setCustomerCareForm({ ...customerCareForm, action: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 disabled={isStageComplete}
//               >
//                 <option value="">Select status</option>
//                 <option value="approve">Approve</option>
//                 <option value="reject">Reject</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Seller Contacted Date</label>
//               <input
//                 type="date"
//                 value={customerCareForm.date}
//                 onChange={(e) => setCustomerCareForm({ ...customerCareForm, date: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 disabled={isStageComplete}
//               />
//             </div>

//             <div className="col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Select Warehouse</label>
//               <button
//                 onClick={() => setShowWarehouseModal(true)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
//                 disabled={isStageComplete}
//               >
//                 <span>
//                   {selectedWarehouseId
//                     ? `${warehouseAddress.name || ""} (${warehouseAddress.city || ""}, ${warehouseAddress.country || ""})`
//                     : "Select warehouse"}
//                 </span>
//                 <MapPin size={20} />
//               </button>
//               {selectedWarehouseId && (
//                 <p className="text-xs text-gray-500 mt-1">
//                   Selected: {warehouseAddress.name || ""}, {warehouseAddress.house_no || ""}, {warehouseAddress.building_name || ""}, {warehouseAddress.landmark || ""}, {warehouseAddress.area || ""}, {warehouseAddress.city || ""}, {warehouseAddress.country || ""}, +{warehouseAddress.mob_no_country_code} {warehouseAddress.mobile_number}, {warehouseAddress.email || ""}
//                 </p>
//               )}
//             </div>
//             {customerCareForm.action === "reject" && (
//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
//                 <textarea
//                   placeholder="Enter reason for rejection"
//                   value={customerCareForm.rejectionReason}
//                   onChange={(e) => setCustomerCareForm({ ...customerCareForm, rejectionReason: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
//                   disabled={isStageComplete}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Customer Care History Section */}
//       {customerCareHistory.length > 0 && (
//         <div className="mt-4 p-4 bg-gray-50 rounded-md">
//           <h4 className="text-md font-medium mb-2 text-gray-800">Customer Care History</h4>
//           <ul className="space-y-2">
//             {customerCareHistory.map((item) => (
//               <li key={item._id} className="text-sm text-gray-600 flex justify-between">
//                 <span>{item.status.replace(/_/g, " ").toUpperCase()}</span>
//                 <span className="text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {error && (
//         <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center mt-4">
//           <AlertCircle className="mr-2" size={20} />
//           {error}
//         </div>
//       )}

//       <div className="flex justify-end mt-4">
       
//         {!isStageComplete && (
//           <button
//             onClick={handleCustomerCareSubmit}
//             className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 flex items-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                 Processing...
//               </>
//             ) : (
//               `${customerCareForm.action.charAt(0).toUpperCase() + customerCareForm.action.slice(1)}`
//             )}
//           </button>
//         )}
//         {isStageComplete && selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "approved" && (
//           <button
//             onClick={() => setCurrentStage("pickup")}
//             className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
//           >
//             Next: Pickup
//           </button>
//         )}
//       </div>

//       <WarehouseModal
//         isOpen={showWarehouseModal}
//         onClose={() => setShowWarehouseModal(false)}
//         warehouses={warehouses}
//         onSelectWarehouse={handleSelectWarehouse}
//       />
//     </div>
//   );
// };

// export default KukuitDetails;







import { useState, useEffect } from "react";
import { Phone, Calendar, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux"; // Added to get token from Redux
import WarehouseModal from "./WarehouseModal";

const KukuitDetails = ({
  selectedKukuit,
  customerCareForm,
  setCustomerCareForm,
  setCurrentStage,
  showNotification,
  token, // Added prop for token from parent
}) => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState({});
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isStageComplete =
    selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "approved" ||
    selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "rejected";

  let customerCareHistory =
    selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatusHistory || [];

  if (
    customerCareHistory.length === 0 &&
    selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus
  ) {
    customerCareHistory = [
      {
        status: selectedKukuit.kukuitProcessingDetails.customerCare.confirmationStatus,
        timestamp: selectedKukuit.kukuitProcessingDetails.customerCare.assignedDate,
        _id: "current",
      },
    ];
  }

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/warehouse`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWarehouses(response.data);
      } catch (err) {
        console.error("Error fetching warehouses:", err);
        setError("Failed to fetch warehouses. Please try again.");
      }
    };
    fetchWarehouses();

    if (selectedKukuit?.kukuitProcessingDetails?.warehouseId) {
      setSelectedWarehouseId(selectedKukuit.kukuitProcessingDetails.warehouseId);
    }
  }, [selectedKukuit, token]);

  useEffect(() => {
    if (selectedWarehouseId && warehouses.length > 0) {
      const selected = warehouses.find((wh) => wh._id === selectedWarehouseId);
      if (selected) {
        setWarehouseAddress(selected);
      }
    }
  }, [selectedWarehouseId, warehouses]);

  const handleSelectWarehouse = (id) => {
    const selected = warehouses.find((wh) => wh._id === id);
    if (selected) {
      setSelectedWarehouseId(id);
      setWarehouseAddress(selected);
    }
    setShowWarehouseModal(false);
  };

  const calculatePickupDate = () => {
    const now = new Date();
    const dubaiOffset = 4 * 60; // Dubai is UTC+4
    const dubaiTime = new Date(now.getTime() + (dubaiOffset - now.getTimezoneOffset()) * 60000);
    let pickupDate = new Date(dubaiTime);

    if (dubaiTime.getHours() >= 16) {
      pickupDate.setDate(pickupDate.getDate() + 1);
    }

    let skipCount = 0;
    while (pickupDate.getDay() === 0) { // Skip Sundays
      skipCount++;
      pickupDate.setDate(pickupDate.getDate() + 1);
      if (skipCount > 7) break;
    }

    const year = pickupDate.getFullYear();
    const month = String(pickupDate.getMonth() + 1).padStart(2, "0");
    const day = String(pickupDate.getDate()).padStart(2, "0");
    const formattedPickupDate = `${year}-${month}-${day}`;
    const pickupTime = "09:00";

    return { pickup_date: formattedPickupDate, pickup_time: pickupTime };
  };

  const handleCustomerCareSubmit = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    if (!customerCareForm.date) {
      setError("Please select a contacted date");
      return;
    }

    if (!customerCareForm.time) {
      setError("Please select a contacted time");
      return;
    }

    if (customerCareForm.action === "approve" && !selectedWarehouseId) {
      setError("Please select a warehouse first");
      setShowWarehouseModal(true);
      return;
    }

    if (customerCareForm.action === "reject" && !customerCareForm.rejectionReason.trim()) {
      setError("Please enter a rejection reason");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (customerCareForm.action === "reject") {
        // Call reject endpoint
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/reject-request/${selectedKukuit._id}`,
          { rejectionReason: customerCareForm.rejectionReason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showNotification("Kukuit rejected successfully", "success");
        setCurrentStage("customercare"); // Stay in customercare or close modal as needed
      } else if (customerCareForm.action === "approve") {
        // Step 1: Call approve endpoint (sets customerCare to approved, status to "approved", pushes history, sets current date/time)
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/approve-request/${selectedKukuit._id}`,
          {}, // No body needed, backend sets current date/time
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Step 2: Calculate pickup details and create shipment via Jeebly integration
        const { pickup_date, pickup_time } = calculatePickupDate();
        const pickupAddress = selectedKukuit?.pickupLocation || {};

        const shipmentPayload = {
          delivery_type: "Next Day",
          load_type: "Non-document",
          consignment_type: "REVERSE",
          description: `Pickup for Kukuit #${selectedKukuit._id}`,
          weight: selectedKukuit?.numberOfItems || 1,
          payment_type: "PREPAID",
          cod_amount: 0,
          num_pieces: selectedKukuit?.numberOfItems || 1,
          customer_reference_number: selectedKukuit._id,
          origin_address_name: selectedKukuit?.seller?.name || "Unknown Seller",
          origin_address_mob_no_country_code: pickupAddress.mob_no_country_code || "971",
          origin_address_mobile_number: pickupAddress.mobile_number || selectedKukuit?.seller?.phone || "501234567",
          origin_address_house_no: pickupAddress.house_no || "A-15",
          origin_address_building_name: pickupAddress.building_name || "Default Building",
          origin_address_area: pickupAddress.area || "Default Area",
          origin_address_landmark: pickupAddress.landmark || "Default Landmark",
          origin_address_city: pickupAddress.city || "Dubai",
          origin_address_type: pickupAddress.address_type || "Normal",
          destination_address_name: warehouseAddress.name || "Kuku Warehouse",
          destination_address_mob_no_country_code: warehouseAddress.mob_no_country_code || "971",
          destination_address_mobile_number: warehouseAddress.mobile_number || "501234567",
          destination_address_house_no: warehouseAddress.house_no || "WH-1",
          destination_address_building_name: warehouseAddress.building_name || "Kuku Warehouse",
          destination_address_area: warehouseAddress.area || "Default Area",
          destination_address_landmark: warehouseAddress.landmark || "Default Landmark",
          destination_address_city: warehouseAddress.city || "Dubai",
          destination_address_type: warehouseAddress.address_type || "Normal",
          pickup_date,
          pickup_time,
          warehouseId: selectedWarehouseId, // This will be set in Kukuit update by backend
          rejectionReason: "", // Not needed for approve
          uploadphotos: "", // Optional
        };

        const jeeblyResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/reverse/kukuit`,
          shipmentPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (jeeblyResponse.data.awbNo) {
          showNotification(`Kukuit approved and pickup scheduled successfully (AWB: ${jeeblyResponse.data.awbNo})`, "success");
          setCurrentStage("pickup"); // Automatically move to pickup stage
        } else {
          throw new Error("AWB not received from Jeebly");
        }
      }
    } catch (err) {
      console.error("Error updating customer care status:", err);
      setError(`Failed to update status: ${err.response?.data?.message || err.message}`);
      showNotification(`Error: ${err.response?.data?.message || err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Care Processing</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Care Status</label>
          <p className="font-medium">
            {selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus || "Pending"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overall Status</label>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              selectedKukuit?.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : selectedKukuit?.status === "approved"
                ? "bg-blue-100 text-blue-800"
                : selectedKukuit?.status === "rejected"
                ? "bg-red-100 text-red-800"
                : selectedKukuit?.status === "in_quality"
                ? "bg-purple-100 text-purple-800"
                : selectedKukuit?.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {selectedKukuit?.status}
          </span>
        </div>
      </div>

      {/* Customer Care Form */}
      {!isStageComplete && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
          <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Seller Contact & Confirmation
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Status</label>
              <select
                value={customerCareForm.action}
                onChange={(e) => setCustomerCareForm({ ...customerCareForm, action: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                disabled={isStageComplete}
              >
                <option value="">Select status</option>
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seller Contacted Date</label>
              <input
                type="date"
                value={customerCareForm.date}
                onChange={(e) => setCustomerCareForm({ ...customerCareForm, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                disabled={isStageComplete}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contacted Time</label>
              <input
                type="time"
                value={customerCareForm.time}
                onChange={(e) => setCustomerCareForm({ ...customerCareForm, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                disabled={isStageComplete}
              />
            </div>
            {customerCareForm.action === "approve" && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Warehouse</label>
                <button
                  onClick={() => setShowWarehouseModal(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
                  disabled={isStageComplete}
                >
                  <span>
                    {selectedWarehouseId
                      ? `${warehouseAddress.name || ""} (${warehouseAddress.city || ""}, ${warehouseAddress.country || ""})`
                      : "Select warehouse"}
                  </span>
                  <MapPin size={20} />
                </button>
                {selectedWarehouseId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {warehouseAddress.name || ""}, {warehouseAddress.house_no || ""}, {warehouseAddress.building_name || ""}, {warehouseAddress.landmark || ""}, {warehouseAddress.area || ""}, {warehouseAddress.city || ""}, {warehouseAddress.country || ""}, +{warehouseAddress.mob_no_country_code} {warehouseAddress.mobile_number}, {warehouseAddress.email || ""}
                  </p>
                )}
              </div>
            )}
            {customerCareForm.action === "reject" && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                <textarea
                  placeholder="Enter reason for rejection"
                  value={customerCareForm.rejectionReason}
                  onChange={(e) => setCustomerCareForm({ ...customerCareForm, rejectionReason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  disabled={isStageComplete}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Care History Section */}
      {customerCareHistory.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="text-md font-medium mb-2 text-gray-800">Customer Care History</h4>
          <ul className="space-y-2">
            {customerCareHistory.map((item) => (
              <li key={item._id} className="text-sm text-gray-600 flex justify-between">
                <span>{item.status.replace(/_/g, " ").toUpperCase()}</span>
                <span className="text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center mt-4">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <div className="flex justify-end mt-4">
        {!isStageComplete && customerCareForm.action && (
          <button
            onClick={handleCustomerCareSubmit}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 flex items-center"
            disabled={loading || !customerCareForm.action}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              `${customerCareForm.action.charAt(0).toUpperCase() + customerCareForm.action.slice(1)}`
            )}
          </button>
        )}
        {isStageComplete && selectedKukuit?.kukuitProcessingDetails?.customerCare?.confirmationStatus === "approved" && (
          <button
            onClick={() => setCurrentStage("pickup")}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Next: Pickup
          </button>
        )}
      </div>

      <WarehouseModal
        isOpen={showWarehouseModal}
        onClose={() => setShowWarehouseModal(false)}
        warehouses={warehouses}
        onSelectWarehouse={handleSelectWarehouse}
      />
    </div>
  );
};

export default KukuitDetails;