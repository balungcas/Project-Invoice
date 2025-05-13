import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Invoice } from '../context/InvoiceContext';

interface InvoiceCardProps {
  invoice: Invoice;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  const navigate = useNavigate();
  
  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-amber-500" />,
    paid: <CheckCircle className="h-5 w-5 text-green-500" />,
    overdue: <AlertCircle className="h-5 w-5 text-red-500" />,
    draft: <CreditCard className="h-5 w-5 text-gray-400" />
  };
  
  const statusBadges = {
    pending: 'badge badge-amber',
    paid: 'badge badge-green',
    overdue: 'badge badge-red',
    draft: 'badge bg-gray-100 text-gray-800'
  };
  
  const statusLabels = {
    pending: 'Pending',
    paid: 'Paid',
    overdue: 'Overdue',
    draft: 'Draft'
  };

  return (
    <div 
      className="card fade-in cursor-pointer"
      onClick={() => navigate(`/invoices/${invoice.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
          <p className="text-sm text-gray-500">{invoice.vendor}</p>
        </div>
        <span className={statusBadges[invoice.status]}>
          <div className="flex items-center space-x-1">
            {statusIcons[invoice.status]}
            <span>{statusLabels[invoice.status]}</span>
          </div>
        </span>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <Calendar className="h-4 w-4 mr-1" />
        <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <span className="font-medium text-gray-900">
          ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/invoices/${invoice.id}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default InvoiceCard;