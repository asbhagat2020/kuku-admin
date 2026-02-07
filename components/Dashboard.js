// "use client"

// import { useState, useEffect } from "react"
// import {
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from "recharts"
// import { FiBox, FiUsers, FiDollarSign, FiClipboard, FiTrendingUp, FiPieChart } from "react-icons/fi"

// const Dashboard = () => {
//   const [incomeData, setIncomeData] = useState([])
//   const [listingsData, setListingsData] = useState({})
//   const [ordersData, setOrdersData] = useState({})
//   const [usersData, setUsersData] = useState({})
//   const [orderStatusData, setOrderStatusData] = useState([])

//   useEffect(() => {
//     fetchIncomeData()
//     fetchListingsData()
//     fetchOrdersData()
//     fetchUsersData()
//     fetchOrderStatusData()
//   }, [])

//   const fetchIncomeData = async () => {
//     setIncomeData([
//       { name: "Jan", income: 1000, users: 200 },
//       { name: "Feb", income: 1500, users: 250 },
//       { name: "Mar", income: 2000, users: 300 },
//       { name: "Apr", income: 1700, users: 280 },
//       { name: "May", income: 2200, users: 350 },
//       { name: "Jun", income: 2400, users: 380 },
//       { name: "Jul", income: 2300, users: 400 },
//     ])
//   }

//   const fetchListingsData = async () => {
//     setListingsData({
//       totalListings: 120,
//       pendingApproval: 15,
//       liveListings: 105,
//     })
//   }

//   const fetchOrdersData = async () => {
//     setOrdersData({
//       totalOrders: 721,
//       customerCare: 50,
//       pickup: 120,
//       qc: 80,
//       delivery: 400,
//       cancellation: 71,
//     })
//   }

//   const fetchUsersData = async () => {
//     setUsersData({
//       totalUsers: 1000,
//       activeUsers: 750,
//     })
//   }

//   const fetchOrderStatusData = async () => {
//     setOrderStatusData([
//       { name: "Customer Care", value: 50 },
//       { name: "Pickup", value: 120 },
//       { name: "QC", value: 80 },
//       { name: "Delivery", value: 400 },
//       { name: "Cancellation", value: 71 },
//     ])
//   }

//   const COLORS = ["#4C51BF", "#48BB78", "#ECC94B", "#ED64A6", "#9F7AEA"]

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

//       {/* Top Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           title="Listings"
//           value={listingsData.totalListings}
//           icon={<FiClipboard className="w-6 h-6" />}
//           change={+5}
//           gradient="from-blue-400 to-blue-600"
//         />
//         <StatCard
//           title="Orders"
//           value={ordersData.totalOrders}
//           icon={<FiBox className="w-6 h-6" />}
//           change={+12}
//           gradient="from-green-400 to-green-600"
//         />
//         <StatCard
//           title="Users"
//           value={usersData.totalUsers}
//           icon={<FiUsers className="w-6 h-6" />}
//           change={+8}
//           gradient="from-purple-400 to-purple-600"
//         />
//         <StatCard
//           title="Income"
//           value="$12,340"
//           icon={<FiDollarSign className="w-6 h-6" />}
//           change={+15}
//           gradient="from-pink-400 to-pink-600"
//         />
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//         <ChartCard title="Income & User Growth" icon={<FiTrendingUp className="w-6 h-6" />}>
//           <ResponsiveContainer width="100%" height={400}>
//             <AreaChart data={incomeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//               <defs>
//                 <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
//                 </linearGradient>
//                 <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <XAxis dataKey="name" stroke="#888" />
//               <YAxis stroke="#888" />
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "rgba(255, 255, 255, 0.8)",
//                   borderRadius: "8px",
//                   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                 }}
//               />
//               <Area type="monotone" dataKey="income" stroke="#8884d8" fillOpacity={1} fill="url(#colorIncome)" />
//               <Area type="monotone" dataKey="users" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUsers)" />
//             </AreaChart>
//           </ResponsiveContainer>
//         </ChartCard>

//         <ChartCard title="Order Status Distribution" icon={<FiPieChart className="w-6 h-6" />}>
//           <ResponsiveContainer width="100%" height={400}>
//             <PieChart>
//               <Pie
//                 data={orderStatusData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={150}
//                 innerRadius={80}
//                 paddingAngle={5}
//                 stroke="#fff"
//                 strokeWidth={2}
//               >
//                 {orderStatusData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "rgba(255, 255, 255, 0.8)",
//                   borderRadius: "8px",
//                   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                 }}
//               />
//               <Legend layout="vertical" verticalAlign="middle" align="right" />
//             </PieChart>
//           </ResponsiveContainer>
//         </ChartCard>
//       </div>

//       {/* Listings and Users Overview */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <OverviewCard
//           title="Listings Overview"
//           icon={<FiClipboard className="w-6 h-6" />}
//           items={[
//             { label: "Total Listings", value: listingsData.totalListings, color: "blue" },
//             { label: "Pending Approval", value: listingsData.pendingApproval, color: "yellow" },
//             { label: "Live Listings", value: listingsData.liveListings, color: "green" },
//           ]}
//         />
//         <OverviewCard
//           title="Users Overview"
//           icon={<FiUsers className="w-6 h-6" />}
//           items={[
//             { label: "Total Users", value: usersData.totalUsers, color: "purple" },
//             { label: "Active Users", value: usersData.activeUsers, color: "green" },
//             { label: "Inactive Users", value: usersData.totalUsers - usersData.activeUsers, color: "red" },
//           ]}
//         />
//       </div>
//     </div>
//   )
// }

// const StatCard = ({ title, value, icon, change, gradient }) => (
//   <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
//     <div className={`p-4 bg-gradient-to-r ${gradient}`}>
//       <div className="flex justify-between items-center text-white">
//         <h3 className="font-semibold text-lg">{title}</h3>
//         {icon}
//       </div>
//     </div>
//     <div className="p-4">
//       <div className="text-2xl font-bold text-gray-800">{value}</div>
//       <div className={`text-sm ${change >= 0 ? "text-green-500" : "text-red-500"} flex items-center mt-1`}>
//         {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%<span className="text-gray-500 ml-1">vs last month</span>
//       </div>
//     </div>
//   </div>
// )

// const ChartCard = ({ title, children, icon }) => (
//   <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//     <div className="p-4 border-b border-gray-200">
//       <div className="flex items-center">
//         {icon}
//         <h3 className="font-semibold text-lg text-gray-800 ml-2">{title}</h3>
//       </div>
//     </div>
//     <div className="p-4">{children}</div>
//   </div>
// )

// const OverviewCard = ({ title, icon, items }) => (
//   <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//     <div className="p-4 border-b border-gray-200">
//       <div className="flex items-center">
//         {icon}
//         <h3 className="font-semibold text-lg text-gray-800 ml-2">{title}</h3>
//       </div>
//     </div>
//     <div className="p-4">
//       <div className="space-y-4">
//         {items.map((item, index) => (
//           <div key={index} className="flex justify-between items-center">
//             <span className="text-gray-600">{item.label}</span>
//             <span className={`font-semibold text-${item.color}-600`}>{item.value}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// )

// export default Dashboard












"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { FiBox, FiUsers, FiDollarSign, FiClipboard, FiTrendingUp, FiPieChart } from "react-icons/fi"
import axios from "axios"
import Cookies from "js-cookie"

const Dashboard = () => {
  const [incomeData, setIncomeData] = useState([])
  const [listingsData, setListingsData] = useState({})
  const [ordersData, setOrdersData] = useState({})
  const [usersData, setUsersData] = useState({})
  const [orderStatusData, setOrderStatusData] = useState([])
  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    sold: 0,
  })

  useEffect(() => {
    fetchIncomeData()
    fetchListingsData()
    fetchOrdersData()
    fetchUsersData()
    fetchOrderStatusData()
  }, [])

  const fetchIncomeData = async () => {
    setIncomeData([
      { name: "Jan", income: 1000, users: 200 },
      { name: "Feb", income: 1500, users: 250 },
      { name: "Mar", income: 2000, users: 300 },
      { name: "Apr", income: 1700, users: 280 },
      { name: "May", income: 2200, users: 350 },
      { name: "Jun", income: 2400, users: 380 },
      { name: "Jul", income: 2300, users: 400 },
    ])
  }

  const fetchListingsData = async () => {
    try {
      const token = JSON.parse(Cookies.get("token") || "{}")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const products = response.data

      const counts = products.reduce(
        (acc, product) => {
          const status = product.approval?.status || "Pending"
          switch (status) {
            case "Pending":
              acc.pending += 1
              break
            case "Accepted":
              acc.accepted += 1
              break
            case "Rejected":
              acc.rejected += 1
              break
            case "Sold":
              acc.sold += 1
              break
          }
          acc.total += 1
          return acc
        },
        { total: 0, pending: 0, accepted: 0, rejected: 0, sold: 0 }
      )

      setStatusCounts(counts)
      setListingsData({
        totalListings: counts.total,
        pendingApproval: counts.pending,
        liveListings: counts.accepted,
        rejectedListings: counts.rejected,
        soldListings: counts.sold,
      })
    } catch (error) {
      console.error("Error fetching listings data:", error)
    }
  }

  const fetchOrdersData = async () => {
    try {
      const token = JSON.parse(Cookies.get("token") || "{}")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const orders = response.data.orders

      const counts = orders.reduce(
        (acc, order) => {
          const status = order.orderStatus
          acc.totalOrders += 1
          if (status === "Confirmed") {
            acc.customerCare += 1
          }
          if (status === "Delivered" || status === "Rented Return Delivered") {
            acc.delivery += 1
          }
          if (status === "Cancelled" || status === "QC-Rejected RTO Delivered") {
            acc.cancellation += 1
          }
          return acc
        },
        {
          totalOrders: 0,
          customerCare: 0,
          delivery: 0,
          cancellation: 0,
        }
      )

      setOrdersData(counts)
    } catch (error) {
      console.error("Error fetching orders data:", error)
    }
  }

  const fetchOrderStatusData = async () => {
    try {
      const token = JSON.parse(Cookies.get("token") || "{}")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/get/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const orders = response.data.orders

      const statusCounts = orders.reduce(
        (acc, order) => {
          const status = order.orderStatus
          if (status === "Confirmed") {
            acc.customerCare += 1
          }
          if (status === "Delivered" || status === "Rented Return Delivered") {
            acc.delivery += 1
          }
          if (status === "Cancelled" || status === "QC-Rejected RTO Delivered") {
            acc.cancellation += 1
          }
          return acc
        },
        {
          customerCare: 0,
          delivery: 0,
          cancellation: 0,
        }
      )

      setOrderStatusData([
        { name: "Customer Care", value: statusCounts.customerCare },
        { name: "Delivery", value: statusCounts.delivery },
        { name: "Cancellation", value: statusCounts.cancellation },
      ])
    } catch (error) {
      console.error("Error fetching order status data:", error)
    }
  }

  const fetchUsersData = async () => {
    try {
      const token = JSON.parse(Cookies.get("token") || "{}")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const users = response.data.users

      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      const counts = users.reduce(
        (acc, user) => {
          acc.totalUsers += 1
          const lastActivity = new Date(user.updatedAt)
          if (lastActivity > threeMonthsAgo) {
            acc.activeUsers += 1
          }
          return acc
        },
        { totalUsers: 0, activeUsers: 0 }
      )

      setUsersData({
        totalUsers: counts.totalUsers,
        activeUsers: counts.activeUsers,
      })
    } catch (error) {
      console.error("Error fetching users data:", error)
    }
  }

  const COLORS = ["#4C51BF", "#48BB78", "#ED64A6"]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Listings"
          value={listingsData.totalListings || 0}
          icon={<FiClipboard className="w-6 h-6" />}
          change={+5}
          gradient="from-blue-400 to-blue-600"
        />
        <StatCard
          title="Orders"
          value={ordersData.totalOrders || 0}
          icon={<FiBox className="w-6 h-6" />}
          change={+12}
          gradient="from-green-400 to-green-600"
        />
        <StatCard
          title="Users"
          value={usersData.totalUsers || 0}
          icon={<FiUsers className="w-6 h-6" />}
          change={+8}
          gradient="from-purple-400 to-purple-600"
        />
        <StatCard
          title="Income"
          value="$12,340"
          icon={<FiDollarSign className="w-6 h-6" />}
          change={+15}
          gradient="from-pink-400 to-pink-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Income & User Growth" icon={<FiTrendingUp className="w-6 h-6" />}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={incomeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area type="monotone" dataKey="income" stroke="#8884d8" fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="users" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Order Status Distribution" icon={<FiPieChart className="w-6 h-6" />}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                innerRadius={80}
                paddingAngle={5}
                stroke="#fff"
                strokeWidth={2}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Listings and Users Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OverviewCard
          title="Listings Overview"
          icon={<FiClipboard className="w-6 h-6" />}
          items={[
            { label: "Total Listings", value: statusCounts.total, color: "blue" },
            { label: "Pending Approval", value: statusCounts.pending, color: "yellow" },
            { label: "Accepted Listings", value: statusCounts.accepted, color: "green" },
            { label: "Rejected Listings", value: statusCounts.rejected, color: "red" },
            { label: "Sold Listings", value: statusCounts.sold, color: "blue" },
          ]}
        />
        <OverviewCard
          title="Orders Overview"
          icon={<FiBox className="w-6 h-6" />}
          items={[
            { label: "Total Orders", value: ordersData.totalOrders || 0, color: "blue" },
            { label: "Customer Care", value: ordersData.customerCare || 0, color: "purple" },
            { label: "Delivery", value: ordersData.delivery || 0, color: "blue" },
            { label: "Cancellation", value: ordersData.cancellation || 0, color: "red" },
          ]}
        />
        <OverviewCard
          title="Users Overview"
          icon={<FiUsers className="w-6 h-6" />}
          items={[
            { label: "Total Users", value: usersData.totalUsers || 0, color: "purple" },
            { label: "Active Users", value: usersData.activeUsers || 0, color: "green" },
            { label: "Inactive Users", value: (usersData.totalUsers || 0) - (usersData.activeUsers || 0), color: "red" },
          ]}
        />
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon, change, gradient }) => (
  <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
    <div className={`p-4 bg-gradient-to-r ${gradient}`}>
      <div className="flex justify-between items-center text-white">
        <h3 className="font-semibold text-lg">{title}</h3>
        {icon}
      </div>
    </div>
    <div className="p-4">
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className={`text-sm ${change >= 0 ? "text-green-500" : "text-red-500"} flex items-center mt-1`}>
        {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%<span className="text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  </div>
)

const ChartCard = ({ title, children, icon }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center">
        {icon}
        <h3 className="font-semibold text-lg text-gray-800 ml-2">{title}</h3>
      </div>
    </div>
    <div className="p-4">{children}</div>
  </div>
)

const OverviewCard = ({ title, icon, items }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center">
        {icon}
        <h3 className="font-semibold text-lg text-gray-800 ml-2">{title}</h3>
      </div>
    </div>
    <div className="p-4">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600">{item.label}</span>
            <span className={`font-semibold text-${item.color}-600`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default Dashboard