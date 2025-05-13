import React from 'react';
import { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';

const Reports: React.FC = () => {
  const { invoices } = useInvoices();

  const filteredInvoices = invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const isAfterStart = start ? invoiceDate >= start : true;
    const isBeforeEnd = end ? invoiceDate <= end : true;

    return isAfterStart && isBeforeEnd;
  });

  const invoiceCounts = filteredInvoices.reduce((counts, invoice) => {
    counts[invoice.status] = (counts[invoice.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="container-page">
      <h1>Reports Page</h1>

      <div className="mt-6 bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="form-label">Start Date:</label>
            <input
              type="date"
              id="startDate"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="form-label">End Date:</label>
            <input
              type="date"
              id="endDate"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Status Summary</h2>
        <div className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="text-gray-700">Paid Invoices: <span className="font-medium">{invoiceCounts.paid || 0}</span></p>
          <p className="text-gray-700">Pending Invoices: <span className="font-medium">{invoiceCounts.pending || 0}</span></p>
          <p className="text-gray-700">Overdue Invoices: <span className="font-medium">{invoiceCounts.overdue || 0}</span></p>
          <p className="text-gray-700">Draft Invoices: <span className="font-medium">{invoiceCounts.draft || 0}</span></p>
          <p className="text-gray-700">Half Payment Invoices: <span className="font-medium">{invoiceCounts['half-payment'] || 0}</span></p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue (Placeholder)</h3>
          <p className="text-gray-700">
            This card will show the total revenue generated from paid and half-payment invoices.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Aging Summary (Placeholder)</h3>
          <p className="text-gray-700">
            This card will provide a summary of outstanding invoices categorized by how long they are overdue.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vendor Performance (Placeholder)</h3>
          <p className="text-gray-700">
            This card will display metrics related to vendor performance, such as total spending per vendor.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Reports;