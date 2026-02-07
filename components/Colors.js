// import React, { useState, useEffect } from "react";
// import { Search, Plus, Trash2, Edit2, X } from "lucide-react";
// import axios from "axios";
// import Cookies from "js-cookie";

// export const Colors = () => {
//   const [colors,setColors] = useState([]);
//   const [filteredColors, setFilteredColors] = useState([]); // Initialize as an empty array
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editingColors, setEditingColors] = useState(null);
//   const [error, setError] = useState("");
//   const [newColors, setNewColors] = useState({ colorName: "", status: "" });



//   // const token = JSON.parse(Cookies.get("token"));

  
//   useEffect(() => {
//     fetchColors();
//   }, []);



//   const fetchColors = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/getcolor`
//       );
  
//       console.log("Fetched Colors:", response.data); // this is the array
//       setColors(response.data);
//       setFilteredColors(response.data);
//     } catch (error) {
//       console.error("Error fetching colors:", error);
//       setFilteredColors([]);
//     }
//   };

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = colors.filter((color) =>
//         color.colorName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredColors(filtered);
//     } else {
//       setFilteredColors(colors);
//     }
//   }, [searchTerm, colors]);

//   const handleAddColor = async () => {
//     if (!newColors.colorName) {
//       setError("Color  are required");
//       return;
//     }

//     try {
//       const token = JSON.parse(Cookies.get("token"));
//     console.log(token,"uuuu")

//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/addcolor`,
//         {
//           colorName: newColors.colorName,
//           status: newColors.status,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       fetchColors();
//       setShowModal(false);
//       setNewColors({ colorName: "", status: "" });
//       setError("");
//     } catch (error) {
//       setError("Failed to add banner");
//       console.error(error);
//     }
//   };

//   const handleEditColor = async () => {
//     if (!newColors.colorName || !newColors.status) {
//       setError("Colors  are required");
//       return;
//     }

//     try {
//       const token = Cookies.get("token"); // Ensure the correct key is used
//       if (!token) {
//         console.error("Token is missing");
//         setError("Authentication error. Please log in again.");
//         return;
//       }

//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/editcolor/${editingColors._id}`,
//         {
//           colorName: newColors.colorName,
//           status: newColors.status,
//         },
//         {
//           headers: { Authorization: `Bearer ${JSON.parse(token)}` },
//         }
//       );

//       fetchColors();
//       setShowModal(false);
//       setEditingColors(null);
//       setNewColors({ colorName: "", status: "" });
//       setError("");
//     } catch (error) {
//       setError("Failed to edit banner");
//       console.error(error);
//     }
//   };

//   const handleDeleteColor = async (colorId) => {
//     if (window.confirm("Are you sure you want to delete this banner?")) {
//       try {
//         const token = JSON.parse(Cookies.get("token"));
//         await axios.delete(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/deletecolor/${colorId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         fetchColors();
//       } catch (error) {
//         console.error("Error deleting banner:", error);
//       }
//     }
//   };


//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">Color Management</h1>
//           <button
//             onClick={() => {
//               setEditingColors(null);
//               setNewColors({ colorName: "", status: "" });
//               setShowModal(true);
//             }}
//             className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
//           >
//             <Plus className="w-4 h-4 mr-2" /> Add Color
//           </button>
//         </div>
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search banners by title..."
//             className="pl-10 pr-4 py-2 w-full border rounded-lg"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-6 py-3 text-left">color</th>
//               <th className="px-6 py-3 text-left">Status</th>
//               <th className="px-6 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//   {filteredColors && filteredColors.length > 0 ? (
//     filteredColors.map((color) => (
//       <tr key={color._id} className="hover:bg-gray-50">
//         <td className="px-6 py-4">{color.colorName}</td>
//         <td className="px-6 py-4">{color.status}</td> {/* Added status here */}
//         <td className="px-6 py-4 flex space-x-2">
//           <button
//             onClick={() => {
//               setEditingColors(color);
//               setNewColors({
//                 colorName: color.colorName,
//                 status: color.status,
//               });
//               setShowModal(true);
//             }}
//             className="p-1 text-gray-400 hover:text-gray-500"
//           >
//             <Edit2 className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => handleDeleteColor(color._id)}
//             className="p-1 text-gray-400 hover:text-red-500"
//           >
//             <Trash2 className="w-5 h-5" />
//           </button>
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
//         No colors found.
//       </td>
//     </tr>
//   )}
// </tbody>

//         </table>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//             <div
//               className="fixed inset-0 transition-opacity"
//               aria-hidden="true"
//             >
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     {editingColors ? "Edit Color" : "Add New Color"}
//                   </h3>
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="text-gray-400 hover:text-gray-500"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//                 {error && (
//                   <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
//                     {error}
//                   </div>
//                 )}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Color Name
//                     </label>
//                     <input
//                       type="text"
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                       value={newColors.colorName}
//                       onChange={(e) =>
//                         setNewColors({ ...newColors, colorName: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Status
//                     </label>
//                     <select
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                       value={newColors.status}
//                       onChange={(e) =>
//                         setNewColors({ ...newColors, status: e.target.value })
//                       }
//                     >
//                       <option value="Active">Active</option>
//                       <option value="Inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   onClick={editingColors ? handleEditColor : handleAddColor}
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 sm:ml-3 sm:w-auto sm:text-sm"
//                 >
//                   {editingColors ? "Save Changes" : "Add Color"}
//                 </button>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Colors;








import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, Edit2, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

export const Colors = () => {
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [error, setError] = useState("");
  const [newColor, setNewColor] = useState({ colorName: "", status: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/getcolor`
      );
      console.log("Fetched Colors:", response.data);
      setColors(response.data || []);
      setFilteredColors(response.data || []);
    } catch (error) {
      console.error("Error fetching colors:", error);
      setFilteredColors([]);
      setError("Failed to fetch colors.");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = colors.filter((color) =>
        color.colorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredColors(filtered);
    } else {
      setFilteredColors(colors);
    }
  }, [searchTerm, colors]);

  const handleAddColor = async () => {
    if (!newColor.colorName) {
      setError("Color name is required");
      return;
    }

    try {
      const token = JSON.parse(Cookies.get("token"));
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/addcolor`,
        {
          colorName: newColor.colorName,
          status: newColor.status || "Active",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchColors();
      setShowModal(false);
      setNewColor({ colorName: "", status: "" });
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add color");
      console.error(error);
    }
  };

  const handleEditColor = async () => {
    if (!newColor.colorName) {
      setError("Color name is required");
      return;
    }

    try {
      const token = JSON.parse(Cookies.get("token"));
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/editcolor/${editingColor._id}`,
        {
          colorName: newColor.colorName,
          status: newColor.status || "Active",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchColors();
      setShowModal(false);
      setEditingColor(null);
      setNewColor({ colorName: "", status: "" });
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to edit color");
      console.error(error);
    }
  };

  const handleDeleteColor = async (colorId) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        const token = JSON.parse(Cookies.get("token"));
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/deletecolor/${colorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchColors();
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete color");
        console.error(error);
      }
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
      const token = JSON.parse(Cookies.get("token"));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "csv_uploads");

      // Step 1: Upload CSV to S3
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

      // Step 2: Process CSV
      console.log("Sending fileUrl to: /colors/upload-bulk");
      const bulkResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/colors/upload-bulk`,
        { fileUrl: uploadResponse.data.fileUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Bulk response:", bulkResponse.data);

      fetchColors();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      alert(`${bulkResponse.data.message} (${bulkResponse.data.count || 0} colors added)`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to process colors.";
      const duplicates = error.response?.data?.duplicates
        ? `Duplicates: ${error.response.data.duplicates.join(", ")}`
        : "";
      const errors = error.response?.data?.errors
        ? `Errors: ${error.response.data.errors.join(", ")}`
        : "";
      setError(`${errorMessage} ${duplicates} ${errors}`.trim());
      console.error("Bulk upload error:", error.response?.data || error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Color Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setEditingColor(null);
                setNewColor({ colorName: "", status: "" });
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Color
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
                href="data:text/csv;charset=utf-8,colorName,status%0ARed,Active%0ABlue,Inactive"
                download="sample_colors.csv"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Sample CSV
              </a>
            </div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search colors by name..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Color</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredColors && filteredColors.length > 0 ? (
              filteredColors.map((color) => (
                <tr key={color._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{color.colorName}</td>
                  <td className="px-6 py-4">{color.status}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingColor(color);
                        setNewColor({
                          colorName: color.colorName,
                          status: color.status,
                        });
                        setShowModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteColor(color._id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No colors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingColor ? "Edit Color" : "Add New Color"}
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Color Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={newColor.colorName}
                      onChange={(e) =>
                        setNewColor({ ...newColor, colorName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={newColor.status}
                      onChange={(e) =>
                        setNewColor({ ...newColor, status: e.target.value })
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={editingColor ? handleEditColor : handleAddColor}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingColor ? "Save Changes" : "Add Color"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Colors;