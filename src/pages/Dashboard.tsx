import React from 'react';
import { useNavigate,  } from 'react-router-dom';
import { DollarSign, Clock, Users, AlertCircle, FileText, TrendingUp, FileDown, PlusCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useInvoices } from '../context/InvoiceContext';
import { useVendors } from '../context/VendorContext';
import { useProducts } from '../context/ProductContext';

const Dashboard: React.FC = () => {
  const { invoices } = useInvoices();
  const { vendors } = useVendors();
  const navigate = useNavigate();

  ChartJS.register(ArcElement, Tooltip, Legend);
  
  // Calculate statistics
  const totalPaid = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const outstandingInvoices = invoices.filter(invoice => invoice.status === 'pending' || invoice.status === 'half-payment').length;

  const overdueInvoices = invoices
    .filter(invoice => invoice.status === 'overdue')
    .length;

  const totalInvoices = invoices.length;
  
  // Sort invoices by date and get recent ones
  const recentInvoices = [...invoices]
 .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
 .slice(0, 5); // Get top 5 recent invoices

  // Prepare data for status pie chart
  const statusCounts = {
    pending: invoices.filter(invoice => invoice.status === 'pending').length,
    paid: invoices.filter(invoice => invoice.status === 'paid').length,
    'half-payment': invoices.filter(invoice => invoice.status === 'half-payment').length,
    overdue: invoices.filter(invoice => invoice.status === 'overdue').length,
    draft: invoices.filter(invoice => invoice.status === 'draft').length,
  };

  const statusChartData = {
    labels: ['Pending', 'Paid', 'Half Payment', 'Overdue', 'Draft'],
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          '#f59e0b', // amber-500
          '#10b981', // green-500
          '#3b82f6', // blue-500
          '#ef4444', // red-500
          '#9ca3af', // gray-400
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const activeVendors = vendors.filter(vendor => vendor.status === 'active').length;

  // New Metrics
  const pendingInvoiceCount = invoices.filter(invoice => invoice.status === 'pending').length;
  const overdueInvoiceCount = invoices.filter(invoice => invoice.status === 'overdue').length;
  const totalVendorCount = vendors.length;

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₱${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Outstanding Invoices"
          value={outstandingInvoices}
          icon={Clock}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
        />
        <StatCard
          title="Overdue"
          value={overdueInvoices}
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
        <StatCard
          title="Total Invoices"
          value={totalInvoices}
          icon={FileText}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
      </div>
      {/* Additional Stats Grid (can be combined or kept separate) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatCard
          title="Pending Invoices"
          value={pendingInvoiceCount}
          icon={Clock} // Reuse icons or find new ones
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Overdue Invoices"
          value={overdueInvoiceCount}
          icon={AlertCircle} // Reuse icons or find new ones
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
         <StatCard
          title="Total Vendors"
          value={totalVendorCount}
          icon={Users} iconColor={''} iconBgColor={''}        />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Invoice Status Breakdown</h2>
        <div className="bg-white rounded-lg shadow-sm p-4 flex justify-center">
          <div style={{ width: '400px', height: '400px' }}> {/* Adjust size as needed */}
            <Pie
              data={statusChartData}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Invoice Status Distribution' } } }}
            />
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
          {/* Quick action button - can be made functional */}
          <button
            className="btn btn-secondary flex items-center text-sm"
            onClick={() => navigate('/invoices/create')}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Create Invoice
          </button>
        </div>
        
        {recentInvoices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentInvoices.map((invoice) => (
              /* <InvoiceCard key={invoice.id} invoice={invoice} /> */
              <div key={invoice.id} className="bg-white p-4 rounded shadow-sm">Invoice {invoice.invoiceNumber} - {invoice.clientName}</div> // Placeholder
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recent invoices found.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/invoices')} // Navigate to Invoices tab
          >
            Create New Invoice
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/vendors')} // Navigate to Vendors tab
          >
            Add New Vendor
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/products')} // Navigate to Products tab
          >
            Add New Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;