import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingProducts,
  getProducts,
} from "@/store/Products/productSlicer.reducer";
import { Search, Filter, Package, X } from "lucide-react";
import { notification } from "antd";
import axios from "axios";

const Listing = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectButtonDisabled, setIsRejectButtonDisabled] = useState(true);

  const dispatch = useDispatch();
  // const { pendingProducts } = useSelector((store) => store.product);
  const { token } = useSelector((store) => store.otp);

  const [allProducts, setallProducts] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  // // Function to update product status in the local state
  // const updateProductStatus = (productId, newStatus) => {
  //   setFilteredProducts((prevProducts) =>
  //     prevProducts.map((p) =>
  //       p._id === productId
  //         ? { ...p, approval: { ...p.approval, status: newStatus } }
  //         : p
  //     )
  //   );
  // };



  // useEffect(() => {
  //   dispatch(getPendingProducts());
  // }, [dispatch]);


  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`);

      setallProducts(res.data);
    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, [])
  
  // useEffect(() => {
  //   if (pendingProducts && pendingProducts.length > 0) {
  //     const updatedProducts = pendingProducts.map((p, index) => ({
  //       ...p,
  //       displayIndex: index + 1,
  //       status: p.approval.status,
  //       username: p.seller?.username || "Not Available",
  //       name: p.seller?.name || "N/A",
  //     }));
  //     setFilteredProducts(updatedProducts);
  //   }
  // }, [pendingProducts]);

  // useEffect(() => {
  //   if (pendingProducts && pendingProducts.length > 0) {
  //     const results = pendingProducts.filter((p) =>
  //       p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     const updatedResults = results.map((p, index) => ({
  //       ...p,
  //       displayIndex: index + 1,
  //       status: p.approval.status,
  //       username: p.seller?.username || "Not Available",
  //       name: p.seller?.name || "N/A",
  //     }));
  //     setFilteredProducts(updatedResults);
  //   }
  // }, [pendingProducts, searchTerm]);

  useEffect(() => {
    setIsRejectButtonDisabled(rejectionReason.trim().length === 0);
  }, [rejectionReason]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setShowRejectForm(false);
    setRejectionReason("");
  };

  const handleApprove = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/approveproduct/${selectedProduct._id}`,
        { status: "Approved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state immediately
      updateProductStatus(selectedProduct._id, "Approved");

      // Update modal state
      setSelectedProduct((prev) => ({
        ...prev,
        approval: { ...prev.approval, status: "Approved" },
      }));

      setShowModal(false);

      api.success({
        message: "Product Approved",
        description: "The product has been successfully approved.",
        placement: "topRight",
        duration: 3,
      });

      // Refresh the products list
      dispatch(getProducts());
    } catch (error) {
      api.error({
        message: "Approval Failed",
        description: "Failed to approve the product. Please try again.",
        placement: "topRight",
        duration: 3,
      });
      console.error("Failed to approve product:", error);
    }
  };

  const initiateReject = () => {
    setShowRejectForm(true);
  };

  const handleReject = async () => {
    if (rejectionReason.trim() === "") return;

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/rejectproduct/${selectedProduct._id}`,
        { status: "Rejected", reason: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state immediately
      updateProductStatus(selectedProduct._id, "Rejected");

      // Update modal state
      setSelectedProduct((prev) => ({
        ...prev,
        approval: { ...prev.approval, status: "Rejected" },
      }));

      setShowModal(false);
      setShowRejectForm(false);
      setRejectionReason("");

      api.success({
        message: "Product Rejected",
        description: "The product has been rejected successfully.",
        placement: "topRight",
        duration: 3,
      });

      // Refresh the products list
      dispatch(getProducts());
    } catch (error) {
      api.error({
        message: "Rejection Failed",
        description: "Failed to reject the product. Please try again.",
        placement: "topRight",
        duration: 3,
      });
      console.error("Failed to reject product:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-green-300 text-green-800 border border-green-200";
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowRejectForm(false);
    setRejectionReason("");
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {contextHolder}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Product Listings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and monitor your product inventory
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allProducts.length > 0 ? (
                  allProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        #{product.displayIndex}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              src={
                                product.images && product.images.length > 0
                                  ? product.images[0]
                                  : "https://via.placeholder.com/150"
                              }
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            product.approval.status
                          )}`}
                        >
                          {product.approval.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleView(product)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-gray-500">
                        No products available
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-2xl mx-auto overflow-hidden">
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-white">
                  {selectedProduct.title}
                </h2>
                <p className="text-blue-100 mt-1">Product Details</p>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Product Image
                      </label>
                      <img
                        src={
                          selectedProduct.images &&
                            selectedProduct.images.length > 0
                            ? selectedProduct.images[0]
                            : "https://via.placeholder.com/150"
                        }
                        alt={selectedProduct.name}
                        className="mt-1 h-32 w-32 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Product ID
                      </label>
                      <p className="mt-1 text-gray-900">
                        #{selectedProduct._id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Item Name
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Description
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.description}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Category
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.category?.categoryName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Sub Category
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.category?.subCategoryName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Gender
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.category?.parentCategory}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Condition
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.condition?.conditionName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Brand
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.brand?.brandName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Size
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.size?.sizeName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Usage
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.usage}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Price
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.price}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Damages
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.damages}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Rent Option
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.rentOption}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Images
                      </label>
                      <div className="mt-1 flex space-x-2">
                        {Array.isArray(selectedProduct.images) &&
                          selectedProduct.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${selectedProduct.title} image ${index + 1
                                }`}
                              className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <span
                        className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(
                          selectedProduct.approval.status
                        )}`}
                      >
                        {selectedProduct.approval.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Username
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.seller?.username || "Not Available"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Name
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedProduct.seller?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {showRejectForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Rejection Reason
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a reason for rejection..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowRejectForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={isRejectButtonDisabled}
                        className={`px-4 py-2 rounded-md text-white ${isRejectButtonDisabled
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                          } transition-colors`}
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-3">
                    {/* <button
                      onClick={handleApprove}
                      className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${selectedProduct.approval.status === "Approved" ||
                        selectedProduct.approval.status === "Rejected"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                        }`}
                      disabled={
                        selectedProduct.approval.status === "Approved" ||
                        selectedProduct.status === "Rejected"
                      }
                    >
                      Approve
                    </button> */}
                    {/* <button
                      onClick={initiateReject}
                      className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${selectedProduct.approval.status === "Approved" ||
                        selectedProduct.approval.status === "Rejected"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                        }`}
                      disabled={
                        selectedProduct.approval.status === "Approved" ||
                        selectedProduct.approval.status === "Rejected"
                      }
                    >
                      Reject
                    </button> */}
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listing;
