"use client"
import React from "react"
function AddButton({ showForm, onClick }) {
  return (
    <button
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
      onClick={onClick}
    >
      {showForm ? "Cancel" : "Add Invoice"}
    </button>
  )
}

export default AddButton

