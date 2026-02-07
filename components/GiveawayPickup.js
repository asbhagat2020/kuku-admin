// GiveawayPickup.jsx
import { Truck, CheckCircle, Package, Clock } from "lucide-react";

const GiveawayPickup = ({ giveaway, setCurrentStage }) => {
  const details = giveaway.giveawayProcessingDetails?.pickupDetails || {};
  const history = details.pickupStatusHistory || [];

  const getStatusInfo = (status) => {
    const map = {
      "Pickup Scheduled": { color: "bg-blue-100 text-blue-800", icon: <Clock className="w-4 h-4" /> },
      "Pickup Completed": { color: "bg-yellow-100 text-yellow-800", icon: <Truck className="w-4 h-4" /> },
      "Reached At Hub": { color: "bg-orange-100 text-orange-800", icon: <Package className="w-4 h-4" /> },
      "Out for Delivery": { color: "bg-purple-100 text-purple-800", icon: <Truck className="w-4 h-4" /> },
      "Delivered": { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-4 h-4" /> },
    };
    return map[status] || { color: "bg-gray-100 text-gray-800", icon: <Clock className="w-4 h-4" /> };
  };

  return (
    <div className="bg-blue-50 p-5 rounded-lg border">
      <h3 className="font-semibold flex items-center mb-4"><Truck className="w-4 h-4 mr-2" /> Pickup Status</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">AWB Number:</span>
          <span className="font-mono">{details.awbNumber || "—"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Status:</span>
          {details.pickupStatus && (
            <div className="flex items-center">
              {getStatusInfo(details.pickupStatus).icon}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(details.pickupStatus).color}`}>
                {details.pickupStatus}
              </span>
            </div>
          )}
        </div>
      </div>
      {history.length > 0 && (
        <div className="mt-4 bg-white p-3 rounded">
          <p className="font-medium text-sm mb-2">Timeline</p>
          {history.map((h, i) => (
            <div key={i} className="flex justify-between text-xs text-gray-600 py-1 border-b last:border-0">
              <span className="flex items-center">
                {getStatusInfo(h.status).icon}
                <span className="ml-1">{h.status}</span>
              </span>
              <span>{new Date(h.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button onClick={() => setCurrentStage("customercare")} className="px-4 py-2 bg-gray-600 text-white rounded">
          Back
        </button>
      </div>
    </div>
  );
};

export default GiveawayPickup;