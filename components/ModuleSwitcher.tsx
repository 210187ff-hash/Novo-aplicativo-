
import React from 'react';
import { AppMode } from '../types';
import { Radar, Wifi, Bluetooth, Map as MapIcon, Activity, ShieldCheck, ShieldAlert, Cpu, Lock, Terminal, Globe, Brain } from 'lucide-react';

interface ModuleSwitcherProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModuleSwitcher: React.FC<ModuleSwitcherProps> = ({ currentMode, onModeChange }) => {
  const modules = [
    { id: AppMode.SCANNER, icon: Wifi, label: 'Auditoria' },
    { id: AppMode.AI_ADVISOR, icon: Brain, label: 'IA de Ataque' },
    { id: AppMode.CYBER_THREAT, icon: Globe, label: 'Geo-Ameaças' },
    { id: AppMode.TOOLSET_EXPANDED, icon: Terminal, label: 'Arsenal' },
    { id: AppMode.DEFENSE_CORE, icon: Lock, label: 'Defesa' },
    { id: AppMode.PROTOCOL_ANALYSIS, icon: ShieldAlert, label: 'Protocolos' },
    { id: AppMode.RF_ANALYZER, icon: Radar, label: 'Espectro' },
    { id: AppMode.BT_SCANNER, icon: Bluetooth, label: 'Bluetooth' },
    { id: AppMode.LOCATION_MAP, icon: MapIcon, label: 'Mapa SIG' },
    { id: AppMode.PORT_SCANNER, icon: ShieldCheck, label: 'Portas' },
    { id: AppMode.SENSOR_HUB, icon: Activity, label: 'Sensores' },
    { id: AppMode.HARDWARE_INFO, icon: Cpu, label: 'Sistema' },
  ];

  return (
    <div className="flex flex-row lg:flex-col gap-2 mb-4 lg:mb-0 overflow-x-auto lg:overflow-y-auto lg:h-full lg:w-20 lg:min-w-[5rem] no-scrollbar">
      {modules.map((mod) => (
        <button
          key={mod.id}
          onClick={() => onModeChange(mod.id)}
          className={`flex flex-col items-center justify-center p-3 rounded-sm border transition-all duration-300 group shrink-0
            ${currentMode === mod.id 
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
              : 'bg-gray-950 border-cyan-500/10 text-cyan-900 hover:border-cyan-500/40 hover:text-cyan-700'
            }`}
        >
          <mod.icon size={16} className={currentMode === mod.id ? 'animate-pulse' : ''} />
          <span className="text-[8px] uppercase font-black tracking-tighter mt-1 text-center leading-tight">{mod.label}</span>
        </button>
      ))}
    </div>
  );
};
