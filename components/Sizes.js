// import React, { useState, useEffect } from "react";
// import { Search, Plus, Trash2, Edit2, X } from "lucide-react";
// import axios from "axios";
// import Cookies from "js-cookie";

// export const Sizes = () => {
//   const [sizes, setSizes] = useState([]);
//   const [filteredSizes, setFilteredSizes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editingSize, setEditingSize] = useState(null);
//   const [error, setError] = useState("");
//   const [newSize, setNewSize] = useState({ sizeName: "", status: "" });

//   useEffect(() => {
//     fetchSizes();
//   }, []);

//   const fetchSizes = async () => {
//     try {
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/getSizes`);
//       setSizes(response.data.sizes);
//       setFilteredSizes(response.data.sizes);
//     } catch (error) {
//       console.error("Error fetching sizes:", error);
//       setFilteredSizes([]);
//     }
//   };

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = sizes.filter((size) =>
//         size.sizeName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredSizes(filtered);
//     } else {
//       setFilteredSizes(sizes);
//     }
//   }, [searchTerm, sizes]);

//   const getToken = () => {
//     const tokenCookie = Cookies.get("token");
//     if (!tokenCookie) return null;
    
//     try {
//       return JSON.parse(tokenCookie);
//     } catch (error) {
//       // If token isn't JSON, return it as-is (it might be a simple string)
//       return tokenCookie;
//     }
//   };

//   const handleAddSize = async () => {
//     if (!newSize.sizeName) {
//       setError("Size name is required");
//       return;
//     }

//     if (!newSize.status) {
//       setError("Status is required");
//       return;
//     }

//     try {
//       const token = getToken();
//       if (!token) {
//         setError("Authentication required. Please log in again.");
//         return;
//       }

//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/addsize`,
//         { sizeName: newSize.sizeName, status: newSize.status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchSizes();
//       setShowModal(false);
//       setNewSize({ sizeName: "", status: "" });
//       setError("");
//     } catch (error) {
//       console.error("Detailed error:", {
//         response: error.response?.data,
//         status: error.response?.status,
//         message: error.message
//       });
//       setError(error.response?.data?.message || "Failed to add size");
//     }
//   };

//   const handleEditSize = async () => {
//     if (!newSize.sizeName) {
//       setError("Size name is required");
//       return;
//     }

//     if (!newSize.status) {
//       setError("Status is required");
//       return;
//     }

//     try {
//       const token = getToken();
//       if (!token) {
//         setError("Authentication required. Please log in again.");
//         return;
//       }
      
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/editsize/${editingSize._id}`,
//         { sizeName: newSize.sizeName, status: newSize.status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchSizes();
//       setShowModal(false);
//       setEditingSize(null);
//       setNewSize({ sizeName: "", status: "" });
//       setError("");
//     } catch (error) {
//       console.error("Detailed error:", {
//         response: error.response?.data,
//         status: error.response?.status,
//         message: error.message
//       });
//       setError(error.response?.data?.message || "Failed to edit size");
//     }
//   };

//   const handleDeleteSize = async (sizeId) => {
//     if (window.confirm("Are you sure you want to delete this size?")) {
//       try {
//         const token = getToken();
//         if (!token) {
//           alert("Authentication required. Please log in again.");
//           return;
//         }
        
//         await axios.delete(
//          `${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/deletesize/${sizeId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         fetchSizes();
//       } catch (error) {
//         console.error("Detailed error:", {
//           response: error.response?.data,
//           status: error.response?.status,
//           message: error.message
//         });
//         alert(error.response?.data?.message || "Failed to delete size");
//       }
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">Size Management</h1>
//           <button
//             onClick={() => {
//               setEditingSize(null);
//               setNewSize({ sizeName: "", status: "" });
//               setShowModal(true);
//             }}
//             className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
//           >
//             <Plus className="w-4 h-4 mr-2" /> Add Size
//           </button>
//         </div>
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search sizes..."
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
//               <th className="px-6 py-3 text-left">Size</th>
//               <th className="px-6 py-3 text-left">Status</th>
//               <th className="px-6 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSizes.length > 0 ? (
//               filteredSizes.map((size) => (
//                 <tr key={size._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">{size.sizeName}</td>
//                   <td className="px-6 py-4">{size.status}</td>
//                   <td className="px-6 py-4 flex space-x-2">
//                     <button
//                       onClick={() => {
//                         setEditingSize(size);
//                         setNewSize({ sizeName: size.sizeName, status: size.status });
//                         setShowModal(true);
//                       }}
//                       className="p-1 text-gray-400 hover:text-gray-500"
//                     >
//                       <Edit2 className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteSize(size._id)}
//                       className="p-1 text-gray-400 hover:text-red-500"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No sizes found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for adding/editing sizes */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">
//                 {editingSize ? "Edit Size" : "Add New Size"}
//               </h2>
//               <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             {error && <div className="text-red-500 mb-4">{error}</div>}
            
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Size Name</label>
//               <input
//                 type="text"
//                 value={newSize.sizeName}
//                 onChange={(e) => setNewSize({...newSize, sizeName: e.target.value})}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
            
//             <div className="mb-6">
//               <label className="block text-gray-700 mb-2">Status</label>
//               <select
//                 value={newSize.status}
//                 onChange={(e) => setNewSize({...newSize, status: e.target.value})}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 <option value="">Select Status</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>
            
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 text-gray-600 mr-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={editingSize ? handleEditSize : handleAddSize}
//                 className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
//               >
//                 {editingSize ? "Save Changes" : "Add Size"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sizes;








import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, Edit2, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

export const Sizes = () => {
  const [sizes, setSizes] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [error, setError] = useState("");
  const [newSize, setNewSize] = useState({ sizeName: "", status: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/getSizes`);
      setSizes(response.data.sizes || []);
      setFilteredSizes(response.data.sizes || []);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      setFilteredSizes([]);
      setError("Failed to fetch sizes.");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = sizes.filter((size) =>
        size.sizeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSizes(filtered);
    } else {
      setFilteredSizes(sizes);
    }
  }, [searchTerm, sizes]);

  const getToken = () => {
    const tokenCookie = Cookies.get("token");
    if (!tokenCookie) return null;
    try {
      return JSON.parse(tokenCookie);
    } catch (error) {
      return tokenCookie;
    }
  };

  const handleAddSize = async () => {
    if (!newSize.sizeName) {
      setError("Size name is required");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/addsize`,
        { sizeName: newSize.sizeName, status: newSize.status || "Active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSizes();
      setShowModal(false);
      setNewSize({ sizeName: "", status: "" });
      setError("");
    } catch (error) {
      console.error("Add Size Error:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to add size");
    }
  };

  const handleEditSize = async () => {
    if (!newSize.sizeName) {
      setError("Size name is required");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/editsize/${editingSize._id}`,
        { sizeName: newSize.sizeName, status: newSize.status || "Active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSizes();
      setShowModal(false);
      setEditingSize(null);
      setNewSize({ sizeName: "", status: "" });
      setError("");
    } catch (error) {
      console.error("Edit Size Error:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to edit size");
    }
  };

  const handleDeleteSize = async (sizeId) => {
    if (window.confirm("Are you sure you want to delete this size?")) {
      try {
        const token = getToken();
        if (!token) {
          setError("Authentication required. Please log in again.");
          return;
        }

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/deletesize/${sizeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchSizes();
      } catch (error) {
        console.error("Delete Size Error:", error.response?.data || error);
        setError(error.response?.data?.message || "Failed to delete size");
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
      const token = getToken();
      if (!token) {
        setError("Authentication required. Please log in again.");
        return;
      }

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
      console.log("Sending fileUrl to: /sizes/upload-bulk");
      const bulkResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/upload-bulk`,
        { fileUrl: uploadResponse.data.fileUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Bulk response:", bulkResponse.data);

      fetchSizes();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;

      // Show detailed success/error message
      let alertMessage = bulkResponse.data.message;
      if (bulkResponse.data.addedCount) {
        alertMessage += ` (${bulkResponse.data.addedCount} sizes added)`;
      }
      if (bulkResponse.data.duplicates) {
        alertMessage += ` Duplicates skipped: ${bulkResponse.data.duplicates.join(", ")}`;
      }
      alert(alertMessage);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to process sizes.";
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
          <h1 className="text-3xl font-bold text-gray-900">Size Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setEditingSize(null);
                setNewSize({ sizeName: "", status: "" });
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Size
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
                href="data:text/csv;charset=utf-8,sizeName,status%0AS,Active%0AM,Inactive%0AL,Active"
                download="sample_sizes.csv"
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
            placeholder="Search sizes..."
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
              <th className="px-6 py-3 text-left">Size</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSizes.length > 0 ? (
              filteredSizes.map((size) => (
                <tr key={size._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{size.sizeName}</td>
                  <td className="px-6 py-4">{size.status}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingSize(size);
                        setNewSize({ sizeName: size.sizeName, status: size.status });
                        setShowModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSize(size._id)}
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
                  No sizes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingSize ? "Edit Size" : "Add New Size"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Size Name</label>
              <input
                type="text"
                value={newSize.sizeName}
                onChange={(e) => setNewSize({ ...newSize, sizeName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                value={newSize.status}
                onChange={(e) => setNewSize({ ...newSize, status: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={editingSize ? handleEditSize : handleAddSize}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                {editingSize ? "Save Changes" : "Add Size"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sizes;