import React from "react";

const KukuWareHouseDetailViewModal = ({ isOpen, onClose, warehouse }) => {
  if (!isOpen || !warehouse) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Warehouse Details</h3>
        <div className="space-y-3 text-sm sm:text-base">
          <p><strong>WareHouse Name:</strong> {warehouse.name}</p>
          <p>
            <strong>Mobile:</strong> {warehouse.mob_no_country_code} {warehouse.mobile_number}
          </p>
          {warehouse.alt_ph_country_code && warehouse.alternate_phone && (
            <p>
              <strong>Alternate Phone:</strong> {warehouse.alt_ph_country_code} {warehouse.alternate_phone}
            </p>
          )}
          <p><strong>House No:</strong> {warehouse.house_no}</p>
          <p><strong>Building Name:</strong> {warehouse.building_name}</p>
          <p><strong>Area:</strong> {warehouse.area}</p>
          <p><strong>Landmark:</strong> {warehouse.landmark}</p>
          <p><strong>City:</strong> {warehouse.city}</p>
          <p><strong>Address Type:</strong> {warehouse.address_type}</p>
          <p><strong>Email:</strong> {warehouse.email || "N/A"}</p>
          <p><strong>Country:</strong> {warehouse.country}</p>
          {/* <p>
            <strong>Created At:</strong>{" "}
            {new Date(warehouse.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(warehouse.updatedAt).toLocaleString()}
          </p> */}
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default KukuWareHouseDetailViewModal;