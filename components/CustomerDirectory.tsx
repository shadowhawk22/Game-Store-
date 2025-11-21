import React, { useState, useMemo } from 'react';
import { Customer, Order, Vendor, OrderItem as OrderItemData, RewardCategory, StoreSettings } from '../types';
import OrderItem from './OrderItem';
import RewardsModal from './RewardsModal';
import EditCustomerModal from './EditCustomerModal';
import { UserGroupIcon, SearchIcon, XIcon, TrashIcon, ReceiptIcon, UserPlusIcon, PlusCircleIcon, ArrowLeftIcon, StarIcon, GiftIcon, PencilIcon, EnvelopeIcon } from './icons';

interface CustomerDirectoryProps {
    customers: Customer[];
    orders: Order[];
    onDeleteOrder: (orderId: string) => void;
    onShowReceipt: (order: Order) => void;
    onAddNewCustomerClick: () => void;
    selectedCustomerId: string | null;
    onSelectCustomer: (id: string | null) => void;
    onStartNewOrderForCustomer: () => void;
    onUpdateItem: (orderId: string, item: OrderItemData) => Promise<void>;
    onUpdateCustomerRewards: (customer: Customer, spendBreakdown: Partial<Record<RewardCategory, number>>, redeemCredit: number) => Promise<void>;
    onUpdateCustomer: (customer: Customer) => Promise<Customer>;
    vendors: Vendor[];
    employees: string[];
    storeSettings: StoreSettings;
}

const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({
    customers,
    orders,
    onDeleteOrder,
    onShowReceipt,
    onAddNewCustomerClick,
    selectedCustomerId,
    onSelectCustomer,
    onStartNewOrderForCustomer,
    onUpdateItem,
    onUpdateCustomerRewards,
    onUpdateCustomer,
    vendors,
    employees,
    storeSettings,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
    const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);

    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;
        const lowercasedFilter = searchTerm.toLowerCase();
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(lowercasedFilter) ||
            customer.contact.toLowerCase().includes(lowercasedFilter) ||
            customer.email?.toLowerCase().includes(lowercasedFilter)
        );
    }, [customers, searchTerm]);
    
    const selectedCustomer = useMemo(() => {
        if (!selectedCustomerId) return null;
        return customers.find(c => c.id === selectedCustomerId) || null;
    }, [customers, selectedCustomerId]);

    const customerOrders = useMemo(() => {
        if (!selectedCustomer) return [];
        return orders
            .filter(order => order.customerId === selectedCustomer.id)
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }, [orders, selectedCustomer]);

    const handleEmailCustomer = () => {
        if (!selectedCustomer?.email) return;
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedCustomer.email)}`;
        window.open(gmailLink, '_blank');
    };

    if (selectedCustomer) {
        return (
             <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 animate-fade-in max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                         <button 
                            onClick={() => onSelectCustomer(null)}
                            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-3"
                        >
                           <ArrowLeftIcon className="w-4 h-4" /> Back to Directory
                        </button>
                        <div className="flex flex-wrap items-baseline gap-3 mb-1">
                             <h3 className="text-2xl font-bold text-white">{selectedCustomer.name}</h3>
                             <button 
                                onClick={() => setIsEditCustomerModalOpen(true)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                                title="Edit Customer Details"
                             >
                                 <PencilIcon className="w-4 h-4" />
                             </button>
                             {(selectedCustomer.storeCredit > 0) && (
                                <div className="bg-green-900/30 border border-green-700/50 text-green-400 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                    <GiftIcon className="w-3 h-3" />
                                    Credit: ${selectedCustomer.storeCredit.toFixed(2)}
                                </div>
                             )}
                        </div>
                        <div className="text-sm text-slate-400 space-y-0.5">
                            {selectedCustomer.email && <p>{selectedCustomer.email}</p>}
                            {selectedCustomer.contact && <p>{selectedCustomer.contact}</p>}
                        </div>
                    </div>
                    <div className="flex gap-2 flex-col sm:flex-row w-full md:w-auto">
                        {selectedCustomer.email && (
                            <button 
                                onClick={handleEmailCustomer}
                                className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                            >
                               <EnvelopeIcon className="w-5 h-5 text-slate-300"/> Email
                            </button>
                        )}
                        <button 
                            onClick={() => setIsRewardsModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                        >
                           <StarIcon className="w-5 h-5 text-yellow-400"/> Rewards
                        </button>
                        <button 
                            onClick={onStartNewOrderForCustomer}
                            className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
                        >
                           <PlusCircleIcon className="w-5 h-5"/> New Pre-order
                        </button>
                    </div>
                </div>
                
                {/* Rewards Status Bar */}
                <div className="bg-slate-900/50 rounded-lg p-3 mb-6 flex items-center gap-4 border border-slate-700">
                    <div className="bg-yellow-500/20 p-2 rounded-full">
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Current Spend Progress</span>
                            <span>${(selectedCustomer.rewardsPoints || 0).toFixed(2)} / $100.00</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                             <div className="h-full bg-yellow-400" style={{ width: `${Math.min(100, ((selectedCustomer.rewardsPoints || 0) / 100) * 100)}%` }} />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-cyan-400 border-b border-slate-700 pb-2 mb-4">
                        Customer History ({customerOrders.length} Orders)
                    </h4>
                     <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                        {customerOrders.length > 0 ? (
                            customerOrders.map(order => (
                                <div key={order.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-700 pb-3 mb-3">
                                        <div>
                                            <p className="font-semibold text-base text-white">Order from {new Date(order.orderDate).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-400 font-mono">ID: {order.id.substring(0,8)}</p>
                                        </div>
                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <button onClick={() => onShowReceipt(order)} className="p-2 text-slate-300 hover:text-cyan-400 transition-colors" title="View Receipt">
                                                <ReceiptIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => onDeleteOrder(order.id)} className="p-2 text-slate-300 hover:text-red-400 transition-colors" title="Delete Order">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {order.items.map(item => (
                                            <OrderItem
                                                key={item.id}
                                                orderId={order.id}
                                                item={item}
                                                orderDate={order.orderDate}
                                                onUpdateItem={onUpdateItem}
                                                vendors={vendors}
                                                employees={employees}
                                                customer={selectedCustomer}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <p>This customer has no pre-orders.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {isRewardsModalOpen && (
                    <RewardsModal
                        customer={selectedCustomer}
                        onClose={() => setIsRewardsModalOpen(false)}
                        onUpdatePoints={onUpdateCustomerRewards}
                        storeSettings={storeSettings}
                    />
                )}
                
                {isEditCustomerModalOpen && (
                    <EditCustomerModal
                        customer={selectedCustomer}
                        onClose={() => setIsEditCustomerModalOpen(false)}
                        onUpdateCustomer={onUpdateCustomer}
                    />
                )}
            </div>
        )
    }

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-3">
                    <UserGroupIcon className="w-8 h-8 text-cyan-400"/>
                    <h2 className="text-2xl font-bold text-white">Customer Directory</h2>
                </div>
                <button 
                    onClick={onAddNewCustomerClick}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    <UserPlusIcon className="w-5 h-5" />
                    Add New Customer
                </button>
            </div>
            <div className="relative mb-4">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name, email, or contact..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="block w-full bg-slate-900 border border-slate-600 rounded-md py-2 pl-10 pr-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map(customer => (
                        <button
                            key={customer.id}
                            onClick={() => onSelectCustomer(customer.id)}
                            className="w-full flex justify-between items-center p-3 rounded-md bg-slate-900/50 hover:bg-slate-700/80 transition-colors text-left group"
                        >
                            <div>
                                <p className="font-semibold text-slate-200">{customer.name}</p>
                                <p className="text-sm text-slate-400">{customer.email || customer.contact}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {customer.storeCredit > 0 && (
                                    <div className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                                        <GiftIcon className="w-3 h-3"/> ${customer.storeCredit.toFixed(0)}
                                    </div>
                                )}
                                {customer.rewardsPoints > 0 && (
                                    <div className="text-yellow-600/70 text-xs font-medium flex items-center gap-1">
                                        <StarIcon className="w-3 h-3"/> {Math.floor(customer.rewardsPoints)}/100
                                    </div>
                                )}
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-4 text-slate-400">
                        <p>No customers found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDirectory;