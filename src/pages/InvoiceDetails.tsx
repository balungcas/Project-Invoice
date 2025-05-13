import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Edit, Trash2, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useInvoices } from '../context/InvoiceContext';
import { useVendors } from '../context/VendorContext';

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const { getVendor } = useVendors(); // Assuming getVendor is available and used
  
  const invoice = getInvoice(id || '');
  const vendor = invoice ? getVendor(invoice.vendorId) : undefined;
  
  if (!invoice) {
    return (
      <div className="container-page">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/invoices')}
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }
  
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-amber-500" />,
    paid: <CheckCircle className="h-5 w-5 text-green-500" />,
    overdue: <AlertCircle className="h-5 w-5 text-red-500" />,
    draft: <CreditCard className="h-5 w-5 text-gray-400" />
  };
  
  const statusBadges = {
    pending: 'bg-amber-100 text-amber-800',
    'half-payment': 'bg-blue-100 text-blue-800', // Added badge for half payment
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
  };
  
  const statusLabels = {
    pending: 'Pending',
    paid: 'Paid',
    'half-payment': 'Half Payment', // Added label for half payment
    overdue: 'Overdue',
    draft: 'Draft'
  };
  
  const handleStatusChange = (newStatus: 'pending' | 'paid' | 'overdue' | 'draft') => {
    updateInvoice(invoice.id, { status: newStatus });
  };
  
  // Calculate totals
  const subtotal = invoice.items.reduce((total, item) => {
    return total + (item.quantity * item.unitPrice);
  }, 0);
  
  const handleDownloadPDF = async () => {
    const invoiceContent = document.getElementById('invoice-content');
    if (invoiceContent) {
      const canvas = await html2canvas(invoiceContent);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`invoice_${invoice.invoiceNumber}.pdf`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    deleteInvoice(invoice.id);
    navigate('/invoices');
  };

  const taxRate = 0.08; // 8% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

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
      
      <div className="bg-white rounded-lg shadow-sm" id="invoice-content">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
              <p className="text-gray-500">Issued on {new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusBadges[invoice.status]}`}>
                {statusIcons[invoice.status]}
                <span className="ml-1">{statusLabels[invoice.status]}</span>
              </span>
              
              <div className="dropdown relative">
                <button className="btn btn-secondary text-sm">
                  Change Status
                </button>
                {/* Consider adding logic to toggle visibility of this dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"> {/* Added z-index for dropdown */}
                  <button 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => handleStatusChange('pending')}
                  >
                    Mark as Pending
                  </button>
                   <button 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => handleStatusChange('half-payment')}
                  >
                    Mark as Half Payment
                  </button>
                  <button 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => handleStatusChange('paid')}
                  >
                    Mark as Paid
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <button className="btn btn-primary flex items-center">
              <Edit
 className="h-4 w-4 mr-1"
 onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
 />
              Edit
            </button>
            <button className="btn btn-secondary flex items-center">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </button>
            <button className="btn btn-secondary flex items-center">
              <Download className="h-4 w-4 mr-1" onClick={handleDownloadPDF} />
              Download PDF
            </button>
            <button className="btn btn-danger flex items-center">
              <Trash2 className="h-4 w-4 mr-1" onClick={handleDeleteClick} />
              <span onClick={handleDeleteClick}>Delete</span>
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">FROM</h3>
              <div className="text-gray-900">
                <p className="font-medium">Your Company Name</p>
                <p>123 Your Street</p>
                <p>Your City, ST 12345</p>
                <p>your.email@example.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">TO</h3>
              {vendor && (
                <div className="text-gray-900">
                  <p className="font-medium">{vendor.name}</p>
                  <p>{vendor.address}</p>
                  <p>{vendor.email}</p>
                  {vendor.phone && <p>{vendor.phone}</p>}
                  {vendor.contactPerson && <p>Attn: {vendor.contactPerson}</p>}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Invoice Number</h3>
                <p className="text-gray-900">{invoice.invoiceNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Issue Date</h3>
                <p className="text-gray-900">{new Date(invoice.date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                <p className="text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Amount Due</h3>
                <p className="text-xl font-bold text-blue-800">
                  ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h3>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td> {/* Removed semicolon */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${(item.quantity * item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Invoice Summary */}
          <div className="mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="text-gray-900">${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
                <span>Total</span>
                <span className="text-blue-800">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            </div>
          )}
          
          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-blue-900 mb-2 font-medium">Please make payment by the due date.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Bank Transfer</p>
                  <p className="text-gray-900">Account Name: Your Company</p>
                  <p className="text-gray-900">Account Number: 1234567890</p>
                  <p className="text-gray-900">Routing Number: 987654321</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Other Payment Methods</p>
                  <p className="text-gray-900">Credit Card: Accepted</p>
                  <p className="text-gray-900">PayPal: payments@yourcompany.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this invoice? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="delete-btn"
                  className="btn btn-danger mr-2"
 onClick={() => confirmDelete()}
                >
                  Delete
                </button>
                <button
                  id="cancel-btn"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;