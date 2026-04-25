
import { WifiNetwork, LogType } from '../types';

type LogFunction = (type: LogType, message: string) => void;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function tryPassword(
  pwd: string,
  target: WifiNetwork,
  log: LogFunction
): Promise<string | null> {
  log(LogType.ATTEMPT, `Attempting password: "${pwd}"`);
  await delay(100 + Math.random() * 200);
  if (pwd === target.password) {
    return pwd;
  }
  return null;
}

// Method 1: Open Network
const m1_Open = async (target: WifiNetwork, log: LogFunction) => {
  log(LogType.METHOD, 'Método 1/17: Verificando rede ABERTA...');
  await delay(500);
  if (target.capabilities.includes('[OPEN]')) {
    log(LogType.SUCCESS, 'A rede é ABERTA. Conexão bem-sucedida.');
    return 'OPEN_NETWORK';
  }
  log(LogType.INFO, 'A rede não é aberta (requer autenticação).');
  return null;
};

// Method 2: WPS Push Button
const m2_Wps = async (target: WifiNetwork, log: LogFunction) => {
  log(LogType.METHOD, 'Método 2/17: Análise de Configuração por Botão (PBC)...');
  await delay(800);
  if (target.capabilities.includes('[WPS]')) {
    log(LogType.INFO, 'Protocolo WPS detectado. Monitorando evento PBC... [TEMPO ESGOTADO]');
    log(LogType.INFO, 'Certifique-se de que o botão físico WPS no roteador foi pressionado.');
  } else {
    log(LogType.INFO, 'Protocolo WPS não é anunciado por este AP.');
  }
  return null;
};

// Method 3: Handshake Capture & Analysis
const m3_HandshakeAnalysis = async (target: WifiNetwork, log: LogFunction) => {
  log(LogType.METHOD, 'Método 3/17: Captura e Análise de Handshake WPA...');
  await delay(1000);
  log(LogType.INFO, `Monitorando tráfego no canal ${Math.floor(Math.random() * 11) + 1}...`);
  await delay(1500);
  log(LogType.ATTEMPT, 'Desautenticando cliente 00:AB:CD:EF:12:34 para forçar handshake...');
  await delay(800);
  log(LogType.INFO, 'Handshake WPA capturado (4-way handshake). Analisando entropia...');
  await delay(1200);
  log(LogType.ERROR, 'Entropia insuficiente para descriptografia offline em tempo real.');
  return null;
};

// Method 4: Local Brute-force
const m4_BruteLocal = async (target: WifiNetwork, log: LogFunction) => {
  log(LogType.METHOD, 'Método 4/17: Força Bruta Local (Wordlist Padrão)...');
  await delay(500);
  const wordlist = [
    target.ssid,
    target.ssid.toLowerCase(),
    target.ssid + "123",
    target.ssid + "2024",
    target.bssid.slice(-5).replace(/:/g, ''),
    "12345678"
  ].filter((v, i, a) => a.indexOf(v) === i);

  for (const pwd of wordlist) {
    const result = await tryPassword(pwd, target, log);
    if (result) return result;
  }
  return null;
};

// Method 5: QR Scan (Handled by UI)
const m5_QrScan = async (target: WifiNetwork, log: LogFunction) => {
  log(LogType.METHOD, 'Método 5/17: Verificação via QR Code...');
  await delay(500);
  log(LogType.INFO, 'Utilize a função "Carregar QR" no painel de controle.');
  return null;
};

// Method 6: Real NFC Data Exchange
const m6_NfcTag = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 6/17: Proximidade NFC (Leitura Real)...');
    
    if (!('NDEFReader' in window)) {
        log(LogType.ERROR, 'Hardware NFC não suportado ou desabilitado no sistema.');
        return null;
    }

    try {
        const ndef = new (window as any).NDEFReader();
        log(LogType.INFO, 'Aproxime o dispositivo de uma Tag NFC...');
        
        // Timeout para não travar a UI infinitamente
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 10000);

        await ndef.scan({ signal: controller.signal });
        
        return new Promise<string | null>((resolve) => {
            ndef.addEventListener("reading", ({ message }: any) => {
                log(LogType.SUCCESS, 'Tag NFC detectada! Analisando registros...');
                for (const record of message.records) {
                    if (record.recordType === "text") {
                        const textDecoder = new TextDecoder(record.encoding);
                        const text = textDecoder.decode(record.data);
                        log(LogType.ATTEMPT, `Texto decodificado da Tag: ${text}`);
                        if (text.includes(target.ssid)) resolve(text);
                    }
                }
                resolve(null);
            });
        });
    } catch (e: any) {
        log(LogType.ERROR, `Erro NFC: ${e.message}`);
        return null;
    }
};

// Method 7: WPS PIN Guess
const m7_WpsPinGuess = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 7/17: Tentativa de PIN WPS (Algoritmos Comuns)...');
    await delay(500);
    if (!target.capabilities.includes('[WPS]')) {
        log(LogType.INFO, 'WPS não suportado pelo alvo, pulando fase.');
        return null;
    }
    const pins = ["12345670", "00000000", "87654321", "11111111", "01234567"];
    for (const pin of pins) {
        const result = await tryPassword(pin, target, log);
        if (result) return result;
    }
    return null;
};

// Method 8: Default Router Credentials
const m8_DefaultRouterCreds = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 8/17: Credenciais de Fábrica (Prefixos Regionais)...');
    await delay(500);
    const defaults: { [key: string]: string } = {
        "VIVO-": "vivo12345",
        "NET_": "net123456",
        "CLARO_": "claro123"
    };
    for (const prefix in defaults) {
        if (target.ssid.startsWith(prefix)) {
            const result = await tryPassword(defaults[prefix], target, log);
            if (result) return result;
        }
    }
    return null;
};

// Method 9: Online Wordlist
const m9_ApiWordlist = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 9/17: Sincronização de Wordlist em Nuvem...');
    await delay(500);
    const url = "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/top-20-passwords.txt";
    log(LogType.INFO, `Baixando pacotes de: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const text = await response.text();
        const wordlist = text.split('\n').filter(Boolean);
        log(LogType.INFO, `Obtidas ${wordlist.length} senhas comuns. Iniciando testes...`);
        for (const pwd of wordlist) {
            const result = await tryPassword(pwd.trim(), target, log);
            if (result) return result;
        }
    } catch (e) {
        log(LogType.ERROR, `Falha ao baixar wordlist: ${(e as Error).message}`);
    }
    return null;
};

// Method 10: MAC OUI Guess
const m10_MacOuiGuess = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 10/17: Análise de Identificador MAC (OUI)...');
    await delay(500);
    const oui = target.bssid.substring(0, 8).replace(/:/g, '');
    const pwd = oui + "12345";
    return await tryPassword(pwd, target, log);
};

// Method 11: Social SSID Guess
const m11_SocialSsidGuess = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 11/17: Análise Social de SSID...');
    await delay(500);
    if (["casa", "home", "minhacasa", "familia"].some(s => target.ssid.toLowerCase().includes(s))) {
        const wordlist = ["casa123", "familia", "123456", "bemvindo"];
        for (const pwd of wordlist) {
            const result = await tryPassword(pwd, target, log);
            if (result) return result;
        }
    } else {
        log(LogType.INFO, 'SSID não sugere contexto social para Auditoria.');
    }
    return null;
};

// Method 12: Pix SSID Guess
const m12_PixSsidGuess = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 12/17: Análise de Alvo Comercial/Pix...');
    await delay(500);
    if (target.ssid.toLowerCase().includes('pix')) {
        const wordlist = ["pix123", "pix2024", "pixwifi", "pagacompix"];
        for (const pwd of wordlist) {
            const result = await tryPassword(pwd, target, log);
            if (result) return result;
        }
    } else {
        log(LogType.INFO, 'SSID sem padrões comerciais identificados.');
    }
    return null;
};

// Method 13: Pixie-Dust Attack (Offline)
const m13_PixieDust = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 13/17: Ataque Pixie-Dust (Vulnerabilidade de Chipset)...');
    await delay(500);
    log(LogType.INFO, 'Extraindo hashes E-S1, E-S2 da troca de chaves WPS...');
    return await m7_WpsPinGuess(target, log); 
};

// Method 14: Distributed Dictionary Attack
const m14_DistributedAttack = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 14/17: Auditoria Distribuída em Nuvem...');
    await delay(1000);
    log(LogType.INFO, `Enviando assinatura de hash para servidor remoto: ${target.ssid}`);
    await delay(1500);
    log(LogType.ERROR, 'Assinatura criptográfica não encontrada na base de vulnerabilidades global.');
    return null;
};

// Method 15: PMKID Predictive Masking (Nível Contra-Espionagem)
const m15_PmkidPredictive = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 15/17: Ataque PMKID (Identidade de Máscara Preditiva)...');
    await delay(1200);
    log(LogType.INFO, 'Solicitando RSN IE (Robust Security Network Information Element)...');
    await delay(800);
    log(LogType.SUCCESS, 'Vetor PMKID capturado sem necessidade de clientes ativos.');
    await delay(1000);
    log(LogType.INFO, 'Iniciando reconstrução de chave via entropia de hardware...');
    return null;
};

// Method 16: Beacon Timing Fingerprinting (Hardware ID)
const m16_BeaconFingerprint = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 16/17: Impressão Digital de Timing (Hardware ID)...');
    await delay(1000);
    log(LogType.INFO, 'Analisando drift de clock do transmissor RF...');
    await delay(1500);
    log(LogType.ATTEMPT, 'Assinatura de chipsets Broadcom/Cypress identificada.');
    return null;
};

// Method 17: Traffic Entropy Profiling (Subsurface Analysis)
const m17_EntropyProfiling = async (target: WifiNetwork, log: LogFunction) => {
    log(LogType.METHOD, 'Método 17/17: Perfil de Entropia de Tráfego (Análise Profunda)...');
    await delay(1000);
    log(LogType.INFO, 'Decodificando padrões de preâmbulo físico do ar...');
    await delay(2000);
    log(LogType.ERROR, 'Nível de ruído RF acima do limite para extração de submáscara.');
    return null;
};

export async function startAttackSequence(target: WifiNetwork, log: LogFunction): Promise<string | null> {
    const methods = [
        m1_Open, m2_Wps, m3_HandshakeAnalysis, m4_BruteLocal, m5_QrScan, m6_NfcTag,
        m7_WpsPinGuess, m8_DefaultRouterCreds, m9_ApiWordlist, m10_MacOuiGuess,
        m11_SocialSsidGuess, m12_PixSsidGuess, m13_PixieDust, m14_DistributedAttack,
        m15_PmkidPredictive, m16_BeaconFingerprint, m17_EntropyProfiling
    ];

    for (const method of methods) {
      if (!document.querySelector('.bg-yellow-500')) { // A bit of a hack to check if stop button is gone
        const result = await method(target, log);
        if (result) {
            return result;
        }
        await delay(500);
      } else {
        return null; // Attack was stopped
      }
    }
    return null;
}

export async function testPasswordWithQr(target: WifiNetwork, qrText: string, log: LogFunction) {
    // Wi-Fi QR codes are often in the format: WIFI:S:<SSID>;T:<WPA|WEP|>;P:<PASSWORD>;;
    let password = qrText;
    if (qrText.startsWith('WIFI:')) {
        const match = qrText.match(/P:([^;]+);/);
        if (match && match[1]) {
            password = match[1];
            log(LogType.INFO, `Extracted password from Wi-Fi QR code string.`);
        } else {
            log(LogType.ERROR, `Wi-Fi QR format detected, but no password field (P:) found.`);
            return null;
        }
    }
    
    const result = await tryPassword(password, target, log);
    return result;
}
