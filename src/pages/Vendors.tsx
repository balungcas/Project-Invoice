import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Filter, Search, Edit, Trash2 } from 'lucide-react';
import VendorCard from '../components/VendorCard';
import NewVendorForm from '../components/NewVendorForm'; // Import the NewVendorForm
import { useVendors } from '../context/VendorContext'; // Import useVendors
import { Vendor } from '../context/VendorContext'; // Import Vendor type
import { useInvoices } from '../context/InvoiceContext'; // Import useInvoices

const Vendors: React.FC = () => {
  const navigate = useNavigate();
  const { vendors, filterVendors, deleteVendor } = useVendors();
  const { addVendor } = useVendors(); // Access addVendor from the hook
  const { updateVendor } = useVendors(); // Access updateVendor from the hook
  const { invoices } = useInvoices(); // Get invoices
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddVendorForm, setShowAddVendorForm] = useState<boolean>(false); // State to control form visibility
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [vendorToDeleteId, setVendorToDeleteId] = useState<string | undefined>(undefined);

  const filteredVendors = filterVendors(
    statusFilter || undefined,
    searchTerm || undefined
  );

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingVendor(undefined);
  };

  const confirmDeleteVendor = () => {
    if (vendorToDeleteId) {
      deleteVendor(vendorToDeleteId);
      setShowDeleteConfirmation(false);
      setVendorToDeleteId(undefined);
    }
  };

  const cancelDeleteVendor = () => { setShowDeleteConfirmation(false); setVendorToDeleteId(undefined); };

  // Get unique categories
  const categories = [...new Set(vendors.map((vendor) => vendor.category))];

  return (
    <div className="container-page">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => setShowAddVendorForm(true)}> {/* Add onClick handler */}
          <PlusCircle className="h-5 w-5 mr-1" />
          Add Vendor
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="statusFilter" className="form-label">Status</label>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="categoryFilter" className="form-label">Category</label>
            <select
              id="category"
              className="form-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="searchTerm" className="form-label">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="form-input pl-10"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conditionally render the NewVendorForm */}
      {showAddVendorForm &&
        <NewVendorForm
          onSubmit={(newVendorData) => {
            addVendor(newVendorData);
            setShowAddVendorForm(false);
          }}
          onCancel={() => setShowAddVendorForm(false)} // Use onCancel to close the form
        />
      }

      {/* Edit Vendor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {editingVendor && (
              <NewVendorForm
                vendor={editingVendor}
                onSubmit={(updatedVendor) => {
                  updateVendor(editingVendor.id, updatedVendor);
                  handleCloseEditModal();
                }}
                onCancel={handleCloseEditModal}
              />
            )}

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="text-lg font-medium text-gray-900 mb-4">Are you sure you want to delete this vendor?</p>
            <div className="flex justify-end space-x-4">
              <button className="btn btn-secondary" onClick={cancelDeleteVendor}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDeleteVendor}>Delete</button>
            </div>
          </div>
        </div>
      )}


      {/* Vendor Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {/* Add Action header later */}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <React.Fragment key={vendor.id}> {/* Use React.Fragment to wrap multiple rows per vendor */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vendor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendor.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {vendor.status}
                      </span>
                    </td>
                     {/* Add Action cells later */}
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       {/* Action buttons will go here */}
                       <button
                         className="text-blue-600 hover:text-blue-900"
                         onClick={() => { setEditingVendor(vendor); setShowEditModal(true); }}
                       >
                         <Edit className="h-5 w-5" />
                       </button>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <button
                         className="text-red-600 hover:text-red-900 ml-4"
                         onClick={() => { setVendorToDeleteId(vendor.id); setShowDeleteConfirmation(true); }}
                       ><Trash2 className="h-5 w-5" /></button>
                     </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium" colSpan={6}> {/* Adjusted colSpan and centered text */}
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        onClick={() => {
                          const vendorInvoices = invoices.filter(invoice => invoice.vendorId === vendor.id);
                          console.log(`Invoices for Vendor ${vendor.name}:`, vendorInvoices);
                        }}
                      >
                        View Invoices
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500"> {/* Adjusted colSpan */}
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Vendors;
