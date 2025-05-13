import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Phone, Mail, Tag } from 'lucide-react';
import { Vendor } from '../context/VendorContext';

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="card fade-in cursor-pointer"
      onClick={() => navigate(`/vendors/${vendor.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
        <span className={`badge ${vendor.status === 'active' ? 'badge-green' : 'bg-gray-100 text-gray-800'}`}>
          {vendor.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Building2 className="h-4 w-4 mr-2" />
          <span className="truncate">{vendor.address.split(',')[0]}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Mail className="h-4 w-4 mr-2" />
          <span className="truncate">{vendor.email}</span>
        </div>
        
        {vendor.phone && (
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="h-4 w-4 mr-2" />
            <span>{vendor.phone}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center mt-2">
        <Tag className="h-4 w-4 mr-1 text-blue-600" />
        <span className="text-sm text-blue-600">{vendor.category}</span>
      </div>
    </div>
  );
};

export default VendorCard;