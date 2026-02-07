




import { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaTags,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, message } from "antd";

const Renting = () => {
  const [rentalProducts, setRentalProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Reference Data State
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [allCategories, setAllCategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  useEffect(() => {
    const fetchRentalProducts = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(Cookies.get("token"));
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/rental-products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRentalProducts(response.data.products);

        // Fetch reference data (brands, categories, conditions, sizes)
        const [brandsRes, categoriesRes, conditionsRes, sizesRes] =
          await Promise.all([
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/brands/getbrand`
            ),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`),
            axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/conditions/getcondition`
            ),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sizes/getSizes`),
          ]);
        setBrands(brandsRes.data.brands || []);
        setConditions(conditionsRes.data.conditions || []);
        setSizes(sizesRes.data.sizes || []);

        const categoryData = categoriesRes.data.data || [];
        setCategories(categoryData);
        setAllCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch rental products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setEditMode(false);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      pricePerDay: product.pricePerDay || "",
      // pricePerHour: product.pricePerHour || "",
      deposit: product.deposit || "",
      brand: product.brand?._id || "",
      category: product.category?.categoryName || "",
      subCategory: product.category?.subCategoryName || "",
      condition: product.condition?._id || "",
      openToRent: product.openToRent || "No",
      size: product.size?._id || "",
      usage: product.usage || "",
      damages: product.damages || "",
    });
  };

  const closeDetails = () => {
    setSelectedProduct(null);
    setEditMode(false);
  };

  const filteredProducts = rentalProducts.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getApprovalBadge = (status) => {
    if (status === "Accepted") {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
          <FaCheckCircle className="mr-1" /> Accepted
        </span>
      );
    } else if (status === "Rejected") {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center">
          <FaTimesCircle className="mr-1" /> Rejected
        </span>
      );
    } else if (status === "Sold") {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
          <FaCheckCircle className="mr-1" /> Sold
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      pricePerDay: product.pricePerDay || "",
      // pricePerHour: product.pricePerHour || "",
      deposit: product.deposit || "",
      brand: product.brand?._id || "",
      condition: product.condition?._id || "",
      openToRent: product.openToRent || "No",
      size: product.size?._id || "",
      usage: product.usage || "",
      damages: product.damages || "",
    });

    const categoryObj = product.category;
    if (categoryObj) {
      const parentCategory = categoryObj.parentCategory;
      const categoryName = categoryObj.categoryName;
      const subCategoryName = categoryObj.subCategoryName;

      setSelectedParentCategory(parentCategory);

      setTimeout(() => {
        if (parentCategory && categories) {
          const matchedParent = categories.find(
            (cat) => cat.parentCategory === parentCategory
          );
          if (matchedParent) {
            setFilteredCategories(matchedParent.categories || []);
            const matchedCategory = matchedParent.categories.find(
              (cat) => cat.categoryName === categoryName
            );
            if (matchedCategory) {
              setSelectedCategory(categoryName);
              setTimeout(() => {
                const activeSubCategories =
                  matchedCategory.subCategories?.filter((s) => s.status === "active") || [];
                setFilteredSubCategories(activeSubCategories);
                const matchedSubCategory = activeSubCategories.find(
                  (sub) => sub.subCategoryName === subCategoryName
                );
                if (matchedSubCategory) {
                  setSelectedSubCategory(subCategoryName);
                }
              }, 100);
            }
          }
        }
      }, 100);
    }

    setEditMode(true);
  };

  const handleParentCategoryChange = (e) => {
    const parent = e.target.value;
    setSelectedParentCategory(parent);
    const match = allCategories.find((cat) => cat.parentCategory === parent);
    setFilteredCategories(match?.categories || []);
    setSelectedCategory("");
    setFilteredSubCategories([]);
    setSelectedSubCategory("");
  };

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setSelectedCategory(categoryName);
    const match = filteredCategories.find(
      (cat) => cat.categoryName === categoryName
    );
    setFilteredSubCategories(
      match?.subCategories?.filter((s) => s.status === "active") || []
    );
    setSelectedSubCategory("");
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const brandObj = brands.find((b) => b._id === formData.brand);
    const conditionObj = conditions.find((c) => c._id === formData.condition);
    const sizeObj = sizes.find((s) => s._id === formData.size);

    const updatedData = {
      ...formData,
      brand: brandObj?.brandName || "",
      condition: conditionObj?.conditionName || "",
      size: sizeObj?.sizeName || "",
      pricePerDay: formData.pricePerDay,
      // pricePerHour: formData.pricePerHour,
      deposit: formData.deposit,
      category: {
        parentCategory: selectedParentCategory,
        categoryName: selectedCategory,
        subCategoryName: selectedSubCategory,
      },
    };

    try {
      const token = JSON.parse(Cookies.get("token"));
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/rental-product/edit/${selectedProduct._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedProducts = rentalProducts.map((product) => {
        if (product._id === selectedProduct._id) {
          return {
            ...product,
            ...updatedData,
            brand: { brandName: updatedData.brand },
            condition: { conditionName: updatedData.condition },
            size: { sizeName: updatedData.size },
          };
        }
        return product;
      });
      setRentalProducts(updatedProducts);
      setSelectedProduct({
        ...selectedProduct,
        ...updatedData,
        brand: { brandName: updatedData.brand },
        condition: { conditionName: updatedData.condition },
        size: { sizeName: updatedData.size },
      });
      setEditMode(false);
      message.success("Product updated successfully");
    } catch (error) {
      console.error("Failed to update product:", error);
      message.error(
        "Failed to update product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = JSON.parse(Cookies.get("token"));
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/rental-product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRentalProducts(
        rentalProducts.filter((product) => product._id !== productId)
      );

      if (selectedProduct && selectedProduct._id === productId) {
        setSelectedProduct(null);
      }

      message.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      message.error(
        "Failed to delete product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const renderEditForm = () => {
    return (
      <form onSubmit={handleUpdateProduct} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (AED)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Day (AED)
            </label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Hour (AED)
            </label>
            <input
              type="number"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deposit (AED)
            </label>
            <input
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <select
              value={selectedParentCategory}
              onChange={handleParentCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              {allCategories.map((item) => (
                <option key={item._id} value={item.parentCategory}>
                  {item.parentCategory}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {filteredCategories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subcategory</option>
              {filteredSubCategories.map((sub) => (
                <option key={sub._id} value={sub.subCategoryName}>
                  {sub.subCategoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {conditions.map((condition) => (
                <option key={condition._id} value={condition._id}>
                  {condition.conditionName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available for Rent
            </label>
            <select
              name="openToRent"
              value={formData.openToRent}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sizes.map((size) => (
                <option key={size._id} value={size._id}>
                  {size.sizeName}
                </option>
              ))}
            </select>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage
            </label>
            <input
              type="text"
              name="usage"
              value={formData.usage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */}

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Damages
            </label>
            <textarea
              name="damages"
              value={formData.damages}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Rental Products
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              View and manage products available for rent
            </p>
          </div>
          <div className="mt-4 md:mt-0 relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Condition
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No products found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.images && product.images.length > 0 ? (
                              <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden relative">
                                <img
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-16 w-16 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center">
                                <span className="text-lg font-medium">
                                  {product.name ? product.name[0] : "?"}
                                </span>
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {product.brand && (
                                  <span className="inline-flex items-center mr-2">
                                    <FaTags
                                      className="mr-1 text-gray-400"
                                      size={10}
                                    />
                                    {product.brand.brandName || "N/A"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                            {product.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {product.category && product.category.categoryName && product.category.subCategoryName && (
                              <span>
                                {product.category.categoryName} &gt; {product.category.subCategoryName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.condition?.conditionName || "N/A"}
                          </div>
                          {product.damages && (
                            <div className="text-xs text-gray-500 mt-1">
                              {product.damages}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.price ? `${product.price} AED` : "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {product.openToRent === "Yes"
                              ? "Available to rent"
                              : "Not for rent"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.approval ? (
                            getApprovalBadge(product.approval.status)
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              Not Reviewed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                          <button
                            onClick={() => handleProductClick(product)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <FaEye className="mr-1.5" /> Details
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                          >
                            <FaEdit className="mr-1.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            <FaTrash className="mr-1.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editMode ? "Edit Product" : "Product Details"}
                </h2>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {editMode ? (
                  renderEditForm()
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="bg-gray-100 rounded-lg mb-4 h-64 overflow-hidden">
                        {selectedProduct.images &&
                        selectedProduct.images.length > 0 ? (
                          <img
                            src={
                              selectedProduct.images[0] || "/placeholder.svg"
                            }
                            alt={selectedProduct.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            No image available
                          </div>
                        )}
                      </div>

                      {selectedProduct.images &&
                        selectedProduct.images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2">
                            {selectedProduct.images.map((img, index) => (
                              <div
                                key={index}
                                className="h-20 overflow-hidden rounded-md border-2 border-transparent hover:border-blue-500 cursor-pointer"
                              >
                                <img
                                  src={img || "/placeholder.svg"}
                                  alt={`${selectedProduct.name} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        {selectedProduct.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
                        <div className="col-span-2">
                          <span className="text-sm font-medium text-gray-500">
                            Description:
                          </span>
                          <p className="text-gray-800 mt-1">
                            {selectedProduct.description || "N/A"}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Price:
                          </span>
                          <p className="text-gray-800 font-semibold">
                            {selectedProduct.price
                              ? `${selectedProduct.price} AED`
                              : "N/A"}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Price Per Day:
                          </span>
                          <p className="text-gray-800 font-semibold">
                            {selectedProduct.pricePerDay
                              ? `${selectedProduct.pricePerDay} AED`
                              : "N/A"}
                          </p>
                        </div>

                        {/* <div>
                          <span className="text-sm font-medium text-gray-500">
                            Price Per Hour:
                          </span>
                          <p className="text-gray-800 font-semibold">
                            {selectedProduct.pricePerHour
                              ? `${selectedProduct.pricePerHour} AED`
                              : "N/A"}
                          </p>
                        </div> */}

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Deposit:
                          </span>
                          <p className="text-gray-800 font-semibold">
                            {selectedProduct.deposit
                              ? `${selectedProduct.deposit} AED`
                              : "N/A"}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Brand:
                          </span>
                          <p className="text-gray-800">
                            {selectedProduct.brand?.brandName || "N/A"}
                          </p>
                        </div>

                         <div>
                          <span className="text-sm font-medium text-gray-500">
                            Parent Category:
                          </span>
                          <p className="text-gray-800">
                            {selectedProduct.category?.parentCategory || "N/A"}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Category:
                          </span>
                          <p className="text-gray-800">
                            {selectedProduct.category?.categoryName || "N/A"}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Subcategory:
                          </span>
                          <p className="text-gray-800">
                            {selectedProduct.category?.subCategoryName || "N/A"}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Condition:
                          </span>
                          <p className="text-gray-800">
                            {selectedProduct.condition?.conditionName || "N/A"}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Available for Rent:
                          </span>
                          <p className="text-gray-800">
                            {selectedProduct.openToRent || "N/A"}
                          </p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Size:
                          </span>
                          <p className="text-gray-800">
                            {selectedProduct.size?.sizeName || "N/A"}
                          </p>
                        </div>

                        {/* <div>
                          <span className="text-sm font-medium text-gray-500">
                            Usage:
                          </span>
                          <p className="text-gray-800">
                            {selectedProduct.usage || "N/A"}
                          </p>
                        </div> */}

                        <div className="col-span-2">
                          <span className="text-sm font-medium text-gray-500">
                            Damages:
                          </span>
                          <p className="text-gray-800">
                            {selectedProduct.damages || "None"}
                          </p>
                        </div>
                      </div>

                      {selectedProduct.seller && (
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="text-lg font-semibold mb-3 text-gray-800">
                            Seller Information
                          </h4>
                          <div className="flex items-center">
                            {selectedProduct.seller.avatar ? (
                              <img
                                src={
                                  selectedProduct.seller.avatar ||
                                  "/placeholder.svg"
                                }
                                alt={selectedProduct.seller.name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                <span className="text-sm font-medium">
                                  {selectedProduct.seller.name
                                    ? selectedProduct.seller.name[0]
                                    : "?"}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800">
                                {selectedProduct.seller.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                @{selectedProduct.seller.username}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedProduct.approval && (
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="text-lg font-semibold mb-3 text-gray-800">
                            Approval Status
                          </h4>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-500 w-24">
                                Status:
                              </span>
                              {getApprovalBadge(
                                selectedProduct.approval.status
                              )}
                            </div>
                            {selectedProduct.approval.reason && (
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Reason:
                                </span>
                                <p className="text-gray-800 mt-1">
                                  {selectedProduct.approval.reason}
                                </p>
                              </div>
                            )}
                            {selectedProduct.approval.updatedAt && (
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  Updated:
                                </span>
                                <p className="text-gray-800 mt-1">
                                  {new Date(
                                    selectedProduct.approval.updatedAt
                                  ).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                {!editMode && (
                  <button
                    onClick={() => handleEdit(selectedProduct)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mr-3"
                  >
                    <FaEdit className="mr-1.5" /> Edit
                  </button>
                )}
                <button
                  onClick={closeDetails}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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

export default Renting;