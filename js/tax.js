// CareTracker - Tax Deduction Calculation Engine
// Handles IRS mileage rates, AGI thresholds, state tax estimates
// DISCLAIMER: This is an estimation tool, not tax advice. Consult a tax professional.

// IRS standard mileage rates for medical/moving purposes (cents per mile)
// Source: IRS Revenue Procedures published annually
const MEDICAL_MILEAGE_RATES = {
  US: {
    2023: 0.22,
    2024: 0.21,
    2025: 0.22,
    2026: 0.22, // Estimated - update when IRS publishes
  },
};

// Medical expense AGI floor - expenses must exceed this % of AGI to be deductible
const MEDICAL_AGI_THRESHOLD = 0.075; // 7.5%

// Simplified state income tax rates (approximate top marginal rates)
// Used for estimating state-level tax savings from deductions
const STATE_TAX_INFO = {
  AL: { rate: 0.05, name: 'Alabama', medicalDeduction: true },
  AK: { rate: 0, name: 'Alaska', medicalDeduction: false },
  AZ: { rate: 0.025, name: 'Arizona', medicalDeduction: true },
  AR: { rate: 0.044, name: 'Arkansas', medicalDeduction: true },
  CA: { rate: 0.133, name: 'California', medicalDeduction: true },
  CO: { rate: 0.044, name: 'Colorado', medicalDeduction: true },
  CT: { rate: 0.0699, name: 'Connecticut', medicalDeduction: true },
  DE: { rate: 0.066, name: 'Delaware', medicalDeduction: true },
  FL: { rate: 0, name: 'Florida', medicalDeduction: false },
  GA: { rate: 0.0549, name: 'Georgia', medicalDeduction: true },
  HI: { rate: 0.11, name: 'Hawaii', medicalDeduction: true },
  ID: { rate: 0.058, name: 'Idaho', medicalDeduction: true },
  IL: { rate: 0.0495, name: 'Illinois', medicalDeduction: true },
  IN: { rate: 0.0315, name: 'Indiana', medicalDeduction: true },
  IA: { rate: 0.06, name: 'Iowa', medicalDeduction: true },
  KS: { rate: 0.057, name: 'Kansas', medicalDeduction: true },
  KY: { rate: 0.04, name: 'Kentucky', medicalDeduction: true },
  LA: { rate: 0.0425, name: 'Louisiana', medicalDeduction: true },
  ME: { rate: 0.0715, name: 'Maine', medicalDeduction: true },
  MD: { rate: 0.0575, name: 'Maryland', medicalDeduction: true },
  MA: { rate: 0.09, name: 'Massachusetts', medicalDeduction: true },
  MI: { rate: 0.0425, name: 'Michigan', medicalDeduction: true },
  MN: { rate: 0.0985, name: 'Minnesota', medicalDeduction: true },
  MS: { rate: 0.05, name: 'Mississippi', medicalDeduction: true },
  MO: { rate: 0.048, name: 'Missouri', medicalDeduction: true },
  MT: { rate: 0.059, name: 'Montana', medicalDeduction: true },
  NE: { rate: 0.0564, name: 'Nebraska', medicalDeduction: true },
  NV: { rate: 0, name: 'Nevada', medicalDeduction: false },
  NH: { rate: 0, name: 'New Hampshire', medicalDeduction: false },
  NJ: { rate: 0.1075, name: 'New Jersey', medicalDeduction: true },
  NM: { rate: 0.059, name: 'New Mexico', medicalDeduction: true },
  NY: { rate: 0.109, name: 'New York', medicalDeduction: true },
  NC: { rate: 0.045, name: 'North Carolina', medicalDeduction: true },
  ND: { rate: 0.025, name: 'North Dakota', medicalDeduction: true },
  OH: { rate: 0.035, name: 'Ohio', medicalDeduction: true },
  OK: { rate: 0.0475, name: 'Oklahoma', medicalDeduction: true },
  OR: { rate: 0.099, name: 'Oregon', medicalDeduction: true },
  PA: { rate: 0.0307, name: 'Pennsylvania', medicalDeduction: true },
  RI: { rate: 0.0599, name: 'Rhode Island', medicalDeduction: true },
  SC: { rate: 0.064, name: 'South Carolina', medicalDeduction: true },
  SD: { rate: 0, name: 'South Dakota', medicalDeduction: false },
  TN: { rate: 0, name: 'Tennessee', medicalDeduction: false },
  TX: { rate: 0, name: 'Texas', medicalDeduction: false },
  UT: { rate: 0.0465, name: 'Utah', medicalDeduction: true },
  VT: { rate: 0.0875, name: 'Vermont', medicalDeduction: true },
  VA: { rate: 0.0575, name: 'Virginia', medicalDeduction: true },
  WA: { rate: 0, name: 'Washington', medicalDeduction: false },
  WV: { rate: 0.0512, name: 'West Virginia', medicalDeduction: true },
  WI: { rate: 0.0765, name: 'Wisconsin', medicalDeduction: true },
  WY: { rate: 0, name: 'Wyoming', medicalDeduction: false },
  DC: { rate: 0.1075, name: 'District of Columbia', medicalDeduction: true },
};

export const Tax = {
  getMileageRate(country, year) {
    const countryRates = MEDICAL_MILEAGE_RATES[country] || MEDICAL_MILEAGE_RATES['US'];
    if (countryRates[year]) return countryRates[year];
    // Fall back to most recent known rate
    const years = Object.keys(countryRates).map(Number).sort().reverse();
    return countryRates[years[0]] || 0.22;
  },

  getStateInfo(stateCode) {
    return STATE_TAX_INFO[stateCode] || { rate: 0, name: stateCode, medicalDeduction: false };
  },

  getStates() {
    return Object.entries(STATE_TAX_INFO).map(([code, info]) => ({
      code,
      ...info,
    }));
  },

  // Estimate which federal tax bracket someone falls in
  estimateFederalRate(agi) {
    // 2026 estimated brackets (single filer, simplified)
    if (agi <= 11600) return 0.10;
    if (agi <= 47150) return 0.12;
    if (agi <= 100525) return 0.22;
    if (agi <= 191950) return 0.24;
    if (agi <= 243725) return 0.32;
    if (agi <= 609350) return 0.35;
    return 0.37;
  },

  // Main calculation: total deductions and estimated tax savings
  calculateDeductions(mileageLog, expenses, settings) {
    const year = settings.taxYear || new Date().getFullYear();
    const country = settings.location?.country || 'US';
    const state = settings.location?.state || '';

    // Filter to current tax year
    const yearMileage = mileageLog.filter(
      (e) => new Date(e.date).getFullYear() === year
    );
    const yearExpenses = expenses.filter(
      (e) => new Date(e.date).getFullYear() === year
    );

    // Total medical miles
    const totalMiles = yearMileage.reduce(
      (sum, e) => sum + (parseFloat(e.miles) || 0),
      0
    );

    // Mileage deduction value
    const mileageRate = this.getMileageRate(country, year);
    const mileageDeduction = totalMiles * mileageRate;

    // Total out-of-pocket medical expenses
    const totalExpenses = yearExpenses.reduce(
      (sum, e) => sum + (parseFloat(e.amount) || 0),
      0
    );

    // Combined qualifying medical costs
    const totalMedical = mileageDeduction + totalExpenses;

    // AGI threshold for itemized medical deduction (US)
    const agi = parseFloat(settings.agi) || 0;
    const agiThreshold = agi * MEDICAL_AGI_THRESHOLD;
    const deductibleAmount = Math.max(0, totalMedical - agiThreshold);

    // Estimated tax savings
    const federalRate = this.estimateFederalRate(agi);
    const federalSavings = deductibleAmount * federalRate;

    const stateInfo = this.getStateInfo(state);
    const stateSavings = stateInfo.medicalDeduction
      ? deductibleAmount * stateInfo.rate
      : 0;

    // Expense breakdown by category
    const expensesByCategory = {};
    yearExpenses.forEach((e) => {
      const cat = e.category || 'other';
      if (!expensesByCategory[cat]) expensesByCategory[cat] = 0;
      expensesByCategory[cat] += parseFloat(e.amount) || 0;
    });

    // Miles by month for chart
    const milesByMonth = Array(12).fill(0);
    yearMileage.forEach((e) => {
      const month = new Date(e.date).getMonth();
      milesByMonth[month] += parseFloat(e.miles) || 0;
    });

    return {
      year,
      totalMiles,
      mileageRate,
      mileageDeduction,
      totalExpenses,
      totalMedical,
      agi,
      agiThreshold,
      deductibleAmount,
      federalRate,
      federalSavings,
      stateRate: stateInfo.rate,
      stateName: stateInfo.name,
      stateSavings,
      totalEstimatedSavings: federalSavings + stateSavings,
      expensesByCategory,
      milesByMonth,
      tripCount: yearMileage.length,
      expenseCount: yearExpenses.length,
    };
  },

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  formatMiles(miles) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(miles);
  },
};
