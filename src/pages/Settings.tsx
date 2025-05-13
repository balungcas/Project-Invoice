import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city);
  const [state, setState] = useState(settings.state);
  const [zipCode, setZipCode] = useState(settings.zipCode);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [taxId, setTaxId] = useState(settings.taxId);

  const [notifyVendors, setNotifyVendors] = useState(settings.notifyVendors);
  const [emailReminders, setEmailReminders] = useState(settings.emailReminders);
  const [autoArchive, setAutoArchive] = useState(settings.autoArchive);

  const [defaultDueDays, setDefaultDueDays] = useState(settings.defaultDueDays);
  const [defaultTaxRate, setDefaultTaxRate] = useState(settings.defaultTaxRate);
  const [currency, setCurrency] = useState(settings.currency);

  useEffect(() => {
    setCompanyName(settings.companyName);
    setAddress(settings.address);
    setCity(settings.city);
    setState(settings.state);
    setZipCode(settings.zipCode);
    setEmail(settings.email);
    setPhone(settings.phone);
    setTaxId(settings.taxId);
    setNotifyVendors(settings.notifyVendors);
    setEmailReminders(settings.emailReminders);
    setAutoArchive(settings.autoArchive);
    setDefaultDueDays(settings.defaultDueDays);
    setDefaultTaxRate(settings.defaultTaxRate);
    setCurrency(settings.currency);
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      companyName,
      address,
      city,
      state,
      zipCode,
      email,
      phone,
      taxId,
      notifyVendors,
      emailReminders,
      autoArchive,
      defaultDueDays,
      defaultTaxRate,
      currency,
    });
    alert('Settings saved successfully!');
  };

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 last:border-b-0">
          <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
          <p className="text-gray-500">Update your company details used on invoices</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="companyName" className="form-label">Company Name</label>
              <input
                type="text"
                id="companyName"
                className="form-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>  
            
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="address" className="form-label">Street Address</label>
              <input
                type="text"
                id="address"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="text"
                id="phone"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                id="city"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="taxId" className="form-label">Tax ID / EIN</label>
              <input
                type="text"
                id="taxId"
                className="form-input"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="form-label">State</label>
                <input
                  type="text"
                  id="state"
                  className="form-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  className="form-input"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>
          </div>          
          
          {/* Placeholder sections - remove or modify as needed */}
          <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="defaultDueDays" className="form-label">Default Payment Terms (days)</label>
                  <input
                    type="number"
                    id="defaultDueDays"
                    min="1"
                    className="form-input"
                    value={defaultDueDays}
                    onChange={(e) => setDefaultDueDays(parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <label htmlFor="defaultTaxRate" className="form-label">Default Tax Rate (%)</label>
                  <input
                    type="number"
                    id="defaultTaxRate"
                    min="0"
                    step="0.1"
                    className="form-input"
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(parseFloat(e.target.value))}
                  />
                </div>
                
                <div>
                  <label htmlFor="currency" className="form-label">Currency</label>
                  <select
                    id="currency"
                    className="form-input"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="PHP">PHP - Philippine Peso</option>
                  </select>
                </div>
              </div>
            </div>          
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notifyVendors"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={notifyVendors}
                    onChange={(e) => setNotifyVendors(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="notifyVendors" className="font-medium text-gray-700">Notify vendors when invoices are created</label>
                  <p className="text-gray-500">Send an email to vendors when a new invoice is created for them</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="emailReminders"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={emailReminders}
                    onChange={(e) => setEmailReminders(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="emailReminders" className="font-medium text-gray-700">Send payment reminders</label>
                  <p className="text-gray-500">Automatically send payment reminders for upcoming and overdue invoices</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="autoArchive"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={autoArchive}
                    onChange={(e) => setAutoArchive(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="autoArchive" className="font-medium text-gray-700">Auto-archive paid invoices</label>
                  <p className="text-gray-500">Automatically archive invoices 30 days after they've been paid</p>
                </div>
              </div>
            </div>
          </div>          
          
          <div className="flex justify-end">
            <button
              type="button" // Changed to type="button" to prevent form submission unless explicitly handled
              className="btn btn-primary flex items-center"
              onClick={handleSave} // Call handleSave on click
            >
              <Save className="h-4 w-4 mr-1" />
              Save Settings
            </button>
          </div>
        </div> {/* Closing the main form div */ }
      </div>
    </div>
  );
};

export default Settings;
