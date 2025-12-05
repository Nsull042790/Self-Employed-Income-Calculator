import CurrencyInput from './CurrencyInput';

export default function ScheduleCForm({ yearData, onChange, yearLabel }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...yearData, [field]: value });
  };

  return (
    <div className="year-column">
      <h3 className="year-header">{yearLabel}</h3>

      <div className="form-section">
        <h4>Schedule C Income</h4>
        <CurrencyInput
          id={`net-income-${yearLabel}`}
          label="Net Profit/Loss (Line 31)"
          value={yearData.netIncome}
          onChange={(val) => handleFieldChange('netIncome', val)}
          helpText="From Schedule C, Line 31"
        />
      </div>

      <div className="form-section">
        <h4>Add-Backs (Non-Cash Expenses)</h4>
        <CurrencyInput
          id={`depreciation-${yearLabel}`}
          label="Depreciation"
          value={yearData.depreciation}
          onChange={(val) => handleFieldChange('depreciation', val)}
          helpText="Schedule C, Line 13"
          allowNegative={false}
        />
        <CurrencyInput
          id={`depletion-${yearLabel}`}
          label="Depletion"
          value={yearData.depletion}
          onChange={(val) => handleFieldChange('depletion', val)}
          helpText="Schedule C, Line 12"
          allowNegative={false}
        />
        <CurrencyInput
          id={`amortization-${yearLabel}`}
          label="Amortization/Casualty Loss"
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
            helpText="If claiming standard mileage rate"
            allowNegative={false}
          />
          <CurrencyInput
            id={`meals-${yearLabel}`}
            label="Meals Deduction (50% Add-Back)"
            value={yearData.mealsAddBack}
            onChange={(val) => handleFieldChange('mealsAddBack', val)}
            helpText="50% of business meals may be added back"
            allowNegative={false}
          />
          <CurrencyInput
            id={`home-office-${yearLabel}`}
            label="Home Office Deduction"
            value={yearData.homeOfficeAddBack}
            onChange={(val) => handleFieldChange('homeOfficeAddBack', val)}
            helpText="Form 8829, if also claiming on personal residence"
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
