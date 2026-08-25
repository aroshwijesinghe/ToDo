import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { TodoTask } from '../types/todo';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { exportToCSV, exportToJSON } from '../utils/helpers';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TodoTask[];
  onImportTasks: (tasks: TodoTask[]) => void;
  theme?: ThemeMode;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onImportTasks,
  theme = 'dark',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string }>({});

  const themeConfig = THEME_CONFIGS[theme];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transition-all ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textPrimary}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4.5 border-b ${themeConfig.classes.tableHeaderBg}`}>
          <h3 className="text-base font-semibold tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: themeConfig.accentHex }} />
            Share &amp; Backup
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {importStatus.message && (
            <div
              className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-medium border ${
                importStatus.success
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              }`}
            >
              {importStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export Options */}
          <div>
            <h4 className={`text-xs uppercase font-semibold tracking-wider mb-2.5 ${themeConfig.classes.textMuted}`}>
              Export Dataset ({tasks.length} objectives)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => exportToJSON(tasks)}
                className={`flex items-center justify-center gap-2 py-3 px-3.5 border rounded-2xl text-xs font-medium transition-all hover:scale-105 active:scale-95 ${themeConfig.classes.inputBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textPrimary}`}
              >
                <Download className="w-4 h-4" style={{ color: themeConfig.accentHex }} />
                Export JSON
              </button>
              <button
                onClick={() => exportToCSV(tasks)}
                className={`flex items-center justify-center gap-2 py-3 px-3.5 border rounded-2xl text-xs font-medium transition-all hover:scale-105 active:scale-95 ${themeConfig.classes.inputBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textPrimary}`}
              >
                <Download className="w-4 h-4" style={{ color: themeConfig.accentHex }} />
                Export CSV
              </button>
            </div>
          </div>

          <div className={`border-t pt-4 ${themeConfig.classes.cardBorder}`}>
            <h4 className={`text-xs uppercase font-semibold tracking-wider mb-2.5 ${themeConfig.classes.textMuted}`}>
              Restore from JSON File
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
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-semibold transition-all hover:scale-102 active:scale-98"
              style={{
                backgroundColor: `${themeConfig.accentHex}20`,
                borderColor: `${themeConfig.accentHex}40`,
                color: themeConfig.accentHex,
                borderWidth: '1px'
              }}
            >
              <Upload className="w-4 h-4" />
              Select File to Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
