import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "./invoiceService";

// Custom hook for fetching invoices
export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
};

// Custom hook for creating an invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Custom hook for updating an invoice
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Custom hook for deleting an invoice
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Custom hook for filtering invoices
export const useFilteredInvoices = (invoices, search) => {
  if (!invoices) return [];

  return invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(search.toLowerCase()) ||
      invoice.date.includes(search)
  );
};
