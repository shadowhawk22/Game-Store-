import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, Customer, OrderItem as OrderItemData, Vendor } from '../types';
import { ORDER_STATUSES } from '../constants';
import OrderItem from './OrderItem';
import { TrashIcon, ReceiptIcon } from './icons';

interface OrderListProps {
  orders: Order[];
  customers: Customer[];
  onDeleteOrder: (orderId: string) => void;
  onShowReceipt: (order: Order) => void;
  onUpdateItem: (orderId: string, item: OrderItemData) => Promise<void>;
  vendors: Vendor[];
  employees: string[];
}

const OrderList: React.FC<OrderListProps> = ({ orders, customers, onDeleteOrder, onShowReceipt, onUpdateItem, vendors, employees }) => {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.items.some(item => item.status === filter));
  }, [orders, filter]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-white">All Current Pre-orders</h2>
        <div className="flex items-center gap-2">
            <label htmlFor="statusFilter" className="text-sm font-medium text-slate-300">Filter by status:</label>
            <select
                id="statusFilter"
                value={filter}
                onChange={e => setFilter(e.target.value as OrderStatus | 'all')}
                className="bg-slate-900 border border-slate-600 rounded-md py-1 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
            >
                <option value="all">All</option>
                {ORDER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => {
            const customer = customers.find(c => c.id === order.customerId);
            return (
              <div key={order.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-700 pb-3 mb-3">
                  <div>
                    <p className="font-bold text-lg text-white">{customer ? customer.name : 'Unknown Customer'}</p>
                    <p className="text-xs text-slate-400">Order Placed: {new Date(order.orderDate).toLocaleDateString()}</p>
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
                            customer={customer || null}
                        />
                    ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-slate-400 bg-slate-800/50 rounded-lg">
            <p>No pre-orders match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;