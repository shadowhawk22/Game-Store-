import React, { useState, useEffect } from 'react';
import { OrderItem, OrderStatus, Customer, Vendor } from '../types';
import { XIcon, PaperAirplaneIcon } from './icons';

interface ItemDetailModalProps {
  orderId: string;
  item: OrderItem;
  customer: Customer | null;
  onClose: () => void;
  onSaveChanges: (orderId: string, item: OrderItem) => Promise<void>;
  vendors: Vendor[];
  employees: string[];
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ orderId, item, customer, onClose, onSaveChanges, vendors, employees }) => {
  const [formData, setFormData] = useState<OrderItem>({ ...item });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFormData({ ...item });
  }, [item]);

  const handleTrackingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      tracking: {
        ...prev.tracking,
        [name]: value,
      },
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      notes: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Automatically update status based on tracking info
    let finalData = { ...formData };
    if (finalData.tracking?.pickedUpDate && finalData.status !== OrderStatus.PICKED_UP) {
      finalData.status = OrderStatus.PICKED_UP;
    } else if (finalData.tracking?.receivedDate && finalData.status === OrderStatus.PREORDERED) {
      finalData.status = OrderStatus.IN_STOCK;
    }

    await onSaveChanges(orderId, finalData);
    onClose();
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    // Handles both ISO strings with time and simple yyyy-mm-dd dates
    return new Date(dateString).toISOString().split('T')[0];
  };

  const canNotify = formData.status === OrderStatus.IN_STOCK && !formData.tracking?.customerNotifiedDate;
  const canEmailNotify = canNotify && customer?.email;
  const canTextNotify = canNotify && customer?.contact;

  const generateGmailLink = () => {
    if (!customer?.email) return '';
    const subject = `Your Pre-order has Arrived! (${item.itemName})`;
    const body = `Hi ${customer.name},\n\nYour pre-ordered item, "${item.itemName}", has arrived at the store!\n\nYou can pick it up anytime during our business hours.\n\nThanks,\nGame Store`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(customer.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyTextNotification = () => {
    if (!customer?.contact) return;
    const message = `Hi ${customer.name}, your pre-order for "${item.itemName}" has arrived at Game Store! You can pick it up anytime.`;
    navigator.clipboard.writeText(message).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="relative bg-slate-800 max-w-lg w-full rounded-lg shadow-2xl border border-slate-700 text-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{item.itemName}</h2>
                <p className="text-sm text-slate-400">{item.itemType} - Pre-order Details</p>
              </div>
              <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <fieldset>
                <legend className="text-lg font-semibold text-cyan-400 mb-2">Tracking Information</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vendor" className="block text-sm font-medium text-slate-300">Vendor</label>
                    <select 
                      id="vendor"
                      name="vendor"
                      value={formData.tracking?.vendor || ''}
                      onChange={handleTrackingChange}
                      className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    >
                        <option value="">Select Vendor...</option>
                        {vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                  </div>
                   <div>
                    <label htmlFor="orderedBy" className="block text-sm font-medium text-slate-300">Ordered By</label>
                    <select
                      id="orderedBy"
                      name="orderedBy"
                      value={formData.tracking?.orderedBy || ''}
                      onChange={handleTrackingChange}
                      className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    >
                        <option value="">Select Employee...</option>
                        {employees.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="orderedFromVendorDate" className="block text-sm font-medium text-slate-300">Ordered from Vendor</label>
                    <input 
                      type="date"
                      id="orderedFromVendorDate"
                      name="orderedFromVendorDate"
                      value={formatDateForInput(formData.tracking?.orderedFromVendorDate)}
                      onChange={handleTrackingChange}
                      className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="expectedArrivalDate" className="block text-sm font-medium text-slate-300">Expected Arrival</label>
                    <input 
                      type="date"
                      id="expectedArrivalDate"
                      name="expectedArrivalDate"
                      value={formatDateForInput(formData.tracking?.expectedArrivalDate)}
                      onChange={handleTrackingChange}
                      className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="receivedDate" className="block text-sm font-medium text-slate-300">Received from Vendor</label>
                    <input 
                      type="date"
                      id="receivedDate"
                      name="receivedDate"
                      value={formatDateForInput(formData.tracking?.receivedDate)}
                      onChange={handleTrackingChange}
                      className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                   <div>
                    <label htmlFor="customerNotifiedDate" className="block text-sm font-medium text-slate-300">Customer Notified</label>
                    <input 
                      type="date"
                      id="customerNotifiedDate"
                      name="customerNotifiedDate"
                      value={formatDateForInput(formData.tracking?.customerNotifiedDate)}
                      onChange={handleTrackingChange}
                      className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="pickedUpDate" className="block text-sm font-medium text-slate-300">Date of Pickup by Customer</label>
                    <input 
                      type="date"
                      id="pickedUpDate"
                      name="pickedUpDate"
                      value={formatDateForInput(formData.tracking?.pickedUpDate)}
                      onChange={handleTrackingChange}
                      className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
              </fieldset>

              {canNotify && (
                <div className="p-3 bg-slate-700/50 rounded-lg text-center space-y-2">
                    <p className="text-sm text-slate-300 mb-2">Item received. Ready to notify customer.</p>
                    <div className="flex justify-center gap-2">
                        {canEmailNotify && (
                          <a
                              href={generateGmailLink()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md font-semibold transition-colors text-sm"
                          >
                              <PaperAirplaneIcon className="w-4 h-4"/>
                              Notify via Gmail
                          </a>
                        )}
                        {canTextNotify && (
                           <button
                                type="button"
                                onClick={handleCopyTextNotification}
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md font-semibold transition-colors text-sm ${copied ? 'bg-green-600 text-white' : 'bg-slate-600 hover:bg-slate-500 text-white'}`}
                            >
                                {copied ? 'Copied!' : 'Copy Text Notification'}
                           </button>
                        )}
                    </div>
                </div>
              )}

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300">Notes</label>
                <textarea 
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleNotesChange}
                  rows={3} 
                  className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/50 rounded-b-lg flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md font-semibold transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-semibold transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemDetailModal;