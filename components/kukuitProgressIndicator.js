import { CheckCircle } from "lucide-react";

const KukuitProgressIndicator = ({ currentStage, selectedKukuit }) => {
  const stages = ["Customer Care", "Pickup", "Quality"];
  const processing = selectedKukuit?.kukuitProcessingDetails || {};



  const getStageStatus = () => {
  const status = {
    "Customer Care": processing.customerCare?.confirmationStatus === "approved",
    // Exact enum match
    Pickup: processing.pickupDetails?.pickupStatus === "Delivered",
    Quality: processing.qualityDetails?.qualityStatus === "completed",
  };
  return status;
};

  const stageStatus = getStageStatus();
  const currentIndex = stages.findIndex((stage) =>
    stage.toLowerCase().replace(/ /g, "") === currentStage
  );

  return (
    <div className="flex items-center justify-center mb-6">
      {stages.map((stage, index) => {
        const isComplete = stageStatus[stage] || index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={stage} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                isComplete
                  ? "bg-green-600 text-white"
                  : isCurrent
                  ? "bg-pink-200 text-pink-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isComplete && <CheckCircle className="w-5 h-5" />}
              {!isComplete && index + 1}
            </div>
            <div
              className={`text-sm mx-2 ${
                isComplete
                  ? "text-green-600 font-medium"
                  : isCurrent
                  ? "text-pink-800 font-medium"
                  : "text-gray-500"
              }`}
            >
              {stage}
            </div>
            {index < stages.length - 1 && (
              <div className="w-16 h-0.5 bg-gray-200 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KukuitProgressIndicator;