
import React, { useEffect, useState } from 'react';
import { XIcon, ComputerDesktopIcon, ArrowUpTrayIcon, PlusCircleIcon, InformationCircleIcon, CloudArrowUpIcon } from './icons';

interface InstallGuideModalProps {
  onClose: () => void;
}

const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ onClose }) => {
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
      try {
          setIsIframe(window.self !== window.top);
      } catch (e) {
          setIsIframe(true);
      }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="relative bg-slate-800 max-w-lg w-full rounded-lg shadow-2xl border border-slate-700 text-slate-200 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ComputerDesktopIcon className="w-6 h-6 text-cyan-400" />
                Install App
              </h2>
              <p className="text-sm text-slate-400">How to make this a desktop app.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          {isIframe ? (
              <div className="mb-6 space-y-4">
                 <div className="p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-md">
                    <div className="flex gap-3 items-start mb-2">
                        <InformationCircleIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                        <div>
                             <h3 className="text-sm font-bold text-yellow-400">Preview Environment Detected</h3>
                             <p className="text-xs text-yellow-200 mt-1">
                                You are currently running this app in a temporary coding preview. 
                                <strong> Browsers block installation</strong> from these temporary addresses.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <CloudArrowUpIcon className="w-5 h-5 text-cyan-400"/>
                        Solution: Deploy to Install
                    </h3>
                    <p className="text-sm text-slate-300 mb-3">
                        To install this permanently on your desktop, you must host it on a real website.
                    </p>
                    <ol className="list-decimal list-inside text-sm text-slate-300 space-y-2">
                        <li><strong>Download Data:</strong> Go to the "Data & Backup" tab and download your backup so you don't lose customers.</li>
                        <li><strong>Export Code:</strong> Download these project files to your computer.</li>
                        <li><strong>Deploy:</strong> Upload the files to a free host like <strong>Vercel</strong>, <strong>Netlify</strong>, or <strong>GitHub Pages</strong>.</li>
                        <li><strong>Install:</strong> Open your <em>new</em> website URL. The install button will work instantly there.</li>
                    </ol>
                </div>
            </div>
          ) : (
              <div className="space-y-6">
                {/* Desktop Instructions */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2 border-b border-slate-700 pb-2">
                        Desktop (Chrome / Edge)
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-bold text-cyan-400 mb-1">Method 1: Address Bar</p>
                            <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">
                                <li>Look at the right side of the URL bar.</li>
                                <li>Click the <span className="font-bold text-white">Computer/Download Icon</span>.</li>
                                <li>Click <span className="font-bold text-white">Install</span>.</li>
                            </ol>
                        </div>

                        <div className="pt-2 border-t border-slate-700/50">
                            <p className="text-sm font-bold text-cyan-400 mb-1">Method 2: Browser Menu</p>
                            <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">
                                <li>Click the <span className="font-bold text-white">Three Dots (⋮)</span> in the top right.</li>
                                <li>Go to <span className="font-bold text-white">Cast, Save and Share</span> (or "More Tools").</li>
                                <li>Click <span className="font-bold text-white">Install Game Store System...</span></li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Instructions */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2 border-b border-slate-700 pb-2">
                        iOS / Safari (iPad/iPhone)
                    </h3>
                    <ol className="list-decimal list-inside text-sm text-slate-300 space-y-2">
                        <li>Tap the <span className="inline-flex items-center gap-1 font-bold text-white"><ArrowUpTrayIcon className="w-4 h-4"/> Share</span> button.</li>
                        <li>Tap <span className="inline-flex items-center gap-1 font-bold text-white"><PlusCircleIcon className="w-4 h-4"/> Add to Home Screen</span>.</li>
                        <li>Tap <span className="font-bold text-cyan-400">Add</span>.</li>
                    </ol>
                </div>
              </div>
          )}

          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-semibold transition-colors">
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallGuideModal;
