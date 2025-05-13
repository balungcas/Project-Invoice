import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { VendorProvider } from './context/VendorContext';
import { InvoiceProvider } from './context/InvoiceContext';
import { SettingsProvider } from './context/SettingsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <VendorProvider>
        <InvoiceProvider>
          <App />
        </InvoiceProvider>
      </VendorProvider>
    </SettingsProvider>
  </React.StrictMode>
);