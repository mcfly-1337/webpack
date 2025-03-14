"use client";
import React from "react";
function InvoiceForm({
  formData,
  handleInputChange,
  handleSubmit,
  isEditing,
  isSubmitting,
}) {
  // Format date input with slashes
  const formatDateInput = (e) => {
    const input = e.target.value;

    // Only allow digits and slashes
    if (!/^[\d/]*$/.test(input)) return;

    let formatted = input;

    // Add slashes automatically
    if (input.length === 2 && !input.includes("/")) {
      formatted = input + "/";
    } else if (
      input.length === 5 &&
      input.charAt(2) === "/" &&
      !input.includes("/", 3)
    ) {
      formatted = input + "/";
    }

    if (formatted.length <= 10) {
      handleInputChange({
        target: { name: "date", value: formatted },
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {isEditing ? "Edit Invoice" : "Add New Invoice"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date:
          </label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={formatDateInput}
            placeholder="DD/MM/YYYY"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer:
          </label>
          <input
            type="text"
            name="customer"
            value={formData.customer}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payable Amount:
          </label>
          <input
            type="number"
            name="payable"
            value={formData.payable}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paid Amount:
          </label>
          <input
            type="number"
            name="paid"
            value={formData.paid}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due:
          </label>
          <input
            type="number"
            value={formData.payable - formData.paid}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            readOnly
            disabled
          />
        </div>

        <button
          type="submit"
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out mt-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : isEditing ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
}

export default InvoiceForm;
