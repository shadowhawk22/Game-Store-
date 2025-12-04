import React from 'react';
import { Order, Customer, StoreSettings } from '../types';
import { XIcon, PrintIcon, StarIcon, GiftIcon } from './icons';

interface ReceiptModalProps {
  order: Order;
  customer: Customer | null;
  storeSettings: StoreSettings;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, customer, storeSettings, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    const TAX_RATE = 0.05; // 5.0% Wisconsin Sales Tax
    const subtotal = order.items.reduce((acc, item) => acc + (item.price || 0), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    const deposit = order.depositPaid ?? 0;
    const balanceDue = Math.max(0, total - deposit);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="relative bg-slate-800 max-w-md w-full rounded-lg shadow-2xl border border-slate-700 text-slate-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div id="receipt-modal-content" className="p-8 bg-slate-800 text-slate-200 overflow-y-auto">
                     <div className="text-center mb-6 border-b border-slate-600 pb-4">
                        {storeSettings.logo && (
                            <img src={storeSettings.logo} alt={storeSettings.name} className="h-16 mx-auto mb-2 object-contain" />
                        )}
                        <h2 className="text-2xl font-bold">{storeSettings.name || 'Game Store'}</h2>
                        <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                            {storeSettings.address && <p>{storeSettings.address}</p>}
                            {storeSettings.phone && <p>{storeSettings.phone}</p>}
                            {storeSettings.email && <p>{storeSettings.email}</p>}
                            {storeSettings.website && <p>{storeSettings.website}</p>}
                        </div>
                        <p className="text-sm text-slate-400 mt-2 font-medium uppercase tracking-wide">Pre-order Receipt</p>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Order ID:</span>
                            <span className="font-mono">{order.id.substring(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                             <span className="text-slate-400">Date:</span>
                            <span>{new Date(order.orderDate).toLocaleString()}</span>
                        </div>

                        <div className="border-t border-slate-600 pt-4 mt-4">
                            <p className="text-slate-400">Customer:</p>
                            <p className="font-semibold text-base">{customer?.name ?? 'N/A'}</p>
                            <p>{customer?.email}</p>
                            <p>{customer?.contact}</p>
                        </div>

                         <div className="border-t border-slate-600 pt-4 mt-4">
                             <p className="text-slate-400 mb-2 font-semibold">Items:</p>
                             <div className="space-y-2">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-base">{item.itemName}</p>
                                            <p className="text-xs text-slate-400">{item.itemType}</p>
                                            {item.notes && <p className="text-xs italic text-slate-500 pt-1">Notes: {item.notes}</p>}
                                        </div>
                                        {item.price !== undefined && <p className="font-semibold text-base">${item.price.toFixed(2)}</p>}
                                    </div>
                                ))}
                             </div>
                         </div>
                         
                         {(subtotal > 0 || deposit > 0) && (
                            <div className="border-t border-slate-600 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Tax ({(TAX_RATE * 100).toFixed(1)}%):</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between font-semibold text-base border-t border-slate-700/50 pt-2">
                                    <span className="text-slate-300">Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                {order.depositPaid !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Deposit Paid:</span>
                                    <span className="text-green-400">-${deposit.toFixed(2)}</span>
                                </div>
                                )}
                                <div className="flex justify-between font-bold text-lg border-t-2 border-slate-600 pt-2">
                                    <span className="text-white">Balance Due:</span>
                                    <span className="text-cyan-400">${balanceDue.toFixed(2)}</span>
                                </div>
                            </div>
                         )}
                         
                         {/* Rewards Section */}
                         {customer && (
                            <div className="border-t-2 border-dashed border-slate-600 pt-4 mt-4">
                                <p className="text-center text-slate-400 text-xs uppercase mb-2 font-semibold">Rewards Status</p>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Spend Progress:</span>
                                    <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                                        <StarIcon className="w-3 h-3"/>
                                        <span>${(customer.rewardsPoints || 0).toFixed(2)} / $100</span>
                                    </div>
                                </div>
                                {customer.storeCredit > 0 && (
                                    <div className="bg-slate-700/50 p-2 rounded text-center">
                                        <span className="text-green-400 font-bold flex items-center justify-center gap-2">
                                            <GiftIcon className="w-4 h-4" />
                                            Available Credit: ${customer.storeCredit.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <p className="text-[10px] text-slate-500 text-center mt-2">
                                    Spend $100 on qualifying items to earn $15 credit!
                                </p>
                            </div>
                         )}
                    </div>
                     <p className="text-center text-xs text-slate-500 mt-8">Thank you for your pre-order! Please keep this receipt.</p>
                </div>
                <div className="no-print p-4 bg-slate-900/50 rounded-b-lg flex justify-end gap-4 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md font-semibold transition-colors">Close</button>
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-semibold transition-colors">
                        <PrintIcon className="w-5 h-5" />
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;