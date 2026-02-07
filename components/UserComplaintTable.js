// components/UserComplaintTable.jsx
import React from 'react';
import { format } from 'date-fns';
import {
  FaUser, FaTrash, FaHourglassHalf, FaEnvelope , FaCheckCircle, FaSearch
} from 'react-icons/fa';

const UserComplaintTable = ({
  complaints,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onSelectComplaint,
  onDeleteComplaint,
  selectedComplaintId
}) => {
  const getLatestMessage = (messages = []) => {
    if (!messages.length) return "No message";
    return messages[messages.length - 1]?.message || "Empty message";
  };

  const filtered = complaints.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.messages || []).some(m => m?.message?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600 mx-auto mb-4"></div>
        <p className="text-xl font-bold text-pink-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Search + Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search email or message..."
            className="w-full pl-12 pr-6 py-4 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-600 focus:ring-4 focus:ring-pink-100 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-8 py-4 border-2 border-pink-200 rounded-2xl bg-white focus:outline-none focus:border-pink-600 focus:ring-4 focus:ring-pink-100 text-lg font-semibold"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Tickets</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-pink-600 to-pink-800">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FaEnvelope /> Users Messages
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold text-pink-800 uppercase">User</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-pink-800 uppercase">Latest Message</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-pink-800 uppercase">Status</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-pink-800 uppercase">Date</th>
                <th className="px-6 py-5 text-center text-sm font-bold text-pink-800 uppercase">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-400">
                    <FaEnvelope className="mx-auto text-8xl mb-4 opacity-30" />
                    <p className="text-2xl font-bold">No tickets found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => onSelectComplaint(c)}
                    className={`hover:bg-pink-50 cursor-pointer transition-all ${
                      selectedComplaintId === c._id ? 'bg-pink-100 border-l-8 border-pink-600' : ''
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {c.userEmail?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{c.userEmail || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">ID: {c._id?.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-md">
                      <p className="text-gray-700 line-clamp-2">{getLatestMessage(c.messages)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                        c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {c.status === 'pending' ? <FaHourglassHalf /> : <FaCheckCircle />}
                        {c.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : 'N/A'}
                      <br />
                      <span className="text-xs">
                        {c.createdAt ? format(new Date(c.createdAt), 'hh:mm a') : ''}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteComplaint(c._id);
                        }}
                        className="text-red-600 hover:text-red-800 hover:scale-125 transition"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserComplaintTable;