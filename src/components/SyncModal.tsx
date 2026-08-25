import React, { useState } from 'react';
import { X, Smartphone, Laptop, RefreshCw, Copy, Check, QrCode, Cloud, ShieldCheck, Key } from 'lucide-react';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { getSyncShareUrl, generateSyncKey } from '../utils/cloudSync';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncKey: string | null;
  onSetSyncKey: (key: string) => void;
  onSyncNow: () => void;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  theme?: ThemeMode;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  syncKey,
  onSetSyncKey,
  onSyncNow,
  isSyncing,
  lastSyncedAt,
  theme = 'dark',
}) => {
  const [inputKey, setInputKey] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const themeConfig = THEME_CONFIGS[theme];

  if (!isOpen) return null;

  const currentKey = syncKey || '';
  const shareUrl = currentKey ? getSyncShareUrl(currentKey) : '';
  const qrCodeUrl = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`
    : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyKey = () => {
    if (!currentKey) return;
    navigator.clipboard.writeText(currentKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim().toUpperCase();
    if (cleanKey) {
      onSetSyncKey(cleanKey);
      setInputKey('');
    }
  };

  const handleCreateNewRoom = () => {
    const newKey = generateSyncKey();
    onSetSyncKey(newKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-all max-h-[92vh] flex flex-col ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textPrimary}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4.5 border-b shrink-0 ${themeConfig.classes.tableHeaderBg}`}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: themeConfig.accentHex }}
            >
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Cross-Device Cloud Sync
              </h3>
              <p className={`text-[11px] font-medium ${themeConfig.classes.textMuted}`}>
                Sync in real-time between your Phone &amp; Laptop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Visual Device Pair Graphic */}
          <div className={`p-4 rounded-2xl border flex items-center justify-around text-center ${themeConfig.classes.inputBg} ${themeConfig.classes.cardBorder}`}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm"
                style={{ backgroundColor: `${themeConfig.accentHex}15`, borderColor: `${themeConfig.accentHex}40`, color: themeConfig.accentHex }}
              >
                <Laptop className="w-6 h-6" />
              </div>
              <span className="font-semibold text-[11px]">Laptop / PC</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeConfig.accentHex }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: themeConfig.accentHex }}>
                  Cloud Linked
                </span>
              </div>
              <p className={`text-[10px] ${themeConfig.classes.textMuted}`}>Zero Data Loss</p>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm"
                style={{ backgroundColor: `${themeConfig.accentHex}15`, borderColor: `${themeConfig.accentHex}40`, color: themeConfig.accentHex }}
              >
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="font-semibold text-[11px]">Phone / Tablet</span>
            </div>
          </div>

          {/* Active Sync Status */}
          {syncKey ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${themeConfig.classes.cardBorder} bg-emerald-500/5`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-500">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sync Room Active:</span>
                    <span className="font-mono text-sm tracking-wider px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                      {syncKey}
                    </span>
                  </div>

                  <button
                    onClick={onSyncNow}
                    disabled={isSyncing}
                    className={`flex items-center gap-1 px-3 py-1 rounded-xl font-semibold transition-all hover:scale-105 ${themeConfig.classes.accentBtn}`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>

                {lastSyncedAt && (
                  <p className={`text-[11px] ${themeConfig.classes.textMuted}`}>
                    Last synced: {new Date(lastSyncedAt).toLocaleTimeString()} ({new Date(lastSyncedAt).toLocaleDateString()})
                  </p>
                )}
              </div>

              {/* QR Code & Scan Option for Mobile */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 ${themeConfig.classes.inputBg} ${themeConfig.classes.cardBorder}`}>
                {qrCodeUrl && (
                  <div className="p-2 rounded-2xl bg-white shadow-md shrink-0">
                    <img
                      src={qrCodeUrl}
                      alt="Scan to Sync on Mobile Phone"
                      className="w-28 h-28 rounded-lg"
                    />
                  </div>
                )}
                <div className="space-y-2 text-center sm:text-left">
                  <p className="font-bold text-xs flex items-center justify-center sm:justify-start gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    Open on Phone in 1 Second
                  </p>
                  <p className={`text-[11px] leading-relaxed ${themeConfig.classes.textSecondary}`}>
                    Point your iPhone or Android camera at the QR code to open your tasks with live synchronization.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 ${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder}`}
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Phone Link'}</span>
                    </button>
                    <button
                      onClick={handleCopyKey}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 ${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder}`}
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Key className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Code Copied!' : 'Copy Sync Code'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border text-center space-y-3 ${themeConfig.classes.inputBg} ${themeConfig.classes.cardBorder}`}>
                <p className="font-bold text-xs">
                  Create a Sync Room to Connect Phone &amp; Laptop
                </p>
                <p className={`text-[11px] leading-relaxed ${themeConfig.classes.textSecondary}`}>
                  Generate a private sync key so any task you create, complete, or edit on your phone automatically appears on your laptop and vice versa.
                </p>
                <button
                  onClick={handleCreateNewRoom}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 shadow-md ${themeConfig.classes.accentBtn}`}
                >
                  Generate Private Sync Room
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className={`flex-shrink mx-4 text-[10px] font-bold uppercase ${themeConfig.classes.textMuted}`}>
                  Or Connect Existing Room
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              <form onSubmit={handleJoinRoom} className="flex gap-2">
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter 6-character code (e.g. SYNC-8F92K)..."
                  className={`flex-1 px-3.5 py-2 border rounded-xl font-mono text-xs focus:outline-none ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder} ${themeConfig.classes.textPrimary}`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl font-bold transition-all hover:scale-105 ${themeConfig.classes.accentBtn}`}
                >
                  Join
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
