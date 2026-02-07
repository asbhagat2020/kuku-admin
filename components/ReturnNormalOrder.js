

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

const ReturnNormalOrder = ({ isOpen, onClose, order, onUpdateReturnStatus }) => {
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

  // Exit if no returnProcessingDetails
  // if (!isOpen || !order?.returnProcessingDetails) return null;

  // const rp = order.returnProcessingDetails;

  const rp = order?.returnProcessingDetails || null;

  const steps = useMemo(
    () => [
      {
        id: "customer_care",
        title: "Customer Care",
        icon: Users,
        description: "Approve/Reject & Assign",
        permission: "CustomerCare",
      },
      {
        id: "pickup_team",
        title: "Pickup from Buyer",
        icon: Box,
        description: "Jeebly picks up from buyer",
        permission: "PickedOrders",
      },
      {
        id: "quality_check",
        title: "Quality Check",
        icon: ClipboardCheck,
        description: "Inspect & mark Pass/Fail",
        permission: "QualityCheck",
      },
      {
        id: "delivery_team",
        title: "Delivery to Seller",
        icon: Truck,
        description: "Jeebly delivers to seller",
        permission: "Delivered",
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
      title: "Return Completed",
      icon: CheckCircle,
      description: "Item delivered to seller",
    };
    return [...filteredSteps, completeStep];
  }, [filteredSteps]);

  // Fetch Permissions, Warehouses
  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(Cookies.get("token"));

      try {
        const permRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get-permissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserPermissions(permRes.data.permissions);
        setIsSuperAdmin(permRes.data.superAdmin);

        const whRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/warehouse`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWarehouses(whRes.data);
      } catch (err) {
        setError("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // Load existing data from order
  useEffect(() => {
    if (rp?.customerCare?.confirmationStatus) {
      setCustomerCareDecision(rp.customerCare.confirmationStatus);
    }
    if (rp?.qualityCheck?.qualityCheckProof?.[0]) {
      const qc = rp.qualityCheck.qualityCheckProof[0];
      setQualityResult(qc.status);
      setRejectionReason(qc.desc || "");
      setPhotos(qc.images || []);
    }
    if (rp?.warehouseId) {
      setSelectedWarehouseId(rp.warehouseId);
    }
  }, [rp]);

  useEffect(() => {
    if (selectedWarehouseId && warehouses.length > 0) {
      const selected = warehouses.find((wh) => wh._id === selectedWarehouseId);
      if (selected) setWarehouseAddress(selected);
    }
  }, [selectedWarehouseId, warehouses]);

  // AUTO JUMP LOGIC - FULLY FIXED (NO DUPLICATES)
  useEffect(() => {
    if (!rp) return;

    // 1. Customer Care Pending
    if (!rp.customerCare?.confirmationStatus) {
      setActiveStep(0);
      return;
    }

    // 2. Rejected
    if (rp.customerCare.confirmationStatus === "Reject") {
      setActiveStep(-1);
      return;
    }

    // 6. FIRST CHECK: Delivered to Seller → Complete (MOVED UP)
    if (
      rp.sellerDelivery?.deliveryStatus === "Delivered to Seller" ||
      rp.sellerDelivery?.deliveryStatus === "Return Delivered to Seller"
    ) {
      setActiveStep(filteredSteps.length); // Complete step index
      return;
    }

    // 3. Pickup Scheduled → Pickup Team
    if (
      rp.customerCare.confirmationStatus === "Approve" &&
      rp.buyerPickup?.trackingNumber &&
      !rp.buyerPickup?.pickedUpAt &&
      rp.buyerPickup?.pickupStatus !== "Delivered to Warehouse"
    ) {
      setActiveStep(1);
      return;
    }

    // 4. Delivered to Warehouse → Quality Check
    if (
      rp.buyerPickup?.pickupStatus === "Delivered to Warehouse" &&
      (!rp.qualityCheck?.qualityCheckProof?.[0]?.images?.length || !rp.qualityCheck?.qualityResult)
    ) {
      setActiveStep(2);
      return;
    }

    // 5. QC Done + Forward Shipment Created → Delivery Team
    if (
      rp.qualityCheck?.qualityCheckProof?.[0]?.images?.length > 0 &&
      rp.qualityCheck?.qualityResult &&
      rp.sellerDelivery?.trackingNumber &&
      rp.sellerDelivery?.deliveryStatus !== "Delivered to Seller"
    ) {
      setActiveStep(3);
      return;
    }

    // Default
    setActiveStep(0);
  }, [rp, filteredSteps.length]);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    const currentStep = filteredSteps[activeStep];
    const token = JSON.parse(Cookies.get("token"));
    const adminId = JSON.parse(Cookies.get("user"))._id;

    try {
      // STEP 1: Customer Care
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
            description: `Return Pickup #${order._id}`,
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
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create-return-reverse`,
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

        await onUpdateReturnStatus(order._id, "Return In Progress", updateData);
        alert(`Return ${customerCareDecision === "Approve" ? "Approved" : "Rejected"}`);
        if (customerCareDecision === "Approve") {
          setActiveStep(1);
        } else {
          onClose();
        }
      }

      // STEP 3: Quality Check (PASS OR FAIL → BOTH CREATE FORWARD SHIPMENT)
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

        // CREATE FORWARD SHIPMENT FOR BOTH PASS & FAIL
        const sellerAddress = order.products[0]?.product?.pickupAddress || {};
        const { pickup_date, pickup_time } = calculatePickupDate();

        const description = qualityResult === "Pass"
          ? `QC Passed - Return to Seller #${order._id}`
          : `QC Failed - Return to Seller #${order._id}`;

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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/create-return-forword`,
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

        await onUpdateReturnStatus(order._id, "Return In Progress", updateData);
        alert(`QC: ${qualityResult} - Forward shipment created (AWB: ${res.data.awbNo})`);
        setActiveStep(3); // AUTO JUMP TO DELIVERY TEAM
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // const calculatePickupDate = () => {
  //   const now = new Date();
  //   const dubaiTime = new Date(now.getTime() + (4 * 60 - now.getTimezoneOffset()) * 60000);
  //   let pickupDate = new Date(dubaiTime);
  //   if (dubaiTime.getHours() >= 16) pickupDate.setDate(pickupDate.getDate() + 1);
  //   while (pickupDate.getDay() === 0) pickupDate.setDate(pickupDate.getDate() + 1);
  //   return {
  //     pickup_date: pickupDate.toISOString().split("T")[0],
  //     pickup_time: "09:00",
  //   };
  // };

const calculatePickupDate = () => {
  const now = new Date();
  const dubaiOffset = 4 * 60; // GST = UTC+4
  const localOffset = now.getTimezoneOffset();
  const dubaiTime = new Date(now.getTime() + (dubaiOffset + localOffset) * 60 * 1000);

  let pickupDate = new Date(dubaiTime);
  pickupDate.setHours(9, 0, 0, 0); // Set to 9 AM

  // If after 4 PM → next day
  if (dubaiTime.getHours() >= 16) {
    pickupDate.setDate(pickupDate.getDate() + 1);
  }

  // Skip Sundays
  while (pickupDate.getDay() === 0) {
    pickupDate.setDate(pickupDate.getDate() + 1);
  }

  return {
    pickup_date: pickupDate.toISOString().split("T")[0],
    pickup_time: "09:00",
  };
};

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

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
                Process Return #{order._id}
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
                  {order.buyer?.name || order.buyerName || "Unknown Buyer"}
                </span>
              </div>
            </div>

            {/* Steps Table - NOW USING allSteps */}
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
                {activeStep === allSteps.length - 1 ? "Return Completed ✅" : filteredSteps[activeStep]?.title || "Process Complete"}
              </h3>

              {/* Show completion message when done */}
              {activeStep === allSteps.length - 1 && (
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="text-green-600 mr-3" size={32} />
                    <div>
                      <h4 className="font-semibold text-green-800 text-lg">Return Successfully Completed!</h4>
                      <p className="text-green-700 text-sm mt-1">Item has been delivered back to the seller.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-3 rounded border border-green-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Buyer Pickup AWB</label>
                      <p className="text-sm font-mono text-gray-800">{rp.buyerPickup?.trackingNumber || "N/A"}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Seller Delivery AWB</label>
                      <p className="text-sm font-mono text-gray-800">{rp.sellerDelivery?.trackingNumber || "N/A"}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Quality Result</label>
                      <p className={`text-sm font-medium ${rp.qualityCheck?.qualityResult === "Pass" ? "text-green-600" : "text-red-600"}`}>
                        {rp.qualityCheck?.qualityResult || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Final Status</label>
                      <p className="text-sm font-medium text-gray-800">{rp.sellerDelivery?.deliveryStatus || "Delivered"}</p>
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
                      <input type="text" value={rp.buyerPickup?.trackingNumber || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Status</label>
                      <input type="text" value={rp.buyerPickup?.pickupStatus || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Note: Pickup is handled by Jeebly. Status will auto-update via webhook.</p>
                </div>
              )}

              {/* Quality Check */}
              {filteredSteps[activeStep]?.id === "quality_check" && (
                <div className="space-y-6">
                  {/* Warehouse Selection */}
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

                  {/* Photos */}
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

                  {/* Quality Result */}
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

                  {/* Rejection Reason */}
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
                      <input type="text" value={rp.sellerDelivery?.trackingNumber || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                      <input type="text" value={rp.sellerDelivery?.deliveryStatus || ""} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
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

export default ReturnNormalOrder;