import CurrencyInput from './CurrencyInput';
import { TAX_LINE_REFERENCES } from '../utils/calculations';

const refs = TAX_LINE_REFERENCES['partnership'];

export default function PartnershipForm({ yearData, onChange, yearLabel }) {
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
        <h4>K-1 Income (Form 1065)</h4>
        <CurrencyInput
          id={`ordinary-income-${yearLabel}`}
          label={<>Ordinary Business Income <TaxRef field="ordinaryIncome" /></>}
          value={yearData.ordinaryIncome}
          onChange={(val) => handleFieldChange('ordinaryIncome', val)}
          helpText="Your share of partnership ordinary income or loss"
        />
        <CurrencyInput
          id={`guaranteed-${yearLabel}`}
          label={<>Guaranteed Payments <TaxRef field="guaranteedPayments" /></>}
          value={yearData.guaranteedPayments}
          onChange={(val) => handleFieldChange('guaranteedPayments', val)}
          helpText="Payments to partner regardless of partnership income"
        />
        <div className="input-group">
          <label htmlFor={`ownership-${yearLabel}`}>
            Partnership Interest <TaxRef field="ownership" />
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
          <span className="help-text">Add-backs multiplied by this percentage</span>
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
          helpText="Partnership-level depreciation from Form 1065"
          allowNegative={false}
        />
        <CurrencyInput
          id={`depletion-${yearLabel}`}
          label={<>Depletion <TaxRef field="depletion" /></>}
          value={yearData.depletion}
          onChange={(val) => handleFieldChange('depletion', val)}
          helpText="For natural resource partnerships"
          allowNegative={false}
        />
        <CurrencyInput
          id={`amortization-${yearLabel}`}
          label={<>Amortization <TaxRef field="amortization" /></>}
          value={yearData.amortization}
          onChange={(val) => handleFieldChange('amortization', val)}
          helpText="From Form 4562"
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
          helpText="One-time income (PPP loans, asset sales, etc.)"
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
