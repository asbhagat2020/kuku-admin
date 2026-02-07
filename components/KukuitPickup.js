



// import { useEffect, useState } from "react";
// import { Truck, X } from "lucide-react";

// const KukuitPickup = ({
//   pickupForm,
//   setPickupForm,
//   pickupStatusForm,
//   setPickupStatusForm,
//   handleAssignPickupTeam,
//   handleUpdatePickupStatus,
//   setCurrentStage,
//   selectedKukuit,
//   previousStage, // New prop for parent stage navigation
// }) => {
//   const [subStage, setSubStage] = useState(() => {
//     const pickupDetails = selectedKukuit?.kukuitProcessingDetails?.pickupDetails;
//     const isNotAssigned = pickupDetails?.pickupStatus === "not_assigned";
//     const isTeamNotAssigned = !pickupDetails?.assignedTeam || pickupDetails?.assignedTeam.trim() === "";
//     return isNotAssigned || isTeamNotAssigned ? "assignment" : "status";
//   });
//   const isStageComplete =
//     selectedKukuit?.kukuitProcessingDetails?.pickupDetails?.pickupStatus === "delivered_to_warehouse";
  
//   const pickupHistory = selectedKukuit?.kukuitProcessingDetails?.pickupDetails?.pickupStatusHistory || [];

//   useEffect(() => {
//     if (selectedKukuit?.kukuitProcessingDetails?.pickupDetails) {
//       setPickupForm({
//         assignedTeam: selectedKukuit.kukuitProcessingDetails.pickupDetails.assignedTeam || "",
//         agentName: selectedKukuit.kukuitProcessingDetails.pickupDetails.agentName || "",
//       });
//       setPickupStatusForm({
//         status: selectedKukuit.kukuitProcessingDetails.pickupDetails.pickupStatus || "picked_up",
//       });
//     }
//   }, [selectedKukuit, setPickupForm, setPickupStatusForm]);

//   return (
//     <div className="bg-white p-6 rounded-lg border border-gray-200">
//       {subStage === "assignment" ? (
//         <>
//           <h3 className="text-lg font-semibold mb-4">Assign Pickup Team</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
//               <input
//                 type="text"
//                 value={pickupForm.assignedTeam}
//                 onChange={(e) => setPickupForm({ ...pickupForm, assignedTeam: e.target.value })}
//                 className="w-full p-2 border rounded-md"
//                 placeholder="Enter team name"
//                 disabled={isStageComplete}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
//               <input
//                 type="text"
//                 value={pickupForm.agentName}
//                 onChange={(e) => setPickupForm({ ...pickupForm, agentName: e.target.value })}
//                 className="w-full p-2 border rounded-md"
//                 placeholder="Enter agent name"
//                 disabled={isStageComplete}
//                 required
//               />
//             </div>
//           </div>
//           <div className="flex justify-between gap-4 mt-4">
//             <button
//               onClick={() => setCurrentStage(previousStage || "customercare")}
//               className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//             >
//               <X className="w-4 h-4 mr-2" />
//               Back
//             </button>
//             <button
//               onClick={() => {
//                 if (!pickupForm.assignedTeam || !pickupForm.agentName) {
//                   alert("Please fill team name and agent name");
//                   return;
//                 }
//                 handleAssignPickupTeam();
//                 setSubStage("status");
//               }}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
//               disabled={isStageComplete || !pickupForm.assignedTeam || !pickupForm.agentName}
//             >
//               <Truck className="w-4 h-4 mr-2" />
//               Assign Team
//             </button>
//             {isStageComplete && (
//               <button
//                 onClick={() => setCurrentStage("quality")}
//                 className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
//               >
//                 Next: Quality
//               </button>
//             )}
//           </div>
//         </>
//       ) : (
//         <>
//           <h3 className="text-lg font-semibold mb-4">Update Pickup Status</h3>
//           <select
//             value={pickupStatusForm.status}
//             onChange={(e) => setPickupStatusForm({ ...pickupStatusForm, status: e.target.value })}
//             className="w-full p-2 border rounded-md mb-4"
//             disabled={isStageComplete}
//           >
//             <option value="picked_up">Picked Up</option>
//             <option value="delivered_to_warehouse">Delivered to Warehouse</option>
//           </select>
          
//           {/* Pickup History Section */}
//           {pickupHistory.length > 0 && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-md">
//               <h4 className="text-md font-medium mb-2 text-gray-800">Pickup History</h4>
//               <ul className="space-y-2">
//                 {pickupHistory.map((item) => (
//                   <li key={item._id} className="text-sm text-gray-600 flex justify-between">
//                     <span>{item.status.replace(/_/g, ' ').toUpperCase()}</span>
//                     <span className="text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
          
//           <div className="flex justify-between gap-4 mt-4">
//             <button
//               onClick={() => setSubStage("assignment")}
//               className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//             >
//               <X className="w-4 h-4 mr-2" />
//               Back
//             </button>
//             <button
//               onClick={() => {
//                 handleUpdatePickupStatus();
//                 if (pickupStatusForm.status === "delivered_to_warehouse") {
//                   setCurrentStage("quality");
//                 }
//               }}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
//               disabled={isStageComplete}
//             >
//               <Truck className="w-4 h-4 mr-2" />
//               Update Status
//             </button>
//             {isStageComplete && (
//               <button
//                 onClick={() => setCurrentStage("quality")}
//                 className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
//               >
//                 Next: Quality
//               </button>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default KukuitPickup;






import { useEffect, useState } from "react";
import { Truck, CheckCircle, Package, Clock, Hash } from "lucide-react";

const KukuitPickup = ({
  setCurrentStage,
  selectedKukuit,
  previousStage,
}) => {
  const pickupDetails = selectedKukuit?.kukuitProcessingDetails?.pickupDetails || {};
  const pickupHistory = pickupDetails.pickupStatusHistory || [];

 // Update getPickupStatusDisplay map (line ~15) - Exact enum values
const getPickupStatusDisplay = (status) => {
  const map = {
    "Pickup Scheduled": "Pickup Scheduled",
    "Pickup Completed": "Pickup Completed",
    "Reached At Hub": "Reached At Hub",
    "Out for Delivery": "Out for Delivery",
    "Delivered": "Delivered",
  };
  return map[status] || status || "Not Assigned";  // Fallback to exact status if no map
};

// Update getStatusColor map (line ~20) - Colors for exact enums
const getStatusColor = (status) => {
  const map = {
    "Pickup Scheduled": "bg-blue-100 text-blue-800",
    "Pickup Completed": "bg-yellow-100 text-yellow-800",
    "Reached At Hub": "bg-orange-100 text-orange-800",
    "Out for Delivery": "bg-purple-100 text-purple-800",
    "Delivered": "bg-green-100 text-green-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";  // Default for unknown
};

// Update getStatusIcon map (line ~25) - Icons for exact enums
const getStatusIcon = (status) => {
  const map = {
    "Pickup Scheduled": <Clock className="w-4 h-4" />,
    "Pickup Completed": <Truck className="w-4 h-4" />,
    "Reached At Hub": <Package className="w-4 h-4" />,
    "Out for Delivery": <Truck className="w-4 h-4" />,
    "Delivered": <CheckCircle className="w-4 h-4" />,
  };
  return map[status] || <Clock className="w-4 h-4" />;  // Default icon
};

// Update isDelivered check (line ~50) - Exact enum
const isDelivered = pickupDetails.pickupStatus === "Delivered";

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <Truck className="w-6 h-6 mr-2 text-pink-600" />
        Pickup Status (Read-Only)
      </h3>

      {/* Current Pickup Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pickup Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Pickup Status
          </label>
          <div className="flex items-center">
            {getStatusIcon(pickupDetails.pickupStatus)}
            <span
              className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                pickupDetails.pickupStatus
              )}`}
            >
              {getPickupStatusDisplay(pickupDetails.pickupStatus)}
            </span>
          </div>
        </div>

        {/* AWB Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Hash className="w-4 h-4 mr-1" />
            Tracking Number (AWB)
          </label>
          <p className="font-mono text-lg font-semibold text-gray-900 break-all">
            {pickupDetails.awbNumber || "—"}
          </p>
        </div>
      </div>

      {/* Pickup History */}
      {pickupHistory.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Pickup Timeline</h4>
          <div className="space-y-3">
            {pickupHistory.map((entry, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm border-b border-gray-200 pb-2 last:border-0"
              >
                <div className="flex items-center">
                  {getStatusIcon(entry.status)}
                  <span className="ml-2 font-medium">
                    {getPickupStatusDisplay(entry.status)}
                  </span>
                </div>
                <span className="text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Update Button — Read Only */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
        <strong>Note:</strong> Pickup status is managed via Jeebly webhook. Manual updates are disabled.
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={() => setCurrentStage(previousStage || "customercare")}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back
        </button>

        {isDelivered && (
          <button
            onClick={() => setCurrentStage("quality")}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Next: Quality Check
          </button>
        )}
      </div>
    </div>
  );
};

export default KukuitPickup;