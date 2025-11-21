import React from 'react';
import { ReceiptIcon, CubeIcon, ComputerDesktopIcon } from './icons';

interface HeaderProps {
    dbStatus: 'connected' | 'error' | 'loading';
    storageLabel?: string;
    onBadgeClick?: () => void;
    storeName?: string;
    onInstallClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ dbStatus, storageLabel, onBadgeClick, storeName, onInstallClick }) => {
  return (
    <header className="py-6 border-b-2 border-slate-700/50 relative">
      {/* Status Badge (Top Right) */}
      <div className="absolute top-0 right-0 p-2 flex flex-col items-end gap-2">
        <div className="flex gap-2">
             {onInstallClick && (
                <button 
                    onClick={onInstallClick}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-slate-800 border-slate-600 text-cyan-400 hover:bg-slate-700 transition-colors"
                    title="Install App to Desktop"
                >
                    <ComputerDesktopIcon className="w-4 h-4" />
                    INSTALL APP
                </button>
             )}
            <button 
                onClick={onBadgeClick}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-opacity hover:opacity-80 ${
                dbStatus === 'connected' 
                    ? 'bg-green-900/30 border-green-700 text-green-400' 
                    : dbStatus === 'error'
                    ? 'bg-red-900/30 border-red-700 text-red-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
                <div className={`w-2 h-2 rounded-full ${
                    dbStatus === 'connected' ? 'bg-green-500 animate-pulse' : dbStatus === 'error' ? 'bg-red-500' : 'bg-slate-500'
                }`} />
                {dbStatus === 'connected' ? (storageLabel || 'Local Database') : dbStatus === 'error' ? 'Connection Error' : 'Connecting...'}
            </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-3 text-center mt-4 sm:mt-0">
        <div className="relative">
             <ReceiptIcon className="w-16 h-16 text-cyan-400" />
             <CubeIcon className="w-6 h-6 text-white absolute -bottom-1 -right-1 bg-slate-900 rounded-full border-2 border-slate-900" />
        </div>
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            {storeName || 'Game Store'}
          </h1>
          <p className="text-slate-400 mt-1 text-lg font-light uppercase tracking-widest">Pre-order and Rewards System</p>
        </div>
      </div>
    </header>
  );
};

export default Header;