import React from 'react';

import './Relic.css';

export default function Relic({ relicData, activated }) {
  return <div className="relic-container">
    <div className={`checkbox ${activated ? 'activated' : ''}`} />
    <div className="relic-name">{relicData.name.toUpperCase()}</div>
  </div>;
}
