"use client";
import React from "react";
function InvoiceTable({ invoices, onEdit, onDelete, isDeleting }) {
  // Format currency to show 2 decimal places
  const formatCurrency = (amount) => {
    return typeof amount === "number" ? amount.toFixed(2) : "0.00";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white">
        <thead className="bg-gray-100 rounded">
          <tr>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              ID
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Date
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Customer
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Payable
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Paid
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Due
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                No invoices found
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-blue-600 font-medium">
                  {invoice.id}
                </td>
                <td className="py-3 px-4">{invoice.date}</td>
                <td className="py-3 px-4">{invoice.customer}</td>
                <td className="py-3 px-4">
                  ${formatCurrency(invoice.payable)}
                </td>
                <td className="py-3 px-4">${formatCurrency(invoice.paid)}</td>
                <td className="py-3 px-4">${formatCurrency(invoice.due)}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                      onClick={() => onEdit(invoice.id)}
                      disabled={isDeleting}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                      onClick={() => onDelete(invoice.id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;
