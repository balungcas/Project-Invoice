import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  category: string;
  status: 'active' | 'inactive';
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  contactPerson?: string;
  website?: string;
}

interface VendorContextType {
  vendors: Vendor[];
  getVendor: (id: string) => Vendor | undefined;
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  filterVendors: (status?: string, category?: string, search?: string) => Vendor[];
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    // Load from localStorage on initial render
    const savedVendors = localStorage.getItem('appVendors');
    if (savedVendors) {
      try {
        return JSON.parse(savedVendors) as Vendor[];
      } catch (error) {
        console.error("Failed to parse vendors from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('appVendors', JSON.stringify(vendors));
  }, [vendors]);

  const getVendor = (id: string) => {
    return vendors.find(vendor => vendor.id === id);
  };

  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newVendor = {
      ...vendor,
      id: crypto.randomUUID()
    };
    setVendors(prev => [...prev, newVendor as Vendor]);
  };

  const updateVendor = (id: string, vendorData: Partial<Vendor>) => {
    setVendors(prev =>
      prev.map(vendor =>
        vendor.id === id ? { ...vendor, ...vendorData } : vendor
      )
    );
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(vendor => vendor.id !== id));
  };

  const filterVendors = (status?: string, category?: string, search?: string) => {
    return vendors.filter(vendor => {
      if (status && vendor.status !== status) return false;
      if (category && vendor.category !== category) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          vendor.name.toLowerCase().includes(searchLower) ||
          vendor.email.toLowerCase().includes(searchLower) ||
          vendor.notes?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  };

  return (
    <VendorContext.Provider value={{ 
      vendors, 
      getVendor, 
      addVendor, 
      updateVendor, 
      deleteVendor, 
      filterVendors 
    }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendors = () => {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendors must be used within a VendorProvider');
  }
  return context;
};