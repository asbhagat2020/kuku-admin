


import { useEffect, useState } from "react";
import { ClipboardCheck, CheckCircle, X } from "lucide-react";
import KukuitAddItems from "./kukuitAddItems";

const KukuitQuality = ({
  handleAssignQualityTeam,
  showItemForm,
  setShowItemForm,
  itemForm,
  setItemForm,
  itemSelections,
  setItemSelections,
  categories,
  brands,
  conditions,
  sizes,
  colors,
  items,
  selectedKukuit,
  handleAddItem,
  removeItem,
  handleFileChange,
  removeImage,
  handleItemInputChange,
  handleItemUpload,
  handleCompleteQuality,
  setCurrentStage,
  previousStage, // Prop for parent stage navigation
}) => {
 const qualityStatus = selectedKukuit?.kukuitProcessingDetails?.qualityDetails?.qualityStatus || "";
  const [subStage, setSubStage] = useState("assignment"); // Remove initial logic
  const isStageComplete = qualityStatus === "completed";
  const allItemsAdded = items.length >= (selectedKukuit?.numberOfItems || 0);

  // DYNAMIC SUBSTAGE UPDATE
  useEffect(() => {
    if (isStageComplete) {
      setSubStage("complete");
    } else if (qualityStatus === "in_progress" && allItemsAdded) {
      setSubStage("complete");
    } else if (qualityStatus === "in_progress") {
      setSubStage("addItems");
    } else if (qualityStatus === "not_started" || !qualityStatus) {
      setSubStage("assignment");
    }
  }, [qualityStatus, allItemsAdded, isStageComplete]);

  useEffect(() => {
    if (subStage !== "addItems" && showItemForm) {
      setShowItemForm(false);
    }
  }, [subStage, showItemForm, setShowItemForm]);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      {subStage === "assignment" ? (
        <>
          <h3 className="text-lg font-semibold mb-4">Assign Quality Team</h3>
          <p className="text-gray-600 mb-4">Click to assign quality team for processing.</p>
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setCurrentStage(previousStage || "pickup")}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              onClick={() => {
                handleAssignQualityTeam();
                setSubStage("addItems");
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isStageComplete}
            >
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Assign Quality Team
            </button>
            {isStageComplete && allItemsAdded && (
              <button
                onClick={() => setCurrentStage("customercare")}
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Next: Done
              </button>
            )}
          </div>
        </>
      ) : subStage === "addItems" ? (
        <KukuitAddItems
          showItemForm={showItemForm}
          setShowItemForm={setShowItemForm}
          itemForm={itemForm}
          setItemForm={setItemForm}
          itemSelections={itemSelections}
          setItemSelections={setItemSelections}
          categories={categories}
          brands={brands}
          conditions={conditions}
          sizes={sizes}
          colors={colors}
          items={items}
          selectedKukuit={selectedKukuit}
          handleAddItem={handleAddItem}
          removeItem={removeItem}
          handleFileChange={handleFileChange}
          removeImage={removeImage}
          handleItemInputChange={handleItemInputChange}
          handleItemUpload={handleItemUpload}
          setSubStage={setSubStage} // Pass setSubStage instead of setCurrentStage
        />
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-4">Complete Quality Check</h3>
          <p className="text-gray-600 mb-4">All items have been processed. Click below to finalize the quality check.</p>
          {!allItemsAdded && (
            <p className="text-red-600 mb-4">Please add all {selectedKukuit?.numberOfItems} items before completing the quality check.</p>
          )}
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setSubStage("addItems")}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              onClick={handleCompleteQuality}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              disabled={isStageComplete || !allItemsAdded}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Quality Check
            </button>
            {isStageComplete && allItemsAdded && (
              <button
                onClick={() => setCurrentStage("customercare")}
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Next: Done
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default KukuitQuality;