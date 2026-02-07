// import React, { useState } from 'react';
// import { Search, Filter, ChevronDown, X, User, Mail, Phone, MapPin, Package, Eye } from 'lucide-react';

// const Buyer = () => {
//   const [buyers, setBuyers] = useState([
//     { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890', orders: [{ orderId: 'Order1' }, { orderId: 'Order2' }], address: '123 Main St', pinCode: '123456', totalQuantity: 5 },
//     { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', orders: [{ orderId: 'Order3' }], address: '456 Elm St', pinCode: '654321', totalQuantity: 3 },
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedBuyer, setSelectedBuyer] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filterField, setFilterField] = useState('name');

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleBuyerClick = (buyer) => {
//     setSelectedBuyer(buyer);
//     setIsModalOpen(true);
//   };

//   const filteredBuyers = buyers.filter((buyer) =>
//     buyer[filterField].toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedBuyer(null);
//   };

//   const getBadgeColor = (quantity) => {
//     if (quantity > 4) return 'bg-green-100 text-green-800';
//     if (quantity > 2) return 'bg-yellow-100 text-yellow-800';
//     return 'bg-red-100 text-red-800';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-sm p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyers Dashboard</h1>
//             <p className="text-gray-500">Manage and monitor your buyer information efficiently</p>
//           </div>

//           {/* Search and Filter Section */}
//           <div className="flex flex-col md:flex-row gap-4 mb-8">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder={`Search by ${filterField}...`}
//                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//               />
//             </div>
            
//             <div className="relative min-w-[200px]">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <select
//                 value={filterField}
//                 onChange={(e) => setFilterField(e.target.value)}
//                 className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 appearance-none bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
//               >
//                 <option value="name">Filter by Name</option>
//                 <option value="email">Filter by Email</option>
//                 <option value="phone">Filter by Phone</option>
//                 <option value="address">Filter by Address</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto rounded-xl border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredBuyers.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center text-gray-500">
//                         <User className="h-12 w-12 mb-4 text-gray-400" />
//                         <p className="text-lg font-medium">No buyers found</p>
//                         <p className="text-sm">Try adjusting your search or filter criteria</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredBuyers.map((buyer) => (
//                     <tr
//                       key={buyer.id}
//                       className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
//                       onClick={() => handleBuyerClick(buyer)}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 flex-shrink-0">
//                             <div className="h-full w-full rounded-full bg-pink-100 flex items-center justify-center">
//                               <span className="text-pink-600 font-medium">
//                                 {buyer.name.split(' ').map(n => n[0]).join('')}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{buyer.name}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{buyer.email}</div>
//                         <div className="text-sm text-gray-500">{buyer.phone}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-wrap gap-2">
//                           {buyer.orders.map((order, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
//                             >
//                               {order.orderId}
//                             </span>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{buyer.address}</div>
//                         <div className="text-sm text-gray-500">{buyer.pinCode}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(buyer.totalQuantity)}`}>
//                           {buyer.totalQuantity} items
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <button
//                           className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleBuyerClick(buyer);
//                           }}
//                         >
//                           <Eye className="h-4 w-4 mr-2" />
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedBuyer && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//           <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//             <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
//               <div className="absolute top-0 right-0 pt-4 pr-4">
//                 <button
//                   type="button"
//                   className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
//                   onClick={closeModal}
//                 >
//                   <span className="sr-only">Close</span>
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
//               <div className="sm:flex sm:items-start">
//                 <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
//                   <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
//                     Buyer Details
//                   </h3>
//                   <div className="mt-4 space-y-4">
//                     <div className="flex items-center">
//                       <User className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Name</p>
//                         <p className="text-sm text-gray-900">{selectedBuyer.name}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <Mail className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Email</p>
//                         <p className="text-sm text-gray-900">{selectedBuyer.email}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <Phone className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Phone</p>
//                         <p className="text-sm text-gray-900">{selectedBuyer.phone}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <Package className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Orders</p>
//                         <div className="flex flex-wrap gap-2 mt-1">
//                           {selectedBuyer.orders.map((order, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
//                             >
//                               {order.orderId}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <MapPin className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Address</p>
//                         <p className="text-sm text-gray-900">{selectedBuyer.address}</p>
//                         <p className="text-sm text-gray-500">PIN: {selectedBuyer.pinCode}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:w-auto sm:text-sm"
//                   onClick={closeModal}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Buyer;








// import React, { useState, useEffect } from 'react';
// import { Search, Filter, ChevronDown, X, User, Mail, Phone, MapPin, Package, Eye } from 'lucide-react';

// const Buyer = () => {
//   const [buyers, setBuyers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedBuyer, setSelectedBuyer] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filterField, setFilterField] = useState('name');
//   const [error, setError] = useState(null);

//   // Fetch data from the API
//   useEffect(() => {
//     const fetchBuyers = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/order/get/sellerBuyer');
//         const data = await response.json();
        
//         if (data.message === 'Order details fetched successfully') {
//           // Transform API data to match the component's buyer structure
//           const transformedBuyers = data.orders.reduce((acc, order) => {
//             const buyer = order.buyer;
//             const existingBuyer = acc.find(b => b.email === buyer.contact.email);

//             if (existingBuyer) {
//               // Add order to existing buyer
//               existingBuyer.orders.push({ orderId: order.orderId });
//               existingBuyer.totalQuantity += order.totalQuantity;
//             } else {
//               // Create new buyer entry
//               acc.push({
//                 id: buyer.contact.email, // Using email as unique ID
//                 name: buyer.name,
//                 email: buyer.contact.email,
//                 phone: buyer.contact.phone,
//                 orders: [{ orderId: order.orderId }],
//                 address: buyer.location.split(', ').slice(0, -2).join(', '), // Remove country and PIN from address
//                 pinCode: buyer.location.split(', ').pop().split(' ').pop(), // Extract PIN code
//                 totalQuantity: order.totalQuantity,
//               });
//             }
//             return acc;
//           }, []);
//           setBuyers(transformedBuyers);
//         } else {
//           setError('Failed to fetch buyer data');
//         }
//       } catch (err) {
//         setError('Error fetching data: ' + err.message);
//       }
//     };

//     fetchBuyers();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleBuyerClick = (buyer) => {
//     setSelectedBuyer(buyer);
//     setIsModalOpen(true);
//   };

//   const filteredBuyers = buyers.filter((buyer) =>
//     buyer[filterField].toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedBuyer(null);
//   };

//   const getBadgeColor = (quantity) => {
//     if (quantity > 4) return 'bg-green-100 text-green-800';
//     if (quantity > 2) return 'bg-yellow-100 text-yellow-800';
//     return 'bg-red-100 text-red-800';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-sm p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyers Dashboard</h1>
//             <p className="text-gray-500">Manage and monitor your buyer information efficiently</p>
//             {error && <p className="text-red-500 mt-2">{error}</p>}
//           </div>

//           {/* Search and Filter Section */}
//           <div className="flex flex-col md:flex-row gap-4 mb-8">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder={`Search by ${filterField}...`}
//                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//               />
//             </div>
            
//             <div className="relative min-w-[200px]">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <select
//                 value={filterField}
//                 onChange={(e) => setFilterField(e.target.value)}
//                 className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 appearance-none bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
//               >
//                 <option value="name">Filter by Name</option>
//                 <option value="email">Filter by Email</option>
//                 <option value="phone">Filter by Phone</option>
//                 <option value="address">Filter by Address</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto rounded-xl border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredBuyers.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center text-gray-500">
//                         <User className="h-12 w-12 mb-4 text-gray-400" />
//                         <p className="text-lg font-medium">No buyers found</p>
//                         <p className="text-sm">Try adjusting your search or filter criteria</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredBuyers.map((buyer) => (
//                     <tr
//                       key={buyer.id}
//                       className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
//                       onClick={() => handleBuyerClick(buyer)}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 flex-shrink-0">
//                             <div className="h-full w-full rounded-full bg-pink-100 flex items-center justify-center">
//                               <span className="text-pink-600 font-medium">
//                                 {buyer.name.split(' ').map(n => n[0]).join('')}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{buyer.name}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{buyer.email}</div>
//                         <div className="text-sm text-gray-500">{buyer.phone}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-wrap gap-2">
//                           {buyer.orders.map((order, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
//                             >
//                               {order.orderId}
//                             </span>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{buyer.address}</div>
//                         <div className="text-sm text-gray-500">{buyer.pinCode}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(buyer.totalQuantity)}`}>
//                           {buyer.totalQuantity} items
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <button
//                           className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleBuyerClick(buyer);
//                           }}
//                         >
//                           <Eye className="h-4 w-4 mr-2" />
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedBuyer && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//           <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
//             <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
//               <div className="absolute top-0 right-0 pt-4 pr-4">
//                 <button
//                   type="button"
//                   className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
//                   onClick={closeModal}
//                 >
//                   <span className="sr-only">Close</span>
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
//               <div className="sm:flex sm:items-start">
//                 <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
//                   <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
//                     Buyer Details
//                   </h3>
//                   <div className="mt-4 space-y-4">
//                     <div className="flex items-center">
//                       <User className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Name</p>
//                         <p className="text-sm text-gray-900">{selectedBuyer.name}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <Mail className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Email</p>
//                         <p className="text-sm text-gray-900">{selectedBuyer.email}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <Phone className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Phone</p>
//                         <p className="text-sm text-gray-900">{selectedBuyer.phone}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <Package className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Orders</p>
//                         <div className="flex flex-wrap gap-2 mt-1">
//                           {selectedBuyer.orders.map((order, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
//                             >
//                               {order.orderId}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <MapPin className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">Address</p>
//                         <p className="text-sm text-gray-900">{selectedBuyer.address}</p>
//                         <p className="text-sm text-gray-500">PIN: {selectedBuyer.pinCode}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:w-auto sm:text-sm"
//                   onClick={closeModal}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Buyer;








import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, X, User, Mail, Phone, MapPin, Package, Eye } from 'lucide-react';

const Buyer = () => {
  const [buyers, setBuyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterField, setFilterField] = useState('name');
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/sellerBuyer`);
        const data = await response.json();
        
        if (data.message === 'Order details fetched successfully') {
          // Transform API data to match the component's buyer structure
          const transformedBuyers = data.orders.reduce((acc, order) => {
            const buyer = order.buyer;
            const existingBuyer = acc.find(b => b.email === buyer.contact.email);

            if (existingBuyer) {
              // Add order to existing buyer
              existingBuyer.orders.push({ orderId: order.orderId });
              existingBuyer.totalQuantity += order.totalQuantity;
            } else {
              // Create new buyer entry
              acc.push({
                id: buyer.contact.email, // Using email as unique ID
                name: buyer.name,
                email: buyer.contact.email,
                phone: buyer.contact.phone,
                orders: [{ orderId: order.orderId }],
                address: buyer.location.split(', ').slice(0, -2).join(', '), // Remove country and PIN from address
                pinCode: buyer.location.split(', ').pop().split(' ').pop(), // Extract PIN code
                totalQuantity: order.totalQuantity,
              });
            }
            return acc;
          }, []);
          setBuyers(transformedBuyers);
        } else {
          setError('Failed to fetch buyer data');
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      }
    };

    fetchBuyers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBuyerClick = (buyer) => {
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
  };

  const filteredBuyers = buyers.filter((buyer) =>
    buyer[filterField].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBuyer(null);
  };

  const getBadgeColor = (quantity) => {
    if (quantity > 4) return 'bg-green-100 text-green-800';
    if (quantity > 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyers Dashboard</h1>
            <p className="text-gray-500">Manage and monitor your buyer information efficiently</p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={`Search by ${filterField}...`}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={filterField}
                onChange={(e) => setFilterField(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 appearance-none bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              >
                <option value="name">Filter by Name</option>
                <option value="email">Filter by Email</option>
                <option value="phone">Filter by Phone</option>
                <option value="address">Filter by Address</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6 max-w-xs">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBuyers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <User className="h-12 w-12 mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No buyers found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBuyers.map((buyer) => (
                    <tr
                      key={buyer.id}
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleBuyerClick(buyer)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap w-1/6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-full w-full rounded-full bg-pink-100 flex items-center justify-center">
                              <span className="text-pink-600 font-medium">
                                {buyer.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{buyer.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/6">
                        <div className="text-sm text-gray-900">{buyer.email}</div>
                        <div className="text-sm text-gray-500">{buyer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/6">
                        <div className="flex flex-wrap gap-2">
                          {buyer.orders.map((order, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                            >
                              {order.orderId}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 w-1/6 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        <div className="text-sm text-gray-900">{buyer.address}</div>
                        <div className="text-sm text-gray-500">{buyer.pinCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(buyer.totalQuantity)}`}>
                          {buyer.totalQuantity} items
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/6">
                        <button
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyerClick(buyer);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedBuyer && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                    Buyer Details
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-sm text-gray-900">{selectedBuyer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{selectedBuyer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{selectedBuyer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Orders</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedBuyer.orders.map((order, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                            >
                              {order.orderId}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-sm text-gray-900">{selectedBuyer.address}</p>
                        <p className="text-sm text-gray-500">PIN: {selectedBuyer.pinCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buyer;