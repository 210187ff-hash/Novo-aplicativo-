
import React from 'react';
import { WifiNetwork } from '../types';

interface WifiNetworkListProps {
    networks: WifiNetwork[];
    selectedSsid: string | null;
    onSelect: (network: WifiNetwork) => void;
    isAttacking: boolean;
}

const getSignalIcon = (level: number) => {
    if (level > -60) return '■■■■'; 
    if (level > -75) return '■■■□';  
    if (level > -90) return '■■□□';   
    return '■□□□';    
};

const getSignalColor = (level: number) => {
    if (level > -60) return 'text-cyan-400';
    if (level > -75) return 'text-cyan-600';
    if (level > -90) return 'text-cyan-800';
    return 'text-red-900';
};

const getSecurityType = (capabilities: string) => {
    if (capabilities.includes('[OPEN]')) return { text: 'ABERTA', color: 'text-green-500' };
    if (capabilities.includes('[WPA2-PSK]') || capabilities.includes('[WPA-PSK]')) return { text: 'WPA2', color: 'text-cyan-400' };
    if (capabilities.includes('[WPA2-EAP]')) return { text: 'EAP', color: 'text-cyan-600' };
    if (capabilities.includes('[WEP]')) return { text: 'WEP', color: 'text-amber-500' };
    return { text: '????', color: 'text-gray-600' };
}

export const WifiNetworkList: React.FC<WifiNetworkListProps> = ({ networks, selectedSsid, onSelect, isAttacking }) => (
    <div className="bg-gray-950 border border-cyan-500/20 p-4 rounded-sm shadow-lg flex-grow flex flex-col min-h-0">
        <h2 className="text-[10px] font-bold mb-4 text-cyan-600 uppercase tracking-[0.3em] border-b border-cyan-500/10 pb-2">
            Resultados do Scan Espectral
        </h2>
        <div className="overflow-y-auto flex-grow pr-1 space-y-1 scrollbar-hide">
            {networks.length > 0 ? networks.map(net => {
                const isSelected = net.ssid === selectedSsid;
                const security = getSecurityType(net.capabilities);
                return (
                    <button 
                        key={net.bssid} 
                        onClick={() => onSelect(net)}
                        disabled={isAttacking}
                        className={`w-full text-left p-2 rounded-none transition-all flex justify-between items-center group relative border ${
                            isSelected 
                                ? 'bg-cyan-500/10 border-cyan-500/50' 
                                : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                        } disabled:cursor-not-allowed disabled:opacity-30`}
                    >
                        {isSelected && <div className="absolute left-0 top-0 w-[2px] h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>}
                        <div className="flex-1 min-w-0 pr-2">
                            <p className={`font-mono text-xs truncate ${isSelected ? 'text-cyan-400 font-bold' : 'text-gray-400'}`}>
                                {net.ssid}
                            </p>
                            <p className="text-[9px] text-cyan-900 font-mono tracking-tighter uppercase">{net.bssid}</p>
                        </div>
                        <div className="text-right text-[10px] flex items-center space-x-3 shrink-0">
                            <div className="flex flex-col items-end">
                                <span className={`font-black ${security.color}`}>{security.text}</span>
                                <span className={`${getSignalColor(net.level)} font-mono text-[8px]`}>{getSignalIcon(net.level)}</span>
                            </div>
                            <span className="text-cyan-900 font-mono w-10 text-[9px] font-bold">{net.level}dBm</span>
                        </div>
                    </button>
                )
            }) : <p className="text-cyan-900 text-[10px] uppercase font-bold text-center mt-10">Iniciando Sonda...</p>}
        </div>
        <div className="mt-4 pt-2 border-t border-cyan-500/10 flex justify-between items-center text-[9px] text-cyan-950 font-mono italic">
            <span>TOTAL DE NODOS: {networks.length}</span>
            <span>AUTO_SCAN: OFF</span>
        </div>
    </div>
);
