// backend/committee/hayCharts.js

// Hay Group Guide Chart values — transcribed from ABC's Guide Chart PDF

// NOTE: These are approximations for demo. Comp COE should validate for production.

export const HAY_CHARTS = {
  // Know-How points — simplified matrix

  // Rows = Practical Knowledge (A-H), Cols = Managerial (T,I,II,III,IV), Multiplier = Human Relations (1,2,3)

  knowHowBase: {
    A: { T: 50, I: 66, II: 87, III: 115, IV: 152 },

    B: { T: 66, I: 87, II: 115, III: 152, IV: 200 },

    C: { T: 87, I: 115, II: 152, III: 200, IV: 264 },

    D: { T: 115, I: 152, II: 200, III: 264, IV: 350 },

    E: { T: 152, I: 200, II: 264, III: 350, IV: 460 },

    F: { T: 200, I: 264, II: 350, III: 460, IV: 608 },

    G: { T: 264, I: 350, II: 460, III: 608, IV: 800 },

    H: { T: 350, I: 460, II: 608, III: 800, IV: 1056 },
  },

  humanRelationsMultiplier: {
    1: 1.0,

    2: 1.15,

    3: 1.32,
  },

  // Problem Solving % — Environment (A-H) × Challenge (1-5)

  problemSolvingPct: {
    A: { 1: 10, 2: 12, 3: 14, 4: 16, 5: 19 },

    B: { 1: 12, 2: 14, 3: 16, 4: 19, 5: 22 },

    C: { 1: 14, 2: 16, 3: 19, 4: 22, 5: 25 },

    D: { 1: 16, 2: 19, 3: 22, 4: 25, 5: 29 },

    E: { 1: 19, 2: 22, 3: 25, 4: 29, 5: 33 },

    F: { 1: 22, 2: 25, 3: 29, 4: 33, 5: 38 },

    G: { 1: 25, 2: 29, 3: 33, 4: 38, 5: 43 },

    H: { 1: 29, 2: 33, 3: 38, 4: 43, 5: 50 },
  },

  // Accountability base — Freedom (A-H) × Magnitude bucket (1-6)

  accountabilityBase: {
    A: { 1: 25, 2: 33, 3: 43, 4: 57, 5: 76, 6: 100 },

    B: { 1: 33, 2: 43, 3: 57, 4: 76, 5: 100, 6: 132 },

    C: { 1: 43, 2: 57, 3: 76, 4: 100, 5: 132, 6: 175 },

    D: { 1: 57, 2: 76, 3: 100, 4: 132, 5: 175, 6: 230 },

    E: { 1: 76, 2: 100, 3: 132, 4: 175, 5: 230, 6: 304 },

    F: { 1: 100, 2: 132, 3: 175, 4: 230, 5: 304, 6: 400 },

    G: { 1: 132, 2: 175, 3: 230, 4: 304, 5: 400, 6: 528 },

    H: { 1: 175, 2: 230, 3: 304, 4: 400, 5: 528, 6: 700 },
  },

  impactMultiplier: {
    R: 0.5, // Remote

    C: 0.75, // Contributory

    S: 1.0, // Shared

    P: 1.32, // Prime
  },

  // Band mapping — total points → JB (REVERSE: lower JB = higher score)

  bandMapping: [
    { min: 3000, band: "JB 1" },

    { min: 2000, band: "JB 2" },

    { min: 1500, band: "JB 3" },

    { min: 1100, band: "JB 4" },

    { min: 800, band: "JB 5" },

    { min: 600, band: "JB 6" },

    { min: 450, band: "JB 7" },

    { min: 300, band: "JB 8" },

    { min: 200, band: "JB 9" },

    { min: 0, band: "JB 10" },
  ],
};

export function computeKnowHow(practical, managerial, humanRelations) {
  const base = HAY_CHARTS.knowHowBase[practical]?.[managerial] || 0;

  const mult = HAY_CHARTS.humanRelationsMultiplier[humanRelations] || 1;

  return Math.round(base * mult);
}

export function computeProblemSolving(knowHowPoints, environment, challenge) {
  const pct = HAY_CHARTS.problemSolvingPct[environment]?.[challenge] || 0;

  return { pct, points: Math.round((knowHowPoints * pct) / 100) };
}

export function computeAccountability(freedom, magnitude, impact) {
  const base = HAY_CHARTS.accountabilityBase[freedom]?.[magnitude] || 0;

  const mult = HAY_CHARTS.impactMultiplier[impact] || 1;

  return Math.round(base * mult);
}

export function mapBand(totalPoints) {
  const found = HAY_CHARTS.bandMapping.find((b) => totalPoints >= b.min);

  return found ? found.band : "JB 10";
}
