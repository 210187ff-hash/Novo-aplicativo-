import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Battery, HardDrive, Info, Gauge } from 'lucide-react';

interface HardwareState {
    battery: { level: number; charging: boolean };
    memory: number | null;
    cores: number;
    platform: string;
    connection: { type: string; downlink: number; rtt: number };
}

export const HardwareInfo: React.FC = () => {
    const [hw, setHw] = useState<HardwareState>({
        battery: { level: 0, charging: false },
        memory: null,
        cores: navigator.hardwareConcurrency || 0,
        platform: navigator.platform,
        connection: { type: 'unknown', downlink: 0, rtt: 0 }
    });

    useEffect(() => {
        // Battery API
        if ((navigator as any).getBattery) {
            (navigator as any).getBattery().then((batt: any) => {
                const updateBattery = () => {
                    setHw(prev => ({
                        ...prev,
                        battery: { level: Math.round(batt.level * 100), charging: batt.charging }
                    }));
                };
                updateBattery();
                batt.addEventListener('levelchange', updateBattery);
                batt.addEventListener('chargingchange', updateBattery);
            });
        }

        // Network Information API
        const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (conn) {
            const updateConn = () => {
                setHw(prev => ({
                    ...prev,
                    connection: {
                        type: conn.effectiveType || 'unknown',
                        downlink: conn.downlink || 0,
                        rtt: conn.rtt || 0
                    }
                }));
            };
            updateConn();
            conn.addEventListener('change', updateConn);
        }

        // Memory API (Chrome/Android only)
        if ((performance as any).memory) {
            setHw(prev => ({
                ...prev,
                memory: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
            }));
        }
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-950 border border-cyan-500/20 p-6 rounded-sm flex-grow flex flex-col h-full overflow-y-auto"
        >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase flex items-center">
                        <Cpu className="mr-2 text-cyan-500" size={20} />
                        Kernel & Telemetria do Sistema
                    </h2>
                    <p className="text-[10px] text-cyan-800 font-mono tracking-widest mt-1">ESTADO REAL DOS RECURSOS DO DISPOSITIVO</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 font-mono text-[10px] text-cyan-400">
                    SISTEMA: {hw.platform}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bateria */}
                <div className="bg-black border border-cyan-950 p-4 relative group hover:border-cyan-500/40 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest">Fonte de Energia</h3>
                        <Battery size={14} className={hw.battery.charging ? 'text-green-500 animate-pulse' : 'text-cyan-900'} />
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-mono font-black text-white">{hw.battery.level}%</span>
                        <span className="text-[10px] text-cyan-800 mb-2 font-mono">{hw.battery.charging ? '[CARREGANDO]' : '[DESCARREGANDO]'}</span>
                    </div>
                    <div className="mt-4 w-full h-1 bg-cyan-950">
                        <motion.div 
                            className="h-full bg-cyan-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${hw.battery.level}%` }}
                        />
                    </div>
                </div>

                {/* Processador */}
                <div className="bg-black border border-cyan-950 p-4 relative group hover:border-cyan-500/40 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest">Arquitetura de CPU</h3>
                        <Gauge size={14} className="text-cyan-900" />
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-mono font-black text-white">{hw.cores}</span>
                        <span className="text-[10px] text-cyan-800 mb-2 font-mono">NÚCLEOS DETECTADOS</span>
                    </div>
                    <p className="text-[9px] text-cyan-950 mt-4 uppercase">Paralelismo de hardware ativo</p>
                </div>

                {/* Memória */}
                <div className="bg-black border border-cyan-950 p-4 relative group hover:border-cyan-500/40 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest">Alocação de Memória</h3>
                        <HardDrive size={14} className="text-cyan-900" />
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-mono font-black text-white">{hw.memory || '??'}</span>
                        <span className="text-[10px] text-cyan-800 mb-2 font-mono">MB HEAP LIMIT</span>
                    </div>
                    <p className="text-[9px] text-cyan-950 mt-4 uppercase">Memória volátil disponível para o processo</p>
                </div>

                {/* Rede Real */}
                <div className="bg-black border border-cyan-950 p-4 relative group hover:border-cyan-500/40 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest">Conectividade Real</h3>
                        <Info size={14} className="text-cyan-900" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                            <span className="text-cyan-800">TIPO DE REDE:</span>
                            <span className="text-cyan-400 font-bold uppercase">{hw.connection.type}</span>
                        </div>
                        <div className="flex justify-between text-xs font-mono">
                            <span className="text-cyan-800">LARGURA DE BANDA:</span>
                            <span className="text-cyan-400 font-bold">{hw.connection.downlink} Mbps</span>
                        </div>
                        <div className="flex justify-between text-xs font-mono">
                            <span className="text-cyan-800">LATÊNCIA (RTT):</span>
                            <span className="text-cyan-400 font-bold">{hw.connection.rtt} ms</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 flex gap-4">
                <div className="flex-grow p-3 bg-cyan-950/10 border-l border-cyan-500">
                    <p className="text-[9px] text-cyan-700 uppercase font-black mb-1">Nota do Desenvolvedor</p>
                    <p className="text-[10px] text-cyan-800 italic leading-tight uppercase">
                        Dados extraídos via WebHardware API. Para acesso total à lista de redes Wi-Fi (Scannig), é necessária a instalação do binário nativo para contornar o Sandbox do navegador.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
