import React, { useState, useRef } from 'react';

export const AutomatedNotification = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle drag-over event to prevent default behavior
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop event to accept files
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  // Handle file upload click to open file dialog
  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 z-50 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-1">Add automated notifications</h1>
      <p className="text-gray-500 mb-6">
        Add automated notifications to avail offers and status of orders
      </p>

      <form>
        <div className="mb-4">
          <label
            htmlFor="notificationTitle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notification Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="notificationTitle"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter notification title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry time
          </label>
          <div className="flex space-x-4">
            <input
              type="date"
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="date"
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="notificationBody"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notification Body <span className="text-red-500">*</span>
          </label>
          <textarea
            id="notificationBody"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Write description"
          />
        </div>

        {/* File Drop Area */}
        <div
          className="mb-6 border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <svg
            className="mx-auto h-12 w-12 text-pink-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-pink-500">
            {file ? `Uploaded: ${file.name}` : 'Drop files here or click to upload'}
          </p>
        </div>

        <div className="flex justify-end items-center">
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition duration-300"
          >
            Create notifications
          </button>
          <button type="button" className="ml-4 text-pink-600 hover:underline">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};
