"use client"
import React from "react"

function InvoiceList({ invoices, onEdit, onDelete }) {
  const formatCurrency = (amount) => {
    return "$" + (Number(amount) || 0).toFixed(2)
  }

  // Check if invoices is undefined or null
  if (!invoices) {
    return <div>Loading invoices...</div>
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={tableHeaderStyle}>Invoice ID</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Customer</th>
            <th style={tableHeaderStyle}>Payable Amount</th>
            <th style={tableHeaderStyle}>Paid Amount</th>
            <th style={tableHeaderStyle}>Due</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                No invoices found
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={tableCellStyle}>
                  <span style={{ color: "#2563eb", fontWeight: "500" }}>{invoice.id}</span>
                </td>
                <td style={tableCellStyle}>{invoice.date}</td>
                <td style={tableCellStyle}>{invoice.customer}</td>
                <td style={tableCellStyle}>{formatCurrency(invoice.payable)}</td>
                <td style={tableCellStyle}>{formatCurrency(invoice.paid)}</td>
                <td style={tableCellStyle}>{formatCurrency(invoice.due)}</td>
                <td style={tableCellStyle}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => onEdit(invoice)} style={editButtonStyle}>
                      Edit
                    </button>
                    <button onClick={() => onDelete(invoice.id)} style={deleteButtonStyle}>
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
  )
}

const tableHeaderStyle = {
  textAlign: "left",
  padding: "12px 16px",
  fontWeight: "500",
  borderBottom: "1px solid #e5e7eb",
}

const tableCellStyle = {
  padding: "12px 16px",
}

const editButtonStyle = {
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "4px 8px",
  cursor: "pointer",
}

const deleteButtonStyle = {
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "4px 8px",
  cursor: "pointer",
}

export default InvoiceList

