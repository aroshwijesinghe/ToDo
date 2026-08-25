import React, { useState } from 'react';
import { Copy, Check, Terminal as TerminalIcon } from 'lucide-react';
import { TodoTask } from '../types/todo';
import { generateAsciiTable } from '../utils/helpers';

interface TerminalViewProps {
  tasks: TodoTask[];
}

export const TerminalView: React.FC<TerminalViewProps> = ({ tasks }) => {
  const [copied, setCopied] = useState(false);
  const asciiContent = generateAsciiTable(tasks);

  const handleCopy = () => {
    navigator.clipboard.writeText(asciiContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#14161a] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1114] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-gray-400 ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            todo_priority_terminal.stdout
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700 rounded-md border border-gray-700 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy ASCII Table</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-6 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm text-gray-200 leading-relaxed selection:bg-emerald-500/30">
          {asciiContent}
        </pre>
      </div>
    </div>
  );
};
