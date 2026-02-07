import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { Space, Table, Select, Button, Input, Modal } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import { notification } from 'antd';

export const showSuccessNotification = (title, description, duration = 3000) => {
  notification.success({
    message: title,
    description,
    duration: duration / 1000,
  });
};

export const showErrorNotification = (title, description, duration = 3000) => {
  notification.error({
    message: title,
    description,
    duration: duration / 1000,
  });
};

export const showWarningNotification = (title, description, duration = 3000) => {
  notification.warning({
    message: title,
    description,
    duration: duration / 1000,
  });
};

const Offer = () => {
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage, setCouponsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("discountValue");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [viewModal, setviewModal] = useState({});
  const [currentCoupons, setcurrentCoupons] = useState([]);

  const [editingCouponIndex, setEditingCouponIndex] = useState(null);
  const [categories, setCategories] = useState([]); // Initialize as an empty array
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discountType: "Percentage",
    discountValue: 0,
    maxDiscount: null,
    minPurchase: null,
    usageLimit: null,
    userSpecific: "All Users",
    addedBy: null,
    eligibleUsers: [],
    applicableProducts: [],
    applicableCategories: [],
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const { user, token } = useSelector((store) => store.otp);

  const [loading, setLoading] = useState(false);

  const [code, setcode] = useState("");
  const [description, setdescription] = useState("");
  const [discountType, setdiscountType] = useState("");
  const [discountValue, setdiscountValue] = useState();
  const [maxDiscount, setmaxDiscount] = useState();
  const [minPurchase, setminPurchase] = useState();
  const [usageLimit, setusageLimit] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [isActive, setisActive] = useState();
  const [userSpecific, setuserSpecific] = useState("");
  const [applicableCategories, setapplicableCategories] = useState([]);

  const options = ["All Users", "New Users", "Returning Users"];

  useEffect(() => {
    // Fetch coupons from API here
    // Example: fetch('/api/coupons').then(response => response.json()).then(data => setCoupons(data));
  }, []);

  const totalPages = Math.ceil(coupons?.length / couponsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * couponsPerPage;
    const endIndex = startIndex + couponsPerPage;
    setcurrentCoupons(
      coupons
        ?.filter(
          (coupon) =>
            coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === "" || coupon.isActive.toString() === statusFilter),
        )
        ?.slice(startIndex, endIndex),
    );
  }, [coupons, currentPage, couponsPerPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCouponsPerPageChange = (e) => {
    setCouponsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    const sortedCoupons = [...coupons]?.sort((a, b) => {
      if (e.target.value === "discountValue") {
        return b.discountValue - a.discountValue;
      }
      return b.startDate - a.startDate;
    });
    setcurrentCoupons(sortedCoupons);
  };

  const handleStatusChange = (e) => {
    console.log("e", e.target.value);

    setStatusFilter(e.target.value);
    if (e.target.value == "") {
      setcurrentCoupons(coupons);
    } else {
      const sortedCoupons = coupons?.filter((item) => {
        console.log("item.isActive", item.isActive);
        return e.target.value === "false"
          ? item.isActive == false
          : e.target.value === "true"
            ? item.isActive == true
            : item;
      });
      setcurrentCoupons(sortedCoupons);
    }
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setNewCoupon({ ...newCoupon, applicableProducts: selectedOptions });
  };

  const getCategory = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`);
      console.log("categories................", response.data.data);
      setCategories(response.data.data);
    } catch (err) {
      showErrorNotification("Error", "Failed to fetch category");
    } finally {
      console.log("Done");
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (
      !newCoupon.code ||
      !newCoupon.description ||
      !newCoupon.discountType ||
      !newCoupon.discountValue ||
      !newCoupon.minPurchase ||
      !newCoupon.usageLimit ||
      !newCoupon.startDate ||
      !newCoupon.endDate ||
      !newCoupon.isActive ||
      !newCoupon.userSpecific
    ) {
      showErrorNotification("Validation Error", "Please fill all the fields");
    } else {
      try {
        const payload = {
          ...newCoupon,
          addedBy: user?._id,
          applicableCategories: newCoupon.applicableCategories
        };

        if (token) {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/coupon/createCoupon`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Handle the success response
          if (response.status === 201) {
            showSuccessNotification("Success", "Coupon added successfully");
            await getCoupon(); // Refresh coupon list
            setIsModalOpen(false); // Close modal
          } else {
            showErrorNotification("Error", response.data.message);
          }
        } else {
          console.error("Token is not set");
          showErrorNotification("Error", "Token is not set. Please login to continue.");
          return;
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error("Error submitting form:", error);
        showErrorNotification("Error", error.response.data.message);
      }
    }
  };

  useEffect(() => {
    getCoupon();
  }, []);

  const getCoupon = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/coupon/getCoupons`);
      setCoupons(response.data.coupons);
      console.log("coupan data................", response.data.coupons);
    } catch (err) {
      showErrorNotification("Error", "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCoupon = async (id) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/coupon/getCoupon/${id}`);

      if (response.status === 200) {
        const coupon = response.data.coupon;
        setcode(coupon.code);
        setdescription(coupon.description);
        setdiscountType(coupon.discountType);
        setdiscountValue(coupon.discountValue);
        setmaxDiscount(coupon.maxDiscount);
        setminPurchase(coupon.minPurchase);
        setusageLimit(coupon.usageLimit);
        setstartDate(coupon.startDate ? new Date(coupon.startDate).toISOString().slice(0, 10) : "");
        setendDate(coupon.endDate ? new Date(coupon.endDate).toISOString().slice(0, 10) : "");
        setisActive(coupon.isActive);
        setuserSpecific(coupon.userSpecific);
        setapplicableCategories(coupon.applicableCategories);

        setIsModalOpen1(true);
        setviewModal(coupon);
        getCategory();
      } else {
        showErrorNotification("Error", "Failed to fetch coupon");
      }
    } catch (error) {
      console.error("Error fetching coupon:", error);
      showErrorNotification("Error", "An error occurred while fetching the coupon. Please try again.");
    }
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: code,
        description: description,
        discountType: discountType,
        discountValue: discountValue,
        maxDiscount: maxDiscount,
        minPurchase: minPurchase,
        usageLimit: usageLimit,
        startDate: startDate,
        endDate: endDate,
        isActive: isActive,
        userSpecific: userSpecific,
        applicableCategories: applicableCategories
      };

      if (token) {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/coupon/updateCoupon/${viewModal?._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 200) {
          showSuccessNotification("Success", "Coupon updated successfully");
          await getCoupon(); // Refresh coupon list
          setIsModalOpen1(false); // Close modal
        } else {
          showErrorNotification("Error", response.data.message);
        }
      } else {
        console.error("Token is not set");
        showErrorNotification("Error", "Token is not set. Please login to continue.");
        return;
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      showErrorNotification("Error", error.response.data.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this coupon?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/coupon/deleteCoupon/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            showSuccessNotification("Success", "Coupon deleted successfully");
            getCoupon();
          } else {
            showErrorNotification("Error", "Failed to delete coupon");
          }
        } catch (err) {
          showErrorNotification("Error", "Failed to delete coupon");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Discount Type",
      dataIndex: "discountType",
      key: "discountType",
      filters: [
        { text: "Percentage", value: "Percentage" },
        { text: "Flat", value: "Flat" },
      ],
      onFilter: (value, record) => record.discountType === value,
    },
    {
      title: "Discount Value",
      dataIndex: "discountValue",
      key: "discountValue",
      sorter: (a, b) => a.discountValue - b.discountValue,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: "Usage Limit",
      dataIndex: "usageLimit",
      key: "usageLimit",
      sorter: (a, b) => a.usageLimit - b.usageLimit,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? "Active" : "Inactive"),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEditCoupon(record._id)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} onClick={() => handleDeleteCoupon(record._id)} danger />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Coupons</h1>
      <p className="text-sm text-gray-500 mb-4">Add new coupons to avail offers to dealers</p>

      <div className="mb-4 flex justify-between items-center">
        <Space>
          <Input
            placeholder="Search by coupon code"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select placeholder="Sort By" style={{ width: 150 }} onChange={handleSortChange}>
            <Select.Option value="discountValue">Discount Value</Select.Option>
            <Select.Option value="startDate">Start Date</Select.Option>
          </Select>
          <Select placeholder="Status" style={{ width: 120 }} onChange={handleStatusChange}>
            <Select.Option value="">All</Select.Option>
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsModalOpen(true);
            getCategory();
          }}
        >
          Add new coupon
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={currentCoupons}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: couponsPerPage,
          total: coupons.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setCouponsPerPage(pageSize);
          },
        }}
        loading={loading}
      />

      {/* Modal for Adding New Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Add New Coupon</h2>
            <div className="flex-1 overflow-y-auto pr-2">
              <input
                type="text"
                placeholder="Coupon Code"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <textarea
                placeholder="Description"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <select
                value={newCoupon.discountType}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                className="border rounded px-4 py-2 mb-2 w-full"
              >
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat</option>
              </select>
              <input
                type="number"
                placeholder="Discount Value"
                value={newCoupon.discountValue}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    discountValue: Number(e.target.value),
                  })
                }
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              {newCoupon.discountType === "Percentage" ? (
                <input
                  type="number"
                  placeholder="Max Discount"
                  value={newCoupon.maxDiscount || ""}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      maxDiscount: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="border rounded px-4 py-2 mb-2 w-full"
                />
              ) : (
                ""
              )}
              <input
                type="number"
                placeholder="Min Purchase"
                value={newCoupon.minPurchase || ""}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    minPurchase: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <input
                type="number"
                placeholder="Usage Limit"
                value={newCoupon.usageLimit || ""}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    usageLimit: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <input
                type="date"
                placeholder="Start Date"
                value={newCoupon.startDate}
                onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <input
                type="date"
                placeholder="End Date"
                value={newCoupon.endDate}
                onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <select
                value={newCoupon.isActive.toString()}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    isActive: e.target.value === "true",
                  })
                }
                className="border rounded px-4 py-2 mb-4 w-full"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <select
                value={newCoupon.userSpecific}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    userSpecific: e.target.value,
                  })
                }
                className="border rounded px-4 py-2 mb-4 w-full"
              >
                <option value="All Users">All Users</option>
                <option value="New Users">New Users</option>
                <option value="Returning Users">Returning Users</option>
              </select>

              <Autocomplete
                multiple
                options={categories.flatMap(cat =>
                  cat.categories.map(category => ({
                    parentCategory: cat.parentCategory,
                    categoryName: category.categoryName
                  }))
                )}
                getOptionLabel={(option) => `${option.parentCategory} - ${option.categoryName}`}
                value={newCoupon.applicableCategories}
                onChange={(event, newValue) => {
                  setNewCoupon({
                    ...newCoupon,
                    applicableCategories: newValue
                  });
                }}
                isOptionEqualToValue={(option, value) =>
                  option.parentCategory === value.parentCategory &&
                  option.categoryName === value.categoryName
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Applicable Categories"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: 0,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                )}
                className="border rounded px-4 py-2 mb-4 w-full"
              />
            </div>
            <div className="pt-4 mt-4 border-t flex justify-end">
              <button
                onClick={handleAddCoupon}
                className="bg-pink-600 text-white rounded px-4 py-2 hover:bg-pink-700 mr-2"
              >
                Add Coupon
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for view / Edit Coupon */}
      {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4">View / Edit Coupon Details</h2>
            <div className="flex-1 overflow-y-auto pr-2">
              <label>Coupon Code</label>
              <input
                type="text"
                placeholder={viewModal?.code}
                value={code}
                onChange={(e) => setcode(e.target.value)}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <label>Description</label>
              <textarea
                placeholder={viewModal?.description}
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <label>Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setdiscountType(e.target.value)}
                className="border rounded px-4 py-2 mb-2 w-full"
              >
                <option value={viewModal?.discountType}>{viewModal?.discountType}</option>
                {viewModal?.discountType === "Percentage" ? (
                  <option value="Flat">Flat</option>
                ) : (
                  <option value="Percentage">Percentage</option>
                )}
              </select>
              <label>Discount Value</label>
              <input
                type="number"
                placeholder={viewModal?.discountValue}
                value={discountValue ? discountValue : viewModal?.discountValue}
                onChange={(e) => setdiscountValue(Number(e.target.value))}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              {viewModal?.discountType === "Percentage" && discountType != "Flat" ? (
                <>
                  <label>Max Discount</label>
                  <input
                    type="number"
                    placeholder={viewModal?.maxDiscount}
                    value={maxDiscount || ""}
                    onChange={(e) => setmaxDiscount(e.target.value ? Number(e.target.value) : null)}
                    className="border rounded px-4 py-2 mb-2 w-full"
                  />
                </>
              ) : discountType === "Percentage" ? (
                <>
                  <label>Max Discount</label>
                  <input
                    type="number"
                    placeholder={viewModal?.maxDiscount}
                    value={maxDiscount || ""}
                    onChange={(e) => setmaxDiscount(e.target.value ? Number(e.target.value) : null)}
                    className="border rounded px-4 py-2 mb-2 w-full"
                  />
                </>
              ) : (
                ""
              )}
              <label>Min Purchase</label>
              <input
                type="number"
                placeholder={viewModal?.minPurchase}
                value={minPurchase || ""}
                onChange={(e) => setminPurchase(e.target.value ? Number(e.target.value) : null)}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <label>Usage Limit</label>
              <input
                type="number"
                placeholder={viewModal?.usageLimit}
                value={usageLimit || ""}
                onChange={(e) => setusageLimit(e.target.value ? Number(e.target.value) : null)}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <label>Start Date</label>
              <input
                type="date"
                placeholder={viewModal?.startDate}
                value={startDate ? startDate : viewModal?.startDate}
                onChange={(e) => setstartDate(e.target.value)}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <label>End Date</label>
              <input
                type="date"
                placeholder={viewModal?.endDate}
                value={endDate ? endDate : viewModal?.endDate}
                onChange={(e) => setendDate(e.target.value)}
                className="border rounded px-4 py-2 mb-2 w-full"
              />
              <label>Status</label>
              <select
                value={isActive?.toString()}
                onChange={(e) => setisActive(e.target.value)}
                className="border rounded px-4 py-2 mb-4 w-full"
              >
                <option value={viewModal?.isActive}>{viewModal?.isActive === true ? "Active" : "Inactive"}</option>
                {viewModal?.isActive === true ? (
                  <option value={false}>Inactive</option>
                ) : (
                  <option value={true}>Active</option>
                )}
              </select>
              <label>User Specific</label>
              <select
                value={userSpecific?.toString()}
                onChange={(e) => setuserSpecific(e.target.value)}
                className="border rounded px-4 py-2 mb-4 w-full"
              >
                <option value={viewModal?.userSpecific}>{viewModal?.userSpecific}</option>
                {viewModal?.userSpecific === "All Users" ? (
                  <>
                    <option value="New Users">New Users</option>
                    <option value="Returning Users">Returning Users</option>
                  </>
                ) : viewModal?.userSpecific === "New Users" ? (
                  <>
                    <option value="All Users">All Users</option>
                    <option value="Returning Users">Returning Users</option>
                  </>
                ) : (
                  <>
                    <option value="New Users">New Users</option>
                    <option value="All Users">All Users</option>
                  </>
                )}
              </select>
              <label>Applicable Categories</label>


              <Autocomplete
                multiple
                options={categories.flatMap(cat =>
                  cat.categories.map(category => ({
                    parentCategory: cat.parentCategory,
                    categoryName: category.categoryName
                  }))
                )}
                getOptionLabel={(option) => `${option.parentCategory} - ${option.categoryName}`}
                value={applicableCategories}
                onChange={(event, newValue) => {
                  setapplicableCategories(newValue);  // Remove the .map() transformation
                }}
                isOptionEqualToValue={(option, value) =>
                  option.parentCategory === value.parentCategory &&
                  option.categoryName === value.categoryName
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Applicable Categories"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        border: 0,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                )}
                className="border rounded px-4 py-2 mb-4 w-full"
              />
            </div>
            <div className="pt-4 mt-4 border-t flex justify-end">
              <button
                onClick={handleUpdateCoupon}
                className="bg-pink-600 text-white rounded px-4 py-2 hover:bg-pink-700 mr-2"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsModalOpen1(false)}
                className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offer;