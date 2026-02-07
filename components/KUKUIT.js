// import { useEffect, useState } from "react";
// import axios from "axios";
// import { AlertCircle, CheckCircle, X, Search } from "lucide-react";
// import { useSelector } from "react-redux";
// import KukuitPickup from "./KukuitPickup";
// import KukuitQuality from "./KukuitQuality";
// import KukuitProgressIndicator from "./kukuitProgressIndicator";
// import KukuitDetails from "./kukuitDetails";
// import KukuitOrderDetails from "./KukuitOrderDetails";

// const KUKUIT = () => {
//   const [kukuits, setKukuits] = useState([]);
//   const [filteredKukuits, setFilteredKukuits] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedKukuit, setSelectedKukuit] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [items, setItems] = useState([]);
//   const [notification, setNotification] = useState(null);
//   const [showItemForm, setShowItemForm] = useState(false);
//   const [currentStage, setCurrentStage] = useState("customercare");
//   const [colors, setColors] = useState([]);
//   const [viewMode, setViewMode] = useState("");
//   const token = useSelector((state) => state.otp?.token);

//   const [categories, setCategories] = useState({});
//   const [brands, setBrands] = useState([]);
//   const [conditions, setConditions] = useState([]);
//   const [sizes, setSizes] = useState([]);

//   const [itemSelections, setItemSelections] = useState([]);
//   const [itemForm, setItemForm] = useState({
//     items: [
//       {
//         name: "",
//         condition: "",
//         description: "",
//         price: "",
//         photoUrls: [],
//         // storageLocation: "",
//         status: "Accepted",
//         productType: "Kukit Purchase",
//         rejectionReason: "",
//         category: { parentCategory: "", categoryName: "", subCategoryName: "" },
//         color: "",
//         brand: "",
//         size: "",
//         // usage: "",
//         damages: "",
//         openToRent: "No",
//         pricePerDay: "",
//       },
//     ],
//   });

//   const [customerCareForm, setCustomerCareForm] = useState({
//     action: "",
//     rejectionReason: "",
//     date: "",
//     time: "",
//     location: "",
//   });

//   const [pickupForm, setPickupForm] = useState({
//     assignedTeam: "",
//     // agentName: "", // Commented out as per schema
//   });

//   const [pickupStatusForm, setPickupStatusForm] = useState({
//     status: "scheduled", // Updated to match schema
//   });

//   useEffect(() => {
//     setItemSelections(
//       itemForm.items.map(() => ({
//         selectedGender: "",
//         selectedCategory: "",
//         selectedSubCategory: "",
//       }))
//     );
//   }, [itemForm.items.length]);

//   useEffect(() => {
//     setItemSelections(
//       itemForm.items.map((item) => ({
//         selectedGender: item.category.parentCategory || "",
//         selectedCategory: item.category.categoryName
//           ? categories[item.category.parentCategory]
//               ?.find((cat) =>
//                 cat.categories?.some(
//                   (c) => c.categoryName === item.category.categoryName
//                 )
//               )
//               ?.categories?.find(
//                 (c) => c.categoryName === item.category.categoryName
//               )?._id || ""
//           : "",
//         selectedSubCategory: item.category.subCategoryName
//           ? categories[item.category.parentCategory]
//               ?.find((cat) =>
//                 cat.categories?.some(
//                   (c) => c.categoryName === item.category.categoryName
//                 )
//               )
//               ?.categories?.find(
//                 (c) => c.categoryName === item.category.categoryName
//               )
//               ?.subCategories?.find(
//                 (sc) => sc.subCategoryName === item.category.subCategoryName
//               )?._id || ""
//           : "",
//       }))
//     );
//   }, [itemForm.items, categories]);

//   const showNotification = (message, type = "success") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const fetchReferenceData = async () => {
//     try {
//       if (!token) {
//         showNotification("No token found. Please log in.", "error");
//         return;
//       }

//       const [brandsRes, categoriesRes, conditionsRes, sizesRes, colorsRes] =
//         await Promise.all([
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/getbrand`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/conditions/getcondition`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           ),
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/getSizes`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/getcolor`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//       const categoriesData = categoriesRes.data.data.reduce((acc, category) => {
//         if (!acc[category.parentCategory]) {
//           acc[category.parentCategory] = [];
//         }
//         acc[category.parentCategory].push(category);
//         return acc;
//       }, {});

//       setCategories(categoriesData);
//       setBrands(brandsRes.data.brands || []);
//       setConditions(conditionsRes.data.conditions || []);
//       setSizes(sizesRes.data.sizes || []);
//       setColors(colorsRes.data || []);
//     } catch (error) {
//       console.error("Error fetching reference data:", error);
//       showNotification("Failed to load reference data", "error");
//     }
//   };

//   const fetchKukuits = async () => {
//     setLoading(true);
//     try {
//       if (!token) {
//         showNotification("No token found. Please log in.", "error");
//         return;
//       }
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/get`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setKukuits(response.data.pickups);
//       setFilteredKukuits(response.data.pickups);
//     } catch (error) {
//       console.error("Error fetching Kukuits:", error);
//       showNotification("Error fetching Kukuits", "error");
//     } finally {
//       setLoading(false);
//     }
//   };


//    const determineStage = (kukuit) => {
//   const processing = kukuit?.kukuitProcessingDetails || {};
//   const ccStatus = processing.customerCare?.confirmationStatus || "pending";
//   const pickupStatus = processing.pickupDetails?.pickupStatus || "";
//   const qualityStatus = processing.qualityDetails?.qualityStatus || "";
//   const overallStatus = kukuit?.status || "pending";  // Add this for "In KukuWarehouse"

//   if (ccStatus === "pending" || ccStatus === "rejected")
//     return "customercare";
//   if (ccStatus === "approved" && pickupStatus !== "Delivered")  // Exact enum: "Delivered"
//     return "pickup";
//   // Exact match: Move to quality on "In KukuWarehouse" + "Delivered"
//   if (overallStatus === "In KukuWarehouse" && pickupStatus === "Delivered" && qualityStatus !== "completed")
//     return "quality";
//   return "customercare";
// };


//   const getPreviousStage = (currentStage) => {
//     const stages = ["customercare", "pickup", "quality"];
//     const currentIndex = stages.indexOf(currentStage);
//     return currentIndex > 0 ? stages[currentIndex - 1] : null;
//   };

//   const handleKukuitClick = async (kukuit, mode = "") => {
//     setSelectedKukuit(kukuit);
//     setViewMode(mode);
//     setCurrentStage(determineStage(kukuit));
//     setShowItemForm(false);
//     setCustomerCareForm({
//       action: "",
//       rejectionReason: "",
//       date: kukuit?.kukuitProcessingDetails?.customerCare?.date || "",
//       time: kukuit?.kukuitProcessingDetails?.customerCare?.time || "",
//       location: kukuit?.kukuitProcessingDetails?.customerCare?.location || "",
//     });
//     try {
//       if (!token) {
//         showNotification("No token found. Please log in.", "error");
//         return;
//       }
//       setItems(kukuit.products || []);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//       showNotification("Error fetching items", "error");
//     }
//   };

//   const handleAssignPickupTeam = async () => {
//     try {
//       if (!token) {
//         showNotification("No token found. Please log in.", "error");
//         return;
//       }
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/assign-pickup-team/${selectedKukuit._id}`,
//         pickupForm,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showNotification("Pickup team assigned successfully");
//       fetchKukuits();
//     } catch (error) {
//       console.error("Error assigning pickup team:", error);
//       showNotification("Error assigning pickup team", "error");
//     }
//   };

//   const handleUpdatePickupStatus = async () => {
//     try {
//       if (!token) {
//         showNotification("No token found. Please log in.", "error");
//         return;
//       }
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/update-pickup-status/${selectedKukuit._id}`,
//         { status: pickupStatusForm.status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showNotification(`Pickup status updated to ${pickupStatusForm.status}`);
//       fetchKukuits();
//       if (pickupStatusForm.status === "delivered_to_warehouse") {
//         setCurrentStage("quality");
//       }
//     } catch (error) {
//       console.error("Error updating pickup status:", error);
//       showNotification("Error updating pickup status", "error");
//     }
//   };

//   const handleAssignQualityTeam = async () => {
//     try {
//       if (!token) {
//         showNotification("No token found. Please log in.", "error");
//         return;
//       }
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/assign-quality-team/${selectedKukuit._id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showNotification("Quality team assigned successfully");
//       fetchKukuits();
//     } catch (error) {
//       console.error("Error assigning quality team:", error);
//       showNotification("Error assigning quality team", "error");
//     }
//   };


// const handleItemUpload = async () => {
//   try {
//     const isValid = itemForm.items.every(
//       (item) =>
//         item.name?.trim() &&
//         item.condition &&
//         item.description?.trim() &&
//         item.price &&
//         !isNaN(item.price) &&
//         item.status &&
//         item.productType &&
//         (item.status !== "Rejected" || item.rejectionReason?.trim()) &&
//         (item.status === "Accepted" ? item.productType === "Kukit Purchase" : true) &&
//         (item.status === "Rejected" ? item.productType === "Giveaway" : true) &&
//         item.category.parentCategory &&
//         item.category.categoryName &&
//         item.category.subCategoryName &&
//         item.color &&
//         item.brand &&
//         item.size &&
//         // item.usage?.trim() &&
//         item.damages?.trim() &&
//         item.openToRent &&
//         (item.openToRent !== "Yes" || (item.pricePerDay && !isNaN(item.pricePerDay)))
//     );

//     const warehouseId = selectedKukuit.kukuitProcessingDetails.warehouseId;
//     if (!warehouseId) {
//       showNotification("Warehouse ID not found!", "error");
//       return;
//     }

//     if (!isValid) {
//       showNotification(
//         "Please fill out all required fields correctly for each item.",
//         "error"
//       );
//       return;
//     }

//     if (!token) {
//       showNotification("No token found. Please log in.", "error");
//       return;
//     }

//     const itemsWithImageUrls = await Promise.all(
//       itemForm.items.map(async (item) => {
//         const uploadedImageUrls = await Promise.all(
//           (item.photoUrls || [])
//             .filter((file) => file !== null && file !== undefined)
//             .map(async (file) => {
//               const imageFormData = new FormData();
//               imageFormData.append("file", file);
//               const response = await axios.post(
//                 `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
//                 imageFormData,
//                 {
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "multipart/form-data",
//                   },
//                 }
//               );
//               return response.data.fileUrl;
//             })
//         );

//         return {
//           name: item.name.trim(),
//           condition: item.condition,
//           description: item.description.trim(),
//           price: Number(item.price),
//           images: uploadedImageUrls,
//           // storageLocation:
//           //   item.productType === "Listing" ? item.storageLocation?.trim() || "" : "",
//           approvalStatus: item.status,
//           rejectionReason:
//             item.status === "Rejected" ? item.rejectionReason?.trim() || "" : "",
//           productType: item.productType,
//           category: item.category,
//           color: item.color,
//           brand: item.brand,
//           size: item.size,
//           // usage: item.usage.trim(),
//           damages: item.damages.trim(),
//           openToRent: item.openToRent,
//           pricePerDay: item.openToRent === "Yes" ? Number(item.pricePerDay) : undefined,
//           kukuwarehouAddress: warehouseId,
//           pickupAddress: selectedKukuit.pickupLocation,
//         };
//       })
//     );

//     // API call
//     await axios.post(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/admin/add-item/${selectedKukuit._id}`,
//       itemsWithImageUrls,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // SUCCESS: Show notification
//     showNotification("Items added successfully");

//     // 1. Reset form completely
//     setItemForm({
//       items: [
//         {
//           name: "",
//           condition: "",
//           description: "",
//           price: "",
//           photoUrls: [],
//           // storageLocation: "",
//           status: "Accepted",
//           productType: "Kukit Purchase",
//           rejectionReason: "",
//           category: { parentCategory: "", categoryName: "", subCategoryName: "" },
//           color: "",
//           brand: "",
//           size: "",
//           // usage: "",
//           damages: "",
//           openToRent: "No",
//           pricePerDay: "",
//         },
//       ],
//     });

//     setItemSelections([
//       { selectedGender: "", selectedCategory: "", selectedSubCategory: "" },
//     ]);

//     // 2. Hide form
//     setShowItemForm(false);

//     // 3. Refresh Kukuits list → table update
//     await fetchKukuits();

//     // 4. Re-open the same Kukuit in Quality stage
//     const updatedKukuit = kukuits.find((k) => k._id === selectedKukuit._id) || selectedKukuit;
//     handleKukuitClick(updatedKukuit); // This will re-determine stage → stays in "quality"

//     // 5. Ensure subStage goes to "addItems" summary view
//     // (This is handled in KukuitQuality via items.length)

//   } catch (error) {
//     console.error("Error uploading items:", error);
//     showNotification(
//       "Error uploading items: " +
//         (error.response?.data?.message || error.message),
//       "error"
//     );
//   }
// };



//   const handleCompleteQuality = async () => {
//     try {
//       if (!token) {
//         showNotification("No token found. Please log in.", "error");
//         return;
//       }
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/complete-quality-check/${selectedKukuit._id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showNotification("Quality check completed successfully");
//       fetchKukuits();
//       setSelectedKukuit(null);
//     } catch (error) {
//       console.error("Error completing quality check:", error);
//       showNotification("Error completing quality check", "error");
//     }
//   };

//   const handleAddItem = () => {
//     setItemForm({
//       items: [
//         ...itemForm.items,
//         {
//           name: "",
//           condition: "",
//           description: "",
//           price: "",
//           photoUrls: [],
//           // storageLocation: "",
//           status: "Accepted",
//           productType: "Kukit Purchase",
//           rejectionReason: "",
//           category: {
//             parentCategory: "",
//             categoryName: "",
//             subCategoryName: "",
//           },
//           color: "",
//           brand: "",
//           size: "",
//           // usage: "",
//           damages: "",
//           openToRent: "No",
//           pricePerDay: "",
//         },
//       ],
//     });
//     setItemSelections([
//       ...itemSelections,
//       { selectedGender: "", selectedCategory: "", selectedSubCategory: "" },
//     ]);
//   };

//   const removeItem = (index) => {
//     const newItems = [...itemForm.items];
//     const newSelections = [...itemSelections];
//     newItems.splice(index, 1);
//     newSelections.splice(index, 1);
//     setItemForm({ items: newItems });
//     setItemSelections(newSelections);
//   };

//   const handleFileChange = (e, index, imgIndex) => {
//     const file = e.target.files[0];
//     if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
//       const newItems = [...itemForm.items];
//       if (!newItems[index].photoUrls) newItems[index].photoUrls = [];
//       newItems[index].photoUrls[imgIndex] = file;
//       setItemForm({ items: newItems });
//     } else {
//       showNotification("Only image files (JPEG, PNG) are allowed", "error");
//     }
//   };

//   const removeImage = (index, imgIndex) => {
//     const newItems = [...itemForm.items];
//     newItems[index].photoUrls.splice(imgIndex, 1);
//     setItemForm({ items: newItems });
//   };

//   const handleItemInputChange = (e, index, field, subField) => {
//     const newItems = [...itemForm.items];
//     const newSelections = [...itemSelections];
//     const value = e.target.value;

//     if (field === "category") {
//       if (subField === "parentCategory") {
//         newSelections[index].selectedGender = value;
//         newSelections[index].selectedCategory = "";
//         newSelections[index].selectedSubCategory = "";
//         newItems[index].category = {
//           parentCategory: value,
//           categoryName: "",
//           subCategoryName: "",
//         };
//       } else if (subField === "categoryName") {
//         const categoryObj = categories[newSelections[index].selectedGender]
//           ?.flatMap((cat) => cat.categories || [])
//           .find((cat) => cat._id === value);
//         newSelections[index].selectedCategory = value;
//         newSelections[index].selectedSubCategory = "";
//         newItems[index].category.categoryName = categoryObj?.categoryName || "";
//         newItems[index].category.subCategoryName = "";
//       } else if (subField === "subCategoryName") {
//         const subCategoryObj = categories[newSelections[index].selectedGender]
//           ?.flatMap((cat) => cat.categories || [])
//           .find((cat) => cat._id === newSelections[index].selectedCategory)
//           ?.subCategories?.find((sub) => sub._id === value);
//         newSelections[index].selectedSubCategory = value;
//         newItems[index].category.subCategoryName =
//           subCategoryObj?.subCategoryName || "";
//       }
//     } else {
//       newItems[index][field] = value;
//       if (field === "status") {
//         newItems[index].productType =
//           value === "Accepted" ? "Kukit Purchase" : "Giveaway";
//       }
//     }
//     setItemForm({ items: newItems });
//     setItemSelections(newSelections);
//   };

//   const getBrandName = (item) => {
//     if (
//       item.brand &&
//       typeof item.brand === "object" &&
//       (item.brand.name || item.brand.brandName)
//     ) {
//       return item.brand.name || item.brand.brandName;
//     }
//     const brand = brands.find((b) => b._id === item.brand);
//     return brand?.brandName || brand?.name || "N/A";
//   };

//   const getConditionName = (item) => {
//     if (
//       item.condition &&
//       typeof item.condition === "object" &&
//       item.condition.conditionName
//     ) {
//       return item.condition.conditionName;
//     }
//     const condition = conditions.find((c) => c._id === item.condition);
//     return condition?.conditionName || condition?.name || "N/A";
//   };

//   const getColorName = (item) => {
//     if (item.color && typeof item.color === "object" && item.color.colorName) {
//       return item.color.colorName;
//     }
//     const color = colors.find((c) => c._id === item.color);
//     return color?.colorName || color?.name || "N/A";
//   };

//   const getSizeName = (item) => {
//     if (
//       item.size &&
//       typeof item.size === "object" &&
//       (item.size.sizeName || item.size.name)
//     ) {
//       return item.size.sizeName || item.size.name;
//     }
//     const size = sizes.find((s) => s._id === item.size);
//     return size?.sizeName || size?.name || "N/A";
//   };

//   const getCategoryName = (item) => {
//     if (item.category && item.category.categoryName) {
//       return item.category.categoryName;
//     }
//     return "N/A";
//   };

//   const getSubCategoryName = (item) => {
//     if (item.category && item.category.subCategoryName) {
//       return item.category.subCategoryName;
//     }
//     return "N/A";
//   };

//   const getGenderCategory = (item) => {
//     if (item.category && item.category.parentCategory) {
//       return item.category.parentCategory;
//     }
//     return "N/A";
//   };

//   useEffect(() => {
//     fetchReferenceData();
//     fetchKukuits();
//   }, [token]);

//   useEffect(() => {
//     if (searchQuery) {
//       const filtered = kukuits?.filter(
//         (kukuit) =>
//           kukuit?.seller?.name
//             ?.toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           kukuit?.seller?.email
//             ?.toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           kukuit?.seller?.phone?.toString()?.includes(searchQuery)
//       );
//       setFilteredKukuits(filtered);
//     } else {
//       setFilteredKukuits(kukuits);
//     }
//   }, [searchQuery, kukuits]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {notification && (
//         <div
//           className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
//             notification.type === "success"
//               ? "bg-green-50 text-green-800"
//               : "bg-red-50 text-red-800"
//           }`}
//         >
//           {notification.type === "success" ? (
//             <CheckCircle className="w-5 h-5 mr-2" />
//           ) : (
//             <AlertCircle className="w-5 h-5 mr-2" />
//           )}
//           <p>{notification.message}</p>
//           <button
//             onClick={() => setNotification(null)}
//             className="ml-4 text-gray-500 hover:text-gray-700"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Kukit Management
//           </h1>
//           <p className="mt-2 text-gray-600">
//             Manage Kukit requests and processing
//           </p>
//           <div className="mt-4 relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by name, email, or phone..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
//             />
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gradient-to-r from-pink-500 to-pink-600">
//                   <tr>
//                     {[
//                       "ID",
//                       "Order ID",
//                       "Seller",
//                       "Email",
//                       "Phone",
//                       "Location",
//                       "Status",
//                       "Customer Care",
//                       "Pickup",
//                       "Quality",
//                       "Details",
//                       "Actions",
//                     ].map((header) => (
//                       <th
//                         key={header}
//                         className="px-4 py-3 text-left text-xs font-semibold text-white"
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 bg-white">
//                   {filteredKukuits.map((kukuit, index) => {
//                     const processing = kukuit.kukuitProcessingDetails || {};
//                     return (
//                       <tr key={kukuit._id} className="hover:bg-gray-50">
//                         <td className="px-4 py-4 text-sm text-gray-600">
//                           {index + 1}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-600">
//                           {kukuit?.seller?._id}
//                         </td>
//                         <td className="px-4 py-4">
//                           {/* <div className="flex items-center"> */}
//                             {/* <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
//                               <span className="text-pink-600 font-semibold">
//                                 {kukuit?.seller?.name?.[0]}
//                               </span>
//                             </div> */}
//                             {/* <div className="text-sm font-medium text-gray-900"> */}
//                               {kukuit?.seller?.name}
//                             {/* </div> */}
//                           {/* </div> */}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-600">
//                           {kukuit?.seller?.email}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-600">
//                           {kukuit?.seller?.phone}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-600">
//                           {kukuit?.pickupLocation?.area},{" "}
//                           {kukuit?.pickupLocation?.city},{" "}
//                           {kukuit?.pickupLocation?.country}
//                         </td>
//                         <td className="px-4 py-4">
//                           <span
//                             className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
//                               kukuit.status === "pending"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : kukuit.status === "approved"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : kukuit.status === "rejected"
//                                 ? "bg-red-100 text-red-800"
//                                 : kukuit.status === "in_quality"
//                                 ? "bg-purple-100 text-purple-800"
//                                 : kukuit.status === "completed"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-gray-100 text-gray-800"
//                             }`}
//                           >
//                             {kukuit.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-600">
//                           {processing.customerCare?.confirmationStatus ||
//                             "Pending"}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-600">
//                           {processing.pickupDetails?.pickupStatus ||
//                             "Not Assigned"}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-600">
//                           {processing.qualityDetails?.qualityStatus ||
//                             "Not Started"}
//                         </td>
//                         <td className="px-4 py-4 text-right">
//                           <button
//                             onClick={() => handleKukuitClick(kukuit, "details")}
//                             className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
//                           >
//                             View Details
//                           </button>
//                         </td>
//                         <td className="px-4 py-4 text-right">
//                           <button
//                             onClick={() => handleKukuitClick(kukuit)}
//                             className="inline-flex items-center px-3 py-1 bg-pink-600 text-white rounded-md hover:bg-pink-700 text-sm"
//                           >
//                             Manage
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {selectedKukuit && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="px-8 py-6 border-b border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     Manage Kukuit #{selectedKukuit._id}
//                   </h2>
//                   <button
//                     onClick={() => setSelectedKukuit(null)}
//                     className="text-gray-400 hover:text-gray-500"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <div className="px-8 py-6">
//                 {viewMode === "details" ? (
//                   <KukuitOrderDetails selectedKukuit={selectedKukuit} />
//                 ) : (
//                   <>
//                     <KukuitProgressIndicator
//                       currentStage={currentStage}
//                       selectedKukuit={selectedKukuit}
//                     />
//                     {currentStage === "customercare" && (
//                       <KukuitDetails
//                         selectedKukuit={selectedKukuit}
//                         customerCareForm={customerCareForm}
//                         setCustomerCareForm={setCustomerCareForm}
//                         setCurrentStage={setCurrentStage}
//                         previousStage={getPreviousStage(currentStage)}
//                         showNotification={showNotification} // Added to ensure notification works
//                         token={token}
//                       />
//                     )}
//                     {currentStage === "pickup" && (
//                       <KukuitPickup
//                         pickupForm={pickupForm}
//                         setPickupForm={setPickupForm}
//                         pickupStatusForm={pickupStatusForm}
//                         setPickupStatusForm={setPickupStatusForm}
//                         handleAssignPickupTeam={handleAssignPickupTeam}
//                         handleUpdatePickupStatus={handleUpdatePickupStatus}
//                         setCurrentStage={setCurrentStage}
//                         selectedKukuit={selectedKukuit}
//                         previousStage={getPreviousStage(currentStage)}
//                       />
//                     )}
//                     {currentStage === "quality" && (
//                       <KukuitQuality
//                         handleAssignQualityTeam={handleAssignQualityTeam}
//                         showItemForm={showItemForm}
//                         setShowItemForm={setShowItemForm}
//                         itemForm={itemForm}
//                         setItemForm={setItemForm}
//                         itemSelections={itemSelections}
//                         setItemSelections={setItemSelections}
//                         categories={categories}
//                         brands={brands}
//                         conditions={conditions}
//                         sizes={sizes}
//                         colors={colors}
//                         items={items}
//                         selectedKukuit={selectedKukuit}
//                         handleAddItem={handleAddItem}
//                         removeItem={removeItem}
//                         handleFileChange={handleFileChange}
//                         removeImage={removeImage}
//                         handleItemInputChange={handleItemInputChange}
//                         handleItemUpload={handleItemUpload}
//                         handleCompleteQuality={handleCompleteQuality}
//                         setCurrentStage={setCurrentStage}
//                         previousStage={getPreviousStage(currentStage)}
//                       />
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default KUKUIT;










'use client';
// COMMENT: Next.js App Router ke liye 'use client' zaroori hai

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { AlertCircle, CheckCircle, X, Search } from "lucide-react";
import { useSelector } from "react-redux";

// COMMENT: Next.js ke liye URL handling — react-router-dom nahi chalega
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import KukuitPickup from "./KukuitPickup";
import KukuitQuality from "./KukuitQuality";
import KukuitProgressIndicator from "./kukuitProgressIndicator";
import KukuitDetails from "./kukuitDetails";
import KukuitOrderDetails from "./KukuitOrderDetails";

const KUKUIT = () => {
  // COMMENT: URL se kukuitId padho
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlKukuitId = searchParams.get('kukuitId') || '';

  // COMMENT: searchQuery ab URL se init hoga
  const [searchQuery, setSearchQuery] = useState(urlKukuitId);

  const [kukuits, setKukuits] = useState([]);
  const [filteredKukuits, setFilteredKukuits] = useState([]);
  const [selectedKukuit, setSelectedKukuit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [currentStage, setCurrentStage] = useState("customercare");
  const [colors, setColors] = useState([]);
  const [viewMode, setViewMode] = useState("");
  const token = useSelector((state) => state.otp?.token);

  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [itemSelections, setItemSelections] = useState([]);
  const [itemForm, setItemForm] = useState({
    items: [
      {
        name: "",
        condition: "",
        description: "",
        price: "",
        photoUrls: [],
        status: "Accepted",
        productType: "Kukit Purchase",
        rejectionReason: "",
        category: { parentCategory: "", categoryName: "", subCategoryName: "" },
        color: "",
        brand: "",
        size: "",
        damages: "",
        openToRent: "No",
        pricePerDay: "",
      },
    ],
  });

  const [customerCareForm, setCustomerCareForm] = useState({
    action: "",
    rejectionReason: "",
    date: "",
    time: "",
    location: "",
  });

  const [pickupForm, setPickupForm] = useState({
    assignedTeam: "",
  });

  const [pickupStatusForm, setPickupStatusForm] = useState({
    status: "scheduled",
  });

  // COMMENT: Jab itemForm.items.length change ho, itemSelections sync karo
  useEffect(() => {
    setItemSelections(
      itemForm.items.map(() => ({
        selectedGender: "",
        selectedCategory: "",
        selectedSubCategory: "",
      }))
    );
  }, [itemForm.items.length]);

  // COMMENT: Categories load hone ke baad itemSelections update karo
  useEffect(() => {
    setItemSelections(
      itemForm.items.map((item) => ({
        selectedGender: item.category.parentCategory || "",
        selectedCategory: item.category.categoryName
          ? categories[item.category.parentCategory]
              ?.find((cat) =>
                cat.categories?.some(
                  (c) => c.categoryName === item.category.categoryName
                )
              )
              ?.categories?.find(
                (c) => c.categoryName === item.category.categoryName
              )?._id || ""
          : "",
        selectedSubCategory: item.category.subCategoryName
          ? categories[item.category.parentCategory]
              ?.find((cat) =>
                cat.categories?.some(
                  (c) => c.categoryName === item.category.categoryName
                )
              )
              ?.categories?.find(
                (c) => c.categoryName === item.category.categoryName
              )
              ?.subCategories?.find(
                (sc) => sc.subCategoryName === item.category.subCategoryName
              )?._id || ""
          : "",
      }))
    );
  }, [itemForm.items, categories]);

  // COMMENT: Notification system
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // COMMENT: Reference data (brands, categories, etc.) fetch karo
  const fetchReferenceData = async () => {
    try {
      if (!token) {
        showNotification("No token found. Please log in.", "error");
        return;
      }

      const [brandsRes, categoriesRes, conditionsRes, sizesRes, colorsRes] =
        await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/getbrand`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/conditions/getcondition`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/getSizes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/getcolor`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const categoriesData = categoriesRes.data.data.reduce((acc, category) => {
        if (!acc[category.parentCategory]) {
          acc[category.parentCategory] = [];
        }
        acc[category.parentCategory].push(category);
        return acc;
      }, {});

      setCategories(categoriesData);
      setBrands(brandsRes.data.brands || []);
      setConditions(conditionsRes.data.conditions || []);
      setSizes(sizesRes.data.sizes || []);
      setColors(colorsRes.data || []);
    } catch (error) {
      console.error("Error fetching reference data:", error);
      showNotification("Failed to load reference data", "error");
    }
  };

  // COMMENT: Kukuits fetch karo — agar exact ID hai toh /get/:id, warna /get
  const fetchKukuits = async () => {
    setLoading(true);
    try {
      if (!token) {
        showNotification("No token found. Please log in.", "error");
        return;
      }

      let response;
      if (searchQuery && /^[0-9a-fA-F]{24}$/.test(searchQuery)) {
        // COMMENT: Exact 24-char MongoDB ID → direct fetch
        response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/get/${searchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.pickup ? [response.data.pickup] : [];
        setKukuits(data);
        setFilteredKukuits(data);
      } else {
        // COMMENT: All kukuits
        response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/get`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setKukuits(response.data.pickups || []);
        setFilteredKukuits(response.data.pickups || []);
      }
    } catch (error) {
      console.error("Error fetching Kukuits:", error);
      showNotification("Error fetching Kukuits", "error");
    } finally {
      setLoading(false);
    }
  };

  // COMMENT: Current stage (customercare, pickup, quality) determine karo
  const determineStage = (kukuit) => {
    const processing = kukuit?.kukuitProcessingDetails || {};
    const ccStatus = processing.customerCare?.confirmationStatus || "pending";
    const pickupStatus = processing.pickupDetails?.pickupStatus || "";
    const qualityStatus = processing.qualityDetails?.qualityStatus || "";
    const overallStatus = kukuit?.status || "pending";

    if (ccStatus === "pending" || ccStatus === "rejected")
      return "customercare";
    if (ccStatus === "approved" && pickupStatus !== "Delivered")
      return "pickup";
    if (overallStatus === "In KukuWarehouse" && pickupStatus === "Delivered" && qualityStatus !== "completed")
      return "quality";
    return "customercare";
  };

  const getPreviousStage = (currentStage) => {
    const stages = ["customercare", "pickup", "quality"];
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex > 0 ? stages[currentIndex - 1] : null;
  };

  // COMMENT: Kukuit click → modal kholo, stage set karo
  const handleKukuitClick = async (kukuit, mode = "") => {
    setSelectedKukuit(kukuit);
    setViewMode(mode);
    setCurrentStage(determineStage(kukuit));
    setShowItemForm(false);
    setCustomerCareForm({
      action: "",
      rejectionReason: "",
      date: kukuit?.kukuitProcessingDetails?.customerCare?.date || "",
      time: kukuit?.kukuitProcessingDetails?.customerCare?.time || "",
      location: kukuit?.kukuitProcessingDetails?.customerCare?.location || "",
    });
    try {
      if (!token) {
        showNotification("No token found. Please log in.", "error");
        return;
      }
      setItems(kukuit.products || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      showNotification("Error fetching items", "error");
    }
  };

  // COMMENT: URL mein searchQuery update karo (state → URL)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('kukuitId', searchQuery);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchQuery, router, pathname]);

  // COMMENT: Page load pe URL se searchQuery set karo (URL → state)
  useEffect(() => {
    if (urlKukuitId !== searchQuery) setSearchQuery(urlKukuitId);
  }, [urlKukuitId]);

  // COMMENT: Frontend filter — agar exact ID hai toh skip, warna name/email/phone/ID
  useEffect(() => {
    if (!searchQuery || /^[0-9a-fA-F]{24}$/.test(searchQuery)) {
      setFilteredKukuits(kukuits);
    } else {
      const filtered = kukuits?.filter(
        (kukuit) =>
          kukuit?.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kukuit?.seller?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kukuit?.seller?.phone?.toString()?.includes(searchQuery) ||
          kukuit?._id?.includes(searchQuery)
      );
      setFilteredKukuits(filtered);
    }
  }, [searchQuery, kukuits]);

  // COMMENT: Page load pe data fetch karo — searchQuery change hone pe bhi
  useEffect(() => {
    fetchReferenceData();
    fetchKukuits();
  }, [token, searchQuery]); // COMMENT: searchQuery dependency add ki

  // COMMENT: Baaki sab functions same hain — koi change nahi
  const handleAssignPickupTeam = async () => {
    try {
      if (!token) {
        showNotification("No token found. Please log in.", "error");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/assign-pickup-team/${selectedKukuit._id}`,
        pickupForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Pickup team assigned successfully");
      fetchKukuits();
    } catch (error) {
      console.error("Error assigning pickup team:", error);
      showNotification("Error assigning pickup team", "error");
    }
  };

  const handleUpdatePickupStatus = async () => {
    try {
      if (!token) {
        showNotification("No token found. Please log in.", "error");
        return;
      }
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/update-pickup-status/${selectedKukuit._id}`,
        { status: pickupStatusForm.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(`Pickup status updated to ${pickupStatusForm.status}`);
      fetchKukuits();
      if (pickupStatusForm.status === "delivered_to_warehouse") {
        setCurrentStage("quality");
      }
    } catch (error) {
      console.error("Error updating pickup status:", error);
      showNotification("Error updating pickup status", "error");
    }
  };

  const handleAssignQualityTeam = async () => {
    try {
      if (!token) {
        showNotification("No token found. Please log in.", "error");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/assign-quality-team/${selectedKukuit._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Quality team assigned successfully");
      fetchKukuits();
    } catch (error) {
      console.error("Error assigning quality team:", error);
      showNotification("Error assigning quality team", "error");
    }
  };

  const handleItemUpload = async () => {
    try {
      const isValid = itemForm.items.every(
        (item) =>
          item.name?.trim() &&
          item.condition &&
          item.description?.trim() &&
          item.price &&
          !isNaN(item.price) &&
          item.status &&
          item.productType &&
          (item.status !== "Rejected" || item.rejectionReason?.trim()) &&
          (item.status === "Accepted" ? item.productType === "Kukit Purchase" : true) &&
          (item.status === "Rejected" ? item.productType === "Giveaway" : true) &&
          item.category.parentCategory &&
          item.category.categoryName &&
          item.category.subCategoryName &&
          item.color &&
          item.brand &&
          item.size &&
          item.damages?.trim() &&
          item.openToRent &&
          (item.openToRent !== "Yes" || (item.pricePerDay && !isNaN(item.pricePerDay)))
      );

      const warehouseId = selectedKukuit.kukuitProcessingDetails.warehouseId;
      if (!warehouseId) {
        showNotification("Warehouse ID not found!", "error");
        return;
      }

      if (!isValid) {
        showNotification(
          "Please fill out all required fields correctly for each item.",
          "error"
        );
        return;
      }

      if (!token) {
        showNotification("No token found. Please log in.", "error");
        return;
      }

      const itemsWithImageUrls = await Promise.all(
        itemForm.items.map(async (item) => {
          const uploadedImageUrls = await Promise.all(
            (item.photoUrls || [])
              .filter((file) => file !== null && file !== undefined)
              .map(async (file) => {
                const imageFormData = new FormData();
                imageFormData.append("file", file);
                const response = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
                  imageFormData,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                return response.data.fileUrl;
              })
          );

          return {
            name: item.name.trim(),
            condition: item.condition,
            description: item.description.trim(),
            price: Number(item.price),
            images: uploadedImageUrls,
            approvalStatus: item.status,
            rejectionReason:
              item.status === "Rejected" ? item.rejectionReason?.trim() || "" : "",
            productType: item.productType,
            category: item.category,
            color: item.color,
            brand: item.brand,
            size: item.size,
            damages: item.damages.trim(),
            openToRent: item.openToRent,
            pricePerDay: item.openToRent === "Yes" ? Number(item.pricePerDay) : undefined,
            kukuwarehouAddress: warehouseId,
            pickupAddress: selectedKukuit.pickupLocation,
          };
        })
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/admin/add-item/${selectedKukuit._id}`,
        itemsWithImageUrls,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showNotification("Items added successfully");

      setItemForm({
        items: [
          {
            name: "",
            condition: "",
            description: "",
            price: "",
            photoUrls: [],
            status: "Accepted",
            productType: "Kukit Purchase",
            rejectionReason: "",
            category: { parentCategory: "", categoryName: "", subCategoryName: "" },
            color: "",
            brand: "",
            size: "",
            damages: "",
            openToRent: "No",
            pricePerDay: "",
          },
        ],
      });

      setItemSelections([
        { selectedGender: "", selectedCategory: "", selectedSubCategory: "" },
      ]);

      setShowItemForm(false);
      await fetchKukuits();

      const updatedKukuit = kukuits.find((k) => k._id === selectedKukuit._id) || selectedKukuit;
      handleKukuitClick(updatedKukuit);

    } catch (error) {
      console.error("Error uploading items:", error);
      showNotification(
        "Error uploading items: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    }
  };

  const handleCompleteQuality = async () => {
    try {
      if (!token) {
        showNotification("No token found. Please log in.", "error");
        return;
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/kukuits/complete-quality-check/${selectedKukuit._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Quality check completed successfully");
      fetchKukuits();
      setSelectedKukuit(null);
    } catch (error) {
      console.error("Error completing quality check:", error);
      showNotification("Error completing quality check", "error");
    }
  };

  const handleAddItem = () => {
    setItemForm({
      items: [
        ...itemForm.items,
        {
          name: "",
          condition: "",
          description: "",
          price: "",
          photoUrls: [],
          status: "Accepted",
          productType: "Kukit Purchase",
          rejectionReason: "",
          category: {
            parentCategory: "",
            categoryName: "",
            subCategoryName: "",
          },
          color: "",
          brand: "",
          size: "",
          damages: "",
          openToRent: "No",
          pricePerDay: "",
        },
      ],
    });
    setItemSelections([
      ...itemSelections,
      { selectedGender: "", selectedCategory: "", selectedSubCategory: "" },
    ]);
  };

  const removeItem = (index) => {
    const newItems = [...itemForm.items];
    const newSelections = [...itemSelections];
    newItems.splice(index, 1);
    newSelections.splice(index, 1);
    setItemForm({ items: newItems });
    setItemSelections(newSelections);
  };

  const handleFileChange = (e, index, imgIndex) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      const newItems = [...itemForm.items];
      if (!newItems[index].photoUrls) newItems[index].photoUrls = [];
      newItems[index].photoUrls[imgIndex] = file;
      setItemForm({ items: newItems });
    } else {
      showNotification("Only image files (JPEG, PNG) are allowed", "error");
    }
  };

  const removeImage = (index, imgIndex) => {
    const newItems = [...itemForm.items];
    newItems[index].photoUrls.splice(imgIndex, 1);
    setItemForm({ items: newItems });
  };

  const handleItemInputChange = (e, index, field, subField) => {
    const newItems = [...itemForm.items];
    const newSelections = [...itemSelections];
    const value = e.target.value;

    if (field === "category") {
      if (subField === "parentCategory") {
        newSelections[index].selectedGender = value;
        newSelections[index].selectedCategory = "";
        newSelections[index].selectedSubCategory = "";
        newItems[index].category = {
          parentCategory: value,
          categoryName: "",
          subCategoryName: "",
        };
      } else if (subField === "categoryName") {
        const categoryObj = categories[newSelections[index].selectedGender]
          ?.flatMap((cat) => cat.categories || [])
          .find((cat) => cat._id === value);
        newSelections[index].selectedCategory = value;
        newSelections[index].selectedSubCategory = "";
        newItems[index].category.categoryName = categoryObj?.categoryName || "";
        newItems[index].category.subCategoryName = "";
      } else if (subField === "subCategoryName") {
        const subCategoryObj = categories[newSelections[index].selectedGender]
          ?.flatMap((cat) => cat.categories || [])
          .find((cat) => cat._id === newSelections[index].selectedCategory)
          ?.subCategories?.find((sub) => sub._id === value);
        newSelections[index].selectedSubCategory = value;
        newItems[index].category.subCategoryName =
          subCategoryObj?.subCategoryName || "";
      }
    } else {
      newItems[index][field] = value;
      if (field === "status") {
        newItems[index].productType =
          value === "Accepted" ? "Kukit Purchase" : "Giveaway";
      }
    }
    setItemForm({ items: newItems });
    setItemSelections(newSelections);
  };

  const getBrandName = (item) => {
    if (
      item.brand &&
      typeof item.brand === "object" &&
      (item.brand.name || item.brand.brandName)
    ) {
      return item.brand.name || item.brand.brandName;
    }
    const brand = brands.find((b) => b._id === item.brand);
    return brand?.brandName || brand?.name || "N/A";
  };

  const getConditionName = (item) => {
    if (
      item.condition &&
      typeof item.condition === "object" &&
      item.condition.conditionName
    ) {
      return item.condition.conditionName;
    }
    const condition = conditions.find((c) => c._id === item.condition);
    return condition?.conditionName || condition?.name || "N/A";
  };

  const getColorName = (item) => {
    if (item.color && typeof item.color === "object" && item.color.colorName) {
      return item.color.colorName;
    }
    const color = colors.find((c) => c._id === item.color);
    return color?.colorName || color?.name || "N/A";
  };

  const getSizeName = (item) => {
    if (
      item.size &&
      typeof item.size === "object" &&
      (item.size.sizeName || item.size.name)
    ) {
      return item.size.sizeName || item.size.name;
    }
    const size = sizes.find((s) => s._id === item.size);
    return size?.sizeName || size?.name || "N/A";
  };

  const getCategoryName = (item) => {
    if (item.category && item.category.categoryName) {
      return item.category.categoryName;
    }
    return "N/A";
  };

  const getSubCategoryName = (item) => {
    if (item.category && item.category.subCategoryName) {
      return item.category.subCategoryName;
    }
    return "N/A";
  };

  const getGenderCategory = (item) => {
    if (item.category && item.category.parentCategory) {
      return item.category.parentCategory;
    }
    return "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          <p>{notification.message}</p>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Kukit Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage Kukit requests and processing
          </p>
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-pink-500 to-pink-600">
                  <tr>
                    {[
                      "ID",
                      "Order ID",
                      "Seller",
                      "Email",
                      "Phone",
                      "Location",
                      "Status",
                      "Customer Care",
                      "Pickup",
                      "Quality",
                      "Details",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-semibold text-white"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredKukuits.map((kukuit, index) => {
                    const processing = kukuit.kukuitProcessingDetails || {};
                    return (
                      <tr key={kukuit._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {kukuit?._id}
                        </td>
                        <td className="px-4 py-4">
                          {kukuit?.seller?.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {kukuit?.seller?.email}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {kukuit?.seller?.phone}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {kukuit?.pickupLocation?.area},{" "}
                          {kukuit?.pickupLocation?.city},{" "}
                          {kukuit?.pickupLocation?.country}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              kukuit.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : kukuit.status === "approved"
                                ? "bg-blue-100 text-blue-800"
                                : kukuit.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : kukuit.status === "in_quality"
                                ? "bg-purple-100 text-purple-800"
                                : kukuit.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {kukuit.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {processing.customerCare?.confirmationStatus ||
                            "Pending"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {processing.pickupDetails?.pickupStatus ||
                            "Not Assigned"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {processing.qualityDetails?.qualityStatus ||
                            "Not Started"}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => handleKukuitClick(kukuit, "details")}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            View Details
                          </button>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => handleKukuitClick(kukuit)}
                            className="inline-flex items-center px-3 py-1 bg-pink-600 text-white rounded-md hover:bg-pink-700 text-sm"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedKukuit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Manage Kukuit #{selectedKukuit._id}
                  </h2>
                  <button
                    onClick={() => setSelectedKukuit(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="px-8 py-6">
                {viewMode === "details" ? (
                  <KukuitOrderDetails selectedKukuit={selectedKukuit} />
                ) : (
                  <>
                    <KukuitProgressIndicator
                      currentStage={currentStage}
                      selectedKukuit={selectedKukuit}
                    />
                    {currentStage === "customercare" && (
                      <KukuitDetails
                        selectedKukuit={selectedKukuit}
                        customerCareForm={customerCareForm}
                        setCustomerCareForm={setCustomerCareForm}
                        setCurrentStage={setCurrentStage}
                        previousStage={getPreviousStage(currentStage)}
                        showNotification={showNotification}
                        token={token}
                      />
                    )}
                    {currentStage === "pickup" && (
                      <KukuitPickup
                        pickupForm={pickupForm}
                        setPickupForm={setPickupForm}
                        pickupStatusForm={pickupStatusForm}
                        setPickupStatusForm={setPickupStatusForm}
                        handleAssignPickupTeam={handleAssignPickupTeam}
                        handleUpdatePickupStatus={handleUpdatePickupStatus}
                        setCurrentStage={setCurrentStage}
                        selectedKukuit={selectedKukuit}
                        previousStage={getPreviousStage(currentStage)}
                      />
                    )}
                    {currentStage === "quality" && (
                      <KukuitQuality
                        handleAssignQualityTeam={handleAssignQualityTeam}
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
                        handleCompleteQuality={handleCompleteQuality}
                        setCurrentStage={setCurrentStage}
                        previousStage={getPreviousStage(currentStage)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KUKUIT;