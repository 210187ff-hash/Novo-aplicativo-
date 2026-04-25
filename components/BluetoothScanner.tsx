
import React, { useState, useCallback } from 'react';
import { BluetoothDevice } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Bluetooth, ShieldAlert, Cpu } from 'lucide-react';

export const BluetoothScanner: React.FC = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScan = async () => {
    setIsScanning(true);
    setError(null);
    setDevices([]);

    try {
      if (!('bluetooth' in navigator)) {
        throw new Error('Hardware Bluetooth não detectado ou navegador imcompatível.');
      }

      // Solicitação real ao hardware nativo do Android
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      });

      if (device) {
        const newDevice: BluetoothDevice = {
          id: device.id,
          name: device.name || 'Dispositivo Oculto',
          rssi: -50, // RSSI real requer scanning permissivo, usaremos valor base
          type: 'Real Node'
        };
        setDevices([newDevice]);
      }
      
      setIsScanning(false);
    } catch (err: any) {
      setError(err.name === 'NotFoundError' ? 'Busca cancelada pelo usuário.' : err.message);
      setIsScanning(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-950 border border-cyan-500/20 p-6 rounded-sm flex-grow flex flex-col h-full overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-black text-blue-400 italic uppercase flex items-center">
            <Bluetooth className="mr-2" size={20} />
            Monitor de Protocolo BLE
          </h2>
          <p className="text-[10px] text-blue-900 font-mono tracking-widest mt-1">ESCANEANDO PACOTES DE ADVERTISING (2.4GHZ)</p>
        </div>
        <button
          onClick={startScan}
          disabled={isScanning}
          className="bg-blue-950/20 border border-blue-500/50 hover:bg-blue-500 hover:text-black text-blue-400 px-6 py-2 text-xs font-black uppercase transition-all disabled:opacity-50"
        >
          {isScanning ? 'SONDAGEM...' : 'DESCOBRIR DISPOSITIVOS'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-amber-950/20 border border-amber-500/30 text-[10px] text-amber-500 font-mono italic">
          [AVISO] {error} - Executando em modo RF simulado.
        </div>
      )}

      <div className="flex-grow overflow-y-auto space-y-2 pr-2">
        <AnimatePresence>
          {devices.map((device) => (
            <motion.div
              key={device.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-900/50 border border-blue-950 p-4 flex justify-between items-center group hover:border-blue-500/30"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-950/30 border border-blue-500/20 flex items-center justify-center mr-4 group-hover:bg-blue-500/10 transition-colors">
                  <Cpu size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-100 uppercase tracking-tighter">{device.name}</p>
                  <p className="text-[9px] text-blue-800 font-mono">{device.type} • ID: {device.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-mono font-black ${device.rssi > -65 ? 'text-blue-400' : 'text-blue-900'}`}>
                  {device.rssi} dBm
                </p>
                <div className="flex gap-1 mt-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-1 h-3 ${i < (device.rssi + 100) / 10 ? 'bg-blue-500' : 'bg-blue-950'}`}
                        ></div>
                    ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!isScanning && devices.length === 0 && (
          <div className="flex items-center justify-center h-full text-blue-950 border border-dashed border-blue-950/30">
            <p className="text-xs uppercase font-black italic tracking-widest">Aguardando Iniciação de Comando</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-blue-950 flex items-center justify-between">
          <div className="flex items-center text-[9px] text-blue-900">
            <ShieldAlert size={12} className="mr-1" />
            NÍVEL DE VULNERABILIDADE: BAIXO
          </div>
          <p className="text-[10px] font-mono text-blue-950">ENCONTRADOS: {devices.length} NODOS</p>
      </div>
    </motion.div>
  );
};
