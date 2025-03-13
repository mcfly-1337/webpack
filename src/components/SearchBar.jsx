"use client"
import React from "react"

function SearchBar({ search, handleSearch }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search invoices..."
        value={search}
        onChange={handleSearch}
        className="w-64 px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  )
}

export default SearchBar

