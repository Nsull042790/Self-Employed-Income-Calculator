export default function WarningsSection({ warnings }) {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  const getWarningClass = (type) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'warning';
    }
  };

  const getWarningIcon = (type) => {
    switch (type) {
      case 'error': return '!';
      case 'warning': return '!';
      case 'info': return 'i';
      default: return '!';
    }
  };

  return (
    <div className="warnings-section">
      <h4>Warnings & Alerts</h4>
      <div className="warnings-list">
        {warnings.map((warning, index) => (
          <div
            key={index}
            className={`warning-item ${getWarningClass(warning.type)}`}
          >
            <span className="warning-icon">
              {getWarningIcon(warning.type)}
            </span>
            <div className="warning-content">
              <span className="warning-message">{warning.message}</span>
              {warning.recommendation && (
                <span className="warning-recommendation">{warning.recommendation}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
