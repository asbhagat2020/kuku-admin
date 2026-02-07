import React, { useState } from 'react';
import { FaHeadset } from 'react-icons/fa'; // Importing a new icon for the Helpdesk

// Static sample data for submitted user details
const sampleContactDetails = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', message: 'Looking for product details.' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', message: 'Interested in partnership opportunities.' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', message: 'Need help with my order.' },
];

export const Helpdesk = () => {
  const [contactDetails, setContactDetails] = useState(sampleContactDetails);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [adminReply, setAdminReply] = useState({}); // Stores the admin reply for each contact

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setContactDetails([
        ...contactDetails,
        { id: contactDetails.length + 1, ...formData },
      ]);
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleReplyChange = (id, e) => {
    setAdminReply({
      ...adminReply,
      [id]: e.target.value,
    });
  };

  const handleReplySubmit = (id) => {
    alert(`Reply to ${id} sent: ${adminReply[id]}`); // This is where the email functionality will go
    // You can later integrate actual email sending logic here.
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col items-center mb-6">
        <FaHeadset className="text-4xl text-blue-500 mb-2" /> {/* New Helpdesk icon */}
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="text-gray-600">Submit your queries or feedback below:</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Your name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Your message"
            rows="4"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-6 py-3">INDEX</th>
              <th className="px-6 py-3">NAME</th>
              <th className="px-6 py-3">EMAIL</th>
              <th className="px-6 py-3">MESSAGE</th>
              <th className="px-6 py-3">REPLY</th>
            </tr>
          </thead>
          <tbody>
            {contactDetails.length > 0 ? (
              contactDetails.map((contact, index) => (
                <tr key={contact.id} className="border-b">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{contact.name}</td>
                  <td className="px-6 py-4">{contact.email}</td>
                  <td className="px-6 py-4">{contact.message}</td>
                  <td className="px-6 py-4">
                    <textarea
                      value={adminReply[contact.id] || ''}
                      onChange={(e) => handleReplyChange(contact.id, e)}
                      placeholder="Write your reply"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => handleReplySubmit(contact.id)}
                      className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 text-center" colSpan="5">
                  No contact details available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
