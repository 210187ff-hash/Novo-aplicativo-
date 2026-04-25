
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Send, Bot, User, Sparkles, Terminal } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
    role: 'ai' | 'user';
    content: string;
}

export const AIAdvisor: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'SISTEMA INTEGRADO DE AUTO-APRENDIZAGEM ATIVO. Como posso auxiliar em sua auditoria hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        // Simulation of AI thinking
        setTimeout(() => {
            const responses = [
                "Analisando heurística de rede... Recomendo focar no protocolo PMKID se o alvo for WPA2.",
                "O firmware detectado possui vulnerabilidades conhecidas em buffers de overflow no serviço SSH.",
                "Estratégia sugerida: Deauthentication broadcast seguida de captura de handshake em modo silencioso.",
                "Aviso: Atividade incomum detectada no nó de saída. Considere rotacionar MAC OUI.",
                "Para bypass de RADIUS, tente manipulação de pacotes EAP-TLS com certificados autofirmados."
            ];
            const aiMsg = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { role: 'ai', content: aiMsg }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="bg-gray-950 border border-cyan-900 rounded-sm h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-cyan-900 bg-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <Brain size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white italic uppercase">Aegis KERNEL AI Advisor</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[8px] text-cyan-800 font-mono font-bold uppercase">Neurônios Ativos: 4.8B Params</span>
                        </div>
                    </div>
                </div>
                <div className="text-[10px] font-mono text-cyan-900 hidden md:block">
                    MODEL: GEMINI-3-LATENCY-CRITICAL
                </div>
            </div>

            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 font-mono text-xs custom-scrollbar">
                {messages.map((msg, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`p-2 h-fit border ${msg.role === 'ai' ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-400' : 'bg-gray-900 border-gray-700 text-gray-400'}`}>
                            {msg.role === 'ai' ? <Bot size={14} /> : <User size={14} />}
                        </div>
                        <div className={`max-w-[80%] p-3 border ${
                            msg.role === 'ai' 
                            ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-300' 
                            : 'bg-black border-gray-800 text-gray-300'
                        }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="p-2 border bg-cyan-950/20 border-cyan-500/30 text-cyan-400">
                            <Bot size={14} />
                        </div>
                        <div className="flex items-center gap-1 p-3 text-cyan-800 italic animate-pulse">
                            Pensando...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-gray-900 border-t border-cyan-900">
                <div className="relative">
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="SOLICITAR CONSELHO TÁTICO..."
                        className="w-full bg-black border border-cyan-900 p-4 pr-14 text-[11px] text-cyan-400 focus:outline-none focus:border-cyan-500 uppercase font-bold tracking-widest"
                    />
                    <button 
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-cyan-500/20 text-cyan-500 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="mt-2 flex justify-between items-center px-1">
                    <div className="flex gap-4">
                        <button className="text-[8px] text-cyan-900 hover:text-cyan-600 transition-colors flex items-center gap-1 uppercase font-black"><Sparkles size={10}/> Otimizar Payload</button>
                        <button className="text-[8px] text-cyan-900 hover:text-cyan-600 transition-colors flex items-center gap-1 uppercase font-black"><Terminal size={10}/> Gerar Script Python</button>
                    </div>
                    <div className="text-[8px] text-cyan-950 italic">CADASTRADO PARA USUÁRIO COM NÍVEL DE ACESSO S5</div>
                </div>
            </div>
        </div>
    );
};
