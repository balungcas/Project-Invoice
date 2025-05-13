import React, { useState, ChangeEvent, DragEvent } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { useInvoices } from '../context/InvoiceContext';
import { useVendors } from '../context/VendorContext';
import { useProducts } from '../context/ProductContext';

export interface ParsedData {
  [key: string]: any;
}

const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadDataType, setUploadDataType] = useState<string>('invoices');

  const { addInvoice } = useInvoices();
  const { addVendor } = useVendors();
  const { addProduct } = useProducts();

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        let parsed: ParsedData[] = [];
        const fileType = file.name.split('.').pop()?.toLowerCase();

        if (fileType === 'csv') {
          const text = data as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          parsed = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
              return obj;
            }, {} as ParsedData);
          }).filter(row => Object.values(row).some(val => val !== '')); // Filter out empty rows
        } else if (fileType === 'xlsx' || fileType === 'xls') {
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsed = XLSX.utils.sheet_to_json(worksheet) as ParsedData[];
        }

        setParsedData(parsed.length > 0 ? parsed : null);
      }
    };

    reader.readAsDataURL(file); // Use readAsDataURL or readAsText for CSV
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
      setParsedData(null);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files.length > 0 ? e.dataTransfer.files[0] : null;
    if (file) {
      setSelectedFile(file);
      Papa.parse(file, {
        complete: (result) => {
          setParsedData(result.data as string[][]); // Assuming data is string[][] after parsing
        },
        header: true, // Assuming the CSV has a header row
      });
      e.dataTransfer.clearData();
    }
  };

  const handleImport = () => {
    if (!parsedData || parsedData.length === 0) {
      alert('No data to import.');
      return;
    }

    switch (uploadDataType) {
      case 'invoices':
        // Access valid invoice data here
        // For example: validInvoiceData.forEach(invoice => addInvoice(invoice));
        break;
      case 'vendors':
        // Access valid vendor data here
        // For example: validVendorData.forEach(vendor => addVendor(vendor));
        break;
      case 'products':
        // Access valid product data here
        // For example: validProductData.forEach(product => addProduct(product));
        break;
    }
    alert(`${parsedData.length} items imported successfully as ${uploadDataType}!`);
    // setParsedData(null);
    // setSelectedFile(null);
  };

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Files</h1>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input type="file" className="hidden" id="fileInput" onChange={handleFileChange} />
        <label htmlFor="fileInput" className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
          {isDragging ? 'Drop the file here' : 'Drag and drop a file here, or click to select a file'}
        </label>
        {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected file: {selectedFile.name}</p>}
      </div>

      <div className="mt-6">
        <label htmlFor="uploadDataType" className="block text-sm font-medium text-gray-700 mb-1">
          Data Type:
        </label>
        <select
          id="uploadDataType"
          className="form-select"
          value={uploadDataType}
          onChange={(e) => setUploadDataType(e.target.value)}
        >
          <option value="invoices">Invoices</option>
          <option value="vendors">Vendors</option>
          <option value="products">Products</option>
        </select>
      </div>



        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">File Preview</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {parsedData && parsedData.length > 0 && Object.keys(parsedData[0]).map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parsedData && parsedData.length > 0 && parsedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <button className="btn btn-primary" onClick={handleImport}>
              Import Data
            </button>
          </div>
        </div>
    </div>
  );
};

export default Upload;
