/*
 * JalRakshak Smart Water Monitoring & Purification System
 * ESP32 C++ Firmware Extension Module (SIH26040 Alignment)
 * 
 * Features:
 * 1. DFPlayer Mini Audio Alert Module (UART Serial2: TX=GPIO16, RX=GPIO17)
 *    - Plays Track 001.mp3 (Hindi Safe Alert: "पानी पीने के लिए सुरक्षित है।")
 *    - Plays Track 002.mp3 (Hindi Unsafe Warning: "चेतावनी! पानी असुरक्षित है, कृपया प्रतीक्षा करें।")
 * 2. YF-S201 Water Flow Sensor Telemetry (GPIO13 Interrupt)
 *    - Tracks pulse frequency to calculate flow rate (L/min) and total purified volume (Liters)
 */

#include <Arduino.h>
#include <HardwareSerial.h>
#include <DFRobotDFPlayerMini.h>

// --- PIN DEFINITIONS ---
#define DFPLAYER_TX_PIN   16  // ESP32 GPIO16 connected to DFPlayer RX
#define DFPLAYER_RX_PIN   17  // ESP32 GPIO17 connected to DFPlayer TX
#define FLOW_SENSOR_PIN   13  // ESP32 GPIO13 connected to YF-S201 Signal pin

// --- OBJECT & VARIABLE DECLARATIONS ---
HardwareSerial dfSerial(2); // Use ESP32 HardwareSerial2
DFRobotDFPlayerMini myDFPlayer;

// Interrupt variables for YF-S201 Flow Sensor
volatile unsigned long pulseCount = 0;
float flowRateLPM = 0.0;
float totalPurifiedLiters = 1420.0; // Initialized to village daily counter baseline
unsigned long oldTime = 0;

// Threshold states
enum WaterQualityStatus { STATUS_SAFE, STATUS_UNSAFE };
WaterQualityStatus currentWaterStatus = STATUS_SAFE;
WaterQualityStatus previousWaterStatus = STATUS_SAFE;

// Flow Sensor Interrupt Service Routine (ISR)
void IRAM_ATTR flowSensorISR() {
  pulseCount++;
}

// --- BIS 10500 WATER QUALITY THRESHOLD CHECK ---
WaterQualityStatus evaluateWaterQuality(float ph, float tds, float turbidity, float temp) {
  // BIS limits: pH 6.5-8.5, TDS <= 500 ppm, Turbidity <= 15 NTU, Temp <= 28°C
  if (ph < 6.5 || ph > 8.5 || tds > 500.0 || turbidity > 15.0 || temp > 28.0) {
    return STATUS_UNSAFE;
  }
  return STATUS_SAFE;
}

void setup() {
  Serial.begin(115200);
  Serial.println(F("--- JalRakshak ESP32 Audio & Flow Telemetry Init ---"));

  // 1. Setup YF-S201 Flow Sensor Interrupt Pin
  pinMode(FLOW_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), flowSensorISR, RISING);

  // 2. Setup Hardware Serial2 for DFPlayer Mini
  dfSerial.begin(9600, SERIAL_8N1, DFPLAYER_RX_PIN, DFPLAYER_TX_PIN);

  // 3. Initialize DFPlayer Mini
  if (!myDFPlayer.begin(dfSerial)) {
    Serial.println(F("[ERROR] Unable to communicate with DFPlayer Mini. Check wiring!"));
  } else {
    Serial.println(F("[OK] DFPlayer Mini Online. Setting volume to 25."));
    myDFPlayer.volume(25); // Set volume (0 to 30)
  }

  oldTime = millis();
}

void loop() {
  // --- A. REAL-TIME FLOW SENSOR CALCULATION (Every 1 Second) ---
  if ((millis() - oldTime) >= 1000) {
    detachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN));

    // YF-S201 Calibration: Pulse frequency (Hz) = 7.5 * Q (L/min)
    flowRateLPM = ((1000.0 / (millis() - oldTime)) * pulseCount) / 7.5;
    
    // Accumulate total liters purified: (L/min / 60 sec)
    float litersInSecond = (flowRateLPM / 60.0);
    totalPurifiedLiters += litersInSecond;

    Serial.print(F("Flow Rate: "));
    Serial.print(flowRateLPM);
    Serial.print(F(" L/min | Total Purified Today: "));
    Serial.print(totalPurifiedLiters);
    Serial.println(F(" L"));

    pulseCount = 0;
    oldTime = millis();

    attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), flowSensorISR, RISING);
  }

  // --- B. WATER QUALITY SENSOR READINGS & AUDIO ALERT TRIGGER ---
  // Mock readings for demonstration (Replace with actual analogRead / I2C sensor calls)
  float mockPh = 6.8;
  float mockTds = 420.0;
  float mockTurbidity = 12.0;
  float mockTemp = 28.0;

  currentWaterStatus = evaluateWaterQuality(mockPh, mockTds, mockTurbidity, mockTemp);

  // Trigger audio message only on status state changes
  if (currentWaterStatus != previousWaterStatus) {
    if (currentWaterStatus == STATUS_SAFE) {
      Serial.println(F(">>> Status CHANGED to SAFE -> Playing Track 001.mp3"));
      myDFPlayer.play(1); // 001.mp3: "पानी पीने के लिए सुरक्षित है।"
    } else {
      Serial.println(F(">>> Status CHANGED to UNSAFE -> Playing Track 002.mp3"));
      myDFPlayer.play(2); // 002.mp3: "चेतावनी! पानी असुरक्षित है, कृपया प्रतीक्षा करें।"
    }
    previousWaterStatus = currentWaterStatus;
  }

  delay(100);
}
