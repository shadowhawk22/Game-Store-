import React, { useRef } from 'react';
import { InformationCircleIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from './icons';

interface BackupProps {
    onExportData: () => void;
    onImportData: (file: File) => void;
}

const Backup: React.FC<BackupProps> = ({ onExportData, onImportData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImportData(file);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto bg-slate-800/50 p-6 rounded-lg border border-slate-700 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Backup & Restore</h2>
            
            <div className="flex items-start gap-3 p-4 mb-6 text-sm bg-yellow-900/30 text-yellow-300 border border-yellow-700/50 rounded-lg">
                <InformationCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                    <span className="font-bold">Important:</span> Your data is stored securely in your browser's internal database (IndexedDB). While it persists between sessions, clearing your browser's "Site Data" will delete it. Regular manual backups are recommended.
                </div>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Data Portability</h3>
                <p className="text-sm text-slate-400 mb-4">
                    You can export all your customers, orders, and settings to a single file for safekeeping or to transfer to another computer.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                     <button
                        onClick={onExportData}
                        className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md font-semibold text-sm transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Download Backup File
                    </button>
                    <button
                        onClick={handleImportClick}
                        className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-md font-semibold text-sm transition-colors"
                    >
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        Restore from File
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    );
};

export default Backup;