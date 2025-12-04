
import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, Customer, OrderItem, Vendor, StoreSettings, RewardCategory, RewardTransaction, Employee } from './types';
import Header from './components/Header';
import PreOrderForm from './components/PreOrderForm';
import ReceiptModal from './components/ReceiptModal';
import CustomerDirectory from './components/CustomerDirectory';
import ItemDetailModal from './components/ItemDetailModal';
import AddNewCustomerModal from './components/AddNewCustomerModal';
import Settings from './components/Settings';
import Backup from './components/Backup';
import InstallGuideModal from './components/InstallGuideModal';
import * as db from './services/db';
import { ClipboardListIcon, UserGroupIcon, Cog6ToothIcon, ArchiveBoxIcon } from './components/icons';
import OrderList from './components/OrderList';

// --- Global Install Prompt Capture ---
// We capture this outside the component lifecycle to ensure we don't miss the event
// if it fires before React finishes mounting.
let deferredInstallPrompt: any = null;

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredInstallPrompt = e;
        console.log("Global install prompt captured");
    });
}

type ViewMode = 'tabs' | 'new_order';
type ActiveTab = 'customers' | 'orders' | 'settings' | 'backup';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isAddNewCustomerModalOpen, setIsAddNewCustomerModalOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  
  // Initialization state
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>('tabs');
  const [activeTab, setActiveTab] = useState<ActiveTab>('customers');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({ 
      name: 'Game Store', address: '', phone: '', email: '', website: '', logo: '' 
  });

  const [storageStatus, setStorageStatus] = useState<'connecting'|'connected'|'error'>('connecting');
  const [storageLabel, setStorageLabel] = useState('');
  
  // Request persistence
  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(persistent => {
            console.log(persistent ? "Storage is persistent" : "Storage is not persistent");
        });
    }
  }, []);

  // Load all data
  const loadData = useCallback(async () => {
      setIsLoading(true);
      setDbError(null);
      setStorageStatus('connecting');
      
      try {
        // 1. Check for Cloud Configuration (Supabase)
        let cloudAttempted = false;
        let cloudSuccess = false;
        
        // If already using cloud (hot reload case), skip re-init
        if (!db.isUsingCloud()) {
             // Try to get config from ANY available storage (LS, SS, or IDB)
             const config = await db.getCloudConfig();
             if (config) {
                cloudAttempted = true;
                cloudSuccess = db.initCloudDB(config);
            }
        } else {
            cloudAttempted = true;
            cloudSuccess = true;
        }

        // 2. Load Data
        const [
            loadedOrders, 
            loadedCustomers, 
            loadedVendors, 
            loadedEmployees, 
            loadedSettings
        ] = await Promise.all([
          db.getAllOrders(),
          db.getAllCustomers(),
          db.getVendors(),
          db.getEmployees(),
          db.getStoreSettings()
        ]);
        
        setOrders(loadedOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
        
        // Customers + Migration for Rewards
        const customersWithRewards = loadedCustomers.map(c => ({
            ...c,
            rewardsPoints: c.rewardsPoints ?? 0,
            storeCredit: c.storeCredit ?? 0,
            rewardsHistory: c.rewardsHistory || []
        }));
        setCustomers(customersWithRewards.sort((a, b) => a.name.localeCompare(b.name)));

        setVendors(loadedVendors || []);
        
        // Employees + Migration
        let finalEmployees: Employee[] = [];
        if (loadedEmployees) {
             if (loadedEmployees.length > 0 && typeof loadedEmployees[0] === 'string') {
                 finalEmployees = (loadedEmployees as unknown as string[]).map(name => ({ 
                     id: db.generateId(), 
                     name: name 
                 }));
             } else {
                 finalEmployees = loadedEmployees as unknown as Employee[];
             }
        }
        setEmployees(finalEmployees);

        setStoreSettings(loadedSettings || { name: 'Game Store', address: '', phone: '', email: '', website: '', logo: '' });

        setIsInitialized(true);
        setStorageStatus('connected');
        
        // Force label update based on actual mode
        const currentMode = db.getStorageMode();
        if (cloudAttempted && !cloudSuccess) {
             setStorageLabel("Cloud Failed (Using Local)");
        } else {
             setStorageLabel(currentMode);
        }

      } catch (error) {
        console.error("Data Load Error", error);
        setDbError("Failed to load data. Security settings might be blocking storage.");
        setStorageStatus('error');
      } finally {
        setIsLoading(false);
      }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Hot-Connect Handler (No Reload)
  const handleCloudConnect = async (url: string, key: string): Promise<boolean> => {
      const success = db.initCloudDB({ url, anonKey: key });
      if (success) {
          setStorageLabel("Cloud (Supabase)");
          await loadData(); // Reload data from the new source immediately
          return true;
      }
      return false;
  };

  // State Sync (Cloud or Local)
  useEffect(() => { if (isInitialized) db.saveVendors(vendors); }, [vendors, isInitialized]);
  useEffect(() => { if (isInitialized) db.saveEmployees(employees); }, [employees, isInitialized]);
  useEffect(() => { if (isInitialized) db.saveStoreSettings(storeSettings); }, [storeSettings, isInitialized]);

  const handleAddCustomer = useCallback(async (customerData: { name: string; contact: string; email: string; }): Promise<Customer> => {
    const newCustomer: Customer = {
      id: db.generateId(),
      name: customerData.name.trim(),
      contact: customerData.contact.trim(),
      email: customerData.email.trim(),
      rewardsPoints: 0,
      storeCredit: 0,
      rewardsHistory: [],
    };
    await db.addCustomer(newCustomer);
    setCustomers(prev => [...prev, newCustomer].sort((a, b) => a.name.localeCompare(b.name)));
    return newCustomer;
  }, []);

  const handleUpdateCustomer = useCallback(async (customer: Customer): Promise<Customer> => {
    await db.updateCustomer(customer);
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    return customer;
  }, []);
  
  const handleUpdateCustomerRewards = useCallback(async (
      customer: Customer, 
      spendBreakdown: Partial<Record<RewardCategory, number>>,
      redeemCreditAmount: number
  ) => {
    const spendAmount = Object.values(spendBreakdown).reduce((sum, val) => sum + (val || 0), 0);
    
    let newProgress = (customer.rewardsPoints || 0) + spendAmount;
    let newCredit = (customer.storeCredit || 0) - redeemCreditAmount;
    let earnedCredit = 0;
    
    while (newProgress >= 100) {
        newProgress -= 100;
        newCredit += 15;
        earnedCredit += 15;
    }

    const newTransaction: RewardTransaction = {
        id: db.generateId(),
        date: new Date().toISOString(),
        type: spendAmount > 0 ? 'EARN' : 'REDEEM',
        amount: spendAmount > 0 ? spendAmount : redeemCreditAmount,
        creditChange: (earnedCredit - redeemCreditAmount),
        breakdown: spendAmount > 0 ? spendBreakdown : undefined,
        description: spendAmount > 0 
            ? `Spent $${spendAmount.toFixed(2)}` 
            : `Redeemed $${redeemCreditAmount.toFixed(2)} Credit`
    };

    const updatedCustomer = { 
        ...customer, 
        rewardsPoints: Math.max(0, newProgress), 
        storeCredit: Math.max(0, newCredit),
        rewardsHistory: [newTransaction, ...(customer.rewardsHistory || [])]
    };
    
    await db.updateCustomer(updatedCustomer);
    setCustomers(prev => prev.map(c => c.id === customer.id ? updatedCustomer : c));
  }, []);


  const handleAddOrder = useCallback(async (
    orderData: { items: Omit<OrderItem, 'id' | 'status'>[], depositPaid?: number },
    customer: Customer
  ): Promise<Order> => {
    const newOrder: Order = {
      id: db.generateId(),
      orderDate: new Date().toISOString(),
      customerId: customer.id,
      depositPaid: orderData.items.length > 0 && orderData.depositPaid ? orderData.depositPaid : 0,
      items: orderData.items.map(item => ({
        ...item,
        id: db.generateId(),
        status: OrderStatus.PREORDERED,
        tracking: item.tracking || {},
      })),
    };

    await db.addOrder(newOrder);
    setOrders(prev => [newOrder, ...prev].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
    setViewMode('tabs');
    return newOrder;
  }, []);

  const handleDeleteOrder = useCallback(async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await db.deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  }, []);

  const handleUpdateOrderItem = useCallback(async (orderId: string, updatedItem: OrderItem) => {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    const updatedOrder = { ...orders[orderIndex] };
    updatedOrder.items = updatedOrder.items.map(item => item.id === updatedItem.id ? updatedItem : item);
    await db.updateOrder(updatedOrder);
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
  }, [orders]);

  const handleShowReceipt = (order: Order) => {
    setSelectedOrderForReceipt(order);
    setIsReceiptModalOpen(true);
  };

  const handleStartNewOrderForCustomer = () => {
      setViewMode('new_order');
  };
  
  const handleExportData = async () => {
      try {
          const exportData = {
              customers, orders, vendors, employees, storeSettings,
              exportDate: new Date().toISOString(),
              version: 2.0
          };
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gamestore_backup_${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      } catch (e) { alert("Export failed"); }
  };

  const handleImportData = async (file: File) => {
      if (!window.confirm("WARNING: This will overwrite your current data. Continue?")) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
          try {
              const data = JSON.parse(e.target?.result as string);
              setIsLoading(true);
              await db.clearAllData();
              for (const c of data.customers || []) await db.addCustomer(c);
              for (const o of data.orders || []) await db.addOrder(o);
              if (data.vendors) await db.saveVendors(data.vendors);
              if (data.employees) await db.saveEmployees(data.employees);
              if (data.storeSettings) await db.saveStoreSettings(data.storeSettings);
              await loadData();
              alert("Data restored successfully!");
          } catch (error) { alert("Import failed."); setIsLoading(false); }
      };
      reader.readAsText(file);
  };
  
  const handleAddEmployee = (name: string) => {
      setEmployees(prev => [...prev, { id: db.generateId(), name }]);
  };
  
  const handleDeleteEmployee = (name: string) => {
      setEmployees(prev => prev.filter(e => e.name !== name));
  };
  
  const employeeNames = employees.map(e => e.name);

  const handleHardReset = () => {
      if(window.confirm("This will disconnect Supabase and clear all local settings. Are you sure?")) {
          localStorage.clear();
          sessionStorage.clear();
          // Also try to clear persisted config in IDB
          db.saveStoreSettings({ name: 'Game Store', address: '', phone: '', email: '', website: '', logo: '' }); // Reset partial
          window.location.reload();
      }
  };

  const handleHeaderBadgeClick = () => {
      setActiveTab('settings');
  };

  const handleInstallClick = async () => {
      // Use the global variable captured early
      const promptEvent = deferredInstallPrompt;
      
      if (promptEvent) {
          promptEvent.prompt();
          const { outcome } = await promptEvent.userChoice;
          if (outcome === 'accepted') {
              deferredInstallPrompt = null;
          }
      } else {
          // If prompt isn't available (common in dev or if already installed), show instructions
          setIsInstallGuideOpen(true);
      }
  };

  if (isLoading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <h2 className="text-xl text-white font-semibold">Loading Game Store System...</h2>
                <p className="text-slate-400 mt-2">Connecting to {storageLabel || 'database'}...</p>
            </div>
        </div>
      );
  }
  
  if (dbError) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-lg max-w-lg text-center">
                <h2 className="text-2xl text-red-400 font-bold mb-4">Database Error</h2>
                <p className="text-slate-300 mb-6">{dbError}</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded transition-colors"
                    >
                        Reload Application
                    </button>
                     <button 
                        onClick={handleHardReset}
                        className="text-red-400 hover:text-red-300 underline text-sm"
                    >
                        Reset Configuration (Disconnect Cloud)
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Custom Header that shows the specific storage mode (Cloud vs Local) */}
      <div className="relative">
        <Header 
            dbStatus={storageStatus} 
            storageLabel={storageLabel} 
            onBadgeClick={handleHeaderBadgeClick}
            storeName={storeSettings.name}
            onInstallClick={handleInstallClick}
        />
      </div>
      
      <main className="p-4 sm:p-6 lg:p-8">
        {viewMode === 'new_order' && selectedCustomerId ? (
          <PreOrderForm
            customer={customers.find(c => c.id === selectedCustomerId)!}
            onAddOrder={handleAddOrder}
            onShowReceipt={handleShowReceipt}
            onCancel={() => setViewMode('tabs')}
            vendors={vendors}
          />
        ) : (
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-1">
                    <button onClick={() => setActiveTab('customers')} className={`px-4 py-2 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'customers' ? 'bg-slate-800 text-cyan-400 border-t border-x border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                        <UserGroupIcon className="w-5 h-5"/> Directory
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'orders' ? 'bg-slate-800 text-cyan-400 border-t border-x border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                        <ClipboardListIcon className="w-5 h-5"/> All Orders
                    </button>
                    <button onClick={() => setActiveTab('backup')} className={`px-4 py-2 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'backup' ? 'bg-slate-800 text-cyan-400 border-t border-x border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                        <ArchiveBoxIcon className="w-5 h-5"/> Data & Backup
                    </button>
                    
                    <div className="ml-auto flex gap-2">
                         <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'bg-slate-800 text-cyan-400 border-t border-x border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                            <Cog6ToothIcon className="w-5 h-5"/> Settings
                        </button>
                    </div>
                </div>

                <div className="animate-fade-in">
                    {activeTab === 'customers' && (
                        <CustomerDirectory
                            customers={customers}
                            orders={orders}
                            onDeleteOrder={handleDeleteOrder}
                            onShowReceipt={handleShowReceipt}
                            onAddNewCustomerClick={() => setIsAddNewCustomerModalOpen(true)}
                            selectedCustomerId={selectedCustomerId}
                            onSelectCustomer={setSelectedCustomerId}
                            onStartNewOrderForCustomer={handleStartNewOrderForCustomer}
                            onUpdateItem={handleUpdateOrderItem}
                            onUpdateCustomerRewards={handleUpdateCustomerRewards}
                            onUpdateCustomer={handleUpdateCustomer}
                            vendors={vendors}
                            employees={employeeNames}
                            storeSettings={storeSettings}
                        />
                    )}

                    {activeTab === 'orders' && (
                         <OrderList
                            orders={orders}
                            customers={customers}
                            onDeleteOrder={handleDeleteOrder}
                            onShowReceipt={handleShowReceipt}
                            onUpdateItem={handleUpdateOrderItem}
                            vendors={vendors}
                            employees={employeeNames}
                         />
                    )}

                    {activeTab === 'backup' && (
                        <Backup
                            onExportData={handleExportData}
                            onImportData={handleImportData}
                        />
                    )}
                    
                    {activeTab === 'settings' && (
                        <Settings 
                            vendors={vendors}
                            onAddVendor={async (v) => {
                                const newVendors = [...vendors, { ...v, id: db.generateId() }];
                                setVendors(newVendors);
                            }}
                            onDeleteVendor={async (id) => {
                                setVendors(prev => prev.filter(v => v.id !== id));
                            }}
                            employees={employeeNames}
                            onAddEmployee={handleAddEmployee}
                            onDeleteEmployee={handleDeleteEmployee}
                            storeSettings={storeSettings}
                            onUpdateStoreSettings={setStoreSettings}
                            onCloudConnect={handleCloudConnect}
                        />
                    )}
                </div>
            </div>
        )}

        {/* Modals */}
        {isReceiptModalOpen && selectedOrderForReceipt && (
          <ReceiptModal
            order={selectedOrderForReceipt}
            customer={customers.find(c => c.id === selectedOrderForReceipt.customerId) || null}
            storeSettings={storeSettings}
            onClose={() => {
              setIsReceiptModalOpen(false);
              setSelectedOrderForReceipt(null);
            }}
          />
        )}
        
        {isAddNewCustomerModalOpen && (
            <AddNewCustomerModal
                onClose={() => setIsAddNewCustomerModalOpen(false)}
                onAddCustomer={handleAddCustomer}
            />
        )}

        {isInstallGuideOpen && (
            <InstallGuideModal onClose={() => setIsInstallGuideOpen(false)} />
        )}

      </main>
    </div>
  );
};

export default App;
