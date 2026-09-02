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
}

export const SAFE_ALARM_PRESET: WaterAlarmData = {
  location: "Ramnagar Water Kiosk",
  status: "SAFE",
  alarmLevel: "NORMAL",
  timestamp: new Date().toISOString(),
  parameters: {
    ph: 7.1,
    tds: 380,
    turbidity: 10,
    temperature: 27
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
  }
};

export const PARAMETER_LIMITS = {
  ph: { min: 6.5, max: 8.5, unit: "", label: "pH Level", safeRange: "6.5 - 8.5" },
  tds: { max: 500, unit: "ppm", label: "TDS (Total Dissolved Solids)", safeRange: "< 500 ppm" },
  turbidity: { max: 5, unit: "NTU", label: "Turbidity", safeRange: "< 5 NTU" },
  temperature: { max: 28, unit: "°C", label: "Water Temperature", safeRange: "< 28°C" }
};
