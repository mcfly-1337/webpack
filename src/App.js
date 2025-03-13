"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import AddButton from "./components/AddButton";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTable from "./components/InvoiceTable";
import { getUsers, createUser, updateUser, deleteUser } from "../js/api";

function App() {
  const [invoices, setInvoices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [formData, setFormData] = useState({
    date: "",
    customer: "",
    payable: 0,
    paid: 0,
  });

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);

        const userData = await getUsers();

        if (!userData || !Array.isArray(userData)) {
          throw new Error(
            "Ma'lumotlar noto'g'ri formatda: " + JSON.stringify(userData)
          );
        }

        const transformedData = userData.map((user) => ({
          id: user.id.toString(),
          date: user.date || getCurrentDate(),
          customer: user.customer || "Noma'lum",
          payable: user.payableAmount || 0,
          paid: user.paidAmount || 0,
          due: user.dueAmount || 0,
        }));

        setInvoices(transformedData);
        setError(null);
      } catch (err) {
        setError(`Ma'lumotlarni olishda xatolik: ${err.message}`);
        console.error("Ma'lumotlarni olishda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  const filteredInvoices = invoices
    ? invoices.filter((invoice) => {
        return (
          invoice.id.toLowerCase().includes(search.toLowerCase()) ||
          invoice.customer.toLowerCase().includes(search.toLowerCase()) ||
          invoice.date.includes(search)
        );
      })
    : null;

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "payable" || name === "paid" ? Number(value) : value,
    });
  }

  async function addInvoice(e) {
    e.preventDefault();

    // Sana formatini tekshirish
    if (!isValidDateFormat(formData.date)) {
      alert("Sana DD/MM/YYYY formatida bo'lishi kerak (masalan: 23/09/2024)");
      return;
    }

    const newUserData = {
      date: formData.date || getCurrentDate(),
      customer: formData.customer,
      payable: formData.payable,
      paid: formData.paid,
    };

    try {
      await createUser(newUserData);

      refreshInvoices();

      resetForm();
    } catch (err) {
      console.error("Hisob-faktura qo'shishda xatolik:", err);
      alert(
        "Hisob-faktura qo'shib bo'lmadi. Iltimos, qaytadan urinib ko'ring."
      );
    }
  }

  async function updateInvoice(e) {
    e.preventDefault();

    // Sana formatini tekshirish
    if (!isValidDateFormat(formData.date)) {
      alert("Sana DD/MM/YYYY formatida bo'lishi kerak (masalan: 23/09/2024)");
      return;
    }

    if (editIndex === -1 || !invoices || !invoices[editIndex]) {
      console.error(
        "Tahrirlash indeksi noto'g'ri yoki ma'lumotlar yuklanmagan"
      );
      return;
    }

    const invoiceId = invoices[editIndex].id;

    try {
      const updatedUserData = {
        date: formData.date,
        customer: formData.customer,
        payable: formData.payable,
        paid: formData.paid,
      };

      await updateUser(invoiceId, updatedUserData);

      refreshInvoices();

      resetForm();
    } catch (err) {
      console.error("Hisob-fakturani yangilashda xatolik:", err);
      alert(`Hisob-fakturani yangilab bo'lmadi: ${err.message}`);
    }
  }

  async function deleteInvoice(id) {
    if (window.confirm("Haqiqatan ham bu hisob-fakturani o'chirmoqchimisiz?")) {
      try {
        await deleteUser(id);

        refreshInvoices();
      } catch (err) {
        console.error("Hisob-fakturani o'chirishda xatolik:", err);
        alert(
          "Hisob-fakturani o'chirib bo'lmadi. Iltimos, qaytadan urinib ko'ring."
        );
      }
    }
  }

  function startEdit(id) {
    const invoiceToEdit = invoices.find((invoice) => invoice.id === id);

    if (invoiceToEdit) {
      setFormData({
        date: invoiceToEdit.date,
        customer: invoiceToEdit.customer,
        payable: invoiceToEdit.payable,
        paid: invoiceToEdit.paid,
      });

      setEditIndex(invoices.findIndex((invoice) => invoice.id === id));

      setShowForm(true);
    }
  }

  function resetForm() {
    setFormData({
      date: "",
      customer: "",
      payable: 0,
      paid: 0,
    });
    setEditIndex(-1);
    setShowForm(false);
  }

  // Sana formatini tekshirish
  function isValidDateFormat(dateString) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;

    const [day, month, year] = dateString.split("/").map(Number);

    // Oy va kun qiymatlarini tekshirish
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // Fevral oyi uchun maxsus tekshirish
    if (month === 2) {
      const isLeapYear =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      if (day > (isLeapYear ? 29 : 28)) return false;
    }

    // 30 kunlik oylar uchun tekshirish
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;

    return true;
  }

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async function refreshInvoices() {
    try {
      setLoading(true);
      const userData = await getUsers();

      if (!userData || !Array.isArray(userData)) {
        throw new Error(
          "Ma'lumotlar noto'g'ri formatda: " + JSON.stringify(userData)
        );
      }

      const transformedData = userData.map((user) => ({
        id: user.id.toString(),
        date: user.date || getCurrentDate(),
        customer: user.customer || "Noma'lum",
        payable: user.payableAmount || 0,
        paid: user.paidAmount || 0,
        due: user.dueAmount || 0,
      }));

      setInvoices(transformedData);
      setError(null);
    } catch (err) {
      setError(`Ma'lumotlarni olishda xatolik: ${err.message}`);
      console.error("Ma'lumotlarni olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-5 mt-[60px]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <SearchBar search={search} handleSearch={handleSearch} />

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
          handleSubmit={editIndex === -1 ? addInvoice : updateInvoice}
          isEditing={editIndex !== -1}
        />
      ) : (
        <>
          {loading && (
            <p className="text-center py-4">Ma'lumotlar yuklanmoqda...</p>
          )}
          {error && <p className="text-center py-4 text-red-500">{error}</p>}
          {!loading && !error && (
            <InvoiceTable
              invoices={filteredInvoices}
              onEdit={startEdit}
              onDelete={deleteInvoice}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
