import React, { useState } from 'react';
// import NewProductForm from '../components/NewProductForm'; // Assuming we might create a dedicated form
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { Trash2 } from 'lucide-react';

const Products: React.FC = () => {
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | undefined>(undefined);
  // const [showAddProductForm, setShowAddProductForm] = useState(false); // Keeping this for now, assuming a modal form might be used

  const confirmDeleteProduct = () => {
    if (productToDeleteId) {
      deleteProduct(productToDeleteId);
      setShowDeleteConfirmation(false);
      setProductToDeleteId(undefined);
    }
  };

  const cancelDeleteProduct = () => {
    setShowDeleteConfirmation(false);
    setProductToDeleteId(undefined);
  };

  const { products, deleteProduct, addProduct, updateProduct } = useProducts(); // Destructure updateProduct if needed for editing
  const { settings } = useSettings();

  const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))] as string[]; // Get unique categories

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.description?.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.category?.toLowerCase().includes(lowerCaseSearchTerm); // Also search in category
    return matchesCategory && matchesSearch;
  });
  return (
    <div className="container-page">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        {/* Quick Actions */}
        <div className="flex space-x-4">
          <button className="btn btn-primary flex items-center" onClick={() => setShowAddProductForm(true)}>
            Add Product
          </button>
          <button className="btn btn-secondary">
            Import Products
          </button>
          <button className="btn btn-secondary">
            Export Products
          </button>
        </div>
      </div>

      {/* Placeholder for Add/Edit Product Form Modal */}
      {/* {showAddProductForm && (
        <NewProductForm onAddProduct={handleAddProduct} onCancel={() => setShowAddProductForm(false)} /> // Or a dedicated ProductForm
      )} */}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="categoryFilter" className="form-label">Category</label>
            <select
              id="categoryFilter"
              className="form-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="searchTerm" className="form-label">Search</label>
            <div className="relative"> {/* Added a wrapper div for the search icon */}
              {/* Added Search icon - uncomment and position if needed */}
              {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div> */}
              <input
                type="text"
                id="searchTerm"
                className="form-input pl-10" // Added pl-10 for icon spacing
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      {filteredProducts.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product List</h2>
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Product Name</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-right">Unit Price</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-center">Actions</th> {/* Added Actions header */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
                    {/* Removed supplier related fields as they don't map directly to Product interface */}
                    <td className="py-3 px-6 text-left">{product.description || '-'}</td>
                    <td className="py-3 px-6 text-right">
                      {settings.currencySymbol}{product.unitPrice.toFixed(settings.decimalPlaces)}
                    </td>
                    <td className="py-3 px-6 text-left">{product.category || '-'}</td>
                    <td className="py-3 px-6 text-center flex items-center justify-center"> {/* Added flex and justify-center for alignment */}
                      {/* Edit button will go here */}
                      {/* Example Edit Button (uncomment when editing is implemented) */}
                      {/* <button
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => handleEditProduct(product)} // Implement handleEditProduct
                      >
                        <Edit className="w-5 h-5" />
                      </button> */}
                        <button
                          className="text-red-600 hover:text-red-900" // Adjusted margin if Edit button is added
                          onClick={() => { setProductToDeleteId(product.id); setShowDeleteConfirmation(true); }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      ) : (
        // Empty State
        <div className="bg-white rounded-lg shadow-sm p-8 text-center mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            No products match your current filters or there are no products added yet.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddProductForm(true)}
          >
            Add Product
          </button>
        </div>
      )} {/* End of conditional rendering */}


      {/* Deletion Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="text-lg font-medium text-gray-900 mb-4">Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-4">
              <button className="btn btn-secondary" onClick={cancelDeleteProduct}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDeleteProduct}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;