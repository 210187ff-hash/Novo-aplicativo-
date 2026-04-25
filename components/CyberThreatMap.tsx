
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface Threat {
    id: number;
    origin: string;
    target: string;
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    timestamp: string;
}

export const CyberThreatMap: React.FC = () => {
    const [threats, setThreats] = useState<Threat[]>([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const types = ['DDoS Attack', 'SQL Injection', 'Brute Force', 'SSH Probe', 'Buffer Overflow'];
        const origins = ['Rússia', 'China', 'EUA', 'Brasil', 'Alemanha', 'Japão', 'Coreia do Norte'];
        const targets = ['Mainframe-UX-01', 'Cloud-DB-Alpha', 'Edge-Router-7', 'Secure-Gateway'];

        const interval = setInterval(() => {
            const newThreat: Threat = {
                id: Date.now(),
                origin: origins[Math.floor(Math.random() * origins.length)],
                target: targets[Math.floor(Math.random() * targets.length)],
                type: types[Math.floor(Math.random() * types.length)],
                severity: Math.random() > 0.8 ? 'HIGH' : Math.random() > 0.5 ? 'MEDIUM' : 'LOW',
                timestamp: new Date().toLocaleTimeString('pt-BR')
            };
            setThreats(prev => [newThreat, ...prev].slice(0, 8));
            setCounter(c => c + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-950 border border-cyan-900 p-6 rounded-sm h-full flex flex-col gap-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase flex items-center gap-2">
                        <Globe className="text-cyan-500" /> Monitor Global de Ameaças
                    </h2>
                    <p className="text-[10px] text-cyan-800 font-mono tracking-widest mt-1">SENTINELA DE TRÁFEGO DE ALTO RISCO EM TEMPO REAL</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 font-mono text-[10px] text-cyan-400">
                    SESSÕES ATIVAS: {counter}
                </div>
            </div>

            <div className="flex-grow flex flex-col gap-4">
                <div className="h-48 bg-black border border-cyan-950 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="w-40 h-40 border border-cyan-500/30 rounded-full flex items-center justify-center"
                    >
                        <div className="w-32 h-32 border border-cyan-500/20 rounded-full flex items-center justify-center">
                            <div className="w-1 h-20 bg-cyan-500/50 absolute top-0 origin-bottom"></div>
                        </div>
                    </motion.div>
                    <div className="absolute text-[10px] font-black text-cyan-500/40 uppercase tracking-widest">
                        VARREDURA DE BACKBONE ATIVA
                    </div>
                </div>

                <div className="flex-grow space-y-2 overflow-y-auto pr-1">
                    {threats.map((t) => (
                        <motion.div 
                            key={t.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-3 border flex justify-between items-center transition-all ${
                                t.severity === 'HIGH' ? 'bg-red-500/10 border-red-500/50' : 
                                t.severity === 'MEDIUM' ? 'bg-orange-500/10 border-orange-500/30' : 
                                'bg-gray-900 border-cyan-950'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {t.severity === 'HIGH' ? <AlertTriangle className="text-red-500" size={16} /> : <Activity className="text-cyan-500" size={16} />}
                                <div>
                                    <div className="text-[10px] font-black text-white uppercase">{t.type}</div>
                                    <div className="text-[8px] text-cyan-900 font-mono uppercase italic">{t.origin} {'>>'} {t.target}</div>
                                </div>
                            </div>
                            <div className="text-[9px] font-mono text-cyan-700">{t.timestamp}</div>
                        </motion.div>
                    ))}
                    {threats.length === 0 && (
                        <div className="h-full flex items-center justify-center text-cyan-900 italic text-xs uppercase">
                            Sincronizando com satélites de inteligência...
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-cyan-900">
                <ShieldCheck className="text-cyan-500" size={24} />
                <div className="flex-grow h-1 bg-cyan-950">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="h-full bg-cyan-500"
                    />
                </div>
                <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest whitespace-nowrap">DEFESA ATIVA</div>
            </div>
        </div>
    );
};
