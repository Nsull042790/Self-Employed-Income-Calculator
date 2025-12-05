// Self-Employed Income Calculation Utilities
// Based on Fannie Mae Form 1084 Cash Flow Analysis Guidelines

// ============================================
// TAX LINE REFERENCES
// ============================================
export const TAX_LINE_REFERENCES = {
  'schedule-c': {
    netIncome: { form: 'Schedule C', line: '31', description: 'Net Profit or (Loss)' },
    depreciation: { form: 'Schedule C', line: '13', description: 'Depreciation' },
    depletion: { form: 'Schedule C', line: '12', description: 'Depletion' },
    amortization: { form: 'Form 4562', line: '44', description: 'Amortization' },
    homeOffice: { form: 'Form 8829', line: '36', description: 'Business Use of Home' },
    mealsEntertainment: { form: 'Schedule C', line: '24b', description: 'Meals (enter 50% for add-back)' },
    businessMiles: { form: 'Schedule C', line: '9', description: 'Car/Truck Expenses (if standard mileage)' },
  },
  's-corp': {
    w2Income: { form: 'W-2', line: 'Box 1', description: 'Wages from S-Corp' },
    k1Income: { form: 'K-1 (1120S)', line: 'Box 1', description: 'Ordinary Business Income' },
    distributions: { form: 'K-1 (1120S)', line: 'Box 16D', description: 'Distributions' },
    depreciation: { form: '1120S', line: '14', description: 'Depreciation' },
    depletion: { form: '1120S', line: '15', description: 'Depletion' },
    amortization: { form: 'Form 4562', line: '44', description: 'Amortization' },
    notesPayable: { form: '1120S Sch L', line: '17d', description: 'Notes Payable <1 Year' },
    mortgagesPayable: { form: '1120S Sch L', line: '18d', description: 'Mortgages/Notes Payable' },
    ownership: { form: 'K-1 (1120S)', line: 'Part I, Item F', description: 'Ownership Percentage' },
  },
  'partnership': {
    ordinaryIncome: { form: 'K-1 (1065)', line: 'Box 1', description: 'Ordinary Business Income' },
    guaranteedPayments: { form: 'K-1 (1065)', line: 'Box 4', description: 'Guaranteed Payments' },
    depreciation: { form: '1065', line: '16c', description: 'Depreciation' },
    depletion: { form: '1065', line: '17', description: 'Depletion' },
    amortization: { form: 'Form 4562', line: '44', description: 'Amortization' },
    notesPayable: { form: '1065 Sch L', line: '17d', description: 'Notes Payable <1 Year' },
    ownership: { form: 'K-1 (1065)', line: 'Part I, Item J', description: 'Partnership Interest' },
  },
  'c-corp': {
    w2Income: { form: 'W-2', line: 'Box 1', description: 'Wages from C-Corp' },
    dividends: { form: '1099-DIV', line: 'Box 1a', description: 'Ordinary Dividends' },
    depreciation: { form: '1120', line: '20', description: 'Depreciation' },
    depletion: { form: '1120', line: '21', description: 'Depletion' },
    amortization: { form: 'Form 4562', line: '44', description: 'Amortization' },
    notesPayable: { form: '1120 Sch L', line: '17d', description: 'Notes Payable <1 Year' },
  },
  'schedule-e': {
    grossRent: { form: 'Schedule E', line: '3', description: 'Rents Received' },
    depreciation: { form: 'Schedule E', line: '18', description: 'Depreciation' },
    insurance: { form: 'Schedule E', line: '9', description: 'Insurance' },
    mortgageInterest: { form: 'Schedule E', line: '12', description: 'Mortgage Interest' },
    taxes: { form: 'Schedule E', line: '16', description: 'Taxes' },
    totalExpenses: { form: 'Schedule E', line: '20', description: 'Total Expenses' },
  },
  '1099': {
    necIncome: { form: '1099-NEC', line: 'Box 1', description: 'Nonemployee Compensation' },
    miscIncome: { form: '1099-MISC', line: 'Box 7', description: 'Nonemployee Compensation (pre-2020)' },
  },
};

// ============================================
// CORE INCOME CALCULATIONS
// ============================================

/**
 * Calculate adjusted income for Schedule C (Sole Proprietor)
 */
export function calculateAdjustedIncome(yearData) {
  const netIncome = parseFloat(yearData.netIncome) || 0;
  const depreciation = parseFloat(yearData.depreciation) || 0;
  const depletion = parseFloat(yearData.depletion) || 0;
  const amortization = parseFloat(yearData.amortization) || 0;
  const mileageAddBack = parseFloat(yearData.mileageAddBack) || 0;
  const mealsAddBack = parseFloat(yearData.mealsAddBack) || 0;
  const homeOfficeAddBack = parseFloat(yearData.homeOfficeAddBack) || 0;
  const nonRecurring = parseFloat(yearData.nonRecurring) || 0;
  const casualtyLoss = parseFloat(yearData.casualtyLoss) || 0;

  return (
    netIncome +
    depreciation +
    depletion +
    amortization +
    mileageAddBack +
    mealsAddBack +
    homeOfficeAddBack +
    casualtyLoss -
    nonRecurring
  );
}

/**
 * Calculate S-Corp adjusted income (includes W-2, K-1, and required deductions)
 * Per Fannie Mae: Must subtract Notes Payable <1 year from Schedule L
 */
export function calculateSCorpIncome(yearData) {
  const w2Income = parseFloat(yearData.w2Income) || 0;
  const k1Income = parseFloat(yearData.k1Income) || 0;
  const depreciation = parseFloat(yearData.depreciation) || 0;
  const depletion = parseFloat(yearData.depletion) || 0;
  const amortization = parseFloat(yearData.amortization) || 0;
  const mileageAddBack = parseFloat(yearData.mileageAddBack) || 0;
  const mealsAddBack = parseFloat(yearData.mealsAddBack) || 0;
  const nonRecurring = parseFloat(yearData.nonRecurring) || 0;
  const notesPayableLessThanYear = parseFloat(yearData.notesPayableLessThanYear) || 0;
  const ownershipPercent = (parseFloat(yearData.ownershipPercent) || 100) / 100;

  // Per Form 1084: K-1 income + add-backs - notes payable, then multiply by ownership
  const k1Adjusted =
    (k1Income + depreciation + depletion + amortization + mileageAddBack + mealsAddBack - nonRecurring - notesPayableLessThanYear) *
    ownershipPercent;

  return w2Income + k1Adjusted;
}

/**
 * Calculate Partnership adjusted income
 * Per Fannie Mae: Must subtract Notes Payable <1 year from Schedule L
 */
export function calculatePartnershipIncome(yearData) {
  const ordinaryIncome = parseFloat(yearData.ordinaryIncome) || 0;
  const guaranteedPayments = parseFloat(yearData.guaranteedPayments) || 0;
  const depreciation = parseFloat(yearData.depreciation) || 0;
  const depletion = parseFloat(yearData.depletion) || 0;
  const amortization = parseFloat(yearData.amortization) || 0;
  const mileageAddBack = parseFloat(yearData.mileageAddBack) || 0;
  const mealsAddBack = parseFloat(yearData.mealsAddBack) || 0;
  const nonRecurring = parseFloat(yearData.nonRecurring) || 0;
  const notesPayableLessThanYear = parseFloat(yearData.notesPayableLessThanYear) || 0;
  const ownershipPercent = (parseFloat(yearData.ownershipPercent) || 100) / 100;

  const adjustedIncome =
    (ordinaryIncome + depreciation + depletion + amortization + mileageAddBack + mealsAddBack - nonRecurring - notesPayableLessThanYear) *
    ownershipPercent;

  return guaranteedPayments + adjustedIncome;
}

/**
 * Calculate C-Corp adjusted income
 */
export function calculateCCorpIncome(yearData) {
  const w2Income = parseFloat(yearData.w2Income) || 0;
  const dividends = parseFloat(yearData.dividends) || 0;
  const corporateIncome = parseFloat(yearData.corporateIncome) || 0;
  const depreciation = parseFloat(yearData.depreciation) || 0;
  const depletion = parseFloat(yearData.depletion) || 0;
  const amortization = parseFloat(yearData.amortization) || 0;
  const nonRecurring = parseFloat(yearData.nonRecurring) || 0;
  const notesPayableLessThanYear = parseFloat(yearData.notesPayableLessThanYear) || 0;
  const ownershipPercent = (parseFloat(yearData.ownershipPercent) || 100) / 100;

  const adjustedCorpIncome =
    (corporateIncome + depreciation + depletion + amortization - nonRecurring - notesPayableLessThanYear) * ownershipPercent;

  return w2Income + dividends + adjustedCorpIncome;
}

/**
 * Calculate Rental Income from Schedule E
 * Per Fannie Mae Form 1037/1038
 */
export function calculateRentalIncome(rentalData) {
  const grossRent = parseFloat(rentalData.grossRent) || 0;
  const totalExpenses = parseFloat(rentalData.totalExpenses) || 0;
  const depreciation = parseFloat(rentalData.depreciation) || 0;
  const mortgageInterest = parseFloat(rentalData.mortgageInterest) || 0;
  const insurance = parseFloat(rentalData.insurance) || 0;
  const taxes = parseFloat(rentalData.taxes) || 0;
  const hoaDues = parseFloat(rentalData.hoaDues) || 0;
  const floodInsurance = parseFloat(rentalData.floodInsurance) || 0;

  // Net rental income from Schedule E + depreciation add-back
  const scheduleEIncome = grossRent - totalExpenses + depreciation;

  // Monthly PITIA (Principal, Interest, Taxes, Insurance, HOA)
  const monthlyPITIA = (mortgageInterest / 12) + (insurance / 12) + (taxes / 12) + (hoaDues / 12) + (floodInsurance / 12);

  // Net cash flow = Schedule E income / 12 months
  const monthlyNetIncome = scheduleEIncome / 12;

  return {
    annualIncome: scheduleEIncome,
    monthlyIncome: monthlyNetIncome,
    monthlyPITIA,
    netCashFlow: monthlyNetIncome - monthlyPITIA,
  };
}

/**
 * Calculate 1099 Income
 */
export function calculate1099Income(data) {
  const year1Income = parseFloat(data.year1Income) || 0;
  const year2Income = parseFloat(data.year2Income) || 0;
  const expensePercent = (parseFloat(data.expensePercent) || 0) / 100;

  const year1Net = year1Income * (1 - expensePercent);
  const year2Net = year2Income * (1 - expensePercent);

  // Use lower of two years if declining, otherwise average
  const isDeclined = year1Net < year2Net;
  const qualifyingAnnual = isDeclined ? year1Net : (year1Net + year2Net) / 2;

  return {
    year1Net,
    year2Net,
    average: (year1Net + year2Net) / 2,
    qualifyingAnnual,
    qualifyingMonthly: qualifyingAnnual / 12,
    isDeclined,
  };
}

/**
 * Calculate Bank Statement Income
 */
export function calculateBankStatementIncome(data) {
  const totalDeposits = parseFloat(data.totalDeposits) || 0;
  const numberOfMonths = parseFloat(data.numberOfMonths) || 12;
  const expenseFactor = (parseFloat(data.expenseFactor) || 50) / 100;

  const averageMonthlyDeposits = totalDeposits / numberOfMonths;
  const qualifyingMonthly = averageMonthlyDeposits * (1 - expenseFactor);

  return {
    totalDeposits,
    averageMonthlyDeposits,
    expenseFactor: expenseFactor * 100,
    qualifyingMonthly,
    qualifyingAnnual: qualifyingMonthly * 12,
  };
}

// ============================================
// INCOME AVERAGING & TRENDING
// ============================================

/**
 * Calculate 2-year average monthly income
 */
export function calculateMonthlyIncome(year1Total, year2Total) {
  const average = (year1Total + year2Total) / 2;
  return average / 12;
}

/**
 * Calculate income using appropriate method based on trend
 * Per Fannie Mae: Use lower year if declining, average if stable/increasing
 */
export function calculateQualifyingIncome(year1Total, year2Total) {
  const isDeclined = year1Total < year2Total;
  const average = (year1Total + year2Total) / 2;
  const declinePercent = year2Total !== 0 ? ((year2Total - year1Total) / Math.abs(year2Total)) * 100 : 0;

  return {
    average,
    monthlyAverage: average / 12,
    year1Monthly: year1Total / 12,
    year2Monthly: year2Total / 12,
    isDeclined,
    declinePercent,
    // If declined >20%, recommend using year 1 only
    recommendedMonthly: isDeclined && Math.abs(declinePercent) > 20 ? year1Total / 12 : average / 12,
    method: isDeclined && Math.abs(declinePercent) > 20 ? 'Most Recent Year' : '2-Year Average',
  };
}

/**
 * Calculate income decline percentage
 */
export function calculateDeclinePercent(year1Total, year2Total) {
  if (year2Total === 0) return 0;
  return ((year2Total - year1Total) / Math.abs(year2Total)) * 100;
}

/**
 * Check if income is declining
 */
export function isIncomeDeclining(year1Total, year2Total) {
  return year1Total < year2Total;
}

/**
 * Calculate YTD annualized income and trend
 */
export function calculateYTDTrend(ytdIncome, ytdMonths, year1Total) {
  if (ytdMonths <= 0) return null;

  const annualized = (ytdIncome / ytdMonths) * 12;
  const percentOfPriorYear = year1Total !== 0 ? (annualized / year1Total) * 100 : 0;

  return {
    ytdIncome,
    ytdMonths,
    annualized,
    monthlyPace: ytdIncome / ytdMonths,
    percentOfPriorYear,
    trend: percentOfPriorYear >= 100 ? 'increasing' : percentOfPriorYear >= 90 ? 'stable' : 'declining',
  };
}

// ============================================
// LIQUIDITY ANALYSIS
// ============================================

/**
 * Analyze business liquidity for K-1 income verification
 * Per Fannie Mae: If K-1 doesn't show stable distributions, must verify business can pay
 */
export function analyzeLiquidity(data) {
  const businessCash = parseFloat(data.businessCash) || 0;
  const accountsReceivable = parseFloat(data.accountsReceivable) || 0;
  const accountsPayable = parseFloat(data.accountsPayable) || 0;
  const notesPayable = parseFloat(data.notesPayable) || 0;
  const k1Income = parseFloat(data.k1Income) || 0;
  const hasDistributionHistory = data.hasDistributionHistory || false;

  const liquidAssets = businessCash + accountsReceivable;
  const currentLiabilities = accountsPayable + notesPayable;
  const netLiquidity = liquidAssets - currentLiabilities;
  const liquidityRatio = currentLiabilities > 0 ? liquidAssets / currentLiabilities : liquidAssets > 0 ? 999 : 0;

  // Can business support the K-1 income distribution?
  const canSupportDistribution = netLiquidity >= k1Income * 0.5; // At least 50% of K-1 income available

  return {
    liquidAssets,
    currentLiabilities,
    netLiquidity,
    liquidityRatio,
    canSupportDistribution,
    needsAdditionalDocs: !hasDistributionHistory && !canSupportDistribution,
    status: hasDistributionHistory ? 'verified' : canSupportDistribution ? 'adequate' : 'insufficient',
  };
}

// ============================================
// DTI CALCULATIONS
// ============================================

/**
 * Calculate Debt-to-Income ratios
 */
export function calculateDTI(data) {
  const monthlyIncome = parseFloat(data.monthlyIncome) || 0;
  const proposedPITIA = parseFloat(data.proposedPITIA) || 0;
  const otherMonthlyDebts = parseFloat(data.otherMonthlyDebts) || 0;

  const frontEndDTI = monthlyIncome > 0 ? (proposedPITIA / monthlyIncome) * 100 : 0;
  const backEndDTI = monthlyIncome > 0 ? ((proposedPITIA + otherMonthlyDebts) / monthlyIncome) * 100 : 0;

  // Calculate income needed for different DTI targets
  const incomeFor43DTI = (proposedPITIA + otherMonthlyDebts) / 0.43;
  const incomeFor45DTI = (proposedPITIA + otherMonthlyDebts) / 0.45;
  const incomeFor50DTI = (proposedPITIA + otherMonthlyDebts) / 0.50;

  // Calculate max payment at different DTI limits
  const maxPaymentAt43 = (monthlyIncome * 0.43) - otherMonthlyDebts;
  const maxPaymentAt45 = (monthlyIncome * 0.45) - otherMonthlyDebts;
  const maxPaymentAt50 = (monthlyIncome * 0.50) - otherMonthlyDebts;

  return {
    frontEndDTI,
    backEndDTI,
    incomeFor43DTI,
    incomeFor45DTI,
    incomeFor50DTI,
    maxPaymentAt43,
    maxPaymentAt45,
    maxPaymentAt50,
    meetsConventional: backEndDTI <= 45,
    meetsFHA: backEndDTI <= 43,
    status: backEndDTI <= 36 ? 'excellent' : backEndDTI <= 43 ? 'good' : backEndDTI <= 50 ? 'acceptable' : 'high',
  };
}

// ============================================
// ENHANCED WARNINGS
// ============================================

/**
 * Generate comprehensive warnings based on income data
 */
export function generateWarnings(data) {
  const warnings = [];
  const year1Total = data.year1Total || 0;
  const year2Total = data.year2Total || 0;
  const yearsInBusiness = data.yearsInBusiness || '5+';
  const ytdIncome = data.ytdIncome || 0;
  const ytdMonths = data.ytdMonths || 0;
  const shortTermDebt = data.shortTermDebt || false;
  const businessOperating = data.businessOperating !== false;
  const ownershipPercent = parseFloat(data.ownershipPercent) || 100;
  const hasDistributionHistory = data.hasDistributionHistory || false;
  const notesPayableLessThanYear = parseFloat(data.notesPayableLessThanYear) || 0;
  const entityType = data.entityType || 'schedule-c';
  const mealsAddBack = parseFloat(data.mealsAddBack) || 0;
  const businessStartDate = data.businessStartDate;
  const amendedReturns = data.amendedReturns || false;
  const pppEidlIncome = parseFloat(data.pppEidlIncome) || 0;

  // Declining income warning (critical)
  if (year1Total < year2Total) {
    const declinePercent = Math.abs(((year2Total - year1Total) / year2Total) * 100);
    if (declinePercent > 20) {
      warnings.push({
        type: 'error',
        code: 'DECLINING_INCOME_SEVERE',
        message: `DECLINING INCOME: Year 1 is ${declinePercent.toFixed(0)}% lower than Year 2. Underwriter WILL use Year 1 only.`,
        recommendation: 'Use conservative estimate in qualification. Prepare explanation letter.',
      });
    } else if (declinePercent > 10) {
      warnings.push({
        type: 'warning',
        code: 'DECLINING_INCOME_MODERATE',
        message: `Income declined ${declinePercent.toFixed(0)}% from Year 2 to Year 1.`,
        recommendation: 'May require letter of explanation. Monitor YTD closely.',
      });
    }
  }

  // Business loss warning (critical)
  if (year1Total < 0 || year2Total < 0) {
    warnings.push({
      type: 'error',
      code: 'BUSINESS_LOSS',
      message: 'BUSINESS SHOWS LOSS: Negative income will REDUCE qualifying income from other sources.',
      recommendation: 'Loss must be subtracted from total income. Consider if borrower has other income sources.',
    });
  }

  // YTD trending down
  if (ytdMonths > 0) {
    const ytdAnnualized = (ytdIncome / ytdMonths) * 12;
    if (ytdAnnualized < year1Total * 0.9) {
      const ytdDecline = ((year1Total - ytdAnnualized) / year1Total * 100).toFixed(0);
      warnings.push({
        type: 'warning',
        code: 'YTD_DECLINING',
        message: `YTD TRENDING DOWN: Current year pace is ${ytdDecline}% below last year.`,
        recommendation: 'UW may require current P&L and explanation. Income may not be usable if trend continues.',
      });
    }
  }

  // Less than 2 years self-employed
  if (yearsInBusiness === '<1') {
    warnings.push({
      type: 'error',
      code: 'INSUFFICIENT_HISTORY',
      message: 'LESS THAN 1 YEAR SELF-EMPLOYED: Does NOT qualify for conventional financing.',
      recommendation: 'Consider bank statement loan, asset depletion, or waiting for 2-year history.',
    });
  } else if (yearsInBusiness === '1-2') {
    warnings.push({
      type: 'warning',
      code: 'LIMITED_HISTORY',
      message: 'LESS THAN 2 YEARS SELF-EMPLOYED: May not qualify for conventional.',
      recommendation: 'Need CPA letter or documentation showing prior experience in same field.',
    });
  }

  // Short-term debt on books
  if (shortTermDebt || notesPayableLessThanYear > 0) {
    warnings.push({
      type: 'error',
      code: 'SHORT_TERM_DEBT',
      message: `SHORT-TERM DEBT: Business has ${formatCurrency(notesPayableLessThanYear)} in notes payable <1 year.`,
      recommendation: 'This amount is DEDUCTED from qualifying income. Verify Schedule L, Line 17d.',
    });
  }

  // Business not operating
  if (!businessOperating) {
    warnings.push({
      type: 'error',
      code: 'BUSINESS_CLOSED',
      message: 'BUSINESS NO LONGER OPERATING: Income CANNOT be used.',
      recommendation: 'Self-employment income requires ongoing business. Find alternative income sources.',
    });
  }

  // 25% ownership rule
  if (ownershipPercent >= 25 && ownershipPercent < 100) {
    warnings.push({
      type: 'info',
      code: 'OWNERSHIP_25_PLUS',
      message: `${ownershipPercent}% OWNERSHIP: Borrower is considered self-employed per Fannie Mae.`,
      recommendation: 'Full business tax returns required. Income calculated based on ownership share.',
    });
  }

  // K-1 distribution history (for S-Corp/Partnership)
  if ((entityType === 's-corp' || entityType === 'partnership') && !hasDistributionHistory) {
    warnings.push({
      type: 'warning',
      code: 'NO_DISTRIBUTION_HISTORY',
      message: 'K-1 LACKS DISTRIBUTION HISTORY: Must verify business liquidity.',
      recommendation: 'Obtain business bank statements or CPA letter confirming ability to distribute income.',
    });
  }

  // Meals add-back reminder
  if (mealsAddBack > 0) {
    warnings.push({
      type: 'info',
      code: 'MEALS_ADDBACK',
      message: 'MEALS ADD-BACK: Only 50% of meals expense can be added back.',
      recommendation: 'Verify you entered 50% of total meals expense, not 100%.',
    });
  }

  // Amended returns
  if (amendedReturns) {
    warnings.push({
      type: 'warning',
      code: 'AMENDED_RETURNS',
      message: 'AMENDED TAX RETURNS: Subject to additional scrutiny.',
      recommendation: 'UW will question timing. If amended near application, may delay or require explanation.',
    });
  }

  // PPP/EIDL income
  if (pppEidlIncome > 0) {
    warnings.push({
      type: 'warning',
      code: 'PPP_EIDL_INCOME',
      message: `PPP/EIDL INCOME DETECTED: ${formatCurrency(pppEidlIncome)} may need to be excluded.`,
      recommendation: 'PPP forgiveness and EIDL grants are one-time income. Exclude from qualifying calculations.',
    });
  }

  // Capital gains reminder for Schedule D
  if (data.capitalGains > 0) {
    warnings.push({
      type: 'info',
      code: 'CAPITAL_GAINS',
      message: 'CAPITAL GAINS: Only RECURRING capital gains can be used.',
      recommendation: 'One-time asset sales cannot be included. Verify 2-year history of similar gains.',
    });
  }

  return warnings;
}

// ============================================
// DOCUMENTS CHECKLIST
// ============================================

/**
 * Generate required documents checklist based on entity type and situation
 */
export function generateDocumentsChecklist(data) {
  const documents = [];
  const entityType = data.entityType || 'schedule-c';
  const yearsInBusiness = data.yearsInBusiness || '5+';
  const hasRentalIncome = data.hasRentalIncome || false;
  const has1099Income = data.has1099Income || false;
  const isBankStatementLoan = data.isBankStatementLoan || false;

  // Standard documents for all
  documents.push({
    id: 'personal-returns',
    label: '2 years complete personal tax returns (1040 with ALL schedules)',
    required: true,
    category: 'Tax Returns',
  });

  // Entity-specific documents
  if (entityType === 'schedule-c') {
    documents.push({
      id: 'schedule-c',
      label: 'Schedule C - Profit or Loss from Business (both years)',
      required: true,
      category: 'Tax Returns',
    });
  }

  if (entityType === 's-corp') {
    documents.push({
      id: 'form-1120s',
      label: '2 years complete Form 1120S (S-Corporation return)',
      required: true,
      category: 'Business Returns',
    });
    documents.push({
      id: 'k1-1120s',
      label: '2 years Schedule K-1 (Form 1120S)',
      required: true,
      category: 'Business Returns',
    });
    documents.push({
      id: 'w2-scorp',
      label: '2 years W-2s from S-Corporation',
      required: true,
      category: 'Income Verification',
    });
    documents.push({
      id: 'schedule-l',
      label: 'Schedule L (Balance Sheet) - verify Notes Payable Line 17d',
      required: true,
      category: 'Business Returns',
    });
  }

  if (entityType === 'partnership') {
    documents.push({
      id: 'form-1065',
      label: '2 years complete Form 1065 (Partnership return)',
      required: true,
      category: 'Business Returns',
    });
    documents.push({
      id: 'k1-1065',
      label: '2 years Schedule K-1 (Form 1065)',
      required: true,
      category: 'Business Returns',
    });
    documents.push({
      id: 'schedule-l-partnership',
      label: 'Schedule L (Balance Sheet) - verify Notes Payable Line 17d',
      required: true,
      category: 'Business Returns',
    });
  }

  if (entityType === 'c-corp') {
    documents.push({
      id: 'form-1120',
      label: '2 years complete Form 1120 (C-Corporation return)',
      required: true,
      category: 'Business Returns',
    });
    documents.push({
      id: 'w2-ccorp',
      label: '2 years W-2s from C-Corporation',
      required: true,
      category: 'Income Verification',
    });
    documents.push({
      id: '1099-div',
      label: '1099-DIV (if receiving dividends)',
      required: false,
      category: 'Income Verification',
    });
  }

  // YTD P&L if applicable
  const currentMonth = new Date().getMonth() + 1;
  if (currentMonth > 3) {
    documents.push({
      id: 'ytd-pl',
      label: `Year-to-date P&L through ${new Date().toLocaleString('default', { month: 'long' })}`,
      required: true,
      category: 'Current Year',
    });
    documents.push({
      id: 'ytd-balance',
      label: 'Year-to-date Balance Sheet',
      required: false,
      category: 'Current Year',
    });
  }

  // Business verification
  documents.push({
    id: 'business-license',
    label: 'Business license or CPA letter confirming business is active',
    required: true,
    category: 'Business Verification',
  });

  // Less than 2 years
  if (yearsInBusiness === '<1' || yearsInBusiness === '1-2') {
    documents.push({
      id: 'cpa-letter',
      label: 'CPA letter confirming income stability and business viability',
      required: true,
      category: 'Business Verification',
    });
    documents.push({
      id: 'prior-experience',
      label: 'Documentation of prior experience in same line of work',
      required: true,
      category: 'Business Verification',
    });
  }

  // Rental income
  if (hasRentalIncome) {
    documents.push({
      id: 'schedule-e',
      label: 'Schedule E - Supplemental Income (Rental)',
      required: true,
      category: 'Rental Income',
    });
    documents.push({
      id: 'lease-agreements',
      label: 'Current lease agreements for all rental properties',
      required: true,
      category: 'Rental Income',
    });
  }

  // 1099 income
  if (has1099Income) {
    documents.push({
      id: '1099-nec',
      label: '2 years 1099-NEC/1099-MISC forms',
      required: true,
      category: '1099 Income',
    });
  }

  // Bank statement loan
  if (isBankStatementLoan) {
    documents.push({
      id: 'bank-statements-12',
      label: '12 months consecutive business bank statements',
      required: true,
      category: 'Bank Statement Loan',
    });
    documents.push({
      id: 'bank-statements-24',
      label: '24 months consecutive business bank statements (if available)',
      required: false,
      category: 'Bank Statement Loan',
    });
    documents.push({
      id: 'cpa-letter-expense',
      label: 'CPA letter confirming expense ratio (if using <50%)',
      required: false,
      category: 'Bank Statement Loan',
    });
  }

  return documents;
}

// ============================================
// FORMATTING UTILITIES
// ============================================

/**
 * Format currency
 */
export function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  const formatted = Math.abs(num).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return num < 0 ? `(${formatted})` : formatted;
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 1) {
  const num = parseFloat(value) || 0;
  return `${num.toFixed(decimals)}%`;
}

/**
 * Parse currency input
 */
export function parseCurrency(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = value.toString().replace(/[$,]/g, '');
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    return -parseFloat(cleaned.slice(1, -1)) || 0;
  }
  return parseFloat(cleaned) || 0;
}

// ============================================
// REPORT GENERATION
// ============================================

/**
 * Generate comprehensive text summary for copying
 */
export function generateTextSummary(data) {
  const {
    entityType,
    businessName,
    borrowerName,
    loanNumber,
    year1Data,
    year2Data,
    year1Total,
    year2Total,
    monthlyIncome,
    conservativeMonthly,
    warnings,
    dtiData,
    rentalIncome,
  } = data;

  const entityNames = {
    'schedule-c': 'Sole Proprietor (Schedule C)',
    's-corp': 'S-Corporation (Form 1120S)',
    'partnership': 'Partnership (Form 1065)',
    'c-corp': 'C-Corporation (Form 1120)',
  };

  let summary = `╔════════════════════════════════════════════════════════════╗\n`;
  summary += `║     SELF-EMPLOYED INCOME ANALYSIS - FORM 1084 STYLE       ║\n`;
  summary += `╚════════════════════════════════════════════════════════════╝\n\n`;

  if (borrowerName) summary += `Borrower: ${borrowerName}\n`;
  if (loanNumber) summary += `Loan #: ${loanNumber}\n`;
  summary += `Business: ${businessName || 'Not specified'}\n`;
  summary += `Entity Type: ${entityNames[entityType] || entityType}\n`;
  summary += `Analysis Date: ${new Date().toLocaleDateString()}\n`;
  summary += `\n${'─'.repeat(60)}\n`;

  summary += `\n▶ QUALIFYING INCOME\n`;
  summary += `${'─'.repeat(60)}\n`;
  summary += `  Monthly Qualifying Income:     ${formatCurrency(monthlyIncome).padStart(15)}\n`;
  summary += `  Annual Qualifying Income:      ${formatCurrency(monthlyIncome * 12).padStart(15)}\n`;
  summary += `  Calculation Method:            ${'2-Year Average'.padStart(15)}\n`;

  if (conservativeMonthly && Math.abs(conservativeMonthly - monthlyIncome) > 1) {
    summary += `\n  ⚠ Conservative Estimate:       ${formatCurrency(conservativeMonthly).padStart(15)}/month\n`;
    summary += `    (Using most recent year only - recommended if declining)\n`;
  }

  summary += `\n▶ INCOME BREAKDOWN BY YEAR\n`;
  summary += `${'─'.repeat(60)}\n`;
  summary += `                                    Year 1         Year 2\n`;
  summary += `  Adjusted Annual Income:    ${formatCurrency(year1Total).padStart(12)}   ${formatCurrency(year2Total).padStart(12)}\n`;
  summary += `  ${'─'.repeat(56)}\n`;
  summary += `  2-Year Total:              ${formatCurrency(year1Total + year2Total).padStart(12)}\n`;
  summary += `  2-Year Average:            ${formatCurrency((year1Total + year2Total) / 2).padStart(12)}\n`;
  summary += `  Monthly Average:           ${formatCurrency(monthlyIncome).padStart(12)}\n`;

  // DTI Section
  if (dtiData && dtiData.backEndDTI > 0) {
    summary += `\n▶ DEBT-TO-INCOME ANALYSIS\n`;
    summary += `${'─'.repeat(60)}\n`;
    summary += `  Front-End DTI (Housing):       ${formatPercent(dtiData.frontEndDTI).padStart(15)}\n`;
    summary += `  Back-End DTI (Total):          ${formatPercent(dtiData.backEndDTI).padStart(15)}\n`;
    summary += `  Status:                        ${dtiData.status.toUpperCase().padStart(15)}\n`;
  }

  // Rental Income
  if (rentalIncome && rentalIncome.monthlyIncome !== 0) {
    summary += `\n▶ RENTAL INCOME (Schedule E)\n`;
    summary += `${'─'.repeat(60)}\n`;
    summary += `  Monthly Net Rental Income:     ${formatCurrency(rentalIncome.monthlyIncome).padStart(15)}\n`;
    summary += `  Monthly PITIA Offset:          ${formatCurrency(rentalIncome.monthlyPITIA).padStart(15)}\n`;
    summary += `  Net Cash Flow:                 ${formatCurrency(rentalIncome.netCashFlow).padStart(15)}\n`;
  }

  // Warnings
  if (warnings && warnings.length > 0) {
    summary += `\n▶ WARNINGS & ALERTS\n`;
    summary += `${'─'.repeat(60)}\n`;
    warnings.forEach(w => {
      const icon = w.type === 'error' ? '🔴' : w.type === 'warning' ? '🟡' : 'ℹ️';
      summary += `  ${icon} ${w.message}\n`;
      if (w.recommendation) {
        summary += `     → ${w.recommendation}\n`;
      }
    });
  }

  summary += `\n${'─'.repeat(60)}\n`;
  summary += `Generated by Self-Employed Income Calculator\n`;
  summary += `This analysis follows Fannie Mae Form 1084 guidelines.\n`;
  summary += `Always verify calculations with your underwriting team.\n`;

  return summary;
}

/**
 * Generate Form 1084-style PDF data structure
 */
export function generateForm1084Data(data) {
  const {
    entityType,
    businessName,
    borrowerName,
    year1Data,
    year2Data,
    year1Total,
    year2Total,
  } = data;

  return {
    header: {
      borrowerName: borrowerName || '',
      businessName: businessName || '',
      entityType,
      preparedDate: new Date().toISOString(),
    },
    scheduleC: entityType === 'schedule-c' ? {
      year1: {
        netProfit: year1Data.netIncome || 0,
        depreciation: year1Data.depreciation || 0,
        depletion: year1Data.depletion || 0,
        amortization: year1Data.amortization || 0,
        businessUseOfHome: year1Data.homeOfficeAddBack || 0,
        mealsEntertainment: year1Data.mealsAddBack || 0,
        nonRecurring: year1Data.nonRecurring || 0,
        total: year1Total,
      },
      year2: {
        netProfit: year2Data.netIncome || 0,
        depreciation: year2Data.depreciation || 0,
        depletion: year2Data.depletion || 0,
        amortization: year2Data.amortization || 0,
        businessUseOfHome: year2Data.homeOfficeAddBack || 0,
        mealsEntertainment: year2Data.mealsAddBack || 0,
        nonRecurring: year2Data.nonRecurring || 0,
        total: year2Total,
      },
    } : null,
    partnership: entityType === 'partnership' ? {
      year1: {
        ordinaryIncome: year1Data.ordinaryIncome || 0,
        guaranteedPayments: year1Data.guaranteedPayments || 0,
        depreciation: year1Data.depreciation || 0,
        depletion: year1Data.depletion || 0,
        amortization: year1Data.amortization || 0,
        notesPayable: year1Data.notesPayableLessThanYear || 0,
        ownershipPercent: year1Data.ownershipPercent || 100,
        total: year1Total,
      },
      year2: {
        ordinaryIncome: year2Data.ordinaryIncome || 0,
        guaranteedPayments: year2Data.guaranteedPayments || 0,
        depreciation: year2Data.depreciation || 0,
        depletion: year2Data.depletion || 0,
        amortization: year2Data.amortization || 0,
        notesPayable: year2Data.notesPayableLessThanYear || 0,
        ownershipPercent: year2Data.ownershipPercent || 100,
        total: year2Total,
      },
    } : null,
    sCorp: entityType === 's-corp' ? {
      year1: {
        w2Income: year1Data.w2Income || 0,
        k1Income: year1Data.k1Income || 0,
        depreciation: year1Data.depreciation || 0,
        depletion: year1Data.depletion || 0,
        amortization: year1Data.amortization || 0,
        notesPayable: year1Data.notesPayableLessThanYear || 0,
        ownershipPercent: year1Data.ownershipPercent || 100,
        total: year1Total,
      },
      year2: {
        w2Income: year2Data.w2Income || 0,
        k1Income: year2Data.k1Income || 0,
        depreciation: year2Data.depreciation || 0,
        depletion: year2Data.depletion || 0,
        amortization: year2Data.amortization || 0,
        notesPayable: year2Data.notesPayableLessThanYear || 0,
        ownershipPercent: year2Data.ownershipPercent || 100,
        total: year2Total,
      },
    } : null,
    summary: {
      year1Total,
      year2Total,
      twoYearTotal: year1Total + year2Total,
      average: (year1Total + year2Total) / 2,
      monthlyIncome: (year1Total + year2Total) / 2 / 12,
    },
  };
}
