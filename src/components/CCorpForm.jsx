import CurrencyInput from './CurrencyInput';

export default function CCorpForm({ yearData, onChange, yearLabel }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...yearData, [field]: value });
  };

  return (
    <div className="year-column">
      <h3 className="year-header">{yearLabel}</h3>

      <div className="form-section">
        <h4>W-2 Income from Business</h4>
        <CurrencyInput
          id={`w2-income-${yearLabel}`}
          label="W-2 Wages from C-Corp"
          value={yearData.w2Income}
          onChange={(val) => handleFieldChange('w2Income', val)}
          helpText="Box 1 of W-2 from the corporation"
        />
      </div>

      <div className="form-section">
        <h4>Dividends & Corporate Income</h4>
        <CurrencyInput
          id={`dividends-${yearLabel}`}
          label="Dividends Received"
          value={yearData.dividends}
          onChange={(val) => handleFieldChange('dividends', val)}
          helpText="Form 1099-DIV from corporation"
        />
        <CurrencyInput
          id={`corporate-income-${yearLabel}`}
          label="Corporate Taxable Income"
          value={yearData.corporateIncome}
          onChange={(val) => handleFieldChange('corporateIncome', val)}
          helpText="Form 1120, Line 30 (if applicable)"
        />
        <div className="input-group">
          <label htmlFor={`ownership-${yearLabel}`}>Ownership Percentage</label>
          <div className="percent-input-wrapper">
            <input
              type="number"
              id={`ownership-${yearLabel}`}
              value={yearData.ownershipPercent || 100}
              onChange={(e) => handleFieldChange('ownershipPercent', e.target.value)}
              min="0"
              max="100"
              className="percent-input"
            />
            <span className="percent-symbol">%</span>
          </div>
          <span className="help-text">Your share of corporation ownership</span>
        </div>
      </div>

      <div className="form-section">
        <h4>Add-Backs (Corporate Level)</h4>
        <CurrencyInput
          id={`depreciation-${yearLabel}`}
          label="Depreciation"
          value={yearData.depreciation}
          onChange={(val) => handleFieldChange('depreciation', val)}
          helpText="Form 1120, Line 20"
          allowNegative={false}
        />
        <CurrencyInput
          id={`depletion-${yearLabel}`}
          label="Depletion"
          value={yearData.depletion}
          onChange={(val) => handleFieldChange('depletion', val)}
          helpText="Form 1120, Line 21"
          allowNegative={false}
        />
        <CurrencyInput
          id={`amortization-${yearLabel}`}
          label="Amortization"
          value={yearData.amortization}
          onChange={(val) => handleFieldChange('amortization', val)}
          helpText="Form 4562"
          allowNegative={false}
        />
      </div>

      <div className="form-section">
        <h4>Adjustments (Subtractions)</h4>
        <CurrencyInput
          id={`non-recurring-${yearLabel}`}
          label="Non-Recurring Income"
          value={yearData.nonRecurring}
          onChange={(val) => handleFieldChange('nonRecurring', val)}
          helpText="One-time income that won't continue"
          allowNegative={false}
        />
      </div>
    </div>
  );
}
