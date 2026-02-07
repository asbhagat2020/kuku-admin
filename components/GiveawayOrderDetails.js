// components/giveaway/GiveawayOrderDetails.jsx
import { X } from "lucide-react";

const GiveawayOrderDetails = ({ giveaway }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Seller Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Seller Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <p className="font-medium">{giveaway?.seller?.name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-medium">{giveaway?.seller?.email || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <p className="font-medium">{giveaway?.seller?.phone || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Number of Items</label>
              <p className="font-medium">{giveaway?.numberOfItems || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pickup Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Pickup Location</label>
              <p className="font-medium">
                {[
                  giveaway?.pickupLocation?.house_no,
                  giveaway?.pickupLocation?.building_name,
                  giveaway?.pickupLocation?.landmark,
                  giveaway?.pickupLocation?.area,
                  giveaway?.pickupLocation?.city,
                  giveaway?.pickupLocation?.country
                ]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Preferred Pickup</label>
              <p className="font-medium">
                {giveaway?.pickupDate
                  ? `${new Date(giveaway.pickupDate).toLocaleDateString()} (${giveaway.pickupTime === "morning" ? "Morning" : giveaway.pickupTime})`
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveawayOrderDetails;