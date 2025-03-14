"use client";
import React from "react";
import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import SearchBar from "./components/SearchBar";
import AddButton from "./components/AddButton";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTable from "./components/InvoiceTable";
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  isValidDateFormat,
  getCurrentDate,
} from "./service/invoiceService";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function InvoiceApp() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    payable: 0,
    paid: 0,
  });

  const queryClient = useQueryClient();

  // Fetch invoices
  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  // Create invoice mutation
  const createMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      resetForm();
    },
  });

  // Update invoice mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      resetForm();
    },
  });

  // Delete invoice mutation
  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  // Filter invoices based on search
  const filteredInvoices = invoices
    ? invoices.filter(
        (invoice) =>
          invoice.id.toLowerCase().includes(search.toLowerCase()) ||
          invoice.customer.toLowerCase().includes(search.toLowerCase()) ||
          invoice.date.includes(search)
      )
    : [];

  // Handle form input changes
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "payable" || name === "paid" ? Number(value) : value,
    });
  }

  // Add new invoice
  function handleAddInvoice(e) {
    e.preventDefault();

    if (!isValidDateFormat(formData.date)) {
      alert("Date must be in DD/MM/YYYY format");
      return;
    }

    createMutation.mutate({
      date: formData.date || getCurrentDate(),
      customer: formData.customer,
      payable: formData.payable,
      paid: formData.paid,
    });
  }

  // Update existing invoice
  function handleUpdateInvoice(e) {
    e.preventDefault();

    if (!isValidDateFormat(formData.date)) {
      alert("Date must be in DD/MM/YYYY format");
      return;
    }

    updateMutation.mutate({
      id: editingInvoice.id,
      data: {
        date: formData.date,
        customer: formData.customer,
        payable: formData.payable,
        paid: formData.paid,
      },
    });
  }

  // Delete invoice
  function handleDeleteInvoice(id) {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteMutation.mutate(id);
    }
  }

  // Start editing an invoice
  function handleEditInvoice(id) {
    const invoice = invoices.find((inv) => inv.id === id);
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        date: invoice.date,
        customer: invoice.customer,
        payable: invoice.payable,
        paid: invoice.paid,
      });
      setShowForm(true);
    }
  }

  // Reset form and editing state
  function resetForm() {
    setFormData({
      date: "",
      customer: "",
      payable: 0,
      paid: 0,
    });
    setEditingInvoice(null);
    setShowForm(false);
  }

  return (
    <div className="max-w-6xl mx-auto p-5 mt-[60px]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <SearchBar
          search={search}
          handleSearch={(e) => setSearch(e.target.value)}
        />
        <AddButton
          showForm={showForm}
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        />
      </div>

      {showForm ? (
        <InvoiceForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={editingInvoice ? handleUpdateInvoice : handleAddInvoice}
          isEditing={!!editingInvoice}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      ) : (
        <>
          {isLoading && <p className="text-center py-4">Loading data...</p>}
          {error && (
            <p className="text-center py-4 text-red-500">
              Error: {error.message}
            </p>
          )}
          {!isLoading && !error && (
            <InvoiceTable
              invoices={filteredInvoices}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              isDeleting={deleteMutation.isPending}
            />
          )}
        </>
      )}
    </div>
  );
}

// Wrap the app with QueryClientProvider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InvoiceApp />
    </QueryClientProvider>
  );
}

export default App;
