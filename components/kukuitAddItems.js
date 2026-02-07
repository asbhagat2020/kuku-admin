import { useEffect } from "react";
import { Upload, X, Trash2 } from "lucide-react";

const KukuitAddItems = ({
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
  setSubStage, // Changed from setCurrentStage to setSubStage
}) => {
  const isStageComplete =
    selectedKukuit?.kukuitProcessingDetails?.qualityDetails?.qualityStatus === "completed";
  const allItemsAdded = items.length >= (selectedKukuit?.numberOfItems || 0);

  // useEffect(() => {
  //   if (selectedKukuit?.products && selectedKukuit.products.length > 0) {
  //     const prePopulatedItems = selectedKukuit.products.map((item) => ({
  //       name: item.name || "",
  //       condition: item.condition?._id || "",
  //       description: item.description || "",
  //       price: item.price || "",
  //       photoUrls: [],
  //       storageLocation: item.storageLocation || "",
  //       status: item.approval?.status || "Accepted",
  //       productType: item.productType || "Listing",
  //       rejectionReason: item.approval?.reason || "",
  //       category: {
  //         parentCategory: item.category?.parentCategory || "",
  //         categoryName: item.category?.categoryName || "",
  //         subCategoryName: item.category?.subCategoryName || "",
  //       },
  //       color: item.color?._id || "",
  //       brand: item.brand?._id || "",
  //       size: item.size?._id || "",
  //       usage: item.usage || "",
  //       damages: item.damages || "",
  //       openToRent: item.openToRent || "No",
  //       pricePerDay: item.pricePerDay || "",
  //     }));

  //     setItemForm({ items: prePopulatedItems });

  //     const prePopulatedSelections = prePopulatedItems.map((item) => {
  //       const parentCat = item.category.parentCategory;
  //       const cat = categories[parentCat]?.flatMap((cat) => cat.categories || []).find(
  //         (c) => c.categoryName === item.category.categoryName
  //       );
  //       const subCat = cat?.subCategories?.find(
  //         (sc) => sc.subCategoryName === item.category.subCategoryName
  //       );
  //       return {
  //         selectedGender: parentCat || "",
  //         selectedCategory: cat?._id || "",
  //         selectedSubCategory: subCat?._id || "",
  //       };
  //     });
  //     setItemSelections(prePopulatedSelections);
  //   }
  // }, [selectedKukuit, categories, setItemForm, setItemSelections]);

  return (
    <>
      {showItemForm ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          {itemForm.items.map((item, index) => (
            <div key={index} className="mb-6 border-b pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemInputChange(e, index, "name")}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter item name"
                    required
                    disabled={isStageComplete}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition*</label>
                  <select
                    value={item.condition}
                    onChange={(e) => handleItemInputChange(e, index, "condition")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isStageComplete}
                  >
                    <option value="">Select Condition</option>
                    {conditions.map((opt) => (
                      <option key={opt._id} value={opt._id}>
                        {opt.conditionName || opt.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => handleItemInputChange(e, index, "description")}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                    placeholder="Enter item description"
                    required
                    disabled={isStageComplete}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (AED)*</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemInputChange(e, index, "price")}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter price"
                    min="0"
                    required
                    disabled={isStageComplete}
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                  <input
                    type="text"
                    value={item.storageLocation}
                    onChange={(e) => handleItemInputChange(e, index, "storageLocation")}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., KuKu Warehouse A"
                    disabled={item.productType === "Giveaway" || isStageComplete}
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                  <select
                    value={item.status}
                    onChange={(e) => handleItemInputChange(e, index, "status")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isStageComplete}
                  >
                    {["Accepted", "Rejected"].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type*</label>
                  <select
                    value={item.productType}
                    onChange={(e) => handleItemInputChange(e, index, "productType")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={true}
                  >
                    {["Kukit Purchase", "Giveaway"].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category*</label>
                  <select
                    value={itemSelections[index]?.selectedGender || ""}
                    onChange={(e) => handleItemInputChange(e, index, "category", "parentCategory")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isStageComplete}
                  >
                    <option value="">Select Parent Category</option>
                    {Object.keys(categories).map((parentCategory) => (
                      <option key={parentCategory} value={parentCategory}>
                        {parentCategory}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name*</label>
                  <select
                    value={itemSelections[index]?.selectedCategory || ""}
                    onChange={(e) => handleItemInputChange(e, index, "category", "categoryName")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={!itemSelections[index]?.selectedGender || isStageComplete}
                  >
                    <option value="">Select Category</option>
                    {categories[itemSelections[index]?.selectedGender]
                      ?.flatMap((cat) => cat.categories || [])
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </option>
                      )) || []}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category*</label>
                  <select
                    value={itemSelections[index]?.selectedSubCategory || ""}
                    onChange={(e) => handleItemInputChange(e, index, "category", "subCategoryName")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={!itemSelections[index]?.selectedCategory || isStageComplete}
                  >
                    <option value="">Select Sub Category</option>
                    {categories[itemSelections[index]?.selectedGender]
                      ?.flatMap((cat) => cat.categories || [])
                      .find((cat) => cat._id === itemSelections[index]?.selectedCategory)
                      ?.subCategories?.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.subCategoryName}
                        </option>
                      )) || []}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color*</label>
                  <select
                    value={item.color}
                    onChange={(e) => handleItemInputChange(e, index, "color")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isStageComplete}
                  >
                    <option value="">Select Color</option>
                    {colors.map((color) => (
                      <option key={color._id} value={color._id}>
                        {color.colorName || color.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand*</label>
                  <select
                    value={item.brand}
                    onChange={(e) => handleItemInputChange(e, index, "brand")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isStageComplete}
                  >
                    <option value="">Select Brand</option>
                    {brands.map((opt) => (
                      <option key={opt._id} value={opt._id}>
                        {opt.brandName || opt.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size*</label>
                  <select
                    value={item.size}
                    onChange={(e) => handleItemInputChange(e, index, "size")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isStageComplete}
                  >
                    <option value="">Select Size</option>
                    {sizes.map((opt) => (
                      <option key={opt._id} value={opt._id}>
                        {opt.sizeName || opt.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage*</label>
                  <input
                    type="text"
                    value={item.usage}
                    onChange={(e) => handleItemInputChange(e, index, "usage")}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Worn a few times"
                    required
                    disabled={isStageComplete}
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Damages*</label>
                  <input
                    type="text"
                    value={item.damages}
                    onChange={(e) => handleItemInputChange(e, index, "damages")}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Minor scratches"
                    required
                    disabled={isStageComplete}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Open to Rent*</label>
                  <select
                    value={item.openToRent}
                    onChange={(e) => handleItemInputChange(e, index, "openToRent")}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={isStageComplete}
                  >
                    {["Yes", "No"].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                {item.openToRent === "Yes" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Day (AED)*</label>
                    <input
                      type="number"
                      value={item.pricePerDay}
                      onChange={(e) => handleItemInputChange(e, index, "pricePerDay")}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter price per day"
                      min="0"
                      required
                      disabled={isStageComplete}
                    />
                  </div>
                )}
                {item.status === "Rejected" && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason*</label>
                    <textarea
                      value={item.rejectionReason}
                      onChange={(e) => handleItemInputChange(e, index, "rejectionReason")}
                      className="w-full p-2 border rounded-md"
                      rows="2"
                      placeholder="Enter rejection reason"
                      required
                      disabled={isStageComplete}
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images (up to 4)</label>
                  <div className="flex flex-wrap gap-4">
                    {Array(4)
                      .fill()
                      .map((_, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative w-24 h-24 border border-pink-600 rounded-lg flex items-center justify-center overflow-hidden"
                        >
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={(e) => handleFileChange(e, index, imgIndex)}
                            className="opacity-0 absolute inset-0 cursor-pointer"
                            disabled={isStageComplete}
                          />
                          {item.photoUrls[imgIndex] ? (
                            <>
                              <img
                                src={URL.createObjectURL(item.photoUrls[imgIndex])}
                                alt={`Uploaded ${imgIndex + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeImage(index, imgIndex)}
                                className="absolute top-1 right-1 bg-white bg-opacity-75 rounded-full p-1 hover:bg-opacity-100"
                                disabled={isStageComplete}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </button>
                            </>
                          ) : (
                            <Upload className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                {itemForm.items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                    disabled={isStageComplete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Item
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={() => setSubStage("assignment")}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Back
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleAddItem}
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400"
                disabled={isStageComplete}
              >
                <Upload className="w-4 h-4 mr-2" />
                Add Another Item
              </button>
              <button
                onClick={() => {
                  handleItemUpload();
                  // setShowItemForm(false);
                }}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                disabled={isStageComplete}
              >
                <Upload className="w-4 h-4 mr-2" />
                Add Items
              </button>
            </div>
            {allItemsAdded && (
              <button
                onClick={() => {
                  setShowItemForm(false);
                  setSubStage("complete");
                }}
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400"
                disabled={isStageComplete}
              >
                Next: Complete Quality
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Items ({items.length}/{selectedKukuit?.numberOfItems})</h3>
          {!allItemsAdded && (
            <p className="text-red-600 mb-4">Please add all {selectedKukuit?.numberOfItems} items to proceed.</p>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Status", "Product Type", "Price", "Rejection Reason"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item._id || item.productId}>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        item.approval?.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : item.approval?.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.approval?.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.productType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    AED {item.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.approval?.reason || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={() => setSubStage("assignment")}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Back
            </button>
            <div className="flex gap-4">
              {!isStageComplete && (
                <button
                  onClick={() => setShowItemForm(true)}
                  className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Items
                </button>
              )}
              {allItemsAdded && !showItemForm && (
                <button
                  onClick={() => setSubStage("complete")}
                  className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-gray-400"
                  disabled={isStageComplete}
                >
                  Next: Complete Quality
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KukuitAddItems;