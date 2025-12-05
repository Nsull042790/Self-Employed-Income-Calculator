import CurrencyInput from './CurrencyInput';
import { TAX_LINE_REFERENCES } from '../utils/calculations';

const refs = TAX_LINE_REFERENCES['c-corp'];

export default function CCorpForm({ yearData, onChange, yearLabel }) {
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
        <h4>W-2 Income from Corporation</h4>
        <CurrencyInput
          id={`w2-income-${yearLabel}`}
          label={<>W-2 Wages from C-Corp <TaxRef field="w2Income" /></>}
          value={yearData.w2Income}
          onChange={(val) => handleFieldChange('w2Income', val)}
          helpText="Primary income source for C-Corp owners"
        />
      </div>

      <div className="form-section">
        <h4>Dividends & Corporate Income</h4>
        <CurrencyInput
          id={`dividends-${yearLabel}`}
          label={<>Dividends Received <TaxRef field="dividends" /></>}
          value={yearData.dividends}
          onChange={(val) => handleFieldChange('dividends', val)}
          helpText="Ordinary dividends from the corporation"
        />
        <CurrencyInput
          id={`corporate-income-${yearLabel}`}
          label="Corporate Taxable Income (if applicable)"
          value={yearData.corporateIncome}
          onChange={(val) => handleFieldChange('corporateIncome', val)}
          helpText="Form 1120, Line 30 - rarely used for qualifying"
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
          <span className="help-text">Corporate income multiplied by this percentage</span>
        </div>
      </div>

      <div className="form-section">
        <h4>Add-Backs (Corporate Level)</h4>
        <p className="section-note">Applied to corporate income only, multiplied by ownership %</p>
        <CurrencyInput
          id={`depreciation-${yearLabel}`}
          label={<>Depreciation <TaxRef field="depreciation" /></>}
          value={yearData.depreciation}
          onChange={(val) => handleFieldChange('depreciation', val)}
          helpText="Corporate depreciation expense"
          allowNegative={false}
        />
        <CurrencyInput
          id={`depletion-${yearLabel}`}
          label={<>Depletion <TaxRef field="depletion" /></>}
          value={yearData.depletion}
          onChange={(val) => handleFieldChange('depletion', val)}
          helpText="For natural resource corporations"
          allowNegative={false}
        />
        <CurrencyInput
          id={`amortization-${yearLabel}`}
          label="Amortization"
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
          helpText="SUBTRACTED from qualifying income"
          allowNegative={false}
        />
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
