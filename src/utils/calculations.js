// Self-Employed Income Calculation Utilities

/**
 * Calculate adjusted income for a single year
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

  return (
    netIncome +
    depreciation +
    depletion +
    amortization +
    mileageAddBack +
    mealsAddBack +
    homeOfficeAddBack -
    nonRecurring
  );
}

/**
 * Calculate S-Corp adjusted income (includes W-2, distributions, K-1)
 */
export function calculateSCorpIncome(yearData) {
  const w2Income = parseFloat(yearData.w2Income) || 0;
  const distributions = parseFloat(yearData.distributions) || 0;
  const k1Income = parseFloat(yearData.k1Income) || 0;
  const depreciation = parseFloat(yearData.depreciation) || 0;
  const depletion = parseFloat(yearData.depletion) || 0;
  const amortization = parseFloat(yearData.amortization) || 0;
  const mileageAddBack = parseFloat(yearData.mileageAddBack) || 0;
  const mealsAddBack = parseFloat(yearData.mealsAddBack) || 0;
  const nonRecurring = parseFloat(yearData.nonRecurring) || 0;
  const ownershipPercent = (parseFloat(yearData.ownershipPercent) || 100) / 100;

  // For S-Corps: W-2 + proportional share of K-1 income + add-backs
  const k1Adjusted =
    (k1Income + depreciation + depletion + amortization + mileageAddBack + mealsAddBack - nonRecurring) *
    ownershipPercent;

  return w2Income + k1Adjusted;
}

/**
 * Calculate Partnership adjusted income
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
  const ownershipPercent = (parseFloat(yearData.ownershipPercent) || 100) / 100;

  const adjustedIncome =
    (ordinaryIncome + depreciation + depletion + amortization + mileageAddBack + mealsAddBack - nonRecurring) *
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
  const ownershipPercent = (parseFloat(yearData.ownershipPercent) || 100) / 100;

  // C-Corps: W-2 income is primary, plus proportional corporate income (less common)
  const adjustedCorpIncome =
    (corporateIncome + depreciation + depletion + amortization - nonRecurring) * ownershipPercent;

  return w2Income + dividends + adjustedCorpIncome;
}

/**
 * Calculate 2-year average monthly income
 */
export function calculateMonthlyIncome(year1Total, year2Total) {
  const average = (year1Total + year2Total) / 2;
  return average / 12;
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
 * Generate warnings based on income data
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

  // Declining income warning
  if (year1Total < year2Total) {
    const declinePercent = Math.abs(((year2Total - year1Total) / year2Total) * 100);
    if (declinePercent > 20) {
      warnings.push({
        type: 'error',
        message: `DECLINING INCOME: Year 1 is ${declinePercent.toFixed(0)}% lower than Year 2. Underwriter may use Year 1 only.`,
      });
    } else if (declinePercent > 10) {
      warnings.push({
        type: 'warning',
        message: `Income declined ${declinePercent.toFixed(0)}% from Year 2 to Year 1. May require explanation letter.`,
      });
    }
  }

  // Business loss warning
  if (year1Total < 0 || year2Total < 0) {
    warnings.push({
      type: 'error',
      message: 'BUSINESS SHOWS LOSS: Negative income will reduce qualifying income from other sources.',
    });
  }

  // YTD trending down
  if (ytdMonths > 0 && ytdIncome > 0) {
    const ytdAnnualized = (ytdIncome / ytdMonths) * 12;
    if (ytdAnnualized < year1Total * 0.9) {
      warnings.push({
        type: 'warning',
        message: 'YTD TRENDING DOWN: Current year pace is below last year\'s income.',
      });
    }
  }

  // Less than 2 years warning
  if (yearsInBusiness === '<1' || yearsInBusiness === '1-2') {
    warnings.push({
      type: 'warning',
      message: 'LESS THAN 2 YEARS SELF-EMPLOYED: May not qualify for conventional. Consider bank statement loan.',
    });
  }

  // Short-term debt warning
  if (shortTermDebt) {
    warnings.push({
      type: 'error',
      message: 'SHORT-TERM DEBT ON BOOKS: Business has notes payable <1 year that may require cash flow analysis.',
    });
  }

  // Business not operating
  if (!businessOperating) {
    warnings.push({
      type: 'error',
      message: 'BUSINESS NO LONGER OPERATING: Income cannot be used if business is closed.',
    });
  }

  return warnings;
}

/**
 * Generate required documents checklist
 */
export function generateDocumentsChecklist(data) {
  const documents = [
    { id: 'personal-returns', label: '2 years complete personal tax returns (all schedules)', required: true },
  ];

  const entityType = data.entityType || 'schedule-c';

  if (entityType === 's-corp') {
    documents.push({
      id: 'business-returns',
      label: '2 years complete business tax returns (Form 1120S)',
      required: true,
    });
    documents.push({
      id: 'w2s',
      label: '2 years W-2s from the business',
      required: true,
    });
    documents.push({
      id: 'k1s',
      label: '2 years K-1s (Schedule K-1 Form 1120S)',
      required: true,
    });
  } else if (entityType === 'partnership') {
    documents.push({
      id: 'business-returns',
      label: '2 years complete business tax returns (Form 1065)',
      required: true,
    });
    documents.push({
      id: 'k1s',
      label: '2 years K-1s (Schedule K-1 Form 1065)',
      required: true,
    });
  } else if (entityType === 'c-corp') {
    documents.push({
      id: 'business-returns',
      label: '2 years complete business tax returns (Form 1120)',
      required: true,
    });
    documents.push({
      id: 'w2s',
      label: '2 years W-2s from the business',
      required: true,
    });
  }

  // YTD P&L if more than 3 months into current year
  const currentMonth = new Date().getMonth() + 1;
  if (currentMonth > 3) {
    documents.push({
      id: 'ytd-pl',
      label: 'Year-to-date P&L (required if >3 months into current year)',
      required: true,
    });
  }

  documents.push({
    id: 'business-license',
    label: 'Business license or CPA letter confirming business is active',
    required: true,
  });

  // Less than 2 years documentation
  if (data.yearsInBusiness === '<1' || data.yearsInBusiness === '1-2') {
    documents.push({
      id: 'business-plan',
      label: 'Business plan or CPA letter explaining income stability',
      required: false,
    });
  }

  return documents;
}

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
 * Parse currency input
 */
export function parseCurrency(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  // Remove currency symbols, commas, and handle parentheses for negatives
  const cleaned = value.toString().replace(/[$,]/g, '');
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    return -parseFloat(cleaned.slice(1, -1)) || 0;
  }
  return parseFloat(cleaned) || 0;
}

/**
 * Generate plain text summary for copying
 */
export function generateTextSummary(data) {
  const {
    entityType,
    businessName,
    year1Data,
    year2Data,
    year1Total,
    year2Total,
    monthlyIncome,
    conservativeMonthly,
    warnings
  } = data;

  const entityNames = {
    'schedule-c': 'Sole Proprietor (Schedule C)',
    's-corp': 'S-Corporation (Form 1120S)',
    'partnership': 'Partnership (Form 1065)',
    'c-corp': 'C-Corporation (Form 1120)',
  };

  let summary = `SELF-EMPLOYED INCOME ANALYSIS\n`;
  summary += `${'='.repeat(40)}\n\n`;
  summary += `Business: ${businessName || 'Not specified'}\n`;
  summary += `Entity Type: ${entityNames[entityType] || entityType}\n`;
  summary += `Date: ${new Date().toLocaleDateString()}\n\n`;

  summary += `MONTHLY QUALIFYING INCOME: ${formatCurrency(monthlyIncome)}\n`;
  summary += `(Based on 2-year average)\n\n`;

  if (conservativeMonthly && conservativeMonthly !== monthlyIncome) {
    summary += `CONSERVATIVE ESTIMATE: ${formatCurrency(conservativeMonthly)}/month\n`;
    summary += `(Using most recent year only)\n\n`;
  }

  summary += `CALCULATION BREAKDOWN\n`;
  summary += `${'-'.repeat(40)}\n`;
  summary += `Year 1 Adjusted Total: ${formatCurrency(year1Total)}\n`;
  summary += `Year 2 Adjusted Total: ${formatCurrency(year2Total)}\n`;
  summary += `2-Year Average: ${formatCurrency((year1Total + year2Total) / 2)}\n`;
  summary += `Monthly Income: ${formatCurrency(monthlyIncome)}\n\n`;

  if (warnings && warnings.length > 0) {
    summary += `WARNINGS\n`;
    summary += `${'-'.repeat(40)}\n`;
    warnings.forEach(w => {
      const icon = w.type === 'error' ? '[!]' : '[*]';
      summary += `${icon} ${w.message}\n`;
    });
  }

  return summary;
}
