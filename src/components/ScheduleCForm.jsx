import CurrencyInput from './CurrencyInput';
import { TAX_LINE_REFERENCES } from '../utils/calculations';

const refs = TAX_LINE_REFERENCES['schedule-c'];

export default function ScheduleCForm({ yearData, onChange, yearLabel }) {
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
        <h4>Schedule C Income</h4>
        <CurrencyInput
          id={`net-income-${yearLabel}`}
          label={<>Net Profit or (Loss) <TaxRef field="netIncome" /></>}
          value={yearData.netIncome}
          onChange={(val) => handleFieldChange('netIncome', val)}
          helpText="Bottom line of Schedule C - can be positive or negative"
        />
      </div>

      <div className="form-section">
        <h4>Add-Backs (Non-Cash Expenses)</h4>
        <CurrencyInput
          id={`depreciation-${yearLabel}`}
          label={<>Depreciation <TaxRef field="depreciation" /></>}
          value={yearData.depreciation}
          onChange={(val) => handleFieldChange('depreciation', val)}
          helpText="Non-cash expense - added back to income"
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
          helpText="Intangible asset write-off"
          allowNegative={false}
        />
      </div>

      <details className="advanced-section">
        <summary>Additional Add-Backs (Form 1084)</summary>
        <div className="form-section">
          <CurrencyInput
            id={`home-office-${yearLabel}`}
            label={<>Business Use of Home <TaxRef field="homeOffice" /></>}
            value={yearData.homeOfficeAddBack}
            onChange={(val) => handleFieldChange('homeOfficeAddBack', val)}
            helpText="From Form 8829 - may be added back"
            allowNegative={false}
          />
          <CurrencyInput
            id={`mileage-${yearLabel}`}
            label={<>Car/Truck Expenses <TaxRef field="businessMiles" /></>}
            value={yearData.mileageAddBack}
            onChange={(val) => handleFieldChange('mileageAddBack', val)}
            helpText="Add back if using standard mileage rate"
            allowNegative={false}
          />
          <CurrencyInput
            id={`meals-${yearLabel}`}
            label={<>Meals (Enter 50% of total) <TaxRef field="mealsEntertainment" /></>}
            value={yearData.mealsAddBack}
            onChange={(val) => handleFieldChange('mealsAddBack', val)}
            helpText="Only 50% of meals expense can be added back"
            allowNegative={false}
          />
          <CurrencyInput
            id={`casualty-${yearLabel}`}
            label="Casualty Loss/One-Time Expense"
            value={yearData.casualtyLoss}
            onChange={(val) => handleFieldChange('casualtyLoss', val)}
            helpText="Non-recurring losses may be added back"
            allowNegative={false}
          />
        </div>
      </details>

      <div className="form-section deductions-section">
        <h4>Subtractions</h4>
        <CurrencyInput
          id={`non-recurring-${yearLabel}`}
          label="Non-Recurring Income"
          value={yearData.nonRecurring}
          onChange={(val) => handleFieldChange('nonRecurring', val)}
          helpText="PPP forgiveness, one-time sales, etc. - will be subtracted"
          allowNegative={false}
        />
      </div>
    </div>
  );
}
