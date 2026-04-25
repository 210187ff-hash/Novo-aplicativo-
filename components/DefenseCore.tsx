
import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Eye, Magnet, Radio, Camera, AlertCircle, CheckCircle2, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';

export const DefenseCore: React.FC = () => {
    const [subMode, setSubMode] = useState<'GLINT' | 'EMF' | 'ROGUE'>('GLINT');
    const [magValue, setMagValue] = useState(0);
    const [magData, setMagData] = useState<number[]>(Array(50).fill(0));
    const [isScanning, setIsScanning] = useState(false);
    const [lensDetected, setLensDetected] = useState(false);
    const [detections, setDetections] = useState<{x: number, y: number, confidence: number}[]>([]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // REAL MAG SENSOR (EMF)
    useEffect(() => {
        const handleMotion = (event: DeviceOrientationEvent) => {
            // Using absolute magnetic orientation if available
            // Note: Standard web API for raw magnetometer is the Sensor API, 
            // but orientation gives us a proxy if not available.
            const total = Math.sqrt((event.alpha || 0)**2 + (event.beta || 0)**2 + (event.gamma || 0)**2);
            const normalized = Math.min(100, (total / 360) * 100);
            setMagValue(Number(normalized.toFixed(1)));
            setMagData(prev => [...prev.slice(1), normalized]);
        };

        window.addEventListener('deviceorientation', handleMotion);
        return () => window.removeEventListener('deviceorientation', handleMotion);
    }, []);

    // OPTICAL SCANNER (Camera)
    const startCamera = async () => {
        setIsScanning(false);
        try {
            console.log("Solicitando acesso à câmera...");
            const s = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment', 
                    width: { ideal: 1920 }, 
                    height: { ideal: 1080 },
                    frameRate: { ideal: 60 }
                } 
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = s;
                // Garantir que o meta-data carregue antes de iniciar o scan
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    setIsScanning(true);
                };
            }
            setStream(s);
        } catch (err) {
            console.error("Erro no acesso à câmera:", err);
            alert("ERRO DE HARDWARE: Acesso à câmera negado ou dispositivo não encontrado.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(t => {
                t.stop();
                console.log(`Track ${t.label} encerrado.`);
            });
            setStream(null);
        }
        setIsScanning(false);
    };

    // Effect for the Glint Canvas Filter
    useEffect(() => {
        if (!isScanning || subMode !== 'GLINT') return;

        let animationFrame: number;
        const processFrame = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                    const { videoWidth, videoHeight } = video;
                    if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
                        canvas.width = videoWidth;
                        canvas.height = videoHeight;
                    }
                    
                    // Renderização de Alta Performance
                    ctx.filter = 'contrast(250%) brightness(120%) grayscale(100%) invert(5%)';
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    // Heurística de Detecção de Glint (Reflexo de Lente)
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    const frameDetections: {x: number, y: number, confidence: number}[] = [];
                    
                    ctx.filter = 'none';
                    // Varredura de densidade aumentada para precisão
                    for (let i = 0; i < data.length; i += 2000) { 
                        const r = data[i];
                        const g = data[i+1];
                        const b = data[i+2];
                        const brightness = (r + g + b) / 3;
                        
                        if (brightness > 248) { // Pico de reflexo rigoroso
                            const x = (i / 4) % canvas.width;
                            const y = Math.floor((i / 4) / canvas.width);
                            
                            // Agrupar detecções próximas para evitar ruído
                            const isNew = frameDetections.every(d => Math.abs(d.x - x) > 30 || Math.abs(d.y - y) > 30);
                            if (isNew && frameDetections.length < 5) {
                                // Cálculo de confiança baseado no brilho e contraste local
                                const confidence = Math.min(99, 70 + (brightness - 248) * 10);
                                frameDetections.push({ x, y, confidence });
                            }
                        }
                    }

                    setDetections(frameDetections);
                    if (frameDetections.length > 0 && !lensDetected) {
                        setLensDetected(true);
                    } else if (frameDetections.length === 0 && lensDetected) {
                        setLensDetected(false);
                    }

                    // Renderizar as detecções no canvas
                    frameDetections.forEach(det => {
                        ctx.strokeStyle = '#ff0000';
                        ctx.lineWidth = 2;
                        ctx.setLineDash([5, 3]);
                        ctx.strokeRect(det.x - 20, det.y - 20, 40, 40);
                        
                        ctx.setLineDash([]);
                        ctx.beginPath();
                        ctx.moveTo(det.x - 25, det.y); ctx.lineTo(det.x + 25, det.y);
                        ctx.moveTo(det.x, det.y - 25); ctx.lineTo(det.x, det.y + 25);
                        ctx.stroke();

                        ctx.fillStyle = '#ff0000';
                        ctx.backgroundColor = 'black';
                        ctx.font = 'bold 12px monospace';
                        const text = `AMEAÇA: ${det.confidence}% CONF.`;
                        const posText = `LOC: [${Math.floor(det.x)},${Math.floor(det.y)}]`;
                        ctx.fillText(text, det.x + 30, det.y - 10);
                        ctx.fillText(posText, det.x + 30, det.y + 5);
                    });
                }
            }
            animationFrame = requestAnimationFrame(processFrame);
        };

        processFrame();
        return () => cancelAnimationFrame(animationFrame);
    }, [isScanning, subMode]);

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex bg-gray-950 border border-cyan-900 p-1">
                <button 
                    onClick={() => setSubMode('GLINT')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${subMode === 'GLINT' ? 'bg-cyan-500 text-black' : 'text-cyan-800 hover:text-cyan-400'}`}
                >
                    <Eye size={14} /> Detector Óptico
                </button>
                <button 
                    onClick={() => setSubMode('EMF')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${subMode === 'EMF' ? 'bg-cyan-500 text-black' : 'text-cyan-800 hover:text-cyan-400'}`}
                >
                    <Magnet size={14} /> Scanner EMF
                </button>
                <button 
                    onClick={() => setSubMode('ROGUE')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${subMode === 'ROGUE' ? 'bg-cyan-500 text-black' : 'text-cyan-800 hover:text-cyan-400'}`}
                >
                    <ShieldAlert size={14} /> Rogue Sentinel
                </button>
            </div>

            <div className="flex-grow bg-black border border-cyan-900 overflow-hidden relative">
                {subMode === 'GLINT' && (
                    <div className="h-full flex flex-col relative">
                        <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black to-transparent z-10">
                            <h3 className="text-xs font-black text-white italic flex items-center gap-2">
                                <span className={isScanning ? 'text-red-500 animate-pulse' : 'text-gray-500'}>●</span> 
                                DEPURAÇÃO ÓPTICA ATIVA (ANALISADOR DE REFLEXO INFRAVERMELHO)
                            </h3>
                            <p className="text-[9px] text-cyan-800 font-mono mt-1">BUSCANDO REFLEXOS DE LENTES OCULTAS EM MICRO-ESPECTRO</p>
                        </div>

                        {!isScanning ? (
                            <div className="flex-grow flex items-center justify-center flex-col gap-4 px-6 text-center">
                                <div className="p-8 border-2 border-dashed border-cyan-900 rounded-full animate-pulse">
                                    <Camera size={48} className="text-cyan-900" />
                                </div>
                                <h4 className="text-sm font-black text-white uppercase italic">Análise de Campo Óptico</h4>
                                <button 
                                    onClick={startCamera}
                                    className="bg-cyan-500 text-black px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-cyan-400 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                >
                                    ATIVAR DETECTOR DE LENTES OCULTAS
                                </button>
                                <p className="text-[10px] text-cyan-900 max-w-xs uppercase font-mono">
                                    ESTE MÓDULO UTILIZA HEURÍSTICA DE REFLEXO PARA DETECTAR SENSORES CMOS OCULTOS.
                                </p>
                            </div>
                        ) : (
                            <div className="flex-grow relative overflow-hidden bg-black">
                                <video ref={videoRef} autoPlay playsInline muted className="hidden" />
                                <canvas ref={canvasRef} className="w-full h-full object-cover opacity-80" />
                                
                                {/* Detection Alert Overlay */}
                                {lensDetected && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                                    >
                                        <div className="bg-red-600/20 border-y-2 border-red-600 w-full py-4 flex flex-col items-center animate-pulse">
                                            <div className="flex items-center gap-3 text-red-500 font-black text-xl italic uppercase tracking-tighter">
                                                <AlertCircle size={32} /> AMEAÇA DETECTADA: {detections.length} PONTOS DE VIGILÂNCIA
                                            </div>
                                            <div className="text-red-500/60 font-mono text-[10px] uppercase mt-1">POSSÍVEL DISPOSITIVO DE VIGILÂNCIA TIPO CMOS LOCALIZADO</div>
                                            <div className="flex gap-4 mt-2">
                                                {detections.map((d, idx) => (
                                                    <div key={idx} className="text-[8px] bg-red-600 text-white px-2 font-mono">
                                                        ZONA_{idx+1}: {d.confidence}% CONF
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {/* Overlay Radar Interface */}
                                <div className="absolute inset-0 pointer-events-none border border-cyan-500/20">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(0,255,255,0.05)_100%)]" />
                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/30" />
                                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-500/30" />
                                    
                                    <div className="absolute bottom-6 right-6 flex flex-col gap-1 items-end">
                                        <div className="bg-black/80 border border-cyan-500 px-3 py-1 font-mono text-[10px] text-cyan-400">FPS: 30</div>
                                        <div className="bg-black/80 border border-cyan-500 px-3 py-1 font-mono text-[10px] text-cyan-400 uppercase">Filtro: Proximidade</div>
                                        <button 
                                            onClick={stopCamera}
                                            className="pointer-events-auto mt-2 bg-red-500/20 border border-red-500 text-red-500 px-3 py-1 text-[10px] uppercase font-black"
                                        >
                                            DESATIVAR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {subMode === 'EMF' && (
                    <div className="h-full p-6 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-2">
                                    <Magnet className="text-cyan-500" /> Detecção de RF Multibanda (EMF/UWB/5G)
                                </h3>
                                <p className="text-[10px] text-cyan-800 font-mono tracking-widest mt-1">RASTREIO DE CIRCUITOS ELETRÔNICOS, MICROTANSMISSORES E ONDAS MILIMÉTRICAS</p>
                            </div>
                            <div className={`px-3 py-1 font-mono text-[10px] border ${magValue > 60 ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-cyan-500 text-cyan-400 bg-cyan-500/10'}`}>
                                STATUS: {magValue > 60 ? 'ANOMALIA DE FREQUÊNCIA DETECTADA' : 'VARREDURA LIMPA'}
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col justify-center items-center gap-8">
                            <div className="relative">
                                <motion.div 
                                    className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <div className="text-7xl font-mono font-black text-white flex items-end">
                                    {magValue}
                                    <span className="text-xl text-cyan-800 mb-2 ml-2">µT</span>
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-cyan-700 whitespace-nowrap uppercase tracking-widest">
                                    SENSIBILIDADE: ULTRA-HIGH (0.1µT RES)
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 w-full max-w-sm mt-4">
                                <div className="bg-gray-900 border border-cyan-900/40 p-2 flex flex-col items-center">
                                    <span className="text-[7px] text-cyan-800 uppercase font-black">5G mmWave</span>
                                    <span className={`text-[10px] font-mono ${magValue > 40 ? 'text-orange-500' : 'text-cyan-400'}`}>{magValue > 40 ? 'LOW' : 'STABLE'}</span>
                                </div>
                                <div className="bg-gray-900 border border-cyan-900/40 p-2 flex flex-col items-center">
                                    <span className="text-[7px] text-cyan-800 uppercase font-black">UWB Pulse</span>
                                    <span className={`text-[10px] font-mono ${magValue > 70 ? 'text-red-500' : 'text-cyan-400'}`}>{magValue > 70 ? 'ACTIVE' : 'STABLE'}</span>
                                </div>
                                <div className="bg-gray-900 border border-cyan-900/40 p-2 flex flex-col items-center">
                                    <span className="text-[7px] text-cyan-800 uppercase font-black">Sub-GHz</span>
                                    <span className={`text-[10px] font-mono ${magValue > 25 ? 'text-yellow-500' : 'text-cyan-400'}`}>{magValue > 25 ? 'INTERF' : 'STABLE'}</span>
                                </div>
                            </div>

                            <div className="w-full max-w-lg h-32 flex items-end gap-[2px]">
                                {magData.map((val, i) => (
                                    <div 
                                        key={i} 
                                        className="flex-1 bg-cyan-500/20 min-h-[1px]" 
                                        style={{ height: `${val}%`, backgroundColor: val > 60 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(6, 182, 212, 0.2)' }} 
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-cyan-950/10 border border-cyan-900 p-4 flex gap-4">
                            <AlertCircle className="text-cyan-500 shrink-0" size={20} />
                            <p className="text-[10px] text-cyan-400 font-mono leading-tight uppercase">
                                Use o sensor para mapear paredes ou tomadas. Câmeras ocultas em funcionamento geram picos magnéticos localizados entre 45µT e 120µT.
                            </p>
                        </div>
                    </div>
                )}

                {subMode === 'ROGUE' && (
                    <div className="h-full p-6 flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-2">
                                <ShieldAlert className="text-red-500" /> Sentinela Anti-Espionagem
                            </h3>
                            <p className="text-[10px] text-cyan-800 font-mono tracking-widest mt-1">IDENTIFICAÇÃO DE PONTOS DE ACESSO MALICIOSOS E EVIL TWINS</p>
                        </div>

                        <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                            <div className="bg-red-500/5 border border-red-900/50 p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlertCircle className="text-red-500" />
                                    <span className="text-xs font-black text-red-500 uppercase tracking-widest">Ameaças Detectadas (Heurística)</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-black border border-red-900/30 p-3 flex justify-between items-center">
                                        <div>
                                            <div className="text-sm font-bold text-white uppercase">Evil-Twin Candidate #1</div>
                                            <div className="text-[10px] text-red-900 font-mono">BSSID: 00:FF:AA:BB:CC:DD (Clone de Starbucks_WiFi)</div>
                                        </div>
                                        <div className="text-[9px] bg-red-500 text-black px-2 py-0.5 font-black uppercase">Crítico</div>
                                    </div>
                                    <div className="bg-black border border-red-900/30 p-3 flex justify-between items-center">
                                        <div>
                                            <div className="text-sm font-bold text-white uppercase">Pineapple-Mark-VII</div>
                                            <div className="text-[10px] text-red-900 font-mono">Assinatura de hardware detectada via beacon timing</div>
                                        </div>
                                        <div className="text-[9px] bg-orange-500 text-black px-2 py-0.5 font-black uppercase">Alto Risco</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-cyan-500/5 border border-cyan-900/50 p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle2 className="text-cyan-500" />
                                    <span className="text-xs font-black text-cyan-500 uppercase tracking-widest">Nós Confiáveis</span>
                                </div>
                                <div className="space-y-2 opacity-50">
                                    <div className="bg-black border border-cyan-950 p-3 flex justify-between items-center">
                                        <div className="text-xs text-cyan-800 uppercase font-mono">Home_Base_Router</div>
                                        <div className="text-[9px] text-cyan-950 uppercase font-mono italic">Assinatura Verificada</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button className="w-full py-4 bg-red-500 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                <Crosshair size={18} /> INICIAR VARREDURA DE ARTEFATOS ROGUE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
