export enum OrderStatus {
  PREORDERED = "Pre-ordered",
  IN_STOCK = "In Stock",
  PICKED_UP = "Picked Up",
}

export enum ItemType {
  VIDEO_GAME = "Video Game",
  COMIC_BOOK = "Comic Book",
  BOARD_GAME = "Board Game",
  RPG = "Role Playing Game",
  MINIATURES = "Miniatures",
  DICE = "Dice",
  SUPPLIES = "Supplies",
  MERCHANDISE = "Merchandise",
}

export type RewardCategory = 
  | "Board Game"
  | "Card Sleeves"
  | "Miniatures"
  | "Modeling Supplies"
  | "Role Playing"
  | "Dice";

export interface RewardTransaction {
  id: string;
  date: string;
  type: 'EARN' | 'REDEEM' | 'ADJUSTMENT';
  amount: number; // Points earned or Credit redeemed
  creditChange?: number; // How much store credit was added/removed
  breakdown?: Partial<Record<RewardCategory, number>>; // Breakdown of spend by category
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  email?: string;
  rewardsPoints: number; // Tracks spend progress towards $100
  storeCredit: number;   // Tracks available $15 credits
  rewardsHistory: RewardTransaction[];
}

export interface Vendor {
  id: string;
  name: string;
  phone?: string;
  salesRep?: string;
}

export interface Employee {
  id: string;
  name: string;
  email?: string;
}

export interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string; // Base64 data URL
}

export interface TrackingInfo {
  orderedFromVendorDate?: string;
  expectedArrivalDate?: string;
  receivedDate?: string;
  customerNotifiedDate?: string;
  vendor?: string;
  orderedBy?: string;
  pickedUpDate?: string;
}

export interface OrderItem {
  id: string;
  itemName: string;
  itemType: ItemType;
  price?: number;
  status: OrderStatus;
  notes?: string;
  notifyEmployeeId?: string; // The internal staff member responsible for ordering this
  tracking?: TrackingInfo;
}

export interface Order {
  id:string;
  customerId: string;
  orderDate: string;
  items: OrderItem[];
  depositPaid?: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}