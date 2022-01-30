import React, { useState } from 'react';

import './MainPanel.css';
import OverlapHelper from './OverlapHelper.jsx';
import SetOverview from './SetOverview.jsx';

export default function MainPanel() {
  
  const [ mode, setMode ] = useState('setOverview')

  switch(mode) {
    case 'setOverview':
      return <div className="main-panel-container">
        <div id="swap-modes" onClick={() => setMode('overlapHelper')}>OVERLAP HELPER</div>
        <SetOverview />
      </div>
    case 'overlapHelper':
      return <div className="main-panel-container">
        <div id="swap-modes" onClick={() => setMode('setOverview')}>SET OVERVIEW</div>
        <OverlapHelper />
      </div>
    default:
      return <div>Something went wrong! Please contact enragednuke#0001 on Discord or @PriestismJP on Twitter if you see this, along with what you did to see it</div>
  }
}
