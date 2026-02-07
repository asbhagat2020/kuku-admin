import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTruck,
  FaShippingFast,
  FaBarcode,
  FaMapMarkerAlt,
  FaEye,
} from "react-icons/fa";
import axios from "axios";
import { notification } from "antd";
import Cookies from "js-cookie";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [agentForm, setAgentForm] = useState({
    name: "",
    type: "Pickup",
    contact: "",
    vehicle: "",
    status: "available",
  });
  const [loading, setLoading] = useState(false);

  // Get auth token from cookies
  const getAuthToken = () => {
    const token = Cookies.get("token");
    return token ? token.replace(/^"|"$/g, '') : null; // Remove quotes if present
  };

  // Axios config with auth header
  const getAxiosConfig = () => {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch agents from the backend
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/agents/all`,
        getAxiosConfig()
      );
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      if (error.response?.status === 401) {
        notification.error({
          message: "Authentication Error",
          description: "Please login again to continue.",
        });
        // Handle logout or redirect to login here if needed
      } else {
        notification.error({
          message: "Error",
          description: "Failed to fetch agents. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddEditAgent = async () => {
    if (!agentForm.name || !agentForm.contact) {
      notification.warning({
        message: "Validation Error",
        description: "Please fill required fields: Name and Contact",
      });
      return;
    }

    try {
      setLoading(true);
      if (editMode) {
        // Update existing agent
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/agents/update/${selectedAgent._id}`,
          agentForm,
          getAxiosConfig()
        );
        notification.success({
          message: "Success",
          description: "Agent updated successfully",
        });
      } else {
        // Create new agent
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/agents/create`,
          agentForm,
          getAxiosConfig()
        );
        notification.success({
          message: "Success",
          description: "Agent added successfully",
        });
      }
      fetchAgents(); // Refresh the list
      resetForms();
    } catch (error) {
      console.error("Error saving agent:", error);
      if (error.response?.status === 401) {
        notification.error({
          message: "Authentication Error",
          description: "Please login again to continue.",
        });
      } else {
        notification.error({
          message: "Error",
          description: error.response?.data?.message || "Failed to save agent. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/agents/delete/${selectedAgent._id}`,
        getAxiosConfig()
      );
      notification.success({
        message: "Success",
        description: "Agent deleted successfully",
      });
      fetchAgents(); // Refresh the list
      resetForms();
    } catch (error) {
      console.error("Error deleting agent:", error);
      if (error.response?.status === 401) {
        notification.error({
          message: "Authentication Error",
          description: "Please login again to continue.",
        });
      } else {
        notification.error({
          message: "Error",
          description: error.response?.data?.message || "Failed to delete agent. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQCUpdate = async (agentId, orderId, status) => {
    try {
      setLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/agents/${agentId}/assignments/${orderId}/update-qc`,
        { status },
        getAxiosConfig()
      );
      notification.success({
        message: "Success",
        description: `QC status updated to ${status}`,
      });
      fetchAgents(); // Refresh the list
    } catch (error) {
      console.error("Error updating QC status:", error);
      if (error.response?.status === 401) {
        notification.error({
          message: "Authentication Error",
          description: "Please login again to continue.",
        });
      } else {
        notification.error({
          message: "Error",
          description: error.response?.data?.message || "Failed to update QC status. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const StatusIndicator = ({ status }) => (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          status === "available"
            ? "bg-green-500"
            : status === "busy"
            ? "bg-red-500"
            : "bg-gray-400"
        }`}
      />
      <span className="text-sm capitalize">{status}</span>
    </div>
  );

  const AssignmentBadge = ({ assignment, agentType }) => (
    <div className="p-2 bg-gray-50 rounded-lg mb-2">
      <div className="flex items-center gap-2 text-sm">
        <FaBarcode className="text-blue-600" />
        <span className="font-mono">{assignment.barcode}</span>
      </div>
      <div className="flex items-center gap-2 text-sm mt-1">
        <FaMapMarkerAlt className="text-gray-500" />
        <span>
          {agentType === "Pickup" ? assignment.pickupAddress : assignment.buyerAddress}
        </span>
      </div>
      {agentType === "Pickup" && (
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleQCUpdate(selectedAgent._id, assignment.orderId, "passed")}
            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
          >
            QC Pass
          </button>
          <button
            onClick={() => handleQCUpdate(selectedAgent._id, assignment.orderId, "failed")}
            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded"
          >
            QC Fail
          </button>
        </div>
      )}
      <button
        onClick={() => {
          setSelectedAssignment(assignment);
          setIsDetailsModalOpen(true);
        }}
        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded mt-2 flex items-center gap-1"
      >
        <FaEye />
        View Details
      </button>
    </div>
  );

  const resetForms = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedAgent(null);
    setSelectedAssignment(null);
    setEditMode(false);
    setAgentForm({
      name: "",
      type: "Pickup",
      contact: "",
      vehicle: "",
      status: "available",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FaTruck className="text-blue-600" />
              Logistics Agent Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage pickup/delivery agents and monitor real-time operations
            </p>
          </div>
          <button
            onClick={() => {
              setEditMode(false);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus />
            Add Agent
          </button>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Agent ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Assignments</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Last Activity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agents.map((agent) => (
                <tr key={agent._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-blue-600">{agent.agentId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          agent.type === "Pickup" ? "bg-blue-100" : "bg-purple-100"
                        }`}
                      >
                        {agent.type === "Pickup" ? (
                          <FaTruck className="text-blue-600" />
                        ) : (
                          <FaShippingFast className="text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-gray-600">{agent.contact}</p>
                        <p className="text-sm text-gray-600">{agent.vehicle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusIndicator status={agent.status} />
                    <p className="text-sm text-gray-600 mt-1">{agent.currentRoute}</p>
                  </td>
                  <td className="px-6 py-4">
                    {agent.assignments.map((assignment, index) => (
                      <AssignmentBadge
                        key={index}
                        assignment={assignment}
                        agentType={agent.type}
                      />
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(agent.lastActivity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                        onClick={() => {
                          setSelectedAgent(agent);
                          setAgentForm({
                            name: agent.name,
                            type: agent.type,
                            contact: agent.contact,
                            vehicle: agent.vehicle,
                            status: agent.status,
                          });
                          setEditMode(true);
                          setIsModalOpen(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        onClick={() => {
                          setSelectedAgent(agent);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Agent Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editMode ? "Edit Agent" : "Add New Agent"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={agentForm.name}
                    onChange={(e) => setAgentForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agent Type *</label>
                  <select
                    value={agentForm.type}
                    onChange={(e) => setAgentForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pickup">Pickup Agent</option>
                    <option value="Delivery">Delivery Agent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info *</label>
                  <input
                    type="text"
                    value={agentForm.contact}
                    onChange={(e) => setAgentForm((prev) => ({ ...prev, contact: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Details</label>
                  <input
                    type="text"
                    value={agentForm.vehicle}
                    onChange={(e) => setAgentForm((prev) => ({ ...prev, vehicle: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Van #25, Bike #07"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={agentForm.status}
                    onChange={(e) => setAgentForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={resetForms}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEditAgent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editMode ? "Save Changes" : "Add Agent"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
              <div className="space-y-4">
                <p className="text-gray-600">Are you sure you want to permanently delete agent:</p>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedAgent?.name}</p>
                  <p className="text-sm text-gray-600">{selectedAgent?.agentId}</p>
                </div>
                <p className="text-sm text-red-600">
                  Warning: This action will remove all associated assignment history!
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={resetForms}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAgent}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {isDetailsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <p className="text-sm text-gray-600">{selectedAssignment?.orderId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                  <p className="text-sm text-gray-600">{selectedAssignment?.barcode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-sm text-gray-600">
                    {selectedAssignment?.pickupAddress || selectedAssignment?.buyerAddress}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <p className="text-sm text-gray-600">
                    {selectedAssignment?.qcStatus || selectedAssignment?.deliveryStatus}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
                  <p className="text-sm text-gray-600">
                    {selectedAssignment?.scheduledTime || selectedAssignment?.estimatedDelivery}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={resetForms}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;