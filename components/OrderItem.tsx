import React, { useState, useEffect } from 'react';
import { OrderItem as OrderItemData, OrderStatus, Vendor, Customer } from '../types';
import { STATUS_STYLES } from '../constants';
import { BellIcon, CubeIcon, CalendarDaysIcon, TruckIcon, UserIcon, PaperAirplaneIcon } from './icons';

interface OrderItemProps {
    orderId: string;
    item: OrderItemData;
    orderDate: string;
    onUpdateItem: (orderId: string, item: OrderItemData) => Promise<void>;
    vendors: Vendor[];
    employees: string[];
    customer: Customer | null;
}

const parseLocalDate = (dateString?: string): Date | null => {
    if (!dateString) return null;
    if (dateString.includes('T')) {
        return new Date(dateString);
    }
    const parts = dateString.split('-').map(num => parseInt(num, 10));
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(dateString);
};

const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return null;
    const d = parseLocalDate(dateString);
    if (!d) return null;
    return d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit' });
};

const BadgeStep: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    isCompleted: boolean;
    onClick?: () => void;
}> = ({ icon, title, children, isCompleted, onClick }) => {
    const baseClass = isCompleted 
        ? 'bg-cyan-900/20 border-cyan-500/30 text-cyan-100 hover:bg-cyan-900/40 hover:border-cyan-400' 
        : 'bg-slate-800/30 border-slate-700/50 text-slate-500 hover:bg-slate-800/50 hover:border-slate-600';
    
    const iconColor = isCompleted ? 'text-cyan-400' : 'text-slate-600';
    const cursorClass = onClick ? 'cursor-pointer' : 'cursor-default';

    return (
        <div 
            className={`relative flex flex-col border rounded px-2 py-1.5 transition-all w-28 sm:w-32 flex-shrink-0 ${baseClass} ${cursorClass}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-1.5 mb-1 border-b border-white/5 pb-1">
                <div className={`w-3 h-3 ${iconColor}`}>{icon}</div>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-90">{title}</span>
            </div>
            <div className="text-[9px] leading-tight font-medium space-y-0.5 min-h-[2.25rem] flex flex-col justify-center">
                {children}
            </div>
        </div>
    );
};

const CompactConnector: React.FC<{isCompleted: boolean}> = ({ isCompleted }) => {
    const colorClass = isCompleted ? 'bg-cyan-600/50' : 'bg-slate-800';
    return (
        <div className={`h-px w-3 self-center flex-shrink-0 ${colorClass} mx-0.5`} />
    )
}

const EditStepForm: React.FC<{ title: string; onSave: () => void; onCancel: () => void; children: React.ReactNode }> = ({ title, onSave, onCancel, children }) => (
    <div className="mt-2 p-3 bg-slate-800 border border-slate-600 rounded-md animate-fade-in">
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-cyan-400">Edit {title}</h4>
             <div className="flex gap-2">
                <button onClick={onCancel} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[10px]">Cancel</button>
                <button onClick={onSave} className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[10px]">Save</button>
            </div>
        </div>
        <div className="space-y-2 text-xs">{children}</div>
    </div>
);


const OrderItem: React.FC<OrderItemProps> = ({ orderId, item, orderDate, onUpdateItem, vendors, employees, customer }) => {
    const [editingStep, setEditingStep] = useState<string | null>(null);
    const [formData, setFormData] = useState<OrderItemData>(item);
    
    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleCancel = () => {
        setEditingStep(null);
        setFormData(item);
    };

    const handleSave = async () => {
        let finalData = { ...formData };
        // Auto-status update logic
        if (finalData.tracking?.pickedUpDate && finalData.status !== OrderStatus.PICKED_UP) {
            finalData.status = OrderStatus.PICKED_UP;
        } else if (finalData.tracking?.receivedDate && finalData.status === OrderStatus.PREORDERED) {
            finalData.status = OrderStatus.IN_STOCK;
        }
        await onUpdateItem(orderId, finalData);
        setEditingStep(null);
    };

    const handleTrackingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            tracking: { ...prev.tracking, [name]: value || undefined },
        }));
    };
    
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, notes: e.target.value }));
    }

    const handleNotifyCustomer = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!customer?.email) {
            alert("Cannot notify customer: No email address on file.");
            return;
        }

        const subject = `Your Pre-order has Arrived! (${item.itemName})`;
        const body = `Hi ${customer.name},\n\nYour pre-ordered item, "${item.itemName}", has arrived at the store!\n\nYou can pick it up anytime during our business hours.\n\nThanks,\nGame Store`;
        
        // Generate Gmail Compose URL
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(customer.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.open(gmailLink, '_blank');

        const updatedItem: OrderItemData = {
            ...item,
            tracking: {
                ...item.tracking,
                customerNotifiedDate: new Date().toISOString(),
            }
        };
        onUpdateItem(orderId, updatedItem);
    };

    const statusStyle = STATUS_STYLES[item.status];
    const { tracking } = item;

    const arrivalDate = parseLocalDate(tracking?.expectedArrivalDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isOrdered = !!tracking?.orderedFromVendorDate;
    const isReceived = !!tracking?.receivedDate;
    const isNotified = !!tracking?.customerNotifiedDate;
    const isPickedUp = !!tracking?.pickedUpDate;

    const renderEditForm = () => {
        switch (editingStep) {
            case 'ordered':
                return (
                    <EditStepForm title="Ordered Details" onSave={handleSave} onCancel={handleCancel}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-400 mb-0.5">Ordered Date</label>
                                <input type="date" name="orderedFromVendorDate" value={formatDateForInput(formData.tracking?.orderedFromVendorDate)} onChange={handleTrackingChange} className="block w-full bg-slate-900 border border-slate-600 rounded py-1 px-2 text-white"/>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-0.5">Expected Arrival</label>
                                <input type="date" name="expectedArrivalDate" value={formatDateForInput(formData.tracking?.expectedArrivalDate)} onChange={handleTrackingChange} className="block w-full bg-slate-900 border border-slate-600 rounded py-1 px-2 text-white"/>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-0.5">Vendor</label>
                                <select name="vendor" value={formData.tracking?.vendor || ''} onChange={handleTrackingChange} className="block w-full bg-slate-900 border border-slate-600 rounded py-1 px-2 text-white">
                                    <option value="">Select Vendor...</option>
                                    {vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-0.5">Ordered By</label>
                                <select name="orderedBy" value={formData.tracking?.orderedBy || ''} onChange={handleTrackingChange} className="block w-full bg-slate-900 border border-slate-600 rounded py-1 px-2 text-white">
                                    <option value="">Select Employee...</option>
                                    {employees.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                        </div>
                    </EditStepForm>
                );
            case 'received':
                return (
                    <EditStepForm title="Received Details" onSave={handleSave} onCancel={handleCancel}>
                        <div>
                            <label className="block text-slate-400 mb-0.5">Received Date</label>
                            <input type="date" name="receivedDate" value={formatDateForInput(formData.tracking?.receivedDate)} onChange={handleTrackingChange} className="block w-full bg-slate-900 border border-slate-600 rounded py-1 px-2 text-white"/>
                        </div>
                    </EditStepForm>
                );
            case 'notified':
                return (
                    <EditStepForm title="Notification Details" onSave={handleSave} onCancel={handleCancel}>
                        <div>
                            <label className="block text-slate-400 mb-0.5">Notified Date</label>
                            <input type="date" name="customerNotifiedDate" value={formatDateForInput(formData.tracking?.customerNotifiedDate)} onChange={handleTrackingChange} className="block w-full bg-slate-900 border border-slate-600 rounded py-1 px-2 text-white"/>
                        </div>
                    </EditStepForm>
                );
            case 'pickedUp':
                return (
                    <EditStepForm title="Pickup Details" onSave={handleSave} onCancel={handleCancel}>
                        <div>
                            <label className="block text-slate-400 mb-0.5">Picked Up Date</label>
                            <input type="date" name="pickedUpDate" value={formatDateForInput(formData.tracking?.pickedUpDate)} onChange={handleTrackingChange} className="block w-full bg-slate-900 border border-slate-600 rounded py-1 px-2 text-white"/>
                        </div>
                    </EditStepForm>
                );
            case 'notes':
                 return (
                    <EditStepForm title="Item Notes" onSave={handleSave} onCancel={handleCancel}>
                        <div>
                           <textarea value={formData.notes || ''} onChange={handleNotesChange} rows={3} className="block w-full bg-slate-900 border border-slate-600 rounded py-2 px-3 text-sm text-white" />
                        </div>
                    </EditStepForm>
                );
            default:
                return null;
        }
    }

    return (
        <div className={`rounded-lg border ${statusStyle.base} transition-colors bg-slate-800/20 p-2`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex-grow min-w-0 flex items-center gap-2">
                     <p className="font-bold text-sm text-white truncate">{item.itemName}</p>
                     <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{item.itemType}</span>
                     <p className="text-xs font-semibold text-cyan-400">${item.price?.toFixed(2)}</p>
                </div>
            </div>

            {/* Timeline Badges */}
            <div className="w-full overflow-x-auto pb-1 px-0.5 scrollbar-none">
                <div className="flex items-start">
                    
                    {/* Pre-ordered Badge */}
                    <BadgeStep title="Pre-order" icon={<CubeIcon/>} isCompleted={true}>
                        <span className="block font-mono text-slate-300">{formatDisplayDate(orderDate)}</span>
                    </BadgeStep>
                    
                    <CompactConnector isCompleted={isOrdered} />
                    
                    {/* Ordered Badge */}
                    <BadgeStep title="Ordered" icon={<CalendarDaysIcon/>} isCompleted={isOrdered} onClick={() => setEditingStep('ordered')}>
                        {tracking?.orderedFromVendorDate ? (
                            <>
                                <div className="font-mono text-slate-200 mb-0.5">{formatDisplayDate(tracking.orderedFromVendorDate)}</div>
                                {tracking.vendor && <div className="truncate text-slate-300" title={tracking.vendor}>{tracking.vendor}</div>}
                                {tracking.orderedBy && <div className="truncate text-slate-400">By: {tracking.orderedBy}</div>}
                                {tracking.expectedArrivalDate && (
                                    <div className={`mt-0.5 font-semibold ${arrivalDate && arrivalDate < today ? "text-red-400" : "text-yellow-400"}`}>
                                        ETA: {formatDisplayDate(tracking.expectedArrivalDate)}
                                    </div>
                                )}
                            </>
                        ) : <span className="text-slate-600 text-[8px] italic">Tap to update</span>}
                    </BadgeStep>
                    
                    <CompactConnector isCompleted={isReceived} />
                    
                    {/* Received Badge */}
                    <BadgeStep title="Received" icon={<TruckIcon/>} isCompleted={isReceived} onClick={() => setEditingStep('received')}>
                        {tracking?.receivedDate ? (
                            <>
                                <div className="font-mono text-slate-200">{formatDisplayDate(tracking.receivedDate)}</div>
                                {item.status === OrderStatus.IN_STOCK && !tracking.customerNotifiedDate && (
                                     <button
                                        onClick={handleNotifyCustomer}
                                        disabled={!customer?.email}
                                        className="w-full mt-1 flex items-center justify-center gap-1 bg-cyan-700 hover:bg-cyan-600 text-white text-[9px] py-0.5 rounded uppercase tracking-wider disabled:bg-slate-700 disabled:text-slate-500"
                                    >
                                        <PaperAirplaneIcon className="w-3 h-3" /> Notify
                                    </button>
                                )}
                            </>
                        ) : <span className="text-slate-600 text-[8px] italic">Tap to update</span>}
                    </BadgeStep>
                    
                    <CompactConnector isCompleted={isNotified} />
                    
                     {/* Notified Badge */}
                    <BadgeStep title="Notified" icon={<BellIcon/>} isCompleted={isNotified} onClick={() => setEditingStep('notified')}>
                         {tracking?.customerNotifiedDate ? (
                            <div className="font-mono text-slate-200">{formatDisplayDate(tracking.customerNotifiedDate)}</div>
                        ) : <span className="text-slate-600 text-[8px] italic">Tap to update</span>}
                    </BadgeStep>
                    
                    <CompactConnector isCompleted={isPickedUp} />
                    
                     {/* Picked Up Badge */}
                    <BadgeStep title="Picked Up" icon={<UserIcon/>} isCompleted={isPickedUp} onClick={() => setEditingStep('pickedUp')}>
                         {tracking?.pickedUpDate ? (
                            <div className="font-mono text-slate-200">{formatDisplayDate(tracking.pickedUpDate)}</div>
                        ) : <span className="text-slate-600 text-[8px] italic">Tap to update</span>}
                    </BadgeStep>
                </div>
            </div>
            
            {editingStep && renderEditForm()}

            {/* Footer / Notes */}
            <div 
                className="mt-1 pt-1 border-t border-slate-700/30 cursor-pointer group flex items-center gap-2"
                onClick={() => setEditingStep('notes')}
            >
                <span className="text-[9px] font-bold text-slate-500 uppercase group-hover:text-cyan-400 transition-colors">Notes</span>
                <p className="text-[10px] text-slate-400 truncate group-hover:text-slate-200 transition-colors flex-1">
                    {item.notes ? item.notes : <span className="italic opacity-50">Add notes...</span>}
                </p>
            </div>
        </div>
    );
}

export default OrderItem;