import { formatCurrency } from '../utils/calculations';

export default function OutputDisplay({
  monthlyIncome,
  conservativeMonthly,
  year1Total,
  year2Total,
  isDeclined,
  declinePercent
}) {
  const twoYearAverage = (year1Total + year2Total) / 2;
  const showConservative = isDeclined && Math.abs(declinePercent) > 20;

  return (
    <div className="output-display">
      <div className="primary-output">
        <div className="output-label">Monthly Qualifying Income</div>
        <div className={`output-amount ${monthlyIncome < 0 ? 'negative' : ''}`}>
          {formatCurrency(monthlyIncome)}
        </div>
        <div className="output-subtext">Based on 2-year average</div>
      </div>

      {showConservative && (
        <div className="secondary-output">
          <div className="output-label">Conservative Estimate</div>
          <div className="output-amount conservative">
            {formatCurrency(conservativeMonthly)}
            <span className="per-month">/month</span>
          </div>
          <div className="output-subtext warning-text">
            Using most recent year only (recommended if income declining &gt;20%)
          </div>
        </div>
      )}

      <div className="quick-summary">
        <div className="summary-row">
          <span>Year 1 Total:</span>
          <span className={year1Total < 0 ? 'negative' : ''}>
            {formatCurrency(year1Total)}
          </span>
        </div>
        <div className="summary-row">
          <span>Year 2 Total:</span>
          <span className={year2Total < 0 ? 'negative' : ''}>
            {formatCurrency(year2Total)}
          </span>
        </div>
        <div className="summary-row average">
          <span>2-Year Average:</span>
          <span className={twoYearAverage < 0 ? 'negative' : ''}>
            {formatCurrency(twoYearAverage)}
          </span>
        </div>
        {isDeclined && (
          <div className="decline-indicator">
            <span className={Math.abs(declinePercent) > 20 ? 'severe' : 'moderate'}>
              {declinePercent.toFixed(0)}% change from Year 2 to Year 1
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
