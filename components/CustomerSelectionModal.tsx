import React, { useState, useMemo } from 'react';
import { Customer } from '../types';
import { XIcon, SearchIcon, UserPlusIcon } from './icons';

interface CustomerSelectionModalProps {
  customers: Customer[];
  onClose: () => void;
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: (customerData: { name: string, contact: string, email: string }) => Promise<Customer>;
  onUpdateCustomer: (customer: Customer) => Promise<Customer>; // Not used yet, but good for future
}

const CustomerSelectionModal: React.FC<CustomerSelectionModalProps> = ({ 
    customers, 
    onClose, 
    onSelectCustomer,
    onAddCustomer,
}) => {
  const [view, setView] = useState<'search' | 'add'>('search');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state for adding a new customer
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newContact, setNewContact] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lowercasedFilter = searchTerm.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercasedFilter) ||
      customer.contact.toLowerCase().includes(lowercasedFilter) ||
      customer.email?.toLowerCase().includes(lowercasedFilter)
    );
  }, [customers, searchTerm]);

  const handleAddNewCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newName.trim()) {
        alert('Customer name is required.');
        return;
    }
    const newCustomer = await onAddCustomer({
        name: newName,
        email: newEmail,
        contact: newContact,
    });
    // After adding, go back to the search view where the new customer will be visible
    setNewName('');
    setNewEmail('');
    setNewContact('');
    setSearchTerm(newCustomer.name); // Pre-fill search with new customer's name
    setView('search');
  };

  const SearchAndSelectView = () => (
    <>
        <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder="Search for existing customer..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full bg-slate-900 border border-slate-600 rounded-md py-2 pl-10 pr-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                    <button
                        key={customer.id}
                        onClick={() => onSelectCustomer(customer)}
                        className="w-full text-left p-3 rounded-md bg-slate-900/50 hover:bg-slate-700/80 transition-colors"
                    >
                        <p className="font-semibold text-slate-200">{customer.name}</p>
                        <p className="text-sm text-slate-400">{customer.email || customer.contact}</p>
                    </button>
                ))
            ) : (
                <div className="text-center py-4 text-slate-400">
                    <p>No customers found.</p>
                </div>
            )}
        </div>
         <div className="mt-4 pt-4 border-t border-slate-700">
            <button
                onClick={() => setView('add')}
                className="w-full flex justify-center items-center gap-2 text-sm bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-3 rounded-md transition-colors"
            >
                <UserPlusIcon className="w-5 h-5"/>
                Add New Customer
            </button>
        </div>
    </>
  );

  const AddNewCustomerView = () => (
    <form onSubmit={handleAddNewCustomer} className="space-y-4">
        <div>
            <label htmlFor="newName" className="block text-sm font-medium text-slate-300">Customer Name</label>
            <input type="text" id="newName" value={newName} onChange={e => setNewName(e.target.value)} required className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        <div>
            <label htmlFor="newEmail" className="block text-sm font-medium text-slate-300">Customer Email</label>
            <input type="email" id="newEmail" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        <div>
            <label htmlFor="newContact" className="block text-sm font-medium text-slate-300">Contact (Phone)</label>
            <input type="text" id="newContact" value={newContact} onChange={e => setNewContact(e.target.value)} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
            <button type="button" onClick={() => setView('search')} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md font-semibold transition-colors">Back to Search</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-semibold transition-colors">Add Customer</button>
        </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="relative bg-slate-800 max-w-lg w-full rounded-lg shadow-2xl border border-slate-700 text-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                    {view === 'search' ? 'Select a Customer' : 'Add New Customer'}
                </h2>
                <p className="text-sm text-slate-400">
                    {view === 'search' ? 'Search for an existing customer or create a new one.' : 'Enter details for the new customer.'}
                </p>
              </div>
              <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            {view === 'search' ? <SearchAndSelectView /> : <AddNewCustomerView />}
        </div>
      </div>
    </div>
  );
};

export default CustomerSelectionModal;