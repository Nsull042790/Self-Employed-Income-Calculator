import { useState } from 'react';

export default function DocumentsChecklist({ documents }) {
  const [checkedDocs, setCheckedDocs] = useState({});

  const toggleDocument = (docId) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  if (!documents || documents.length === 0) {
    return null;
  }

  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalRequired = documents.filter((d) => d.required).length;

  return (
    <div className="documents-checklist">
      <h4>
        Required Documents
        <span className="doc-count">
          {checkedCount} / {totalRequired} collected
        </span>
      </h4>
      <ul className="checklist">
        {documents.map((doc) => (
          <li key={doc.id} className={`checklist-item ${!doc.required ? 'optional' : ''}`}>
            <label>
              <input
                type="checkbox"
                checked={checkedDocs[doc.id] || false}
                onChange={() => toggleDocument(doc.id)}
              />
              <span className="checkbox-custom"></span>
              <span className="doc-label">
                {doc.label}
                {!doc.required && <span className="optional-badge">Optional</span>}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
