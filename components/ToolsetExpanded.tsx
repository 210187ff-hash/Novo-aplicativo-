
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Search, Shield, Terminal, Database, Globe, 
  Lock, Unlock, Cpu, Smartphone, Radio, HardDrive,
  Hash, Code, Layers, Share2, Server, Eye, EyeOff,
  Cloud, CloudLightning, Activity, Briefcase, Key,
  Mail, MessageSquare, User, Users, Ghost, Target, ShieldCheck,
  Crosshair, Disc, Filter, Hexagon, Binary, GitMerge,
  GitPullRequest, Link, MousePointer2, Settings, TerminalSquare,
  Wand2, Wifi, ZapOff, FileCode, FileSearch, Fingerprint,
  Mic, Camera, Volume2, Bluetooth, Map as MapIcon, LucideIcon
} from 'lucide-react';

const CATEGORIES = [
  'Rede', 'Wireless', 'Criptografia', 'Sistema', 'Forense', 'Cloud', 'Contrainteligência', 'Cyber-Ataque'
];

interface Tool {
    name: string;
    category: string;
    complexity: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
}

const TOOLS: Tool[] = [
  { name: 'Brute Force SSH', category: 'Rede', complexity: 'Baixa' },
  { name: 'Simulador SQL Map', category: 'Sistema', complexity: 'Alta' },
  { name: 'DNS Poisoning', category: 'Rede', complexity: 'Média' },
  { name: 'Tabelas Rainbow', category: 'Criptografia', complexity: 'Alta' },
  { name: 'Sniffer de Pacotes', category: 'Wireless', complexity: 'Média' },
  { name: 'Injetor de Payload', category: 'Sistema', complexity: 'Crítica' },
  { name: 'Buscador de Subdomínios', category: 'Cloud', complexity: 'Baixa' },
  { name: 'Validador XSS', category: 'Sistema', complexity: 'Média' },
  { name: 'Engenharia Social', category: 'Forense', complexity: 'Média' },
  { name: 'Ponte Metasploit', category: 'Rede', complexity: 'Crítica' },
  { name: 'Broadcaster de Deauth', category: 'Wireless', complexity: 'Baixa' },
  { name: 'Extrator de Dados Exif', category: 'Forense', complexity: 'Baixa' },
  { name: 'Caçador de Handshake WPA3', category: 'Wireless', complexity: 'Média' },
  { name: 'Mapeador de Portas Nmap', category: 'Rede', complexity: 'Média' },
  { name: 'JS Jailbreak Docker', category: 'Cloud', complexity: 'Crítica' },
  { name: 'Cracker de JWT', category: 'Criptografia', complexity: 'Alta' },
  { name: 'Designer de Evil Twin', category: 'Wireless', complexity: 'Alta' },
  { name: 'Relé de Proxy', category: 'Rede', complexity: 'Média' },
  { name: 'Debugger de Kernel', category: 'Sistema', complexity: 'Crítica' },
  { name: 'Dumper de RAM', category: 'Forense', complexity: 'Alta' },
  { name: 'Decompilador Binário', category: 'Sistema', complexity: 'Alta' },
  { name: 'Scan de Active Directory', category: 'Cloud', complexity: 'Alta' },
  { name: 'Implementador de Honey Pot', category: 'Contrainteligência', complexity: 'Média' },
  { name: 'Apagador de Logs', category: 'Sistema', complexity: 'Crítica' },
  { name: 'Coordenador de Botnet', category: 'Cloud', complexity: 'Média' },
  { name: 'Pesquisador Zero Day', category: 'Sistema', complexity: 'Crítica' },
  { name: 'Spoofer de Impressão Digital', category: 'Contrainteligência', complexity: 'Média' },
  { name: 'Ferramenta de Esteganografia', category: 'Criptografia', complexity: 'Média' },
  { name: 'Vigilância Acústica', category: 'Contrainteligência', complexity: 'Alta' },
  { name: 'Inbidor Óptico', category: 'Contrainteligência', complexity: 'Média' },
  { name: 'Scanner de Ultrassom', category: 'Forense', complexity: 'Alta' },
  { name: 'BLE Longo Alcance', category: 'Wireless', complexity: 'Média' },
  { name: 'Framework MITM', category: 'Rede', complexity: 'Alta' },
  { name: 'Sequestrador de Sessão', category: 'Sistema', complexity: 'Alta' },
  { name: 'Fábrica de Phishing', category: 'Cloud', complexity: 'Média' },
  { name: 'Escudo Ransomware', category: 'Contrainteligência', complexity: 'Média' },
  { name: 'Wipe Anti-Forense', category: 'Sistema', complexity: 'Crítica' },
  { name: 'Analisador de Beacon', category: 'Wireless', complexity: 'Baixa' },
  { name: 'Falsificador de GPS', category: 'Contrainteligência', complexity: 'Média' },
  { name: 'Vazador de S3 Cloud', category: 'Cloud', complexity: 'Alta' },
  { name: 'Teste de DDoS Lambda', category: 'Cloud', complexity: 'Alta' },
  { name: 'Vulnerabilidade IoT', category: 'Wireless', complexity: 'Média' },
  { name: 'Ladrão de Cookies', category: 'Sistema', complexity: 'Média' },
  { name: 'Requisitante Cross-Site', category: 'Sistema', complexity: 'Média' },
  { name: 'Nó de Entrada TOR', category: 'Rede', complexity: 'Média' },
  { name: 'Sandbox de Malware', category: 'Sistema', complexity: 'Média' },
  { name: 'HSM Criptográfico', category: 'Criptografia', complexity: 'Crítica' },
  { name: 'Crawler de Dark Web', category: 'Forense', complexity: 'Alta' },
  { name: 'Inibidor de Sinal', category: 'Wireless', complexity: 'Crítica' },
  { name: 'Inspeção Profunda de Pacotes', category: 'Rede', complexity: 'Alta' }
];

const getToolIcon = (name: string): LucideIcon => {
    const n = name.toLowerCase();
    if (n.includes('ssh') || n.includes('terminal') || n.includes('shell')) return Terminal;
    if (n.includes('sql') || n.includes('db') || n.includes('database') || n.includes('dumper')) return Database;
    if (n.includes('dns') || n.includes('globe') || n.includes('dark web') || n.includes('tor')) return Globe;
    if (n.includes('rainbow') || n.includes('hash')) return Hash;
    if (n.includes('sniffer') || n.includes('filter')) return Filter;
    if (n.includes('payload') || n.includes('code') || n.includes('script')) return Code;
    if (n.includes('subdomain') || n.includes('search') || n.includes('nmap') || n.includes('scan') || n.includes('crawler')) return Search;
    if (n.includes('xss') || n.includes('layers')) return Layers;
    if (n.includes('social') || n.includes('users') || n.includes('twin')) return Users;
    if (n.includes('metasploit') || n.includes('target') || n.includes('bridge')) return Target;
    if (n.includes('deauth') || n.includes('jammer') || n.includes('inibidor') || n.includes('off')) return ZapOff;
    if (n.includes('exif') || n.includes('metadata')) return FileSearch;
    if (n.includes('wpa') || n.includes('lock') || n.includes('handshake') || n.includes('key') || n.includes('jwt')) return Lock;
    if (n.includes('docker') || n.includes('briefcase')) return Briefcase;
    if (n.includes('proxy') || n.includes('share') || n.includes('relay')) return Share2;
    if (n.includes('kernel') || n.includes('cpu') || n.includes('debugger')) return Cpu;
    if (n.includes('ram') || n.includes('harddrive')) return HardDrive;
    if (n.includes('binary') || n.includes('decompiler')) return Binary;
    if (n.includes('server') || n.includes('directory')) return Server;
    if (n.includes('honey pot') || n.includes('hexagon')) return Hexagon;
    if (n.includes('ghost') || n.includes('eraser') || n.includes('wipe')) return Ghost;
    if (n.includes('botnet') || n.includes('merge') || n.includes('coordinator')) return GitMerge;
    if (n.includes('fingerprint')) return Fingerprint;
    if (n.includes('steganography') || n.includes('filecode')) return FileCode;
    if (n.includes('mic') || n.includes('surveillance') || n.includes('acústica')) return Mic;
    if (n.includes('camera') || n.includes('óptico')) return Camera;
    if (n.includes('volume') || n.includes('sound') || n.includes('ultrassom')) return Volume2;
    if (n.includes('bluetooth') || n.includes('ble')) return Bluetooth;
    if (n.includes('link') || n.includes('mitm')) return Link;
    if (n.includes('session') || n.includes('hijacker') || n.includes('pointer')) return MousePointer2;
    if (n.includes('phishing') || n.includes('mail')) return Mail;
    if (n.includes('ransomware') || n.includes('shield')) return Shield;
    if (n.includes('beacon') || n.includes('radio')) return Radio;
    if (n.includes('gps') || n.includes('map')) return MapIcon;
    if (n.includes('cloud') || n.includes('s3')) return Cloud;
    if (n.includes('ddos') || n.includes('lightning')) return CloudLightning;
    if (n.includes('iot') || n.includes('smartphone')) return Smartphone;
    if (n.includes('cookie') || n.includes('disc')) return Disc;
    if (n.includes('cross-site') || n.includes('requester') || n.includes('pull')) return GitPullRequest;
    if (n.includes('sandbox')) return ShieldCheck;
    if (n.includes('hsm') || n.includes('unlock')) return Unlock;
    if (n.includes('zap') || n.includes('signal')) return Zap;
    
    return Terminal; // Default
};

export const ToolsetExpanded: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTool, setActiveTool] = useState<typeof TOOLS[0] | null>(null);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [progress, setProgress] = useState(0);

    const filteredTools = TOOLS.filter(t => 
        (!selectedCategory || t.category === selectedCategory) &&
        (t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const runTool = (tool: Tool) => {
        const ToolIcon = getToolIcon(tool.name);
        setActiveTool(tool);
        setIsExecuting(true);
        setTerminalLogs([`> INICIALIZANDO: ${tool.name.toUpperCase()}`, `> CATEGORIA: ${tool.category.toUpperCase()}`, `> ESTADO: CARREGANDO DEPENDÊNCIAS...`]);
        setProgress(0);

        const technicalLogs = [
            `[INFO] Hooking kernel process ID: ${Math.floor(Math.random() * 9999)}`,
            `[DEBUG] Alocando buffer de memória: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
            `[AUTH] Solicitando privilégios de ROOT (Aegis-Kernel-v4)...`,
            `[SUCCESS] Acesso concedido. Iniciando vetor de ataque...`,
            `[SCAN] Escaneando portas no espectro ${tool.category}...`,
            `[PACKET] Injetando frames de controle: 0xAF 0xBC 0x22`,
            `[LOG] bypass_status=TRUE entropy_level=0.98`,
            `[ALERT] Resposta detectada do nó alvo...`,
            `[FINAL] Operação concluída com sucesso.`
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < technicalLogs.length) {
                setTerminalLogs(prev => [...prev, `> ${technicalLogs[currentStep]}`]);
                setProgress(prev => Math.min(100, prev + (100 / technicalLogs.length)));
                currentStep++;
            } else {
                clearInterval(interval);
                setIsExecuting(false);
            }
        }, 800);
    };

    return (
        <div className="h-full flex flex-col gap-4 overflow-hidden relative">
            {/* TERMINAL OVERLAY */}
            {activeTool && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-50 bg-black/95 border-2 border-cyan-500/30 flex flex-col p-6 font-mono"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-cyan-900 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-cyan-500 text-black">
                                {React.createElement(getToolIcon(activeTool.name), { size: 20 })}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">{activeTool.name}</h3>
                                <div className="text-[8px] text-cyan-500 uppercase tracking-tighter">Status: {isExecuting ? 'PROCESSANDO...' : 'EXECUTADO'}</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => { setActiveTool(null); setTerminalLogs([]); }}
                            className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-1 text-[10px] font-black hover:bg-red-500 hover:text-white transition-all uppercase"
                        >
                            Fechar
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto mb-4 space-y-1 text-cyan-400 text-[10px] custom-scrollbar">
                        {terminalLogs.map((log, i) => (
                            <div key={i} className={log.startsWith('>') ? 'text-white' : 'text-cyan-600'}>{log}</div>
                        ))}
                        {isExecuting && <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }} className="inline-block w-2 h-4 bg-cyan-500 ml-1 translate-y-1" />}
                    </div>

                    <div className="bg-cyan-900/20 h-2 w-full relative overflow-hidden">
                        <motion.div 
                            className="absolute inset-y-0 left-0 bg-cyan-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-[8px] text-cyan-900 border-t border-cyan-950 pt-2">
                        <span>PROGRESSO: {Math.floor(progress)}%</span>
                        <span>MODO: KERNEL-NATIVE-BYPASS</span>
                    </div>
                </motion.div>
            )}

            <div className="bg-gray-950 border border-cyan-900 p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">TOOLSET EXPANDIDO V4.0</h2>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-800" size={14} />
                        <input 
                            type="text" 
                            placeholder="BUSCAR FERRAMENTA..."
                            className="w-full bg-black border border-cyan-900 p-2 pl-9 text-[10px] text-cyan-400 focus:outline-none focus:border-cyan-500 uppercase tracking-widest font-mono"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border transition-colors whitespace-nowrap ${!selectedCategory ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-black text-cyan-900 border-cyan-950 hover:border-cyan-500/40'}`}
                    >
                        Todos
                    </button>
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border transition-colors whitespace-nowrap ${selectedCategory === cat ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-black text-cyan-900 border-cyan-950 hover:border-cyan-500/40'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {filteredTools.map((tool, i) => (
                        <motion.button
                            key={tool.name}
                            onClick={() => runTool(tool)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.01 }}
                            className="bg-black border border-cyan-950 p-4 text-left flex flex-col gap-3 group hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all relative overflow-hidden h-32 active:scale-95"
                        >
                            <div className="flex justify-between items-start z-10">
                                <div className="p-2 border border-cyan-900 bg-gray-950 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                                    {React.createElement(getToolIcon(tool.name), { size: 16 })}
                                </div>
                                <span className={`text-[7px] px-1 font-black uppercase tracking-tighter ${
                                    tool.complexity === 'Baixa' ? 'text-green-500' :
                                    tool.complexity === 'Média' ? 'text-yellow-500' :
                                    tool.complexity === 'Alta' ? 'text-orange-500' : 'text-red-500'
                                }`}>
                                    {tool.complexity}
                                </span>
                            </div>
                            <div className="mt-auto z-10">
                                <div className="text-[10px] font-black text-white leading-tight uppercase group-hover:text-cyan-400 transition-colors">{tool.name}</div>
                                <div className="text-[8px] text-cyan-900 uppercase font-mono mt-0.5 tracking-widest">{tool.category}</div>
                            </div>
                            
                            {/* Decorative Grid BG */}
                            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                                <div className="grid grid-cols-4 h-full">
                                    {Array(16).fill(0).map((_, idx) => (
                                        <div key={idx} className="border-[0.5px] border-cyan-500" />
                                    ))}
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="p-3 bg-cyan-950/20 border-t border-cyan-500/30 flex justify-between items-center text-[9px] font-mono">
                <span className="text-cyan-800">CÉLULAS CARREGADAS: {filteredTools.length}</span>
                <span className="text-cyan-500 animate-pulse uppercase">Modo de Operação: Execução Direta</span>
            </div>
        </div>
    );
};
