import React, { useState, useRef } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

export const CustomNotification = () => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDescription, setNotificationDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleClear = () => {
    setNotificationTitle('');
    setNotificationDescription('');
    setUploadedFiles([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      title: notificationTitle,
      description: notificationDescription,
      files: uploadedFiles,
    });
    // Add your submission logic here
  };

  const handleFileChange = (e) => {
    setUploadedFiles([...e.target.files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default behavior to allow dropping files
  };

  const handleClick = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Add custom notifications</h2>
      <p className="text-gray-500 mt-2">
        Add Custom Notifications to avail offers and status of orders
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-2 gap-6">
        {/* Notification Title */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notification Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
            placeholder="Enter notification title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            required
          />
        </div>

        {/* Notification Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notification Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={notificationDescription}
            onChange={(e) => setNotificationDescription(e.target.value)}
            placeholder="Write description"
            rows="5"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            required
          />
        </div>

        {/* File Upload */}
        <div
          className="col-span-2 sm:col-span-1 border-2 border-dashed border-pink-400 rounded-lg h-full flex flex-col items-center justify-center text-pink-500 cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <AiOutlineCloudUpload size={48} />
          <p className="mt-2">Drop files here or click to upload</p>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Display Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="col-span-2">
            <h3 className="text-lg font-medium mt-4">Uploaded Files:</h3>
            <ul className="list-disc list-inside">
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="col-span-2 flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={handleClear}
            className="text-pink-500 hover:underline"
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Create notifications
          </button>
        </div>
      </form>
    </div>
  );
};
