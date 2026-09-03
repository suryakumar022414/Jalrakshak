import { WaterParameters } from '@/types/alarm';

export type MiningRiskTag = 'Low Risk' | 'Moderate Risk' | 'High Heavy Metal Risk';

export interface MiningRiskResult {
  score: number;
  statusTag: MiningRiskTag;
  indicators: string[];
}

export interface FilterHealthResult {
  sediment: number;
  carbon: number;
  ro: number;
  operatingHours: number;
  hasWarning: boolean;
}

/**
 * Calculates the Mining Runoff Risk Index (0-100%) based on SIH26040 criteria:
 * - TDS > 500 ppm AND Turbidity < 5 NTU (High dissolved solids without cloudiness = potential heavy metal/acid mine drainage risk): +40%
 * - pH < 6.5 (Acidic mine water indicator): +35%
 * - Temperature > 32°C AND TDS > 400 ppm: +15%
 */
export function calculateMiningRisk(params: WaterParameters): MiningRiskResult {
  let score = 0;
  const indicators: string[] = [];

  // High dissolved solids without cloudiness (potential heavy metal / acid mine drainage)
  if (params.tds > 500 && params.turbidity < 5) {
    score += 40;
    indicators.push('High TDS with low turbidity (Heavy metal/AMD signature)');
  }

  // Acidic mine water indicator
  if (params.ph < 6.5) {
    score += 35;
    indicators.push('Acidic water detected (pH < 6.5)');
  }

  // Thermal oxidation & dissolved mineral runoff boost
  if (params.temperature > 32 && params.tds > 400) {
    score += 15;
    indicators.push('Elevated temp & high mineral concentration');
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let statusTag: MiningRiskTag = 'Low Risk';
  if (finalScore >= 70) {
    statusTag = 'High Heavy Metal Risk';
  } else if (finalScore >= 35) {
    statusTag = 'Moderate Risk';
  }

  return {
    score: finalScore,
    statusTag,
    indicators
  };
}

/**
 * Calculates dynamic filter degradation based on cumulative TDS exposure, turbidity, and runtime operating hours:
 * - Sediment Filter Health (%) = 100 - (Turbidity * 0.5) - (Operating Hours * 0.1)
 * - Activated Carbon / Alumina Health (%) = 100 - (TDS * 0.04) - (Operating Hours * 0.1)
 * - RO / Activated Alumina / UV Health (%) = 100 - (TDS * 0.05) - (Operating Hours * 0.1)
 */
export function calculateFilterHealth(
  params: WaterParameters,
  operatingHours: number = 240
): FilterHealthResult {
  const sediment = Math.max(0, Math.min(100, Math.round(100 - (params.turbidity * 0.5) - (operatingHours * 0.1))));
  const carbon = Math.max(0, Math.min(100, Math.round(100 - (params.tds * 0.04) - (operatingHours * 0.1))));
  const ro = Math.max(0, Math.min(100, Math.round(100 - (params.tds * 0.05) - (operatingHours * 0.1))));

  return {
    sediment,
    carbon,
    ro,
    operatingHours,
    hasWarning: sediment < 20 || carbon < 20 || ro < 20
  };
}
