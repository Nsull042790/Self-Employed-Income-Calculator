import { useState, useEffect } from 'react';
import { formatCurrency, parseCurrency } from '../utils/calculations';

export default function CurrencyInput({
  value,
  onChange,
  label,
  id,
  placeholder = '$0',
  allowNegative = true,
  helpText = null
}) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      const numValue = parseCurrency(value);
      setDisplayValue(numValue !== 0 ? formatCurrency(numValue) : '');
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    const numValue = parseCurrency(value);
    setDisplayValue(numValue !== 0 ? numValue.toString() : '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numValue = parseCurrency(displayValue);
    if (!allowNegative && numValue < 0) {
      onChange(Math.abs(numValue));
    } else {
      onChange(numValue);
    }
  };

  const handleChange = (e) => {
    let val = e.target.value;
    // Allow digits, negative sign, decimal point, and empty string
    if (val === '' || val === '-' || /^-?\d*\.?\d*$/.test(val)) {
      setDisplayValue(val);
    }
  };

  return (
    <div className="currency-input-group">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="currency-input"
        inputMode="decimal"
      />
      {helpText && <span className="help-text">{helpText}</span>}
    </div>
  );
}
