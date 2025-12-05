export default function WarningsSection({ warnings }) {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div className="warnings-section">
      <h4>Warnings & Alerts</h4>
      <div className="warnings-list">
        {warnings.map((warning, index) => (
          <div
            key={index}
            className={`warning-item ${warning.type === 'error' ? 'error' : 'warning'}`}
          >
            <span className="warning-icon">
              {warning.type === 'error' ? '!' : '!'}
            </span>
            <span className="warning-message">{warning.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
