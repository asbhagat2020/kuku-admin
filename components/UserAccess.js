import React, { useState } from 'react';

const UserAccess = () => {
  const [admins, setAdmins] = useState([
    { email: 'example@mail.com', photo: '[PHOTO]', name: 'John Doe', phone: '+123456789', status: 'Active' },
    { email: 'admin@mail.com', photo: '[PHOTO]', name: 'Jane Smith', phone: '+987654321', status: 'Inactive' },
    // Add more admins here
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(5); // Customize how many admins per page
  const [newAdmin, setNewAdmin] = useState({ email: '', name: '', phone: '', status: 'Active' });
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);

  // Add Admin handler
  const handleAddAdmin = () => {
    if (newAdmin.email && newAdmin.name && newAdmin.phone) {
      setAdmins([...admins, { ...newAdmin, photo: '[PHOTO]' }]);
      setNewAdmin({ email: '', name: '', phone: '', status: 'Active' }); // Clear form after adding
      setShowAddAdminForm(false); // Close form after adding
    }
  };

  // Remove Admin handler
  const handleRemoveAdmin = (email) => {
    setAdmins(admins.filter(admin => admin.email !== email));
  };

  // Change Status handler
  const handleChangeStatus = (email, status) => {
    setAdmins(admins.map(admin => 
      admin.email === email ? { ...admin, status } : admin
    ));
  };

  // Search functionality
  const filteredAdmins = admins.filter(
    admin =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination functionality
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  return (
    <div className="p-8 bg-gray-50 h-full">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      <p className="text-sm text-gray-500 mb-6">Admin List</p>

      {/* Search and Add Admin section */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for admin"
            className="border p-2 w-96 rounded-md" // Increased width to 96
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Add Admin Button */}
        <button
          className="bg-pink-600 text-white p-2 rounded-md flex items-center" // Changed to rounded-md
          onClick={() => setShowAddAdminForm(!showAddAdminForm)} // Toggle form visibility
        >
          <span className="mr-2">+</span> Add Admin
        </button>
      </div>

      {/* Add Admin Form */}
      {showAddAdminForm && (
        <div className="bg-white p-4 rounded-md shadow mb-4"> {/* Changed to rounded-md */}
          <h2 className="text-lg font-semibold mb-2">Add New Admin</h2>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-2 rounded-md" // Changed to rounded-md
            value={newAdmin.email}
            onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 w-full mb-2 rounded-md" // Changed to rounded-md
            value={newAdmin.name}
            onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="border p-2 w-full mb-2 rounded-md" // Changed to rounded-md
            value={newAdmin.phone}
            onChange={e => setNewAdmin({ ...newAdmin, phone: e.target.value })}
          />
          <select
            className="border p-2 rounded-md w-full mb-2 focus:outline-none" // Changed to rounded-md
            value={newAdmin.status}
            onChange={e => setNewAdmin({ ...newAdmin, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            className="bg-green-500 text-white p-2 rounded-md" // Changed to rounded-md
            onClick={handleAddAdmin}
          >
            Add Admin
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-md shadow"> {/* Changed to rounded-md */}
        <table className="min-w-full">
          <thead className="bg-pink-50">
            <tr>
              <th className="p-4 text-left">EMAIL ID</th>
              <th className="p-4 text-left">PHOTO</th>
              <th className="p-4 text-left">FULL NAME</th>
              <th className="p-4 text-left">PHONE NUMBER</th>
              <th className="p-4 text-left">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {currentAdmins.length > 0 ? (
              currentAdmins.map((admin, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">{admin.email}</td>
                  <td className="p-4">{admin.photo}</td>
                  <td className="p-4">{admin.name}</td>
                  <td className="p-4">{admin.phone}</td>
                  <td className={`p-4`}>
                    <select
                      value={admin.status}
                      onChange={(e) => handleChangeStatus(admin.email, e.target.value)} // Change status on selection
                      className={`border p-1 rounded-md ${admin.status === 'Remove' ? 'text-red-500' : ''}`} // Changed to rounded-md
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Remove">Remove</option>
                    </select>
                    {/* Remove admin if status is 'Remove' */}
                    {admin.status === 'Remove' && (
                      <span className="text-red-500 ml-2 cursor-pointer" onClick={() => handleRemoveAdmin(admin.email)}>
                        Confirm Removal
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-200 p-2 rounded-md" // Changed to rounded-md
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-200 p-2 rounded-md" // Changed to rounded-md
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserAccess;
