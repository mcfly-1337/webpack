"use client";
import React from "react";
function InvoiceTable({ invoices, onEdit, onDelete }) {
  console.log("InvoiceTable ga kelgan ma'lumotlar:", invoices);

  const safeInvoices = invoices || [];

  const formatCurrency = (amount) => {
    return typeof amount === "number" ? amount.toFixed(2) : "0.00";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white">
        <thead className="bg-gray-100 rounded">
          <tr>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Invoice ID
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Date
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Customer
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Payable Amount
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-700">
              Paid Amount
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
          {safeInvoices.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                Hisob-fakturalar topilmadi
              </td>
            </tr>
          ) : (
            safeInvoices.map((invoice) => (
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition duration-150 ease-in-out"
                      onClick={() => onEdit(invoice.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition duration-150 ease-in-out"
                      onClick={() => onDelete(invoice.id)}
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
