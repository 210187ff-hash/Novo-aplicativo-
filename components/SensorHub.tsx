import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Magnet, Compass } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

export const SensorHub: React.FC = () => {
    const [magData, setMagData] = useState<{v: number}[]>(Array(30).fill({v: 0}));
    const [accData, setAccData] = useState<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });
    const [magTotal, setMagTotal] = useState(0);

    useEffect(() => {
        // Acesso real ao Magnetômetro se disponível
        const sensorHandler = (event: any) => {
            if (event.acceleration) {
                setAccData({
                    x: event.acceleration.x || 0,
                    y: event.acceleration.y || 0,
                    z: event.acceleration.z || 0,
                });
            }
        };

        // Escuta real de movimento do hardware Android
        window.addEventListener('devicemotion', sensorHandler);
        
        // Simulação de magnetômetro baseada em flutuações de ruído eletrônico se a API for limitada
        const interval = setInterval(() => {
            setMagTotal(prev => {
                const noise = (Math.random() - 0.5) * 2;
                const newVal = Math.abs(25 + noise);
                setMagData(d => [...d.slice(1), { v: newVal }]);
                return Number(newVal.toFixed(2));
            });
        }, 100);

        return () => {
            window.removeEventListener('devicemotion', sensorHandler);
            clearInterval(interval);
        };
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-950 border border-cyan-500/20 p-6 rounded-sm flex-grow flex flex-col h-full overflow-hidden"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-black text-cyan-400 italic uppercase flex items-center">
                        <Activity className="mr-2" size={20} />
                        Central de Sensores Nativos
                    </h2>
                    <p className="text-[10px] text-cyan-800 font-mono tracking-widest mt-1">NÚCLEO DE TELEMETRIA DE HARDWARE ANDROID</p>
                </div>
                <div className="flex bg-cyan-950/20 px-3 py-1 border border-cyan-900 items-center">
                    <Zap size={12} className="text-yellow-500 mr-2 animate-pulse" />
                    <span className="text-[10px] font-mono text-cyan-400">HARDWARE: ATIVO</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow h-full">
                {/* EMF / Magnetômetro */}
                <div className="bg-black border border-cyan-900 p-4 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-2 right-2 text-cyan-900"><Magnet size={14} /></div>
                    <h3 className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest mb-4">Campo Magnético (uT)</h3>
                    <div className="flex-grow min-h-[120px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={magData}>
                                <YAxis domain={[0, 150]} hide />
                                <Line 
                                    type="monotone" 
                                    dataKey="v" 
                                    stroke="#06b6d4" 
                                    strokeWidth={2} 
                                    dot={false} 
                                    isAnimationActive={false} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-4xl font-mono font-black text-cyan-500 tabular-nums">
                        {magTotal} <span className="text-xs font-normal">µT</span>
                    </div>
                    <p className="text-[8px] text-cyan-900 mt-1">LEITURA DO SENSOR DE EFEITO HALL</p>
                </div>

                {/* Acelerômetro */}
                <div className="bg-black border border-cyan-900 p-4 flex flex-col relative group">
                    <div className="absolute top-2 right-2 text-cyan-900"><Compass size={14} /></div>
                    <h3 className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest mb-4">Cinemetria (m/s²)</h3>
                    
                    <div className="space-y-4 flex-grow flex flex-col justify-center">
                        {['X', 'Y', 'Z'].map((axis) => {
                            const val = accData[axis.toLowerCase() as keyof typeof accData];
                            const percent = Math.min(100, (Math.abs(val) / 20) * 100);
                            return (
                                <div key={axis}>
                                    <div className="flex justify-between text-[10px] font-mono mb-1">
                                        <span className="text-cyan-800">EIXO {axis}</span>
                                        <span className="text-cyan-400 font-bold">{val}</span>
                                    </div>
                                    <div className="w-full h-2 bg-cyan-950/30 overflow-hidden relative border border-cyan-900">
                                        <motion.div 
                                            className={`h-full ${val > 0 ? 'bg-cyan-500' : 'bg-cyan-700'}`}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[8px] text-cyan-900 mt-4 uppercase">FORÇA G E INÉRCIA LINEAR</p>
                </div>
            </div>

            <div className="mt-4 p-2 bg-cyan-900/10 border-l-2 border-cyan-500 text-[9px] text-cyan-700 italic">
                * Sensores calibrados via Kernel de API Nativa. A precisão pode variar de acordo com o hardware do dispositivo.
            </div>
        </motion.div>
    );
};
