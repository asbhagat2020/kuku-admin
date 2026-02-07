import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit2, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

export const Conditions = () => {
  const [conditions, setConditions] = useState([]);
  const [filteredConditions, setFilteredConditions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const [error, setError] = useState("");
  const [newCondition, setNewCondition] = useState({
    conditionName: "",
    status: "Active" // Default status
  });

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/conditions/getcondition`
      );
      setConditions(response.data.conditions);
      setFilteredConditions(response.data.conditions);
    } catch (error) {
      console.error("Error fetching conditions:", error);
      setFilteredConditions([]);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = conditions.filter((condition) =>
        condition.conditionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConditions(filtered);
    } else {
      setFilteredConditions(conditions);
    }
  }, [searchTerm, conditions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCondition.conditionName || !newCondition.status) {
      setError("Condition name and status are required");
      return;
    }

    try {
      const token = JSON.parse(Cookies.get("token"));
      if (editingCondition) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/conditions/editcondition/${editingCondition._id}`,
          newCondition,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/conditions/addcondition`,
          newCondition,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchConditions();
      closeModal();
    } catch (error) {
      setError(editingCondition ? "Failed to edit condition" : "Failed to add condition");
      console.error(error);
    }
  };

  const handleDeleteCondition = async (conditionId) => {
    if (window.confirm("Are you sure you want to delete this condition?")) {
      try {
        const token = JSON.parse(Cookies.get("token"));
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/conditions/deletecondition/${conditionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchConditions();
      } catch (error) {
        console.error("Error deleting condition:", error);
      }
    }
  };

  const openModal = (condition = null) => {
    if (condition) {
      setEditingCondition(condition);
      setNewCondition({
        conditionName: condition.conditionName,
        status: condition.status
      });
    } else {
      setEditingCondition(null);
      setNewCondition({ conditionName: "", status: "Active" });
    }
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCondition(null);
    setNewCondition({ conditionName: "", status: "Active" });
    setError("");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Condition Management</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Condition
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search conditions..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingCondition ? "Edit Condition" : "Add Condition"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Condition Name</label>
                <input
                  type="text"
                  value={newCondition.conditionName}
                  onChange={(e) =>
                    setNewCondition({ ...newCondition, conditionName: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  value={newCondition.status}
                  onChange={(e) =>
                    setNewCondition({ ...newCondition, status: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
              >
                {editingCondition ? "Update" : "Add"} Condition
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Condition</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredConditions.length > 0 ? (
              filteredConditions.map((condition) => (
                <tr key={condition._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{condition.conditionName}</td>
                  <td className="px-6 py-4">{condition.status}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => openModal(condition)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCondition(condition._id)}
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
                  No conditions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Conditions;