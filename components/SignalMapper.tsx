
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Crosshair } from 'lucide-react';

interface GeoPoint {
    lat: number;
    lng: number;
    strength: number;
    timestamp: number;
}

export const SignalMapper: React.FC = () => {
    const [points, setPoints] = useState<GeoPoint[]>([]);
    const [currentPos, setCurrentPos] = useState<{lat: number, lng: number} | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [logs, setLogs] = useState<string[]>(['GPS: ENGINE IDLE']);

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString('pt-BR')}] ${msg}`, ...prev].slice(0, 5));

    useEffect(() => {
        let watchId: number;

        if (isTracking && navigator.geolocation) {
            addLog('GPS: INICIALIZANDO TRILATERAÇÃO...');
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setCurrentPos({ lat: latitude, lng: longitude });
                    const strength = Math.floor(Math.random() * -40) - 40;
                    
                    setPoints(prev => [...prev, {
                        lat: latitude,
                        lng: longitude,
                        strength,
                        timestamp: Date.now()
                    }]);
                    addLog(`TRANCADO: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} @ ${strength}dBm`);
                },
                (err) => {
                    addLog(`ERRO: ${err.message}`);
                    // Fallback simulation
                    const mockLat = -23.5505 + (Math.random() - 0.5) * 0.01;
                    const mockLng = -46.6333 + (Math.random() - 0.5) * 0.01;
                    setCurrentPos({ lat: mockLat, lng: mockLng });
                    setPoints(prev => [...prev, {
                        lat: mockLat,
                        lng: mockLng,
                        strength: Math.floor(Math.random() * -30) - 50,
                        timestamp: Date.now()
                    }]);
                },
                { enableHighAccuracy: true }
            );
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [isTracking]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-950 border border-cyan-500/20 p-6 rounded-sm flex-grow flex flex-col h-full bg-[radial-gradient(#083344_1px,transparent_1px)] [background-size:20px_20px]"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase flex items-center">
                        <MapPin className="mr-2 text-cyan-500" size={20} />
                        Mapeador de Sinais Espaciais
                    </h2>
                    <p className="text-[10px] text-cyan-800 font-mono tracking-widest mt-1">MOTOR DE REGISTRO GEOSESPACIAL WAR-DRIVING</p>
                </div>
                <button
                    onClick={() => setIsTracking(!isTracking)}
                    className={`border px-6 py-2 text-xs font-black uppercase transition-all ${
                        isTracking 
                        ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black' 
                        : 'border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black'
                    }`}
                >
                    {isTracking ? 'PARAR RASTREIO' : 'INICIAR GRID SCAN'}
                </button>
            </div>

            <div className="flex-grow relative border border-cyan-900 overflow-hidden bg-black/40">
                {/* Grid Visualizer */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <Crosshair size={400} className="text-cyan-500" />
                </div>

                {/* Simulated Map Points */}
                <div className="absolute inset-0 p-10 flex items-center justify-center">
                    {points.slice(-30).map((p, i) => {
                        // Strength range roughly -40 (hot/strong) to -90 (cold/weak)
                        const normalized = Math.min(1, Math.max(0, (p.strength + 90) / 50));
                        // Heatmap color mapping (Cyan -> Green -> Yellow -> Red)
                        const hue = normalized * 180; // 0 (Red) to 180 (Cyan) - Reversed for logical heat
                        const color = `hsla(${200 - normalized * 200}, 100%, 50%, ${1 - (points.length - 1 - i) * 0.03})`;
                        
                        return (
                            <motion.div
                                key={p.timestamp}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute rounded-full blur-[2px]"
                                style={{
                                    left: `${50 + (p.lng - (currentPos?.lng || 0)) * 5000}%`,
                                    top: `${50 + (p.lat - (currentPos?.lat || 0)) * 5000}%`,
                                    width: `${8 + normalized * 8}px`,
                                    height: `${8 + normalized * 8}px`,
                                    backgroundColor: color,
                                    boxShadow: `0 0 ${10 + normalized * 10}px ${color}`,
                                    zIndex: Math.floor(normalized * 10)
                                }}
                            />
                        );
                    })}
                    {currentPos && (
                        <div className="absolute w-6 h-6 border-2 border-white rounded-full flex items-center justify-center z-50">
                            <Navigation size={12} className="text-white animate-bounce" />
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 left-4 bg-black/80 border border-cyan-950 p-2 font-mono text-[9px]">
                    {logs.map((log, i) => (
                        <div key={i} className={i === 0 ? 'text-cyan-400' : 'text-cyan-900 italic'}>{log}</div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-cyan-950 pt-4">
                <div className="bg-cyan-950/20 p-2 border border-cyan-900">
                    <p className="text-[8px] uppercase text-cyan-800 mb-1">Coordenadas Atuais</p>
                    <p className="text-xs font-mono text-cyan-400">
                        {currentPos ? `${currentPos.lat.toFixed(6)}, ${currentPos.lng.toFixed(6)}` : 'AGUARDANDO LOCK'}
                    </p>
                </div>
                <div className="bg-cyan-950/20 p-2 border border-cyan-900">
                    <p className="text-[8px] uppercase text-cyan-800 mb-1">Nodos Descobertos</p>
                    <p className="text-xs font-mono text-cyan-400">{points.length} IDENTIFICADOS</p>
                </div>
            </div>
        </motion.div>
    );
};
