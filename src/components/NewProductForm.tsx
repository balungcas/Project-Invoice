import React, { useState, FormEvent } from 'react';

interface NewProductFormProps {
  onAddProduct: (product: {
    name: string;
    price: string;
    company: string;
    address: string;
    contactNumber: string;
    email: string;
  }) => void;
  onCancel: () => void;
}

const NewProductForm: React.FC<NewProductFormProps> = ({ onAddProduct, onCancel }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Basic validation (can be enhanced)
    if (!productName || !price || !company) {
      alert('Product Name, Price, and Company are required.');
      return;
    }

    onAddProduct({
      name: productName,
      price: price, // Assuming price is a string, you might want to parse it to a number
      company,
      address,
      contactNumber,
      email: emailAddress,
    });

    // Clear form fields
    setProductName('');
    setPrice('');
    setCompany('');
    setAddress('');
    setContactNumber('');
    setEmailAddress('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            className="form-input"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="text" // Consider using type="number" and handling currency formatting
            id="price"
            className="form-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company (Supplier)
          </label>
          <input
            type="text"
            id="company"
            className="form-input"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address (Supplier)
          </label>
          <input
            type="text"
            id="address"
            className="form-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number (Supplier)
          </label>
          <input
            type="text"
            id="contactNumber"
            className="form-input"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address (Supplier)
          </label>
          <input
            type="email"
            id="emailAddress"
            className="form-input"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </div>
        <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProductForm;