import React, { useState, FormEvent, useEffect } from 'react';
import { Invoice } from '../context/InvoiceContext'; // Assuming Invoice type is here

interface InvoiceFormProps {
  initialData?: Invoice | null;
  onSave: (invoice: Partial<Invoice>) => void;
  onCancel: () => void;
}

interface FormErrors {
  clientName?: string;
  amount?: string;
  date?: string;
  status?: string;
  [key: string]: string | undefined; // Allow other potential error keys
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, onSave, onCancel }) => {
  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || '');
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [date, setDate] = useState(initialData?.date ? initialData.date.toISOString().split('T')[0] : '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [vendorId, setVendorId] = useState(initialData?.vendorId || '');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setInvoiceNumber(initialData.invoiceNumber);
      setClientName(initialData.clientName);
      setAmount(initialData.amount.toString());
      setDate(initialData.date ? initialData.date.toISOString().split('T')[0] : '');
      setStatus(initialData.status);
      setVendorId(initialData.vendorId || '');
    } else {
      // Reset form for new invoice
      setInvoiceNumber('');
      setClientName('');
      setAmount('');
      setDate('');
      setStatus('draft');
      setVendorId('');
    }
    setErrors({}); // Clear errors when initialData changes
  }, [initialData]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!clientName.trim()) {
      newErrors.clientName = 'Client Name is required.';
    }
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number.';
    }
    if (!date) {
      newErrors.date = 'Date is required.';
    }
    if (!status) {
      newErrors.status = 'Status is required.';
    }
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Form has errors, prevent save
      return;
    }

    const invoiceData: Partial<Invoice> = {
      invoiceNumber: invoiceNumber.trim(),
      clientName: clientName.trim(),
      amount: parseFloat(amount),
      date: new Date(date),
      status: status as 'draft' | 'pending' | 'paid' | 'overdue' | 'half-payment', // Type assertion assuming valid status values
      vendorId: vendorId.trim() || undefined,
    };

    if (initialData?.id) {
      invoiceData.id = initialData.id; // Include ID for editing
    }

    onSave(invoiceData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {initialData ? 'Edit Invoice' : 'Add New Invoice'}
</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            id="invoiceNumber"
            className="form-input"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            className={`form-input ${errors.clientName ? 'border-red-500' : ''}`}
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            className={`form-input ${errors.amount ? 'border-red-500' : ''}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            className={`form-input ${errors.date ? 'border-red-500' : ''}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            className={`form-select ${errors.status ? 'border-red-500' : ''}`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="half-payment">Half Payment</option>
            <option value="overdue">Overdue</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
        </div>
        <div>
          <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700 mb-1">
            Vendor (Optional)
          </label>
          <input
            type="text" // Consider a select dropdown for actual vendors
            id="vendorId"
            className="form-input"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Save Changes' : 'Add Invoice'}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;