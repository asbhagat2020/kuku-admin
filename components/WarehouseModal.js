import React from "react";
import { X, MapPin, Phone, FileText } from "lucide-react";

const WarehouseModal = ({ isOpen, onClose, warehouses, onSelectWarehouse }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Select Warehouse
          </h3>
          <div className="space-y-4">
            {warehouses.map((wh) => (
              <div
                key={wh._id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectWarehouse(wh._id)}
              >
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {wh.name} ({wh.city}, {wh.country})
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {wh.house_no}, {wh.building_name}, {wh.area}, Near {wh.landmark}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Phone size={14} className="mr-1" />
                        +{wh.mob_no_country_code} {wh.mobile_number}
                      </span>
                      <span className="flex items-center">
                        <FileText size={14} className="mr-1" />
                        {wh.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectWarehouse(wh._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-auto"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
            {warehouses.length === 0 && (
              <p className="text-center text-gray-500 py-8">No warehouses available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseModal;