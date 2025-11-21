import React, { useState, useMemo } from 'react';
import { Customer, RewardCategory, StoreSettings, RewardTransaction } from '../types';
import { REWARD_CATEGORIES } from '../constants';
import { XIcon, StarIcon, GiftIcon, CheckCircleIcon, CalendarDaysIcon, ReceiptIcon, PrintIcon } from './icons';
import RewardReceiptModal from './RewardReceiptModal';
import RewardHistoryReportModal from './RewardHistoryReportModal';

interface RewardsModalProps {
  customer: Customer;
  storeSettings: StoreSettings;
  onClose: () => void;
  onUpdatePoints: (customer: Customer, spendBreakdown: Partial<Record<RewardCategory, number>>, redeemCredit: number) => Promise<void>;
}

const RewardsModal: React.FC<RewardsModalProps> = ({ customer, storeSettings, onClose, onUpdatePoints }) => {
  const [spendBreakdown, setSpendBreakdown] = useState<Partial<Record<RewardCategory, number>>>({});
  const [redeemAmount, setRedeemAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [receiptTx, setReceiptTx] = useState<RewardTransaction | null>(null);
  
  // Report / Filtering State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const currentProgress = customer.rewardsPoints || 0;
  const currentCredit = customer.storeCredit || 0;
  const progressPercentage = Math.min(100, (currentProgress / 100) * 100);

  const handleBreakdownChange = (category: RewardCategory, value: string) => {
      setSpendBreakdown(prev => ({
          ...prev,
          [category]: value === '' ? 0 : parseFloat(value)
      }));
  };

  const totalSpend: number = (Object.values(spendBreakdown) as number[]).reduce((sum, val) => sum + (val || 0), 0);

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const redeemVal = parseFloat(redeemAmount) || 0;

    if (totalSpend <= 0 && redeemVal <= 0) {
        alert("Please enter a spend amount in at least one category or a credit redemption amount.");
        return;
    }
    
    if (redeemVal > currentCredit) {
        alert("Cannot redeem more credit than available balance.");
        return;
    }

    setIsSubmitting(true);
    try {
        // Calculate expected credit gain for feedback
        const projectedProgress = currentProgress + totalSpend;
        const gainedCredits = Math.floor(projectedProgress / 100) * 15;

        await onUpdatePoints(customer, spendBreakdown, redeemVal);
        
        // Reset form
        setSpendBreakdown({});
        setRedeemAmount('');
        
        if (gainedCredits > 0) {
            setSuccessMessage(`Success! Customer earned $${gainedCredits} in new Store Credit!`);
        } else {
            setSuccessMessage("Transaction recorded successfully.");
        }

        setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error) {
        console.error(error);
        alert("Failed to update rewards.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
      let history = customer.rewardsHistory || [];
      
      if (startDate) {
          // Parse YYYY-MM-DD manually to create date in Local Time, not UTC
          const [y, m, d] = startDate.split('-').map(Number);
          const start = new Date(y, m - 1, d);
          start.setHours(0, 0, 0, 0);
          history = history.filter(tx => new Date(tx.date) >= start);
      }
      
      if (endDate) {
          // Parse YYYY-MM-DD manually to create date in Local Time
          // Set to end of day to include transactions from that day
          const [y, m, d] = endDate.split('-').map(Number);
          const end = new Date(y, m - 1, d);
          end.setHours(23, 59, 59, 999);
          history = history.filter(tx => new Date(tx.date) <= end);
      }
      
      return history;
  }, [customer.rewardsHistory, startDate, endDate]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="relative bg-slate-800 max-w-2xl w-full rounded-lg shadow-2xl border border-slate-700 text-slate-200 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <StarIcon className="w-6 h-6 text-yellow-400" />
                Rewards Program
              </h2>
              <p className="text-sm text-slate-400">{customer.name}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Credit Card */}
              <div className="bg-gradient-to-r from-green-900/50 to-slate-900/50 rounded-lg p-4 border border-green-700/30 flex items-center justify-between">
                  <div>
                      <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">Available Credit</p>
                      <p className="text-3xl font-bold text-white">${currentCredit.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-full">
                      <GiftIcon className="w-6 h-6 text-green-400" />
                  </div>
              </div>
              
              {/* Progress Card */}
               <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress to Reward</span>
                      <span className="text-white font-medium">${currentProgress.toFixed(2)} / $100</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 text-right">
                      Earn $15 credit for every $100 spent.
                  </p>
              </div>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded text-green-400 text-sm font-bold text-center animate-fade-in flex items-center justify-center gap-2">
                <CheckCircleIcon className="w-4 h-4"/> {successMessage}
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto px-6 pb-6 space-y-6">
            
            {/* Transaction Form */}
            <form onSubmit={handleTransaction} className="space-y-4 bg-slate-900/30 p-4 rounded-lg border border-slate-700">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-700 pb-2">Record New Transaction</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {REWARD_CATEGORIES.map(category => (
                        <div key={category}>
                             <label className="block text-[10px] font-medium text-slate-400 mb-1 uppercase truncate" title={category}>
                                {category}
                             </label>
                             <input 
                                type="number" 
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={spendBreakdown[category] || ''}
                                onChange={(e) => handleBreakdownChange(category, e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded py-1.5 px-2 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                             />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 mt-2">
                     <div className="text-sm">
                        <span className="text-slate-400">Total Spend:</span> <span className="text-white font-bold">${totalSpend.toFixed(2)}</span>
                     </div>
                </div>

                <div className="bg-slate-800/50 p-3 rounded border border-slate-700 mt-2">
                     <label className="block text-xs font-medium text-slate-300 mb-1">
                        Redeem Store Credit ($)
                     </label>
                     <div className="flex gap-2">
                        <input 
                            type="number" 
                            step="0.01"
                            value={redeemAmount} 
                            onChange={e => setRedeemAmount(e.target.value)} 
                            min="0"
                            max={currentCredit}
                            placeholder="0.00"
                            disabled={currentCredit === 0}
                            className="flex-grow bg-slate-900 border border-slate-600 rounded py-1.5 px-2 text-white text-sm disabled:opacity-50"
                        />
                         <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold text-sm transition-colors disabled:bg-slate-600"
                        >
                            {isSubmitting ? '...' : 'Submit'}
                        </button>
                     </div>
                </div>
            </form>

            {/* Transaction History & Filters */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3 mb-3 border-b border-slate-700 pb-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Transaction History</h3>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 uppercase">From</span>
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={e => setStartDate(e.target.value)}
                                className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white w-28"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 uppercase">To</span>
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={e => setEndDate(e.target.value)}
                                className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white w-28"
                            />
                        </div>
                        <button 
                            onClick={() => setShowReportModal(true)}
                            className="ml-auto sm:ml-2 p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-600 transition-colors"
                            title="Print History Report"
                        >
                            <PrintIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(tx => (
                            <div key={tx.id} className="bg-slate-800/50 p-3 rounded border border-slate-700 flex justify-between items-start text-sm">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-300 mb-1">
                                        <CalendarDaysIcon className="w-3 h-3" />
                                        <span className="text-xs">{new Date(tx.date).toLocaleString()}</span>
                                    </div>
                                    <p className="font-medium text-white">{tx.description}</p>
                                    {tx.breakdown && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {Object.entries(tx.breakdown).map(([cat, amt]) => (
                                                <span key={cat} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600">
                                                    {cat}: ${(amt as number).toFixed(2)}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        {tx.type === 'EARN' ? (
                                            <span className="text-yellow-500 font-bold">+{tx.amount.toFixed(2)} pts</span>
                                        ) : (
                                            <span className="text-green-400 font-bold">-${tx.amount.toFixed(2)} Credit</span>
                                        )}
                                        {tx.creditChange !== undefined && tx.creditChange !== 0 && (
                                            <div className={`text-xs font-bold mt-0.5 ${(tx.creditChange as number) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {(tx.creditChange as number) > 0 ? '+' : ''}{(tx.creditChange as number).toFixed(2)} Credit
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => setReceiptTx(tx)} className="text-slate-400 hover:text-cyan-400 p-1 bg-slate-900/50 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors" title="Print Receipt">
                                        <ReceiptIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 text-center py-4 text-sm italic">No transactions found.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
      
      {/* Single Receipt Modal */}
      {receiptTx && (
          <RewardReceiptModal
            transaction={receiptTx}
            customer={customer}
            storeSettings={storeSettings}
            onClose={() => setReceiptTx(null)}
          />
      )}

      {/* History Report Modal */}
      {showReportModal && (
          <RewardHistoryReportModal
            transactions={filteredTransactions}
            customer={customer}
            storeSettings={storeSettings}
            dateRange={{ start: startDate, end: endDate }}
            onClose={() => setShowReportModal(false)}
          />
      )}
    </div>
  );
};

export default RewardsModal;