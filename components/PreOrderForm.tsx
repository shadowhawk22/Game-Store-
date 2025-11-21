import React, { useState } from 'react';
import { ItemType, Order, Customer, OrderItem, Vendor } from '../types';
import { ITEM_TYPES } from '../constants';
import { PlusIcon, XCircleIcon, ArrowLeftIcon } from './icons';

type TempOrderItem = Omit<OrderItem, 'id' | 'status'>;

interface PreOrderFormProps {
  customer: Customer;
  onAddOrder: (
    orderData: { items: TempOrderItem[], depositPaid?: number },
    customer: Customer
  ) => Promise<Order>;
  onShowReceipt: (order: Order) => void;
  onCancel: () => void;
  vendors: Vendor[];
}

const PreOrderForm: React.FC<PreOrderFormProps> = ({ customer, onAddOrder, onShowReceipt, onCancel, vendors }) => {
  // State for items in the current order
  const [currentItems, setCurrentItems] = useState<TempOrderItem[]>([]);
  const [depositPaid, setDepositPaid] = useState('');

  // State for the item entry form
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState<ItemType>(ItemType.VIDEO_GAME);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [vendorName, setVendorName] = useState('');
  
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
        alert('Item Name is required to add an item.');
        return;
    }
    const newItem: TempOrderItem = {
        itemName,
        itemType,
        price: price === '' ? undefined : Number(price),
        notes,
        tracking: vendorName.trim() ? { vendor: vendorName.trim() } : {},
    };
    setCurrentItems(prev => [...prev, newItem]);

    // Reset item form
    setItemName('');
    setItemType(ItemType.VIDEO_GAME);
    setPrice('');
    setNotes('');
    setVendorName('');
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setCurrentItems(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentItems.length === 0) {
      alert('At least one item is required to create a pre-order.');
      return;
    }

    const newOrder = await onAddOrder(
      {
        items: currentItems,
        depositPaid: depositPaid === '' ? undefined : Number(depositPaid),
      },
      customer
    );
    
    onShowReceipt(newOrder);

    // Form is unmounted when view changes, so local state reset is not strictly needed
    // but it's good practice in case the component is reused differently later.
    setCurrentItems([]);
    setDepositPaid('');
  };

  const totalAmount = currentItems.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <>
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Create New Pre-order</h2>
          <p className="text-slate-400">For Customer: <span className="font-semibold text-cyan-400">{customer.name}</span></p>
        </div>
      </div>
      
      <form onSubmit={handleCreateOrder}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* --- Column 1: Item Entry --- */}
          <div className="space-y-6">
            <fieldset className="space-y-4 p-4 border border-slate-700 rounded-lg">
                <legend className="text-lg font-semibold text-cyan-400 -ml-2 px-2">Add Item</legend>
                <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-slate-300">Item Name</label>
                    <input type="text" id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="itemType" className="block text-sm font-medium text-slate-300">Item Type</label>
                        <select id="itemType" value={itemType} onChange={e => setItemType(e.target.value as ItemType)} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500">
                            {ITEM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-300">Price ($)</label>
                        <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} min="0" step="0.01" className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                    </div>
                </div>
                <div>
                    <label htmlFor="vendorName" className="block text-sm font-medium text-slate-300">Vendor (Optional)</label>
                    <input 
                        type="text" 
                        id="vendorName" 
                        list="vendors-list"
                        value={vendorName} 
                        onChange={e => setVendorName(e.target.value)} 
                        className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" 
                    />
                    <datalist id="vendors-list">
                        {vendors.map(vendor => <option key={vendor.id} value={vendor.name} />)}
                    </datalist>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-300">Notes</label>
                    <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <button type="button" onClick={handleAddItem} className="w-full flex justify-center items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors">Add Item to Order</button>
            </fieldset>
          </div>

          {/* --- Column 2: Order Summary --- */}
          <div className="space-y-3">
            {currentItems.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-cyan-400">Order Items ({currentItems.length})</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {currentItems.map((item, index) => (
                            <div key={index} className="bg-slate-900/70 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-200">{item.itemName}</p>
                                    <p className="text-xs text-slate-400">{item.itemType} - ${item.price?.toFixed(2) ?? '0.00'}</p>
                                    {item.tracking?.vendor && (
                                        <p className="text-xs text-slate-500 italic pt-1">Vendor: {item.tracking.vendor}</p>
                                    )}
                                </div>
                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-slate-500 hover:text-red-400">
                                    <XCircleIcon className="w-6 h-6"/>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                         <div>
                            <label htmlFor="depositPaid" className="block text-sm font-medium text-slate-300">Deposit Paid ($)</label>
                            <input type="number" id="depositPaid" value={depositPaid} onChange={e => setDepositPaid(e.target.value)} min="0" step="0.01" className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-300">Order Total</p>
                            <p className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-700">
            <button type="submit" disabled={currentItems.length === 0} className="w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed">
              <PlusIcon className="w-6 h-6" />
              Create Pre-order & Print Receipt
            </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default PreOrderForm;
