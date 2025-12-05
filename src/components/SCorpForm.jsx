import CurrencyInput from './CurrencyInput';

export default function SCorpForm({ yearData, onChange, yearLabel }) {
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
          label="W-2 Wages from S-Corp"
          value={yearData.w2Income}
          onChange={(val) => handleFieldChange('w2Income', val)}
          helpText="Box 1 of W-2 from the business"
        />
      </div>

      <div className="form-section">
        <h4>K-1 Income (Form 1120S)</h4>
        <CurrencyInput
          id={`k1-income-${yearLabel}`}
          label="Ordinary Business Income"
          value={yearData.k1Income}
          onChange={(val) => handleFieldChange('k1Income', val)}
          helpText="Schedule K-1, Box 1"
        />
        <CurrencyInput
          id={`distributions-${yearLabel}`}
          label="Distributions Received"
          value={yearData.distributions}
          onChange={(val) => handleFieldChange('distributions', val)}
          helpText="For reference only - distributions are not income"
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
          <span className="help-text">Your share of business ownership</span>
        </div>
      </div>

      <div className="form-section">
        <h4>Add-Backs (Non-Cash Expenses)</h4>
        <CurrencyInput
          id={`depreciation-${yearLabel}`}
          label="Depreciation"
          value={yearData.depreciation}
          onChange={(val) => handleFieldChange('depreciation', val)}
          helpText="Form 1120S, Line 14 or K-1"
          allowNegative={false}
        />
        <CurrencyInput
          id={`depletion-${yearLabel}`}
          label="Depletion"
          value={yearData.depletion}
          onChange={(val) => handleFieldChange('depletion', val)}
          helpText="Form 1120S, Line 15"
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

      <details className="advanced-section">
        <summary>Advanced Add-Backs</summary>
        <div className="form-section">
          <CurrencyInput
            id={`mileage-${yearLabel}`}
            label="Mileage Deduction Add-Back"
            value={yearData.mileageAddBack}
            onChange={(val) => handleFieldChange('mileageAddBack', val)}
            allowNegative={false}
          />
          <CurrencyInput
            id={`meals-${yearLabel}`}
            label="Meals Deduction (50% Add-Back)"
            value={yearData.mealsAddBack}
            onChange={(val) => handleFieldChange('mealsAddBack', val)}
            allowNegative={false}
          />
        </div>
      </details>

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
