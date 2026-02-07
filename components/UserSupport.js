// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { format } from 'date-fns';
// import {
//   FaEnvelope,
//   FaUser,
//   FaClock,
//   FaTrash,
//   FaPaperPlane,
//   FaSearch,
//   FaCheckCircle,
//   FaHourglassHalf,
//   FaExclamationCircle
// } from 'react-icons/fa';

// const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/comp`;

// const UserSupport = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [replyMessage, setReplyMessage] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sendingReply, setSendingReply] = useState(false);

//   const getToken = () => {
//     try {
//       const cookieToken = Cookies.get("token");
//       if (cookieToken) {
//         return JSON.parse(cookieToken);
//       }
//     } catch (err) {
//       console.error("Token parse error:", err);
//     }
//     return null;
//   };

//   const fetchComplaints = async () => {
//     const token = getToken();
//     if (!token) {
//       setError('Admin token missing. Please login as admin.');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');

//       const res = await axios.get(API_BASE, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       });

//       setComplaints(res.data || []);
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message;
//       setError(`Failed to load: ${msg}`);
//       if (err.response?.status === 401) {
//         Cookies.remove('token');
//         window.location.reload();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const sendReply = async (complaintId) => {
//     if (!replyMessage.trim()) {
//       alert('Reply message is required!');
//       return;
//     }

//     const token = getToken();
//     if (!token) return alert('Session expired. Login again.');

//     try {
//       setSendingReply(true);
//       await axios.patch(
//         `${API_BASE}/${complaintId}/reply`,
//         { adminMessage: replyMessage, status: 'completed' },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert('Reply sent & ticket closed!');
//       setReplyMessage('');
//       setSelectedComplaint(null);
//       fetchComplaints();
//     } catch (err) {
//       alert('Reply failed: ' + (err.response?.data?.error || err.message));
//     } finally {
//       setSendingReply(false);
//     }
//   };

//   const deleteComplaint = async (id) => {
//     if (!window.confirm('Delete this complaint permanently?')) return;

//     const token = getToken();
//     if (!token) return alert('Session expired.');

//     try {
//       await axios.delete(`${API_BASE}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setComplaints(prev => prev.filter(c => c._id !== id));
//       if (selectedComplaint?._id === id) setSelectedComplaint(null);
//       alert('Deleted!');
//     } catch (err) {
//       alert('Delete failed.');
//     }
//   };

//   const filteredComplaints = complaints.filter(c => {
//     const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
//     const matchesSearch =
//       c.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (c.messages || []).some(m => m?.message?.toLowerCase().includes(searchTerm.toLowerCase()));
//     return matchesStatus && matchesSearch;
//   });

//   // SAFE: Get latest message with fallback
//   const getLatestMessage = (messages = []) => {
//     if (!messages || messages.length === 0) return "No message";
//     const last = messages[messages.length - 1];
//     return last?.message || "Empty message";
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600 mx-auto mb-4"></div>
//           <p className="text-xl font-bold text-pink-600">Loading Complaints...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-4 md:p-8">
//       {/* Header */}
//       <div className="mb-8 bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-pink-600">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
//           <div className="flex items-center gap-6">
//             <div className="bg-pink-100 p-5 rounded-full">
//               <FaEnvelope className="text-5xl text-pink-600" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
//                 KUKU User Support
//               </h1>
//               <p className="text-lg text-gray-600 mt-2">Reply to users & close tickets instantly</p>
//             </div>
//           </div>
//           <div className="text-center">
//             <div className="text-5xl font-black text-pink-600">{complaints.length}</div>
//             <div className="text-gray-600 font-semibold">Total Tickets</div>
//           </div>
//         </div>
//       </div>

//       {/* Search + Filter */}
//       <div className="mb-8 flex flex-col md:flex-row gap-4">
//         <div className="flex-1 relative">
//           <FaSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
//           <input
//             type="text"
//             placeholder="Search email or message..."
//             className="w-full pl-12 pr-6 py-4 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-600 focus:ring-4 focus:ring-pink-100 text-lg"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <select
//           className="px-8 py-4 border-2 border-pink-200 rounded-2xl bg-white focus:outline-none focus:border-pink-600 focus:ring-4 focus:ring-pink-100 text-lg font-semibold"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="all">All Tickets</option>
//           <option value="pending">Pending</option>
//           <option value="completed">Completed</option>
//         </select>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="mb-6 p-6 bg-red-100 border-l-8 border-red-600 rounded-2xl flex items-center gap-4">
//           <FaExclamationCircle className="text-3xl text-red-600" />
//           <div>
//             <p className="font-bold text-red-800">Error!</p>
//             <p className="text-red-700">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Grid */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//         {/* Table */}
//         <div className="xl:col-span-2">
//           <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//             <div className="p-8 bg-gradient-to-r from-pink-600 to-pink-800">
//               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
//                 <FaEnvelope /> Users Messages
//               </h2>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-pink-50">
//                   <tr>
//                     <th className="px-6 py-5 text-left text-sm font-bold text-pink-800 uppercase">User</th>
//                     <th className="px-6 py-5 text-left text-sm font-bold text-pink-800 uppercase">Latest Message</th>
//                     <th className="px-6 py-5 text-left text-sm font-bold text-pink-800 uppercase">Status</th>
//                     <th className="px-6 py-5 text-left text-sm font-bold text-pink-800 uppercase">Date</th>
//                     <th className="px-6 py-5 text-center text-sm font-bold text-pink-800 uppercase">Delete</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-pink-100">
//                   {filteredComplaints.length === 0 ? (
//                     <tr>
//                       <td colSpan="5" className="text-center py-20 text-gray-400">
//                         <FaEnvelope className="mx-auto text-8xl mb-4 opacity-30" />
//                         <p className="text-2xl font-bold">No tickets found</p>
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredComplaints.map((c) => (
//                       <tr
//                         key={c._id}
//                         onClick={() => setSelectedComplaint(c)}
//                         className={`hover:bg-pink-50 cursor-pointer transition-all ${
//                           selectedComplaint?._id === c._id ? 'bg-pink-100 border-l-8 border-pink-600' : ''
//                         }`}
//                       >
//                         <td className="px-6 py-5">
//                           <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                               {c.userEmail?.[0]?.toUpperCase() || '?'}
//                             </div>
//                             <div>
//                               <div className="font-bold text-gray-900">{c.userEmail || 'Unknown'}</div>
//                               <div className="text-xs text-gray-500">ID: {c._id?.slice(-6)}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-5 max-w-md">
//                           <p className="text-gray-700 line-clamp-2">
//                             {getLatestMessage(c.messages)}
//                           </p>
//                         </td>
//                         <td className="px-6 py-5">
//                           <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
//                             c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
//                           }`}>
//                             {c.status === 'pending' ? <FaHourglassHalf /> : <FaCheckCircle />}
//                             {c.status?.toUpperCase() || 'UNKNOWN'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-5 text-sm text-gray-600">
//                           {c.createdAt ? format(new Date(c.createdAt), 'dd MMM yyyy') : 'N/A'}
//                           <br />
//                           <span className="text-xs">
//                             {c.createdAt ? format(new Date(c.createdAt), 'hh:mm a') : ''}
//                           </span>
//                         </td>
//                         <td className="px-6 py-5 text-center">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               deleteComplaint(c._id);
//                             }}
//                             className="text-red-600 hover:text-red-800 hover:scale-125 transition"
//                           >
//                             <FaTrash className="text-xl" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Thread */}
//         <div className="xl:col-span-1">
//           <div className="bg-white rounded-3xl shadow-2xl h-full flex flex-col">
//             <div className="p-8 bg-gradient-to-r from-pink-600 to-pink-800 rounded-t-3xl">
//               <h2 className="text-2xl font-bold text-white">Conversation</h2>
//             </div>

//             {selectedComplaint ? (
//               <>
//                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                   {(selectedComplaint.messages || []).map((msg, i) => (
//                     <div
//                       key={i}
//                       className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
//                     >
//                       <div className={`max-w-sm p-5 rounded-3xl shadow-lg ${
//                         msg.sender === 'user'
//                           ? 'bg-gray-100 text-gray-800'
//                           : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
//                       }`}>
//                         <div className="flex items-center gap-2 mb-2">
//                           <FaUser className="text-sm" />
//                           <span className="font-bold text-xs opacity-80">
//                             {msg.sender === 'user' ? 'Customer' : 'Support'}
//                           </span>
//                           <span className="text-xs opacity-60">
//                             {msg.sentAt ? format(new Date(msg.sentAt), 'hh:mm a') : 'N/A'}
//                           </span>
//                         </div>
//                         <p className="whitespace-pre-wrap text-sm">{msg.message || 'No text'}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="p-6 border-t-4 border-pink-100">
//                   <textarea
//                     rows="5"
//                     placeholder="Write your reply... User gets email"
//                     className="w-full p-4 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-600 focus:ring-4 focus:ring-pink-100 resize-none text-lg"
//                     value={replyMessage}
//                     onChange={(e) => setReplyMessage(e.target.value)}
//                   />
//                   <button
//                     onClick={() => sendReply(selectedComplaint._id)}
//                     disabled={sendingReply}
//                     className="mt-4 w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white py-5 rounded-2xl font-bold text-xl hover:from-pink-700 hover:to-pink-800 flex items-center justify-center gap-3 disabled:opacity-50"
//                   >
//                     {sendingReply ? 'Sending...' : <> <FaPaperPlane /> Send & Close Ticket </>}
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex-1 flex items-center justify-center p-10 text-gray-400">
//                 <FaEnvelope className="mx-auto text-9xl mb-6 opacity-20" />
//                 <p className="text-2xl font-bold">Select a ticket</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserSupport;









// // components/UserSupport.jsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
// import UserComplaintTable from './UserComplaintTable';
// import UsersConversationThread from './UsersConversationThread';

// const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/comp`;

// const UserSupport = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [replyMessage, setReplyMessage] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sendingReply, setSendingReply] = useState(false);

//   const getToken = () => {
//     try {
//       const cookieToken = Cookies.get("token");
//       return cookieToken ? JSON.parse(cookieToken) : null;
//     } catch (err) {
//       console.error("Token parse error:", err);
//       return null;
//     }
//   };

//   const fetchComplaints = async () => {
//     const token = getToken();
//     if (!token) {
//       setError('Admin token missing. Please login as admin.');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const res = await axios.get(API_BASE, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setComplaints(res.data || []);
//     } catch (err) {
//       const msg = err.response?.data?.error || err.message;
//       setError(`Failed to load: ${msg}`);
//       if (err.response?.status === 401) {
//         Cookies.remove('token');
//         window.location.reload();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const sendReply = async () => {
//     if (!replyMessage.trim()) return alert('Reply message is required!');
//     const token = getToken();
//     if (!token) return alert('Session expired.');

//     try {
//       setSendingReply(true);
//       await axios.patch(
//         `${API_BASE}/${selectedComplaint._id}/reply`,
//         { adminMessage: replyMessage, status: 'completed' },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Reply sent & ticket closed!');
//       setReplyMessage('');
//       setSelectedComplaint(null);
//       fetchComplaints();
//     } catch (err) {
//       alert('Reply failed: ' + (err.response?.data?.error || err.message));
//     } finally {
//       setSendingReply(false);
//     }
//   };

//   const deleteComplaint = async (id) => {
//     if (!window.confirm('Delete this complaint permanently?')) return;
//     const token = getToken();
//     if (!token) return alert('Session expired.');

//     try {
//       await axios.delete(`${API_BASE}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setComplaints(prev => prev.filter(c => c._id !== id));
//       if (selectedComplaint?._id === id) setSelectedComplaint(null);
//       alert('Deleted!');
//     } catch (err) {
//       alert('Delete failed.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-1 md:p-2">
//       {/* Header */}
//       <div className="mb-8 bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-pink-600">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
//           <div className="flex items-center gap-6">
//             <div className="bg-pink-100 p-5 rounded-full">
//               <FaEnvelope className="text-5xl text-pink-600" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
//                 KUKU User Support
//               </h1>
//               <p className="text-lg text-gray-600 mt-2">Reply to users & close tickets instantly</p>
//             </div>
//           </div>
//           <div className="text-center">
//             <div className="text-5xl font-black text-pink-600">{complaints.length}</div>
//             <div className="text-gray-600 font-semibold">Total Tickets</div>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 p-6 bg-red-100 border-l-8 border-red-600 rounded-2xl flex items-center gap-4">
//           <FaExclamationCircle className="text-3xl text-red-600" />
//           <div>
//             <p className="font-bold text-red-800">Error!</p>
//             <p className="text-red-700">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Grid */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
//         {/* Table */}
//         <div className="xl:col-span-2">
//           <UserComplaintTable
//             complaints={complaints}
//             loading={loading}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             statusFilter={statusFilter}
//             setStatusFilter={setStatusFilter}
//             onSelectComplaint={setSelectedComplaint}
//             onDeleteComplaint={deleteComplaint}
//             selectedComplaintId={selectedComplaint?._id}
//           />
//         </div>

//         {/* Thread */}
//         <div className="xl:col-span-1">
//           <div className="bg-white rounded-3xl shadow-2xl h-full flex flex-col">
//             <div className="p-8 bg-gradient-to-r from-pink-600 to-pink-800 rounded-t-3xl">
//               <h2 className="text-2xl font-bold text-white">Conversation</h2>
//             </div>
//             <UsersConversationThread
//               selectedComplaint={selectedComplaint}
//               replyMessage={replyMessage}
//               setReplyMessage={setReplyMessage}
//               sendingReply={sendingReply}
//               onSendReply={sendReply}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserSupport;





// components/UserSupport.jsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
import UserComplaintTable from './UserComplaintTable';
import UsersConversationThread from './UsersConversationThread';

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/comp`;

const UserSupport = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const getToken = () => {
    try {
      const cookieToken = Cookies.get("token");
      return cookieToken ? JSON.parse(cookieToken) : null;
    } catch (err) {
      console.error("Token parse error:", err);
      return null;
    }
  };

  const fetchComplaints = async () => {
    const token = getToken();
    if (!token) {
      setError('Admin token missing. Please login as admin.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(`Failed to load: ${msg}`);
      if (err.response?.status === 401) {
        Cookies.remove('token');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const sendReply = async () => {
    if (!replyMessage.trim()) return alert('Reply message is required!');
    const token = getToken();
    if (!token) return alert('Session expired.');

    try {
      setSendingReply(true);
      await axios.patch(
        `${API_BASE}/${selectedComplaint._id}/reply`,
        { adminMessage: replyMessage, status: 'completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reply sent & ticket closed!');
      setReplyMessage('');
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err) {
      alert('Reply failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSendingReply(false);
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    const token = getToken();
    if (!token) return alert('Session expired.');

    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(prev => prev.filter(c => c._id !== id));
      if (selectedComplaint?._id === id) setSelectedComplaint(null);
      alert('Deleted!');
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-1 md:p-2">
      {/* Header */}
      <div className="mb-8 bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-pink-600">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-pink-100 p-5 rounded-full">
              <FaEnvelope className="text-5xl text-pink-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                KUKU User Support
              </h1>
              <p className="text-lg text-gray-600 mt-2">Reply to users & close tickets instantly</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-pink-600">{complaints.length}</div>
            <div className="text-gray-600 font-semibold">Total Tickets</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-6 bg-red-100 border-l-8 border-red-600 rounded-2xl flex items-center gap-4">
          <FaExclamationCircle className="text-3xl text-red-600" />
          <div>
            <p className="font-bold text-red-800">Error!</p>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Grid with Fixed Widths */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Table - Fixed Width */}
        <div className="xl:w-[75%]">
          <UserComplaintTable
            complaints={complaints}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onSelectComplaint={setSelectedComplaint}
            onDeleteComplaint={deleteComplaint}
            selectedComplaintId={selectedComplaint?._id}
          />
        </div>

        {/* Conversation - Fixed Width */}
        <div className="xl:w-[25%]">
          <div className="bg-white rounded-3xl shadow-2xl h-full flex flex-col">
            <div className="p-8 bg-gradient-to-r from-pink-600 to-pink-800 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white">Conversation</h2>
            </div>
            <UsersConversationThread
              selectedComplaint={selectedComplaint}
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
              sendingReply={sendingReply}
              onSendReply={sendReply}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSupport;