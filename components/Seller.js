

import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, X, Building2, Phone, MapPin, Package, DollarSign, Eye } from 'lucide-react';

const Seller = () => {
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterField, setFilterField] = useState('sellerName');
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/sellerBuyer`);
        const data = await response.json();
        
        if (data.message === 'Order details fetched successfully') {
          // Transform API data to match the component's seller structure
          const sellerMap = new Map();
          data.orders.forEach(order => {
            order.sellers.forEach(seller => {
              const key = seller.contact.email; // Unique identifier
              if (!sellerMap.has(key)) {
                sellerMap.set(key, {
                  id: key,
                  sellerName: seller.name,
                  orders: [{ orderId: order.orderId }],
                  totalSales: order.totalQuantity, // Use totalQuantity as proxy for sales
                  location: seller.location.split('\n')[0].trim(), // Remove newline
                  phone: seller.contact.phone,
                  present: true, // Assume present if listed
                });
              } else {
                const existingSeller = sellerMap.get(key);
                existingSeller.orders.push({ orderId: order.orderId });
                existingSeller.totalSales += order.totalQuantity;
              }
            });
          });
          setSellers(Array.from(sellerMap.values()));
        } else {
          setError('Failed to fetch seller data');
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      }
    };

    fetchSellers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSellerClick = (seller) => {
    setSelectedSeller(seller);
    setIsModalOpen(true);
  };

  const filteredSellers = sellers.filter((seller) =>
    seller[filterField].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSeller(null);
  };

  const getSalesBadgeColor = (sales) => {
    if (sales > 100) return 'bg-emerald-100 text-emerald-800';
    if (sales > 50) return 'bg-pink-100 text-pink-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sellers Dashboard</h1>
            <p className="text-gray-500">Track and manage your seller network efficiently</p>
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
                <option value="sellerName">Filter by Name</option>
                <option value="location">Filter by Location</option>
                <option value="phone">Filter by Phone</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">Seller Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">Performance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSellers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Building2 className="h-12 w-12 mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No sellers found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSellers.map((seller) => (
                    <tr
                      key={seller.id}
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleSellerClick(seller)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap w-1/5">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-full w-full rounded-full bg-pink-100 flex items-center justify-center">
                              <span className="text-pink-600 font-medium">
                                {seller.sellerName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{seller.sellerName}</div>
                            <div className="text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{seller.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/5">
                        <div className="text-sm text-gray-900">{seller.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/5">
                        <div className="flex flex-wrap gap-2">
                          {seller.orders.map((order, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                            >
                              {order.orderId}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSalesBadgeColor(seller.totalSales)}`}>
                          <DollarSign className="h-4 w-4 mr-1" />
                          {seller.totalSales} sales
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-1/5">
                        <button
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSellerClick(seller);
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
      {isModalOpen && selectedSeller && (
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
                    Seller Details
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-sm text-gray-900">{selectedSeller.sellerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{selectedSeller.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Orders</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedSeller.orders.map((order, index) => (
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
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-sm text-gray-900">{selectedSeller.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Sales</p>
                        <p className="text-sm text-gray-900">{selectedSeller.totalSales} units</p>
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

export default Seller;