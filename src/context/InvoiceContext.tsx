import React, { createContext, useContext, useState, useEffect } from 'react';
import { useVendors } from './VendorContext';

export interface InvoiceItem {
  id: string;
  quantity: number;
  unitPrice: number;
  // Assuming InvoiceItem was meant for product/service line items
  // Let's redefine based on common line item needs
  productId?: string; // Optional: link to a product
  description: string; // Description for the line item
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId?: string; // Make vendorId optional as we might look up vendor details via ID
  date: string;
  dueDate: string;
  amount: number;
  clientName: string;
  status: 'pending' | 'paid' | 'overdue' | 'draft' | 'half-payment';
  items: InvoiceItem[];
  notes?: string;
  attachmentUrl?: string;
}

// Define new interface for Invoice Line Items
export interface InvoiceLineItem {
  productId: string; // ID of the product
  description: string; // Description (can be overridden from product)
  quantity: number;
  unitPrice: number; // Unit price (can be overridden from product)
}

interface InvoiceContextType {
  invoices: Invoice[];
  getInvoice: (id: string) => Invoice | undefined;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  filterInvoices: (status?: string, vendor?: string, search?: string, clientName?: string, startDate?: string, endDate?: string) => Invoice[];
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { vendors } = useVendors(); // Get vendors data

  // Load from Local Storage on mount
  useEffect(() => {
    const storedInvoices = localStorage.getItem('appInvoices');
    if (storedInvoices) {
      try {
        const parsedInvoices: Invoice[] = JSON.parse(storedInvoices).map((invoice: any) => ({
          ...invoice,
          date: invoice.date ? new Date(invoice.date).toISOString() : '', // Convert date string to standardized ISO string
        }));
        // Convert date strings back to Date objects if necessary (though the interface uses string)
        // If you need Date objects later, you'd convert here or in the component using them.
        setInvoices(parsedInvoices);
      } catch (error) {
        console.error("Failed to parse invoices from localStorage", error);
      }
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Save to Local Storage whenever invoices change
  useEffect(() => {
    localStorage.setItem('appInvoices', JSON.stringify(invoices));
  }, [invoices]); // Runs whenever the invoices state changes

  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = {
      ...invoice,
      id: crypto.randomUUID()
    };
    setInvoices(prev => [...prev, newInvoice as Invoice]);
  };

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === id ? { ...invoice, ...invoiceData } : invoice
      )
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  const filterInvoices = (status?: string, vendor?: string, search?: string, clientName?: string, startDate?: string, endDate?: string) => {
    return invoices.filter(invoice => {
      if (status && invoice.status !== status) return false;
      // Filter by vendor name if a vendor filter is provided
      if (vendor) {
        const vendorObject = vendors.find(v => v.id === invoice.vendorId);
        if (!vendorObject || (vendorObject.name.toLowerCase() !== vendor.toLowerCase())) return false;
      }
      if (clientName && !invoice.clientName.toLowerCase().includes(clientName.toLowerCase())) return false;

      // Filter by date range
      const invoiceDate = new Date(invoice.date);
      if (startDate) {
        const startFilterDate = new Date(startDate);
        if (invoiceDate < startFilterDate) return false;
      }
      if (endDate) {
        const endFilterDate = new Date(endDate);
        if (invoiceDate > endFilterDate) return false;
      }

      if (search) {
        const searchLower = search.toLowerCase();
        return (
          // Adjusted search logic to include vendor name
          invoice.invoiceNumber.toLowerCase().includes(searchLower) || // Search by invoice number
          // Search by vendor name if vendor is linked and its name includes the search term
          (vendors.find(v => v.id === invoice.vendorId)?.name.toLowerCase().includes(searchLower)) || // Adjusted line
          invoice.notes?.toLowerCase().includes(searchLower)
        );
      }
    });
  };

  return (
    <InvoiceContext.Provider value={{ 
      invoices, 
      getInvoice, 
      addInvoice, 
      updateInvoice, 
      deleteInvoice, 
      filterInvoices 
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};