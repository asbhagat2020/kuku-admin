// import React, { useEffect, useState, useMemo } from "react";
// import Cookies from "js-cookie";
// import {
//   Search,
//   Truck,
//   CheckCircle,
//   ClipboardCheck,
//   Box,
//   AlertCircle,
//   Users,
//   Clock,
//   Camera,
//   Loader2,
//   Download,
//   X,
//   Filter,
//   Calendar,
//   Tag,
//   Phone,
//   MapPin,
//   Package,
//   FileText,
// } from "lucide-react";
// import axios from "axios";
// import WarehouseModal from "./WarehouseModal";

// const OrderModel = ({ isOpen, onClose, order, onUpdateStatus }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [qualityChecklist, setQualityChecklist] = useState({
//     itemCondition: false,
//     Packaging: false,
//     labeling: false,
//     documentation: false,
//     qualityStandard: false,
//     safetyChecking: false,
//   });
//   const [photos, setPhotos] = useState([]);
//   const [pickupDetails, setPickupDetails] = useState({
//     pickupStatus: "",
//     awbNumber: "",
//   });
//   const [deliveryDetails, setDeliveryDetails] = useState({
//     trackingNumber: "",
//     deliveryStatus: "",
//   });
//   const [qcRejectedDetails, setQcRejectedDetails] = useState({
//     trackingNumber: "",
//     rejectedStatus: "",
//   });
//   const [customerCare, setCustomerCare] = useState({
//     confirmationStatus: "",
//     date: "",
//     time: "",
//     location: "",
//   });
//   const [qualityResult, setQualityResult] = useState("Pending");
//   const [mainCategory, setMainCategory] = useState("");
//   const [isRenting, setIsRenting] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [barcodeGenerated, setBarcodeGenerated] = useState(false);
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [orderStatusHistory, setOrderStatusHistory] = useState([]);
//   const [warehouses, setWarehouses] = useState([]);
//   const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
//   const [warehouseAddress, setWarehouseAddress] = useState({});
//   const [showWarehouseModal, setShowWarehouseModal] = useState(false);

//   // Check if ALL products are Kukit Purchase
//   const isKukitPurchaseOrder = () => {
//     return order?.products?.every(
//       (p) => p?.product?.productType === "Kukit Purchase"
//     );
//   };

//   const kukitOrder = isKukitPurchaseOrder();

//   // Dynamic Steps – Pickup skipped for Kukit
//   const steps = useMemo(() => {
//     const baseSteps = [
//       {
//         id: "customer_care",
//         title: "Customer Care",
//         icon: Users,
//         description: "Initial order processing and seller coordination",
//         subSteps: kukitOrder
//           ? ["Product already in warehouse", "Ready for Quality Check"]
//           : [
//               "Calls Seller for pick up confirmation",
//               "Fills Date & Time for Pick Up",
//             ],
//         fields: ["notes", "customerCare", "barcodeGenerated"],
//         permission: "CustomerCare",
//       },
//     ];

//     // Only add Pickup for NON-Kukit
//     if (!kukitOrder) {
//       baseSteps.push({
//         id: "pickup_team",
//         title: "Pick Up Team",
//         icon: Box,
//         description: "Schedule and track item pickup via Jeebly",
//         subSteps: [
//           "Pickup scheduled by Jeebly",
//           "Item picked up (auto updated)",
//           "Delivered to KuKu (auto updated)",
//         ],
//         fields: ["pickupDetails"],
//         permission: "PickedOrders",
//       });
//     }

//     baseSteps.push(
//       {
//         id: "quality_check",
//         title: "Quality Check",
//         icon: ClipboardCheck,
//         description: "Quality inspection and verification",
//         subSteps: [
//           "Receives Order & Identify",
//           "Pass: Select Listing Category (Listing, KuKit, Give away, Renting)",
//           "Fail: Provide Rejection Reason",
//         ],
//         fields: [
//           "qualityChecklist",
//           "photos",
//           "notes",
//           "qualityResult",
//           "mainCategory",
//           "isRenting",
//           "rejectionReason",
//         ],
//         permission: "QualityCheck",
//       },
//       {
//         id: "delivery_team",
//         title: "Delivery Team",
//         icon: Truck,
//         description:
//           "Delivery scheduling and tracking, including reverse delivery",
//         subSteps: [
//           "Process delivery based on quality decision",
//           "Update tracking information for reverse or forward delivery",
//           "Complete delivery or RTO",
//         ],
//         fields: ["deliveryDetails", "qcRejectedDetails", "notes"],
//         permission: "Delivered",
//       }
//     );

//     return baseSteps;
//   }, [order, kukitOrder]);

//   const filteredSteps = useMemo(() => {
//     return isSuperAdmin
//       ? steps
//       : steps.filter((step) => {
//           const hasSpecificPermission = userPermissions.includes(
//             step.permission
//           );
//           const hasGeneralAccess =
//             userPermissions.includes("Orders") && !step.permission;
//           return hasSpecificPermission || hasGeneralAccess;
//         });
//   }, [userPermissions, isSuperAdmin, steps]);

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const token = JSON.parse(Cookies.get("token"));
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get-permissions`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setUserPermissions(response.data.permissions);
//         setIsSuperAdmin(response.data.superAdmin);
//       } catch (err) {
//         console.error("Error fetching permissions:", err);
//         setError("Failed to fetch permissions. Please try again.");
//       }
//     };
//     fetchPermissions();

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
//   }, []);

//   useEffect(() => {
//     if (order && order.processingDetails) {
//       setCustomerCare({
//         confirmationStatus:
//           order.processingDetails.customerCare?.confirmationStatus || "",
//         date: order.processingDetails.customerCare?.date
//           ? new Date(order.processingDetails.customerCare.date)
//               .toISOString()
//               .split("T")[0]
//           : "",
//         time: order.processingDetails.customerCare?.time || "",
//         location: order.processingDetails.customerCare?.location || "",
//       });
//       setPickupDetails({
//         pickupStatus: order.processingDetails.pickupDetails?.pickupStatus || "",
//         awbNumber: order.processingDetails.pickupDetails?.awbNumber || "",
//       });
//       setDeliveryDetails({
//         trackingNumber:
//           order.processingDetails.deliveryDetails?.trackingNumber || "",
//         deliveryStatus:
//           order.processingDetails.deliveryDetails?.deliveryStatus || "",
//       });
//       setQcRejectedDetails({
//         trackingNumber:
//           order.processingDetails.qcRejectedItemDetail?.trackingNumber || "",
//         rejectedStatus:
//           order.processingDetails.qcRejectedItemDetail?.rejectedStatus || "",
//       });
//       setQualityChecklist({
//         itemCondition:
//           order.processingDetails.qualityChecklist?.qualityAssessment
//             ?.itemCondition || false,
//         Packaging:
//           order.processingDetails.qualityChecklist?.qualityAssessment
//             ?.Packaging || false,
//         labeling:
//           order.processingDetails.qualityChecklist?.qualityAssessment
//             ?.labeling || false,
//         documentation:
//           order.processingDetails.qualityChecklist?.qualityAssessment
//             ?.documentation || false,
//         qualityStandard:
//           order.processingDetails.qualityChecklist?.qualityAssessment
//             ?.qualityStandard || false,
//         safetyChecking:
//           order.processingDetails.qualityChecklist?.qualityAssessment
//             ?.safetyChecking || false,
//       });
//       setQualityResult(
//         order.processingDetails.qualityChecklist?.qualityResult || "Pending"
//       );

//       const lc = order.processingDetails.qualityChecklist?.listingCategory;
//       if (lc) {
//         if (lc.listing === "selected") setMainCategory("Listing");
//         else if (lc.kukit === "selected") setMainCategory("Kukit Purchase");
//         setIsRenting(lc.renting === "selected");
//       }

//       setRejectionReason(
//         order.qualityCheckProof?.[0]?.status === "Rejected"
//           ? order.qualityCheckProof[0]?.desc || ""
//           : ""
//       );
//       setPhotos(
//         order.processingDetails.qualityChecklist?.uploadphotos
//           ? order.processingDetails.qualityChecklist.uploadphotos.split(",")
//           : []
//       );
//       setBarcodeGenerated(
//         !!order.processingDetails.customerCare?.confirmationStatus
//       );
//       setOrderStatusHistory(order.orderStatusHistory || []);
//       if (order.processingDetails.warehouseId) {
//         setSelectedWarehouseId(order.processingDetails.warehouseId);
//       }
//     }
//   }, [order]);

//   useEffect(() => {
//     if (selectedWarehouseId && warehouses.length > 0) {
//       const selected = warehouses.find((wh) => wh._id === selectedWarehouseId);
//       if (selected) {
//         setWarehouseAddress(selected);
//       }
//     }
//   }, [selectedWarehouseId, warehouses]);

//   const isDeliveryCompleted = () => {
//     if (!order?.orderStatusHistory || !Array.isArray(order.orderStatusHistory))
//       return false;
//     return order.orderStatusHistory.some(
//       (h) =>
//         h.status === "Delivered" || h.status === "QC-Rejected RTO Delivered"
//     );
//   };

//   // Auto-jump: Kukit → Direct QC after Customer Care
//   useEffect(() => {
//     if (order && filteredSteps.length > 0) {
//       const statusMap = {
//         "Customer Care": 0,
//         "Assigned to Pickup": kukitOrder ? -1 : 1,
//         "In KukuWarehouse": kukitOrder ? 1 : 2,
//         "Assigned to Quality check": kukitOrder ? 1 : 2,
//         "Out for delivery": kukitOrder ? 2 : 3,
//         "Pickup Scheduled For Delivery": kukitOrder ? 2 : 3,
//         Delivered: kukitOrder ? 3 : 4,
//         "QC-Rejected Pickup Scheduled": kukitOrder ? 2 : 3,
//         "QC-Rejected RTO Delivered": kukitOrder ? 3 : 4,
//       };

//       const deliveryStepIndex = filteredSteps.findIndex(
//         (s) => s.id === "delivery_team"
//       );
//       if (deliveryStepIndex !== -1 && isDeliveryCompleted()) {
//         setActiveStep(filteredSteps.length); // Jump to end
//         return;
//       }

//       let stepIndex = statusMap[order.orderStatus] || 0;
//       if (stepIndex === -1) stepIndex = 0;

//       let currentStepIndex = stepIndex;

//       // For Kukit Purchase: Check if QC is already done (Pass/Fail)
//       const qcAlreadyDone =
//         order.processingDetails.qualityChecklist?.qualityResult !== "Pending";

//       // For Kukit: If Customer Care done but QC not done yet, jump to QC
//       if (
//         kukitOrder &&
//         order.processingDetails.customerCare?.confirmationStatus &&
//         !qcAlreadyDone &&
//         order.orderStatus === "Assigned to Quality check"
//       ) {
//         const qcIndex = filteredSteps.findIndex(
//           (s) => s.id === "quality_check"
//         );
//         if (qcIndex !== -1) {
//           setActiveStep(qcIndex);
//           return;
//         }
//       }

//       // For Listing: Move to pickup after customer care
//       if (
//         !kukitOrder &&
//         order.processingDetails.customerCare?.confirmationStatus &&
//         stepIndex <= 0 &&
//         filteredSteps.some((step) => step.id === "pickup_team")
//       ) {
//         currentStepIndex = filteredSteps.findIndex(
//           (step) => step.id === "pickup_team"
//         );
//       }

//       // For Listing: Move to QC when item delivered to warehouse
//       const qualityCheckIndex = filteredSteps.findIndex(
//         (step) => step.id === "quality_check"
//       );
//       if (
//         !kukitOrder &&
//         (order.orderStatus === "In KukuWarehouse" ||
//           order.processingDetails.pickupDetails?.pickupStatus ===
//             "Delivered") &&
//         stepIndex <= 1 &&
//         qualityCheckIndex !== -1 &&
//         order.processingDetails.qualityChecklist?.qualityResult === "Pending"
//       ) {
//         currentStepIndex = qualityCheckIndex;
//       }

//       // For BOTH Kukit & Listing: If QC Pass and category selected, move to delivery
//       if (
//         order.processingDetails.qualityChecklist?.qualityResult === "Pass" &&
//         (order.processingDetails.qualityChecklist?.listingCategory?.listing ||
//           order.processingDetails.qualityChecklist?.listingCategory?.kukit ||
//           order.processingDetails.qualityChecklist?.listingCategory?.giveAway ||
//           order.processingDetails.qualityChecklist?.listingCategory?.renting)
//       ) {
//         const deliveryIndex = filteredSteps.findIndex(
//           (step) => step.id === "delivery_team"
//         );
//         if (deliveryIndex !== -1) {
//           currentStepIndex = deliveryIndex;
//         }
//       }

//       // If delivery completed
//       if (
//         order.processingDetails.deliveryDetails?.deliveryStatus ===
//           "Delivered" &&
//         order.orderStatus === "Delivered"
//       ) {
//         currentStepIndex = filteredSteps.length;
//       }

//       // For QC Rejected or Out for delivery orders
//       if (
//         order.orderStatus === "Out for delivery" ||
//         order.orderStatus === "Pickup Scheduled For Delivery" ||
//         order.orderStatus === "Rejected" ||
//         order.orderStatus.startsWith("QC-Rejected")
//       ) {
//         currentStepIndex = filteredSteps.findIndex(
//           (step) => step.id === "delivery_team"
//         );
//       }

//       // For QC Rejected RTO Delivered
//       if (
//         order.orderStatus === "QC-Rejected RTO Delivered" ||
//         (order.orderStatus.startsWith("QC-Rejected") &&
//           order.processingDetails.qcRejectedItemDetail?.rejectedStatus ===
//             "RTO Delivered")
//       ) {
//         currentStepIndex = filteredSteps.length;
//       }

//       setActiveStep(
//         currentStepIndex < filteredSteps.length
//           ? currentStepIndex
//           : filteredSteps.length
//       );
//     }
//   }, [order, filteredSteps, kukitOrder, qcRejectedDetails.rejectedStatus]);

//   const handleUpdateStatus = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const currentStep = filteredSteps[activeStep];
//       if (!currentStep) {
//         onClose();
//         return;
//       }

//       const orderId = order?._id;
//       const token = JSON.parse(Cookies.get("token"));
//       const orderData = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/OrderDetails/${orderId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const fetchedOrder = orderData.data.order;
//       const currentOrderStatusHistory = [
//         ...(fetchedOrder.orderStatusHistory || []),
//       ];

//       let processingDetails = {
//         customerCare: { ...customerCare },
//         pickupDetails: {
//           ...pickupDetails,
//           pickupStatusHistory:
//             fetchedOrder.processingDetails?.pickupDetails
//               ?.pickupStatusHistory || [],
//         },
//         deliveryDetails: {
//           ...deliveryDetails,
//           deliveryStatusHistory:
//             fetchedOrder.processingDetails?.deliveryDetails
//               ?.deliveryStatusHistory || [],
//         },
//         qualityChecklist: {
//           qualityAssessment: { ...qualityChecklist },
//           qualityResult,
//           listingCategory: {
//             listing: mainCategory === "Listing" ? "selected" : "",
//             kukit: mainCategory === "Kukit Purchase" ? "selected" : "",
//             giveAway: "",
//             renting: isRenting ? "selected" : "",
//           },
//           uploadphotos: photos.length > 0 ? photos.join(",") : "",
//           rejectionReason: rejectionReason || "",
//         },
//         warehouseId: selectedWarehouseId,
//       };

//       const calculatePickupDate = () => {
//         const now = new Date();
//         const dubaiOffset = 4 * 60;
//         const dubaiTime = new Date(
//           now.getTime() + (dubaiOffset - now.getTimezoneOffset()) * 60000
//         );
//         let pickupDate = new Date(dubaiTime);
//         if (dubaiTime.getHours() >= 16)
//           pickupDate.setDate(pickupDate.getDate() + 1);
//         let skipCount = 0;
//         while (pickupDate.getDay() === 0) {
//           skipCount++;
//           pickupDate.setDate(pickupDate.getDate() + 1);
//           if (skipCount > 7) break;
//         }
//         const year = pickupDate.getFullYear();
//         const month = String(pickupDate.getMonth() + 1).padStart(2, "0");
//         const day = String(pickupDate.getDate()).padStart(2, "0");
//         return { pickup_date: `${year}-${month}-${day}`, pickup_time: "09:00" };
//       };

//       // Customer Care
//       if (
//         currentStep.id === "customer_care" &&
//         customerCare.confirmationStatus === "contacted"
//       ) {
//         if (kukitOrder) {
//           const orderStatus = "Assigned to Quality check";
//           currentOrderStatusHistory.push({
//             status: orderStatus,
//             timestamp: new Date(),
//           });
//           await onUpdateStatus(
//             order._id,
//             orderStatus,
//             processingDetails,
//             null,
//             currentOrderStatusHistory
//           );
//           setActiveStep((prev) => prev + 1);
//           setLoading(false);
//           return;
//         }

//         // Listing → Warehouse mandatory
//         if (!selectedWarehouseId) {
//           setError("Please select a warehouse first");
//           setShowWarehouseModal(true);
//           setLoading(false);
//           return;
//         }

//         const { pickup_date, pickup_time } = calculatePickupDate();
//         const sellerPickupAddress =
//           fetchedOrder.products?.[0]?.product?.pickupAddress || {};
//         const shipmentPayload = {
//           delivery_type: "Next Day",
//           load_type: "Non-document",
//           consignment_type: "REVERSE",
//           description: `Pickup for Order #${order._id}`,
//           weight:
//             fetchedOrder.products?.reduce(
//               (sum, p) => sum + (p.weight || 1),
//               0
//             ) || 2,
//           payment_type: fetchedOrder.isPaid ? "PREPAID" : "COD",
//           cod_amount: fetchedOrder.isPaid ? 0 : fetchedOrder.finalAmount,
//           num_pieces: fetchedOrder.products?.length || 1,
//           customer_reference_number: order._id,
//           origin_address_name: sellerPickupAddress.name || "Unknown Seller",
//           origin_address_mob_no_country_code:
//             sellerPickupAddress.mob_no_country_code || "971",
//           origin_address_mobile_number:
//             sellerPickupAddress.mobile_number || "501234567",
//           origin_address_house_no: sellerPickupAddress.house_no || "A-15",
//           origin_address_building_name:
//             sellerPickupAddress.building_name || "Default Building",
//           origin_address_area: sellerPickupAddress.area || "Default Area",
//           origin_address_landmark:
//             sellerPickupAddress.landmark || "Default Landmark",
//           origin_address_city: sellerPickupAddress.city || "Dubai",
//           origin_address_type: sellerPickupAddress.address_type || "Normal",
//           destination_address_name: warehouseAddress.name,
//           destination_address_mob_no_country_code:
//             warehouseAddress.mob_no_country_code || "971",
//           destination_address_mobile_number: warehouseAddress.mobile_number,
//           destination_address_house_no: warehouseAddress.house_no,
//           destination_address_building_name: warehouseAddress.building_name,
//           destination_address_area: warehouseAddress.area,
//           destination_address_landmark: warehouseAddress.landmark,
//           destination_address_city: warehouseAddress.city,
//           destination_address_type: warehouseAddress.address_type || "Normal",
//           pickup_date,
//           pickup_time,
//         };

//         const jeeblyResponse = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create-reverse`,
//           shipmentPayload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (jeeblyResponse.data.awbNo) {
//           processingDetails.pickupDetails = {
//             ...processingDetails.pickupDetails,
//             pickupStatus: "Pickup Scheduled",
//             awbNumber: jeeblyResponse.data.awbNo,
//             pickupStatusHistory: [
//               ...processingDetails.pickupDetails.pickupStatusHistory,
//               { status: "Pickup Scheduled", timestamp: new Date() },
//             ],
//           };
//           const orderStatus = "Assigned to Pickup";
//           currentOrderStatusHistory.push({
//             status: orderStatus,
//             timestamp: new Date(),
//           });
//           await onUpdateStatus(
//             order._id,
//             orderStatus,
//             processingDetails,
//             null,
//             currentOrderStatusHistory
//           );
//           setPickupDetails({
//             pickupStatus: "Pickup Scheduled",
//             awbNumber: jeeblyResponse.data.awbNo,
//           });
//           setOrderStatusHistory(currentOrderStatusHistory);
//         } else {
//           throw new Error("AWB not received from Jeebly");
//         }
//       }

//       // Quality Check
//       if (currentStep.id === "quality_check") {
//         if (!photos.length) {
//           setError("Please upload photos before proceeding");
//           setLoading(false);
//           return;
//         }

//         // **Warehouse mandatory for ALL orders in QC (including Kukit)**
//         if (!selectedWarehouseId || !warehouseAddress.name) {
//           setError("Please select a warehouse for shipment");
//           setShowWarehouseModal(true);
//           setLoading(false);
//           return;
//         }

//         if (qualityResult === "Fail") {
//           if (!rejectionReason.trim()) {
//             setError("Please enter a rejection reason");
//             setLoading(false);
//             return;
//           }
//           const { pickup_date, pickup_time } = calculatePickupDate();
//           const sellerPickupAddress =
//             fetchedOrder.products?.[0]?.product?.pickupAddress || {};
//           const forwardPayload = {
//             delivery_type: "Next Day",
//             load_type: "Non-document",
//             consignment_type: "FORWARD",
//             description: `Return for rejected Order #${order._id} due to ${rejectionReason}`,
//             weight:
//               fetchedOrder.products?.reduce(
//                 (sum, p) => sum + (p.weight || 1),
//                 0
//               ) || 2,
//             payment_type: "PREPAID",
//             cod_amount: 0,
//             num_pieces: fetchedOrder.products?.length || 1,
//             customer_reference_number: order._id,
//             origin_address_name: warehouseAddress.name,
//             origin_address_mob_no_country_code:
//               warehouseAddress.mob_no_country_code || "971",
//             origin_address_mobile_number: warehouseAddress.mobile_number,
//             origin_address_house_no: warehouseAddress.house_no,
//             origin_address_building_name: warehouseAddress.building_name,
//             origin_address_area: warehouseAddress.area,
//             origin_address_landmark: warehouseAddress.landmark,
//             origin_address_city: warehouseAddress.city,
//             origin_address_type: warehouseAddress.address_type || "Normal",
//             destination_address_name:
//               sellerPickupAddress.name || "Unknown Seller",
//             destination_address_mob_no_country_code:
//               sellerPickupAddress.mob_no_country_code || "971",
//             destination_address_mobile_number:
//               sellerPickupAddress.mobile_number || "501234567",
//             destination_address_house_no:
//               sellerPickupAddress.house_no || "A-15",
//             destination_address_building_name:
//               sellerPickupAddress.building_name || "Default Building",
//             destination_address_area:
//               sellerPickupAddress.area || "Default Area",
//             destination_address_landmark:
//               sellerPickupAddress.landmark || "Default Landmark",
//             destination_address_city: sellerPickupAddress.city || "Dubai",
//             destination_address_type:
//               sellerPickupAddress.address_type || "Normal",
//             pickup_date,
//             pickup_time,
//             rejectionReason,
//             uploadphotos: photos.length > 0 ? photos.join(",") : "",
//           };

//           const jeeblyResponse = await axios.post(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create`,
//             forwardPayload,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           if (jeeblyResponse.data.awbNo) {
//             processingDetails.qcRejectedItemDetail = {
//               trackingNumber: jeeblyResponse.data.awbNo,
//               rejectedStatus: "Pickup Scheduled",
//               qcRejectedItemDetailHistory: [
//                 { status: "Pickup Scheduled", timestamp: new Date() },
//               ],
//             };
//             const orderStatus = "QC-Rejected Pickup Scheduled";
//             currentOrderStatusHistory.push({
//               status: orderStatus,
//               timestamp: new Date(),
//             });
//             await onUpdateStatus(
//               order._id,
//               orderStatus,
//               processingDetails,
//               rejectionReason,
//               currentOrderStatusHistory
//             );
//             setQcRejectedDetails({
//               trackingNumber: jeeblyResponse.data.awbNo,
//               rejectedStatus: "Pickup Scheduled",
//             });
//             setOrderStatusHistory(currentOrderStatusHistory);
//             if (activeStep < filteredSteps.length - 1) {
//               setActiveStep((prev) => prev + 1);
//             }
//             alert(
//               "Product rejected, forward shipment started with AWB #" +
//                 jeeblyResponse.data.awbNo
//             );
//           } else {
//             throw new Error("Failed to start forward shipment");
//           }
//         } else if (qualityResult === "Pass" && mainCategory) {
//           const { pickup_date, pickup_time } = calculatePickupDate();
//           const buyerAddress = fetchedOrder.shippingAddress;
//           const shipmentPayload = {
//             delivery_type: "Next Day",
//             load_type: "Non-document",
//             consignment_type: "FORWARD",
//             description: `Delivery for Order #${order._id}`,
//             weight:
//               fetchedOrder.products?.reduce(
//                 (sum, p) => sum + (p.weight || 1),
//                 0
//               ) || 2,
//             payment_type: fetchedOrder.isPaid ? "PREPAID" : "COD",
//             cod_amount: fetchedOrder.isPaid ? 0 : fetchedOrder.finalAmount,
//             num_pieces: fetchedOrder.products?.length || 1,
//             customer_reference_number: order._id,
//             origin_address_name: warehouseAddress.name,
//             origin_address_mob_no_country_code:
//               warehouseAddress.mob_no_country_code || "971",
//             origin_address_mobile_number: warehouseAddress.mobile_number,
//             origin_address_house_no: warehouseAddress.house_no,
//             origin_address_building_name: warehouseAddress.building_name,
//             origin_address_area: warehouseAddress.area,
//             origin_address_landmark: warehouseAddress.landmark,
//             origin_address_city: warehouseAddress.city,
//             origin_address_type: warehouseAddress.address_type || "Normal",
//             destination_address_name: buyerAddress.name || "Unknown Recipient",
//             destination_address_mob_no_country_code:
//               buyerAddress.mob_no_country_code || "971",
//             destination_address_mobile_number:
//               buyerAddress.mobile_number || "50186403",
//             destination_address_house_no: buyerAddress.house_no || "48",
//             destination_address_building_name:
//               buyerAddress.building_name || "Default Building",
//             destination_address_area: buyerAddress.area || "Default Area",
//             destination_address_landmark:
//               buyerAddress.landmark || "Default Landmark",
//             destination_address_city: buyerAddress.city || "Dubai",
//             destination_address_type: buyerAddress.address_type || "Normal",
//             pickup_date,
//             pickup_time,
//           };

//           const jeeblyResponse = await axios.post(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create`,
//             shipmentPayload,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           if (jeeblyResponse.data.awbNo) {
//             processingDetails.deliveryDetails = {
//               ...processingDetails.deliveryDetails,
//               trackingNumber: jeeblyResponse.data.awbNo,
//               deliveryStatus: "Scheduled For Delivery",
//               deliveryStatusHistory: [
//                 ...processingDetails.deliveryDetails.deliveryStatusHistory,
//                 { status: "Scheduled For Delivery", timestamp: new Date() },
//               ],
//             };
//             const orderStatus = "Pickup Scheduled For Delivery";
//             currentOrderStatusHistory.push({
//               status: orderStatus,
//               timestamp: new Date(),
//             });
//             await onUpdateStatus(
//               order._id,
//               orderStatus,
//               processingDetails,
//               null,
//               currentOrderStatusHistory
//             );
//             setDeliveryDetails({
//               trackingNumber: jeeblyResponse.data.awbNo,
//               deliveryStatus: "Scheduled For Delivery",
//             });
//             setOrderStatusHistory(currentOrderStatusHistory);
//             alert("Delivery started with AWB #" + jeeblyResponse.data.awbNo);
//           } else {
//             throw new Error("AWB not received from Jeebly for delivery");
//           }
//         } else {
//           setError("Please select quality result and main category for pass");
//           setLoading(false);
//           return;
//         }
//       }

//       if (activeStep < filteredSteps.length - 1) {
//         setActiveStep((prev) => prev + 1);
//       } else {
//         onClose();
//       }
//     } catch (err) {
//       console.error("Error updating order status:", err);
//       setError(
//         `Status update failed. Please try again. Details: ${err.message}`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhotoUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setPhotos(files.map((file) => URL.createObjectURL(file)));
//   };

//   const openWarehouseModal = () => setShowWarehouseModal(true);
//   const closeWarehouseModal = () => setShowWarehouseModal(false);
//   const handleSelectWarehouse = (id) => {
//     const selected = warehouses.find((wh) => wh._id === id);
//     if (selected) {
//       setSelectedWarehouseId(id);
//       setWarehouseAddress(selected);
//     }
//     closeWarehouseModal();
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-xl w-full max-w-5xl relative max-h-[90vh] flex flex-col">
//           <div className="p-6 overflow-y-auto flex-1 space-y-6">
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X size={24} />
//             </button>
//             <div className="border-b pb-4">
//               <h2 className="text-2xl font-bold text-gray-900">
//                 Process Order #{order._id}
//               </h2>
//               <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
//                 <span className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </span>
//                 <span className="flex items-center">
//                   <Tag className="w-4 h-4 mr-1" />$
//                   {order.finalAmount.toFixed(2)}
//                 </span>
//                 <span className="flex items-center">
//                   <Users className="w-4 h-4 mr-1" />
//                   {order?.buyerName || "Unknown Buyer"}
//                 </span>
//               </div>
//             </div>

//             {/* Steps Table */}
//             <div className="mt-4">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 bg-gray-100 font-semibold">
//                       Step
//                     </th>
//                     <th className="py-2 px-4 bg-gray-100 font-semibold">
//                       Sub-Steps
//                     </th>
//                     <th className="py-2 px-4 bg-gray-100 font-semibold">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSteps.map((step, index) => {
//                     const StepIcon = step.icon;

//                     const deliveryStepIndex = filteredSteps.findIndex(
//                       (s) => s.id === "delivery_team"
//                     );
//                     const isDeliveryStepCompleted =
//                       deliveryStepIndex === index && isDeliveryCompleted();
//                     const isCompleted =
//                       index < activeStep || isDeliveryStepCompleted;
//                     const isActive = index === activeStep;

//                     return (
//                       <tr
//                         key={step.id}
//                         className={`${
//                           isActive
//                             ? "bg-blue-50"
//                             : isCompleted
//                             ? "bg-green-50"
//                             : index % 2 === 0
//                             ? "bg-gray-50"
//                             : ""
//                         }`}
//                       >
//                         <td className="py-3 px-4">
//                           <div className="flex items-center">
//                             <StepIcon size={24} className="mr-2" />
//                             <div>
//                               <div className="font-medium">{step.title}</div>
//                               <div className="text-xs text-gray-500">
//                                 {step.description}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <ul className="text-sm space-y-1">
//                             {step.subSteps.map((subStep, subIndex) => (
//                               <li key={subIndex} className="flex items-center">
//                                 <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
//                                 {subStep}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                         <td className="py-3 px-4">
//                           {isCompleted ? (
//                             <CheckCircle className="text-green-500" size={24} />
//                           ) : isActive ? (
//                             <Loader2
//                               className="animate-spin text-blue-600"
//                               size={24}
//                             />
//                           ) : (
//                             <Clock className="text-gray-400" size={24} />
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Current Step Form */}
//             <div className="bg-gray-50 p-6 rounded-lg mt-6">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 {filteredSteps[activeStep]?.title || "Process Complete"}
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 {filteredSteps[activeStep]?.description ||
//                   "All steps have been successfully completed."}
//               </p>

//               {/* Customer Care */}
//               {filteredSteps[activeStep]?.id === "customer_care" && (
//                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//                   <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
//                     <Phone className="w-4 h-4 mr-2" />
//                     Seller Contact & Confirmation
//                   </h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Contact Status
//                       </label>
//                       <select
//                         value={customerCare.confirmationStatus}
//                         onChange={(e) =>
//                           setCustomerCare((prev) => ({
//                             ...prev,
//                             confirmationStatus: e.target.value,
//                           }))
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                       >
//                         <option value="">Select status</option>
//                         <option value="contacted">Seller Contacted</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Seller Contacted Date
//                       </label>
//                       <input
//                         type="date"
//                         value={customerCare.date}
//                         onChange={(e) =>
//                           setCustomerCare((prev) => ({
//                             ...prev,
//                             date: e.target.value,
//                           }))
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Contacted Time
//                       </label>
//                       <input
//                         type="time"
//                         value={customerCare.time}
//                         onChange={(e) =>
//                           setCustomerCare((prev) => ({
//                             ...prev,
//                             time: e.target.value,
//                           }))
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Seller Pickup Location
//                       </label>
//                       <input
//                         type="text"
//                         value={customerCare.location}
//                         onChange={(e) =>
//                           setCustomerCare((prev) => ({
//                             ...prev,
//                             location: e.target.value,
//                           }))
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                         placeholder="Enter seller pickup location"
//                       />
//                     </div>

//                     {/* Warehouse only for Listing */}
//                     {!kukitOrder && (
//                       <div className="col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Select Warehouse
//                         </label>
//                         <button
//                           onClick={openWarehouseModal}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
//                         >
//                           <span>
//                             {selectedWarehouseId
//                               ? `${warehouseAddress.name || ""} (${
//                                   warehouseAddress.city || ""
//                                 })`
//                               : "Select warehouse"}
//                           </span>
//                           <MapPin size={20} />
//                         </button>
//                         {selectedWarehouseId && (
//                           <p className="text-xs text-gray-500 mt-1">
//                             Selected: {warehouseAddress.name || ""},{" "}
//                             {warehouseAddress.house_no || ""},{" "}
//                             {warehouseAddress.building_name || ""},{" "}
//                             {warehouseAddress.landmark || ""},{" "}
//                             {warehouseAddress.city || ""},{" "}
//                             {warehouseAddress.city || ""}, +
//                             {warehouseAddress.mob_no_country_code}{" "}
//                             {warehouseAddress.mobile_number},{" "}
//                             {warehouseAddress.email || ""}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Pickup Team – Only for Listing */}
//               {filteredSteps[activeStep]?.id === "pickup_team" &&
//                 !kukitOrder && (
//                   <div className="space-y-4">
//                     <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                       <h4 className="font-medium text-blue-800 mb-3 flex items-center">
//                         Pickup Tracking
//                       </h4>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             AWB Number
//                           </label>
//                           <input
//                             type="text"
//                             value={pickupDetails.awbNumber}
//                             readOnly
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Pickup Status
//                           </label>
//                           <input
//                             type="text"
//                             value={pickupDetails.pickupStatus}
//                             readOnly
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
//                           />
//                         </div>
//                       </div>
//                       <p className="mt-2 text-sm text-gray-500">
//                         Note: Pickup is handled by Jeebly. Status will
//                         auto-update via webhook.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//               {/* Quality Check */}
//               {filteredSteps[activeStep]?.id === "quality_check" && (
//                 <div className="space-y-6">
//                   {/* Product Details Card */}
//                   {order?.products?.map((item, idx) => {
//                     const product = item.product;
//                     if (!product) return null;

//                     return (
//                       <div
//                         key={idx}
//                         className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 shadow-sm"
//                       >
//                         <h4 className="text-lg font-bold text-indigo-800 mb-4 flex items-center">
//                           <Package className="w-5 h-5 mr-2" />
//                           Product Details (Quality Inspection)
//                         </h4>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           {/* Left: Image + Key Info */}
//                           <div className="space-y-4">
//                             {/* Product Images */}
//                             {product.images && product.images.length > 0 && (
//                               <div className="flex gap-2 overflow-x-auto pb-2">
//                                 {product.images.slice(0, 3).map((img, i) => (
//                                   <img
//                                     key={i}
//                                     src={img}
//                                     alt={`Product ${i + 1}`}
//                                     className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
//                                   />
//                                 ))}
//                                 {product.images.length > 3 && (
//                                   <div className="w-24 h-24 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
//                                     +{product.images.length - 3}
//                                   </div>
//                                 )}
//                               </div>
//                             )}

//                             {/* Key Info */}
//                             <div className="space-y-2 text-sm">
//                               <div className="flex justify-between">
//                                 <span className="font-medium text-gray-700">
//                                   Name:
//                                 </span>
//                                 <span className="text-gray-900">
//                                   {product.name}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="font-medium text-gray-700">
//                                   Brand:
//                                 </span>
//                                 <span className="text-gray-900">
//                                   {product.brand?.brandName || "N/A"}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="font-medium text-gray-700">
//                                   Size:
//                                 </span>
//                                 <span className="text-gray-900">
//                                   {product.size?.sizeName || "N/A"}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="font-medium text-gray-700">
//                                   Condition:
//                                 </span>
//                                 <span className="text-gray-900">
//                                   {product.condition?.conditionName || "N/A"}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="font-medium text-gray-700">
//                                   Color:
//                                 </span>
//                                 <span className="text-gray-900">
//                                   {product.color?.colorName || "N/A"}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Right: Category + Seller Info */}
//                           <div className="space-y-4">
//                             {/* Category */}
//                             <div>
//                               <p className="font-medium text-gray-700 mb-1">
//                                 Category:
//                               </p>
//                               <p className="text-sm text-gray-900">
//                                 {product.category?.parentCategory} &gt;{" "}
//                                 {product.category?.categoryName}{" "}
//                                 {product.category?.subCategoryName &&
//                                   `&gt; ${product.category.subCategoryName}`}
//                               </p>
//                             </div>

//                             {/* Seller */}
//                             <div>
//                               <p className="font-medium text-gray-700 mb-1">
//                                 Seller:
//                               </p>
//                               <p className="text-sm text-gray-900">
//                                 {product.seller?.name || "Unknown"}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {product.seller?.phone || ""}
//                               </p>
//                             </div>

//                             {/* Pickup Address */}
//                             {product.pickupAddress && (
//                               <div>
//                                 <p className="font-medium text-gray-700 mb-1 flex items-center">
//                                   <MapPin className="w-4 h-4 mr-1" /> Pickup
//                                   From:
//                                 </p>
//                                 <p className="text-xs text-gray-600">
//                                   {product.pickupAddress.house_no &&
//                                     `${product.pickupAddress.house_no}, `}
//                                   {product.pickupAddress.building_name}
//                                   {product.pickupAddress.area &&
//                                     `, ${product.pickupAddress.area}`}
//                                   {product.pickupAddress.city &&
//                                     `, ${product.pickupAddress.city}`}
//                                 </p>
//                               </div>
//                             )}

//                             {/* Description */}
//                             {product.description && (
//                               <div>
//                                 <p className="font-medium text-gray-700 mb-1">
//                                   Description:
//                                 </p>
//                                 <p className="text-xs text-gray-600 italic line-clamp-2">
//                                   {product.description}
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Barcode & Type */}
//                         <div className="mt-4 pt-4 border-t border-indigo-200 flex justify-between text-xs">
//                           <div>
//                             <span className="font-medium text-gray-700">
//                               Barcode:
//                             </span>{" "}
//                             <span className="font-mono bg-gray-100 px-2 py-1 rounded">
//                               {product.barcode || "N/A"}
//                             </span>
//                           </div>
//                           <div>
//                             <span className="font-medium text-gray-700">
//                               Type:
//                             </span>{" "}
//                             <span className="capitalize">
//                               {product.productType || "N/A"}
//                             </span>
//                           </div>
//                           {item.isRental && (
//                             <div className="text-green-600 font-medium">
//                               Rental Order
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}

//                   <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
//                     <h4 className="font-medium text-purple-800 mb-3 flex items-center">
//                       Quality Assessment
//                     </h4>
//                     <div className="grid grid-cols-2 gap-4">
//                       {Object.entries(qualityChecklist).map(([key, value]) => (
//                         <label
//                           key={key}
//                           className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={value}
//                             onChange={(e) =>
//                               setQualityChecklist((prev) => ({
//                                 ...prev,
//                                 [key]: e.target.checked,
//                               }))
//                             }
//                             className="h-4 w-4 text-blue-600"
//                           />
//                           <span className="text-gray-700">
//                             {key
//                               .replace(/([A-Z])/g, " $1")
//                               .replace(/^./, (str) => str.toUpperCase())}
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
//                     <h4 className="font-medium text-orange-800 mb-3">
//                       Quality Result
//                     </h4>
//                     <div className="grid grid-cols-2 gap-2">
//                       {["Pass", "Fail"].map((result) => (
//                         <label
//                           key={result}
//                           className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
//                         >
//                           <input
//                             type="radio"
//                             name="qualityResult"
//                             value={result}
//                             checked={qualityResult === result}
//                             onChange={(e) => setQualityResult(e.target.value)}
//                             className="h-4 w-4 text-blue-600"
//                           />
//                           <span className="text-sm font-medium">{result}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   {qualityResult === "Pass" && (
//                     <div className="space-y-6">
//                       <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                         <h4 className="font-medium text-blue-800 mb-3">
//                           Product Type
//                         </h4>
//                         <div className="grid grid-cols-2 gap-3">
//                           {["Listing", "Kukit Purchase"].map((cat) => (
//                             <button
//                               key={cat}
//                               onClick={() => setMainCategory(cat)}
//                               className={`p-3 rounded-lg border-2 font-medium transition-all ${
//                                 mainCategory === cat
//                                   ? "bg-blue-600 text-white border-blue-600"
//                                   : "bg-white border-gray-300 hover:border-blue-400"
//                               }`}
//                             >
//                               {cat}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                       {mainCategory && (
//                         <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
//                           <label className="flex items-center space-x-3 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={isRenting}
//                               onChange={(e) => setIsRenting(e.target.checked)}
//                               className="w-5 h-5 text-green-600 rounded"
//                             />
//                             <span className="font-medium text-gray-800">
//                               Renting
//                             </span>
//                           </label>
//                         </div>
//                       )}
//                       {/* Warehouse in QC for ALL */}
//                       <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
//                         <h4 className="font-medium text-indigo-800 mb-3 flex items-center">
//                           Warehouse Selection
//                         </h4>
//                         <button
//                           onClick={openWarehouseModal}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
//                         >
//                           <span>
//                             {selectedWarehouseId
//                               ? `${warehouseAddress.name || ""} (${
//                                   warehouseAddress.city || ""
//                                 })`
//                               : "Select warehouse"}
//                           </span>
//                           <MapPin size={20} />
//                         </button>
//                         {selectedWarehouseId && (
//                           <p className="text-xs text-gray-500 mt-1">
//                             Selected: {warehouseAddress.name || ""},{" "}
//                             {warehouseAddress.house_no || ""},{" "}
//                             {warehouseAddress.building_name || ""},{" "}
//                             {warehouseAddress.landmark || ""},{" "}
//                             {warehouseAddress.city || ""},{" "}
//                             {warehouseAddress.city || ""}, +
//                             {warehouseAddress.mob_no_country_code}{" "}
//                             {warehouseAddress.mobile_number},{" "}
//                             {warehouseAddress.email || ""}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {qualityResult === "Fail" && (
//                     <div className="space-y-4">
//                       <div className="bg-red-50 p-4 rounded-lg border border-red-200">
//                         <h4 className="font-medium text-red-800 mb-3">
//                           Reason for Rejection
//                         </h4>
//                         <textarea
//                           placeholder="Enter reason for rejection"
//                           value={rejectionReason}
//                           onChange={(e) => setRejectionReason(e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                         />
//                       </div>
//                       {/* Warehouse in QC Fail */}
//                       <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
//                         <h4 className="font-medium text-indigo-800 mb-3 flex items-center">
//                           Warehouse for Reverse Shipment
//                         </h4>
//                         <button
//                           onClick={openWarehouseModal}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
//                         >
//                           <span>
//                             {selectedWarehouseId
//                               ? `${warehouseAddress.name || ""} (${
//                                   warehouseAddress.city || ""
//                                 })`
//                               : "Select warehouse"}
//                           </span>
//                           <MapPin size={20} />
//                         </button>
//                         {selectedWarehouseId && (
//                           <p className="text-xs text-gray-500 mt-1">
//                             Selected: {warehouseAddress.name || ""},{" "}
//                             {warehouseAddress.house_no || ""},{" "}
//                             {warehouseAddress.building_name || ""},{" "}
//                             {warehouseAddress.landmark || ""},{" "}
//                             {warehouseAddress.city || ""},{" "}
//                             {warehouseAddress.city || ""}, +
//                             {warehouseAddress.mob_no_country_code}{" "}
//                             {warehouseAddress.mobile_number},{" "}
//                             {warehouseAddress.email || ""}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Delivery Team */}
//               {filteredSteps[activeStep]?.id === "delivery_team" && (
//                 <div className="space-y-4">
//                   <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                     <h4 className="font-medium text-green-800 mb-3 flex items-center">
//                       Delivery Tracking
//                     </h4>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           AWB Number
//                         </label>
//                         <input
//                           type="text"
//                           value={
//                             order.orderStatus.startsWith("QC-Rejected")
//                               ? qcRejectedDetails.trackingNumber
//                               : deliveryDetails.trackingNumber
//                           }
//                           readOnly
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Delivery Status
//                         </label>
//                         <input
//                           type="text"
//                           value={
//                             order.orderStatus.startsWith("QC-Rejected")
//                               ? qcRejectedDetails.rejectedStatus
//                               : deliveryDetails.deliveryStatus
//                           }
//                           readOnly
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
//                         />
//                       </div>
//                     </div>
//                     <p className="mt-2 text-sm text-gray-500">
//                       Note: Delivery is handled by Jeebly. Status will
//                       auto-update via webhook.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Photo Upload */}
//               {filteredSteps[activeStep]?.fields.includes("photos") && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Upload Photos
//                   </label>
//                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
//                     <div className="space-y-1 text-center">
//                       <Camera className="mx-auto h-12 w-12 text-gray-400" />
//                       <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
//                         <span>Upload files</span>
//                         <input
//                           type="file"
//                           className="sr-only"
//                           multiple
//                           onChange={handlePhotoUpload}
//                           accept="image/*"
//                         />
//                       </label>
//                     </div>
//                   </div>
//                   {photos.length > 0 && (
//                     <div className="mt-4 grid grid-cols-3 gap-4">
//                       {photos.map((photo, index) => (
//                         <img
//                           key={index}
//                           src={photo}
//                           alt={`Upload ${index + 1}`}
//                           className="h-24 w-24 object-cover rounded-lg"
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {error && (
//               <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
//                 <AlertCircle className="mr-2" size={20} />
//                 {error}
//               </div>
//             )}

//             <div className="flex justify-end space-x-3 pt-4 border-t">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateStatus}
//                 disabled={loading || activeStep >= filteredSteps.length}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                     Processing...
//                   </>
//                 ) : (
//                   `Complete ${filteredSteps[activeStep]?.title || "Process"}`
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <WarehouseModal
//         isOpen={showWarehouseModal}
//         onClose={closeWarehouseModal}
//         warehouses={warehouses}
//         onSelectWarehouse={handleSelectWarehouse}
//       />
//     </>
//   );
// };

// export default OrderModel;
















import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import {
  Search,
  Truck,
  CheckCircle,
  ClipboardCheck,
  Box,
  AlertCircle,
  Users,
  Clock,
  Camera,
  Loader2,
  Download,
  X,
  Filter,
  Calendar,
  Tag,
  Phone,
  MapPin,
  Package,
  FileText,
} from "lucide-react";
import axios from "axios";
import WarehouseModal from "./WarehouseModal";

const OrderModel = ({ isOpen, onClose, order, onUpdateStatus }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qualityChecklist, setQualityChecklist] = useState({
    itemCondition: false,
    Packaging: false,
    labeling: false,
    documentation: false,
    qualityStandard: false,
    safetyChecking: false,
  });
  const [photos, setPhotos] = useState([]);
  const [pickupDetails, setPickupDetails] = useState({
    pickupStatus: "",
    awbNumber: "",
  });
  const [deliveryDetails, setDeliveryDetails] = useState({
    trackingNumber: "",
    deliveryStatus: "",
  });
  const [qcRejectedDetails, setQcRejectedDetails] = useState({
    trackingNumber: "",
    rejectedStatus: "",
  });
  const [customerCare, setCustomerCare] = useState({
    confirmationStatus: "",
    date: "",
    time: "",
    location: "",
  });
  const [qualityResult, setQualityResult] = useState("Pending");
  const [mainCategory, setMainCategory] = useState("");
  const [isRenting, setIsRenting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [barcodeGenerated, setBarcodeGenerated] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [orderStatusHistory, setOrderStatusHistory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState({});
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);

  // Check if ALL products are Kukit Purchase
  const isKukitPurchaseOrder = () => {
    return order?.products?.every(
      (p) => p?.product?.productType === "Kukit Purchase"
    );
  };

  const kukitOrder = isKukitPurchaseOrder();

  // Dynamic Steps – Pickup skipped for Kukit
  const steps = useMemo(() => {
    const baseSteps = [
      {
        id: "customer_care",
        title: "Customer Care",
        icon: Users,
        description: "Initial order processing and seller coordination",
        subSteps: kukitOrder
          ? ["Product already in warehouse", "Ready for Quality Check"]
          : [
              "Calls Seller for pick up confirmation",
              "Fills Date & Time for Pick Up",
            ],
        fields: ["notes", "customerCare", "barcodeGenerated"],
        permission: "CustomerCare",
      },
    ];

    // Only add Pickup for NON-Kukit
    if (!kukitOrder) {
      baseSteps.push({
        id: "pickup_team",
        title: "Pick Up Team",
        icon: Box,
        description: "Schedule and track item pickup via Jeebly",
        subSteps: [
          "Pickup scheduled by Jeebly",
          "Item picked up (auto updated)",
          "Delivered to KuKu (auto updated)",
        ],
        fields: ["pickupDetails"],
        permission: "PickedOrders",
      });
    }

    baseSteps.push(
      {
        id: "quality_check",
        title: "Quality Check",
        icon: ClipboardCheck,
        description: "Quality inspection and verification",
        subSteps: [
          "Receives Order & Identify",
          "Pass: Select Listing Category (Listing, KuKit, Renting)",
          "Fail: Provide Rejection Reason",
        ],
        fields: [
          "qualityChecklist",
          "photos",
          "notes",
          "qualityResult",
          "mainCategory",
          "isRenting",
          "rejectionReason",
        ],
        permission: "QualityCheck",
      },
      {
        id: "delivery_team",
        title: "Delivery Team",
        icon: Truck,
        description:
          "Delivery scheduling and tracking, including reverse delivery",
        subSteps: [
          "Process delivery based on quality decision",
          "Update tracking information for reverse or forward delivery",
          "Complete delivery or RTO",
        ],
        fields: ["deliveryDetails", "qcRejectedDetails", "notes"],
        permission: "Delivered",
      }
    );

    return baseSteps;
  }, [order, kukitOrder]);

  const filteredSteps = useMemo(() => {
    return isSuperAdmin
      ? steps
      : steps.filter((step) => {
          const hasSpecificPermission = userPermissions.includes(
            step.permission
          );
          const hasGeneralAccess =
            userPermissions.includes("Orders") && !step.permission;
          return hasSpecificPermission || hasGeneralAccess;
        });
  }, [userPermissions, isSuperAdmin, steps]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = JSON.parse(Cookies.get("token"));
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get-permissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserPermissions(response.data.permissions);
        setIsSuperAdmin(response.data.superAdmin);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError("Failed to fetch permissions. Please try again.");
      }
    };
    fetchPermissions();

    const fetchWarehouses = async () => {
      try {
        const token = JSON.parse(Cookies.get("token"));
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
  }, []);

  useEffect(() => {
    if (order && order.processingDetails) {
      setCustomerCare({
        confirmationStatus:
          order.processingDetails.customerCare?.confirmationStatus || "",
        date: order.processingDetails.customerCare?.date
          ? new Date(order.processingDetails.customerCare.date)
              .toISOString()
              .split("T")[0]
          : "",
        time: order.processingDetails.customerCare?.time || "",
        location: order.processingDetails.customerCare?.location || "",
      });
      setPickupDetails({
        pickupStatus: order.processingDetails.pickupDetails?.pickupStatus || "",
        awbNumber: order.processingDetails.pickupDetails?.awbNumber || "",
      });
      setDeliveryDetails({
        trackingNumber:
          order.processingDetails.deliveryDetails?.trackingNumber || "",
        deliveryStatus:
          order.processingDetails.deliveryDetails?.deliveryStatus || "",
      });
      setQcRejectedDetails({
        trackingNumber:
          order.processingDetails.qcRejectedItemDetail?.trackingNumber || "",
        rejectedStatus:
          order.processingDetails.qcRejectedItemDetail?.rejectedStatus || "",
      });
      setQualityChecklist({
        itemCondition:
          order.processingDetails.qualityChecklist?.qualityAssessment
            ?.itemCondition || false,
        Packaging:
          order.processingDetails.qualityChecklist?.qualityAssessment
            ?.Packaging || false,
        labeling:
          order.processingDetails.qualityChecklist?.qualityAssessment
            ?.labeling || false,
        documentation:
          order.processingDetails.qualityChecklist?.qualityAssessment
            ?.documentation || false,
        qualityStandard:
          order.processingDetails.qualityChecklist?.qualityAssessment
            ?.qualityStandard || false,
        safetyChecking:
          order.processingDetails.qualityChecklist?.qualityAssessment
            ?.safetyChecking || false,
      });
      setQualityResult(
        order.processingDetails.qualityChecklist?.qualityResult || "Pending"
      );

      const lc = order.processingDetails.qualityChecklist?.listingCategory;
      if (lc) {
        if (lc.listing === "selected") setMainCategory("Listing");
        else if (lc.kukit === "selected") setMainCategory("Kukit Purchase");
        setIsRenting(lc.renting === "selected");
      }

      setRejectionReason(
        order.qualityCheckProof?.[0]?.status === "Rejected"
          ? order.qualityCheckProof[0]?.desc || ""
          : ""
      );
      setPhotos(
        order.processingDetails.qualityChecklist?.uploadphotos
          ? order.processingDetails.qualityChecklist.uploadphotos.split(",")
          : []
      );
      setBarcodeGenerated(
        !!order.processingDetails.customerCare?.confirmationStatus
      );
      setOrderStatusHistory(order.orderStatusHistory || []);
      if (order.processingDetails.warehouseId) {
        setSelectedWarehouseId(order.processingDetails.warehouseId);
      }
    }
  }, [order]);

  useEffect(() => {
    if (selectedWarehouseId && warehouses.length > 0) {
      const selected = warehouses.find((wh) => wh._id === selectedWarehouseId);
      if (selected) {
        setWarehouseAddress(selected);
      }
    }
  }, [selectedWarehouseId, warehouses]);

  const isDeliveryCompleted = () => {
    if (!order?.orderStatusHistory || !Array.isArray(order.orderStatusHistory))
      return false;
    return order.orderStatusHistory.some(
      (h) =>
        h.status === "Delivered" || h.status === "QC-Rejected RTO Delivered"
    );
  };

  // Auto-jump: Kukit → Direct QC after Customer Care
  useEffect(() => {
    if (order && filteredSteps.length > 0) {
      const statusMap = {
        "Customer Care": 0,
        "Assigned to Pickup": kukitOrder ? -1 : 1,
        "In KukuWarehouse": kukitOrder ? 1 : 2,
        "Assigned to Quality check": kukitOrder ? 1 : 2,
        "Out for delivery": kukitOrder ? 2 : 3,
        "Pickup Scheduled For Delivery": kukitOrder ? 2 : 3,
        Delivered: kukitOrder ? 3 : 4,
        "QC-Rejected Pickup Scheduled": kukitOrder ? 2 : 3,
        "QC-Rejected RTO Delivered": kukitOrder ? 3 : 4,
      };

      const deliveryStepIndex = filteredSteps.findIndex(
        (s) => s.id === "delivery_team"
      );
      if (deliveryStepIndex !== -1 && isDeliveryCompleted()) {
        setActiveStep(filteredSteps.length); // Jump to end
        return;
      }

      let stepIndex = statusMap[order.orderStatus] || 0;
      if (stepIndex === -1) stepIndex = 0;

      let currentStepIndex = stepIndex;

      // For Kukit Purchase: Check if QC is already done (Pass/Fail)
      const qcAlreadyDone =
        order.processingDetails.qualityChecklist?.qualityResult !== "Pending";

      // For Kukit: If Customer Care done but QC not done yet, jump to QC
      if (
        kukitOrder &&
        order.processingDetails.customerCare?.confirmationStatus &&
        !qcAlreadyDone &&
        order.orderStatus === "Assigned to Quality check"
      ) {
        const qcIndex = filteredSteps.findIndex(
          (s) => s.id === "quality_check"
        );
        if (qcIndex !== -1) {
          setActiveStep(qcIndex);
          return;
        }
      }

      // For Listing: Move to pickup after customer care
      if (
        !kukitOrder &&
        order.processingDetails.customerCare?.confirmationStatus &&
        stepIndex <= 0 &&
        filteredSteps.some((step) => step.id === "pickup_team")
      ) {
        currentStepIndex = filteredSteps.findIndex(
          (step) => step.id === "pickup_team"
        );
      }

      // For Listing: Move to QC when item delivered to warehouse
      const qualityCheckIndex = filteredSteps.findIndex(
        (step) => step.id === "quality_check"
      );
      if (
        !kukitOrder &&
        (order.orderStatus === "In KukuWarehouse" ||
          order.processingDetails.pickupDetails?.pickupStatus ===
            "Delivered") &&
        stepIndex <= 1 &&
        qualityCheckIndex !== -1 &&
        order.processingDetails.qualityChecklist?.qualityResult === "Pending"
      ) {
        currentStepIndex = qualityCheckIndex;
      }

      // For BOTH Kukit & Listing: If QC Pass and category selected, move to delivery
      if (
        order.processingDetails.qualityChecklist?.qualityResult === "Pass" &&
        (order.processingDetails.qualityChecklist?.listingCategory?.listing ||
          order.processingDetails.qualityChecklist?.listingCategory?.kukit ||
          order.processingDetails.qualityChecklist?.listingCategory?.giveAway ||
          order.processingDetails.qualityChecklist?.listingCategory?.renting)
      ) {
        const deliveryIndex = filteredSteps.findIndex(
          (step) => step.id === "delivery_team"
        );
        if (deliveryIndex !== -1) {
          currentStepIndex = deliveryIndex;
        }
      }

      // If delivery completed
      if (
        order.processingDetails.deliveryDetails?.deliveryStatus ===
          "Delivered" &&
        order.orderStatus === "Delivered"
      ) {
        currentStepIndex = filteredSteps.length;
      }

      // For QC Rejected or Out for delivery orders
      if (
        order.orderStatus === "Out for delivery" ||
        order.orderStatus === "Pickup Scheduled For Delivery" ||
        order.orderStatus === "Rejected" ||
        order.orderStatus.startsWith("QC-Rejected")
      ) {
        currentStepIndex = filteredSteps.findIndex(
          (step) => step.id === "delivery_team"
        );
      }

      // For QC Rejected RTO Delivered
      if (
        order.orderStatus === "QC-Rejected RTO Delivered" ||
        (order.orderStatus.startsWith("QC-Rejected") &&
          order.processingDetails.qcRejectedItemDetail?.rejectedStatus ===
            "RTO Delivered")
      ) {
        currentStepIndex = filteredSteps.length;
      }

      setActiveStep(
        currentStepIndex < filteredSteps.length
          ? currentStepIndex
          : filteredSteps.length
      );
    }
  }, [order, filteredSteps, kukitOrder, qcRejectedDetails.rejectedStatus]);

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const currentStep = filteredSteps[activeStep];
      if (!currentStep) {
        onClose();
        return;
      }

      const orderId = order?._id;
      const token = JSON.parse(Cookies.get("token"));
      const orderData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/OrderDetails/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedOrder = orderData.data.order;
      const currentOrderStatusHistory = [
        ...(fetchedOrder.orderStatusHistory || []),
      ];

      let processingDetails = {
        customerCare: { ...customerCare },
        pickupDetails: {
          ...pickupDetails,
          pickupStatusHistory:
            fetchedOrder.processingDetails?.pickupDetails
              ?.pickupStatusHistory || [],
        },
        deliveryDetails: {
          ...deliveryDetails,
          deliveryStatusHistory:
            fetchedOrder.processingDetails?.deliveryDetails
              ?.deliveryStatusHistory || [],
        },
        qualityChecklist: {
          qualityAssessment: { ...qualityChecklist },
          qualityResult,
          listingCategory: {
            listing: mainCategory === "Listing" ? "selected" : "",
            kukit: mainCategory === "Kukit Purchase" ? "selected" : "",
            giveAway: "",
            renting: isRenting ? "selected" : "",
          },
          uploadphotos: photos.length > 0 ? photos.join(",") : "",
          rejectionReason: rejectionReason || "",
        },
        warehouseId: selectedWarehouseId,
      };

      const calculatePickupDate = () => {
        const now = new Date();
        const dubaiOffset = 4 * 60;
        const dubaiTime = new Date(
          now.getTime() + (dubaiOffset - now.getTimezoneOffset()) * 60000
        );
        let pickupDate = new Date(dubaiTime);
        if (dubaiTime.getHours() >= 16)
          pickupDate.setDate(pickupDate.getDate() + 1);
        let skipCount = 0;
        while (pickupDate.getDay() === 0) {
          skipCount++;
          pickupDate.setDate(pickupDate.getDate() + 1);
          if (skipCount > 7) break;
        }
        const year = pickupDate.getFullYear();
        const month = String(pickupDate.getMonth() + 1).padStart(2, "0");
        const day = String(pickupDate.getDate()).padStart(2, "0");
        return { pickup_date: `${year}-${month}-${day}`, pickup_time: "09:00" };
      };

      // Customer Care
      if (
        currentStep.id === "customer_care" &&
        customerCare.confirmationStatus === "contacted"
      ) {
        if (kukitOrder) {
          const orderStatus = "Assigned to Quality check";
          currentOrderStatusHistory.push({
            status: orderStatus,
            timestamp: new Date(),
          });
          await onUpdateStatus(
            order._id,
            orderStatus,
            processingDetails,
            null,
            currentOrderStatusHistory
          );
          setActiveStep((prev) => prev + 1);
          setLoading(false);
          return;
        }

        // Listing → Warehouse mandatory
        if (!selectedWarehouseId) {
          setError("Please select a warehouse first");
          setShowWarehouseModal(true);
          setLoading(false);
          return;
        }

        const { pickup_date, pickup_time } = calculatePickupDate();
        const sellerPickupAddress =
          fetchedOrder.products?.[0]?.product?.pickupAddress || {};
        const shipmentPayload = {
          delivery_type: "Next Day",
          load_type: "Non-document",
          consignment_type: "REVERSE",
          description: `Pickup for Order #${order._id}`,
          weight:
            fetchedOrder.products?.reduce(
              (sum, p) => sum + (p.weight || 1),
              0
            ) || 2,
          payment_type: fetchedOrder.isPaid ? "PREPAID" : "COD",
          cod_amount: fetchedOrder.isPaid ? 0 : fetchedOrder.finalAmount,
          num_pieces: fetchedOrder.products?.length || 1,
          customer_reference_number: order._id,
          origin_address_name: sellerPickupAddress.name || "Unknown Seller",
          origin_address_mob_no_country_code:
            sellerPickupAddress.mob_no_country_code || "971",
          origin_address_mobile_number:
            sellerPickupAddress.mobile_number || "501234567",
          origin_address_house_no: sellerPickupAddress.house_no || "A-15",
          origin_address_building_name:
            sellerPickupAddress.building_name || "Default Building",
          origin_address_area: sellerPickupAddress.area || "Default Area",
          origin_address_landmark:
            sellerPickupAddress.landmark || "Default Landmark",
          origin_address_city: sellerPickupAddress.city || "Dubai",
          origin_address_type: sellerPickupAddress.address_type || "Normal",
          destination_address_name: warehouseAddress.name,
          destination_address_mob_no_country_code:
            warehouseAddress.mob_no_country_code || "971",
          destination_address_mobile_number: warehouseAddress.mobile_number,
          destination_address_house_no: warehouseAddress.house_no,
          destination_address_building_name: warehouseAddress.building_name,
          destination_address_area: warehouseAddress.area,
          destination_address_landmark: warehouseAddress.landmark,
          destination_address_city: warehouseAddress.city,
          destination_address_type: warehouseAddress.address_type || "Normal",
          pickup_date,
          pickup_time,
        };

        const jeeblyResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create-reverse`,
          shipmentPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (jeeblyResponse.data.awbNo) {
          processingDetails.pickupDetails = {
            ...processingDetails.pickupDetails,
            pickupStatus: "Pickup Scheduled",
            awbNumber: jeeblyResponse.data.awbNo,
            pickupStatusHistory: [
              ...processingDetails.pickupDetails.pickupStatusHistory,
              { status: "Pickup Scheduled", timestamp: new Date() },
            ],
          };
          const orderStatus = "Assigned to Pickup";
          currentOrderStatusHistory.push({
            status: orderStatus,
            timestamp: new Date(),
          });
          await onUpdateStatus(
            order._id,
            orderStatus,
            processingDetails,
            null,
            currentOrderStatusHistory
          );
          setPickupDetails({
            pickupStatus: "Pickup Scheduled",
            awbNumber: jeeblyResponse.data.awbNo,
          });
          setOrderStatusHistory(currentOrderStatusHistory);
        } else {
          throw new Error("AWB not received from Jeebly");
        }
      }

      // Quality Check
      if (currentStep.id === "quality_check") {
        if (!photos.length) {
          setError("Please upload photos before proceeding");
          setLoading(false);
          return;
        }

        // **Warehouse mandatory for ALL orders in QC (including Kukit)**
        if (!selectedWarehouseId || !warehouseAddress.name) {
          setError("Please select a warehouse for shipment");
          setShowWarehouseModal(true);
          setLoading(false);
          return;
        }

        if (qualityResult === "Fail") {
          if (!rejectionReason.trim()) {
            setError("Please enter a rejection reason");
            setLoading(false);
            return;
          }
          const { pickup_date, pickup_time } = calculatePickupDate();
          const sellerPickupAddress =
            fetchedOrder.products?.[0]?.product?.pickupAddress || {};
          const forwardPayload = {
            delivery_type: "Next Day",
            load_type: "Non-document",
            consignment_type: "FORWARD",
            description: `Return for rejected Order #${order._id} due to ${rejectionReason}`,
            weight:
              fetchedOrder.products?.reduce(
                (sum, p) => sum + (p.weight || 1),
                0
              ) || 2,
            payment_type: "PREPAID",
            cod_amount: 0,
            num_pieces: fetchedOrder.products?.length || 1,
            customer_reference_number: order._id,
            origin_address_name: warehouseAddress.name,
            origin_address_mob_no_country_code:
              warehouseAddress.mob_no_country_code || "971",
            origin_address_mobile_number: warehouseAddress.mobile_number,
            origin_address_house_no: warehouseAddress.house_no,
            origin_address_building_name: warehouseAddress.building_name,
            origin_address_area: warehouseAddress.area,
            origin_address_landmark: warehouseAddress.landmark,
            origin_address_city: warehouseAddress.city,
            origin_address_type: warehouseAddress.address_type || "Normal",
            destination_address_name:
              sellerPickupAddress.name || "Unknown Seller",
            destination_address_mob_no_country_code:
              sellerPickupAddress.mob_no_country_code || "971",
            destination_address_mobile_number:
              sellerPickupAddress.mobile_number || "501234567",
            destination_address_house_no:
              sellerPickupAddress.house_no || "A-15",
            destination_address_building_name:
              sellerPickupAddress.building_name || "Default Building",
            destination_address_area:
              sellerPickupAddress.area || "Default Area",
            destination_address_landmark:
              sellerPickupAddress.landmark || "Default Landmark",
            destination_address_city: sellerPickupAddress.city || "Dubai",
            destination_address_type:
              sellerPickupAddress.address_type || "Normal",
            pickup_date,
            pickup_time,
            rejectionReason,
            uploadphotos: photos.length > 0 ? photos.join(",") : "",
          };

          const jeeblyResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create`,
            forwardPayload,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (jeeblyResponse.data.awbNo) {
            processingDetails.qcRejectedItemDetail = {
              trackingNumber: jeeblyResponse.data.awbNo,
              rejectedStatus: "Pickup Scheduled",
              qcRejectedItemDetailHistory: [
                { status: "Pickup Scheduled", timestamp: new Date() },
              ],
            };
            const orderStatus = "QC-Rejected Pickup Scheduled";
            currentOrderStatusHistory.push({
              status: orderStatus,
              timestamp: new Date(),
            });
            await onUpdateStatus(
              order._id,
              orderStatus,
              processingDetails,
              rejectionReason,
              currentOrderStatusHistory
            );
            setQcRejectedDetails({
              trackingNumber: jeeblyResponse.data.awbNo,
              rejectedStatus: "Pickup Scheduled",
            });
            setOrderStatusHistory(currentOrderStatusHistory);
            if (activeStep < filteredSteps.length - 1) {
              setActiveStep((prev) => prev + 1);
            }
            alert(
              "Product rejected, forward shipment started with AWB #" +
                jeeblyResponse.data.awbNo
            );
          } else {
            throw new Error("Failed to start forward shipment");
          }
        } else if (qualityResult === "Pass" && mainCategory) {
          const { pickup_date, pickup_time } = calculatePickupDate();
          const buyerAddress = fetchedOrder.shippingAddress;
          const shipmentPayload = {
            delivery_type: "Next Day",
            load_type: "Non-document",
            consignment_type: "FORWARD",
            description: `Delivery for Order #${order._id}`,
            weight:
              fetchedOrder.products?.reduce(
                (sum, p) => sum + (p.weight || 1),
                0
              ) || 2,
            payment_type: fetchedOrder.isPaid ? "PREPAID" : "COD",
            cod_amount: fetchedOrder.isPaid ? 0 : fetchedOrder.finalAmount,
            num_pieces: fetchedOrder.products?.length || 1,
            customer_reference_number: order._id,
            origin_address_name: warehouseAddress.name,
            origin_address_mob_no_country_code:
              warehouseAddress.mob_no_country_code || "971",
            origin_address_mobile_number: warehouseAddress.mobile_number,
            origin_address_house_no: warehouseAddress.house_no,
            origin_address_building_name: warehouseAddress.building_name,
            origin_address_area: warehouseAddress.area,
            origin_address_landmark: warehouseAddress.landmark,
            origin_address_city: warehouseAddress.city,
            origin_address_type: warehouseAddress.address_type || "Normal",
            destination_address_name: buyerAddress.name || "Unknown Recipient",
            destination_address_mob_no_country_code:
              buyerAddress.mob_no_country_code || "971",
            destination_address_mobile_number:
              buyerAddress.mobile_number || "50186403",
            destination_address_house_no: buyerAddress.house_no || "48",
            destination_address_building_name:
              buyerAddress.building_name || "Default Building",
            destination_address_area: buyerAddress.area || "Default Area",
            destination_address_landmark:
              buyerAddress.landmark || "Default Landmark",
            destination_address_city: buyerAddress.city || "Dubai",
            destination_address_type: buyerAddress.address_type || "Normal",
            pickup_date,
            pickup_time,
          };

          const jeeblyResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create`,
            shipmentPayload,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (jeeblyResponse.data.awbNo) {
            processingDetails.deliveryDetails = {
              ...processingDetails.deliveryDetails,
              trackingNumber: jeeblyResponse.data.awbNo,
              deliveryStatus: "Scheduled For Delivery",
              deliveryStatusHistory: [
                ...processingDetails.deliveryDetails.deliveryStatusHistory,
                { status: "Scheduled For Delivery", timestamp: new Date() },
              ],
            };
            const orderStatus = "Pickup Scheduled For Delivery";
            currentOrderStatusHistory.push({
              status: orderStatus,
              timestamp: new Date(),
            });
            await onUpdateStatus(
              order._id,
              orderStatus,
              processingDetails,
              null,
              currentOrderStatusHistory
            );
            setDeliveryDetails({
              trackingNumber: jeeblyResponse.data.awbNo,
              deliveryStatus: "Scheduled For Delivery",
            });
            setOrderStatusHistory(currentOrderStatusHistory);
            alert("Delivery started with AWB #" + jeeblyResponse.data.awbNo);
          } else {
            throw new Error("AWB not received from Jeebly for delivery");
          }
        } else {
          setError("Please select quality result and main category for pass");
          setLoading(false);
          return;
        }
      }

      if (activeStep < filteredSteps.length - 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(
        `Status update failed. Please try again. Details: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files.map((file) => URL.createObjectURL(file)));
  };

  const openWarehouseModal = () => setShowWarehouseModal(true);
  const closeWarehouseModal = () => setShowWarehouseModal(false);
  const handleSelectWarehouse = (id) => {
    const selected = warehouses.find((wh) => wh._id === id);
    if (selected) {
      setSelectedWarehouseId(id);
      setWarehouseAddress(selected);
    }
    closeWarehouseModal();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-5xl relative max-h-[90vh] flex flex-col">
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Process Order #{order._id}
              </h2>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />$
                  {order.finalAmount.toFixed(2)}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {order?.buyerName || "Unknown Buyer"}
                </span>
              </div>
            </div>

            {/* Steps Table */}
            <div className="mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-2 px-4 bg-gray-100 font-semibold">
                      Step
                    </th>
                    <th className="py-2 px-4 bg-gray-100 font-semibold">
                      Sub-Steps
                    </th>
                    <th className="py-2 px-4 bg-gray-100 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSteps.map((step, index) => {
                    const StepIcon = step.icon;

                    const deliveryStepIndex = filteredSteps.findIndex(
                      (s) => s.id === "delivery_team"
                    );
                    const isDeliveryStepCompleted =
                      deliveryStepIndex === index && isDeliveryCompleted();
                    const isCompleted =
                      index < activeStep || isDeliveryStepCompleted;
                    const isActive = index === activeStep;

                    return (
                      <tr
                        key={step.id}
                        className={`${
                          isActive
                            ? "bg-blue-50"
                            : isCompleted
                            ? "bg-green-50"
                            : index % 2 === 0
                            ? "bg-gray-50"
                            : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <StepIcon size={24} className="mr-2" />
                            <div>
                              <div className="font-medium">{step.title}</div>
                              <div className="text-xs text-gray-500">
                                {step.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <ul className="text-sm space-y-1">
                            {step.subSteps.map((subStep, subIndex) => (
                              <li key={subIndex} className="flex items-center">
                                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                                {subStep}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-4">
                          {isCompleted ? (
                            <CheckCircle className="text-green-500" size={24} />
                          ) : isActive ? (
                            <Loader2
                              className="animate-spin text-blue-600"
                              size={24}
                            />
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

            {/* Current Step Form */}
            <div className="bg-gray-50 p-6 rounded-lg mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {filteredSteps[activeStep]?.title || "Process Complete"}
              </h3>
              <p className="text-gray-600 mb-6">
                {filteredSteps[activeStep]?.description ||
                  "All steps have been successfully completed."}
              </p>

              {/* Customer Care */}
              {filteredSteps[activeStep]?.id === "customer_care" && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Seller Contact & Confirmation
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Status
                      </label>
                      <select
                        value={customerCare.confirmationStatus}
                        onChange={(e) =>
                          setCustomerCare((prev) => ({
                            ...prev,
                            confirmationStatus: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select status</option>
                        <option value="contacted">Seller Contacted</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seller Contacted Date
                      </label>
                      <input
                        type="date"
                        value={customerCare.date}
                        onChange={(e) =>
                          setCustomerCare((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contacted Time
                      </label>
                      <input
                        type="time"
                        value={customerCare.time}
                        onChange={(e) =>
                          setCustomerCare((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seller Pickup Location
                      </label>
                      <input
                        type="text"
                        value={customerCare.location}
                        onChange={(e) =>
                          setCustomerCare((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter seller pickup location"
                      />
                    </div>

                    {/* Warehouse only for Listing */}
                    {!kukitOrder && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Warehouse
                        </label>
                        <button
                          onClick={openWarehouseModal}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
                        >
                          <span>
                            {selectedWarehouseId
                              ? `${warehouseAddress.name || ""} (${
                                  warehouseAddress.city || ""
                                })`
                              : "Select warehouse"}
                          </span>
                          <MapPin size={20} />
                        </button>
                        {selectedWarehouseId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Selected: {warehouseAddress.name || ""},{" "}
                            {warehouseAddress.house_no || ""},{" "}
                            {warehouseAddress.building_name || ""},{" "}
                            {warehouseAddress.landmark || ""},{" "}
                            {warehouseAddress.city || ""},{" "}
                            {warehouseAddress.city || ""}, +
                            {warehouseAddress.mob_no_country_code}{" "}
                            {warehouseAddress.mobile_number},{" "}
                            {warehouseAddress.email || ""}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pickup Team – Only for Listing */}
              {filteredSteps[activeStep]?.id === "pickup_team" &&
                !kukitOrder && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                        Pickup Tracking
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            AWB Number
                          </label>
                          <input
                            type="text"
                            value={pickupDetails.awbNumber}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Status
                          </label>
                          <input
                            type="text"
                            value={pickupDetails.pickupStatus}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                          />
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Note: Pickup is handled by Jeebly. Status will
                        auto-update via webhook.
                      </p>
                    </div>
                  </div>
                )}

              {/* Quality Check */}
              {filteredSteps[activeStep]?.id === "quality_check" && (
                <div className="space-y-6">
                  {/* Product Details Card */}
                  {order?.products?.map((item, idx) => {
                    const product = item.product;
                    if (!product) return null;

                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 shadow-sm"
                      >
                        <h4 className="text-lg font-bold text-indigo-800 mb-4 flex items-center">
                          <Package className="w-5 h-5 mr-2" />
                          Product Details (Quality Inspection)
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left: Image + Key Info */}
                          <div className="space-y-4">
                            {/* Product Images */}
                            {product.images && product.images.length > 0 && (
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.images.slice(0, 3).map((img, i) => (
                                  <img
                                    key={i}
                                    src={img}
                                    alt={`Product ${i + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                                  />
                                ))}
                                {product.images.length > 3 && (
                                  <div className="w-24 h-24 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
                                    +{product.images.length - 3}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Key Info */}
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">
                                  Name:
                                </span>
                                <span className="text-gray-900">
                                  {product.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">
                                  Brand:
                                </span>
                                <span className="text-gray-900">
                                  {product.brand?.brandName || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">
                                  Size:
                                </span>
                                <span className="text-gray-900">
                                  {product.size?.sizeName || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">
                                  Condition:
                                </span>
                                <span className="text-gray-900">
                                  {product.condition?.conditionName || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-700">
                                  Color:
                                </span>
                                <span className="text-gray-900">
                                  {product.color?.colorName || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Category + Seller Info */}
                          <div className="space-y-4">
                            {/* Category */}
                            <div>
                              <p className="font-medium text-gray-700 mb-1">
                                Category:
                              </p>
                              <p className="text-sm text-gray-900">
                                {product.category?.parentCategory} &gt;{" "}
                                {product.category?.categoryName}{" "}
                                {product.category?.subCategoryName &&
                                  `&gt; ${product.category.subCategoryName}`}
                              </p>
                            </div>

                            {/* Seller */}
                            <div>
                              <p className="font-medium text-gray-700 mb-1">
                                Seller:
                              </p>
                              <p className="text-sm text-gray-900">
                                {product.seller?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.seller?.phone || ""}
                              </p>
                            </div>

                            {/* Pickup Address */}
                            {product.pickupAddress && (
                              <div>
                                <p className="font-medium text-gray-700 mb-1 flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" /> Pickup
                                  From:
                                </p>
                                <p className="text-xs text-gray-600">
                                  {product.pickupAddress.house_no &&
                                    `${product.pickupAddress.house_no}, `}
                                  {product.pickupAddress.building_name}
                                  {product.pickupAddress.area &&
                                    `, ${product.pickupAddress.area}`}
                                  {product.pickupAddress.city &&
                                    `, ${product.pickupAddress.city}`}
                                </p>
                              </div>
                            )}

                            {/* Description */}
                            {product.description && (
                              <div>
                                <p className="font-medium text-gray-700 mb-1">
                                  Description:
                                </p>
                                <p className="text-xs text-gray-600 italic line-clamp-2">
                                  {product.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Barcode & Type */}
                        <div className="mt-4 pt-4 border-t border-indigo-200 flex justify-between text-xs">
                          <div>
                            <span className="font-medium text-gray-700">
                              Barcode:
                            </span>{" "}
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {product.barcode || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Type:
                            </span>{" "}
                            <span className="capitalize">
                              {product.productType || "N/A"}
                            </span>
                          </div>
                          {item.isRental && (
                            <div className="text-green-600 font-medium">
                              Rental Order
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-3">
                      Quality Result
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {["Pass", "Fail"].map((result) => (
                        <label
                          key={result}
                          className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="qualityResult"
                            value={result}
                            checked={qualityResult === result}
                            onChange={(e) => setQualityResult(e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="text-sm font-medium">{result}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {qualityResult === "Pass" && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-3">
                          Product Type (Auto-detected)
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {(() => {
                            // Auto-detect from order products
                            const detectedType =
                              order?.products?.[0]?.product?.productType ||
                              "Listing";
                            const isRentalOrder =
                              order?.products?.some((p) => p.isRental) || false;

                            // Auto-set on first render if not already set
                            if (!mainCategory && detectedType) {
                              setTimeout(() => {
                                setMainCategory(detectedType);
                                setIsRenting(isRentalOrder);
                              }, 0);
                            }

                            return (
                              <div className="col-span-2">
                                <div
                                  className={`p-3 rounded-lg border-2 font-medium bg-blue-600 text-white border-blue-600`}
                                >
                                  {detectedType}
                                </div>
                                {isRentalOrder && (
                                  <div className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-300">
                                    <label className="flex items-center space-x-3">
                                      <input
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        className="w-5 h-5 text-green-600 rounded"
                                      />
                                      <span className="font-medium text-gray-800">
                                        Renting (Auto-detected)
                                      </span>
                                    </label>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                      {/* Warehouse in QC for ALL */}
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-medium text-indigo-800 mb-3 flex items-center">
                          Warehouse Selection
                        </h4>
                        <button
                          onClick={openWarehouseModal}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
                        >
                          <span>
                            {selectedWarehouseId
                              ? `${warehouseAddress.name || ""} (${
                                  warehouseAddress.city || ""
                                })`
                              : "Select warehouse"}
                          </span>
                          <MapPin size={20} />
                        </button>
                        {selectedWarehouseId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Selected: {warehouseAddress.name || ""},{" "}
                            {warehouseAddress.house_no || ""},{" "}
                            {warehouseAddress.building_name || ""},{" "}
                            {warehouseAddress.landmark || ""},{" "}
                            {warehouseAddress.city || ""},{" "}
                            {warehouseAddress.city || ""}, +
                            {warehouseAddress.mob_no_country_code}{" "}
                            {warehouseAddress.mobile_number},{" "}
                            {warehouseAddress.email || ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {qualityResult === "Fail" && (
                    <div className="space-y-4">
                      {/* Auto-detect product type for Fail */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-3">
                          Product Type (Auto-detected)
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {(() => {
                            // Auto-detect from order products
                            const detectedType =
                              order?.products?.[0]?.product?.productType ||
                              "Listing";
                            const isRentalOrder =
                              order?.products?.some((p) => p.isRental) || false;

                            // Auto-set on first render if not already set
                            if (!mainCategory && detectedType) {
                              setTimeout(() => {
                                setMainCategory(detectedType);
                                setIsRenting(isRentalOrder);
                              }, 0);
                            }

                            return (
                              <div className="col-span-2">
                                <div
                                  className={`p-3 rounded-lg border-2 font-medium bg-blue-600 text-white border-blue-600`}
                                >
                                  {detectedType}
                                </div>
                                {isRentalOrder && (
                                  <div className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-300">
                                    <label className="flex items-center space-x-3">
                                      <input
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        className="w-5 h-5 text-green-600 rounded"
                                      />
                                      <span className="font-medium text-gray-800">
                                        Renting (Auto-detected)
                                      </span>
                                    </label>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-medium text-red-800 mb-3">
                          Reason for Rejection
                        </h4>
                        <textarea
                          placeholder="Enter reason for rejection"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      {/* Warehouse in QC Fail */}
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-medium text-indigo-800 mb-3 flex items-center">
                          Warehouse for Reverse Shipment
                        </h4>
                        <button
                          onClick={openWarehouseModal}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
                        >
                          <span>
                            {selectedWarehouseId
                              ? `${warehouseAddress.name || ""} (${
                                  warehouseAddress.city || ""
                                })`
                              : "Select warehouse"}
                          </span>
                          <MapPin size={20} />
                        </button>
                        {selectedWarehouseId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Selected: {warehouseAddress.name || ""},{" "}
                            {warehouseAddress.house_no || ""},{" "}
                            {warehouseAddress.building_name || ""},{" "}
                            {warehouseAddress.landmark || ""},{" "}
                            {warehouseAddress.city || ""},{" "}
                            {warehouseAddress.city || ""}, +
                            {warehouseAddress.mob_no_country_code}{" "}
                            {warehouseAddress.mobile_number},{" "}
                            {warehouseAddress.email || ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Team */}
              {filteredSteps[activeStep]?.id === "delivery_team" && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-3 flex items-center">
                      Delivery Tracking
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          AWB Number
                        </label>
                        <input
                          type="text"
                          value={
                            order.orderStatus.startsWith("QC-Rejected")
                              ? qcRejectedDetails.trackingNumber
                              : deliveryDetails.trackingNumber
                          }
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Status
                        </label>
                        <input
                          type="text"
                          value={
                            order.orderStatus.startsWith("QC-Rejected")
                              ? qcRejectedDetails.rejectedStatus
                              : deliveryDetails.deliveryStatus
                          }
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Note: Delivery is handled by Jeebly. Status will
                      auto-update via webhook.
                    </p>
                  </div>
                </div>
              )}

              {/* Photo Upload */}
              {filteredSteps[activeStep]?.fields.includes("photos") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photos
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload files</span>
                        <input
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handlePhotoUpload}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                  {photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={loading || activeStep >= filteredSteps.length}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  `Complete ${filteredSteps[activeStep]?.title || "Process"}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <WarehouseModal
        isOpen={showWarehouseModal}
        onClose={closeWarehouseModal}
        warehouses={warehouses}
        onSelectWarehouse={handleSelectWarehouse}
      />
    </>
  );
};

export default OrderModel;
