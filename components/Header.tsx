
import React from 'react';

export const Header: React.FC = () => (
  <header className="mb-6 text-left border-b border-cyan-500/30 pb-4 flex items-center justify-between">
    <div>
      <h1 className="text-2xl md:text-3xl font-black text-cyan-400 tracking-tighter uppercase italic">
        Aegis <span className="text-cyan-600 not-italic">KERNEL Native</span>
      </h1>
      <p className="text-xs font-mono text-cyan-700 uppercase tracking-widest mt-1">Acesso Direto ao Hardware • Nível: ROOT ACTIVE</p>
    </div>
    <div className="hidden md:block text-right font-mono text-[10px] text-cyan-800">
      <div>HARDWARE: CONECTADO</div>
      <div>MÓDULOS NATIVOS: ATIVOS</div>
    </div>
  </header>
);
