import CurrencyInput from './CurrencyInput';
import { TAX_LINE_REFERENCES } from '../utils/calculations';

const refs = TAX_LINE_REFERENCES['s-corp'];

export default function SCorpForm({ yearData, onChange, yearLabel }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...yearData, [field]: value });
  };

  const TaxRef = ({ field }) => {
    const ref = refs[field];
    if (!ref) return null;
    return (
      <span className="tax-ref">
        {ref.form}, {ref.line}
      </span>
    );
  };

  return (
    <div className="year-column">
      <h3 className="year-header">{yearLabel}</h3>

      <div className="form-section">
        <h4>W-2 Income from Business</h4>
        <CurrencyInput
          id={`w2-income-${yearLabel}`}
          label={<>W-2 Wages from S-Corp <TaxRef field="w2Income" /></>}
          value={yearData.w2Income}
          onChange={(val) => handleFieldChange('w2Income', val)}
          helpText="Wages paid to borrower as employee of the S-Corp"
        />
      </div>

      <div className="form-section">
        <h4>K-1 Income (Form 1120S)</h4>
        <CurrencyInput
          id={`k1-income-${yearLabel}`}
          label={<>Ordinary Business Income <TaxRef field="k1Income" /></>}
          value={yearData.k1Income}
          onChange={(val) => handleFieldChange('k1Income', val)}
          helpText="Can be positive (income) or negative (loss)"
        />
        <CurrencyInput
          id={`distributions-${yearLabel}`}
          label={<>Distributions Received <TaxRef field="distributions" /></>}
          value={yearData.distributions}
          onChange={(val) => handleFieldChange('distributions', val)}
          helpText="For reference only - distributions are NOT added to income"
        />
        <div className="input-group">
          <label htmlFor={`ownership-${yearLabel}`}>
            Ownership Percentage <TaxRef field="ownership" />
          </label>
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
          <span className="help-text">Add-backs are multiplied by this percentage</span>
        </div>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={yearData.hasDistributionHistory || false}
              onChange={(e) => handleFieldChange('hasDistributionHistory', e.target.checked)}
            />
            <span>K-1 shows consistent distribution history</span>
          </label>
          <span className="help-text">If unchecked, business liquidity verification may be required</span>
        </div>
      </div>

      <div className="form-section">
        <h4>Add-Backs (Non-Cash Expenses)</h4>
        <CurrencyInput
          id={`depreciation-${yearLabel}`}
          label={<>Depreciation <TaxRef field="depreciation" /></>}
          value={yearData.depreciation}
          onChange={(val) => handleFieldChange('depreciation', val)}
          helpText="Non-cash expense added back to income"
          allowNegative={false}
        />
        <CurrencyInput
          id={`depletion-${yearLabel}`}
          label={<>Depletion <TaxRef field="depletion" /></>}
          value={yearData.depletion}
          onChange={(val) => handleFieldChange('depletion', val)}
          helpText="For natural resource businesses"
          allowNegative={false}
        />
        <CurrencyInput
          id={`amortization-${yearLabel}`}
          label={<>Amortization <TaxRef field="amortization" /></>}
          value={yearData.amortization}
          onChange={(val) => handleFieldChange('amortization', val)}
          helpText="Intangible asset amortization"
          allowNegative={false}
        />
      </div>

      <div className="form-section deductions-section">
        <h4>Required Deductions</h4>
        <CurrencyInput
          id={`notes-payable-${yearLabel}`}
          label={<>Notes Payable Less Than 1 Year <TaxRef field="notesPayable" /></>}
          value={yearData.notesPayableLessThanYear}
          onChange={(val) => handleFieldChange('notesPayableLessThanYear', val)}
          helpText="CRITICAL: This amount is SUBTRACTED from qualifying income"
          allowNegative={false}
        />
        <CurrencyInput
          id={`non-recurring-${yearLabel}`}
          label="Non-Recurring Income"
          value={yearData.nonRecurring}
          onChange={(val) => handleFieldChange('nonRecurring', val)}
          helpText="One-time income that won't continue (PPP, asset sales, etc.)"
          allowNegative={false}
        />
      </div>

      <details className="advanced-section">
        <summary>Additional Add-Backs</summary>
        <div className="form-section">
          <CurrencyInput
            id={`mileage-${yearLabel}`}
            label="Mileage Deduction Add-Back"
            value={yearData.mileageAddBack}
            onChange={(val) => handleFieldChange('mileageAddBack', val)}
            helpText="If using standard mileage rate"
            allowNegative={false}
          />
          <CurrencyInput
            id={`meals-${yearLabel}`}
            label="Meals (Enter 50% of total)"
            value={yearData.mealsAddBack}
            onChange={(val) => handleFieldChange('mealsAddBack', val)}
            helpText="Only 50% of meals expense can be added back"
            allowNegative={false}
          />
        </div>
      </details>
    </div>
  );
}
