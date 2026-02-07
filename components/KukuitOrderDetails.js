import { X } from "lucide-react";

const KukuitOrderDetails = ({ selectedKukuit }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Seller Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <p className="font-medium">{selectedKukuit?.seller?.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-medium">{selectedKukuit?.seller?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <p className="font-medium">{selectedKukuit?.seller?.phone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Number of Items</label>
              <p className="font-medium">{selectedKukuit?.numberOfItems}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pickup Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Pickup Location</label>
              <p className="font-medium">
                {selectedKukuit?.pickupLocation?.house_no},{" "}
                {selectedKukuit?.pickupLocation?.building_name},{" "}
                {selectedKukuit?.pickupLocation?.landmark},{" "}
                {selectedKukuit?.pickupLocation?.area},{" "}
                {selectedKukuit?.pickupLocation?.city},{" "}
                {selectedKukuit?.pickupLocation?.country}
              </p>
            </div>
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default KukuitOrderDetails;