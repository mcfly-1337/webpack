const invoices = []

const addInvoice = (id, date, customer, payableAmount, paidAmount) => {
  invoices.push({
    id,
    date,
    customer,
    payableAmount,
    paidAmount,
    due: payableAmount - paidAmount,
  })
}

const searchInvoice = (query) => invoices.filter((i) => i.customer.includes(query))

console.log(invoices)

