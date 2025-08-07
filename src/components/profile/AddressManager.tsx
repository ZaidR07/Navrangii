"use client";

import { useState } from 'react';
import { Plus, Edit3, Trash2, MapPin } from 'lucide-react';

interface Address {
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

interface AddressManagerProps {
  addresses: Address[];
  onUpdateAddresses: (addresses: Address[]) => void;
}

export default function AddressManager({ addresses, onUpdateAddresses }: AddressManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Address>({
    title: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  });

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setFormData({
      title: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: addresses.length === 0 // First address is default
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsAdding(false);
    setFormData(addresses[index]);
  };

  const handleDelete = (index: number) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    onUpdateAddresses(newAddresses);
  };

  const handleSave = () => {
    if (!formData.title || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      alert('Please fill all required fields');
      return;
    }

    const newAddresses = [...addresses];
    
    if (editingIndex !== null) {
      // Update existing address
      newAddresses[editingIndex] = formData;
    } else {
      // Add new address
      newAddresses.push(formData);
    }
    
    // If this is the first address or marked as default, make it default
    if (newAddresses.length === 1 || formData.isDefault) {
      newAddresses.forEach((addr, i) => {
        addr.isDefault = i === newAddresses.length - 1 && (editingIndex !== null ? formData.isDefault : true);
      });
    }
    
    onUpdateAddresses(newAddresses);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({
      title: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    });
  };

  const handleSetDefault = (index: number) => {
    const newAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    onUpdateAddresses(newAddresses);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Saved Addresses</h3>
        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Address
        </button>
      </div>

      {(isAdding || editingIndex !== null) && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Address Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Home, Office"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                  Set as default address
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Save Address
            </button>
          </div>
        </div>
      )}

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
              {address.isDefault && (
                <span className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Default
                </span>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    {address.title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">{address.address}</p>
                  <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                  <p className="text-gray-600 text-sm">{address.country}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(index)}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
