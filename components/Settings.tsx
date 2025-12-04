
import React, { useState, useRef, useEffect } from 'react';
import { Vendor, StoreSettings } from '../types';
import { TrashIcon, PhotoIcon, CubeIcon, ClipboardListIcon, CheckCircleIcon, CloudArrowUpIcon, InformationCircleIcon } from './icons';
import { testConnection, syncLocalToCloud, saveCloudConfig, getCloudConfig } from '../services/db';
import { DEFAULT_SUPABASE_URL } from '../constants';

interface SettingsProps {
    vendors: Vendor[];
    onAddVendor: (vendor: Omit<Vendor, 'id'>) => void;
    onDeleteVendor: (vendorId: string) => void;
    employees: string[];
    onAddEmployee: (name: string) => void;
    onDeleteEmployee: (name: string) => void;
    storeSettings: StoreSettings;
    onUpdateStoreSettings: (settings: StoreSettings) => void;
    onCloudConnect: (url: string, key: string) => Promise<boolean>;
}

const CloudSetupSection: React.FC<{ onConnect: (url: string, key: string) => Promise<boolean> }> = ({ onConnect }) => {
    const [url, setUrl] = useState('');
    const [anonKey, setAnonKey] = useState('');
    const [isConfigured, setIsConfigured] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'error' | 'success' | 'info' } | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [persistenceStatus, setPersistenceStatus] = useState<string>('Checking...');
    const [isHardcoded, setIsHardcoded] = useState(false);

    useEffect(() => {
        const loadConfig = async () => {
            const c = await getCloudConfig();
            if (c) {
                setUrl(c.url || '');
                setAnonKey(c.anonKey || '');
                setIsConfigured(true);
            }
            
            // Check if using hardcoded values
            if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_URL.length > 10) {
                setIsHardcoded(true);
            }

            // Check persistence capability
            if (navigator.storage && navigator.storage.persist) {
                const isPersisted = await navigator.storage.persisted();
                setPersistenceStatus(isPersisted ? "Persistent (Safe)" : "Volatile (May clear on refresh)");
            } else {
                setPersistenceStatus("Unknown");
            }
        };
        loadConfig();
    }, []);

    const handleSave = async () => {
        setStatusMsg(null);
        const cleanUrl = url.trim();
        const cleanKey = anonKey.trim();

        if (!cleanUrl) {
            setStatusMsg({ text: "Error: Project URL is empty.", type: 'error' });
            return;
        }
        if (!cleanKey) {
            setStatusMsg({ text: "Error: Anon Key is empty.", type: 'error' });
            return;
        }

        setIsTesting(true);
        setStatusMsg({ text: "Saving and Connecting...", type: 'info' });

        try {
            const config = { url: cleanUrl, anonKey: cleanKey };
            await saveCloudConfig(config);
            const success = await onConnect(cleanUrl, cleanKey);
            
            if (success) {
                setIsConfigured(true);
                setStatusMsg({ text: "Connected successfully!", type: 'success' });
            } else {
                setStatusMsg({ text: "Connection failed during sync. Check URL/Key.", type: 'error' });
            }
        } catch (e: any) {
            setStatusMsg({ text: "Error: " + e.message, type: 'error' });
        } finally {
            setIsTesting(false);
        }
    };
    
    const handleTest = async () => {
        setStatusMsg(null);
        const cleanUrl = url.trim();
        const cleanKey = anonKey.trim();

        if (!cleanUrl) {
            setStatusMsg({ text: "Error: Please enter the Project URL.", type: 'error' });
            return;
        }
        if (!cleanKey) {
            setStatusMsg({ text: "Error: Please enter the Anon Key.", type: 'error' });
            return;
        }

        setIsTesting(true);
        setStatusMsg({ text: "Testing connection...", type: 'info' });
        
        const result = await testConnection(cleanUrl, cleanKey);
        
        setIsTesting(false);
        if (result.success) {
            setStatusMsg({ text: result.message || "Connection Successful! You can now save.", type: 'success' });
        } else {
            setStatusMsg({ text: result.message || "Connection Failed.", type: 'error' });
        }
    }

    const handleDisconnect = () => {
        if(window.confirm("Are you sure you want to disconnect? You will return to using browser storage.")) {
            localStorage.removeItem('supabaseConfig');
            sessionStorage.removeItem('supabaseConfig');
            // Attempt to clear cookie
            document.cookie = "supabaseConfig=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.reload();
        }
    };
    
    const handleSyncLocal = async () => {
        if (!window.confirm("This will take all data currently stored in your browser (IndexedDB) and upload it to Supabase. Proceed?")) return;
        
        setIsSyncing(true);
        setStatusMsg({ text: "Uploading data to Cloud... Do not close.", type: 'info' });
        
        try {
            const result = await syncLocalToCloud();
            setStatusMsg({ text: `Success! Uploaded ${result.customers} customers & ${result.orders} orders.`, type: 'success' });
            
            setTimeout(() => {
                 if(window.confirm("Upload complete! Reload app to view cloud data?")) {
                     window.location.reload();
                 }
            }, 1000);

        } catch (e: any) {
            console.error(e);
            setStatusMsg({ text: "Sync Error: " + e.message, type: 'error' });
        } finally {
            setIsSyncing(false);
        }
    };

    const setupSQL = `
-- 1. PASTE THIS INTO SUPABASE SQL EDITOR
-- 2. CLICK 'RUN'

create table if not exists customers (
  id text primary key,
  json jsonb not null
);

create table if not exists orders (
  id text primary key,
  json jsonb not null
);

create table if not exists settings (
  id text primary key,
  json jsonb not null
);

-- Allow the app to read/write data without a login
alter table customers enable row level security;
alter table orders enable row level security;
alter table settings enable row level security;

create policy "Public Access" on customers for all using (true);
create policy "Public Access" on orders for all using (true);
create policy "Public Access" on settings for all using (true);
    `.trim();

    const copySQL = () => {
        navigator.clipboard.writeText(setupSQL);
        setStatusMsg({ text: "SQL Code copied to clipboard!", type: 'success' });
        setTimeout(() => setStatusMsg(null), 3000);
    };

    if (isConfigured) {
         return (
            <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-lg shadow-lg shadow-green-900/10 animate-fade-in">
                 <div className="flex items-center gap-3 mb-4 text-green-400">
                    <div className="p-2 bg-green-900/50 rounded-full">
                        <CubeIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Cloud Connected (Supabase)</h3>
                        <p className="text-sm text-green-200/70">Your data is safe in the cloud.</p>
                    </div>
                </div>
                
                {isHardcoded && (
                    <div className="mb-4 flex items-center gap-2 p-2 bg-blue-900/30 border border-blue-700/50 rounded text-blue-200 text-xs font-bold">
                        <CheckCircleIcon className="w-4 h-4" /> Using Hardcoded Credentials (Permanent)
                    </div>
                )}
                
                <div className="mb-6 p-4 bg-slate-900/50 rounded border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <CloudArrowUpIcon className="w-4 h-4 text-cyan-400"/> Migrate Data
                    </h4>
                    <p className="text-xs text-slate-400 mb-3">
                        If you have data saved in this browser (from before you connected), click below to upload it to the cloud database.
                    </p>
                    <button 
                        onClick={handleSyncLocal}
                        disabled={isSyncing}
                        className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded font-bold transition-colors disabled:bg-slate-600"
                    >
                        {isSyncing ? 'Uploading...' : 'Upload Local Data to Cloud'}
                    </button>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-slate-700/50 pt-4">
                    {!isHardcoded && (
                    <button 
                        onClick={handleDisconnect}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 text-sm rounded font-bold transition-colors"
                    >
                        Disconnect & Return to Local Storage
                    </button>
                    )}
                    <button 
                        onClick={() => setIsConfigured(false)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded font-bold transition-colors ml-auto"
                    >
                        View Connection Details
                    </button>
                </div>
                
                 {statusMsg && (
                    <div className={`mt-4 w-full p-3 rounded-md border text-sm font-semibold text-center ${
                        statusMsg.type === 'error' ? 'bg-red-900/30 border-red-600 text-red-400' :
                        statusMsg.type === 'success' ? 'bg-green-900/30 border-green-600 text-green-400' :
                        'bg-slate-800 border-slate-600 text-slate-300'
                    }`}>
                        {statusMsg.text}
                    </div>
                )}
            </div>
         )
    }

    return (
        <div className="p-6 bg-slate-900/80 rounded-lg border border-cyan-500/30 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 mb-6 text-cyan-400 border-b border-slate-700 pb-4">
                <CubeIcon className="w-8 h-8" />
                <div>
                    <h3 className="text-xl font-bold">Setup Cloud Database</h3>
                    <p className="text-sm text-slate-400">Follow these steps to secure your data with Supabase.</p>
                </div>
            </div>
            
            {isHardcoded ? (
                <div className="mb-6 p-3 bg-blue-900/20 border border-blue-700/50 rounded-md flex gap-3 items-center">
                    <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="text-xs text-blue-200">
                        <strong>Hardcoded Credentials Found:</strong> The app is configured to connect automatically. 
                        Click "Connect & Sync" below to confirm.
                    </div>
                </div>
            ) : (
                <div className="mb-6 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-md flex gap-3 items-start">
                    <InformationCircleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300">
                        <p className="font-bold text-yellow-500 mb-1">Browser Storage Status: {persistenceStatus}</p>
                        <p>If this says "Volatile", you MUST paste your keys in the chat for me to hardcode them, or you will lose connection on refresh.</p>
                    </div>
                </div>
            )}
            
            <div className="space-y-8">
                 {!isHardcoded && (
                 <>
                 <div className="relative pl-8 border-l-2 border-slate-700">
                    <div className="absolute -left-[9px] top-0 bg-slate-900 text-slate-500 border border-slate-700 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">1</div>
                    <h4 className="text-sm font-bold text-white uppercase mb-2">Create Project</h4>
                    <p className="text-sm text-slate-400 mb-3">
                        Create a free account and new project at Supabase.
                    </p>
                    <a 
                        href="https://database.new" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded border border-slate-600 text-sm font-semibold transition-colors"
                    >
                        Open Supabase (database.new) ↗
                    </a>
                 </div>

                 <div className="relative pl-8 border-l-2 border-slate-700">
                    <div className="absolute -left-[9px] top-0 bg-slate-900 text-slate-500 border border-slate-700 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">2</div>
                    <h4 className="text-sm font-bold text-white uppercase mb-2">Connect App</h4>
                    <p className="text-sm text-slate-400 mb-3">
                        In Supabase, go to <strong>Project Settings (Cog Icon) &gt; API</strong>. Copy the values into the fields below.
                    </p>
                    <div className="grid grid-cols-1 gap-4 bg-slate-950/50 p-4 rounded border border-slate-800">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project URL</label>
                            <input
                                type="text"
                                placeholder="https://your-project.supabase.co"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Anon Public Key</label>
                            <input
                                type="password"
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                value={anonKey}
                                onChange={e => setAnonKey(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                            />
                        </div>
                    </div>
                 </div>
                 </>
                 )}

                 <div className="relative pl-8 border-l-2 border-slate-700">
                    <div className="absolute -left-[9px] top-0 bg-slate-900 text-slate-500 border border-slate-700 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">3</div>
                    <div className="flex justify-between items-end mb-2">
                         <h4 className="text-sm font-bold text-white uppercase">Initialize Database</h4>
                         <button onClick={copySQL} className="text-xs bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 px-2 py-1 rounded border border-cyan-700/50 flex items-center gap-1 transition-colors">
                            <ClipboardListIcon className="w-3 h-3" /> Copy SQL Code
                         </button>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">
                        In Supabase, go to <strong>SQL Editor</strong> (left sidebar), paste this code, and click <strong>Run</strong>.
                    </p>
                    <div className="relative">
                        <pre className="w-full h-24 bg-slate-950 border border-slate-800 rounded-md p-3 text-[10px] text-slate-500 font-mono overflow-auto select-all">
                            {setupSQL}
                        </pre>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-700 flex flex-col gap-3">
                    <div className="flex gap-3">
                        <button 
                            onClick={handleTest}
                            disabled={isTesting}
                            className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-md font-bold text-base transition-colors"
                        >
                            {isTesting ? 'Testing...' : 'Test Connection'}
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isTesting}
                            className="flex-[2] flex justify-center items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-bold text-base transition-colors shadow-lg shadow-cyan-900/20 disabled:bg-slate-600"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            {isTesting ? 'Connecting...' : 'Connect & Sync'}
                        </button>
                    </div>
                    
                    {statusMsg && (
                        <div className={`w-full p-3 rounded-md border text-sm font-semibold text-center ${
                            statusMsg.type === 'error' ? 'bg-red-900/30 border-red-600 text-red-400' :
                            statusMsg.type === 'success' ? 'bg-green-900/30 border-green-600 text-green-400' :
                            'bg-slate-800 border-slate-600 text-slate-300'
                        }`}>
                            {statusMsg.text}
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
}

const StoreInfoSection: React.FC<{
    settings: StoreSettings;
    onUpdate: (settings: StoreSettings) => void;
}> = ({ settings, onUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onUpdate({ ...settings, [name]: value });
    };

    const processLogo = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            onUpdate({ ...settings, logo: result });
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processLogo(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processLogo(file);
        }
    };

    const removeLogo = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdate({ ...settings, logo: '' });
    };

    return (
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Store Information</h3>
            <p className="text-sm text-slate-400 mb-4">This information will appear on your printed receipts.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                     <div>
                        <label htmlFor="storeName" className="text-sm font-medium text-slate-300">Store Name</label>
                        <input id="storeName" name="name" type="text" value={settings.name} onChange={handleChange} className="mt-1 w-full bg-slate-800 border-slate-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="phone" className="text-sm font-medium text-slate-300">Phone</label>
                            <input id="phone" name="phone" type="text" value={settings.phone} onChange={handleChange} className="mt-1 w-full bg-slate-800 border-slate-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                            <input id="email" name="email" type="text" value={settings.email} onChange={handleChange} className="mt-1 w-full bg-slate-800 border-slate-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address" className="text-sm font-medium text-slate-300">Address</label>
                        <input id="address" name="address" type="text" value={settings.address} onChange={handleChange} className="mt-1 w-full bg-slate-800 border-slate-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                    </div>
                     <div>
                        <label htmlFor="website" className="text-sm font-medium text-slate-300">Website</label>
                        <input id="website" name="website" type="text" value={settings.website} onChange={handleChange} className="mt-1 w-full bg-slate-800 border-slate-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                    </div>
                </div>

                {/* Logo Upload Section */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-300 mb-1">Store Logo</label>
                    <div 
                        className="border-2 border-dashed border-slate-600 rounded-lg h-40 flex flex-col items-center justify-center bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer relative overflow-hidden group"
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {settings.logo ? (
                            <>
                                <img src={settings.logo} alt="Logo Preview" className="h-full w-full object-contain p-2" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={removeLogo} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <PhotoIcon className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                                <p className="text-xs text-slate-400">Click to Upload</p>
                                <p className="text-[10px] text-slate-500 mt-1">or drag and drop</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const VendorsSection: React.FC<{
    vendors: Vendor[];
    onAdd: (v: Omit<Vendor, 'id'>) => void;
    onDelete: (id: string) => void;
}> = ({ vendors, onAdd, onDelete }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [salesRep, setSalesRep] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd({ name: name.trim(), phone: phone.trim(), salesRep: salesRep.trim() });
        setName('');
        setPhone('');
        setSalesRep('');
    };

    return (
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Vendor Management</h3>
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {vendors.map(v => (
                    <div key={v.id} className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700">
                        <div>
                            <p className="font-bold text-white">{v.name}</p>
                            {(v.phone || v.salesRep) && (
                                <p className="text-xs text-slate-400">
                                    {v.salesRep && <span className="mr-2">Rep: {v.salesRep}</span>}
                                    {v.phone && <span>Ph: {v.phone}</span>}
                                </p>
                            )}
                        </div>
                        <button onClick={() => onDelete(v.id)} className="text-slate-400 hover:text-red-400">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                {vendors.length === 0 && <p className="text-slate-500 italic text-sm">No vendors added.</p>}
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
                <input 
                    placeholder="Vendor Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" 
                    required
                />
                <input 
                    placeholder="Phone (Optional)" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" 
                />
                 <input 
                    placeholder="Sales Rep (Optional)" 
                    value={salesRep} 
                    onChange={e => setSalesRep(e.target.value)} 
                    className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" 
                />
                <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white rounded px-3 py-2 text-sm font-bold transition-colors">
                    Add Vendor
                </button>
            </form>
        </div>
    );
}

const EmployeesSection: React.FC<{
    employees: string[];
    onAdd: (name: string) => void;
    onDelete: (name: string) => void;
}> = ({ employees, onAdd, onDelete }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd(name.trim());
        setName('');
    };

    return (
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
             <h3 className="text-lg font-semibold text-cyan-400 mb-4">Employee Directory</h3>
             <div className="flex flex-wrap gap-2 mb-4 min-h-[3rem]">
                {employees.map(e => (
                    <div key={e} className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                        <span className="text-sm text-white">{e}</span>
                        <button onClick={() => onDelete(e)} className="text-slate-400 hover:text-red-400">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {employees.length === 0 && <p className="text-slate-500 italic text-sm self-center">No employees added.</p>}
             </div>
             <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                    placeholder="Employee Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="flex-grow bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none" 
                    required
                />
                <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white rounded px-4 py-2 text-sm font-bold transition-colors">
                    Add
                </button>
            </form>
        </div>
    )
}

const Settings: React.FC<SettingsProps> = ({
    vendors, onAddVendor, onDeleteVendor,
    employees, onAddEmployee, onDeleteEmployee,
    storeSettings, onUpdateStoreSettings,
    onCloudConnect
}) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
            
            <CloudSetupSection onConnect={onCloudConnect} />
            
            <StoreInfoSection settings={storeSettings} onUpdate={onUpdateStoreSettings} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VendorsSection vendors={vendors} onAdd={onAddVendor} onDelete={onDeleteVendor} />
                <EmployeesSection employees={employees} onAdd={onAddEmployee} onDelete={onDeleteEmployee} />
            </div>
        </div>
    );
};

export default Settings;
