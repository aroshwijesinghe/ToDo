import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { TodoTask } from '../types/todo';
import { exportToCSV, exportToJSON } from '../utils/helpers';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TodoTask[];
  onImportTasks: (tasks: TodoTask[]) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onImportTasks,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string }>({});

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportTasks(parsed);
          setImportStatus({ success: true, message: `Successfully imported ${parsed.length} tasks!` });
          setTimeout(() => {
            onClose();
            setImportStatus({});
          }, 1500);
        } else {
          setImportStatus({ success: false, message: 'Invalid JSON format: array expected.' });
        }
      } catch (err) {
        setImportStatus({ success: false, message: 'Failed to parse JSON file.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181b20] border border-gray-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#121417]">
          <h3 className="text-base font-bold text-gray-100 font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Export / Import Data
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status alert */}
          {importStatus.message && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-xs font-mono border ${
                importStatus.success
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              {importStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export Options */}
          <div>
            <h4 className="text-xs font-mono uppercase text-gray-400 font-semibold mb-2">
              Export Tasks ({tasks.length} items)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => exportToJSON(tasks)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#121417] hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-lg text-xs font-mono text-gray-200 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Export JSON
              </button>
              <button
                onClick={() => exportToCSV(tasks)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#121417] hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-lg text-xs font-mono text-gray-200 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <h4 className="text-xs font-mono uppercase text-gray-400 font-semibold mb-2">
              Import from Backup
            </h4>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 transition-all"
            >
              <Upload className="w-4 h-4" />
              Choose JSON File to Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
