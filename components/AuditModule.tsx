
import React from 'react';
import { WifiNetwork, LogEntry } from '../types';
import { WifiNetworkList } from './WifiNetworkList';
import { LogPanel } from './LogPanel';

interface AuditModuleProps {
    networks: WifiNetwork[];
    selectedNetwork: WifiNetwork | null;
    logs: LogEntry[];
    isScanning: boolean;
    isAttacking: boolean;
    foundPassword: string | null;
    onScan: () => void;
    onSelectNetwork: (net: WifiNetwork) => void;
    onStartAttack: () => void;
    onStopAttack: () => void;
    onOpenQr: () => void;
}

export const AuditModule: React.FC<AuditModuleProps> = ({
    networks,
    selectedNetwork,
    logs,
    isScanning,
    isAttacking,
    foundPassword,
    onScan,
    onSelectNetwork,
    onStartAttack,
    onStopAttack,
    onOpenQr
}) => {
    return (
        <div className="flex flex-col lg:flex-row flex-grow gap-4 min-h-0 overflow-hidden h-full">
            <div className="lg:w-80 flex flex-col gap-4 overflow-y-auto pr-1 h-full">
                <div className="bg-gray-950 border border-cyan-500/20 p-4 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                    <h2 className="text-sm font-bold mb-4 text-cyan-500 uppercase tracking-widest flex items-center border-b border-cyan-500/20 pb-2">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-pulse"></span>
                        Motor de Auditoria
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={onScan} 
                            disabled={isScanning || isAttacking} 
                            className="bg-cyan-950/20 hover:bg-cyan-500 hover:text-black border border-cyan-500/50 disabled:bg-gray-900 disabled:text-gray-600 disabled:border-gray-800 text-cyan-400 font-bold py-2 px-1 text-xs uppercase tracking-tighter transition-all duration-300"
                        >
                            {isScanning ? 'Escan... ' : 'Escanear'}
                        </button>
                        <button 
                            onClick={onOpenQr} 
                            disabled={!selectedNetwork || isAttacking} 
                            className="bg-blue-950/20 hover:bg-blue-500 hover:text-black border border-blue-500/50 disabled:bg-gray-900 disabled:text-gray-600 disabled:border-gray-800 text-blue-400 font-bold py-2 px-1 text-xs uppercase tracking-tighter transition-all duration-300"
                        >
                            Ver QR
                        </button>
                    </div>
                    {selectedNetwork && (
                        !isAttacking ? (
                            <button onClick={onStartAttack} className="w-full mt-3 bg-red-950/20 border border-red-500/50 hover:bg-red-500 hover:text-black text-red-500 font-bold py-2 px-4 text-xs uppercase tracking-widest transition-all duration-300">
                                Iniciar Auditoria: {selectedNetwork.ssid}
                            </button>
                        ) : (
                            <button onClick={onStopAttack} className="w-full mt-3 bg-yellow-950/20 border border-yellow-500/50 hover:bg-yellow-500 hover:text-black text-yellow-500 font-bold py-2 px-4 text-xs uppercase tracking-widest transition-all duration-300">
                                Parar
                            </button>
                        )
                    )}
                </div>
                <WifiNetworkList 
                    networks={networks}
                    selectedSsid={selectedNetwork?.ssid}
                    onSelect={onSelectNetwork}
                    isAttacking={isAttacking}
                />
            </div>
            
            <div className="flex-grow flex flex-col min-h-[400px] h-full">
                <LogPanel logs={logs} foundPassword={foundPassword}/>
            </div>
        </div>
    );
};
