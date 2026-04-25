
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const generateData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
        freq: `${2400 + i * 5}MHz`,
        level: Math.floor(Math.random() * -40) - 50,
        noise: Math.floor(Math.random() * -10) - 90,
    }));
};

export const RFAnalyzer: React.FC = () => {
    const [data, setData] = useState(generateData());
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        if (!isScanning) return;
        const interval = setInterval(() => {
            setData(generateData());
        }, 800);
        return () => clearInterval(interval);
    }, [isScanning]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-950 border border-cyan-500/20 p-6 rounded-sm flex-grow flex flex-col h-full"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-black text-cyan-400 italic uppercase">Análise de Ruído Espectral</h2>
                    <p className="text-[10px] text-cyan-800 font-mono tracking-widest">SONDA TRANSTORNADORA IS BAND 2.4GHz / 5.8GHz</p>
                </div>
                <button 
                    onClick={() => setIsScanning(!isScanning)}
                    className={`px-4 py-1 text-[10px] font-bold border transition-all ${
                        isScanning 
                        ? 'border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black' 
                        : 'border-cyan-500/50 text-cyan-500 hover:bg-cyan-500 hover:text-black'
                    }`}
                >
                    {isScanning ? 'PARAR SONDA' : 'RETOMAR SCAN'}
                </button>
            </div>

            <div className="flex-grow min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="freq" 
                            stroke="#083344" 
                            fontSize={10} 
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            domain={[-110, -30]} 
                            stroke="#083344" 
                            fontSize={10} 
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'dBm', angle: -90, position: 'insideLeft', fill: '#083344' }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #164e63', fontSize: '10px' }}
                            itemStyle={{ color: '#22d3ee' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="level" 
                            stroke="#22d3ee" 
                            fillOpacity={1} 
                            fill="url(#colorLevel)" 
                            isAnimationActive={false}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="noise" 
                            stroke="#083344" 
                            fill="none" 
                            strokeDasharray="2 2"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 border-t border-cyan-500/10 pt-4">
                <div className="text-center">
                    <p className="text-[9px] text-cyan-900 font-bold uppercase mb-1">Amplitude Máxima</p>
                    <p className="text-lg font-mono text-cyan-400">-{Math.abs(Math.min(...data.map(d => d.level)))}dBm</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] text-cyan-900 font-bold uppercase mb-1">Piso de Ruído</p>
                    <p className="text-lg font-mono text-cyan-800">-94dBm</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] text-cyan-900 font-bold uppercase mb-1">Canais Ativos</p>
                    <p className="text-lg font-mono text-cyan-600">03</p>
                </div>
            </div>
        </motion.div>
    );
};
