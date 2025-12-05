import { useState, useEffect, useMemo, useCallback } from 'react';
import BusinessCard, { createEmptyYearData } from './components/BusinessCard';
import ActionButtons from './components/ActionButtons';
import {
  calculateAdjustedIncome,
  calculateSCorpIncome,
  calculatePartnershipIncome,
  calculateCCorpIncome,
  calculateMonthlyIncome,
  generateWarnings,
  formatCurrency,
} from './utils/calculations';
import './App.css';

const STORAGE_KEY = 'selfEmployedCalcData';

const createEmptyBusiness = (id) => ({
  id,
  name: '',
  entityType: 'schedule-c',
  year1Data: createEmptyYearData(),
  year2Data: createEmptyYearData(),
  viabilityData: {
    yearsInBusiness: '5+',
    businessOperating: true,
    shortTermDebt: false,
    ytdIncome: 0,
    ytdMonths: 0,
  },
});

function App() {
  const [businesses, setBusinesses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
    return [createEmptyBusiness(Date.now())];
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(businesses));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }, [businesses]);

  const calculateBusinessIncome = useCallback((business) => {
    const { entityType, year1Data, year2Data, viabilityData } = business;

    let year1Total, year2Total;
    switch (entityType) {
      case 's-corp':
        year1Total = calculateSCorpIncome(year1Data);
        year2Total = calculateSCorpIncome(year2Data);
        break;
      case 'partnership':
        year1Total = calculatePartnershipIncome(year1Data);
        year2Total = calculatePartnershipIncome(year2Data);
        break;
      case 'c-corp':
        year1Total = calculateCCorpIncome(year1Data);
        year2Total = calculateCCorpIncome(year2Data);
        break;
      default:
        year1Total = calculateAdjustedIncome(year1Data);
        year2Total = calculateAdjustedIncome(year2Data);
    }

    const monthly = calculateMonthlyIncome(year1Total, year2Total);
    const warnings = generateWarnings({
      year1Total,
      year2Total,
      ...viabilityData,
    });

    return { year1Total, year2Total, monthly, warnings, name: business.name };
  }, []);

  const getTotals = useCallback(() => {
    const businessTotals = businesses.map(calculateBusinessIncome);
    const totalMonthlyIncome = businessTotals.reduce((sum, bt) => sum + bt.monthly, 0);
    return { totalMonthlyIncome, businessTotals };
  }, [businesses, calculateBusinessIncome]);

  const { totalMonthlyIncome, businessTotals } = useMemo(() => getTotals(), [getTotals]);

  const handleUpdateBusiness = (updatedBusiness) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === updatedBusiness.id ? updatedBusiness : b))
    );
  };

  const handleRemoveBusiness = (id) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddBusiness = () => {
    setBusinesses((prev) => [...prev, createEmptyBusiness(Date.now())]);
  };

  const hasMultipleBusinesses = businesses.length > 1;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Self-Employed Income Calculator</h1>
          <p className="subtitle">Calculate qualifying income for mortgage underwriting</p>
        </div>
      </header>

      <main className="app-main">
        {hasMultipleBusinesses && (
          <div className="total-income-banner">
            <div className="total-income-label">Combined Monthly Qualifying Income</div>
            <div className={`total-income-amount ${totalMonthlyIncome < 0 ? 'negative' : ''}`}>
              {formatCurrency(totalMonthlyIncome)}
            </div>
            <div className="business-breakdown">
              {businessTotals.map((bt, i) => (
                <div key={businesses[i].id} className="breakdown-item">
                  <span className="breakdown-name">
                    {bt.name || `Business ${i + 1}`}:
                  </span>
                  <span className={`breakdown-amount ${bt.monthly < 0 ? 'negative' : ''}`}>
                    {formatCurrency(bt.monthly)}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="businesses-container">
          {businesses.map((business, index) => (
            <BusinessCard
              key={business.id}
              business={business}
              businessIndex={index}
              onUpdate={handleUpdateBusiness}
              onRemove={handleRemoveBusiness}
              canRemove={businesses.length > 1}
            />
          ))}
        </div>

        <div className="add-business-section">
          <button className="btn btn-add-business" onClick={handleAddBusiness}>
            + Add Another Business
          </button>
        </div>

        <ActionButtons businesses={businesses} getTotals={getTotals} />
      </main>

      <footer className="app-footer">
        <p>
          This calculator provides estimates based on standard Fannie Mae guidelines.
          Always verify calculations with your underwriting team. Results may vary
          based on specific loan programs and investor overlays.
        </p>
      </footer>
    </div>
  );
}

export default App;
