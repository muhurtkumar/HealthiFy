import React from "react";

const FileUpload = ({ label, onChange, id, accept, required = false }) => {
  return (
    <div className="md:col-span-2">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        id={id}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        required={required}
      />
    </div>
  );
};

export default FileUpload;