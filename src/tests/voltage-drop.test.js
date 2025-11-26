
import * as Calc from "../utils/VoltageCalc/"; 
import {expect, test, describe} from 'vitest';


// Each case is built from a real K value
// voltageDrop is chosen so that generateK should give back expectedK.
const cases = [
  { voltageDrop: 4.960000,  current: 10,  length: 25,  phase: 1, expectedK: 9.92 },
  { voltageDrop: 10.812500, current: 20,  length: 50,  phase: 3, expectedK: 6.25 },
  { voltageDrop: 17.415000, current: 30,  length: 75,  phase: 1, expectedK: 3.87 },
  { voltageDrop: 16.954000, current: 40,  length: 100, phase: 3, expectedK: 2.45 },
  { voltageDrop: 19.375000, current: 50,  length: 125, phase: 1, expectedK: 1.55 },
  { voltageDrop: 15.367590, current: 60,  length: 150, phase: 3, expectedK: 0.987 },
  { voltageDrop: 15.410500, current: 70,  length: 175, phase: 1, expectedK: 0.629 },
  { voltageDrop: 14.255200, current: 80,  length: 200, phase: 3, expectedK: 0.515 },
  { voltageDrop: 13.689000, current: 90,  length: 225, phase: 1, expectedK: 0.338 },
  { voltageDrop: 8.563500,  current: 100, length: 250, phase: 3, expectedK: 0.198 },
  { voltageDrop: 10.406000, current: 110, length: 275, phase: 1, expectedK: 0.172 },
  { voltageDrop: 9.217440,  current: 120, length: 300, phase: 3, expectedK: 0.148 },
  { voltageDrop: 11.407500, current: 130, length: 325, phase: 1, expectedK: 0.135 },
  { voltageDrop: 10.257170, current: 140, length: 350, phase: 3, expectedK: 0.121 },
  { voltageDrop: 11.700000, current: 150, length: 375, phase: 1, expectedK: 0.104 },
  { voltageDrop: 9.411200,  current: 160, length: 400, phase: 3, expectedK: 0.085 },
  { voltageDrop: 10.678550, current: 170, length: 425, phase: 1, expectedK: 0.0739 },
];

test('generate k values', () => {
    cases.forEach(({voltageDrop, current, length, phase, expectedK }) => {
        expect(Calc.generateK(voltageDrop, current, length, phase)).toBeCloseTo(expectedK, 2)

    })
})


const voltageDropCases = [
  // single-phase (f = 2)
  { kFactor: 9.92, current: 10,  length: 25,  phase: 1, expectedVoltageDrop: 4.96 },
  { kFactor: 3.87, current: 30,  length: 75,  phase: 1, expectedVoltageDrop: 17.415 },
  { kFactor: 1.55, current: 50,  length: 125, phase: 1, expectedVoltageDrop: 19.375 },
  { kFactor: 0.629, current: 70, length: 175, phase: 1, expectedVoltageDrop: 15.4105 },
  { kFactor: 0.338, current: 90, length: 225, phase: 1, expectedVoltageDrop: 13.689 },
  { kFactor: 0.172, current: 110, length: 275, phase: 1, expectedVoltageDrop: 10.406 },

  // three-phase (f = 1.73)
  { kFactor: 6.25,  current: 20,  length: 50,  phase: 3, expectedVoltageDrop: 10.8125 },
  { kFactor: 2.45,  current: 40,  length: 100, phase: 3, expectedVoltageDrop: 16.954 },
  { kFactor: 0.987, current: 60,  length: 150, phase: 3, expectedVoltageDrop: 15.36759 },
  { kFactor: 0.515, current: 80,  length: 200, phase: 3, expectedVoltageDrop: 14.2552 },
  { kFactor: 0.198, current: 100, length: 250, phase: 3, expectedVoltageDrop: 8.5635 },
  { kFactor: 0.148, current: 120, length: 300, phase: 3, expectedVoltageDrop: 9.21744 },
];



test.each(voltageDropCases)('calculate voltage drop from k - kFactor: $kFactor, current: $current, length: $length, phase: $phase', ({ kFactor, current, length, phase, expectedVoltageDrop }) => {
    expect(Calc.voltageDropFromK(kFactor, current, length, phase)).toBeCloseTo(expectedVoltageDrop, 1);
});



export const getWireSizeCases  = [
  // --- 120 V single-phase, copper, raceway ---

  {
    name: "Short 120 V, 15 A, 10 m, Cu raceway, 3% → #14",
    percentDrop: 3,
    voltage: 120,
    current: 15,
    length: 10,
    phase: 1,
    method: "raceway",
    material: "copper",
    expectedSize: "14",
  },

  {
    name: "Longer 120 V, 15 A, 30 m, Cu raceway, 3% → #10",
    percentDrop: 3,
    voltage: 120,
    current: 15,
    length: 30,
    phase: 1,
    method: "raceway",
    material: "copper",
    expectedSize: "10",
  },

  // --- 240 V single-phase, copper, raceway vs cable ---

  {
    name: "240 V, 30 A, 40 m, Cu raceway, 3% → #8",
    percentDrop: 3,
    voltage: 240,
    current: 30,
    length: 40,
    phase: 1,
    method: "raceway",
    material: "copper",
    expectedSize: "8",
  },

  {
    name: "240 V, 30 A, 40 m, Cu cable, 3% → #8",
    percentDrop: 3,
    voltage: 240,
    current: 30,
    length: 40,
    phase: 1,
    method: "cable",
    material: "copper",
    expectedSize: "8",
  },

  // --- Copper vs aluminum comparison, same run ---

  {
    name: "240 V, 50 A, 50 m, Cu raceway, 3% → #4",
    percentDrop: 3,
    voltage: 240,
    current: 50,
    length: 50,
    phase: 1,
    method: "raceway",
    material: "copper",
    expectedSize: "4",
  },

  {
    name: "240 V, 50 A, 50 m, Al raceway, 3% → #3",
    percentDrop: 3,
    voltage: 240,
    current: 50,
    length: 50,
    phase: 1,
    method: "raceway",
    material: "aluminum",
    expectedSize: "3",
  },

  // --- 600 V 3-phase, aluminum, raceway, 3% vs 5% ---

  {
    name: "600 V 3 phase, 100 A, 100 m, Al raceway, 3% → #2",
    percentDrop: 3,
    voltage: 600,
    current: 100,
    length: 100,
    phase: 3,
    method: "raceway",
    material: "aluminum",
    expectedSize: "2",
  },

  {
    name: "600 V 3 phase, 100 A, 100 m, Al raceway, 5% → #4",
    percentDrop: 5,
    voltage: 600,
    current: 100,
    length: 100,
    phase: 3,
    method: "raceway",
    material: "aluminum",
    expectedSize: "4",
  },

  // --- 600 V 3-phase, copper cable, 3% vs 5% ---

  {
    name: "600 V 3 phase, 200 A, 75 m, Cu cable, 3% → #2",
    percentDrop: 3,
    voltage: 600,
    current: 200,
    length: 75,
    phase: 3,
    method: "cable",
    material: "copper",
    expectedSize: "2",
  },

  {
    name: "600 V 3 phase, 200 A, 75 m, Cu cable, 5% → #4",
    percentDrop: 5,
    voltage: 600,
    current: 200,
    length: 75,
    phase: 3,
    method: "cable",
    material: "copper",
    expectedSize: "4",
  },
];


describe("getWireSize", () => {
  test.each(getWireSizeCases)("%s", (tc) => {
    const {
      percentDrop,
      voltage,
      current,
      length,
      phase,
      method,
      material,
      expectedSize,
    } = tc;

    const {size}= Calc.getWireSize(
      percentDrop,
      voltage,
      current,
      length,
      phase,
      method,
      material
    );

    expect(size.startsWith(expectedSize)).toBe(true);
  });
});