
import React, { useEffect, useRef } from 'react';
import { LogEntry, LogType } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
  foundPassword: string | null;
}

const getLogColor = (type: LogType) => {
    switch (type) {
      case LogType.SUCCESS: return 'text-green-500';
      case LogType.ERROR: return 'text-red-500';
      case LogType.ATTEMPT: return 'text-amber-500';
      case LogType.METHOD: return 'text-cyan-400 font-black';
      default: return 'text-cyan-800';
    }
};

export const LogPanel: React.FC<LogPanelProps> = ({ logs, foundPassword }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-950 border border-cyan-500/20 p-4 rounded-sm shadow-inner flex-grow flex flex-col min-h-0 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"></div>
      <h2 className="text-xs font-bold mb-3 text-cyan-700 uppercase tracking-[0.2em] border-b border-cyan-500/10 pb-2 flex justify-between items-center">
        <span>Terminal de Saída • Sessão Segura</span>
        <span className="text-[10px] lowercase italic opacity-50">kernel::stdout</span>
      </h2>
      {foundPassword && (
        <div className="bg-cyan-950/30 border border-cyan-500/50 p-6 rounded-sm mb-6 text-center animate-pulse">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Vulnerabilidade Confirmada: Chave Recuperada</h3>
          <p className="text-3xl font-mono font-black text-white mt-2 break-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {foundPassword}
          </p>
        </div>
      )}
      <div ref={scrollRef} className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        {logs.length > 0 ? (
          logs.map(log => (
            <div key={log.id} className="flex text-[11px] leading-relaxed mb-1 items-start group">
              <span className="text-cyan-900 mr-3 font-mono shrink-0">[{log.timestamp}]</span>
              <span className={`font-bold mr-3 shrink-0 min-w-[60px] ${getLogColor(log.type)}`}>
                {log.type}
              </span>
              <p className={`flex-1 break-words font-mono ${getLogColor(log.type)} opacity-90 group-hover:opacity-100`}>
                {log.message}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-20 italic space-y-2">
            <p className="text-sm">Aguardando entrada de dados...</p>
            <div className="w-48 h-[1px] bg-cyan-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};
