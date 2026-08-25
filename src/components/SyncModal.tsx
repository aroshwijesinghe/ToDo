import React, { useState } from 'react';
import { X, Smartphone, Laptop, RefreshCw, Copy, Check, QrCode, Cloud, ShieldCheck, Key, Database, Globe, Github, ExternalLink } from 'lucide-react';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { getSyncShareUrl, generateSyncKey, SupabaseConfig } from '../utils/cloudSync';
import { GitHubConfig, commitTasksToGitHub } from '../utils/githubSync';
import { TodoTask } from '../types/todo';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncKey: string | null;
  onSetSyncKey: (key: string) => void;
  onSyncNow: () => void;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  supabaseConfig: SupabaseConfig | null;
  onSaveSupabaseConfig: (config: SupabaseConfig | null) => void;
  gitHubConfig: GitHubConfig | null;
  onSaveGitHubConfig: (config: GitHubConfig | null) => void;
  tasks: TodoTask[];
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
  supabaseConfig,
  onSaveSupabaseConfig,
  gitHubConfig,
  onSaveGitHubConfig,
  tasks,
  theme = 'dark',
}) => {
  const [customNameInput, setCustomNameInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showSupabase, setShowSupabase] = useState(false);
  const [showGitHub, setShowGitHub] = useState(false);
  const [ghToken, setGhToken] = useState(gitHubConfig?.token || '');
  const [ghStatus, setGhStatus] = useState<string | null>(null);
  const [isGhSyncing, setIsGhSyncing] = useState(false);

  const [sbUrl, setSbUrl] = useState(supabaseConfig?.url || '');
  const [sbKey, setSbKey] = useState(supabaseConfig?.anonKey || '');

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

  const handleConnectCustomName = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customNameInput.trim().toLowerCase();
    if (clean) {
      onSetSyncKey(clean);
      setCustomNameInput('');
    }
  };

  const handleGenerateRandomKey = () => {
    const newKey = generateSyncKey();
    onSetSyncKey(newKey);
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (sbUrl.trim() && sbKey.trim()) {
      onSaveSupabaseConfig({ url: sbUrl.trim(), anonKey: sbKey.trim() });
    } else {
      onSaveSupabaseConfig(null);
    }
    setShowSupabase(false);
  };

  const handleSaveGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = ghToken.trim();
    if (!token) {
      onSaveGitHubConfig(null);
      setGhStatus('Disconnected GitHub database');
      return;
    }

    const config: GitHubConfig = {
      token,
      owner: 'aroshwijesinghe',
      repo: 'ToDo',
      branch: 'main',
      path: 'data/tasks.json',
    };

    setIsGhSyncing(true);
    setGhStatus('Committing tasks to GitHub data/tasks.json...');
    const result = await commitTasksToGitHub(config, tasks);
    setIsGhSyncing(false);

    if (result.success) {
      onSaveGitHubConfig(config);
      setGhStatus('✓ Successfully connected & committed to GitHub!');
    } else {
      setGhStatus(`❌ Error: ${result.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-all max-h-[92vh] flex flex-col ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textPrimary}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0 ${themeConfig.classes.tableHeaderBg}`}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: themeConfig.accentHex }}
            >
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Cross-Device Cloud &amp; GitHub Database
              </h3>
              <p className={`text-[11px] font-medium ${themeConfig.classes.textMuted}`}>
                Auto-syncs across Phone, Laptop, Incognito &amp; GitHub
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Device Pair Banner */}
          <div className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-around text-center ${themeConfig.classes.inputBg} ${themeConfig.classes.cardBorder}`}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm"
                style={{ backgroundColor: `${themeConfig.accentHex}15`, borderColor: `${themeConfig.accentHex}40`, color: themeConfig.accentHex }}
              >
                <Laptop className="w-5 h-5" />
              </div>
              <span className="font-semibold text-[11px]">Laptop / PC</span>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1.5 font-bold" style={{ color: themeConfig.accentHex }}>
                <Globe className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider">Live Cloud Sync</span>
              </div>
              <p className={`text-[10px] ${themeConfig.classes.textMuted}`}>Multi-Tab &amp; Cross-Device</p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm"
                style={{ backgroundColor: `${themeConfig.accentHex}15`, borderColor: `${themeConfig.accentHex}40`, color: themeConfig.accentHex }}
              >
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="font-semibold text-[11px]">Phone / Tablet</span>
            </div>
          </div>

          {/* Active Cloud Sync Status Card */}
          {syncKey ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${themeConfig.classes.cardBorder} bg-emerald-500/5 space-y-3`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sync Room:</span>
                    <span className="font-mono text-sm tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      {syncKey}
                    </span>
                  </div>

                  <button
                    onClick={onSyncNow}
                    disabled={isSyncing}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all hover:scale-105 ${themeConfig.classes.accentBtn}`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Cloud Now'}</span>
                  </button>
                </div>

                <p className={`text-[11px] ${themeConfig.classes.textSecondary}`}>
                  {lastSyncedAt
                    ? `✓ Synced with Cloud at ${new Date(lastSyncedAt).toLocaleTimeString()}`
                    : 'Auto-saving all changes in real time'}
                </p>
              </div>

              {/* QR Code & Scan Option */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 ${themeConfig.classes.inputBg} ${themeConfig.classes.cardBorder}`}>
                {qrCodeUrl && (
                  <div className="p-2 rounded-2xl bg-white shadow-md shrink-0">
                    <img
                      src={qrCodeUrl}
                      alt="Scan on Phone"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg"
                    />
                  </div>
                )}
                <div className="space-y-2 text-center sm:text-left">
                  <p className="font-bold text-xs flex items-center justify-center sm:justify-start gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    Open &amp; Sync on Phone in 1 Step
                  </p>
                  <p className={`text-[11px] leading-relaxed ${themeConfig.classes.textSecondary}`}>
                    Scan this QR code with your iPhone or Android camera to open your live to-do list with zero data loss.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-semibold transition-all hover:scale-105 ${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder}`}
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Phone Link'}</span>
                    </button>
                    <button
                      onClick={handleCopyKey}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-semibold transition-all hover:scale-105 ${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder}`}
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Key className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Name Copied!' : 'Copy Sync Name'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Connect / Change Sync Name Form */}
          <div className={`p-4 rounded-2xl border space-y-3 ${themeConfig.classes.inputBg} ${themeConfig.classes.cardBorder}`}>
            <p className="font-bold text-xs">
              {syncKey ? 'Switch or Connect to Another Sync Name' : 'Set Your Personal Cloud Sync Name'}
            </p>
            <p className={`text-[11px] leading-relaxed ${themeConfig.classes.textSecondary}`}>
              Pick any easy memorable name (e.g. <strong className={themeConfig.classes.textPrimary}>arosh</strong> or <strong className={themeConfig.classes.textPrimary}>my-goals</strong>). When you open the app on your phone or incognito tab, just type this name to load everything instantly.
            </p>

            <form onSubmit={handleConnectCustomName} className="flex gap-2">
              <input
                type="text"
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                placeholder="Enter sync name (e.g. arosh)..."
                className={`flex-1 px-3.5 py-2 border rounded-xl font-mono text-xs focus:outline-none ${themeConfig.classes.inputBg} ${themeConfig.classes.inputBorder} ${themeConfig.classes.textPrimary}`}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-xl font-bold transition-all hover:scale-105 shrink-0 ${themeConfig.classes.accentBtn}`}
              >
                Connect
              </button>
            </form>

            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className={themeConfig.classes.textMuted}>Don't know what to pick?</span>
              <button
                type="button"
                onClick={handleGenerateRandomKey}
                className="text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                🎲 Generate Random Key
              </button>
            </div>
          </div>

          {/* 🐙 GITHUB AS A DATABASE SECTION */}
          <div className="border-t pt-3 border-white/10">
            <button
              type="button"
              onClick={() => setShowGitHub(prev => !prev)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder} hover:scale-[1.01] transition-transform`}
            >
              <span className="flex items-center gap-2">
                <Github className="w-4 h-4 text-white" />
                <span>🐙 GitHub as a Database (<code>data/tasks.json</code>)</span>
                {gitHubConfig?.token && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Connected
                  </span>
                )}
              </span>
              <span>{showGitHub ? '▲' : '▼'}</span>
            </button>

            {showGitHub && (
              <form onSubmit={handleSaveGitHub} className="p-3.5 mt-2 rounded-2xl border space-y-3 bg-black/30 border-white/10">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold flex items-center gap-1.5 text-white">
                    <span>Auto-commit directly into your repository:</span>
                    <span className="font-mono text-emerald-400">aroshwijesinghe/ToDo</span>
                  </p>
                  <p className="text-[10px] opacity-75">
                    Any change you make will automatically commit to <code className="text-emerald-400">data/tasks.json</code> on GitHub!
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      GitHub Personal Access Token
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=ToDo+Database+Sync"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Create Token (1 min)</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={ghToken}
                    onChange={(e) => setGhToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-black/50 text-xs text-white font-mono"
                  />
                  <p className="text-[10px] opacity-50 mt-1">
                    Needs `repo` permission so it can update `data/tasks.json`. Stored safely only on your device.
                  </p>
                </div>

                {ghStatus && (
                  <div className={`p-2 rounded-xl text-[11px] font-medium border ${ghStatus.startsWith('✓') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                    {ghStatus}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  {gitHubConfig?.token && (
                    <button
                      type="button"
                      onClick={() => {
                        onSaveGitHubConfig(null);
                        setGhToken('');
                        setGhStatus('Disconnected GitHub database');
                      }}
                      className="px-3 py-1.5 text-xs text-rose-400 bg-rose-500/10 rounded-xl"
                    >
                      Disconnect GitHub
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isGhSyncing}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl ${themeConfig.classes.accentBtn}`}
                  >
                    {isGhSyncing ? 'Connecting...' : gitHubConfig?.token ? 'Update GitHub Token' : 'Connect & Commit'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Optional Supabase Database Connector */}
          <div className="border-t pt-3 border-white/10">
            <button
              type="button"
              onClick={() => setShowSupabase(prev => !prev)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold ${themeConfig.classes.badgeBg} ${themeConfig.classes.cardBorder}`}
            >
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Custom Supabase Database Connector (Optional)
              </span>
              <span>{showSupabase ? '▲' : '▼'}</span>
            </button>

            {showSupabase && (
              <form onSubmit={handleSaveSupabase} className="p-3 mt-2 rounded-xl border space-y-2.5 bg-black/20 border-white/10">
                <p className="text-[11px] opacity-70">
                  Connect your own private Supabase PostgreSQL project:
                </p>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project URL</label>
                  <input
                    type="text"
                    value={sbUrl}
                    onChange={(e) => setSbUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-black/40 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Anon API Key</label>
                  <input
                    type="password"
                    value={sbKey}
                    onChange={(e) => setSbKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIs..."
                    className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-black/40 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  {supabaseConfig && (
                    <button
                      type="button"
                      onClick={() => {
                        onSaveSupabaseConfig(null);
                        setSbUrl('');
                        setSbKey('');
                      }}
                      className="px-3 py-1 text-[11px] text-rose-400 bg-rose-500/10 rounded-lg"
                    >
                      Disconnect
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg ${themeConfig.classes.accentBtn}`}
                  >
                    Save Supabase Config
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
