import { generateTextSummary, formatCurrency } from '../utils/calculations';

export default function ActionButtons({ businesses, getTotals }) {
  const { totalMonthlyIncome, businessTotals } = getTotals();

  const handleCopySummary = async () => {
    let fullSummary = '';

    if (businesses.length > 1) {
      fullSummary += `COMBINED SELF-EMPLOYMENT INCOME ANALYSIS\n`;
      fullSummary += `${'='.repeat(50)}\n\n`;
      fullSummary += `TOTAL MONTHLY QUALIFYING INCOME: ${formatCurrency(totalMonthlyIncome)}\n`;
      fullSummary += `\nBreakdown by Business:\n`;
      businessTotals.forEach((bt, i) => {
        fullSummary += `  ${i + 1}. ${bt.name || `Business ${i + 1}`}: ${formatCurrency(bt.monthly)}/month\n`;
      });
      fullSummary += `\n${'='.repeat(50)}\n\n`;
    }

    businesses.forEach((business, index) => {
      const bt = businessTotals[index];
      const summary = generateTextSummary({
        entityType: business.entityType,
        businessName: business.name,
        year1Data: business.year1Data,
        year2Data: business.year2Data,
        year1Total: bt.year1Total,
        year2Total: bt.year2Total,
        monthlyIncome: bt.monthly,
        conservativeMonthly: bt.year1Total / 12,
        warnings: bt.warnings,
      });
      fullSummary += summary + '\n\n';
    });

    try {
      await navigator.clipboard.writeText(fullSummary);
      alert('Summary copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullSummary;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Summary copied to clipboard!');
      } catch (e) {
        alert('Failed to copy. Please try again.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('selfEmployedCalcData');
      window.location.reload();
    }
  };

  return (
    <div className="action-buttons">
      <button className="btn btn-primary" onClick={handleCopySummary}>
        <span className="btn-icon">C</span>
        Copy Summary
      </button>
      <button className="btn btn-secondary" onClick={handlePrint}>
        <span className="btn-icon">P</span>
        Print
      </button>
      <button className="btn btn-danger" onClick={handleReset}>
        <span className="btn-icon">R</span>
        Reset All
      </button>
    </div>
  );
}
