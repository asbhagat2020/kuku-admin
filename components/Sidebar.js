




import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineTags,
  AiOutlineAppstore,
  AiOutlineShop,
} from "react-icons/ai";
import { FaListAlt, FaHandsHelping } from "react-icons/fa";
import { MdCategory, MdLocalOffer } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";

const Sidebar = () => {
  const router = useRouter();
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isUserAccessOpen, setUserAccessOpen] = useState(false);
  const [isSellerOpen, setSellerOpen] = useState(false);
  const [selected, setSelected] = useState("dashboard");
  const [adminPermissions, setAdminPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const handleNavigation = (route) => {
    setSelected(route);
    router.push(`/${route}`);
  };

  const getAdminPermissions = async () => {
    try {
      const token = JSON.parse(Cookies.get("token"));
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get-permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Permissions:", res.data);
      setAdminPermissions(res.data.permissions || []);
      setIsSuperAdmin(res.data.superAdmin || false);
    } catch (error) {
      console.log("Error fetching permissions:", error);
    }
  };

  // Helper function to check if user has permission
  const hasPermission = (permission) => {
    return isSuperAdmin || adminPermissions.includes(permission);
  };

  // Helper function to check if any of the permissions exist
  const hasAnyPermission = (permissions) => {
    return isSuperAdmin || permissions.some((permission) => adminPermissions.includes(permission));
  };

  useEffect(() => {
    getAdminPermissions();
  }, []);

  return (
    <div className="w-64 h-screen bg-pink-600 text-white flex flex-col">
      <div className="flex flex-col items-center mb-5 p-5">
        <img src="/yellow-bird.png" alt="Logo" className="h-20 mb-2" />
        <h2 className="text-xl font-bold text-black">Kuku</h2>
      </div>

      <ul
        className="flex-grow overflow-y-auto p-5 space-y-6"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
            /* Hide Scrollbar for Webkit Browsers */
            ::-webkit-scrollbar {
              display: none; /* Hide scrollbar */
            }
          `}
        </style>

        {/* Dashboard */}
        {hasPermission("Dashboard") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "dashboard" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("dashboard")}
          >
            <AiOutlineDashboard className="mr-2" />
            Dashboard
          </li>
        )}

        {/* User Access Section */}
        {hasAnyPermission(["Admin", "Users", "Agents"]) && (
          <>
            <li
              className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
                selected === "user-access" ? "text-pink-300" : ""
              } hover:bg-pink-700`}
              onClick={() => setUserAccessOpen(!isUserAccessOpen)}
            >
              <AiOutlineUser className="mr-2" />
              User Management
            </li>
            {isUserAccessOpen && (
              <ul className="ml-4">
                {hasPermission("Admin") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "admins" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("admins")}
                  >
                    Admins
                  </li>
                )}
                {hasPermission("Users") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "users" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("users")}
                  >
                    Users
                  </li>
                )}
                {/* {hasPermission("Agents") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "agents" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("agents")}
                  >
                    Agents
                  </li>
                )} */}
              </ul>
            )}
          </>
        )}

        {hasAnyPermission(["CancelledOrders"]) && (
          <>
            <li
              className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
                selected === "user-access" ? "text-pink-300" : ""
              } hover:bg-pink-700`}
              onClick={() => setIsCancelled(!isCancelled)}
            >
              <AiOutlineUser className="mr-2" />
              Order Refund Management
            </li>
            {isCancelled && (
              <ul className="ml-4">
                {hasPermission("CancelledOrders") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "user-cancelled-order-refund" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("user-cancelled-order-refund")}
                  >
                    Users Cancelled Orders
                  </li>
                )}
              </ul>
            )}
          </>
        )}

        {/* Seller Options */}
        {hasAnyPermission(["Brands", "Colors", "Conditions", "Sizes"]) && (
          <>
            <li
              className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
                selected === "seller-options" ? "text-pink-300" : ""
              } hover:bg-pink-700`}
              onClick={() => setSellerOpen(!isSellerOpen)}
            >
              <AiOutlineUser className="mr-2" />
              Seller Options
            </li>
            {isSellerOpen && (
              <ul className="ml-4">
                {hasPermission("Brands") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "brands" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("brands")}
                  >
                    Brands
                  </li>
                )}
                {hasPermission("Colors") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "colors" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("colors")}
                  >
                    Colors
                  </li>
                )}
                {hasPermission("Conditions") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "conditions" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("conditions")}
                  >
                    Conditions
                  </li>
                )}
                {hasPermission("Sizes") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "sizes" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("sizes")}
                  >
                    Sizes
                  </li>
                )}
              </ul>
            )}
          </>
        )}

        {/* Products */}
        {hasPermission("Products") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "products" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("products")}
          >
            <AiOutlineTags className="mr-2" />
            Products
          </li>
        )}

          {/* Products */}
        {hasPermission("Kukuwarehouses") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "kuku-warehouses" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("kuku-warehouses")}
          >
            <AiOutlineTags className="mr-2" />
            KukuWarehouses
          </li>
        )}

        {/* Homepage Banner */}
        {hasPermission("homepagebanner") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "homepage-banner" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("homepage-banner")}
          >
            <AiOutlineTags className="mr-2" />
            Home page Banner
          </li>
        )}

        {/* Listings */}
        {hasPermission("Listing") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "listings" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("listings")}
          >
            <FaListAlt className="mr-2" />
            Listings
          </li>
        )}

        {/* Orders */}
        {hasPermission("Orders") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "orders" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("orders")}
          >
            <AiOutlineShop className="mr-2" />
            Orders
          </li>
        )}

        {/* Services Section */}
        {hasAnyPermission(["Services", "Buyers", "Sellers", "Kukit", "Renting", "Charity"]) && (
          <>
            <li
              className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
                selected === "services" ? "text-pink-300" : ""
              } hover:bg-pink-700`}
              onClick={() => setServicesOpen(!isServicesOpen)}
            >
              <AiOutlineAppstore className="mr-2" />
              Services
            </li>
            {isServicesOpen && (
              <ul className="ml-4">
                {/* {hasPermission("Buyers") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "buyer" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("buyer")}
                  >
                    Buyer
                  </li>
                )} */}
                {/* {hasPermission("Sellers") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "seller" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("seller")}
                  >
                    Seller
                  </li>
                )} */}
                {hasPermission("Kukit") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "kukit" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("kukit")}
                  >
                    Kukit
                  </li>
                )}
                {/* {hasPermission("Renting") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "renting" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("renting")}
                  >
                    Renting
                  </li>
                )} */}
                {hasPermission("Charity") && (
                  <li
                    className={`cursor-pointer mb-2 p-2 rounded-md transition-colors duration-200 ${
                      selected === "charity" ? "text-pink-300" : ""
                    } hover:bg-pink-700`}
                    onClick={() => handleNavigation("charity")}
                  >
                    <FaHandsHelping className="mr-2" />
                    Charity
                  </li>
                )}
              </ul>
            )}
          </>
        )}

        {/* Categories */}
        {hasPermission("Categories") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "categories" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("categories")}
          >
            <MdCategory className="mr-2" />
            Categories
          </li>
        )}

        {/* Coupons */}
        {hasPermission("Coupons") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "offer" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("offer")}
          >
            <MdLocalOffer className="mr-2" />
            Coupons
          </li>
        )}

        {/* Customer Care */}
        {/* {hasPermission("Customercare") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "customercare" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("customercare")}
          >
            <RiCustomerService2Line className="mr-2" />
            Customer Care
          </li>
        )} */}


         {hasPermission("UserSupport") && (
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${
              selected === "user-support" ? "text-pink-300" : ""
            } hover:bg-pink-700`}
            onClick={() => handleNavigation("user-support")}
          >
            <RiCustomerService2Line className="mr-2" />
            User Support
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;