import { ItemType, OrderStatus, RewardCategory } from './types';

export const ITEM_TYPES: ItemType[] = Object.values(ItemType);
export const ORDER_STATUSES: OrderStatus[] = Object.values(OrderStatus);

export const REWARD_CATEGORIES: RewardCategory[] = [
  "Board Game",
  "Card Sleeves",
  "Miniatures",
  "Modeling Supplies",
  "Role Playing",
  "Dice"
];

export const STATUS_STYLES: Record<OrderStatus, { base: string, dot: string, text: string }> = {
  [OrderStatus.PREORDERED]: {
    base: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    dot: 'bg-yellow-400',
    text: 'text-yellow-300'
  },
  [OrderStatus.IN_STOCK]: {
    base: 'bg-green-500/10 border-green-500/30 text-green-300',
    dot: 'bg-green-400',
    text: 'text-green-300'
  },
  [OrderStatus.PICKED_UP]: {
    base: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
    dot: 'bg-slate-400',
    text: 'text-slate-400'
  },
};

// --- HARDCODED CONFIGURATION (PASTE KEYS HERE) ---
// 1. PASTE YOUR SUPABASE PROJECT URL INSIDE THE QUOTES BELOW
// Example: "https://xyz.supabase.co"
export const DEFAULT_SUPABASE_URL = "https://pdikkykqghxevloidrql.supabase.co"; 

// 2. PASTE YOUR SUPABASE ANON KEY INSIDE THE QUOTES BELOW
// Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
export const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkaWtreWtxZ2h4ZXZsb2lkcnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Mzc2MTIsImV4cCI6MjA3OTMxMzYxMn0.Su_i18Bo0r4kXYlAVQSpnqzDGhXlBccFalF3C37LT6A";