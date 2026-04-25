
import { WifiNetwork } from './types';

export const MOCK_WIFI_NETWORKS: WifiNetwork[] = [
  {
    ssid: 'VIVO-FIBRA-A4B8',
    bssid: 'A4:B8:3F:12:CD:EF',
    capabilities: '[WPA2-PSK-CCMP][WPS][ESS]',
    level: -45,
    password: 'vivo12345',
  },
  {
    ssid: 'NET_CLARO_WIFI_5G',
    bssid: 'C8:D3:FF:9A:B0:1C',
    capabilities: '[WPA2-PSK-CCMP][ESS]',
    level: -62,
    password: 'net123456',
  },
  {
    ssid: 'Cafeteria_Aberta',
    bssid: '00:1A:2B:3C:4D:5E',
    capabilities: '[OPEN][ESS]',
    level: -55,
  },
  {
    ssid: 'AndroidAP_Lucas',
    bssid: 'DE:AD:BE:EF:CA:FE',
    capabilities: '[WPA2-PSK-CCMP][WPS][ESS]',
    level: -78,
    password: 'password123',
  },
  {
    ssid: 'Rede_Visitantes',
    bssid: '10:9F:A9:C3:D1:F0',
    capabilities: '[WPA2-EAP-CCMP][ESS]',
    level: -85,
  },
  {
    ssid: 'Minha_Casa_WiFi',
    bssid: 'F8:E4:FB:01:23:45',
    capabilities: '[WPA2-PSK-CCMP][WPS][ESS]',
    level: -51,
    password: 'familia',
  },
  {
    ssid: 'Evento_Pix_Pagamentos',
    bssid: 'A1:B2:C3:D4:E5:F6',
    capabilities: '[WPA2-PSK-CCMP][WPS][ESS]',
    level: -68,
    password: 'pix2024',
  },
];
