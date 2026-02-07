


// import React from 'react';

// const OrderDetailsModal = ({ isOpen, onClose, order }) => {
//   if (!isOpen || !order) return null;

//   const buyer = order.buyer;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="space-y-6">
//           {/* Buyer Details */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Buyer Details</h3>
//             <div className="mt-4 space-y-2">
//               <p><strong>Name:</strong> {buyer?.name}</p>
//               <p><strong>Email:</strong> {buyer?.email}</p>
//               <p><strong>Phone:</strong> {buyer?.phone}</p>
//               <p><strong>Is Paid:</strong> {order?.isPaid ? 'Yes' : 'No'}</p>
//               {order.isPaid && (
//                 <>
//                   <p><strong>Payment ID:</strong> {order?.PaymentID || 'N/A'}</p>
//                   <p><strong>Payment Date:</strong> {order?.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}</p>
//                 </>
//               )}
//                <p><strong>Addresss:</strong> {order?.shippingAddress}</p>
//             </div>
//           </div>

//           {/* Product Details */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Product Details</h3>
//             {order.products.map((product, index) => (
//               <div key={product._id} className="mt-4 border-t pt-4">
//                 <h4 className="text-md font-medium text-gray-700">Product {index + 1}</h4>
//                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <img
//                       src={product?.product?.images?.[0]}
//                       alt={product?.productName}
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <p><strong>Product ID:</strong> {product?.product?._id}</p>
//                     <p><strong>Name:</strong> {product?.productName}</p>
//                     <p><strong>Category:</strong> {product?.product?.category?.parentCategory} - {product?.product?.category?.subCategoryName}</p>
//                     <p><strong>Condition:</strong> {product?.product?.condition?.conditionName}</p>
//                     <p><strong>Product Type:</strong> {product?.product?.productType}</p>
//                     <p><strong>Size:</strong> {product?.size}</p>
//                     <p><strong>Quantity:</strong> {product?.quantity}</p>
//                     <p><strong>Price:</strong> ₹{product?.price}</p>
                    
//                     {/* Rental Information */}
//                     {product?.isRental && (
//                       <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                         <p className="font-medium text-blue-800 mb-2">📅 Rental Information</p>
//                         <p className="text-sm"><strong>Rental Duration:</strong> {product?.rentalDurationHours} hours</p>
//                         <p className="text-sm"><strong>Base Price:</strong> ₹{product?.rentalBasePrice}</p>
                        
//                         {/* Show rental dates from product.rent array */}
//                         {product?.product?.rent && product.product.rent.length > 0 && (
//                           <div className="mt-2">
//                             {product.product.rent.map((rental, rentIndex) => (
//                               <div key={rental._id} className="text-sm">
//                                 <p><strong>Start Date:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
//                                 <p><strong>End Date:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
//                                 {/* <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${rental.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{rental.status}</span></p> */}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Seller Details for this Product */}
//                 <div className="mt-6">
//                   <h4 className="text-md font-medium text-gray-700">Seller Details</h4>
//                   <div className="mt-4 space-y-2">
//                     <p><strong>Name:</strong> {product?.product?.seller?.name}</p>
//                     <p><strong>Contact Number:</strong> {product?.product?.seller?.phone}</p>
//                     <p><strong>Email:</strong> {product?.product?.seller?.email}</p>
//                     <p><strong>Address:</strong> {product?.product?.pickupAddress?.length > 0 ? product?.product?.pickupAddress?.join(', ') : 'N/A'}</p>
                 
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
//             <div className="space-y-2">
//               <p><strong>Total Amount:</strong> ₹{order?.totalAmount}</p>
//               {order?.depositAmount && (
//                 <p><strong>Deposit Amount:</strong> ₹{order?.depositAmount}</p>
//               )}
//               <p><strong>Final Amount:</strong> ₹{order?.finalAmount}</p>
//               <p><strong>Payment Method:</strong> {order?.paymentMethod}</p>
//               <p><strong>Order Status:</strong> <span className={`px-2 py-1 rounded text-xs ${order?.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{order?.orderStatus}</span></p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsModal;










// import React from 'react';

// const OrderDetailsModal = ({ isOpen, onClose, order }) => {
//   if (!isOpen || !order) return null;

//   const buyer = order.buyer;
//   const shippingAddress = order.shippingAddress;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="space-y-6">
//           {/* Buyer Details */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Buyer Details</h3>
//             <div className="mt-4 space-y-2">
//               <p><strong>Name:</strong> {buyer?.name}</p>
//               <p><strong>Email:</strong> {buyer?.email}</p>
//               <p><strong>Phone:</strong> {buyer?.phone}</p>
//               <p><strong>Shipping Address:</strong> {shippingAddress ? `${shippingAddress.house_no}, ${shippingAddress.building_name}, ${shippingAddress.area}, ${shippingAddress.city}, ${shippingAddress.country}` : 'N/A'}</p>
//               <p><strong>Is Paid:</strong> {order?.isPaid ? 'Yes' : 'No'}</p>
//               {order.isPaid && (
//                 <>
//                   <p><strong>Payment ID:</strong> {order?.PaymentID || 'N/A'}</p>
//                   <p><strong>Payment Date:</strong> {order?.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}</p>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Product Details */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800">Product Details</h3>
//             {order.products.map((product, index) => (
//               <div key={product._id} className="mt-4 border-t pt-4">
//                 <h4 className="text-md font-medium text-gray-700">Product {index + 1}</h4>
//                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <img
//                       src={product?.product?.images?.[0]}
//                       alt={product?.productName}
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <p><strong>Product ID:</strong> {product?.product?._id}</p>
//                     <p><strong>Name:</strong> {product?.productName}</p>
//                     <p><strong>Category:</strong> {product?.product?.category?.parentCategory} - {product?.product?.category?.subCategoryName}</p>
//                     <p><strong>Condition:</strong> {product?.product?.condition?.conditionName}</p>
//                     <p><strong>Product Type:</strong> {product?.product?.productType}</p>
//                     <p><strong>Size:</strong> {product?.size}</p>
//                     <p><strong>Quantity:</strong> {product?.quantity}</p>
//                     <p><strong>Price:</strong> ₹{product?.price}</p>
                    
//                     {/* Rental Information */}
//                     {product?.isRental && (
//                       <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                         <p className="font-medium text-blue-800 mb-2">📅 Rental Information</p>
//                         <p className="text-sm"><strong>Rental Duration:</strong> {product?.rentalDurationHours} hours</p>
//                         <p className="text-sm"><strong>Base Price:</strong> ₹{product?.rentalBasePrice}</p>
                        
//                         {/* Show rental dates from product.rent array */}
//                         {product?.product?.rent && product.product.rent.length > 0 && (
//                           <div className="mt-2">
//                             {product.product.rent.map((rental, rentIndex) => (
//                               <div key={rental._id} className="text-sm">
//                                 <p><strong>Start Date:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
//                                 <p><strong>End Date:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Seller Details for this Product */}
//                 <div className="mt-6">
//                   <h4 className="text-md font-medium text-gray-700">Seller Details</h4>
//                   <div className="mt-4 space-y-2">
//                     <p><strong>Name:</strong> {product?.product?.seller?.name}</p>
//                     <p><strong>Contact Number:</strong> {product?.product?.seller?.phone}</p>
//                     <p><strong>Email:</strong> {product?.product?.seller?.email}</p>
//                     <p><strong>Pickup Address:</strong> {product?.product?.pickupAddress ? `${product.product.pickupAddress.house_no}, ${product.product.pickupAddress.building_name}, ${product.product.pickupAddress.area}, ${product.product.pickupAddress.city}, ${product.product.pickupAddress.country}` : 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
//             <div className="space-y-2">
//               <p><strong>Total Amount:</strong> ₹{order?.totalAmount}</p>
//               {order?.depositAmount && (
//                 <p><strong>Deposit Amount:</strong> ₹{order?.depositAmount}</p>
//               )}
//               <p><strong>Final Amount:</strong> ₹{order?.finalAmount}</p>
//               <p><strong>Payment Method:</strong> {order?.paymentMethod}</p>
//               <p><strong>Order Status:</strong> <span className={`px-2 py-1 rounded text-xs ${order?.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{order?.orderStatus}</span></p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsModal;







import React from 'react';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const buyer = order.buyer;
  const shippingAddress = order.shippingAddress;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">

          {/* Buyer Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Buyer Details</h3>
            <div className="mt-4 space-y-2">
              <p><strong>Name:</strong> {buyer?.name}</p>
              <p><strong>Email:</strong> {buyer?.email}</p>
              <p><strong>Phone:</strong> {buyer?.phone}</p>
              <p><strong>Shipping Address:</strong> {shippingAddress ? `${shippingAddress.house_no}, ${shippingAddress.building_name}, ${shippingAddress.area}, ${shippingAddress.city}, ${shippingAddress.country}` : 'N/A'}</p>
              <p><strong>Is Paid:</strong> {order?.isPaid ? 'Yes' : 'No'}</p>
              {order.isPaid && (
                <>
                  <p><strong>Payment ID:</strong> {order?.PaymentID || 'N/A'}</p>
                  <p><strong>Payment Date:</strong> {order?.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}</p>
                </>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Product Details</h3>
            {order.products.map((product, index) => (
              <div key={product._id} className="mt-4 border-t pt-4">
                <h4 className="text-md font-medium text-gray-700">Product {index + 1}</h4>

                {/* Product Type Badge */}
                <div className="mt-2 mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    product?.product?.productType === "Kukit Purchase"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}>
                    {product?.product?.productType || "Unknown Type"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <img
                      src={product?.product?.images?.[0] || "/placeholder.jpg"}
                      alt={product?.productName}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <p><strong>Product ID:</strong> {product?.product?._id}</p>
                    <p><strong>Name:</strong> {product?.productName}</p>
                    <p><strong>Category:</strong> {product?.product?.category?.parentCategory} - {product?.product?.category?.subCategoryName}</p>
                    <p><strong>Condition:</strong> {product?.product?.condition?.conditionName}</p>
                    <p><strong>Size:</strong> {product?.size}</p>
                    <p><strong>Quantity:</strong> {product?.quantity}</p>
                    <p><strong>Price:</strong> ₹{product?.price}</p>

                    {/* Rental Information */}
                    {product?.isRental && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="font-medium text-blue-800 mb-2">Rental Information</p>
                        <p className="text-sm"><strong>Rental Duration:</strong> {product?.rentalDurationHours} hours</p>
                        <p className="text-sm"><strong>Base Price:</strong> ₹{product?.rentalBasePrice}</p>
                        {product?.product?.rent && product.product.rent.length > 0 && (
                          <div className="mt-2">
                            {product.product.rent.map((rental, rentIndex) => (
                              <div key={rental._id} className="text-sm">
                                <p><strong>Start Date:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
                                <p><strong>End Date:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Seller / Warehouse Details */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-700">
                    {product?.product?.productType === "Kukit Purchase" ? "Warehouse Details" : "Seller Details"}
                  </h4>
                  <div className="mt-4 space-y-2">
                    {product?.product?.productType === "Kukit Purchase" ? (
                      <>
                        <p><strong>Warehouse Name:</strong> {product?.product?.warehouse?.name || "Kuku Main Warehouse"}</p>
                        <p><strong>Contact:</strong> {product?.product?.warehouse?.mobile_number ? `+${product?.product?.warehouse?.mob_no_country_code} ${product?.product?.warehouse?.mobile_number}` : "N/A"}</p>
                        <p><strong>Email:</strong> {product?.product?.warehouse?.email || "warehouse@kuku.com"}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Name:</strong> {product?.product?.seller?.name}</p>
                        <p><strong>Contact Number:</strong> {product?.product?.seller?.phone}</p>
                        <p><strong>Email:</strong> {product?.product?.seller?.email}</p>
                      </>
                    )}

                    {/* Conditional Address */}
                    <p>
                      <strong>
                        {product?.product?.productType === "Kukit Purchase" ? "Warehouse Address:" : "Pickup Address:"}
                      </strong>{" "}
                      {product?.product?.productType === "Kukit Purchase" ? (
                        product?.product?.warehouse ? (
                          `${product.product.warehouse.house_no}, ${product.product.warehouse.building_name}, ${product.product.warehouse.area}, ${product.product.warehouse.city}, ${product.product.warehouse.country}`
                        ) : (
                          "Warehouse address not available"
                        )
                      ) : (
                        product?.product?.pickupAddress ? (
                          `${product.product.pickupAddress.house_no}, ${product.product.pickupAddress.building_name}, ${product.product.pickupAddress.area}, ${product.product.pickupAddress.city}, ${product.product.pickupAddress.country}`
                        ) : (
                          "Pickup address not available"
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <p><strong>Total Amount:</strong> ₹{order?.totalAmount}</p>
              {order?.depositAmount > 0 && (
                <p><strong>Deposit Amount:</strong> ₹{order?.depositAmount}</p>
              )}
              <p><strong>Final Amount:</strong> ₹{order?.finalAmount}</p>
              <p><strong>Payment Method:</strong> {order?.paymentMethod}</p>
              <p><strong>Order Status:</strong>{" "}
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  order?.orderStatus === 'Delivered' 
                    ? 'bg-green-100 text-green-800' 
                    : order?.orderStatus === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {order?.orderStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;