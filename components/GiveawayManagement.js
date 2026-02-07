// // components/giveaway/GiveawayManagement.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Search, X } from "lucide-react";
// import { useSelector } from "react-redux";
// import GiveawayCustomerCare from "./GiveawayCustomerCare";
// import GiveawayPickup from "./GiveawayPickup";
// import GiveawayProgressIndicator from "./GiveawayProgressIndicator";
// import GiveawayOrderDetails from "./GiveawayOrderDetails";

// const GiveawayManagement = () => {
//   const [giveaways, setGiveaways] = useState([]);
//   const [filteredGiveaways, setFilteredGiveaways] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedGiveaway, setSelectedGiveaway] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [currentStage, setCurrentStage] = useState("customercare");
//   const [viewMode, setViewMode] = useState("");
//   const token = useSelector((state) => state.otp?.token);

//   const fetchGiveaways = async () => {
//     setLoading(true);
//     try {
//       if (!token) return;
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/giveaways/giveaways-admin`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setGiveaways(res.data.data || []);
//       setFilteredGiveaways(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) fetchGiveaways();
//   }, [token]);

//   useEffect(() => {
//     const query = searchQuery.toLowerCase();
//     const filtered = giveaways.filter((g) => {
//       const pickupDate = g.pickupDate ? new Date(g.pickupDate).toLocaleDateString() : "";
//       return [
//         g.seller?.name,
//         g.seller?.email,
//         g.seller?.phone,
//         pickupDate,
//         g.pickupTime
//       ].some(field => field?.toLowerCase().includes(query));
//     });
//     setFilteredGiveaways(filtered);
//   }, [searchQuery, giveaways]);

//   const determineStage = (g) => {
//     const p = g.giveawayProcessingDetails || {};
//     const cc = p.customerCare?.confirmationStatus;
//     const pickup = p.pickupDetails?.pickupStatus;

//     if (!cc || cc === "pending" || cc === "rejected") return "customercare";
//     if (cc === "approved" && pickup !== "Delivered") return "pickup";
//     return "customercare";
//   };

//   const handleClick = (giveaway, mode = "") => {
//     setSelectedGiveaway(giveaway);
//     setViewMode(mode);
//     setCurrentStage(determineStage(giveaway));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Giveaway Management</h1>
//         <p className="text-gray-600 mb-6">Manage giveaway pickup requests</p>

//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name, email, phone, date..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
//           />
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow overflow-hidden">
//             <table className="min-w-full">
//               <thead className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
//                 <tr>
//                   {["Sr No", "Order ID", "Name", "Email", "Phone", "Pickup Date", "Status", "CC", "Pickup", "Actions"].map((h) => (
//                     <th key={h} className="px-4 py-3 text-left text-xs font-semibold">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {filteredGiveaways.map((g, index) => {
//                   const p = g.giveawayProcessingDetails || {};
//                   const pickupDate = g.pickupDate ? new Date(g.pickupDate).toLocaleDateString() : "—";
//                   const pickupTime = g.pickupTime === "morning" ? "Morning" : g.pickupTime || "—";

//                   return (
//                     <tr key={g._id} className="hover:bg-gray-50">
//                       {/* Sr No */}
//                       <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
//                          <td className="px-4 py-3 text-sm">{g?._id || "N/A"}</td>
//                       {/* Name */}
//                       <td className="px-4 py-3 text-sm">{g.seller?.name || "N/A"}</td>

//                       {/* Email */}
//                       <td className="px-4 py-3 text-sm">{g.seller?.email || "N/A"}</td>

//                       {/* Phone */}
//                       <td className="px-4 py-3 text-sm">{g.seller?.phone || "N/A"}</td>

//                       {/* Pickup Date & Time */}
//                       <td className="px-4 py-3 text-sm">
//                         {pickupDate} <br />
//                         <span className="text-xs text-gray-500">{pickupTime}</span>
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-3">
//                         <span className={`px-2 py-1 rounded-full text-xs ${
//                           g.status === "Collected" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                         }`}>
//                           {g.status || "Pending"}
//                         </span>
//                       </td>

//                       {/* CC Status */}
//                       <td className="px-4 py-3 text-sm">{p.customerCare?.confirmationStatus || "Pending"}</td>

//                       {/* Pickup Status */}
//                       <td className="px-4 py-3 text-sm">{p.pickupDetails?.pickupStatus || "—"}</td>

//                       {/* Actions */}
//                       <td className="px-4 py-3 text-right space-x-2">
//                         <button onClick={() => handleClick(g, "details")} className="text-blue-600 hover:underline text-sm">View</button>
//                         <button onClick={() => handleClick(g)} className="text-pink-600 hover:underline text-sm">Manage</button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {selectedGiveaway && (
//         <Modal
//           giveaway={selectedGiveaway}
//           currentStage={currentStage}
//           setCurrentStage={setCurrentStage}
//           viewMode={viewMode}
//           onClose={() => setSelectedGiveaway(null)}
//           refresh={fetchGiveaways}
//         />
//       )}
//     </div>
//   );
// };

// const Modal = ({ giveaway, currentStage, setCurrentStage, viewMode, onClose, refresh }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="px-6 py-4 border-b flex justify-between items-center">
//           <h2 className="text-xl font-bold">Giveaway #{giveaway._id}</h2>
//           <button onClick={onClose}><X className="h-6 w-6" /></button>
//         </div>
//         <div className="p-6">
//           {viewMode === "details" ? (
//             <GiveawayOrderDetails giveaway={giveaway} />
//           ) : (
//             <>
//               <GiveawayProgressIndicator currentStage={currentStage} giveaway={giveaway} />
//               {currentStage === "customercare" && (
//                 <GiveawayCustomerCare giveaway={giveaway} setCurrentStage={setCurrentStage} refresh={refresh} />
//               )}
//               {currentStage === "pickup" && (
//                 <GiveawayPickup giveaway={giveaway} setCurrentStage={setCurrentStage} />
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GiveawayManagement;








'use client';
// COMMENT: Next.js App Router ke liye 'use client' zaroori hai

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";
import { useSelector } from "react-redux";

// COMMENT: Next.js URL handling — react-router-dom nahi chalega
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import GiveawayCustomerCare from "./GiveawayCustomerCare";
import GiveawayPickup from "./GiveawayPickup";
import GiveawayProgressIndicator from "./GiveawayProgressIndicator";
import GiveawayOrderDetails from "./GiveawayOrderDetails";

const GiveawayManagement = () => {
  // COMMENT: URL se giveawayId padho
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlGiveawayId = searchParams.get('giveawayId') || '';
  const [searchQuery, setSearchQuery] = useState(urlGiveawayId); // COMMENT: URL se init

  const [giveaways, setGiveaways] = useState([]);
  const [filteredGiveaways, setFilteredGiveaways] = useState([]);
  const [selectedGiveaway, setSelectedGiveaway] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState("customercare");
  const [viewMode, setViewMode] = useState("");
  const token = useSelector((state) => state.otp?.token);

  // COMMENT: Kukuits fetch karo — agar exact ID hai toh /get/:id, warna /giveaways-admin
  const fetchGiveaways = async () => {
    setLoading(true);
    try {
      if (!token) return;

      let res;
      if (searchQuery && /^[0-9a-fA-F]{24}$/.test(searchQuery)) {
        // COMMENT: Exact 24-char MongoDB ID → direct fetch
        res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/giveaways/get/${searchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data.giveaway ? [res.data.giveaway] : [];
        setGiveaways(data);
        setFilteredGiveaways(data);
      } else {
        // COMMENT: All giveaways
        res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/giveaways/giveaways-admin`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGiveaways(res.data.data || []);
        setFilteredGiveaways(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching giveaways:", err);
    } finally {
      setLoading(false);
    }
  };

  // COMMENT: Page load pe data fetch karo — searchQuery change hone pe bhi
  useEffect(() => {
    if (token) {
      fetchGiveaways();
    }
  }, [token, searchQuery]); // COMMENT: searchQuery dependency add ki

  // COMMENT: Frontend filter — agar exact ID hai toh skip, warna name/email/phone/date/ID
  useEffect(() => {
    if (!searchQuery || /^[0-9a-fA-F]{24}$/.test(searchQuery)) {
      setFilteredGiveaways(giveaways);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = giveaways.filter((g) => {
        const pickupDate = g.pickupDate ? new Date(g.pickupDate).toLocaleDateString() : "";
        const pickupTime = g.pickupTime === "morning" ? "Morning" : g.pickupTime || "";
        return [
          g.seller?.name,
          g.seller?.email,
          g.seller?.phone,
          pickupDate,
          pickupTime,
          g._id
        ].some(field => field?.toString().toLowerCase().includes(query));
      });
      setFilteredGiveaways(filtered);
    }
  }, [searchQuery, giveaways]);

  // COMMENT: URL mein searchQuery update karo (state → URL)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('giveawayId', searchQuery);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchQuery, router, pathname]);

  // COMMENT: Page load pe URL se searchQuery set karo (URL → state)
  useEffect(() => {
    if (urlGiveawayId !== searchQuery) setSearchQuery(urlGiveawayId);
  }, [urlGiveawayId]);

  // COMMENT: Current stage determine karo
  const determineStage = (g) => {
    const p = g.giveawayProcessingDetails || {};
    const cc = p.customerCare?.confirmationStatus;
    const pickup = p.pickupDetails?.pickupStatus;

    if (!cc || cc === "pending" || cc === "rejected") return "customercare";
    if (cc === "approved" && pickup !== "Delivered") return "pickup";
    return "customercare";
  };

  // COMMENT: Giveaway click → modal kholo
  const handleClick = (giveaway, mode = "") => {
    setSelectedGiveaway(giveaway);
    setViewMode(mode);
    setCurrentStage(determineStage(giveaway));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Giveaway Management</h1>
        <p className="text-gray-600 mb-6">Manage giveaway pickup requests</p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, date, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <tr>
                  {["Sr No", "Order ID", "Name", "Email", "Phone", "Pickup Date", "Status", "CC", "Pickup", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredGiveaways.map((g, index) => {
                  const p = g.giveawayProcessingDetails || {};
                  const pickupDate = g.pickupDate ? new Date(g.pickupDate).toLocaleDateString() : "—";
                  const pickupTime = g.pickupTime === "morning" ? "Morning" : g.pickupTime || "—";

                  return (
                    <tr key={g._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">{g?._id || "N/A"}</td>
                      <td className="px-4 py-3 text-sm">{g.seller?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm">{g.seller?.email || "N/A"}</td>
                      <td className="px-4 py-3 text-sm">{g.seller?.phone || "N/A"}</td>
                      <td className="px-4 py-3 text-sm">
                        {pickupDate} <br />
                        <span className="text-xs text-gray-500">{pickupTime}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          g.status === "Collected" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {g.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{p.customerCare?.confirmationStatus || "Pending"}</td>
                      <td className="px-4 py-3 text-sm">{p.pickupDetails?.pickupStatus || "—"}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => handleClick(g, "details")} className="text-blue-600 hover:underline text-sm">View</button>
                        <button onClick={() => handleClick(g)} className="text-pink-600 hover:underline text-sm">Manage</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedGiveaway && (
        <Modal
          giveaway={selectedGiveaway}
          currentStage={currentStage}
          setCurrentStage={setCurrentStage}
          viewMode={viewMode}
          onClose={() => setSelectedGiveaway(null)}
          refresh={fetchGiveaways}
        />
      )}
    </div>
  );
};

const Modal = ({ giveaway, currentStage, setCurrentStage, viewMode, onClose, refresh }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Giveaway #{giveaway._id}</h2>
          <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>
        <div className="p-6">
          {viewMode === "details" ? (
            <GiveawayOrderDetails giveaway={giveaway} />
          ) : (
            <>
              <GiveawayProgressIndicator currentStage={currentStage} giveaway={giveaway} />
              {currentStage === "customercare" && (
                <GiveawayCustomerCare giveaway={giveaway} setCurrentStage={setCurrentStage} refresh={refresh} />
              )}
              {currentStage === "pickup" && (
                <GiveawayPickup giveaway={giveaway} setCurrentStage={setCurrentStage} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiveawayManagement;