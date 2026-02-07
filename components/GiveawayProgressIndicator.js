// GiveawayProgressIndicator.jsx
import { CheckCircle } from "lucide-react";

const GiveawayProgressIndicator = ({ currentStage, giveaway }) => {
  const stages = ["Customer Care", "Pickup"];
  const proc = giveaway?.giveawayProcessingDetails || {};
  const complete = {
    "Customer Care": proc.customerCare?.confirmationStatus === "approved",
    "Pickup": proc.pickupDetails?.pickupStatus === "Delivered",
  };
  const currentIndex = stages.findIndex((s) => s.toLowerCase().replace(" ", "") === currentStage);

  return (
    <div className="flex items-center justify-center mb-6">
      {stages.map((stage, i) => {
        const isDone = complete[stage] || i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={stage} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                isDone ? "bg-green-600" : isActive ? "bg-pink-600" : "bg-gray-300"
              }`}
            >
              {isDone ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            <span className={`mx-2 text-sm font-medium ${isDone ? "text-green-600" : isActive ? "text-pink-600" : "text-gray-500"}`}>
              {stage}
            </span>
            {i < stages.length - 1 && <div className="w-12 h-0.5 bg-gray-300 mx-2" />}
          </div>
        );
      })}
    </div>
  );
};

export default GiveawayProgressIndicator;