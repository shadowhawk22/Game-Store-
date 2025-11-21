import { Order, Customer, Vendor, StoreSettings, Employee, SupabaseConfig } from '../types';
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY } from '../constants';

/* 
 * --- DATA LAYER ABSTRACTION ---
 * Supports: Local IndexedDB, LocalStorage Fallback, and Supabase Cloud (via REST API)
 */

const DB_NAME = 'PreOrderDB';
const DB_VERSION = 3;
const CUSTOMERS_STORE = 'customers';
const ORDERS_STORE = 'orders';
const DATA_STORE = 'app_data';

// --- Supabase State (Lightweight Fetch Mode) ---
let supabaseConfig: SupabaseConfig | null = null;
let isCloudEnabled = false;

export const initCloudDB = (config: SupabaseConfig) => {
    if (!config.url || !config.anonKey) return false;
    // Ensure URL doesn't have trailing slash
    const cleanUrl = config.url.replace(/\/$/, "");
    supabaseConfig = { ...config, url: cleanUrl };
    isCloudEnabled = true;
    console.log("Supabase Cloud (REST) Initialized");
    return true;
};

export const isUsingCloud = () => isCloudEnabled;

// --- CONFIG PERSISTENCE HELPER ---
// Saves config to LS, SS, IDB, and Cookies to ensure it survives refresh
export const saveCloudConfig = async (config: SupabaseConfig) => {
    const str = JSON.stringify(config);
    // 1. LocalStorage
    try { localStorage.setItem('supabaseConfig', str); } catch(e) {}
    // 2. SessionStorage
    try { sessionStorage.setItem('supabaseConfig', str); } catch(e) {}
    // 3. Cookies (New Fallback for strict environments)
    try {
        document.cookie = `supabaseConfig=${encodeURIComponent(str)}; path=/; max-age=31536000; SameSite=Strict`;
    } catch(e) {}
    
    // 4. IndexedDB (Local 'app_data' store)
    try {
        // We use the internal helper to force a save to the LOCAL IDB, skipping cloud logic
        await saveSingleLocalDataOnly('supabaseConfig', config);
    } catch(e) {
        console.error("Failed to save config to IDB", e);
    }
};

// Retrieves config from any available source
export const getCloudConfig = async (): Promise<SupabaseConfig | null> => {
    // 1. Try LocalStorage
    try {
        const ls = localStorage.getItem('supabaseConfig');
        if (ls) return JSON.parse(ls);
    } catch(e) {}

    // 2. Try SessionStorage
    try {
        const ss = sessionStorage.getItem('supabaseConfig');
        if (ss) return JSON.parse(ss);
    } catch(e) {}

    // 3. Try Cookies
    try {
        const match = document.cookie.match(new RegExp('(^| )supabaseConfig=([^;]+)'));
        if (match) return JSON.parse(decodeURIComponent(match[2]));
    } catch(e) {}

    // 4. Try IndexedDB
    try {
        const idbConfig = await getSingleLocalDataOnly<SupabaseConfig>('supabaseConfig');
        if (idbConfig) return idbConfig;
    } catch(e) {}

    // 5. Try Hardcoded Defaults (Fallback for strict environments)
    if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_KEY) {
        console.log("Using Hardcoded Supabase Credentials");
        return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_KEY };
    }

    return null;
};


// --- Helper for Supabase Fetch ---
async function supabaseFetch(endpoint: string, options: RequestInit = {}) {
    if (!supabaseConfig) throw new Error("Supabase not configured");
    
    const headers = {
        'apikey': supabaseConfig.anonKey,
        'Authorization': `Bearer ${supabaseConfig.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal', // Default preference
        ...options.headers
    };

    // Ensure we are using the configured URL, or throw if missing (though init checks this)
    const baseUrl = supabaseConfig.url;

    const response = await fetch(`${baseUrl}/rest/v1${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Supabase Error ${response.status}: ${text}`);
    }

    return response;
}

// --- Connection Tester ---
export const testConnection = async (url: string, key: string): Promise<{ success: boolean; message?: string }> => {
    const cleanUrl = url.trim().replace(/\/$/, "");
    const cleanKey = key.trim();

    if (!cleanUrl || !cleanKey) return { success: false, message: "Missing URL or Key" };

    // 5 Second Timeout for the test
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        // We try to fetch the 'settings' table definition or just 1 row.
        // If the table doesn't exist (SQL script not run), this returns 404.
        // If auth is wrong, this returns 401/403.
        const response = await fetch(`${cleanUrl}/rest/v1/settings?select=id&limit=1`, {
            method: 'GET',
            headers: {
                'apikey': cleanKey,
                'Authorization': `Bearer ${cleanKey}`,
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
            return { success: true, message: "Connection successful!" };
        } else {
            if (response.status === 404) {
                return { success: false, message: "Connected, but 'settings' table missing. Did you run the SQL?" };
            } else if (response.status === 401 || response.status === 403) {
                 return { success: false, message: "Authorization failed. Check your Anon Key." };
            }
            return { success: false, message: `Error ${response.status}: ${response.statusText}` };
        }
    } catch (e: any) {
        clearTimeout(timeoutId);
        if (e.name === 'AbortError') {
            return { success: false, message: "Connection timed out. Check URL." };
        }
        console.error("Connection Test Failed", e);
        return { success: false, message: "Network error. Check URL and internet connection." };
    }
}


// --- UTILS ---

// Robust ID generator
export const generateId = (): string => {
    if (typeof self.crypto !== 'undefined' && typeof self.crypto.randomUUID === 'function') {
        return self.crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
};

let dbPromise: Promise<IDBDatabase> | null = null;
let useLocalStorageFallback = false;

function getDb(): Promise<IDBDatabase> {
  // Note: Even if useLocalStorageFallback is true, we might want to try opening DB for migration purposes.
  // But if it was explicitly set to true due to error, we respect it.
  
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = (event) => {
          console.warn('IndexedDB blocked. Switching to LocalStorage Fallback.');
          useLocalStorageFallback = true;
          reject('IndexedDB blocked');
        };

        request.onsuccess = (event) => {
          resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(CUSTOMERS_STORE)) db.createObjectStore(CUSTOMERS_STORE, { keyPath: 'id' });
          if (!db.objectStoreNames.contains(ORDERS_STORE)) db.createObjectStore(ORDERS_STORE, { keyPath: 'id' });
          if (!db.objectStoreNames.contains(DATA_STORE)) db.createObjectStore(DATA_STORE);
        };
      } catch (e) {
          console.warn('IndexedDB not available. Switching to LocalStorage Fallback.');
          useLocalStorageFallback = true;
          reject(e);
      }
    });
  }
  return dbPromise;
}

// Helper to read LOCAL data specifically, ignoring cloud flag
async function getLocalDataOnly<T>(collectionName: string): Promise<T[]> {
    // Try IDB First
    try {
        const db = await getDb();
        return new Promise((resolve) => {
             const tx = db.transaction(collectionName, 'readonly');
             const req = tx.objectStore(collectionName).getAll();
             req.onsuccess = () => resolve(req.result);
             req.onerror = () => resolve([]);
        });
    } catch (e) {
        // Try LocalStorage
        try {
            const data = localStorage.getItem(collectionName);
            return data ? JSON.parse(data) : [];
        } catch (e) { return []; }
    }
}

async function getSingleLocalDataOnly<T>(key: string): Promise<T | null> {
    // Try IDB First
    try {
        const db = await getDb();
        return new Promise((resolve) => {
             const tx = db.transaction(DATA_STORE, 'readonly');
             const req = tx.objectStore(DATA_STORE).get(key);
             req.onsuccess = () => resolve(req.result || null);
             req.onerror = () => resolve(null);
        });
    } catch (e) {
        // Try LocalStorage
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) { return null; }
    }
}

async function saveSingleLocalDataOnly(key: string, value: any): Promise<void> {
    // Force save to local IDB
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
             const tx = db.transaction(DATA_STORE, 'readwrite');
             const store = tx.objectStore(DATA_STORE);
             store.put(value, key);
             tx.oncomplete = () => resolve();
             tx.onerror = () => reject(tx.error);
        });
    } catch (e) {
        // Fallback to LS
        try { localStorage.setItem(key, JSON.stringify(value)); } catch(err) {}
    }
}


// --- Data Access Helper (Handles Cloud vs Local vs Fallback) ---

async function getData<T>(collectionName: string): Promise<T[]> {
    // 1. Cloud Mode (Supabase REST)
    if (isCloudEnabled && supabaseConfig) {
        try {
            // GET /<table>?select=json
            const response = await supabaseFetch(`/${collectionName}?select=json`);
            const data = await response.json();
            return data.map((row: any) => row.json as T);
        } catch (error) {
            console.error(`Supabase Load Error (${collectionName})`, error);
            // If cloud fails, do NOT fallback silently to local, return empty or throw?
            // Current behavior: return empty list to avoid app crash, but logging error.
            return [];
        }
    }

    // 2. LocalStorage Fallback Mode
    if (useLocalStorageFallback) {
        const data = localStorage.getItem(collectionName);
        return data ? JSON.parse(data) : [];
    }

    // 3. IndexedDB Mode
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(collectionName, 'readonly');
            const store = tx.objectStore(collectionName);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        const data = localStorage.getItem(collectionName);
        return data ? JSON.parse(data) : [];
    }
}

async function saveData<T extends { id: string }>(collectionName: string, data: T): Promise<void> {
    // 1. Cloud Mode (Supabase REST)
    if (isCloudEnabled && supabaseConfig) {
        // POST /<table> (Upsert logic)
        // We need 'Prefer: resolution=merge-duplicates' to act like an upsert on PK collision
        try {
            await supabaseFetch(`/${collectionName}`, {
                method: 'POST',
                headers: {
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify({ id: data.id, json: data })
            });
        } catch (error) {
            console.error(`Supabase Save Error (${collectionName})`, error);
            throw error; // Propagate error for UI feedback
        }
        return;
    }

    // 2. LocalStorage Fallback Mode
    if (useLocalStorageFallback) {
        const current = JSON.parse(localStorage.getItem(collectionName) || '[]');
        const index = current.findIndex((i: any) => i.id === data.id);
        if (index >= 0) current[index] = data;
        else current.push(data);
        localStorage.setItem(collectionName, JSON.stringify(current));
        return;
    }

    // 3. IndexedDB Mode
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(collectionName, 'readwrite');
            const store = tx.objectStore(collectionName);
            store.put(data);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch(e) {
        const current = JSON.parse(localStorage.getItem(collectionName) || '[]');
        const index = current.findIndex((i: any) => i.id === data.id);
        if (index >= 0) current[index] = data;
        else current.push(data);
        localStorage.setItem(collectionName, JSON.stringify(current));
    }
}

async function deleteData(collectionName: string, id: string): Promise<void> {
    // 1. Cloud Mode (Supabase REST)
    if (isCloudEnabled && supabaseConfig) {
        try {
            // DELETE /<table>?id=eq.<id>
            await supabaseFetch(`/${collectionName}?id=eq.${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error(`Supabase Delete Error (${collectionName})`, error);
        }
        return;
    }

    // 2. LocalStorage Fallback Mode
    if (useLocalStorageFallback) {
        const current = JSON.parse(localStorage.getItem(collectionName) || '[]');
        const filtered = current.filter((i: any) => i.id !== id);
        localStorage.setItem(collectionName, JSON.stringify(filtered));
        return;
    }

    // 3. IndexedDB Mode
    const db = await getDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(collectionName, 'readwrite');
        const store = tx.objectStore(collectionName);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// --- Single Object Stores (Settings, etc) ---

async function getSingleData<T>(key: string): Promise<T | null> {
    if (isCloudEnabled && supabaseConfig) {
        try {
            // GET /settings?id=eq.<key>&select=json
            const response = await supabaseFetch(`/settings?id=eq.${key}&select=json`, {
                headers: { 'Accept': 'application/vnd.pgrst.object+json' } // Request single object
            });
            const data = await response.json();
            return data.json as T;
        } catch (e) { return null; }
    }

    if (useLocalStorageFallback) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(DATA_STORE, 'readonly');
            const store = tx.objectStore(DATA_STORE);
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}

async function saveSingleData(key: string, value: any): Promise<void> {
    if (isCloudEnabled && supabaseConfig) {
        try {
            await supabaseFetch(`/settings`, {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates' },
                body: JSON.stringify({ id: key, json: value })
            });
        } catch(e) {
            console.error("Supabase Save Single Error", e);
        }
        return;
    }

    if (useLocalStorageFallback) {
        localStorage.setItem(key, JSON.stringify(value));
        return;
    }

    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(DATA_STORE, 'readwrite');
            const store = tx.objectStore(DATA_STORE);
            store.put(value, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (e) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}


// --- EXPORTS ---

export const getAllCustomers = () => getData<Customer>(CUSTOMERS_STORE);
export const addCustomer = (c: Customer) => saveData(CUSTOMERS_STORE, c);
export const updateCustomer = (c: Customer) => saveData(CUSTOMERS_STORE, c);

export const getAllOrders = () => getData<Order>(ORDERS_STORE);
export const addOrder = (o: Order) => saveData(ORDERS_STORE, o);
export const updateOrder = (o: Order) => saveData(ORDERS_STORE, o);
export const deleteOrder = (id: string) => deleteData(ORDERS_STORE, id);

export const getVendors = () => getSingleData<Vendor[]>('vendors');
export const saveVendors = (v: Vendor[]) => saveSingleData('vendors', v);

export const getEmployees = () => getSingleData<Employee[]>('employees');
export const saveEmployees = (e: Employee[]) => saveSingleData('employees', e);

export const getStoreSettings = () => getSingleData<StoreSettings>('storeSettings');
export const saveStoreSettings = (s: StoreSettings) => saveSingleData('storeSettings', s);

export const clearAllData = async (): Promise<void> => {
    if (isCloudEnabled) {
        alert("Bulk clear disabled for Cloud DB for safety.");
        return;
    }
    if (useLocalStorageFallback) {
        localStorage.clear();
        return;
    }
    const db = await getDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction([CUSTOMERS_STORE, ORDERS_STORE, DATA_STORE], 'readwrite');
        tx.objectStore(CUSTOMERS_STORE).clear();
        tx.objectStore(ORDERS_STORE).clear();
        tx.objectStore(DATA_STORE).clear();
        tx.oncomplete = () => resolve();
    });
};

export const getStorageMode = () => {
    if (isCloudEnabled) return 'Cloud (Supabase)';
    if (useLocalStorageFallback) return 'Browser (LocalStorage)';
    return 'Browser (IndexedDB)';
}

// --- MIGRATION TOOL ---
export const syncLocalToCloud = async () => {
    if (!isCloudEnabled || !supabaseConfig) throw new Error("Cloud not enabled");

    console.log("Starting sync...");

    // 1. Read ALL local data (ignoring cloud flag)
    const localCustomers = await getLocalDataOnly<Customer>(CUSTOMERS_STORE);
    const localOrders = await getLocalDataOnly<Order>(ORDERS_STORE);
    const localVendors = await getSingleLocalDataOnly<Vendor[]>('vendors');
    const localEmployees = await getSingleLocalDataOnly<Employee[]>('employees');
    const localSettings = await getSingleLocalDataOnly<StoreSettings>('storeSettings');

    console.log(`Found locally: ${localCustomers.length} customers, ${localOrders.length} orders`);

    // 2. Write to Cloud (using existing save functions which utilize Cloud connection)
    // Note: We are 'connected' so these functions write to Supabase.
    
    for (const c of localCustomers) {
        await addCustomer(c);
    }
    for (const o of localOrders) {
        await addOrder(o);
    }
    
    if (localVendors) await saveVendors(localVendors);
    if (localEmployees) await saveEmployees(localEmployees);
    if (localSettings) await saveStoreSettings(localSettings);
    
    return { 
        customers: localCustomers.length, 
        orders: localOrders.length 
    };
};