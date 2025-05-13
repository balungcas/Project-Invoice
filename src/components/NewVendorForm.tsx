import React, { useState, useEffect } from 'react';

import { useVendors } from '../context/VendorContext';
import { Vendor } from '../context/VendorContext';

interface NewVendorFormProps {
  vendor?: Vendor; // Optional prop for editing
  onSubmit: (vendorData: Omit<Vendor, 'id'> | Vendor) => void; // Accept full Vendor for update
  onCancel: () => void;
}

const NewVendorForm: React.FC<NewVendorFormProps> = ({ vendor, onSubmit, onCancel }) => {
  // Use optional chaining and nullish coalescing for initial state
  const [name, setName] = useState(vendor?.name || ''); // Add name state
  const [contactPerson, setContactPerson] = useState(vendor?.contactPerson || '');
  const [companyAddress, setCompanyAddress] = useState(vendor?.address || '');
  const [email, setEmail] = useState(vendor?.email || '');
  const [contactNumber, setContactNumber] = useState(vendor?.phone || '');
  const [website, setWebsite] = useState(vendor?.website || '');
  const [category, setCategory] = useState(vendor?.category || '');
  const [status, setStatus] = useState(vendor?.status || 'active'); // Status state was missing

  const { } = useVendors();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vendorData = {
      name, // Include name in vendorData
      contactPerson,
      address: companyAddress, // Use 'address' to match Vendor interface
      email,
      phone: contactNumber, // Use 'phone' to match Vendor interface
      website,
      category,
      status,
    };

    if (vendor) {
      // Editing existing vendor
      onSubmit({ ...vendorData, id: vendor.id });
    } else {
      // Adding new vendor
      onSubmit(vendorData);
    }

    // Clear form fields after submission (only for creation mode, or reset after edit)
    setName(''); // Clear name state
    setContactPerson('');
    setCompanyAddress('');
    setEmail('');
    setContactNumber('');
    setWebsite('');
    setCategory('');
    setStatus('active');
    onCancel(); // Hide the form after submission
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{vendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Add Name field */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Vendor Name
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              className="form-input"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Company Address
            </label>
            <input
              type="text"
              id="companyAddress"
              className="form-input"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              className="form-input"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            id="website"
            className="form-input"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {/* Add Category and Status fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Add Notes field (optional) */}
        {/* You might want to add a notes field here as well */}



        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {vendor ? 'Save Changes' : 'Add Vendor'} {/* Update button text based on vendor prop */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewVendorForm;
