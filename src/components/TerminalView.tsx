import React, { useState } from 'react';
import { Copy, Check, Terminal as TerminalIcon } from 'lucide-react';
import { TodoTask } from '../types/todo';
import { ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { generateAsciiTable } from '../utils/helpers';

interface TerminalViewProps {
  tasks: TodoTask[];
  theme?: ThemeMode;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ tasks, theme = 'dark' }) => {
  const [copied, setCopied] = useState(false);
  const asciiContent = generateAsciiTable(tasks);
  const themeConfig = THEME_CONFIGS[theme];

  const handleCopy = () => {
    navigator.clipboard.writeText(asciiContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${themeConfig.classes.cardBg} ${themeConfig.classes.cardBorder}`}
    >
      {/* macOS Terminal Title Bar */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${themeConfig.classes.tableHeaderBg}`}>
        <div className="flex items-center gap-3">
          {/* Traffic light buttons with interactive hover */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:scale-125 transition-transform cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:scale-125 transition-transform cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:scale-125 transition-transform cursor-pointer" />
          </div>
          <span className={`text-xs font-mono ml-2 flex items-center gap-1.5 ${themeConfig.classes.textMuted}`}>
            <TerminalIcon className="w-3.5 h-3.5" style={{ color: themeConfig.accentHex }} />
            todo_terminal — {themeConfig.name.toLowerCase().replace(/\s+/g, '_')}.zsh
          </span>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 ${themeConfig.classes.inputBg} ${themeConfig.classes.cardBorder} ${themeConfig.classes.textPrimary}`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" style={{ color: themeConfig.accentHex }} />
              <span style={{ color: themeConfig.accentHex }} className="font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 opacity-70" />
              <span>Copy Output</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Body with glowing font */}
      <div className="p-5 sm:p-6 overflow-x-auto">
        <pre
          className="font-mono text-xs sm:text-sm leading-relaxed selection:bg-white/20 transition-colors"
          style={{ color: themeConfig.accentHex }}
        >
          {asciiContent}
        </pre>
      </div>
    </div>
  );
};
