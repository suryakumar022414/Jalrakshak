export type WaterStatus = 'UNSAFE' | 'SAFE';
export type AlarmLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL';
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface WaterParameters {
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
}

export interface PurificationStatus {
  uv: boolean;
  roUf: boolean;
}

export interface AlertActions {
  siren: boolean;
  sms: boolean;
  smsRecipients: number;
}

export interface TrendDataPoint {
  time: string;
  tds: number;
  ph: number;
}

export interface VillageStats {
  totalVillages: number;
  devicesDeployed: number;
  activeDevices: number;
}

export interface SystemStatusStats {
  online: number;
  offline: number;
}

export interface WaterAlarmData {
  location: string;
  status: WaterStatus;
  alarmLevel: AlarmLevel;
  timestamp: string;
  parameters: WaterParameters;
  microbialRisk: RiskLevel;
  purification: PurificationStatus;
  trigger: string[];
  actions: AlertActions;
  trendHistory: TrendDataPoint[];
  villageStats: VillageStats;
  systemStatusStats: SystemStatusStats;
}

export interface ParameterConfig {
  min?: number;
  max: number;
  unit: string;
  label: string;
  safeRange: string;
}

export const PARAMETER_LIMITS: Record<'ph' | 'tds' | 'turbidity' | 'temperature', ParameterConfig> = {
  ph: { min: 6.5, max: 8.5, unit: "", label: "pH", safeRange: "6.5 - 8.5" },
  tds: { min: 0, max: 500, unit: "ppm", label: "TDS", safeRange: "< 500 ppm" },
  turbidity: { min: 0, max: 15, unit: "NTU", label: "Turbidity", safeRange: "< 15 NTU" },
  temperature: { min: 0, max: 28, unit: "°C", label: "Temperature", safeRange: "< 28°C" }
};

export const INITIAL_TREND_HISTORY: TrendDataPoint[] = [
  { time: "00:00", tds: 380, ph: 6.9 },
  { time: "03:00", tds: 340, ph: 7.2 },
  { time: "06:00", tds: 410, ph: 7.0 },
  { time: "09:00", tds: 450, ph: 6.8 },
  { time: "12:00", tds: 420, ph: 7.1 },
  { time: "15:00", tds: 460, ph: 7.3 },
  { time: "18:00", tds: 390, ph: 7.0 },
  { time: "21:00", tds: 420, ph: 6.8 }
];

export const INITIAL_WATER_DATA: WaterAlarmData = {
  location: "Smart Water Kiosk #12",
  status: "SAFE",
  alarmLevel: "NORMAL",
  timestamp: new Date().toISOString(),
  parameters: {
    ph: 6.8,
    tds: 420,
    turbidity: 12,
    temperature: 28
  },
  microbialRisk: "LOW",
  purification: {
    uv: true,
    roUf: true
  },
  trigger: [],
  actions: {
    siren: false,
    sms: false,
    smsRecipients: 0
  },
  trendHistory: INITIAL_TREND_HISTORY,
  villageStats: {
    totalVillages: 12,
    devicesDeployed: 28,
    activeDevices: 26
  },
  systemStatusStats: {
    online: 26,
    offline: 2
  }
};
