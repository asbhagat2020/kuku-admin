

// import React, { useState, useEffect, useRef } from "react";
// import { Search, Plus, Trash2, Edit2, X } from "lucide-react";
// import axios from "axios";
// import Cookies from "js-cookie";

// export const Brands = () => {
//   const [brand, setBrand] = useState([]);
//   const [filteredBrands, setFilteredBrands] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [editingBrand, setEditingBrand] = useState(null);
//   const [error, setError] = useState("");
//   const [newBrand, setNewBrand] = useState({ brandName: "", status: "" });
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null); // For clearing file input

//   useEffect(() => {
//     fetchBrands();
//   }, []);

//   const fetchBrands = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/getbrand`
//       );
//       setBrand(response.data.brands || []);
//       setFilteredBrands(response.data.brands || []);
//     } catch (error) {
//       console.error("Error fetching brands:", error);
//       setFilteredBrands([]);
//       setError("Failed to fetch brands.");
//     }
//   };

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = brand.filter((banner) =>
//         banner.brandName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredBrands(filtered);
//     } else {
//       setFilteredBrands(brand);
//     }
//   }, [searchTerm, brand]);

//   const handleAddBrand = async () => {
//     if (!newBrand.brandName) {
//       setError("Brand name is required");
//       return;
//     }

//     try {
//       const token = JSON.parse(Cookies.get("token"));
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/addbrand`,
//         {
//           brandName: newBrand.brandName,
//           status: newBrand.status || "Active",
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       fetchBrands();
//       setShowModal(false);
//       setNewBrand({ brandName: "", status: "" });
//       setError("");
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to add brand");
//       console.error(error);
//     }
//   };

//   const handleEditBrand = async () => {
//     if (!newBrand.brandName) {
//       setError("Brand name is required");
//       return;
//     }

//     try {
//       const token = JSON.parse(Cookies.get("token"));
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/editbrand/${editingBrand._id}`,
//         {
//           brandName: newBrand.brandName,
//           status: newBrand.status || "Active",
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       fetchBrands();
//       setShowModal(false);
//       setEditingBrand(null);
//       setNewBrand({ brandName: "", status: "" });
//       setError("");
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to edit brand");
//       console.error(error);
//     }
//   };

//   const handleDeleteBrand = async (brandId) => {
//     if (window.confirm("Are you sure you want to delete this brand?")) {
//       try {
//         const token = JSON.parse(Cookies.get("token"));
//         await axios.delete(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/deletebrand/${brandId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         fetchBrands();
//       } catch (error) {
//         setError(error.response?.data?.message || "Failed to delete brand");
//         console.error(error);
//       }
//     }
//   };


// const handleBulkUpload = async () => {
//   if (!file) {
//     setError("Please select a CSV file.");
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = async (e) => {
//     try {
//       const text = e.target.result;
//       const lines = text.split("\n").map(l => l.trim()).filter(l => l !== "");
//       if (lines.length <= 1) {
//         alert("CSV is empty or has only header.");
//         return;
//       }

//       const validLines = lines.slice(1).filter(line => {
//         const cols = line.split(",");
//         return cols[0]?.trim() !== "";
//       });

//       if (validLines.length === 0) {
//         alert("No valid brands found in CSV!");
//         return;
//       }

//       if (!confirm(`${validLines.length} brand(s) will be processed.\nContinue?`)) {
//         setFile(null);
//         if (fileInputRef.current) fileInputRef.current.value = null;
//         return;
//       }

//       setUploading(true);
//       setError("");

//       const token = JSON.parse(Cookies.get("token"));
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("folder", "csv_uploads");

//       const uploadRes = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const bulkRes = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/upload-bulk`,
//         { fileUrl: uploadRes.data.fileUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const data = bulkRes.data;
//       fetchBrands();

//       alert(
//         `Upload Complete!\n\n` +
//         `Added: ${data.inserted} new brand(s)\n` +
//         `Skipped: ${data.skipped} (already exist)\n` +
//         `Total Processed: ${data.totalProcessed}`
//       );

//       setFile(null);
//       if (fileInputRef.current) fileInputRef.current.value = null;

//     } catch (error) {
//       const msg = error.response?.data?.message || "Upload failed.";
//       const dup = error.response?.data?.duplicates 
//         ? `\nSkipped Duplicates: ${error.response.data.duplicates.join(", ")}` 
//         : "";
//       const err = error.response?.data?.errors 
//         ? `\nWarnings: ${error.response.data.errors.join("\n")}` 
//         : "";

//       setError(msg + dup + err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   reader.readAsText(file);
// };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
//           <div className="flex space-x-4">
//             <button
//               onClick={() => {
//                 setEditingBrand(null);
//                 setNewBrand({ brandName: "", status: "" });
//                 setShowModal(true);
//               }}
//               className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
//             >
//               <Plus className="w-4 h-4 mr-2" /> Add Brand
//             </button>
//             <div className="flex items-center space-x-2">
//               <input
//                 type="file"
//                 accept=".csv"
//                 ref={fileInputRef}
//                 onChange={(e) => setFile(e.target.files[0])}
//                 className="border rounded-lg p-2 text-sm"
//                 disabled={uploading}
//               />
//               <button
//                 onClick={handleBulkUpload}
//                 disabled={uploading}
//                 className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
//                   uploading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {uploading ? "Processing..." : "Upload CSV"}
//               </button>
//               <a
//                 href="data:text/csv;charset=utf-8,brandName,status%0ANike,Active%0AAdidas,Inactive"
//                 download="sample_brands.csv"
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
//               >
//                 Sample CSV
//               </a>
//             </div>
//           </div>
//         </div>
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search brands by name..."
//             className="pl-10 pr-4 py-2 w-full border rounded-lg"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-6 py-3 text-left">Brand</th>
//               <th className="px-6 py-3 text-left">Status</th>
//               <th className="px-6 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredBrands && filteredBrands.length > 0 ? (
//               filteredBrands.map((banner) => (
//                 <tr key={banner._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">{banner.brandName}</td>
//                   <td className="px-6 py-4">{banner.status}</td>
//                   <td className="px-6 py-4 flex space-x-2">
//                     <button
//                       onClick={() => {
//                         setEditingBrand(banner);
//                         setNewBrand({
//                           brandName: banner.brandName,
//                           status: banner.status,
//                         });
//                         setShowModal(true);
//                       }}
//                       className="p-1 text-gray-400 hover:text-gray-500"
//                     >
//                       <Edit2 className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteBrand(banner._id)}
//                       className="p-1 text-gray-400 hover:text-red-500"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
//                   No brands found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     {editingBrand ? "Edit Brand" : "Add New Brand"}
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
//                       Brand Name
//                     </label>
//                     <input
//                       type="text"
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                       value={newBrand.brandName}
//                       onChange={(e) =>
//                         setNewBrand({ ...newBrand, brandName: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Status
//                     </label>
//                     <select
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                       value={newBrand.status}
//                       onChange={(e) =>
//                         setNewBrand({ ...newBrand, status: e.target.value })
//                       }
//                     >
//                       <option value="">Select Status</option>
//                       <option value="Active">Active</option>
//                       <option value="Inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   onClick={editingBrand ? handleEditBrand : handleAddBrand}
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 sm:ml-3 sm:w-auto sm:text-sm"
//                 >
//                   {editingBrand ? "Save Changes" : "Add Brand"}
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

// export default Brands;







import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, Edit2, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

// Import Pagination Component (same folder mein hona chahiye)
import { Pagination } from "./Pagination";

export const Brands = () => {
  const [brand, setBrand] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [error, setError] = useState("");
  const [newBrand, setNewBrand] = useState({ brandName: "", status: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage, setBrandsPerPage] = useState(10);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/getbrand`
      );
      const brandsData = response.data.brands || [];
      setBrand(brandsData);
      setFilteredBrands(brandsData);
      setCurrentPage(1); // Reset page after refresh
    } catch (error) {
      console.error("Error fetching brands:", error);
      setFilteredBrands([]);
      setError("Failed to fetch brands.");
    }
  };

  // Search Filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBrands(brand);
    } else {
      const filtered = brand.filter((b) =>
        b.brandName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, brand]);

  // Pagination Logic
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstBrand, indexOfLastBrand);
  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleBrandsPerPageChange = (e) => {
    setBrandsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Add Brand
  const handleAddBrand = async () => {
    if (!newBrand.brandName.trim()) {
      setError("Brand name is required");
      return;
    }

    try {
      const token = JSON.parse(Cookies.get("token"));
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/addbrand`,
        {
          brandName: newBrand.brandName.trim(),
          status: newBrand.status || "Active",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchBrands();
      setShowModal(false);
      setNewBrand({ brandName: "", status: "" });
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add brand");
    }
  };

  // Edit Brand
  const handleEditBrand = async () => {
    if (!newBrand.brandName.trim()) {
      setError("Brand name is required");
      return;
    }

    try {
      const token = JSON.parse(Cookies.get("token"));
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/editbrand/${editingBrand._id}`,
        {
          brandName: newBrand.brandName.trim(),
          status: newBrand.status || "Active",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchBrands();
      setShowModal(false);
      setEditingBrand(null);
      setNewBrand({ brandName: "", status: "" });
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to edit brand");
    }
  };

  // Delete Brand
  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      const token = JSON.parse(Cookies.get("token"));
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/deletebrand/${brandId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBrands();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete brand");
    }
  };

  // Bulk Upload - Fully Working with Duplicate Skip
  const handleBulkUpload = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const lines = text.split("\n").map(l => l.trim()).filter(l => l !== "");
        if (lines.length <= 1) {
          alert("CSV is empty or has only header.");
          return;
        }

        const validLines = lines.slice(1).filter(line => {
          const cols = line.split(",");
          return cols[0]?.trim() !== "";
        });

        if (validLines.length === 0) {
          alert("No valid brands found in CSV!");
          return;
        }

        if (!confirm(`${validLines.length} brand(s) will be processed.\nContinue?`)) {
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = null;
          return;
        }

        setUploading(true);
        setError("");

        const token = JSON.parse(Cookies.get("token"));
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "csv_uploads");

        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const bulkRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/upload-bulk`,
          { fileUrl: uploadRes.data.fileUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = bulkRes.data;
        fetchBrands();

        alert(
          `Upload Complete!\n\n` +
          `Added: ${data.inserted || data.count || 0} new brand(s)\n` +
          `Skipped: ${data.skipped || 0} (already exist)\n` +
          `Total Processed: ${data.totalProcessed || validLines.length}`
        );

        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;

      } catch (error) {
        const msg = error.response?.data?.message || "Upload failed. Please try again.";
        setError(msg);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setEditingBrand(null);
                setNewBrand({ brandName: "", status: "" });
                setError("");
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Brand
            </button>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files[0])}
                className="border rounded-lg p-2 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
                disabled={uploading}
              />
              <button
                onClick={handleBulkUpload}
                disabled={uploading}
                className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                  uploading 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {uploading ? "Processing..." : "Upload CSV"}
              </button>
              <a
                href="data:text/csv;charset=utf-8,brandName,status%0ANike,Active%0AAdidas,Inactive%0AGucci,%0APrada,Active"
                download="sample_brands.csv"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition"
              >
                Sample CSV
              </a>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search brands by name..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-3 text-sm text-gray-600">
          Showing {indexOfFirstBrand + 1}–{Math.min(indexOfLastBrand, filteredBrands.length)} of {filteredBrands.length} brands
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentBrands.length > 0 ? (
                currentBrands.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">{b.brandName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        b.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button
                        onClick={() => {
                          setEditingBrand(b);
                          setNewBrand({ brandName: b.brandName, status: b.status });
                          setError("");
                          setShowModal(true);
                        }}
                        className="text-gray-500 hover:text-blue-600 transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(b._id)}
                        className="text-gray-500 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? "No brands found matching your search." : "No brands available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredBrands.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            handlePageChange={handlePageChange}
            handleCouponsPerPageChange={handleBrandsPerPageChange}
            couponsPerPage={brandsPerPage}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingBrand ? "Edit Brand" : "Add New Brand"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={newBrand.brandName}
                  onChange={(e) => setNewBrand({ ...newBrand, brandName: e.target.value })}
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={newBrand.status}
                  onChange={(e) => setNewBrand({ ...newBrand, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingBrand ? handleEditBrand : handleAddBrand}
                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
              >
                {editingBrand ? "Save Changes" : "Add Brand"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;