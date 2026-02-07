





// import React, { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { Modal, message } from "antd";
// import { showSuccessNotification } from "@/utils/Notification/Notification";

// export const Categories = () => {
//   const [Imge, setImge] = useState(null);
//   const [categoryName, setCategoryName] = useState("");
//   const [status, setStatus] = useState("");
//   const [parentCategory, setParentCategory] = useState("");
//   const [subCategories, setSubCategories] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editCategoryId, setEditCategoryId] = useState(null);
//   const [error, setError] = useState("");
//   const { user, token } = useSelector((store) => store.otp);
//   const [loading, setLoading] = useState(false);
//   const [selectedParentCategoryId, setSelectedParentCategoryId] = useState("");
//   const [editingParentId, setEditingParentId] = useState(null);
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleSearch = (e) => setSearch(e.target.value);
//   const handleStatusFilter = (e) => setStatusFilter(e.target.value);
//   const handleSort = (e) => setSortOption(e.target.value);

//   const flattenedCategories = Array.isArray(categories)
//     ? categories.reduce((acc, parentCat) => {
//         if (Array.isArray(parentCat.categories)) {
//           return acc.concat(
//             parentCat.categories.map((category) => ({
//               ...category,
//               parentCategory: parentCat.parentCategory,
//               parentCategoryId: parentCat._id,
//             }))
//           );
//         }
//         return acc;
//       }, [])
//     : [];

//   const filteredCategories = Array.isArray(flattenedCategories)
//     ? flattenedCategories.filter(
//         (category) =>
//           category?.categoryName?.toLowerCase()?.includes(search?.toLowerCase()) &&
//           (statusFilter
//             ? category.status?.toLowerCase() === statusFilter.toLowerCase()
//             : true)
//       )
//       .sort((a, b) => {
//         if (sortOption === "Name")
//           return a.categoryName.localeCompare(b.categoryName);
//         if (sortOption === "Count") return b.count - a.count;
//         return 0;
//       })
//     : [];

//   const openModal = (category = null) => {
//     if (category) {
//       setCategoryName(category.categoryName || "");
//       setParentCategory(category.parentCategory || "");
//       setSubCategories(
//         category.subCategories
//           ? category.subCategories.map((subCat) => subCat.subCategoryName).join(", ")
//           : ""
//       );
//       setStatus(category.status || "");
//       setImge(category.image || null);
//       setIsEditMode(true);
//       setEditCategoryId(category._id);
//       setEditingParentId(category.parentCategoryId);
//       setSelectedParentCategoryId(category.parentCategoryId || "");
//     } else {
//       setCategoryName("");
//       setParentCategory("");
//       setSubCategories("");
//       setStatus("");
//       setImge(null);
//       setIsEditMode(false);
//       setEditCategoryId(null);
//       setEditingParentId(null);
//       setSelectedParentCategoryId("");
//     }
//     setShowModal(true);
//   };


//   const handleBulkUpload = async () => {
//   if (!file) {
//     setError("Please select a CSV file.");
//     return;
//   }

//   setUploading(true);
//   setError("");
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("folder", "csv_uploads");

//     console.log("Uploading CSV to /upload/admin/single...");
//     const uploadResponse = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     console.log("Upload response:", uploadResponse.data);

//     console.log("Sending fileUrl to: /category/upload-bulk");
//     const bulkResponse = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/upload-bulk`,
//       { fileUrl: uploadResponse.data.fileUrl },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Bulk response:", bulkResponse.data);

//     // Detailed console logging
//     console.log("📊 Upload Summary:", {
//       added: bulkResponse.data.addedCount,
//       updated: bulkResponse.data.updatedCount,
//       skipped: bulkResponse.data.duplicates?.length || 0
//     });

//     if (bulkResponse.data.addedCategories && bulkResponse.data.addedCategories.length > 0) {
//       console.log("➕ Added Categories:", bulkResponse.data.addedCategories);
//     }
    
//     if (bulkResponse.data.updatedCategories && bulkResponse.data.updatedCategories.length > 0) {
//       console.log("🔄 Updated Categories:", bulkResponse.data.updatedCategories);
//     }

//     // Refresh categories
//     getCategory();
//     setFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = null;

//     // Build notification message
//     let alertMessage = "";
    
//     // Summary line
//     if (bulkResponse.data.addedCount > 0 && bulkResponse.data.updatedCount > 0) {
//       alertMessage = `✅ ${bulkResponse.data.addedCount} categories added, ${bulkResponse.data.updatedCount} categories updated!`;
//     } else if (bulkResponse.data.addedCount > 0) {
//       alertMessage = `✅ ${bulkResponse.data.addedCount} categories added successfully!`;
//     } else if (bulkResponse.data.updatedCount > 0) {
//       alertMessage = `✅ ${bulkResponse.data.updatedCount} categories updated successfully!`;
//     } else {
//       alertMessage = "✅ Processing completed!";
//     }

//     // Added categories details
//     if (bulkResponse.data.addedCategories && bulkResponse.data.addedCategories.length > 0) {
//       const addedNames = bulkResponse.data.addedCategories
//         .map(cat => `${cat.category} (${cat.parent})`)
//         .join(", ");
//       alertMessage += `\n\nAdded: ${addedNames}`;
//     }

//     // Updated categories details
//     if (bulkResponse.data.updatedCategories && bulkResponse.data.updatedCategories.length > 0) {
//       const updatedNames = bulkResponse.data.updatedCategories
//         .map(cat => `${cat.category} (${cat.parent})`)
//         .join(", ");
//       alertMessage += `\n\nUpdated: ${updatedNames}`;
//     }

//     // Duplicates/skipped
//     if (bulkResponse.data.duplicates && bulkResponse.data.duplicates.length > 0) {
//       alertMessage += `\n\n⚠️ Skipped: ${bulkResponse.data.duplicates.join(", ")}`;
//     }

//     // Errors
//     if (bulkResponse.data.errors && bulkResponse.data.errors.length > 0) {
//       alertMessage += `\n\n❌ Errors: ${bulkResponse.data.errors.join("; ")}`;
//     }

//     showSuccessNotification(alertMessage);

//   } catch (error) {
//     console.error("Bulk upload error:", error.response?.data || error);
    
//     const errorMessage = error.response?.data?.message || "Failed to process categories.";
//     let fullErrorMessage = `❌ ${errorMessage}`;

//     // Show added categories even in error
//     if (error.response?.data?.addedCategories && error.response.data.addedCategories.length > 0) {
//       const addedNames = error.response.data.addedCategories
//         .map(cat => `${cat.category} (${cat.parent})`)
//         .join(", ");
//       fullErrorMessage += `\n\n✅ Added: ${addedNames}`;
//     }

//     // Show updated categories even in error
//     if (error.response?.data?.updatedCategories && error.response.data.updatedCategories.length > 0) {
//       const updatedNames = error.response.data.updatedCategories
//         .map(cat => `${cat.category} (${cat.parent})`)
//         .join(", ");
//       fullErrorMessage += `\n\n🔄 Updated: ${updatedNames}`;
//     }

//     if (error.response?.data?.duplicates && error.response.data.duplicates.length > 0) {
//       fullErrorMessage += `\n\n⚠️ Duplicates: ${error.response.data.duplicates.join(", ")}`;
//     }

//     if (error.response?.data?.errors && error.response.data.errors.length > 0) {
//       fullErrorMessage += `\n\n❌ Errors: ${error.response.data.errors.join("; ")}`;
//     }

//     setError(fullErrorMessage);
//   } finally {
//     setUploading(false);
//   }
// };

//   const closeModal = () => {
//     setShowModal(false);
//     setError("");
//   };

//   const uploadImage = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("folder", "category_images");

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       return response.data.fileUrl;
//     } catch (error) {
//       console.error("Image upload failed:", error);
//       throw new Error("Failed to upload image");
//     }
//   };

//   const createCategory = async () => {
//     if (!categoryName) {
//       setError("Category name is required");
//       return;
//     }
//     if (!parentCategory) {
//       setError("Parent category is required");
//       return;
//     }

//     try {
//       const selectedParent = categories.find((p) => p.parentCategory === parentCategory);

//       if (!selectedParent && !["Men", "Women", "Kid"].includes(parentCategory)) {
//         setError("Invalid parent category. Must be Men, Women, or Kid");
//         return;
//       }

//       let imageUrl = Imge;
//       if (Imge instanceof File) {
//         imageUrl = await uploadImage(Imge);
//       }

//       const subCategoriesArray = subCategories
//         ? subCategories.split(",").map((subCat) => ({
//             subCategoryName: subCat.trim(),
//             status: status || "active",
//           }))
//         : [];

//       const payload = {
//         parentCategory,
//         categoryName,
//         image: imageUrl || undefined,
//         subCategories: subCategoriesArray,
//         status: status || "active",
//       };

//       console.log("Sending payload:", payload);

//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/addcategory`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setShowModal(false);
//         showSuccessNotification(response.data.message || "Created successfully");
//         setTimeout(() => {
//           getCategory();
//         }, 500);
//       }
//     } catch (error) {
//       console.error("Error creating category:", error);
//       setError(error.response?.data?.message || "Failed to create category.");
//     }
//   };

//   const updateCategory = async () => {
//     if (!categoryName) {
//       setError("Category name is required");
//       return;
//     }
//     if (!editingParentId) {
//       setError("Parent category is required");
//       return;
//     }

//     try {
//       const parentCat = categories.find((p) => p._id === editingParentId);

//       if (!parentCat) {
//         setError("Parent category not found");
//         return;
//       }

//       const categoryIndex = parentCat.categories.findIndex((c) => c._id === editCategoryId);

//       if (categoryIndex === -1) {
//         setError("Category not found");
//         return;
//       }

//       let imageUrl = Imge;
//       if (Imge instanceof File) {
//         imageUrl = await uploadImage(Imge);
//       }

//       const subCategoriesArray = subCategories
//         ? subCategories.split(",").map((subCat) => ({
//             subCategoryName: subCat.trim(),
//             status: status || "active",
//           }))
//         : [];

//       const updatedCategories = [...parentCat.categories];
//       updatedCategories[categoryIndex] = {
//         ...updatedCategories[categoryIndex],
//         categoryName,
//         image: imageUrl || undefined,
//         subCategories: subCategoriesArray,
//         status: status || "active",
//       };

//       const payload = {
//         parentCategory: parentCat.parentCategory,
//         categories: updatedCategories,
//       };

//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${editingParentId}`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200) {
//         setShowModal(false);
//         showSuccessNotification(response.data.message || "Updated successfully");
//         setTimeout(() => {
//           getCategory();
//         }, 500);
//       }
//     } catch (error) {
//       console.error("Error updating category:", error);
//       setError(error.response?.data?.message || "Failed to update category.");
//     }
//   };

//   const deleteCategory = (id) => {
//     const categoryToDelete = flattenedCategories.find((cat) => cat._id === id);

//     if (!categoryToDelete) {
//       setError("Category not found");
//       return;
//     }

//     Modal.confirm({
//       title: "Are you sure?",
//       content: "Do you really want to delete this category!",
//       okText: "Yes, Delete",
//       okType: "danger",
//       cancelText: "Cancel",
//       onOk: async () => {
//         try {
//           setLoading(true);

//           const parentCat = categories.find((p) => p._id === categoryToDelete.parentCategoryId);

//           if (!parentCat) {
//             setError("Parent category not found");
//             setLoading(false);
//             return;
//           }

//           const updatedCategories = parentCat.categories.filter((cat) => cat._id !== id);

//           const payload = {
//             parentCategory: parentCat.parentCategory,
//             categories: updatedCategories,
//           };

//           const response = await axios.put(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${parentCat._id}`,
//             payload,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );

//           if (response.status === 200) {
//             showSuccessNotification("Category deleted successfully");
//             getCategory();
//           }
//         } catch (err) {
//           console.error("Error deleting category:", err);
//           setError(err.response?.data?.message || "Failed to delete category.");
//         } finally {
//           setLoading(false);
//         }
//       },
//       onCancel: () => {
//         console.log("Delete action cancelled");
//       },
//     });
//   };

//   useEffect(() => {
//     getCategory();
//   }, []);

//   const getCategory = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`);
//       console.log("Category API response:", response.data);

//       if (response?.data?.data) {
//         const rawData = Array.isArray(response.data.data)
//           ? response.data.data
//           : [response.data.data];
//         console.log("Processed categories:", rawData);
//         setCategories(rawData);
//       } else if (Array.isArray(response?.data)) {
//         setCategories(response.data);
//       } else {
//         setCategories([]);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError("Failed to fetch categories.");
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const uniqueParentCategories = Array.from(
//     new Set(categories.map((cat) => cat.parentCategory))
//   );

//   const submitCategory = (e) => {
//     e.preventDefault();
//     if (isEditMode) {
//       updateCategory();
//     } else {
//       createCategory();
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Category List</h1>
//         <div className="flex space-x-4">
//           <button
//             onClick={() => openModal()}
//             className="px-4 py-2 bg-pink-500 text-white rounded-md"
//           >
//             + Add New Category
//           </button>
//           <div className="flex items-center space-x-2">
//             <input
//               type="file"
//               accept=".csv"
//               ref={fileInputRef}
//               onChange={(e) => setFile(e.target.files[0])}
//               className="border rounded-lg p-2 text-sm"
//               disabled={uploading}
//             />
//             <button
//               onClick={handleBulkUpload}
//               disabled={uploading}
//               className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
//                 uploading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {uploading ? "Processing..." : "Upload CSV"}
//             </button>
//             <a
//               href="data:text/csv;charset=utf-8,parentCategory,categoryName,subCategories,imageUrl,status%0AMen,Tops,Shirts%2CJackets%2CTrousers,,active%0AWomen,Dresses,Maxi%2CMidi%2CMini,,inactive%0AKid,Shoes,Sneakers%2CBoots%2CSuits,https%3A%2F%2Fs3.ap-south-1.amazonaws.com%2Fkuku-bucket%2Fothers%2F1758620941264_t-shirt.png,active"
//               download="sample_categories.csv"
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
//             >
//               Sample CSV
//             </a>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-between items-center mb-4">
//         <input
//           type="text"
//           placeholder="Search categories"
//           value={search}
//           onChange={handleSearch}
//           className="px-4 py-2 border border-gray-300 rounded-md w-1/3"
//         />
//         <div className="flex items-center space-x-4">
//           <select
//             value={sortOption}
//             onChange={handleSort}
//             className="px-4 py-2 border border-gray-300 rounded-md"
//           >
//             <option value="">Sort by</option>
//             <option value="Name">Name</option>
//             <option value="Count">Count</option>
//           </select>
//           <select
//             value={statusFilter}
//             onChange={handleStatusFilter}
//             className="px-4 py-2 border border-gray-300 rounded-md"
//           >
//             <option value="">Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-100 text-left text-gray-600">
//               <th className="px-6 py-3">Parent Category</th>
//               <th className="px-6 py-3">Category Name</th>
//               <th className="px-6 py-3">Image</th>
//               <th className="px-6 py-3">Sub Categories</th>
//               <th className="px-6 py-3">Status</th>
//               <th className="px-6 py-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className="text-center px-6 py-4">
//                   Loading...
//                 </td>
//               </tr>
//             ) : filteredCategories.length > 0 ? (
//               filteredCategories.map((category) => (
//                 <tr key={category._id} className="border-b">
//                   <td className="px-6 py-4">{category.parentCategory}</td>
//                   <td className="px-6 py-4">{category.categoryName}</td>
//                   <td className="px-6 py-4">
//                     {category.image ? (
//                       <img
//                         src={category.image}
//                         alt={category.categoryName}
//                         width="50"
//                         onError={() => console.log(`Failed to load image for ${category.categoryName}: ${category.image}`)}
//                       />
//                     ) : (
//                       "No Image"
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     {Array.isArray(category.subCategories)
//                       ? category.subCategories.map((subCat, index) => (
//                           <div key={subCat._id}>
//                             <span>{subCat.subCategoryName}</span>
//                             {index < category.subCategories.length - 1 && ", "}
//                           </div>
//                         ))
//                       : category.subCategories}
//                   </td>
//                   <td className="px-6 py-4">{category.status}</td>
//                   <td className="px-6 py-4 space-x-2">
//                     <button
//                       onClick={() => openModal(category)}
//                       className="px-4 py-2 bg-blue-500 text-white rounded-md"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => deleteCategory(category._id)}
//                       className="px-4 py-2 bg-red-500 text-white rounded-md"
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center px-6 py-4">
//                   No categories found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
//             <h2 className="text-xl font-bold mb-4">
//               {isEditMode ? "Edit Category" : "Add New Category"}
//             </h2>
//             {error && <p className="text-red-500 mb-2">{error}</p>}
//             <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700 mb-2">
//               Parent Category:
//             </label>
//             <select
//               id="parentCategory"
//               value={parentCategory}
//               onChange={(e) => setParentCategory(e.target.value)}
//               className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
//             >
//               <option value="">Select Parent Category</option>
//               {uniqueParentCategories.map((parent, index) => (
//                 <option key={index} value={parent}>
//                   {parent}
//                 </option>
//               ))}
//             </select>
//             {!uniqueParentCategories.includes(parentCategory) && (
//               <input
//                 type="text"
//                 placeholder="Enter new parent category"
//                 value={parentCategory}
//                 onChange={(e) => setParentCategory(e.target.value)}
//                 className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
//               />
//             )}
//             <input
//               type="text"
//               placeholder="Category Name"
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//               className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
//             />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setImge(e.target.files[0])}
//               className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
//             />
//             {Imge && typeof Imge === "string" && (
//               <img
//                 src={Imge}
//                 alt="Preview"
//                 width="100"
//                 className="mb-4"
//                 onError={() => console.log(`Failed to load preview image: ${Imge}`)}
//               />
//             )}
//             <input
//               type="text"
//               placeholder="Comma-separated Sub Categories"
//               value={subCategories}
//               onChange={(e) => setSubCategories(e.target.value)}
//               className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
//             />
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
//             >
//               <option value="">Select Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-300 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitCategory}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md"
//               >
//                 {isEditMode ? "Update" : "Add"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };








import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, message } from "antd";
import { showSuccessNotification } from "@/utils/Notification/Notification";

export const Categories = () => {
  // Existing states
  const [Imge, setImge] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [subCategories, setSubCategories] = useState("");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [error, setError] = useState("");
  const { user, token } = useSelector((store) => store.otp);
  const [loading, setLoading] = useState(false);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState("");
  const [editingParentId, setEditingParentId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // New state for image URL generation
  const [imageFile, setImageFile] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const imageInputRef = useRef(null);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);
  const handleSort = (e) => setSortOption(e.target.value);

  // Existing flattenedCategories and filteredCategories logic
  const flattenedCategories = Array.isArray(categories)
    ? categories.reduce((acc, parentCat) => {
        if (Array.isArray(parentCat.categories)) {
          return acc.concat(
            parentCat.categories.map((category) => ({
              ...category,
              parentCategory: parentCat.parentCategory,
              parentCategoryId: parentCat._id,
            }))
          );
        }
        return acc;
      }, [])
    : [];

  const filteredCategories = Array.isArray(flattenedCategories)
    ? flattenedCategories
        .filter(
          (category) =>
            category?.categoryName?.toLowerCase()?.includes(search?.toLowerCase()) &&
            (statusFilter
              ? category.status?.toLowerCase() === statusFilter.toLowerCase()
              : true)
        )
        .sort((a, b) => {
          if (sortOption === "Name")
            return a.categoryName.localeCompare(b.categoryName);
          if (sortOption === "Count") return b.count - a.count;
          return 0;
        })
    : [];

  const openModal = (category = null) => {
    // Existing openModal logic
    if (category) {
      setCategoryName(category.categoryName || "");
      setParentCategory(category.parentCategory || "");
      setSubCategories(
        category.subCategories
          ? category.subCategories.map((subCat) => subCat.subCategoryName).join(", ")
          : ""
      );
      setStatus(category.status || "");
      setImge(category.image || null);
      setIsEditMode(true);
      setEditCategoryId(category._id);
      setEditingParentId(category.parentCategoryId);
      setSelectedParentCategoryId(category.parentCategoryId || "");
    } else {
      setCategoryName("");
      setParentCategory("");
      setSubCategories("");
      setStatus("");
      setImge(null);
      setIsEditMode(false);
      setEditCategoryId(null);
      setEditingParentId(null);
      setSelectedParentCategoryId("");
    }
    setShowModal(true);
  };

  // New function to handle image upload and URL generation
  const handleGenerateImageUrl = async () => {
    if (!imageFile) {
      setError("Please select an image file.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("folder", "category_images");

      console.log("Uploading image to /upload/admin/single...");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image Upload response:", response.data);
      setGeneratedImageUrl(response.data.fileUrl);
      message.success("Image URL generated successfully! Click to copy.");

      // Clear image input
      setImageFile(null);
      if (imageInputRef.current) imageInputRef.current.value = null;
    } catch (error) {
      console.error("Image upload error:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Function to copy URL to clipboard
  const copyToClipboard = () => {
    if (generatedImageUrl) {
      navigator.clipboard.writeText(generatedImageUrl);
      message.success("URL copied to clipboard!");
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "csv_uploads");

      console.log("Uploading CSV to /upload/admin/single...");
      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", uploadResponse.data);

      console.log("Sending fileUrl to: /category/upload-bulk");
      const bulkResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/upload-bulk`,
        { fileUrl: uploadResponse.data.fileUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Bulk response:", bulkResponse.data);

      // Existing notification logic
      console.log("📊 Upload Summary:", {
        added: bulkResponse.data.addedCount,
        updated: bulkResponse.data.updatedCount,
        skipped: bulkResponse.data.duplicates?.length || 0,
      });

      if (bulkResponse.data.addedCategories && bulkResponse.data.addedCategories.length > 0) {
        console.log("➕ Added Categories:", bulkResponse.data.addedCategories);
      }

      if (bulkResponse.data.updatedCategories && bulkResponse.data.updatedCategories.length > 0) {
        console.log("🔄 Updated Categories:", bulkResponse.data.updatedCategories);
      }

      getCategory();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;

      let alertMessage = "";
      if (bulkResponse.data.addedCount > 0 && bulkResponse.data.updatedCount > 0) {
        alertMessage = `✅ ${bulkResponse.data.addedCount} categories added, ${bulkResponse.data.updatedCount} categories updated!`;
      } else if (bulkResponse.data.addedCount > 0) {
        alertMessage = `✅ ${bulkResponse.data.addedCount} categories added successfully!`;
      } else if (bulkResponse.data.updatedCount > 0) {
        alertMessage = `✅ ${bulkResponse.data.updatedCount} categories updated successfully!`;
      } else {
        alertMessage = "✅ Processing completed!";
      }

      if (bulkResponse.data.addedCategories && bulkResponse.data.addedCategories.length > 0) {
        const addedNames = bulkResponse.data.addedCategories
          .map((cat) => `${cat.category} (${cat.parent})`)
          .join(", ");
        alertMessage += `\n\nAdded: ${addedNames}`;
      }

      if (bulkResponse.data.updatedCategories && bulkResponse.data.updatedCategories.length > 0) {
        const updatedNames = bulkResponse.data.updatedCategories
          .map((cat) => `${cat.category} (${cat.parent})`)
          .join(", ");
        alertMessage += `\n\nUpdated: ${updatedNames}`;
      }

      if (bulkResponse.data.duplicates && bulkResponse.data.duplicates.length > 0) {
        alertMessage += `\n\n⚠️ Skipped: ${bulkResponse.data.duplicates.join(", ")}`;
      }

      if (bulkResponse.data.errors && bulkResponse.data.errors.length > 0) {
        alertMessage += `\n\n❌ Errors: ${bulkResponse.data.errors.join("; ")}`;
      }

      showSuccessNotification(alertMessage);
    } catch (error) {
      console.error("Bulk upload error:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to process categories.");
    } finally {
      setUploading(false);
    }
  };

  // Existing functions (uploadImage, createCategory, updateCategory, deleteCategory, getCategory, etc.)
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "category_images");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.fileUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image");
    }
  };

  const createCategory = async () => {
    if (!categoryName) {
      setError("Category name is required");
      return;
    }
    if (!parentCategory) {
      setError("Parent category is required");
      return;
    }

    try {
      const selectedParent = categories.find((p) => p.parentCategory === parentCategory);

      if (!selectedParent && !["Men", "Women", "Kid"].includes(parentCategory)) {
        setError("Invalid parent category. Must be Men, Women, or Kid");
        return;
      }

      let imageUrl = Imge;
      if (Imge instanceof File) {
        imageUrl = await uploadImage(Imge);
      }

      const subCategoriesArray = subCategories
        ? subCategories.split(",").map((subCat) => ({
            subCategoryName: subCat.trim(),
            status: status || "active",
          }))
        : [];

      const payload = {
        parentCategory,
        categoryName,
        image: imageUrl || undefined,
        subCategories: subCategoriesArray,
        status: status || "active",
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/addcategory`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setShowModal(false);
        showSuccessNotification(response.data.message || "Created successfully");
        setTimeout(() => {
          getCategory();
        }, 500);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setError(error.response?.data?.message || "Failed to create category.");
    }
  };

  const updateCategory = async () => {
    // Existing updateCategory logic
    if (!categoryName) {
      setError("Category name is required");
      return;
    }
    if (!editingParentId) {
      setError("Parent category is required");
      return;
    }

    try {
      const parentCat = categories.find((p) => p._id === editingParentId);

      if (!parentCat) {
        setError("Parent category not found");
        return;
      }

      const categoryIndex = parentCat.categories.findIndex((c) => c._id === editCategoryId);

      if (categoryIndex === -1) {
        setError("Category not found");
        return;
      }

      let imageUrl = Imge;
      if (Imge instanceof File) {
        imageUrl = await uploadImage(Imge);
      }

      const subCategoriesArray = subCategories
        ? subCategories.split(",").map((subCat) => ({
            subCategoryName: subCat.trim(),
            status: status || "active",
          }))
        : [];

      const updatedCategories = [...parentCat.categories];
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        categoryName,
        image: imageUrl || undefined,
        subCategories: subCategoriesArray,
        status: status || "active",
      };

      const payload = {
        parentCategory: parentCat.parentCategory,
        categories: updatedCategories,
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${editingParentId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setShowModal(false);
        showSuccessNotification(response.data.message || "Updated successfully");
        setTimeout(() => {
          getCategory();
        }, 500);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError(error.response?.data?.message || "Failed to update category.");
    }
  };

  const deleteCategory = (id) => {
    // Existing deleteCategory logic
    const categoryToDelete = flattenedCategories.find((cat) => cat._id === id);

    if (!categoryToDelete) {
      setError("Category not found");
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to delete this category!",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);

          const parentCat = categories.find((p) => p._id === categoryToDelete.parentCategoryId);

          if (!parentCat) {
            setError("Parent category not found");
            setLoading(false);
            return;
          }

          const updatedCategories = parentCat.categories.filter((cat) => cat._id !== id);

          const payload = {
            parentCategory: parentCat.parentCategory,
            categories: updatedCategories,
          };

          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${parentCat._id}`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 200) {
            showSuccessNotification("Category deleted successfully");
            getCategory();
          }
        } catch (err) {
          console.error("Error deleting category:", err);
          setError(err.response?.data?.message || "Failed to delete category.");
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {
        console.log("Delete action cancelled");
      },
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`);
      console.log("Category API response:", response.data);

      if (response?.data?.data) {
        const rawData = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
        console.log("Processed categories:", rawData);
        setCategories(rawData);
      } else if (Array.isArray(response?.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const uniqueParentCategories = Array.from(
    new Set(categories.map((cat) => cat.parentCategory))
  );

  const submitCategory = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateCategory();
    } else {
      createCategory();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category List</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-pink-500 text-white rounded-md"
          >
            + Add New Category
          </button>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="border rounded-lg p-2 text-sm"
              disabled={uploading}
            />
            <button
              onClick={handleBulkUpload}
              disabled={uploading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Processing..." : "Upload CSV"}
            </button>
            <a
              href="data:text/csv;charset=utf-8,parentCategory,categoryName,subCategories,imageUrl,status%0AMen,Tops,Shirts%2CJackets%2CTrousers,https%3A%2F%2Fs3.ap-south-1.amazonaws.com%2Fkuku-bucket%2Fcategory_images%2F1758620941264_tshirt.jpg,active%0AWomen,Dresses,Maxi%2CMidi%2CMini,https%3A%2F%2Fs3.ap-south-1.amazonaws.com%2Fkuku-bucket%2Fcategory_images%2F1758620941265_dress.jpg,inactive%0AKid,Shoes,Sneakers%2CBoots%2CSuits,https%3A%2F%2Fs3.ap-south-1.amazonaws.com%2Fkuku-bucket%2Fcategory_images%2F1758620941266_shoes.jpg,active"
              download="sample_categories.csv"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Sample CSV
            </a>
          </div>
        </div>
      </div>

      {/* New Section for Image URL Generation */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Generate Image URL</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border rounded-lg p-2 text-sm"
            disabled={uploading}
          />
          <button
            onClick={handleGenerateImageUrl}
            disabled={uploading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Generate URL"}
          </button>
        </div>
        {generatedImageUrl && (
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={generatedImageUrl}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Copy URL
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search categories"
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-md w-1/3"
        />
        <div className="flex items-center space-x-4">
          <select
            value={sortOption}
            onChange={handleSort}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sort by</option>
            <option value="Name">Name</option>
            <option value="Count">Count</option>
          </select>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-6 py-3">Parent Category</th>
              <th className="px-6 py-3">Category Name</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Sub Categories</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center px-6 py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr key={category._id} className="border-b">
                  <td className="px-6 py-4">{category.parentCategory}</td>
                  <td className="px-6 py-4">{category.categoryName}</td>
                  <td className="px-6 py-4">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.categoryName}
                        width="50"
                        onError={() =>
                          console.log(`Failed to load image for ${category.categoryName}: ${category.image}`)
                        }
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {Array.isArray(category.subCategories)
                      ? category.subCategories.map((subCat, index) => (
                          <div key={subCat._id}>
                            <span>{subCat.subCategoryName}</span>
                            {index < category.subCategories.length - 1 && ", "}
                          </div>
                        ))
                      : category.subCategories}
                  </td>
                  <td className="px-6 py-4">{category.status}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => openModal(category)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center px-6 py-4">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Category" : "Add New Category"}
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <label
              htmlFor="parentCategory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Parent Category:
            </label>
            <select
              id="parentCategory"
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select Parent Category</option>
              {uniqueParentCategories.map((parent, index) => (
                <option key={index} value={parent}>
                  {parent}
                </option>
              ))}
            </select>
            {!uniqueParentCategories.includes(parentCategory) && (
              <input
                type="text"
                placeholder="Enter new parent category"
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            )}
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImge(e.target.files[0])}
              className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            />
            {Imge && typeof Imge === "string" && (
              <img
                src={Imge}
                alt="Preview"
                width="100"
                className="mb-4"
                onError={() => console.log(`Failed to load preview image: ${Imge}`)}
              />
            )}
            <input
              type="text"
              placeholder="Comma-separated Sub Categories"
              value={subCategories}
              onChange={(e) => setSubCategories(e.target.value)}
              className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submitCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};