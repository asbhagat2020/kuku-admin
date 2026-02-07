import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit2, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

export const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [error, setError] = useState("");
  const [newBanner, setNewBanner] = useState({ title: "", image: "" });

   
 
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepagebanner/gethomepagebanner`
      );
      setBanners(response.data.data);
      setFilteredBanners(response.data.data); // Ensure filteredBanners is always an array
    } catch (error) {
      console.error("Error fetching banners:", error);
      setFilteredBanners([]); // Set to empty array if there's an error
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = banners.filter((banner) =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBanners(filtered);
    } else {
      setFilteredBanners(banners);
    }
  }, [searchTerm, banners]);

  const uploadImage = async (imageFile) => {

    const imageData = new FormData();
    imageData.append("file", imageFile);
    imageData.append("folder", "banners");

    try {
      const token = JSON.parse(Cookies.get("token"));
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/admin/single`,
        imageData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.fileUrl;
      
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleAddBanner = async () => {
    if (!newBanner.title || !newBanner.image) {
      setError("Title and image are required");
      return;
    }

    try {
      let imageUrl = newBanner.image;
      if (newBanner.image instanceof File) {
        imageUrl = await uploadImage(newBanner.image);
      }

      const token = JSON.parse(Cookies.get("token"));
;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepagebanner/addhomepagebanner`,
        {
          title: newBanner.title,
          bannerImage: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchBanners();
      setShowModal(false);
      setNewBanner({ title: "", image: "" });
      setError("");
    } catch (error) {
      setError("Failed to add banner");
      console.error(error);
    }
  };

  const handleEditBanner = async () => {
   
  
    if (!newBanner.title || !newBanner.image) {
      setError("Title and image are required");
      return;
    }
  
    try {
      let imageUrl = newBanner.image;
      if (newBanner.image instanceof File) {
        imageUrl = await uploadImage(newBanner.image);
      }
  
      const token = Cookies.get("token"); // Ensure the correct key is used
      if (!token) {
        console.error("Token is missing");
        setError("Authentication error. Please log in again.");
        return;
      }
  
      
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepagebanner/edithomepagebanner/${editingBanner._id}`,
        {
        
          title: newBanner.title,
          bannerImage: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        }
      );
  
      fetchBanners();
      setShowModal(false);
      setEditingBanner(null);
      setNewBanner({ title: "", image: "" });
      setError("");
    } catch (error) {
      setError("Failed to edit banner");
      console.error(error);
    }
  };
  

  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const token = JSON.parse(Cookies.get("token"));
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepagebanner/deletehomepagebanner/${bannerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchBanners();
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBanner({ ...newBanner, image: file });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Banner Management
          </h1>
          <button
            onClick={() => {
              setEditingBanner(null);
              setNewBanner({ title: "", image: "" });
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Banner
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search banners by title..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Banner Image</th>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBanners && filteredBanners.length > 0 ? (
              filteredBanners.map((banner) => (
                <tr key={banner._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={banner.bannerImage}
                      alt={banner.title}
                      className="h-16 w-32 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">{banner.title}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingBanner(banner);
                        setNewBanner({
                          title: banner.title,
                          image: banner.bannerImage,
                        });
                        setShowModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner._id)}
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
                  No banners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingBanner ? "Edit Banner" : "Add New Banner"}
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
                      Title
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={newBanner.title}
                      onChange={(e) =>
                        setNewBanner({ ...newBanner, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image
                    </label>
                    <input
                      type="file"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      onChange={handleImageChange}
                    />
                  </div>
                  {newBanner.image && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preview
                      </label>
                      <img
                        src={
                          newBanner.image instanceof File
                            ? URL.createObjectURL(newBanner.image)
                            : newBanner.image
                        }
                        alt="Banner Preview"
                        className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={editingBanner ? handleEditBanner : handleAddBanner}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingBanner ? "Save Changes" : "Add Banner"}
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

export default Banners;
