import React, { useState } from 'react';
import API from '../../api'; // <-- Import your axios instance

export default function ExcelUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);
    // formData.append('client_name', client_name); // add if needed

    try {
      const res = await API.post('/api/orderitem/upload-excel/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(res.data.message || 'Upload successful');
      onUploadSuccess();
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          cursor-pointer"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Upload Excel
      </button>
    </form>
  );
}
