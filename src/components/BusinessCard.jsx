import { useState, useMemo } from 'react';
import ScheduleCForm from './ScheduleCForm';
import SCorpForm from './SCorpForm';
import PartnershipForm from './PartnershipForm';
import CCorpForm from './CCorpForm';
import BusinessViability from './BusinessViability';
import OutputDisplay from './OutputDisplay';
import CalculationBreakdown from './CalculationBreakdown';
import WarningsSection from './WarningsSection';
import DocumentsChecklist from './DocumentsChecklist';
import {
  calculateAdjustedIncome,
  calculateSCorpIncome,
  calculatePartnershipIncome,
  calculateCCorpIncome,
  calculateMonthlyIncome,
  calculateDeclinePercent,
  isIncomeDeclining,
  generateWarnings,
  generateDocumentsChecklist,
} from '../utils/calculations';

const ENTITY_TYPES = {
  'schedule-c': { label: 'Sole Proprietor (Schedule C)', form: ScheduleCForm },
  's-corp': { label: 'S-Corporation (Form 1120S)', form: SCorpForm },
  'partnership': { label: 'Partnership (Form 1065)', form: PartnershipForm },
  'c-corp': { label: 'C-Corporation (Form 1120)', form: CCorpForm },
};

const createEmptyYearData = () => ({
  netIncome: 0,
  depreciation: 0,
  depletion: 0,
  amortization: 0,
  mileageAddBack: 0,
  mealsAddBack: 0,
  homeOfficeAddBack: 0,
  nonRecurring: 0,
  w2Income: 0,
  k1Income: 0,
  distributions: 0,
  ordinaryIncome: 0,
  guaranteedPayments: 0,
  corporateIncome: 0,
  dividends: 0,
  ownershipPercent: 100,
});

export default function BusinessCard({
  business,
  onUpdate,
  onRemove,
  canRemove,
  businessIndex
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    id,
    name,
    entityType,
    year1Data,
    year2Data,
    viabilityData,
  } = business;

  const FormComponent = ENTITY_TYPES[entityType]?.form || ScheduleCForm;

  // Calculate income based on entity type
  const calculateIncome = (yearData) => {
    switch (entityType) {
      case 's-corp':
        return calculateSCorpIncome(yearData);
      case 'partnership':
        return calculatePartnershipIncome(yearData);
      case 'c-corp':
        return calculateCCorpIncome(yearData);
      default:
        return calculateAdjustedIncome(yearData);
    }
  };

  const year1Total = useMemo(() => calculateIncome(year1Data), [year1Data, entityType]);
  const year2Total = useMemo(() => calculateIncome(year2Data), [year2Data, entityType]);
  const monthlyIncome = useMemo(() => calculateMonthlyIncome(year1Total, year2Total), [year1Total, year2Total]);
  const conservativeMonthly = useMemo(() => year1Total / 12, [year1Total]);
  const declinePercent = useMemo(() => calculateDeclinePercent(year1Total, year2Total), [year1Total, year2Total]);
  const isDeclined = useMemo(() => isIncomeDeclining(year1Total, year2Total), [year1Total, year2Total]);

  const warnings = useMemo(() => generateWarnings({
    year1Total,
    year2Total,
    yearsInBusiness: viabilityData.yearsInBusiness,
    ytdIncome: viabilityData.ytdIncome,
    ytdMonths: viabilityData.ytdMonths,
    shortTermDebt: viabilityData.shortTermDebt,
    businessOperating: viabilityData.businessOperating,
  }), [year1Total, year2Total, viabilityData]);

  const documents = useMemo(() => generateDocumentsChecklist({
    entityType,
    yearsInBusiness: viabilityData.yearsInBusiness,
  }), [entityType, viabilityData.yearsInBusiness]);

  const handleNameChange = (e) => {
    onUpdate({ ...business, name: e.target.value });
  };

  const handleEntityChange = (e) => {
    onUpdate({
      ...business,
      entityType: e.target.value,
      year1Data: createEmptyYearData(),
      year2Data: createEmptyYearData(),
    });
  };

  const handleYear1Change = (data) => {
    onUpdate({ ...business, year1Data: data });
  };

  const handleYear2Change = (data) => {
    onUpdate({ ...business, year2Data: data });
  };

  const handleViabilityChange = (data) => {
    onUpdate({ ...business, viabilityData: data });
  };

  return (
    <div className={`business-card ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="business-card-header">
        <div className="business-title-row">
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand business' : 'Collapse business'}
          >
            {isCollapsed ? '+' : '-'}
          </button>
          <div className="business-number">Business {businessIndex + 1}</div>
          <input
            type="text"
            className="business-name-input"
            value={name}
            onChange={handleNameChange}
            placeholder="Business Name"
          />
          {canRemove && (
            <button className="remove-btn" onClick={() => onRemove(id)}>
              Remove
            </button>
          )}
        </div>

        {!isCollapsed && (
          <div className="entity-selector">
            <label htmlFor={`entity-type-${id}`}>Entity Type:</label>
            <div className="entity-tabs">
              {Object.entries(ENTITY_TYPES).map(([key, { label }]) => (
                <button
                  key={key}
                  className={`entity-tab ${entityType === key ? 'active' : ''}`}
                  onClick={() => handleEntityChange({ target: { value: key } })}
                >
                  {label.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="business-card-body">
          <div className="sticky-output">
            <OutputDisplay
              monthlyIncome={monthlyIncome}
              conservativeMonthly={conservativeMonthly}
              year1Total={year1Total}
              year2Total={year2Total}
              isDeclined={isDeclined}
              declinePercent={declinePercent}
            />
          </div>

          <WarningsSection warnings={warnings} />

          <div className="years-container">
            <FormComponent
              yearData={year1Data}
              onChange={handleYear1Change}
              yearLabel="Year 1 (Most Recent)"
            />
            <FormComponent
              yearData={year2Data}
              onChange={handleYear2Change}
              yearLabel="Year 2 (Prior Year)"
            />
          </div>

          <CalculationBreakdown
            entityType={entityType}
            year1Data={year1Data}
            year2Data={year2Data}
            year1Total={year1Total}
            year2Total={year2Total}
            monthlyIncome={monthlyIncome}
          />

          <BusinessViability
            data={viabilityData}
            onChange={handleViabilityChange}
          />

          <DocumentsChecklist documents={documents} />
        </div>
      )}
    </div>
  );
}

export { createEmptyYearData };
