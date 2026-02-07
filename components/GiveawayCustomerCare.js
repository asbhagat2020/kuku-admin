// components/giveaway/GiveawayCustomerCare.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Phone, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import WarehouseModal from "./WarehouseModal";

const GiveawayCustomerCare = ({ giveaway, setCurrentStage, refresh }) => {
  const [form, setForm] = useState({
    action: "",
    date: "",
    time: "",
    rejectionReason: "",
  });
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.otp?.token);

  // Determine if stage is complete
  const isStageComplete =
    giveaway?.giveawayProcessingDetails?.customerCare?.confirmationStatus ===
      "approved" ||
    giveaway?.giveawayProcessingDetails?.customerCare?.confirmationStatus ===
      "rejected";

  // Build history
  let customerCareHistory =
    giveaway?.giveawayProcessingDetails?.customerCare
      ?.confirmationStatusHistory || [];
  if (
    customerCareHistory.length === 0 &&
    giveaway?.giveawayProcessingDetails?.customerCare?.confirmationStatus
  ) {
    customerCareHistory = [
      {
        status:
          giveaway.giveawayProcessingDetails.customerCare.confirmationStatus,
        timestamp:
          giveaway.giveawayProcessingDetails.customerCare.assignedDate ||
          new Date().toISOString(),
        _id: "current",
      },
    ];
  }

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/warehouse`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWarehouses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWarehouses();

    const p = giveaway.giveawayProcessingDetails?.customerCare;
    if (p?.date) setForm((f) => ({ ...f, date: p.date, time: p.time }));
    if (giveaway.giveawayProcessingDetails?.warehouseId) {
      setSelectedWarehouseId(giveaway.giveawayProcessingDetails.warehouseId);
    }
  }, [giveaway, token]);

  useEffect(() => {
    if (selectedWarehouseId && warehouses.length > 0) {
      const selected = warehouses.find((wh) => wh._id === selectedWarehouseId);
      if (selected) setWarehouseAddress(selected);
    }
  }, [selectedWarehouseId, warehouses]);

  //   const calculatePickupDate = () => {
  //     const now = new Date();
  //     const dubaiTime = new Date(now.getTime() + (4 * 60 - now.getTimezoneOffset()) * 60000);
  //     let date = new Date(dubaiTime);
  //     if (dubaiTime.getHours() >= 16) date.setDate(date.getDate() + 1);
  //     while (date.getDay() === 0) date.setDate(date.getDate() + 1);
  //     return {
  //       pickup_date: date.toISOString().split("T")[0],
  //       pickup_time: "09:00",
  //     };
  //   };

  const calculatePickupDate = () => {
    const now = new Date();

    // Convert to Dubai time (UTC+4)
    const dubaiOffset = 4 * 60; // minutes
    const localOffset = now.getTimezoneOffset(); // local offset in minutes
    const dubaiTime = new Date(
      now.getTime() + (dubaiOffset - localOffset) * 60000
    );

    let pickupDate = new Date(dubaiTime);

    // If after 4 PM Dubai time → go to next day
    if (dubaiTime.getHours() >= 16) {
      pickupDate.setDate(pickupDate.getDate() + 1);
    }

    // Skip Sundays (0 = Sunday)
    while (pickupDate.getDay() === 0) {
      pickupDate.setDate(pickupDate.getDate() + 1);
    }

    // Format
    const year = pickupDate.getFullYear();
    const month = String(pickupDate.getMonth() + 1).padStart(2, "0");
    const day = String(pickupDate.getDate()).padStart(2, "0");

    return {
      pickup_date: `${year}-${month}-${day}`,
      pickup_time: "09:00",
    };
  };

  const handleSubmit = async () => {
    if (!form.date) return setError("Please select a contacted date");
    if (!form.time) return setError("Please select a contacted time");
    if (form.action === "approve" && !selectedWarehouseId) {
      setError("Please select a warehouse first");
      setShowModal(true);
      return;
    }
    if (form.action === "reject" && !form.rejectionReason.trim())
      return setError("Please enter a rejection reason");

    setLoading(true);
    setError("");
    try {
      if (form.action === "reject") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/giveaways/reject-request/${giveaway._id}`,
          { rejectionReason: form.rejectionReason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/giveaways/approve-request/${giveaway._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { pickup_date, pickup_time } = calculatePickupDate();
        const pickup = giveaway.pickupLocation || {};
        const payload = {
          delivery_type: "Next Day",
          load_type: "Non-document",
          consignment_type: "REVERSE",
          description: `Giveaway #${giveaway.barcode}`,
          weight: giveaway.numberOfItems || 1,
          payment_type: "PREPAID",
          cod_amount: 0,
          num_pieces: giveaway.numberOfItems || 1,
          customer_reference_number: giveaway._id,
          origin_address_name: giveaway.seller?.name || "Unknown",
          origin_address_mob_no_country_code:
            pickup.mob_no_country_code || "971",
          origin_address_mobile_number:
            pickup.mobile_number || giveaway.seller?.phone || "501234567",
          origin_address_house_no: pickup.house_no || "",
          origin_address_building_name: pickup.building_name || "",
          origin_address_area: pickup.area || "",
          origin_address_landmark: pickup.landmark || "",
          origin_address_city: pickup.city || "Dubai",
          origin_address_type: "Normal",
          destination_address_name: warehouseAddress.name || "Kuku Warehouse",
          destination_address_mob_no_country_code: "971",
          destination_address_mobile_number:
            warehouseAddress.mobile_number || "501234567",
          destination_address_house_no: warehouseAddress.house_no || "",
          destination_address_building_name:
            warehouseAddress.building_name || "",
          destination_address_area: warehouseAddress.area || "",
          destination_address_landmark: warehouseAddress.landmark || "",
          destination_address_city: warehouseAddress.city || "Dubai",
          destination_address_type: "Normal",
          pickup_date, // ← String from calculatePickupDate
          pickup_time,
          warehouseId: selectedWarehouseId,
        };

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shipment/reverse/giveaway`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.awbNo) {
          setCurrentStage("pickup");
        }
      }
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Customer Care Processing
      </h3>

      {/* Status Badges */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Care Status
          </label>
          <p className="font-medium">
            {giveaway?.giveawayProcessingDetails?.customerCare
              ?.confirmationStatus || "Pending"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Status
          </label>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              giveaway?.status === "Collected"
                ? "bg-green-100 text-green-800"
                : giveaway?.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {giveaway?.status || "Pending"}
          </span>
        </div>
      </div>

      {/* Form - Only if not complete */}
      {!isStageComplete && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Seller Contact & Confirmation
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {/* Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Status
              </label>
              <select
                value={form.action}
                onChange={(e) => setForm({ ...form, action: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select status</option>
                <option value="approve">Approve</option>
                <option value="reject">Reject</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacted Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contacted Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Warehouse Selection */}
            {form.action === "approve" && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Warehouse
                </label>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between focus:ring-blue-500 focus:border-blue-500"
                >
                  <span>
                    {selectedWarehouseId
                      ? `${warehouseAddress.name || ""} (${
                          warehouseAddress.city || ""
                        }, ${warehouseAddress.country || ""})`
                      : "Select warehouse"}
                  </span>
                  <MapPin size={20} />
                </button>
                {selectedWarehouseId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected:{" "}
                    {[
                      warehouseAddress.name,
                      warehouseAddress.house_no,
                      warehouseAddress.building_name,
                      warehouseAddress.landmark,
                      warehouseAddress.area,
                      warehouseAddress.city,
                      warehouseAddress.country,
                      `+${warehouseAddress.mob_no_country_code} ${warehouseAddress.mobile_number}`,
                      warehouseAddress.email,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}

            {/* Rejection Reason */}
            {form.action === "reject" && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  placeholder="Enter reason for rejection"
                  value={form.rejectionReason}
                  onChange={(e) =>
                    setForm({ ...form, rejectionReason: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* History */}
      {customerCareHistory.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="text-md font-medium mb-2 text-gray-800">
            Customer Care History
          </h4>
          <ul className="space-y-2">
            {customerCareHistory.map((item) => (
              <li
                key={item._id}
                className="text-sm text-gray-600 flex justify-between"
              >
                <span>{item.status.replace(/_/g, " ").toUpperCase()}</span>
                <span className="text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center mt-4">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end mt-4 space-x-3">
        {!isStageComplete && form.action && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400 flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              `${form.action.charAt(0).toUpperCase() + form.action.slice(1)}`
            )}
          </button>
        )}
        {isStageComplete &&
          giveaway?.giveawayProcessingDetails?.customerCare
            ?.confirmationStatus === "approved" && (
            <button
              onClick={() => setCurrentStage("pickup")}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 flex items-center"
            >
              Next: Pickup
            </button>
          )}
      </div>

      {/* Warehouse Modal */}
      <WarehouseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        warehouses={warehouses}
        onSelectWarehouse={(id) => {
          setSelectedWarehouseId(id);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default GiveawayCustomerCare;
