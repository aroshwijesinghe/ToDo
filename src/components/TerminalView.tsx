import React, { useState } from 'react';
import { Copy, Check, Terminal as TerminalIcon } from 'lucide-react';
import { TodoTask } from '../types/todo';
import { generateAsciiTable } from '../utils/helpers';

interface TerminalViewProps {
  tasks: TodoTask[];
  isDark?: boolean;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ tasks, isDark = true }) => {
  const [copied, setCopied] = useState(false);
  const asciiContent = generateAsciiTable(tasks);

  const handleCopy = () => {
    navigator.clipboard.writeText(asciiContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`border rounded-2xl overflow-hidden shadow-2xl transition-all ${
        isDark
          ? 'bg-[#18181b] border-white/[0.1] text-gray-200'
          : 'bg-[#1e1e24] border-black/[0.1] text-gray-200 shadow-xl'
      }`}
    >
      {/* macOS Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#141416] border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          {/* Traffic light buttons */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>
          <span className="text-xs font-mono text-white/60 ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            todo_terminal — zsh
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-white/80 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg border border-white/10 transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Output</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-5 sm:p-6 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm text-emerald-400/90 leading-relaxed selection:bg-emerald-500/30">
          {asciiContent}
        </pre>
      </div>
    </div>
  );
};
