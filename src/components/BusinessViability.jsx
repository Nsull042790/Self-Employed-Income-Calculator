import CurrencyInput from './CurrencyInput';

export default function BusinessViability({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="business-viability">
      <h4>Business Viability</h4>

      <div className="viability-grid">
        <div className="input-group">
          <label htmlFor="years-in-business">Years in Business</label>
          <select
            id="years-in-business"
            value={data.yearsInBusiness || '5+'}
            onChange={(e) => handleChange('yearsInBusiness', e.target.value)}
          >
            <option value="<1">&lt; 1 year</option>
            <option value="1-2">1-2 years</option>
            <option value="2-5">2-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="business-operating">Business Still Operating?</label>
          <select
            id="business-operating"
            value={data.businessOperating ? 'yes' : 'no'}
            onChange={(e) => handleChange('businessOperating', e.target.value === 'yes')}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="short-term-debt">Short-Term Debt (&lt;1 year)?</label>
          <select
            id="short-term-debt"
            value={data.shortTermDebt ? 'yes' : 'no'}
            onChange={(e) => handleChange('shortTermDebt', e.target.value === 'yes')}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      <details className="ytd-section">
        <summary>Year-to-Date Income (Optional)</summary>
        <div className="ytd-inputs">
          <CurrencyInput
            id="ytd-income"
            label="YTD Net Income"
            value={data.ytdIncome || 0}
            onChange={(val) => handleChange('ytdIncome', val)}
            helpText="Current year income through today"
          />
          <div className="input-group">
            <label htmlFor="ytd-months">Months Covered</label>
            <input
              type="number"
              id="ytd-months"
              value={data.ytdMonths || ''}
              onChange={(e) => handleChange('ytdMonths', parseInt(e.target.value) || 0)}
              min="1"
              max="12"
              placeholder="e.g., 6"
            />
            <span className="help-text">Number of months in YTD period</span>
          </div>
        </div>
      </details>
    </div>
  );
}
