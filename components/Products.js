import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  deleteProduct,
  editProduct,
  addProduct,
} from "@/store/Products/productSlicer.reducer";
import { Search, Filter, Plus, Trash2, Edit2, Eye, X } from "lucide-react";
import { Modal, message } from "antd";
import axios from "axios";
import ProductViewModel from "./ProductViewModel";
import ProductAddEditModal from "./ProductAddEditModal";
import Cookies from "js-cookie";

// Config object for API URLs
const Config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModals, setShowModals] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    images: ["https://via.placeholder.com/400"],
    price: "",
    description: "",
    condition: "",
    size: "",
    openToRent: "No",
    pricePerDay: "",
    // pricePerHour: "",
    deposit: "",
    usage: "",
    damages: "",
    category: "",
    brand: "",
    color: "",
    productType: "Listing",
    pickupAddress: {
      name: "",
      mob_no_country_code: "971",
      mobile_number: "",
      alt_ph_country_code: "971",
      alternate_phone: "",
      house_no: "",
      building_name: "",
      area: "",
      landmark: "",
      city: "",
      address_type: "Normal",
      email: "",
      country: "UAE",
    },
    warehouseAddress: {
      name: "",
      mob_no_country_code: "971",
      mobile_number: "",
      alt_ph_country_code: "971",
      alternate_phone: "",
      house_no: "",
      building_name: "",
      area: "",
      landmark: "",
      city: "",
      address_type: "Normal",
      email: "",
      country: "UAE",
    },
    onSale: false,
    discountPercentage: 0,
    isTopBrand: false,
    coupon: [],
    approval: {
      status: "Pending",
      reason: "",
    },
  });

  // State for reference data
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // New state variables for image upload
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("all"); // new

  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((store) => store.product);
  const token = useSelector((state) => state.otp?.token);

  // Fetch products and reference data
  useEffect(() => {
    dispatch(getProducts());
    fetchReferenceData();
  }, []);

  // Function to fetch all reference data
  const fetchReferenceData = async () => {
    try {
      const [brandsRes, categoriesRes, conditionsRes, sizesRes, colorsRes] =
        await Promise.all([
          axios.get(`${Config.API_BASE_URL}/brands/getbrand`),
          axios.get(`${Config.API_BASE_URL}/category`),
          axios.get(`${Config.API_BASE_URL}/conditions/getcondition`),
          axios.get(`${Config.API_BASE_URL}/sizes/getSizes`),
          axios.get(`${Config.API_BASE_URL}/colors/getcolor`),
        ]);

      // Handle categories data structure
      const Categories = categoriesRes.data.data.reduce((acc, category) => {
        if (!acc[category.parentCategory]) {
          acc[category.parentCategory] = [];
        }
        acc[category.parentCategory].push(category);
        return acc;
      }, {});

      setCategories(Categories);
      setBrands(brandsRes.data.brands || []);
      setConditions(conditionsRes.data.conditions || []);
      setSizes(sizesRes.data.sizes || []);
      setColors(colorsRes.data.colors || []);
    } catch (error) {
      console.error("Error fetching reference data:", error);
      message.error("Failed to load reference data");
    }
  };

  useEffect(() => {
    if (product?.length > 0) {
      setProducts(product);
      setFilteredProducts(product);
    }
  }, [product]);

  useEffect(() => {
    filterProducts(selectedFilter, searchTerm);
  }, [products, searchTerm, selectedFilter]);

  // Helper function to get entity name by ID
  const getEntityNameById = (entities, id) => {
    if (!id) return "N/A";
    const entity = entities.find((e) => e._id === id);
    return entity
      ? entity.name ||
          entity.brandName ||
          entity.colorName ||
          entity.code ||
          "N/A"
      : "N/A";
  };

  // const filterProducts = (status, search = searchTerm) => {
  //   let results = [...products];

  //   if (search) {
  //     results = results.filter(
  //       (product) =>
  //         product.name?.toLowerCase().includes(search.toLowerCase()) ||
  //         getEntityNameById(brands, product.brand).toLowerCase().includes(search.toLowerCase())
  //     );
  //   }

  //   if (status !== "all") {
  //     results = results.filter((product) => product?.approval?.status === status);
  //   }

  //   setSelectedFilter(status);
  //   setFilteredProducts(results);
  // };

  // Handle openToRent change

  const filterProducts = (
    status,
    search = searchTerm,
    productType = selectedProductType
  ) => {
    let results = [...products];

    // Search filter
    if (search) {
      results = results.filter(
        (product) =>
          product.name?.toLowerCase().includes(search.toLowerCase()) ||
          getEntityNameById(brands, product.brand)
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status !== "all") {
      results = results.filter(
        (product) => product?.approval?.status === status
      );
    }

    // Product Type filter
    if (productType !== "all") {
      results = results.filter(
        (product) => product?.productType === productType
      );
    }

    setSelectedFilter(status);
    setSelectedProductType(productType); // update both
    setFilteredProducts(results);
  };

  const handleOpenToRentChange = (e) => {
    const value = e.target.value;
    setNewProduct({
      ...newProduct,
      openToRent: value,
      ...(value === "No" && {
        pricePerDay: "",
        // pricePerHour: "",
        deposit: "",
      }),
    });
  };

  // Handle pickup address field changes
  const handlePickupAddressChange = (field, value) => {
    if (field === "phone") {
      const countryCode = "971";
      const mobileNumber = value.replace(/^971/, "").slice(0, 9) || "";
      setNewProduct((prev) => ({
        ...prev,
        pickupAddress: {
          ...prev.pickupAddress,
          mob_no_country_code: countryCode,
          mobile_number: mobileNumber,
        },
      }));
    } else if (field === "alternate_phone") {
      const countryCode = "971";
      const alternateNumber = value.replace(/^971/, "").slice(0, 9) || "";
      setNewProduct((prev) => ({
        ...prev,
        pickupAddress: {
          ...prev.pickupAddress,
          alt_ph_country_code: countryCode,
          alternate_phone: alternateNumber,
        },
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        pickupAddress: {
          ...prev.pickupAddress,
          [field]: value,
        },
      }));
    }
  };

  const handleEditProduct = (product) => {
    const categoryObj = product.category;
    const genderName = categoryObj?.parentCategory || "";
    const categoryName = categoryObj?.categoryName || "";
    const subCategoryName = categoryObj?.subCategoryName || "";

    // Set selected states to preserve hierarchy
    setSelectedGender(genderName);
    setSelectedCategory(categoryObj?._id || ""); // Use category ID for dropdown
    setSelectedSubCategory(subCategoryName);

    const pickupAddress = {
      name: product.pickupAddress?.name || "",
      mob_no_country_code: product.pickupAddress?.mob_no_country_code || "971",
      mobile_number: product.pickupAddress?.mobile_number || "",
      alt_ph_country_code: product.pickupAddress?.alt_ph_country_code || "971",
      alternate_phone: product.pickupAddress?.alternate_phone || "",
      house_no: product.pickupAddress?.house_no || "",
      building_name: product.pickupAddress?.building_name || "",
      area: product.pickupAddress?.area || "",
      landmark: product.pickupAddress?.landmark || "",
      city: product.pickupAddress?.city || "",
      address_type: product.pickupAddress?.address_type || "Normal",
      email: product.pickupAddress?.email || "",
      country: product.pickupAddress?.country || "UAE",
    };

    const brandId =
      typeof product.brand === "object" ? product.brand?._id : product.brand;
    const conditionId =
      typeof product.condition === "object"
        ? product.condition?._id
        : product.condition;
    const sizeId =
      typeof product.size === "object" ? product.size?._id : product.size;
    const colorId =
      typeof product.color === "object"
        ? product.color?._id
        : product.color || "";

    setEditingProduct({ ...product });

    setNewProduct({
      name: product.name || "",
      images: product.images || ["https://via.placeholder.com/400"],
      price: product.price || "",
      description: product.description || "",
      condition: conditionId || "",
      size: sizeId || "",
      color: colorId || "",
      openToRent: product.openToRent || "No",
      pricePerDay: product.pricePerDay || "",
      // pricePerHour: product.pricePerHour || "",
      deposit: product.deposit || "",
      usage: product.usage || "",
      damages: product.damages || "",
      category: categoryName, // Store category name for display
      brand: brandId || "",
      productType: product.productType || "Listing",
      pickupAddress: pickupAddress,
      onSale: product.onSale || false,
      discountPercentage: product.discountPercentage || 0,
      isTopBrand: product.isTopBrand || false,
      coupon: product.coupon || [],
      approval: product.approval
        ? { ...product.approval }
        : { status: "Pending", reason: "" },
    });

    setUploadedImageUrls(product.images || []);
    setSelectedImages([]);
    setShowModal(true);
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    setSelectedSubCategory("");

    let categoryName = "";
    if (selectedGender && categories && categories[selectedGender]) {
      for (const catObj of categories[selectedGender]) {
        if (!catObj.categories) continue;
        const foundCategory = catObj.categories.find(
          (cat) => cat._id === catId
        );
        if (foundCategory) {
          categoryName = foundCategory.categoryName;
          break;
        }
      }
    }

    setNewProduct({
      ...newProduct,
      category: categoryName,
    });
  };

  const handleSubCategoryChange = (e) => {
    const subCatId = e.target.value;
    setSelectedSubCategory(subCatId);
  };

  // const handleImageSelect = (event) => {
  //   const files = Array.from(event.target.files);
  //   setSelectedImages((prevImages) => [...prevImages, ...files]);
  // };

  // Handle image selection and upload
  const handleImageSelect = async (event) => {
    const files = Array.from(event.target.files);
    const totalImages = uploadedImageUrls.length + files.length;

    if (totalImages > 4) {
      message.error("Maximum 4 images allowed!");
      return;
    }

    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(
          `${Config.API_BASE_URL}/upload/admin/single`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          return response.data.fileUrl;
        } else {
          throw new Error(`Upload failed with status ${response.status}`);
        }
      });

      const newImageUrls = await Promise.all(uploadPromises);
      setUploadedImageUrls((prev) => [...prev, ...newImageUrls]);
      message.success(`${newImageUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error("Error uploading images:", error);
      message.error("Failed to upload images. Please try again.");
    } finally {
      setUploadingImages(false);
      event.target.value = ""; // Reset file input
    }
  };

  // Handle image removal
  const handleRemoveImage = (indexToRemove) => {
    setUploadedImageUrls((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    message.success("Image removed");
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) {
      message.warning("Please select images to upload.");
      return;
    }

    setUploadingImages(true);
    try {
      const uploadPromises = selectedImages.map(async (image) => {
        const formData = new FormData();
        formData.append("file", image);

        const response = await axios.post(
          `${Config.API_BASE_URL}/upload/admin/single`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          return response.data.fileUrl;
        } else {
          throw new Error(`Upload failed with status ${response.status}`);
        }
      });

      const imageUrls = await Promise.all(uploadPromises);
      setUploadedImageUrls(imageUrls);
      message.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      message.error("Failed to upload images. Please try again.");
    } finally {
      setUploadingImages(false);
    }
  };

  const findCategoryID = (genderName, categoryName) => {
    if (!categories[genderName]) return null;
    const genderCategories = categories[genderName];
    for (const catObj of genderCategories) {
      if (!catObj.categories) continue;
      const foundCategory = catObj.categories.find(
        (cat) => cat.categoryName === categoryName
      );
      if (foundCategory) {
        return foundCategory._id;
      }
    }
    return null;
  };

  const handleSaveProduct = async () => {
    const requiredFields = [
      "name",
      "price",
      "condition",
      "size",
      "category",
      "brand",
    ];
    if (newProduct.openToRent === "Yes") {
      requiredFields.push(
        "pricePerDay",
        // "pricePerHour",
        "deposit",
        "pickupAddress.name",
        "pickupAddress.mob_no_country_code",
        "pickupAddress.mobile_number",
        "pickupAddress.house_no",
        "pickupAddress.building_name",
        "pickupAddress.area",
        "pickupAddress.city",
        "pickupAddress.email"
      );
    }

    if (newProduct.openToRent === "Yes" && Number(newProduct.price) <= 500) {
      setError(
        "Renting option is available only when the price of the product is above 500 AED"
      );
      return;
    }

    const missingFields = requiredFields.filter((field) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return !newProduct[parent] || !newProduct[parent][child];
      }
      return !newProduct[field];
    });

    if (missingFields.length > 0) {
      setError(`Required fields missing: ${missingFields.join(", ")}`);
      return;
    }

    if (uploadedImageUrls.length < 2) {
      setError("Please upload at least 2 images");
      return;
    }
    if (uploadedImageUrls.length > 4) {
      setError("Maximum 4 images allowed");
      return;
    }

    setError("");

    // Find category details
    let categoryData = {};
    if (
      selectedGender &&
      selectedCategory &&
      categories &&
      categories[selectedGender]
    ) {
      const selectedCategoryData = categories[selectedGender]
        .flatMap((catObj) => catObj.categories || [])
        .find((cat) => cat._id === selectedCategory);
      if (selectedCategoryData) {
        const selectedSubCategoryData = selectedSubCategory
          ? selectedCategoryData.subCategories.find(
              (sub) => sub._id === selectedSubCategory
            )
          : null;
        categoryData = {
          parentCategory: selectedGender,
          categoryName: selectedCategoryData.categoryName,
          subCategoryName: selectedSubCategoryData
            ? selectedSubCategoryData.subCategoryName
            : "",
        };
      } else {
        setError("Invalid category selected");
        return;
      }
    } else {
      setError("Please select gender and category");
      return;
    }

    // Construct pickupAddress with separate mobile number and country code
    const pickupAddressData =
      newProduct.openToRent === "Yes"
        ? {
            ...newProduct.pickupAddress,
            mob_no_country_code: newProduct.pickupAddress.mob_no_country_code,
            mobile_number: newProduct.pickupAddress.mobile_number,
            alt_ph_country_code: newProduct.pickupAddress.alt_ph_country_code,
            alternate_phone: newProduct.pickupAddress.alternate_phone,
          }
        : undefined;

    const productData = {
      name: newProduct.name,
      images:
        uploadedImageUrls.length > 0 ? uploadedImageUrls : newProduct.images,
      price: Number(newProduct.price),
      description: newProduct.description,
      condition: newProduct.condition,
      brand: newProduct.brand,
      color: newProduct.color || null,
      category: categoryData, // Yaha object bhej rahe hai
      size: newProduct.size,
      openToRent: newProduct.openToRent,
      pricePerDay:
        newProduct.openToRent === "Yes"
          ? Number(newProduct.pricePerDay)
          : undefined,
      // pricePerHour: newProduct.openToRent === "Yes" ? Number(newProduct.pricePerHour) : undefined,
      deposit:
        newProduct.openToRent === "Yes"
          ? Number(newProduct.deposit)
          : undefined,
      usage: newProduct.usage,
      damages: newProduct.damages,
      productType: newProduct.productType,
      pickupAddress: pickupAddressData,
      onSale: newProduct.onSale,
      discountPercentage: Number(newProduct.discountPercentage) || 0,
      isTopBrand: newProduct.isTopBrand,
      coupon: newProduct.coupon.length > 0 ? newProduct.coupon : undefined,
      approval: { ...newProduct.approval },
    };

    try {
      if (editingProduct) {
        await dispatch(
          editProduct({
            productId: editingProduct._id,
            productData,
          })
        ).unwrap();
        message.success("Product updated successfully!");
      } else {
        await dispatch(
          addProduct({
            productData,
          })
        ).unwrap();
        message.success("Product added successfully!");
      }

      dispatch(getProducts());
      // Preserve last selected values if editing again
      if (editingProduct) {
        setNewProduct({
          ...newProduct,
          category: categoryData.categoryName, // Retain last category name
          images: productData.images,
          approval: { ...productData.approval },
        });
      } else {
        setNewProduct({
          name: "",
          images: ["https://via.placeholder.com/400"],
          price: "",
          description: "",
          condition: "",
          size: "",
          color: "",
          openToRent: "No",
          pricePerDay: "",
          // pricePerHour: "",
          deposit: "",
          usage: "",
          damages: "",
          category: "",
          brand: "",
          productType: "Listing",
          pickupAddress: {
            name: "",
            mob_no_country_code: "971",
            mobile_number: "",
            alt_ph_country_code: "971",
            alternate_phone: "",
            house_no: "",
            building_name: "",
            area: "",
            landmark: "",
            city: "",
            address_type: "Normal",
            email: "",
            country: "UAE",
          },
          onSale: false,
          discountPercentage: 0,
          isTopBrand: false,
          coupon: [],
          approval: {
            status: "Pending",
            reason: "",
          },
        });
      }
      setEditingProduct(null);
      setShowModal(false);
    } catch (error) {
      console.error("Save error:", error);
      setError(error.message || "Failed to save product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!token) {
      message.error("You must be logged in to delete products");
      return;
    }

    Modal.confirm({
      title: "Are you sure?",
      content:
        "Do you really want to delete this product? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const result = await dispatch(
            deleteProduct({ productId: id })
          ).unwrap();
          if (result) {
            message.success("Product deleted successfully!");
            setProducts((prevProducts) =>
              prevProducts.filter((prod) => prod._id !== id)
            );
            setFilteredProducts((prevFilteredProducts) =>
              prevFilteredProducts.filter((prod) => prod._id !== id)
            );
          }
        } catch (error) {
          if (error?.auth === false) {
            message.error("Authentication failed. Please login again.");
            return;
          }
          message.error(
            error?.message || "Failed to delete product. Please try again."
          );
        }
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Accepted: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Sold: "bg-blue-100 text-blue-800", // New color for Sold
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowModals(true);
  };

  const closeModal = () => {
    setShowModals(false);
    // Reset selected states only when closing modal
    if (!editingProduct) {
      setSelectedGender("");
      setSelectedCategory("");
      setSelectedSubCategory("");
    }
  };

  const getNestedValue = (obj, path, defaultValue = "N/A") => {
    if (!obj) return defaultValue;
    const value = path.split(".").reduce((acc, part) => acc && acc[part], obj);
    return value || defaultValue;
  };

  const getBrandName = (product) => {
    if (product.brand && (product.brand.name || product.brand.brandName)) {
      return product.brand.name || product.brand.brandName;
    }
    return getEntityNameById(brands, product.brand);
  };

  const getColorName = (product) => {
    if (product.color && product.color.colorName) {
      return product.color.colorName;
    }
    return getEntityNameById(colors, product.color);
  };

  const getCategoryName = (product) => {
    if (product.category && product.category.categoryName) {
      return product.category.categoryName;
    }
    if (product.category && typeof product.category === "string") {
      for (const gender in categories) {
        const found = categories[gender]?.find(
          (cat) => cat._id === product.category
        );
        if (found) {
          return found.categoryName || "N/A";
        }
      }
    }
    return "N/A";
  };

  const getGenderCategory = (product) => {
    if (product.category && product.category.parentCategory) {
      return product.category.parentCategory;
    }
    if (product.category && typeof product.category === "string") {
      for (const gender in categories) {
        const found = categories[gender]?.find(
          (cat) => cat._id === product.category
        );
        if (found) {
          return gender;
        }
      }
    }
    return "N/A";
  };

  const getSubCategoryName = (product) => {
    if (product?.category && product?.category?.subCategoryName) {
      return product?.category?.subCategoryName;
    }
    return "N/A";
  };

  const getConditionName = (product) => {
    if (product.condition && product.condition.conditionName) {
      return product.condition.conditionName;
    }
    return getEntityNameById(conditions, product.condition);
  };

  const getSizeName = (product) => {
    if (product.size && typeof product.size === "object") {
      if (product.size.sizeName) return product.size.sizeName;
      if (product.size.name) return product.size.name;
      if (product.size._id) {
        const sizeObj = sizes.find((s) => s._id === product.size._id);
        if (sizeObj) return sizeObj.sizeName || "N/A";
      }
    }
    if (product.size && typeof product.size === "string") {
      const sizeObj = sizes.find((s) => s._id === product.size);
      if (sizeObj) return sizeObj.sizeName || "N/A";
    }
    return "N/A";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const StatusDropdown = ({ currentStatus, productId, onStatusChange }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [reason, setReason] = useState("");
    const statuses = ["Pending", "Accepted", "Rejected", "Sold"]; // Added Sold

    const handleStatusChange = async (status) => {
      setNewStatus(status);
      if (
        status === "Rejected" ||
        status === "Accepted" ||
        (currentStatus === "Sold" && status !== "Sold")
      ) {
        setShowReasonModal(true);
      } else {
        await updateStatus(status, "");
      }
    };

    const updateStatus = async (status, reasonText) => {
      setIsUpdating(true);
      try {
        const token = JSON.parse(Cookies.get("token"));
        const updatePayload = {
          status,
          ...(reasonText && { reason: reasonText }),
        };

        const response = await axios.patch(
          `${Config.API_BASE_URL}/approveproduct/${productId}`,
          updatePayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          message.success(`Status updated to ${status}`);
          onStatusChange(productId, status);
        }
      } catch (error) {
        if (error.response?.status === 403) {
          message.error("You don't have permission to update product status");
        } else {
          message.error("Failed to update status");
        }
        console.error("Error updating status:", error);
      } finally {
        setIsUpdating(false);
        setShowReasonModal(false);
        setReason("");
      }
    };

    const handleSubmitReason = async () => {
      const isChangingFromSold =
        currentStatus === "Sold" && newStatus !== "Sold";
      if ((newStatus === "Rejected" || isChangingFromSold) && !reason.trim()) {
        message.error("Please provide a reason");
        return;
      }
      await updateStatus(newStatus, reason);
    };

    // Disable dropdown if currentStatus is Sold and selectedFilter is 'all'
    const isDisabled = currentStatus === "Sold" && selectedFilter === "all";

    return (
      <div className="relative">
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating || isDisabled}
          className={`text-sm rounded-full px-3 py-1 font-medium ${getStatusColor(
            currentStatus
          )} ${
            isUpdating || isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {isUpdating && (
          <div className="absolute right-0 top-0 h-full flex items-center pr-2">
            <div className="animate-spin h-4 w-4 border-2 border-pink-600 rounded-full border-t-transparent"></div>
          </div>
        )}
        <Modal
          title={`${newStatus} Product`}
          visible={showReasonModal}
          onOk={handleSubmitReason}
          onCancel={() => {
            setShowReasonModal(false);
            setReason("");
          }}
          okText={newStatus}
          okButtonProps={{
            style:
              newStatus === "Rejected"
                ? { backgroundColor: "#f43f5e" }
                : { backgroundColor: "#10b981" },
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {newStatus === "Rejected" || currentStatus === "Sold"
                ? "Reason (required)"
                : "Reason (optional)"}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                newStatus === "Rejected" || currentStatus === "Sold"
                  ? "Please provide the reason..."
                  : "You can add any comments..."
              }
            />
            {(newStatus === "Rejected" || currentStatus === "Sold") &&
              !reason.trim() && (
                <p className="mt-1 text-sm text-red-600">Reason is required</p>
              )}
          </div>
        </Modal>
      </div>
    );
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const updateProductState = (prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                approval: {
                  ...product.approval,
                  status: newStatus,
                },
              }
            : product
        );

      setProducts(updateProductState);
      setFilteredProducts(updateProductState);

      await dispatch(
        editProduct({
          productId,
          productData: {
            approval: {
              status: newStatus,
            },
          },
        })
      ).unwrap();

      dispatch(getProducts());
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setEditingProduct(null);
                setNewProduct({
                  name: "",
                  images: ["https://via.placeholder.com/400"],
                  price: "",
                  description: "",
                  condition: "",
                  size: "",
                  color: "",
                  openToRent: "No",
                  pricePerDay: "",
                  // pricePerHour: "",
                  deposit: "",
                  usage: "",
                  damages: "",
                  category: "",
                  brand: "",
                  productType: "Listing",
                  pickupAddress: {
                    name: "",
                    mob_no_country_code: "971",
                    mobile_number: "",
                    alt_ph_country_code: "971",
                    alternate_phone: "",
                    house_no: "",
                    building_name: "",
                    area: "",
                    landmark: "",
                    city: "",
                    address_type: "Normal",
                    email: "",
                    country: "UAE",
                  },
                  onSale: false,
                  discountPercentage: 0,
                  isTopBrand: false,
                  coupon: [],
                  approval: {
                    status: "Pending",
                    reason: "",
                  },
                });
                setSelectedGender("");
                setSelectedCategory("");
                setSelectedSubCategory("");
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name or brand..."
              className="pl-10 pr-4 py-2 w-[400px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            {["Accepted", "Pending", "Rejected", "Sold", "all"].map(
              (
                status // Added Sold
              ) => (
                <button
                  key={status}
                  onClick={() => filterProducts(status)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedFilter === status
                      ? "bg-pink-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
          {/* Product Type Filters */}
          <div className="flex flex-wrap gap-2">
            {["all", "Listing", "Kukit Purchase"].map((type) => (
              <button
                key={type}
                onClick={() => filterProducts(selectedFilter, searchTerm, type)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedProductType === type
                    ? "bg-pink-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {type === "all" ? "All Types" : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((el) => (
                  <tr key={el._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          <img
                            className="h-16 w-16 rounded-lg object-cover"
                            src={
                              el?.images?.[0] ||
                              "https://via.placeholder.com/150"
                            }
                            alt={el.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {el.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getBrandName(el)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>
                          {getCategoryName(el)} - {getSubCategoryName(el)}
                        </div>
                        <div className="text-gray-500">
                          {getGenderCategory(el)} • {getConditionName(el)} •{" "}
                          {getColorName(el)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        ${el.price}
                      </div>
                      {el.openToRent === "Yes" && (
                        <span className="text-xs text-pink-600">
                          Available for rent (${el.pricePerDay}/day)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusDropdown
                        currentStatus={el.approval?.status || "Pending"}
                        productId={el._id}
                        onStatusChange={handleStatusChange}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 text-gray-400 hover:text-gray-500"
                          onClick={() => handleView(el)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(el)}
                          className="p-1 text-gray-400 hover:text-gray-500"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(el._id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductAddEditModal
        showModal={showModal}
        setShowModal={setShowModal}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        error={error}
        setError={setError}
        handleSaveProduct={handleSaveProduct}
        brands={brands}
        categories={categories}
        conditions={conditions}
        sizes={sizes}
        colors={colors}
        coupons={coupons}
        selectedImages={selectedImages}
        uploadedImageUrls={uploadedImageUrls}
        uploadingImages={uploadingImages}
        handleImageSelect={handleImageSelect}
        handleRemoveImage={handleRemoveImage}
        uploadImages={uploadImages}
        handleOpenToRentChange={handleOpenToRentChange}
        handlePickupAddressChange={handlePickupAddressChange}
        handleCategoryChange={handleCategoryChange}
        handleSubCategoryChange={handleSubCategoryChange}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
      />

      <ProductViewModel
        showModals={showModals}
        selectedProduct={selectedProduct}
        closeModal={closeModal}
        getCategoryName={getCategoryName}
        getSubCategoryName={getSubCategoryName}
        getBrandName={getBrandName}
        getConditionName={getConditionName}
        getSizeName={getSizeName}
        getColorName={getColorName}
      />
    </div>
  );
};

export default Products;
