import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  UserPlus,
  Search,
  Lock,
  Unlock,
  Edit2,
  Trash2,
  X,
  Eye,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/Notification/Notification";
import Cookies from "js-cookie";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(10);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAdmins, setSelectedAdmins] = useState(null);
  const { user, token } = useSelector((store) => store.otp);
  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
    verified: "",
    hasAccess: "",
  });

  const roles = [
    "admin",
    
  ];

  const allPermissions = [
    "Dashboard",
    "Admin",
    "Users",
    "Products",
    "Kukuwarehouses",
    "UserSupport",
    "Services",
    "Coupons",
    "Categories",
    "Orders",
    "CancelledOrders",
    "ReturnedOrders",
    "Delivered",
    "Outfordelivery",
    "PackedOrders",
    "QualityCheck",
    "PickedOrders",
    "PendingOrders",
    "Charity",
    "Renting",
    "Kukit",
    "Brands",
    "Agents",
    "Colors",
    "Conditions",
    "Sizes",
    "homepagebanner",
    "Listing",
    "Buyers",
    "Sellers",
    "Customercare",
    "AllOrders"
  ];

  const initialAdminState = {
    name: "",
    email: "",
    phone: "",
    role: "admin",
    verified: false,
    avatar: null,
    description: "",
    location: "",
    address: "",
    dateOfBirth: "",
    hasAccess: false,
    isActive: true,
    permissions: [],
    joinedOn: Date.now(),
    otpVerified: false,
  };

  const [newAdmin, setNewAdmin] = useState(initialAdminState);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get`
      );
      setAdmins(response.data.admin);
    } catch (err) {
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateAdmin = async () => {
    const adminData = {
      ...newAdmin,
      joinedOn: Date.now(),
    };

    if (modalMode === "add") {
      try {
        const token = JSON.parse(Cookies.get("token"));
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/register`,
          adminData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAdmins([...admins, response.data.admin]);
        showSuccessNotification(
          response.data.message || "User registered successfully"
        );
        handleCloseModal();
      } catch (err) {
        showErrorNotification(
          err.response?.data?.message || "Failed to register"
        );
      }
    } else {
      try {
        const token = JSON.parse(Cookies.get("token"));
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/update/${selectedAdmin._id}`,
          adminData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAdmins(
          admins.map((admin) =>
            admin._id === selectedAdmin._id ? response.data.admin : admin
          )
        );
        showSuccessNotification(
          response.data.message || "User updated successfully"
        );
        handleCloseModal();
      } catch (err) {
        showErrorNotification(
          err.response?.data?.message || "Failed to update"
        );
      }
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      setLoading(true);
      const token = JSON.parse(Cookies.get("token"));
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/delete/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdmins(admins.filter((admin) => admin._id !== adminId));
    } catch (err) {
      setError("Failed to delete admin");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAccess = async (adminId, currentAccess) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/update/${adminId}`,
        {
          hasAccess: !currentAccess,
          permissions: !currentAccess ? allPermissions : [], // Set all permissions if granting access, clear if revoking
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdmins(
        admins.map((admin) =>
          admin._id === adminId ? response.data.admin : admin
        )
      );
    } catch (err) {
      setError("Failed to update access");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAdmin(null);
    setNewAdmin(initialAdminState);
    setError(null);
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.phone?.includes(searchQuery);

    const matchesFilters =
      (!filters.role || admin.role === filters.role) &&
      (!filters.isActive || admin.isActive.toString() === filters.isActive) &&
      (!filters.verified || admin.verified.toString() === filters.verified) &&
      (!filters.hasAccess || admin.hasAccess.toString() === filters.hasAccess);

    return matchesSearch && matchesFilters;
  });

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-blue-100 text-blue-800",
      pickup_agent: "bg-blue-100 text-blue-800",
      delivery_agent: "bg-blue-100 text-blue-800",
      customer_care: "bg-blue-100 text-blue-800",
      quality_check: "bg-blue-100 text-blue-800",
      manager: "bg-blue-100 text-blue-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const handleView = (admin) => {
    setSelectedAdmins(admin);
    setShowModal1(true);
  };

  // Permission groups for structured UI
  const permissionGroups = {
    General: ["Dashboard", "Products", "Kukuwarehouses", "Categories", "Coupons", "Customercare", "homepagebanner", "Listing"],
    UserManagement: ["Admin", "Users", "Agents"],
    OrderRefundManagement: ["Users Cancelled Orders"],
    SellerOptions: ["Brands", "Colors", "Conditions", "Sizes"],
    Services: ["Buyers", "Sellers", "Kukit", "Renting", "Charity"],
     OrderManagement: [
      "Orders",
      "PendingOrders",
      "CustomerCare",
      "PickedOrders",
      "QualityCheck",
      "Delivered",
      "ReturnedOrders",
      "CancelledOrders",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your organization administrators and their permissions
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setModalMode("add");
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Admin
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
            <select
              value={filters.isActive}
              onChange={(e) =>
                setFilters({ ...filters, isActive: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select
              value={filters.hasAccess}
              onChange={(e) =>
                setFilters({ ...filters, hasAccess: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">Any Access</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <select
              value={filters.verified}
              onChange={(e) =>
                setFilters({ ...filters, verified: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">All Verification</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Admin
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role & Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    has Access?
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Verified
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Access Permission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentAdmins.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No admins found
                    </td>
                  </tr>
                ) : (
                  currentAdmins.map((admin, index) => (
                    <tr key={admin._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {admin.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={admin.avatar}
                                alt=""
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                                <span className="text-pink-600 font-medium">
                                  {admin.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {admin.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                            admin.role
                          )}`}
                        >
                          {admin.role}
                        </span>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.hasAccess
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {admin.hasAccess ? "Yes" : "No"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {admin?.verified ? "Verified" : "Not verified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.joinedOn
                          ? format(admin.joinedOn, "MMM dd, yyyy")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setNewAdmin({
                                ...admin,
                                permissions: admin.permissions || [],
                              });
                              setModalMode("edit");
                              setShowModal(true);
                            }}
                            className="p-1 text-indigo-600 hover:text-indigo-900 rounded-full"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="p-1 text-red-600 hover:text-red-900 rounded-full"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                      <td className="flex justify-center mt-5">
                        <button
                          className="p-1 text-gray-400 hover:text-gray-500"
                          onClick={() => handleView(admin)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstAdmin + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastAdmin, filteredAdmins.length)}
                </span>{" "}
                of <span className="font-medium">{filteredAdmins.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                ​
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    onClick={handleCloseModal}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {modalMode === "add" ? "Add New Admin" : "Edit Admin"}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={newAdmin.name}
                          onChange={(e) =>
                            setNewAdmin({ ...newAdmin, name: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={newAdmin.email}
                          onChange={(e) =>
                            setNewAdmin({ ...newAdmin, email: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={newAdmin.phone}
                          onChange={(e) =>
                            setNewAdmin({ ...newAdmin, phone: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Role
                        </label>
                        <select
                          id="role"
                          value={newAdmin.role}
                          onChange={(e) =>
                            setNewAdmin({ ...newAdmin, role: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="verified"
                          checked={newAdmin.verified}
                          onChange={(e) =>
                            setNewAdmin({
                              ...newAdmin,
                              verified: e.target.checked,
                              hasAccess: e.target.checked ? newAdmin.hasAccess : false, // Reset hasAccess if unverified
                              permissions: e.target.checked ? newAdmin.permissions : [], // Clear permissions if unverified
                            })
                          }
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="verified"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Verified
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="hasAccess"
                          checked={newAdmin.hasAccess}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setNewAdmin({
                              ...newAdmin,
                              hasAccess: isChecked,
                              permissions: isChecked ? allPermissions : newAdmin.permissions,
                            });
                          }}
                          disabled={!newAdmin.verified} // Disable if not verified
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <label
                          htmlFor="hasAccess"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Has System Access
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-5">
                  Access Permissions
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-4 pb-5">
                  {Object.entries(permissionGroups).map(([group, permissions]) => (
                    <div key={group}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{group}</h4>
                      {permissions.map((permission) => (
                        <div key={permission} className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id={permission}
                            checked={newAdmin.permissions.includes(permission)}
                            onChange={(e) => {
                              setNewAdmin((prevState) => {
                                const updatedPermissions = e.target.checked
                                  ? [...prevState.permissions, permission]
                                  : prevState.permissions.filter((p) => p !== permission);
                                return {
                                  ...prevState,
                                  permissions: updatedPermissions,
                                  hasAccess: updatedPermissions.length === allPermissions.length, // Set hasAccess based on permissions
                                };
                              });
                            }}
                            disabled={newAdmin.hasAccess} // Disable if hasAccess is true
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded disabled:opacity-50"
                          />
                          <label
                            htmlFor={permission}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {permission
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleAddOrUpdateAdmin}
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : modalMode === "add" ? (
                      "Add Admin"
                    ) : (
                      "Update Admin"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showModal1 && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                ​
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    onClick={() => setShowModal1(false)}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Profile Details
                    </h3>
                    <div className="mt-3">
                      {selectedAdmins.avatar ? (
                        <img
                          className="h-20 w-20 rounded-full"
                          src={selectedAdmins.avatar}
                          alt=""
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-pink-100 flex items-center justify-center">
                          <span className="text-pink-600 font-medium">
                            {selectedAdmins.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Name
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedAdmins.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedAdmins.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedAdmins.phone}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Role
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedAdmins.role}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedAdmins.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Access
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedAdmins.hasAccess ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Permissions
                      </label>
                      <ul className="mt-1 text-gray-900 list-disc list-inside">
                        {selectedAdmins?.permissions?.map((el, index) => (
                          <li key={index}>
                            {el
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowModal1(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;