import React from "react";

const KukuWarehousesAddEditModal = ({ isOpen, onClose, formData, onInputChange, onSubmit, selectedWarehouse, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">
          {selectedWarehouse ? "Edit Warehouse" : "Add Warehouse"}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">WareHouse Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="w-full sm:w-1/3">
              <label className="block text-sm font-medium text-gray-700">Country Code</label>
              <input
                type="text"
                name="mob_no_country_code"
                value={formData.mob_no_country_code}
                onChange={onInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>
            <div className="w-full sm:w-2/3">
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={onInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="w-full sm:w-1/3">
              <label className="block text-sm font-medium text-gray-700">Alt. Country Code</label>
              <input
                type="text"
                name="alt_ph_country_code"
                value={formData.alt_ph_country_code}
                onChange={onInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="w-full sm:w-2/3">
              <label className="block text-sm font-medium text-gray-700">Alternate Phone</label>
              <input
                type="text"
                name="alternate_phone"
                value={formData.alternate_phone}
                onChange={onInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">House No</label>
            <input
              type="text"
              name="house_no"
              value={formData.house_no}
              onChange={onInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Building Name</label>
            <input
              type="text"
              name="building_name"
              value={formData.building_name}
              onChange={onInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Area</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={onInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Landmark</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={onInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={onInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            >
              {[
                "Abu Dhabi",
                "Ajman",
                "Al-Ain",
                "Dubai",
                "Fujairah",
                "Ras Al Khaimah",
                "Sharjah",
                "Umm Al-Quwain",
              ].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address Type</label>
            <select
              name="address_type"
              value={formData.address_type}
              onChange={onInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            >
              {["Normal", "Western"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={onInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Set as Default</span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? "Saving..." : selectedWarehouse ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KukuWarehousesAddEditModal;