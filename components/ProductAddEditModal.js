// import React, { useEffect } from "react";
// import { X } from "lucide-react";

// const ProductAddEditModal = ({
//   showModal,
//   setShowModal,
//   newProduct,
//   setNewProduct,
//   editingProduct,
//   setEditingProduct,
//   error,
//   setError,
//   handleSaveProduct,
//   brands,
//   categories,
//   conditions,
//   sizes,
//   selectedImages,
//   uploadedImageUrls,
//   uploadingImages,
//   handleImageSelect,
//   handleRemoveImage,
//   uploadImages,
//   handleOpenToRentChange,
//   handlePickupAddressChange,
//   handleCategoryChange,
//   handleSubCategoryChange,
//   selectedGender,
//   setSelectedCategory,
//   selectedCategory,
//   selectedSubCategory,
//   setSelectedSubCategory,
//   setSelectedGender,
// }) => {
//   // Populate form fields when editing a product
//   useEffect(() => {
//     if (editingProduct && categories) {
//       const categoryObj = editingProduct.category;

//       if (categoryObj) {
//         const genderName = categoryObj.parentCategory;
//         const categoryName = categoryObj.categoryName;
//         const subCategoryName = categoryObj.subCategoryName;

//         console.log("Loading Edit Data - Gender:", genderName);
//         console.log("Loading Edit Data - Category:", categoryName);
//         console.log("Loading Edit Data - SubCategory:", subCategoryName);

//         setSelectedGender(genderName);

//         setTimeout(() => {
//           if (genderName && categories[genderName]) {
//             for (const catGroup of categories[genderName]) {
//               if (!catGroup.categories) continue;

//               const foundCategory = catGroup.categories.find(
//                 (cat) => cat.categoryName === categoryName
//               );

//               if (foundCategory) {
//                 setSelectedCategory(foundCategory._id);

//                 if (subCategoryName && foundCategory.subCategories) {
//                   const foundSubCategory = foundCategory.subCategories.find(
//                     (sub) => sub.subCategoryName === subCategoryName
//                   );

//                   if (foundSubCategory) {
//                     setTimeout(() => {
//                       setSelectedSubCategory(foundSubCategory._id);
//                     }, 100);
//                   }
//                 }
//                 break;
//               }
//             }
//           }
//         }, 100);
//       }

//       // Populate pickupAddress when editing
//       if (editingProduct.pickupAddress) {
//         setNewProduct((prev) => ({
//           ...prev,
//           pickupAddress: {
//             ...prev.pickupAddress,
//             name: editingProduct.pickupAddress.name || "",
//             phone:
//               `${editingProduct.pickupAddress.mob_no_country_code}${editingProduct.pickupAddress.mobile_number}` ||
//               "",
//             alternate_phone:
//               `${editingProduct.pickupAddress.alt_ph_country_code}${editingProduct.pickupAddress.alternate_phone}` ||
//               "",
//             house_no: editingProduct.pickupAddress.house_no || "",
//             building_name: editingProduct.pickupAddress.building_name || "",
//             area: editingProduct.pickupAddress.area || "",
//             landmark: editingProduct.pickupAddress.landmark || "",
//             city: editingProduct.pickupAddress.city || "",
//             address_type: editingProduct.pickupAddress.address_type || "Normal",
//             email: editingProduct.pickupAddress.email || "",
//             country: editingProduct.pickupAddress.country || "UAE",
//           },
//         }));
//       }
//     }
//   }, [
//     editingProduct,
//     categories,
//     setSelectedGender,
//     setSelectedCategory,
//     setSelectedSubCategory,
//     setNewProduct,
//   ]);

//   // Ensure the modal is only displayed when `showModal` is true
//   if (!showModal) return null;

//   const genderOptions = Object.keys(categories || {});
//   const categoryOptions =
//     selectedGender && categories && categories[selectedGender]
//       ? categories[selectedGender].flatMap((catObj) =>
//           catObj.categories ? catObj.categories : []
//         )
//       : [];
//   const selectedCategoryData = categoryOptions.find(
//     (cat) => cat._id === selectedCategory
//   );
//   const subCategoryOptions =
//     selectedCategoryData && selectedCategoryData.subCategories
//       ? selectedCategoryData.subCategories
//       : [];

//   // Handle pickup address change
//   // const handlePickupAddressChangeInternal = (field, value) => {
//   //   setNewProduct((prev) => ({
//   //     ...prev,
//   //     pickupAddress: {
//   //       ...prev.pickupAddress,
//   //       [field]: field === "phone" || field === "alternate_phone" ? (value.startsWith("971") ? value : `971${value.slice(0, 9)}`) : value,
//   //     },
//   //   }));
//   // };

//   const handlePickupAddressChangeInternal = (field, value) => {
//     setNewProduct((prev) => ({
//       ...prev,
//       pickupAddress: {
//         ...prev.pickupAddress,
//         [field]:
//           field === "phone" || field === "alternate_phone"
//             ? `971${value.replace(/^971+/, "").slice(0, 9)}`
//             : value,
//       },
//     }));
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//         {showModal && (
//           <div className="fixed inset-0 z-50 overflow-y-auto">
//             <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//               <div
//                 className="fixed inset-0 transition-opacity"
//                 aria-hidden="true"
//               >
//                 <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//               </div>
//               <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       {editingProduct ? "Edit Product" : "Add New Product"}
//                     </h3>
//                     <button
//                       onClick={() => setShowModal(false)}
//                       className="text-gray-400 hover:text-gray-500"
//                     >
//                       <X className="w-6 h-6" />
//                     </button>
//                   </div>
//                   {error && (
//                     <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
//                       {error}
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Left column - Basic product info */}
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Name*
//                         </label>
//                         <input
//                           type="text"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.name}
//                           onChange={(e) =>
//                             setNewProduct({
//                               ...newProduct,
//                               name: e.target.value,
//                             })
//                           }
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Price* (AED)
//                         </label>
//                         <input
//                           type="number"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.price}
//                           onChange={(e) => {
//                             const newPrice = e.target.value;
//                             const newOpenToRent =
//                               Number(newPrice) > 300 ? "Yes" : "No";
//                             const updatedProduct = {
//                               ...newProduct,
//                               price: newPrice,
//                               openToRent: newOpenToRent,
//                               ...(newOpenToRent === "No" && {
//                                 pricePerDay: "",
//                               }),
//                             };
//                             setNewProduct(updatedProduct);
//                           }}
//                         />
//                         {newProduct.price &&
//                           Number(newProduct.price) <= 1000 && (
//                             <p className="mt-1 text-sm text-gray-500">
//                               Products must be priced above 300 AED to be
//                               available for rent
//                             </p>
//                           )}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Brand*
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.brand}
//                           onChange={(e) =>
//                             setNewProduct({
//                               ...newProduct,
//                               brand: e.target.value,
//                             })
//                           }
//                         >
//                           <option value="">Select Brand</option>
//                           {brands.map((brand) => (
//                             <option key={brand._id} value={brand._id}>
//                               {brand.name || brand.brandName}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Condition*
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.condition}
//                           onChange={(e) =>
//                             setNewProduct({
//                               ...newProduct,
//                               condition: e.target.value,
//                             })
//                           }
//                         >
//                           <option value="">Select Condition</option>
//                           {conditions.map((condition) => (
//                             <option key={condition._id} value={condition._id}>
//                               {condition.conditionName}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Size*
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.size}
//                           onChange={(e) =>
//                             setNewProduct({
//                               ...newProduct,
//                               size: e.target.value,
//                             })
//                           }
//                         >
//                           <option value="">Select Size</option>
//                           {sizes.map((size) => (
//                             <option key={size._id} value={size._id}>
//                               {size.sizeName}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Gender*
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={selectedGender}
//                           onChange={(e) => {
//                             setSelectedGender(e.target.value);
//                             setSelectedCategory("");
//                             setSelectedSubCategory("");
//                           }}
//                         >
//                           <option value="">Select Gender</option>
//                           {genderOptions.map((gender) => (
//                             <option key={gender} value={gender}>
//                               {gender}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Category*
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={selectedCategory}
//                           onChange={handleCategoryChange}
//                           disabled={!selectedGender}
//                         >
//                           <option value="">Select Category</option>
//                           {categoryOptions.map((cat) => (
//                             <option key={cat._id} value={cat._id}>
//                               {cat.categoryName}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Subcategory*
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={selectedSubCategory}
//                           onChange={handleSubCategoryChange}
//                           disabled={!selectedCategory}
//                         >
//                           <option value="">Select Subcategory</option>
//                           {subCategoryOptions.map((sub) => (
//                             <option key={sub._id} value={sub._id}>
//                               {sub.subCategoryName}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Image Upload Section */}
//                       {/* <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Images
//                         </label>
//                         <input
//                           type="file"
//                           multiple
//                           accept="image/*"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           onChange={handleImageSelect}
//                         />
//                         {selectedImages.length > 0 && (
//                           <div className="mt-2">
//                             <button
//                               type="button"
//                               onClick={uploadImages}
//                               disabled={uploadingImages}
//                               className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
//                             >
//                               {uploadingImages ? "Uploading..." : "Upload Images"}
//                             </button>
//                           </div>
//                         )}
//                         {uploadedImageUrls.length > 0 && (
//                           <div className="mt-2">
//                             <p className="text-sm font-medium text-gray-700">
//                               Uploaded Images:
//                             </p>
//                             <div className="flex flex-wrap">
//                               {uploadedImageUrls.map((url, index) => (
//                                 <img
//                                   key={index}
//                                   src={url}
//                                   alt={`Uploaded Image ${index + 1}`}
//                                   className="w-20 h-20 object-cover rounded-md mr-2 mb-2 border border-gray-200"
//                                 />
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div> */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Images* (Min: 2, Max: 4)
//                         </label>
//                         <input
//                           type="file"
//                           multiple
//                           accept="image/*"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           onChange={handleImageSelect}
//                           disabled={
//                             uploadingImages || uploadedImageUrls.length >= 4
//                           }
//                         />
//                         {uploadingImages && (
//                           <div className="mt-2 text-sm text-blue-600 flex items-center">
//                             <svg
//                               className="animate-spin h-4 w-4 mr-2"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle
//                                 className="opacity-25"
//                                 cx="12"
//                                 cy="12"
//                                 r="10"
//                                 stroke="currentColor"
//                                 strokeWidth="4"
//                                 fill="none"
//                               />
//                               <path
//                                 className="opacity-75"
//                                 fill="currentColor"
//                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                               />
//                             </svg>
//                             Uploading...
//                           </div>
//                         )}
//                         {uploadedImageUrls.length > 0 && (
//                           <div className="mt-2">
//                             <p className="text-sm font-medium text-gray-700 mb-2">
//                               Uploaded Images ({uploadedImageUrls.length}/4):
//                             </p>
//                             <div className="flex flex-wrap gap-2">
//                               {uploadedImageUrls.map((url, index) => (
//                                 <div key={index} className="relative group">
//                                   <img
//                                     src={url}
//                                     alt={`Image ${index + 1}`}
//                                     className="w-20 h-20 object-cover rounded-md border border-gray-200"
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={() => handleRemoveImage(index)}
//                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                                   >
//                                     <X className="w-4 h-4" />
//                                   </button>
//                                 </div>
//                               ))}
//                             </div>
//                             {uploadedImageUrls.length < 2 && (
//                               <p className="mt-1 text-xs text-red-500">
//                                 Please upload at least 2 images
//                               </p>
//                             )}
//                             {uploadedImageUrls.length >= 4 && (
//                               <p className="mt-1 text-xs text-gray-500">
//                                 Maximum 4 images reached
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Right column - Additional product info */}
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Description
//                         </label>
//                         <textarea
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           rows="3"
//                           value={newProduct.description}
//                           onChange={(e) =>
//                             setNewProduct({
//                               ...newProduct,
//                               description: e.target.value,
//                             })
//                           }
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Product Type
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.productType}
//                           onChange={(e) =>
//                             setNewProduct({
//                               ...newProduct,
//                               productType: e.target.value,
//                             })
//                           }
//                         >
//                           {["Listing", "Giveaway", "Requirement"].map(
//                             (option) => (
//                               <option key={option} value={option}>
//                                 {option}
//                               </option>
//                             )
//                           )}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Open to Rent
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.openToRent}
//                           onChange={handleOpenToRentChange}
//                           disabled={Number(newProduct.price) <= 300}
//                         >
//                           {["Yes", "No"].map((option) => (
//                             <option key={option} value={option}>
//                               {option}
//                             </option>
//                           ))}
//                         </select>
//                         {Number(newProduct.price) <= 300 && (
//                           <p className="mt-1 text-xs text-gray-500 italic">
//                             Only available for products priced above 300 AED
//                           </p>
//                         )}
//                       </div>

//                       {newProduct.openToRent === "Yes" &&
//                         Number(newProduct.price) > 300 && (
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">
//                               Price Per Day* (AED)
//                             </label>
//                             <input
//                               type="number"
//                               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                               value={newProduct.pricePerDay}
//                               onChange={(e) =>
//                                 setNewProduct({
//                                   ...newProduct,
//                                   pricePerDay: e.target.value,
//                                 })
//                               }
//                             />
//                           </div>
//                         )}

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Usage Details
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.usage}
//                           onChange={(e) =>
//                             setNewProduct({
//                               ...newProduct,
//                               usage: e.target.value,
//                             })
//                           }
//                         >
//                           <option value="">Select usage</option>
//                           <option value="Used Once">Used Once</option>
//                           <option value="Rarely Used">Rarely Used</option>
//                           <option value="Never Used">Never Used</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Damages (if any)
//                         </label>
//                         <input
//                           type="text"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.damages}
//                           onChange={(e) =>
//                             setNewProduct({
//                               ...newProduct,
//                               damages: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6">
//                     <h4 className="text-md font-medium text-gray-900 mb-2">
//                       Pickup Address*
//                     </h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Full Name*
//                         </label>
//                         <input
//                           type="text"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.pickupAddress?.name || ""}
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "name",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Phone*
//                         </label>
//                         <input
//                           type="tel"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.pickupAddress?.phone || "971"}
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "phone",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Alternate Phone (Optional)
//                         </label>
//                         <input
//                           type="tel"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={
//                             newProduct.pickupAddress?.alternate_phone || ""
//                           }
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "alternate_phone",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           House No*
//                         </label>
//                         <input
//                           type="text"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.pickupAddress?.house_no || ""}
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "house_no",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Building Name*
//                         </label>
//                         <input
//                           type="text"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.pickupAddress?.building_name || ""}
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "building_name",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Area*
//                         </label>
//                         <input
//                           type="text"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.pickupAddress?.area || ""}
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "area",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Landmark
//                         </label>
//                         <input
//                           type="text"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.pickupAddress?.landmark || ""}
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "landmark",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           City*
//                         </label>
//                         <input
//                           type="text"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.pickupAddress?.city || ""}
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "city",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Address Type*
//                         </label>
//                         <select
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={
//                             newProduct.pickupAddress?.address_type || "Normal"
//                           }
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "address_type",
//                               e.target.value
//                             )
//                           }
//                         >
//                           <option value="Normal">Normal</option>
//                           <option value="Western">Western</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Email*
//                         </label>
//                         <input
//                           type="email"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.pickupAddress?.email || ""}
//                           onChange={(e) =>
//                             handlePickupAddressChangeInternal(
//                               "email",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                           Country*
//                         </label>
//                         <input
//                           type="text"
//                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                           value={newProduct.pickupAddress?.country || "UAE"}
//                           readOnly
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="button"
//                     onClick={handleSaveProduct}
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     {editingProduct ? "Save Changes" : "Add Product"}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowModal(false);
//                       setEditingProduct(null);
//                       setError("");
//                     }}
//                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductAddEditModal;









import React, { useEffect } from "react";
import { X } from "lucide-react";

const ProductAddEditModal = ({
  showModal,
  setShowModal,
  newProduct,
  setNewProduct,
  editingProduct,
  setEditingProduct,
  error,
  setError,
  handleSaveProduct,
  brands,
  categories,
  conditions,
  sizes,
  selectedImages,
  uploadedImageUrls,
  uploadingImages,
  handleImageSelect,
  handleRemoveImage,
  uploadImages,
  handleOpenToRentChange,
  handlePickupAddressChange,
  handleCategoryChange,
  handleSubCategoryChange,
  selectedGender,
  setSelectedCategory,
  selectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  setSelectedGender,
}) => {
  // Populate form fields when editing a product
  useEffect(() => {
    if (editingProduct && categories) {
      const categoryObj = editingProduct.category;

      if (categoryObj) {
        const genderName = categoryObj.parentCategory;
        const categoryName = categoryObj.categoryName;
        const subCategoryName = categoryObj.subCategoryName;

        setSelectedGender(genderName);

        setTimeout(() => {
          if (genderName && categories[genderName]) {
            for (const catGroup of categories[genderName]) {
              if (!catGroup.categories) continue;

              const foundCategory = catGroup.categories.find(
                (cat) => cat.categoryName === categoryName
              );

              if (foundCategory) {
                setSelectedCategory(foundCategory._id);

                if (subCategoryName && foundCategory.subCategories) {
                  const foundSubCategory = foundCategory.subCategories.find(
                    (sub) => sub.subCategoryName === subCategoryName
                  );

                  if (foundSubCategory) {
                    setTimeout(() => {
                      setSelectedSubCategory(foundSubCategory._id);
                    }, 100);
                  }
                }
                break;
              }
            }
          }
        }, 100);
      }

      // Populate addresses based on productType
      const isKukitPurchase = editingProduct.productType === "Kukit Purchase";
      
      // For Kukit Purchase, check warehouse object first, then warehouseAddress
      const warehouseData = isKukitPurchase 
        ? (editingProduct.warehouse || editingProduct.warehouseAddress)
        : editingProduct.warehouseAddress;
      
      const pickupData = editingProduct.pickupAddress;

      // Populate pickup address
      if (pickupData) {
        setNewProduct((prev) => ({
          ...prev,
          pickupAddress: {
            ...prev.pickupAddress,
            name: pickupData.name || "",
            phone:
              `${pickupData.mob_no_country_code}${pickupData.mobile_number}` || "971",
            alternate_phone:
              `${pickupData.alt_ph_country_code}${pickupData.alternate_phone}` || "",
            house_no: pickupData.house_no || "",
            building_name: pickupData.building_name || "",
            area: pickupData.area || "",
            landmark: pickupData.landmark || "",
            city: pickupData.city || "",
            address_type: pickupData.address_type || "Normal",
            email: pickupData.email || "",
            country: pickupData.country || "UAE",
          },
        }));
      }

      // Populate warehouse address
      if (warehouseData) {
        setNewProduct((prev) => ({
          ...prev,
          warehouseAddress: {
            ...prev.warehouseAddress,
            name: warehouseData.name || "",
            phone:
              `${warehouseData.mob_no_country_code}${warehouseData.mobile_number}` || "971",
            alternate_phone:
              `${warehouseData.alt_ph_country_code}${warehouseData.alternate_phone}` || "",
            house_no: warehouseData.house_no || "",
            building_name: warehouseData.building_name || "",
            area: warehouseData.area || "",
            landmark: warehouseData.landmark || "",
            city: warehouseData.city || "",
            address_type: warehouseData.address_type || "Normal",
            email: warehouseData.email || "",
            country: warehouseData.country || "UAE",
          },
        }));
      }
    }
  }, [
    editingProduct,
    categories,
    setSelectedGender,
    setSelectedCategory,
    setSelectedSubCategory,
    setNewProduct,
  ]);

  if (!showModal) return null;

  const genderOptions = Object.keys(categories || {});
  const categoryOptions =
    selectedGender && categories && categories[selectedGender]
      ? categories[selectedGender].flatMap((catObj) =>
          catObj.categories ? catObj.categories : []
        )
      : [];
  const selectedCategoryData = categoryOptions.find(
    (cat) => cat._id === selectedCategory
  );
  const subCategoryOptions =
    selectedCategoryData && selectedCategoryData.subCategories
      ? selectedCategoryData.subCategories
      : [];

  // Determine which address to show based on productType
  const isKukitPurchase = newProduct.productType === "Kukit Purchase";
  const addressField = isKukitPurchase ? 'warehouseAddress' : 'pickupAddress';
  const addressLabel = isKukitPurchase ? 'Warehouse Address' : 'Pickup Address';

  const handleAddressChangeInternal = (field, value) => {
    setNewProduct((prev) => ({
      ...prev,
      [addressField]: {
        ...prev[addressField],
        [field]:
          field === "phone" || field === "alternate_phone"
            ? `971${value.replace(/^971+/, "").slice(0, 9)}`
            : value,
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column - Basic product info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name*
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price* (AED)
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.price}
                    onChange={(e) => {
                      const newPrice = e.target.value;
                      const newOpenToRent =
                        Number(newPrice) > 300 ? "Yes" : "No";
                      const updatedProduct = {
                        ...newProduct,
                        price: newPrice,
                        openToRent: newOpenToRent,
                        ...(newOpenToRent === "No" && {
                          pricePerDay: "",
                        }),
                      };
                      setNewProduct(updatedProduct);
                    }}
                  />
                  {newProduct.price &&
                    Number(newProduct.price) <= 1000 && (
                      <p className="mt-1 text-sm text-gray-500">
                        Products must be priced above 300 AED to be
                        available for rent
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand*
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.brand}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        brand: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name || brand.brandName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Condition*
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.condition}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        condition: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Condition</option>
                    {conditions.map((condition) => (
                      <option key={condition._id} value={condition._id}>
                        {condition.conditionName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Size*
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.size}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        size: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Size</option>
                    {sizes.map((size) => (
                      <option key={size._id} value={size._id}>
                        {size.sizeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender*
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={selectedGender}
                    onChange={(e) => {
                      setSelectedGender(e.target.value);
                      setSelectedCategory("");
                      setSelectedSubCategory("");
                    }}
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category*
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    disabled={!selectedGender}
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subcategory*
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={selectedSubCategory}
                    onChange={handleSubCategoryChange}
                    disabled={!selectedCategory}
                  >
                    <option value="">Select Subcategory</option>
                    {subCategoryOptions.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.subCategoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Images* (Min: 2, Max: 4)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={handleImageSelect}
                    disabled={
                      uploadingImages || uploadedImageUrls.length >= 4
                    }
                  />
                  {uploadingImages && (
                    <div className="mt-2 text-sm text-blue-600 flex items-center">
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Uploading...
                    </div>
                  )}
                  {uploadedImageUrls.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Uploaded Images ({uploadedImageUrls.length}/4):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {uploadedImageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Image ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-md border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {uploadedImageUrls.length < 2 && (
                        <p className="mt-1 text-xs text-red-500">
                          Please upload at least 2 images
                        </p>
                      )}
                      {uploadedImageUrls.length >= 4 && (
                        <p className="mt-1 text-xs text-gray-500">
                          Maximum 4 images reached
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Additional product info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="3"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Type*
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.productType}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        productType: e.target.value,
                      })
                    }
                  >
                    {["Listing", "Giveaway", "Kukit Purchase"].map(
                      (option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Open to Rent
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.openToRent}
                    onChange={handleOpenToRentChange}
                    disabled={Number(newProduct.price) <= 300}
                  >
                    {["Yes", "No"].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {Number(newProduct.price) <= 300 && (
                    <p className="mt-1 text-xs text-gray-500 italic">
                      Only available for products priced above 300 AED
                    </p>
                  )}
                </div>

                {newProduct.openToRent === "Yes" &&
                  Number(newProduct.price) > 300 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price Per Day* (AED)
                      </label>
                      <input
                        type="number"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={newProduct.pricePerDay}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            pricePerDay: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Usage Details
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.usage}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        usage: e.target.value,
                      })
                    }
                  >
                    <option value="">Select usage</option>
                    <option value="Used Once">Used Once</option>
                    <option value="Rarely Used">Rarely Used</option>
                    <option value="Never Used">Never Used</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Damages (if any)
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct.damages}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        damages: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Address Section - Dynamically shows Pickup or Warehouse based on productType */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-2">
                {addressLabel}* {isKukitPurchase && <span className="text-sm text-gray-500">(For Kukit Purchase)</span>}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.name || ""}
                    onChange={(e) =>
                      handleAddressChangeInternal("name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.phone || "971"}
                    onChange={(e) =>
                      handleAddressChangeInternal("phone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Alternate Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.alternate_phone || ""}
                    onChange={(e) =>
                      handleAddressChangeInternal("alternate_phone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    House No*
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.house_no || ""}
                    onChange={(e) =>
                      handleAddressChangeInternal("house_no", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Building Name*
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.building_name || ""}
                    onChange={(e) =>
                      handleAddressChangeInternal("building_name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Area*
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.area || ""}
                    onChange={(e) =>
                      handleAddressChangeInternal("area", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Landmark
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.landmark || ""}
                    onChange={(e) =>
                      handleAddressChangeInternal("landmark", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City*
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.city || ""}
                    onChange={(e) =>
                      handleAddressChangeInternal("city", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Type*
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.address_type || "Normal"}
                    onChange={(e) =>
                      handleAddressChangeInternal("address_type", e.target.value)
                    }
                  >
                    <option value="Normal">Normal</option>
                    <option value="Western">Western</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email*
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.email || ""}
                    onChange={(e) =>
                      handleAddressChangeInternal("email", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country*
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newProduct[addressField]?.country || "UAE"}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSaveProduct}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {editingProduct ? "Save Changes" : "Add Product"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingProduct(null);
                setError("");
              }}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAddEditModal;


