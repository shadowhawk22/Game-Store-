import React from 'react';
import { RewardTransaction, Customer, StoreSettings } from '../types';
import { PrintIcon, XIcon } from './icons';

interface RewardHistoryReportModalProps {
  transactions: RewardTransaction[];
  customer: Customer;
  storeSettings: StoreSettings;
  dateRange: { start: string; end: string };
  onClose: () => void;
}

const RewardHistoryReportModal: React.FC<RewardHistoryReportModalProps> = ({ 
  transactions, 
  customer, 
  storeSettings, 
  dateRange,
  onClose 
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Calculate totals for the period
  const totalEarned = transactions
    .filter(t => t.type === 'EARN')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRedeemed = transactions
    .filter(t => t.type === 'REDEEM')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCreditChange = transactions.reduce((sum, t) => sum + (t.creditChange || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fade-in" onClick={onClose}>
      <div className="relative bg-slate-800 max-w-3xl w-full rounded-lg shadow-2xl border border-slate-700 text-slate-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Printable Content */}
        <div id="report-modal-content" className="p-8 bg-slate-800 text-slate-200 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-600 pb-6 mb-6">
                <div className="flex items-start gap-4">
                    {storeSettings.logo && (
                        <img src={storeSettings.logo} alt="Logo" className="h-16 w-16 object-contain" />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-white">{storeSettings.name || 'Game Store'}</h1>
                        <p className="text-sm text-slate-400 uppercase tracking-wider mt-1">Rewards Transaction History</p>
                        <div className="text-xs text-slate-400 mt-2">
                            Report Period: <span className="text-white font-mono">{dateRange.start || 'Beginning'}</span> to <span className="text-white font-mono">{dateRange.end || 'Present'}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-white">{customer.name}</h2>
                    <p className="text-sm text-slate-400">{customer.email}</p>
                    <p className="text-sm text-slate-400">{customer.contact}</p>
                </div>
            </div>

            {/* Summary Box */}
            <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="text-center border-r border-slate-700">
                    <p className="text-xs text-slate-400 uppercase">Total Points Spent</p>
                    <p className="text-xl font-bold text-yellow-500">${totalEarned.toFixed(2)}</p>
                </div>
                <div className="text-center border-r border-slate-700">
                    <p className="text-xs text-slate-400 uppercase">Credit Redeemed</p>
                    <p className="text-xl font-bold text-red-400">${totalRedeemed.toFixed(2)}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase">Net Credit Change</p>
                    <p className={`text-xl font-bold ${netCreditChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {netCreditChange > 0 ? '+' : ''}{netCreditChange.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-700/50 border-b border-slate-600">
                    <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-right">Credit Impact</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                                    {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-medium text-white">{tx.description}</div>
                                    {tx.breakdown && (
                                        <div className="text-xs text-slate-500 mt-1">
                                            {Object.entries(tx.breakdown).map(([k, v]) => `${k}: $${(v as number).toFixed(2)}`).join(', ')}
                                        </div>
                                    )}
                                </td>
                                <td className={`px-4 py-3 text-right font-bold ${tx.type === 'EARN' ? 'text-yellow-500' : 'text-red-400'}`}>
                                    {tx.type === 'EARN' ? '+' : '-'}{tx.amount.toFixed(2)}
                                </td>
                                <td className={`px-4 py-3 text-right font-medium ${
                                    (tx.creditChange || 0) > 0 ? 'text-green-400' : (tx.creditChange || 0) < 0 ? 'text-red-400' : 'text-slate-500'
                                }`}>
                                    {(tx.creditChange || 0) > 0 ? '+' : ''}{(tx.creditChange || 0).toFixed(2)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">
                                No transactions found for this period.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <div className="mt-8 pt-4 border-t-2 border-slate-600 flex justify-between items-center">
                <p className="text-xs text-slate-500">Generated on {new Date().toLocaleString()}</p>
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold">Current Status</p>
                    <p className="font-mono text-sm">
                        Progress: ${(customer.rewardsPoints || 0).toFixed(2)} | Credit: ${(customer.storeCredit || 0).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="no-print p-4 bg-slate-900/50 rounded-b-lg flex justify-end gap-4 border-t border-slate-700">
            <button onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md font-semibold transition-colors">Close</button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-semibold transition-colors">
                <PrintIcon className="w-5 h-5" />
                Print Report
            </button>
        </div>
      </div>
    </div>
  );
};

export default RewardHistoryReportModal;