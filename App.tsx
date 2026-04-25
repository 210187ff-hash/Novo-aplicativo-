
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { WifiNetwork, LogEntry, LogType, AppMode } from './types';
import { MOCK_WIFI_NETWORKS } from './constants';
import { startAttackSequence, testPasswordWithQr } from './services/wifiSimulator';
import { QrScannerModal } from './components/QrScannerModal';
import { Header } from './components/Header';
import { ModuleSwitcher } from './components/ModuleSwitcher';
import { AuditModule } from './components/AuditModule';
import { RFAnalyzer } from './components/RFAnalyzer';
import { BluetoothScanner } from './components/BluetoothScanner';
import { SignalMapper } from './components/SignalMapper';
import { PortScanner } from './components/PortScanner';
import { SensorHub } from './components/SensorHub';
import { HardwareInfo } from './components/HardwareInfo';
import { ProtocolAnalyzer } from './components/ProtocolAnalyzer';
import { DefenseCore } from './components/DefenseCore';
import { ToolsetExpanded } from './components/ToolsetExpanded';
import { CyberThreatMap } from './components/CyberThreatMap';
import { AIAdvisor } from './components/AIAdvisor';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.SCANNER);
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [foundPassword, setFoundPassword] = useState<string | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  const logIdCounter = useRef(0);
  const isAttackRunningRef = useRef(false);

  useEffect(() => {
    isAttackRunningRef.current = isAttacking;
  }, [isAttacking]);

  const addLog = useCallback((type: LogType, message: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    const newLog: LogEntry = {
      id: logIdCounter.current++,
      type,
      message,
      timestamp,
    };
    setLogs(prevLogs => [...prevLogs, newLog]);
  }, []);

  const resetState = () => {
    setLogs([]);
    setFoundPassword(null);
    setIsAttacking(false);
    setSelectedNetwork(null);
    logIdCounter.current = 0;
  };

  const handleScan = () => {
    resetState();
    setIsScanning(true);
    addLog(LogType.INFO, "Escaneando redes Wi-Fi próximas...");
    setTimeout(() => {
      setNetworks(MOCK_WIFI_NETWORKS);
      addLog(LogType.INFO, `Varredura concluída. Encontradas ${MOCK_WIFI_NETWORKS.length} redes.`);
      setIsScanning(false);
    }, 1500);
  };
  
  const handleSelectNetwork = (network: WifiNetwork) => {
    if (isAttacking) return;
    resetState();
    setSelectedNetwork(network);
    addLog(LogType.INFO, `Alvo selecionado: ${network.ssid} (${network.bssid})`);
  };

  const handleStartAttack = async () => {
    if (!selectedNetwork || isAttacking) return;

    setIsAttacking(true);
    setFoundPassword(null);
    setLogs([]);
    logIdCounter.current = 0;
    
    addLog(LogType.INFO, `Iniciando auditoria em ${selectedNetwork.ssid}...`);
    const password = await startAttackSequence(selectedNetwork, addLog);
    
    if (password && isAttackRunningRef.current) {
        setFoundPassword(password);
        addLog(LogType.SUCCESS, `Auditoria bem-sucedida. Sessão encerrada.`);
    } else if (isAttackRunningRef.current) {
        addLog(LogType.ERROR, "Processo concluído. Nenhuma vulnerabilidade crítica explorada.");
    }
    setIsAttacking(false);
  };
  
  const handleStopAttack = () => {
    if (!isAttacking) return;
    setIsAttacking(false);
    addLog(LogType.ERROR, "Auditoria encerrada manualmente pelo usuário.");
  };

  const handleQrScanSuccess = async (text: string) => {
    setIsQrScannerOpen(false);
    if (!selectedNetwork) {
        addLog(LogType.ERROR, "Erro no QR: Nenhuma rede selecionada.");
        return;
    }
    addLog(LogType.INFO, `QR Code detectado. Validando credenciais...`);
    setIsAttacking(true);
    const result = await testPasswordWithQr(selectedNetwork, text, addLog);
    if (result) {
        setFoundPassword(result);
        addLog(LogType.SUCCESS, `A senha do QR Code está correta!`);
    } else {
        addLog(LogType.ERROR, `A senha do QR Code está incorreta.`);
    }
    setIsAttacking(false);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-300 p-4 flex flex-col font-mono selection:bg-cyan-500 selection:text-black overflow-hidden h-screen">
      <Header />
      
      <div className="flex flex-col lg:flex-row flex-grow gap-4 min-h-0 overflow-hidden">
        <ModuleSwitcher currentMode={mode} onModeChange={(newMode) => setMode(newMode)} />
        
        <div className="flex-grow min-h-0 overflow-hidden h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                    {mode === AppMode.SCANNER && (
                        <AuditModule 
                            networks={networks}
                            selectedNetwork={selectedNetwork}
                            logs={logs}
                            isScanning={isScanning}
                            isAttacking={isAttacking}
                            foundPassword={foundPassword}
                            onScan={handleScan}
                            onSelectNetwork={handleSelectNetwork}
                            onStartAttack={handleStartAttack}
                            onStopAttack={handleStopAttack}
                            onOpenQr={() => setIsQrScannerOpen(true)}
                        />
                    )}
                    {mode === AppMode.RF_ANALYZER && <RFAnalyzer />}
                    {mode === AppMode.BT_SCANNER && <BluetoothScanner />}
                    {mode === AppMode.LOCATION_MAP && <SignalMapper />}
                    {mode === AppMode.PORT_SCANNER && <PortScanner />}
                    {mode === AppMode.SENSOR_HUB && <SensorHub />}
                    {mode === AppMode.HARDWARE_INFO && <HardwareInfo />}
                    {mode === AppMode.PROTOCOL_ANALYSIS && <ProtocolAnalyzer />}
                    {mode === AppMode.DEFENSE_CORE && <DefenseCore />}
                    {mode === AppMode.TOOLSET_EXPANDED && <ToolsetExpanded />}
                    {mode === AppMode.CYBER_THREAT && <CyberThreatMap />}
                    {mode === AppMode.AI_ADVISOR && <AIAdvisor />}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
      
      {isQrScannerOpen && (
        <QrScannerModal 
          onClose={() => setIsQrScannerOpen(false)}
          onScanSuccess={handleQrScanSuccess}
        />
      )}
    </div>
  );
};

export default App;
