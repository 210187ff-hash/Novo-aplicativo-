
export interface WifiNetwork {
  ssid: string;
  bssid: string;
  capabilities: string;
  level: number; // Signal strength, e.g., -50 dBm
  password?: string; // Senha de referência para validação de integridade
}

export enum LogType {
  INFO = 'INFO',
  ATTEMPT = 'ATTEMPT',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  METHOD = 'METHOD',
}

export enum AppMode {
  SCANNER = 'SCANNER',
  RF_ANALYZER = 'RF_ANALYZER',
  BT_SCANNER = 'BT_SCANNER',
  LOCATION_MAP = 'LOCATION_MAP',
  PORT_SCANNER = 'PORT_SCANNER',
  SENSOR_HUB = 'SENSOR_HUB',
  PROTOCOL_ANALYSIS = 'PROTOCOL_ANALYSIS',
  HARDWARE_INFO = 'HARDWARE_INFO',
  DEFENSE_CORE = 'DEFENSE_CORE',
  TOOLSET_EXPANDED = 'TOOLSET_EXPANDED',
  CYBER_THREAT = 'CYBER_THREAT',
  AI_ADVISOR = 'AI_ADVISOR',
}

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  type: string;
}

export interface SignalPoint {
  time: string;
  strength: number;
}

export interface LogEntry {
  id: number;
  type: LogType;
  message: string;
  timestamp: string;
}
