





// "use client";

// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FaBell } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { onMessage, messaging } from "../service/firebase";
// import { toast } from "react-toastify";

// const Navbar = () => {
//   const router = useRouter();
//   const { user } = useSelector((store) => store.otp);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const authToken = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;

//   // Fetch saved notifications
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!authToken) return;

//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-notify/getnotify`, {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         const data = await response.json();
//         if (data.success) {
//           setNotifications(data.notifications);
//         }
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();
//   }, [authToken]);

//   // Listen for real-time notifications (Rich Toast Primary + Popup Fallback)
//   useEffect(() => {
//     if (!authToken || !messaging) return;

//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log("📩 New Notification:", payload);
//       const title = payload.notification?.title || "New Notification";
//       const body = payload.notification?.body || "";
//       const orderId = payload.data?.orderId || "";
//       const awbNumber = payload.data?.awbNumber || "";
//       const imageUrl = payload.data?.imageUrl || "";

//       // Sound play (fixed: try-catch for load error)
//       try {
//         const audio = new Audio('/sounds/notification.mp3');
//         audio.volume = 0.5;
//         audio.load();
//         audio.play().catch(e => console.log('Sound play blocked:', e));
//       } catch (error) {
//         console.error("Sound file issue – re-upload /public/sounds/notification.mp3");
//       }

//       // Add to state
//       setNotifications((prev) => [
//         { _id: Date.now(), title, body, orderId, awbNumber, image: imageUrl, timestamp: new Date(), read: false },
//         ...prev,
//       ]);

//       // RICH TOAST (WhatsApp/Slack Style: Banner with image, buttons)
//       toast.info(
//         <div className="flex items-start space-x-3 p-3">
//           {imageUrl && (
//             <img src={imageUrl} alt="Order Image" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
//           )}
//           <div className="flex-1 min-w-0">
//             <h3 className="font-bold text-sm text-gray-900 mb-1">{title}</h3>
//             <p className="text-sm text-gray-600 mb-2">{body}</p>
//             {(orderId || awbNumber) && (
//               <div className="text-xs text-gray-500 space-y-1">
//                 {orderId && <p>Order ID: {orderId}</p>}
//                 {awbNumber && <p>AWB: {awbNumber}</p>}
//               </div>
//             )}
//           </div>
//         </div>,
//         {
//           position: "top-right",
//           autoClose: 10000, // Persist 10s
//           closeOnClick: false,
//           pauseOnHover: true,
//           style: {
//             background: '#ffffff',
//             borderRadius: '12px',
//             boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//             border: '1px solid #e5e7eb',
//             width: '400px',
//           },
//           className: 'whatsapp-toast', // Add animation in globals.css
//           toastId: 'order-toast', // Avoid duplicates
//         }
//       );

//       // Popup Fallback (no actions – error fix, but rich with image/vibrate)
//       if (Notification.permission === "granted") {
//         try {
//           const popup = new Notification(title, {
//             body: `${body} ${orderId ? `(Order: ${orderId})` : ''} ${awbNumber ? `(AWB: ${awbNumber})` : ''}`,
//             icon: "/logo.png",
//             image: imageUrl, // Big image preview
//             badge: "/favicon.ico",
//             tag: `order-notif-${Date.now()}`,
//             requireInteraction: true, // Persist until click
//             silent: false,
//             vibrate: [200, 100, 200],
//             data: { orderId },
//           });

//           popup.onclick = () => {
//             if (orderId) router.push(`/orders?orderId=${orderId}`);
//             window.focus();
//             popup.close();
//           };

//           popup.onshow = () => console.log("🔔 Popup shown!");
//         } catch (error) {
//           console.error("Popup error:", error);
//         }
//       } else if (Notification.permission === "default") {
//         Notification.requestPermission().then(perm => {
//           if (perm === "granted") {
//             new Notification(title, {
//               body: `${body} (Order: ${orderId})`,
//               icon: "/logo.png",
//               image: imageUrl,
//             });
//           }
//         });
//       }
//     });

//     return () => unsubscribe();
//   }, [authToken, router]);

//   // Mark as read
//   const markAsRead = async (notificationId) => {
//     try {
//       await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-notify/mark-read/${notificationId}`, {
//         method: "PATCH",
//         headers: { Authorization: `Bearer ${authToken}` },
//       });
//       setNotifications((prev) => 
//         prev.map((notif) => 
//           notif._id === notificationId ? { ...notif, read: true } : notif
//         )
//       );
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   // Mark all as read
//   const markAllAsRead = async () => {
//     try {
//       await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-notify/mark-all-read`, {
//         method: "PATCH",
//         headers: { Authorization: `Bearer ${authToken}` },
//       });
//       setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
//     } catch (error) {
//       console.error("Error marking all as read:", error);
//     }
//   };

//   // Logout
//   const handleLogout = () => {
//     Cookies.remove("token");
//     Cookies.remove("user");
//     router.push("/login");
//   };

//   // Check token
//   useEffect(() => {
//     if (!authToken) {
//       router.push("/login");
//     }
//   }, [authToken, router]);

//   return (
//     <div className="flex justify-between items-center bg-white p-4 shadow-md w-full">
//       <div className="flex-grow px-4">
//         {/* Search bar */}
//       </div>
//       <div className="flex items-center space-x-4">
//         {/* Notification Bell */}
//         <div className="relative">
//           <div
//             className="cursor-pointer"
//             onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
//           >
//             <FaBell className="text-gray-600 text-2xl" />
//             {notifications.filter((n) => !n.read).length > 0 && (
//               <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-600 rounded-full"></span>
//             )}
//           </div>
//           {/* Dropdown with image */}
//           {notificationDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-10 max-h-96 overflow-y-auto notifications-dropdown">
//               <div className="p-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="font-medium">Notifications</h3>
//                   <button
//                     onClick={markAllAsRead}
//                     className="text-sm text-blue-600 hover:underline"
//                   >
//                     Mark All as Read
//                   </button>
//                 </div>
//                 {notifications.length === 0 ? (
//                   <p className="text-gray-500">No notifications yet</p>
//                 ) : (
//                   <ul className="mt-2">
//                     {notifications.map((notif) => (
//                       <li
//                         key={notif._id}
//                         className={`p-2 border-b cursor-pointer hover:bg-gray-100 ${notif.read ? "bg-gray-50" : "bg-white"}`}
//                         onClick={() => markAsRead(notif._id)}
//                       >
//                         <strong>{notif.title}</strong>: {notif.body}
//                         {notif.image && <img src={notif.image} alt="Notif Image" className="w-12 h-12 mt-1 rounded-md object-cover" />}
//                         {notif.orderId && <span className="block text-sm text-gray-500">Order ID: {notif.orderId}</span>}
//                         {notif.awbNumber && <span className="block text-sm text-gray-500">AWB: {notif.awbNumber}</span>}
//                         <span className="block text-sm text-gray-500">{new Date(notif.timestamp).toLocaleString()}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* User Info Dropdown */}
//         <div className="relative">
//           <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
//             <img src={user?.avatar ? user.avatar : "/admin1.png"} alt="User Avatar" className="w-8 h-8 rounded-full" />
//             <div className="flex flex-col">
//               <span className="font-medium">{user?.name}</span>
//               <span className="text-sm text-gray-500">{user?.role}</span>
//             </div>
//           </div>
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-10">
//               <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;










"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import { onMessage, messaging } from "../service/firebase";
import { toast } from "react-toastify";

const Navbar = () => {
  const router = useRouter();
  const { user } = useSelector((store) => store.otp);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const authToken = Cookies.get("token") ? JSON.parse(Cookies.get("token")) : null;

  // Fetch saved notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!authToken) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-notify/getnotify`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [authToken]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!authToken || !messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("🔔 New Notification Payload:", payload);

      const title = payload.notification?.title || "New Notification";
      const body = payload.notification?.body || "";

      // Extract data from payload
      const entityId = payload.data?.entityId || "";
      const entityType = payload.data?.entityType || "Order";
      const awbNumber = payload.data?.awbNumber || "";
      const imageUrl = payload.data?.imageUrl || "";

      console.log("📦 Extracted Data:", { entityId, entityType, awbNumber });

      // Play notification sound
      try {
        const audio = new Audio('/sounds/notification.mp3');
        audio.volume = 0.5;
        audio.load();
        audio.play().catch(e => console.log('Sound play blocked:', e));
      } catch (error) {
        console.error("Sound file issue – re-upload /public/sounds/notification.mp3");
      }

      // Add to local state
      setNotifications((prev) => [
        {
          _id: Date.now(),
          title,
          body,
          entityId,
          entityType,
          awbNumber,
          image: imageUrl,
          timestamp: new Date(),
          read: false,
        },
        ...prev,
      ]);

      // RICH TOAST (WhatsApp/Slack Style)
      toast.info(
        <div className="flex items-start space-x-3 p-3">
          {imageUrl && (
            <img src={imageUrl} alt="Image" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-2">{body}</p>
            {(entityId || awbNumber) && (
              <div className="text-xs text-gray-500 space-y-1">
                {entityId && <p>ID: {entityId}</p>}
                {awbNumber && <p>AWB: {awbNumber}</p>}
                <p className="text-blue-600 font-medium">{entityType}</p>
              </div>
            )}
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 10000,
          closeOnClick: false,
          pauseOnHover: true,
          style: {
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            width: '400px',
          },
          className: 'whatsapp-toast',
          toastId: 'order-toast',
        }
      );

      console.log("🔐 Notification Permission:", Notification.permission);

      // ✅ FIXED BROWSER NOTIFICATION WITH WORKING CLICK
      if (Notification.permission === "granted") {
        try {
          console.log("✅ Creating browser notification...");
          
          // Build URL BEFORE creating notification
          let targetUrl = '';
          if (entityId) {
            const baseUrl = window.location.origin; // Get current domain
            if (entityType === "Order") {
              targetUrl = `${baseUrl}/orders?orderId=${entityId}`;
            } else if (entityType === "Kukuit") {
              targetUrl = `${baseUrl}/kukit?kukuitId=${entityId}`;
            } else if (entityType === "Giveaway") {
              targetUrl = `${baseUrl}/charity?giveawayId=${entityId}`;
            }
          }

          console.log("🚀 Target URL prepared:", targetUrl);
          
          const popup = new Notification(title, {
            body: `${body}${awbNumber ? ` (AWB: ${awbNumber})` : ''}`,
            icon: "/logo.png",
            image: imageUrl,
            badge: "/favicon.ico",
            tag: `notif-${entityId || Date.now()}`,
            requireInteraction: true,
            silent: false,
            vibrate: [200, 100, 200],
            data: { 
              entityId, 
              entityType, 
              awbNumber,
              targetUrl // ✅ Store complete URL in data
            },
          });

          // ✅ SIMPLIFIED CLICK HANDLER - Just open URL
          popup.onclick = function(event) {
            console.log("🖱️ Notification clicked!");
            console.log("📌 Data:", this.data);
            
            event.preventDefault();
            this.close();

            const url = this.data?.targetUrl;
            console.log("🎯 Opening URL:", url);

            if (url) {
              // Method 1: Try to focus existing window first
              try {
                window.focus();
                window.location.href = url;
              } catch (e) {
                console.log("Method 1 failed, trying window.open");
                // Method 2: Open in same window
                window.open(url, '_self');
              }
            } else {
              console.warn("⚠️ No URL found in notification data");
            }
          };

          popup.onshow = () => console.log("✅ Popup shown!");
          popup.onerror = (err) => console.error("❌ Notification error:", err);
          popup.onclose = () => console.log("🚪 Notification closed");

        } catch (error) {
          console.error("❌ Popup creation error:", error);
        }
      } else if (Notification.permission === "default") {
        console.log("⚠️ Requesting notification permission...");
        Notification.requestPermission().then(perm => {
          console.log("🔐 Permission result:", perm);
          if (perm === "granted") {
            // Build URL
            let targetUrl = '';
            if (entityId) {
              const baseUrl = window.location.origin;
              if (entityType === "Order") {
                targetUrl = `${baseUrl}/orders?orderId=${entityId}`;
              } else if (entityType === "Kukuit") {
                targetUrl = `${baseUrl}/kukit?kukuitId=${entityId}`;
              } else if (entityType === "Giveaway") {
                targetUrl = `${baseUrl}/charity?giveawayId=${entityId}`;
              }
            }

            const popup = new Notification(title, {
              body: `${body}${awbNumber ? ` (AWB: ${awbNumber})` : ''}`,
              icon: "/logo.png",
              image: imageUrl,
              data: { entityId, entityType, awbNumber, targetUrl },
            });

            popup.onclick = function(event) {
              event.preventDefault();
              this.close();
              const url = this.data?.targetUrl;
              if (url) {
                window.focus();
                window.location.href = url;
              }
            };
          }
        });
      } else {
        console.warn("❌ Notification permission denied");
      }
    });

    return () => unsubscribe();
  }, [authToken, router]);

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-notify/mark-read/${notificationId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-notify/mark-all-read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // Handle dropdown item click
  const handleNotificationClick = (notif) => {
    markAsRead(notif._id);
    if (notif.entityId) {
      if (notif.entityType === "Order") {
        router.push(`/orders?orderId=${notif.entityId}`);
      } else if (notif.entityType === "Kukuit") {
        router.push(`/kukit?kukuitId=${notif.entityId}`);
      } else if (notif.entityType === "Giveaway") {
        router.push(`/charity?giveawayId=${notif.entityId}`);
      }
    }
  };

  // Logout
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/login");
  };

  // Check token
  useEffect(() => {
    if (!authToken) {
      router.push("/login");
    }
  }, [authToken, router]);

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md w-full">
      <div className="flex-grow px-4">
        {/* Search bar */}
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <div
            className="cursor-pointer"
            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
          >
            <FaBell className="text-gray-600 text-2xl" />
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
            )}
          </div>

          {/* Dropdown */}
          {notificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg z-50 max-h-96 overflow-y-auto border">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark All Read
                  </button>
                </div>
              </div>
              <div className="p-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No notifications yet</p>
                ) : (
                  <ul>
                    {notifications.map((notif) => (
                      <li
                        key={notif._id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition ${notif.read ? "bg-gray-50 opacity-75" : "bg-white"}`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div className="flex items-start space-x-3">
                          {notif.image && (
                            <img
                              src={notif.image}
                              alt="Notif"
                              className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notif.body}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              {notif.entityId && <span>ID: {notif.entityId}</span>}
                              {notif.awbNumber && <span>• AWB: {notif.awbNumber}</span>}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-medium text-blue-600">
                                {notif.entityType}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(notif.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info Dropdown */}
        <div className="relative">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={user?.avatar ? user.avatar : "/admin1.png"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.role}</span>
            </div>
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg z-10 border">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;