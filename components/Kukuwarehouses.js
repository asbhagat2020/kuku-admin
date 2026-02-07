"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { showErrorNotification, showSuccessNotification } from "@/utils/Notification/Notification";
import KukuWarehousesAddEditModal from "./KukuWarehousesAddEditModal";
import KukuWareHouseDetailViewModal from "./KukuWareHouseDetailViewModal";

const Kukuwarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    mob_no_country_code: "971",
    mobile_number: "",
    alt_ph_country_code: "",
    alternate_phone: "",
    house_no: "",
    building_name: "",
    area: "",
    landmark: "",
    city: "Dubai",
    address_type: "Normal",
    email: "",
    isDefault: false,
    country: "UAE",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

  // Fetch warehouses on component mount
  useEffect(() => {
    const token = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;
    if (!token) {
      setError("Please log in to access warehouses");
      return;
    }
    fetchWarehouses(token);
  }, []);

  const fetchWarehouses = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/warehouse`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWarehouses(response.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
        Cookies.remove("token");
        showErrorNotification("Session expired. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to fetch warehouses");
        showErrorNotification(err.response?.data?.message || "Failed to fetch warehouses");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddEdit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;
    if (!token) {
      setError("Please log in to perform this action");
      showErrorNotification("Please log in to perform this action");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }
    try {
      setLoading(true);
      if (selectedWarehouse) {
        // Edit existing warehouse
        const response = await axios.patch(
          `${API_BASE_URL}/warehouse/${selectedWarehouse._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showSuccessNotification(response.data.message || "Warehouse updated successfully");
      } else {
        // Add new warehouse
        const response = await axios.post(`${API_BASE_URL}/warehouse/add`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSuccessNotification(response.data.message || "Warehouse added successfully");
      }
      setIsModalOpen(false);
      setFormData({
        name: "",
        mob_no_country_code: "971",
        mobile_number: "",
        alt_ph_country_code: "",
        alternate_phone: "",
        house_no: "",
        building_name: "",
        area: "",
        landmark: "",
        city: "Dubai",
        address_type: "Normal",
        email: "",
        isDefault: false,
        country: "UAE",
      });
      setSelectedWarehouse(null);
      fetchWarehouses(token);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
        Cookies.remove("token");
        showErrorNotification("Session expired. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to save warehouse");
        showErrorNotification(err.response?.data?.message || "Failed to save warehouse");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      mob_no_country_code: warehouse.mob_no_country_code,
      mobile_number: warehouse.mobile_number,
      alt_ph_country_code: warehouse.alt_ph_country_code || "",
      alternate_phone: warehouse.alternate_phone || "",
      house_no: warehouse.house_no,
      building_name: warehouse.building_name,
      area: warehouse.area,
      landmark: warehouse.landmark,
      city: warehouse.city,
      address_type: warehouse.address_type,
      email: warehouse.email || "",
      isDefault: warehouse.isDefault,
      country: warehouse.country,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?")) return;
    const token = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;
    if (!token) {
      setError("Please log in to perform this action");
      showErrorNotification("Please log in to perform this action");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/warehouse/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccessNotification("Warehouse deleted successfully");
      fetchWarehouses(token);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired or unauthorized. Please log in again.");
        Cookies.remove("token");
        showErrorNotification("Session expired. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Failed to delete warehouse");
        showErrorNotification(err.response?.data?.message || "Failed to delete warehouse");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDetailView(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailView(false);
    setSelectedWarehouse(null);
    setFormData({
      name: "",
      mob_no_country_code: "971",
      mobile_number: "",
      alt_ph_country_code: "",
      alternate_phone: "",
      house_no: "",
      building_name: "",
      area: "",
      landmark: "",
      city: "Dubai",
      address_type: "Normal",
      email: "",
      isDefault: false,
      country: "UAE",
    });
    setError("");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Warehouse Management</h2>
      <button
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        onClick={() => setIsModalOpen(true)}
      >
        Add Warehouse
      </button>

      {error && (
        <p className="text-red-500 mb-6 text-sm sm:text-base bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}
      {loading && (
        <p className="text-gray-500 text-sm sm:text-base">Loading...</p>
      )}

      {/* Warehouse Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                WareHouse Name
              </th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Address Type
              </th>
              {/* <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Default
              </th> */}
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {warehouses.map((warehouse) => (
              <tr
                key={warehouse._id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(warehouse)}
              >
                <td className="py-3 px-4 text-sm sm:text-base">{warehouse.name}</td>
                <td className="py-3 px-4 text-sm sm:text-base">
                  {warehouse.mob_no_country_code} {warehouse.mobile_number}
                </td>
                <td className="py-3 px-4 text-sm sm:text-base">{warehouse.city}</td>
                <td className="py-3 px-4 text-sm sm:text-base">{warehouse.address_type}</td>
                {/* <td className="py-3 px-4 text-sm sm:text-base">
                  {warehouse.isDefault ? "Yes" : "No"}
                </td> */}
                <td className="py-3 px-4 text-sm sm:text-base">
                  <button
                    className="text-blue-500 mr-2 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(warehouse);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(warehouse._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <KukuWarehousesAddEditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleAddEdit}
        selectedWarehouse={selectedWarehouse}
        loading={loading}
      />
      <KukuWareHouseDetailViewModal
        isOpen={isDetailView}
        onClose={closeModal}
        warehouse={selectedWarehouse}
      />
    </div>
  );
};

export default Kukuwarehouses;