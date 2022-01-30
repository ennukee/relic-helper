import React, { useContext } from 'react';
import { RelicDataContext } from '../App.js';
import { Sets } from '../data/sets.js'

import './SetOverview.css';

export default function SetOverview() {
  const { state } = useContext(RelicDataContext)

  return <div className="set-overview-container">
    <div id="set-overview-title">
      SET EFFECTS
    </div>
    <div id="sets">
      {Sets.map(set => {
        const fragsActivated = set.fragments.reduce((acc, cur) => state[cur] ? acc + 1 : acc, 0)
        {/* console.log(fragsActivated, set.name) */}
        return (
          <div className="set-container">
            <div className="left-panel">
              <div className="set-name">{set.name}</div>
              <div className="set-activator-thresholds">
                {set.activationThresholds.map(threshold => (
                  <div className={`set-threshold ${fragsActivated >= threshold ? 'active' : ''}`}>{threshold}</div>
                ))}
              </div>
            </div>
            <div className="set-activators-container">
              {set.fragments.map(frag => (
                <div className={`set-activator ${state[frag] ? 'active' : ''}`}>{frag}</div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  </div>;
}
