import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { XIcon, PencilIcon } from './icons';

interface EditCustomerModalProps {
  customer: Customer;
  onClose: () => void;
  onUpdateCustomer: (customer: Customer) => Promise<Customer>;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ customer, onClose, onUpdateCustomer }) => {
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email || '');
  const [contact, setContact] = useState(customer.contact || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update state if the customer prop changes while modal is open
  useEffect(() => {
      setName(customer.name);
      setEmail(customer.email || '');
      setContact(customer.contact || '');
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Customer name is required.');
      return;
    }
    
    setIsSubmitting(true);
    try {
        await onUpdateCustomer({
            ...customer,
            name: name.trim(),
            email: email.trim(),
            contact: contact.trim(),
        });
        onClose();
    } catch (error) {
        console.error("Failed to update customer", error);
        alert("Failed to update customer details.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="relative bg-slate-800 max-w-lg w-full rounded-lg shadow-2xl border border-slate-700 text-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Edit Customer</h2>
                <p className="text-sm text-slate-400">Update details for {customer.name}.</p>
              </div>
              <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">Customer Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">Customer Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" 
                />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-slate-300">Contact (Phone)</label>
                <input 
                  type="text" 
                  id="contact" 
                  value={contact} 
                  onChange={e => setContact(e.target.value)} 
                  className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" 
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-b-lg flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md font-semibold transition-colors">Cancel</button>
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-semibold transition-colors disabled:bg-slate-600"
            >
              <PencilIcon className="w-4 h-4"/>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerModal;