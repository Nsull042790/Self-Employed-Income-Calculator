import { useState } from 'react';
import { formatCurrency } from '../utils/calculations';

export default function CalculationBreakdown({
  entityType,
  year1Data,
  year2Data,
  year1Total,
  year2Total,
  monthlyIncome
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const twoYearAverage = (year1Total + year2Total) / 2;

  const getRowsForEntityType = () => {
    switch (entityType) {
      case 's-corp':
        return [
          { label: 'W-2 Income', field: 'w2Income', type: 'base' },
          { label: 'K-1 Ordinary Income', field: 'k1Income', type: 'base' },
          { label: '+ Depreciation', field: 'depreciation', type: 'add' },
          { label: '+ Depletion', field: 'depletion', type: 'add' },
          { label: '+ Amortization', field: 'amortization', type: 'add' },
          { label: '+ Mileage Add-back', field: 'mileageAddBack', type: 'add' },
          { label: '+ Meals Add-back', field: 'mealsAddBack', type: 'add' },
          { label: '- Non-recurring', field: 'nonRecurring', type: 'subtract' },
        ];
      case 'partnership':
        return [
          { label: 'Ordinary Income', field: 'ordinaryIncome', type: 'base' },
          { label: 'Guaranteed Payments', field: 'guaranteedPayments', type: 'base' },
          { label: '+ Depreciation', field: 'depreciation', type: 'add' },
          { label: '+ Depletion', field: 'depletion', type: 'add' },
          { label: '+ Amortization', field: 'amortization', type: 'add' },
          { label: '+ Mileage Add-back', field: 'mileageAddBack', type: 'add' },
          { label: '+ Meals Add-back', field: 'mealsAddBack', type: 'add' },
          { label: '- Non-recurring', field: 'nonRecurring', type: 'subtract' },
        ];
      case 'c-corp':
        return [
          { label: 'W-2 Income', field: 'w2Income', type: 'base' },
          { label: 'Dividends', field: 'dividends', type: 'base' },
          { label: 'Corporate Income', field: 'corporateIncome', type: 'base' },
          { label: '+ Depreciation', field: 'depreciation', type: 'add' },
          { label: '+ Depletion', field: 'depletion', type: 'add' },
          { label: '+ Amortization', field: 'amortization', type: 'add' },
          { label: '- Non-recurring', field: 'nonRecurring', type: 'subtract' },
        ];
      default: // schedule-c
        return [
          { label: 'Net Income', field: 'netIncome', type: 'base' },
          { label: '+ Depreciation', field: 'depreciation', type: 'add' },
          { label: '+ Depletion', field: 'depletion', type: 'add' },
          { label: '+ Amortization', field: 'amortization', type: 'add' },
          { label: '+ Mileage Add-back', field: 'mileageAddBack', type: 'add' },
          { label: '+ Meals Add-back', field: 'mealsAddBack', type: 'add' },
          { label: '+ Home Office', field: 'homeOfficeAddBack', type: 'add' },
          { label: '- Non-recurring', field: 'nonRecurring', type: 'subtract' },
        ];
    }
  };

  const rows = getRowsForEntityType();

  const getValue = (data, field) => {
    return parseFloat(data[field]) || 0;
  };

  const formatValue = (value, type) => {
    if (value === 0) return '-';
    if (type === 'subtract' && value > 0) {
      return `(${formatCurrency(value)})`;
    }
    return formatCurrency(value);
  };

  return (
    <div className="calculation-breakdown">
      <button
        className="breakdown-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span>Calculation Breakdown</span>
        <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      {isExpanded && (
        <div className="breakdown-content">
          <table className="breakdown-table">
            <thead>
              <tr>
                <th></th>
                <th>Year 1</th>
                <th>Year 2</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const val1 = getValue(year1Data, row.field);
                const val2 = getValue(year2Data, row.field);
                // Skip rows where both years are 0
                if (val1 === 0 && val2 === 0 && row.type !== 'base') return null;
                return (
                  <tr key={row.field} className={row.type}>
                    <td className="row-label">{row.label}</td>
                    <td className={val1 < 0 ? 'negative' : ''}>
                      {formatValue(val1, row.type)}
                    </td>
                    <td className={val2 < 0 ? 'negative' : ''}>
                      {formatValue(val2, row.type)}
                    </td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td className="row-label"><strong>Adjusted Total</strong></td>
                <td className={year1Total < 0 ? 'negative' : ''}>
                  <strong>{formatCurrency(year1Total)}</strong>
                </td>
                <td className={year2Total < 0 ? 'negative' : ''}>
                  <strong>{formatCurrency(year2Total)}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="summary-table">
            <tbody>
              <tr>
                <td>2-Year Average</td>
                <td className={twoYearAverage < 0 ? 'negative' : ''}>
                  {formatCurrency(twoYearAverage)}
                </td>
              </tr>
              <tr className="highlight">
                <td><strong>Monthly Income</strong></td>
                <td className={monthlyIncome < 0 ? 'negative' : ''}>
                  <strong>{formatCurrency(monthlyIncome)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
