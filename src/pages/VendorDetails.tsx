import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Building2, Mail, Phone, FileText, User, CreditCard, Tag } from 'lucide-react';
import { useVendors } from '../context/VendorContext';
import { useInvoices } from '../context/InvoiceContext';
import InvoiceCard from '../components/InvoiceCard';

const VendorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVendor } = useVendors();
  const { invoices } = useInvoices();
  
  const vendor = getVendor(id || '');
  
  if (!vendor) {
    return (
      <div className="container-page">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendor Not Found</h2>
          <p className="text-gray-600 mb-6">The vendor you're looking for doesn't exist or has been removed.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/vendors')}
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }
  
  // Get vendor invoices
  const vendorInvoices = invoices.filter(invoice => invoice.vendorId === vendor.id);
  
  // Calculate vendor statistics
  const totalSpent = vendorInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = vendorInvoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="container-page">
      <div className="mb-6">
        <button 
          className="flex items-center text-blue-600 font-medium"
          onClick={() => navigate('/vendors')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Vendors
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vendor Profile */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
                <span className={`badge ${vendor.status === 'active' ? 'badge-green' : 'bg-gray-100 text-gray-800'}`}>
                  {vendor.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-blue-600 mt-1">
                <Tag className="h-4 w-4 inline-block mr-1" />
                {vendor.category}
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="text-gray-900">{vendor.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-gray-900">{vendor.email}</p>
                  </div>
                </div>
                
                {vendor.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p className="text-gray-900">{vendor.phone}</p>
                    </div>
                  </div>
                )}
                
                {vendor.taxId && (
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Tax ID</h3>
                      <p className="text-gray-900">{vendor.taxId}</p>
                    </div>
                  </div>
                )}
                
                {vendor.contactPerson && (
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                      <p className="text-gray-900">{vendor.contactPerson}</p>
                    </div>
                  </div>
                )}
                
                {vendor.paymentTerms && (
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Payment Terms</h3>
                      <p className="text-gray-900">{vendor.paymentTerms}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {vendor.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-gray-700">{vendor.notes}</p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-4">
                <button className="btn btn-primary flex items-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="btn btn-danger flex items-center">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          {/* Vendor Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendor Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-700">Total Spent</h3>
                <p className="text-2xl font-bold text-blue-800">₱{totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-amber-700">Pending</h3>
                <p className="text-2xl font-bold text-amber-800">₱{pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700">Total Invoices</h3>
                <p className="text-2xl font-bold text-gray-800">{vendorInvoices.length}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-700">Paid Invoices</h3>
                <p className="text-2xl font-bold text-green-800">{vendorInvoices.filter(i => i.status === 'paid').length}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Vendor Invoices */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Invoices from {vendor.name}</h2>
            </div>
            
            <div className="p-6">
              {vendorInvoices.length > 0 ? (
                <div className="grid gap-4">
                  {vendorInvoices.map(invoice => (
                    <InvoiceCard key={invoice.id} invoice={invoice} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
                  <p className="text-gray-500 mb-4">
                    You don't have any invoices from this vendor yet.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/invoices/create')}
                  >
                    Create Invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;