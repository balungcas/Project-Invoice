import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Vendors from './pages/Vendors';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Products from './pages/Products';
import Upload from './pages/Upload';
import InvoiceDetails from './pages/InvoiceDetails';
import VendorDetails from './pages/VendorDetails';
import { InvoiceProvider } from './context/InvoiceContext';
import { ProductProvider } from './context/ProductContext';
import { VendorProvider } from './context/VendorContext';
import './App.css';

function App() {
  return (
    <Router>
      <InvoiceProvider>
        <VendorProvider>
          <ProductProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="invoices/create" element={<CreateInvoice />} />
                <Route path="invoices/:id" element={<InvoiceDetails />} />
                <Route path="invoices/edit/:id" element={<CreateInvoice />} />
                <Route path="vendors" element={<Vendors />} />
                <Route path="reports" element={<Reports />} />
                <Route path="products" element={<Products />} />
                <Route path="upload" element={<Upload />} />
                <Route path="vendors/:id" element={<VendorDetails />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </ProductProvider>
        </VendorProvider>
      </InvoiceProvider>
    </Router>
  );
}
export default App;