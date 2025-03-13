const API_URL = "https://791c32bb2902a4cd.mokky.dev/users"

export const getUsers = async () => {
  try {
    console.log("API so'rovi yuborilmoqda:", API_URL)
    const response = await fetch(API_URL)
    console.log("API javobi:", response)

    if (!response.ok) {
      throw new Error(`HTTP xatosi! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Olingan ma'lumotlar:", data)
    return data
  } catch (error) {
    console.error("Foydalanuvchilarni olishda xatolik:", error)
    throw error
  }
}

export const createUser = async (userData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: userData.date,
        customer: userData.customer,
        payableAmount: userData.payable,
        paidAmount: userData.paid,
        dueAmount: userData.payable - userData.paid,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const updateUser = async (id, userData) => {
  try {
    console.log("Attempting to update user with ID:", id)

    const getUserResponse = await fetch(`${API_URL}/${id}`)
    if (!getUserResponse.ok) {
      throw new Error(`User with ID ${id} not found. Status: ${getUserResponse.status}`)
    }

    const requestBody = {
      date: userData.date,
      customer: userData.customer,
      payableAmount: userData.payable,
      paidAmount: userData.paid,
      dueAmount: userData.payable - userData.paid,
    }

    console.log("Request body:", JSON.stringify(requestBody))

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("Update response status:", response.status)

    if (!response.ok) {
      console.log("PATCH failed, trying DELETE and POST as a workaround")

      const deleteResponse = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })

      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete user for update. Status: ${deleteResponse.status}`)
      }

      const createResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id, 
          ...requestBody,
        }),
      })

      if (!createResponse.ok) {
        throw new Error(`Failed to recreate user after delete. Status: ${createResponse.status}`)
      }

      return await createResponse.json()
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return true
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    throw error
  }
}

