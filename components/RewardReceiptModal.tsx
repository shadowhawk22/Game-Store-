import React from 'react';
import { RewardTransaction, Customer, StoreSettings } from '../types';
import { XIcon, PrintIcon } from './icons';

interface RewardReceiptModalProps {
  transaction: RewardTransaction;
  customer: Customer;
  storeSettings: StoreSettings;
  onClose: () => void;
}

const RewardReceiptModal: React.FC<RewardReceiptModalProps> = ({ transaction, customer, storeSettings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in" onClick={onClose}>
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
                <p className="text-sm text-slate-400 mt-2 font-medium uppercase tracking-wide">Rewards Transaction</p>
            </div>

            <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="font-mono">{transaction.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                     <span className="text-slate-400">Date:</span>
                    <span>{new Date(transaction.date).toLocaleString()}</span>
                </div>
                
                <div className="border-t border-slate-600 pt-4 mt-4">
                    <p className="text-slate-400">Customer:</p>
                    <p className="font-semibold text-base">{customer.name}</p>
                </div>

                <div className="border-t border-slate-600 pt-4 mt-4">
                    <p className="text-slate-400 font-semibold mb-2">Details:</p>
                    <p className="font-medium text-base mb-2">{transaction.description}</p>
                    
                    {transaction.breakdown && (
                         <div className="space-y-1 pl-2 border-l-2 border-slate-700 ml-1">
                             {Object.entries(transaction.breakdown).map(([cat, amt]) => (
                                 <div key={cat} className="flex justify-between text-xs">
                                     <span className="text-slate-400">{cat}</span>
                                     <span>${(amt as number).toFixed(2)}</span>
                                 </div>
                             ))}
                         </div>
                    )}
                </div>

                <div className="border-t-2 border-dashed border-slate-600 pt-4 mt-4">
                     {transaction.type === 'EARN' && (
                         <div className="flex justify-between text-lg font-bold">
                             <span className="text-slate-300">Points Earned:</span>
                             <span className="text-yellow-500">+{transaction.amount.toFixed(2)}</span>
                         </div>
                     )}
                     {transaction.type === 'REDEEM' && (
                         <div className="flex justify-between text-lg font-bold">
                             <span className="text-slate-300">Credit Redeemed:</span>
                             <span className="text-red-400">-${transaction.amount.toFixed(2)}</span>
                         </div>
                     )}
                     {transaction.creditChange !== undefined && transaction.creditChange !== 0 && (
                         <div className="flex justify-between font-semibold mt-2">
                            <span className="text-slate-400">Store Credit Change:</span>
                            <span className={transaction.creditChange > 0 ? 'text-green-400' : 'text-red-400'}>
                                {transaction.creditChange > 0 ? '+' : ''}{transaction.creditChange.toFixed(2)}
                            </span>
                         </div>
                     )}
                </div>
                
                <div className="mt-8 text-center text-xs text-slate-500">
                    <p>Current Balance</p>
                    <div className="flex justify-center gap-4 mt-1 font-semibold">
                        <span className="text-yellow-600">Progress: ${customer.rewardsPoints.toFixed(2)}</span>
                        <span className="text-green-600">Credit: ${customer.storeCredit.toFixed(2)}</span>
                    </div>
                </div>
            </div>
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

export default RewardReceiptModal;