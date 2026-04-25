
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, Cpu, Zap, Radio, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProtocolInfo {
  name: string;
  security: string;
  encryption: string;
  vulnerabilities: string[];
  handshakeType: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

const PROTOCOLS: ProtocolInfo[] = [
  {
    name: 'WPA3-SAE',
    security: 'SAE (Autenticação Simultânea de Iguais)',
    encryption: 'AES-GCM-256',
    vulnerabilities: ['Dragonblood (Side-channel)', 'Bugs de Implementação'],
    handshakeType: 'Troca de Chaves Dragonfly',
    riskLevel: 'Low',
  },
  {
    name: 'WPA2-PSK',
    security: 'Chave Pré-Compartilhada',
    encryption: 'AES-CCMP',
    vulnerabilities: ['KRACK (Ataque de Reinstalação de Chaves)', 'Força Bruta Offline'],
    handshakeType: 'Handshake de 4 Vias',
    riskLevel: 'Medium',
  },
  {
    name: 'WPA-TKIP',
    security: 'Temporal Key Integrity Protocol',
    encryption: 'RC4 / TKIP',
    vulnerabilities: ['Ataque ChopChop', 'Ataque Beck-Tews', 'Manipulação MIC'],
    handshakeType: 'Handshake de 4 Vias (Legado)',
    riskLevel: 'High',
  },
  {
    name: 'WPA2-EAP',
    security: '802.1X Enterprise',
    encryption: 'AES-CCMP',
    vulnerabilities: ['Rogue AP / Evil Twin', 'Falhas na Validação de Certificado'],
    handshakeType: 'EAP-TLS / PEAP / EAP-TTLS',
    riskLevel: 'Low',
  },
  {
    name: 'WEP',
    security: 'Wired Equivalent Privacy',
    encryption: 'RC4 (Chave Estática)',
    vulnerabilities: ['Ataque FMS', 'Ataque KoreK', 'Ataque PTW (Injeção)'],
    handshakeType: 'Chave Compartilhada / Sistema Aberto',
    riskLevel: 'Critical',
  }
];

export const ProtocolAnalyzer: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [handshakeStatus, setHandshakeStatus] = useState<'IDLE' | 'CAPTURING' | 'SUCCESS' | 'FAILED'>('IDLE');

  const selected = PROTOCOLS[selectedIdx];

  const handleCapture = () => {
    setIsCapturing(true);
    setHandshakeStatus('CAPTURING');
    setCaptureProgress(0);
  };

  useEffect(() => {
    if (isCapturing) {
      const interval = setInterval(() => {
        setCaptureProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsCapturing(false);
            setHandshakeStatus(Math.random() > 0.2 ? 'SUCCESS' : 'FAILED');
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isCapturing]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Protocol Sidebar */}
        <div className="bg-gray-950 border border-cyan-900 p-4 flex flex-col gap-2 overflow-y-auto">
          <h3 className="text-xs font-black text-cyan-600 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Cpu size={14} /> Protocolos Detectados
          </h3>
          {PROTOCOLS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => {
                setSelectedIdx(i);
                setHandshakeStatus('IDLE');
              }}
              className={`text-left p-3 border transition-all ${
                selectedIdx === i 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                  : 'bg-black border-cyan-950 text-cyan-800 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{p.name}</span>
                <span className={`text-[9px] px-1 rounded uppercase font-black ${
                  p.riskLevel === 'Low' ? 'bg-green-500/20 text-green-500' :
                  p.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                  p.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {p.riskLevel === 'Low' ? 'Baixo' :
                   p.riskLevel === 'Medium' ? 'Médio' :
                   p.riskLevel === 'High' ? 'Alto' : 'Crítico'}
                </span>
              </div>
              <div className="text-[10px] mt-1 opacity-60 uppercase">{p.encryption}</div>
            </button>
          ))}
        </div>

        {/* Details Area */}
        <div className="md:col-span-2 flex flex-col gap-4 overflow-y-auto pr-2">
          {/* Detailed Info Card */}
          <div className="bg-gray-950 border border-cyan-900 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Shield size={120} />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-sm">
                {selected.riskLevel === 'Critical' ? <Unlock size={32} className="text-red-500" /> : <Lock size={32} className="text-cyan-400" />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{selected.name}</h2>
                <div className="text-xs text-cyan-600 font-mono tracking-wider">{selected.security}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[10px] text-cyan-700 uppercase font-bold mb-2 tracking-widest">Vulnerabilidades Conhecidas</h4>
                <ul className="space-y-2">
                  {selected.vulnerabilities.map(v => (
                    <li key={v} className="flex items-center gap-2 text-xs text-cyan-200">
                      <AlertTriangle size={12} className="text-orange-500" /> {v}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] text-cyan-700 uppercase font-bold mb-2 tracking-widest">Mecanismo de Handshake</h4>
                <div className="text-xs text-white bg-black/50 p-3 border border-cyan-900/50 rounded-sm font-mono flex items-center gap-2">
                  <Radio size={14} className="text-cyan-500" /> {selected.handshakeType}
                </div>
              </div>
            </div>
          </div>

          {/* Handshake Capture Simulator */}
          <div className="bg-gray-950 border border-cyan-900 p-6">
            <h3 className="text-xs font-black text-cyan-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={14} /> Captura de Handshake (4-Way / SAE)
            </h3>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-grow">
                   <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                     <span className="text-cyan-700">Progresso da Captura</span>
                     <span className="text-cyan-400">{captureProgress}%</span>
                   </div>
                   <div className="h-1 bg-cyan-950 rounded-full overflow-hidden">
                     <motion.div 
                        className="h-full bg-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${captureProgress}%` }}
                     />
                   </div>
                </div>
                <button 
                  onClick={handleCapture}
                  disabled={isCapturing}
                  className={`px-6 py-3 font-black text-xs uppercase tracking-widest transition-all ${
                    isCapturing 
                      ? 'bg-cyan-900/20 text-cyan-800 border border-cyan-900/30 cursor-not-allowed'
                      : 'bg-cyan-500 text-black hover:bg-cyan-400 border border-cyan-400 active:scale-95'
                  }`}
                >
                  {isCapturing ? 'Capturando...' : 'Iniciar Captura'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['AUTH_REQ', 'ASSOC_REQ', 'EAPOL_KEY_1', 'EAPOL_KEY_2'].map((step, idx) => {
                   const isAwaiting = handshakeStatus === 'IDLE';
                   const isRunning = handshakeStatus === 'CAPTURING' && captureProgress > (idx * 25);
                   const isDone = handshakeStatus === 'SUCCESS' || (handshakeStatus === 'CAPTURING' && captureProgress > ((idx + 1) * 25));
                   const isError = handshakeStatus === 'FAILED' && captureProgress > (idx * 25);

                   return (
                     <div 
                        key={step} 
                        className={`p-2 border text-center transition-colors ${
                          isDone ? 'border-green-500/50 bg-green-500/5 text-green-500' :
                          isError ? 'border-red-500/50 bg-red-500/5 text-red-500' :
                          isRunning ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' :
                          'border-cyan-900/30 bg-black/50 text-cyan-900'
                        }`}
                      >
                        <div className="text-[9px] font-black">{step}</div>
                        <div className="mt-1">
                          {isDone ? <CheckCircle2 size={12} className="mx-auto" /> : 
                           isError ? <AlertTriangle size={12} className="mx-auto" /> :
                           isRunning ? <Search size={12} className="mx-auto animate-spin" /> :
                           <div className="w-3 h-3 border border-cyan-900 rounded-full mx-auto" />}
                        </div>
                     </div>
                   );
                })}
              </div>

              {handshakeStatus === 'SUCCESS' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/50 p-4 flex items-center gap-3"
                >
                  <CheckCircle2 className="text-green-500" />
                  <div>
                    <div className="text-xs font-black text-green-500 uppercase tracking-widest">Handshake Capturado com Sucesso</div>
                    <div className="text-[10px] text-green-300 font-mono mt-1">Hash capturado (WPA-PSK): {Math.random().toString(16).substring(2, 32)}</div>
                  </div>
                </motion.div>
              )}

              {handshakeStatus === 'FAILED' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/50 p-4 flex items-center gap-3"
                >
                  <AlertTriangle className="text-red-500" />
                  <div>
                    <div className="text-xs font-black text-red-500 uppercase tracking-widest">Falha na Sincronização</div>
                    <div className="text-[10px] text-red-300 font-mono mt-1">Tempo limite excedido ou sinal instável detectado.</div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
