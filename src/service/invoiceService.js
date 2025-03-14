import api from "./api";

// Get all invoices
export const getInvoices = async () => {
  const response = await api.get("");
  return response.data.map((item) => ({
    id: item.id.toString(),
    date: item.date || getCurrentDate(),
    customer: item.customer || "Noma'lum",
    payable: item.payableAmount || 0,
    paid: item.paidAmount || 0,
    due: item.dueAmount || 0,
  }));
};

// Create new invoice
export const createInvoice = async (data) => {
  const response = await api.post("", {
    date: data.date,
    customer: data.customer,
    payableAmount: data.payable,
    paidAmount: data.paid,
    dueAmount: data.payable - data.paid,
  });
  return response.data;
};

// Update invoice
export const updateInvoice = async (id, data) => {
  try {
    const response = await api.patch(`/${id}`, {
      date: data.date,
      customer: data.customer,
      payableAmount: data.payable,
      paidAmount: data.paid,
      dueAmount: data.payable - data.paid,
    });
    return response.data;
  } catch (error) {
    // Fallback if PATCH fails
    await api.delete(`/${id}`);
    const createResponse = await api.post("", {
      id: id,
      date: data.date,
      customer: data.customer,
      payableAmount: data.payable,
      paidAmount: data.paid,
      dueAmount: data.payable - data.paid,
    });
    return createResponse.data;
  }
};

// Delete invoice
export const deleteInvoice = async (id) => {
  await api.delete(`/${id}`);
  return true;
};

// Get current date in DD/MM/YYYY format
export const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

// Validate date format
export const isValidDateFormat = (dateString) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateString);
};
