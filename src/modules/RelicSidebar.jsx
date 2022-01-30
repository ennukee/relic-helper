
import { useContext } from 'react';
import { RelicDataContext } from '../App'
import { Relics } from '../data/relics.js'
import Relic from './Relic.jsx';

import './RelicSidebar.css';

function RelicSidebar() {
  const { state, dispatch } = useContext(RelicDataContext)

  return (
    <div className="sidebar-container">
      <div id="sidebar-title">RELIC FRAGMENTS</div>
      <div className="relics">
        {Relics.sort((a,b) => a.name > b.name).map(relic => (
          <span onClick={() => dispatch(relic.name)}>
            <Relic relicData={relic} activated={state[relic.name]} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default RelicSidebar;
