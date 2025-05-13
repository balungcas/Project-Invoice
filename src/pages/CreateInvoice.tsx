import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useInvoices, InvoiceItem, Invoice } from '../context/InvoiceContext';
import { useVendors } from '../context/VendorContext';

interface FormInvoiceItem extends Omit<InvoiceItem, 'id'> {
  id?: string;
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { id: invoiceId } = useParams<{ id: string }>(); // Get invoiceId from URL params
  const { addInvoice, getInvoice, updateInvoice } = useInvoices(); // Get getInvoice and updateInvoice
  const { vendors } = useVendors();
  
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`);
  const [vendorId, setVendorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<'pending' | 'paid' | 'overdue' | 'draft' | 'half-payment'>('draft');
  const [clientName, setClientName] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FormInvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0 }
  ]);
  
  // Calculate total amount
  const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  // Load invoice data if editing
  useEffect(() => {
    if (invoiceId) {
      const invoiceToEdit = getInvoice(invoiceId);
      if (invoiceToEdit) {
        setInvoiceNumber(invoiceToEdit.invoiceNumber || '');
        setVendorId(invoiceToEdit.vendorId || '');
        setDate(invoiceToEdit.date || '');
        setDueDate(invoiceToEdit.dueDate || '');
        setStatus(invoiceToEdit.status || 'draft');
 setClientName(invoiceToEdit.clientName || '');
        setNotes(invoiceToEdit.notes || ''); // Handle optional notes
        // Ensure items have an id for editing, use a temporary one if not present
        setItems(invoiceToEdit.items.map(item => ({ ...item, id: item.id || crypto.randomUUID() })));
      } else {
        // Handle case where invoice is not found (e.g., redirect to 404 or invoices list)
        console.error('Invoice not found for editing:', invoiceId);
      }
    }
  }, [invoiceId, getInvoice]); // Dependency on invoiceId and getInvoice
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };
  
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const updateItem = (index: number, field: keyof FormInvoiceItem, value: string | number) => {
    const updatedItems = [...items];
    let newValue: string | number = value;

    if (field === 'quantity') {
      const quantity = parseInt(value as string);
      if (isNaN(quantity) || quantity < 1) {
        newValue = 1; // Default to 1 if invalid
      } else {
        newValue = quantity;
      }
    } else if (field === 'unitPrice') {
      const unitPrice = parseFloat(value as string);
      if (isNaN(unitPrice) || unitPrice < 0) {
        newValue = 0; // Default to 0 if invalid
      } else {
        newValue = unitPrice;
      }
    }

    updatedItems[index] = { ...updatedItems[index], [field]: newValue };
    setItems(updatedItems as FormInvoiceItem[]); // Cast back to FormInvoiceItem[]
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vendor = vendors.find(v => v.id === vendorId);
    
    if (!vendor) {
      alert('Please select a vendor');
      return;
    }
    
    // Ensure each item has an ID before saving/updating
    const itemsWithIds = items.map(item => ({
      ...item,
      id: item.id || crypto.randomUUID() // Use existing ID or generate a new one
    })) as InvoiceItem[]; // Cast back to InvoiceItem[] for context functions

    // Data structure for updating or adding
    const commonInvoiceData = {
      invoiceNumber: invoiceNumber,
      vendor: vendor.name, // Include vendor name for context
      vendorId: vendor.id,
      date: date,
      dueDate: dueDate,
      status: status,
      notes: notes || undefined,
 clientName: clientName, // Include clientName
      items: itemsWithIds,
      total: total // Add the total here
    };

    if (invoiceId) {
      // For updating, we only need a Partial<Invoice>
      const invoiceDataForUpdate: Partial<Invoice> = {
        invoiceNumber: commonInvoiceData.invoiceNumber,
        vendorId: commonInvoiceData.vendorId,
        date: commonInvoiceData.date,
        dueDate: commonInvoiceData.dueDate,
        status: commonInvoiceData.status,
        notes: commonInvoiceData.notes,
        items: commonInvoiceData.items,
        amount: commonInvoiceData.total, // Map total to amount
 clientName: commonInvoiceData.clientName, // Include clientName
      };
      updateInvoice(invoiceId, invoiceDataForUpdate);
      navigate(`/invoices/${invoiceId}`); // Navigate back to details after update
    } else {
      const invoiceDataForAdd: Omit<Invoice, 'id'> = {
        ...commonInvoiceData, // Include all common data
        amount: commonInvoiceData.total, // Map total to amount for adding
      };
      addInvoice(invoiceDataForAdd);
    }
  };

  return (
    <div className="container-page">
      <div className="mb-6">
        <button 
          className="flex items-center text-blue-600 font-medium"
          onClick={() => navigate('/invoices')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Invoices
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{invoiceId ? 'Edit Invoice' : 'Create New Invoice'}</h1>
          <p className="text-gray-500">Fill out the form below to create a new invoice</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Invoice Details */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h2>
              
              <div className="mb-4">
                <label htmlFor="clientName" className="form-label">Client Name</label>
                <input
                  type="text"
                  id="clientName"
                  className="form-input"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="invoiceNumber" className="form-label">Invoice Number</label>
                <input
                  type="text"
                  id="invoiceNumber"
                  className="form-input"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="date" className="form-label">Issue Date</label>
                <input
                  type="date"
                  id="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="dueDate" className="form-label">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            
            {/* Vendor Details */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Vendor Information</h2>
              
              <div className="mb-4">
                <label htmlFor="vendor" className="form-label">Vendor</label>
                <select
                  id="vendor"
                  className="form-input"
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  required
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {vendorId && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  {(() => {
                    const vendor = vendors.find(v => v.id === vendorId);
                    if (!vendor) return null;
                    
                    return (
                      <div>
                        <p className="font-medium text-gray-900">{vendor.name}</p>
                        <p className="text-gray-700">{vendor.address}</p>
                        <p className="text-gray-700">{vendor.email}</p>
                        {vendor.phone && <p className="text-gray-700">{vendor.phone}</p>}
                        {vendor.contactPerson && <p className="text-gray-700">Contact: {vendor.contactPerson}</p>}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
          
          {/* Invoice Items */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          className="form-input"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          className="form-input text-right"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          className="form-input text-right"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                className="btn btn-secondary flex items-center"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
          </div>
          
          {/* Invoice Total */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="text-gray-900">${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
              <span>Total</span>
              <span className="text-blue-800">${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>
          
          {/* Notes */}
          <div className="mb-8">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
              id="notes"
              className="form-input h-24"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or payment instructions..."
            ></textarea>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn btn-secondary flex items-center"
              onClick={() => navigate('/invoices')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> {/* Added ArrowLeft icon for consistency */}
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
            >
              <Save className="h-4 w-4 mr-1" />
              Save Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;