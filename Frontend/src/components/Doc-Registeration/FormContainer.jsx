import React from "react";

const FormContainer = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto p-6 md:p-8 shadow-lg rounded-2xl bg-white space-y-6">
        {title && <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default FormContainer;