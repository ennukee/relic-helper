import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { RelicDataContext } from '../App.js';
import { Sets } from '../data/sets.js'

import './OverlapHelper.css';

const relicPrefReducer = (state, relicName) => ({
  ...state,
  [relicName]: ((state[relicName] || 0) + 1) % 3,
})


const setReducer = (state, setName) => ({
  ...state,
  [setName]: !state[setName]
})

const thresholdReducer = (state, action) => ({
  ...state,
  [action.setName]: action.setThreshold,
})

const choose = (arr, k, prefix = []) => {
    if (k === 0) return [prefix];
    return arr.flatMap((v, i) =>
        choose(arr.slice(i+1), k-1, [...prefix, v])
    );
}

const generateCombos = (arrs, prefix = []) => {
  if (arrs.length === 0) return [prefix]
  return arrs[0].flatMap((v) => generateCombos(arrs.slice(1), [...prefix, v]))
}

const getComboCount = (comboData) => comboData.reduce((total, cur) => total + cur.length, 0)

export default function OverlapHelper() {
  const { state } = useContext(RelicDataContext)
  const [activeSets, toggleSet] = useReducer(setReducer, {})
  const [relicPrefs, cycleRelicPref] = useReducer(relicPrefReducer, {})
  const [thresholdSelections, setThreshold] = useReducer(thresholdReducer, {
    'Absolute Unit': 2,
    'The Alchemist': 3,
    'Chain Magic': 2,
    'The Craftsman': 3,
    'Double Tap': 2,
    "Drakan's Touch": 2,
    'Endless Knowledge': 3,
    'Fast Metabolism': 3,
    'Greedy Gatherer': 3,
    "Knife's Edge": 2,
    'Last Recall': 4,
    'Personal Banker': 2,
    'Trailblazer': 3,
    'Twin Strikes': 2,
    'Unchained Talent': 3,
  })
  const [calcHash, setCalcHash] = useState(0)
  // const [comboData, setComboData] = useState([])
  const [overlapData, setOverlapData] = useState([])
  const prevCalcHash = useRef({ calcHash })

  useEffect(() => {
    if (prevCalcHash.current.calcHash === calcHash) {
      return
    }
    prevCalcHash.current = { calcHash }

    const comboData = []
    const activeSetNames = Object.entries(activeSets).filter(entry => entry[1]).map(entry => entry[0])
    if (activeSetNames.length < 6) {
      activeSetNames.forEach(set => {
        const thresholdSelected = thresholdSelections[set]
        const activeSetData = Sets.find(dset => dset.name === set)
        const fragments = (activeSetData?.fragments || []).filter(relic => state[relic] && relicPrefs[relic] !== 2)
        const nChooseKFrags = choose(fragments, thresholdSelected)
        comboData.push(nChooseKFrags)
      })
      const setComboCount = getComboCount(comboData)
      if (setComboCount > 500) {
        setOverlapData(null)
        return
      }
    } else {
      setOverlapData(null)
    }

    const allCombos = generateCombos(comboData)
    const mustHaveRelics = Object.entries(relicPrefs).filter(relic => relic[1] === 1).map(relic => relic[0])
    const parsedCombos = allCombos
      .map(q => q
        .flatMap(i => i)
        .filter((val, i, s) => s.indexOf(val) === i))
      .sort((a, b) => a.length - b.length)
      .filter(combo => mustHaveRelics.every(relic => combo.includes(relic)))
    setOverlapData(parsedCombos)
  }, [activeSets, calcHash, relicPrefs, state, thresholdSelections])

  return <div className="overlaps-container">
    <div id="overlaps-title">
      OVERLAPS
    </div>
    <div id="warning-label">
      Complex combos may take several seconds to calculate. Combos of 5 or higher are disabled. Very complex combos may also halt themselves.
    </div>
    <div id="set-list">
      {Sets.map(set => (
        <div
          key={set.name}
          className={`set ${activeSets[set.name] ? 'active' : ''}`}
          onClick={() => toggleSet(set.name)}
        >
          {set.name}
        </div>
      ))}
    </div>
    <div id="calculate" onClick={() => setCalcHash(calcHash + 1)}>Calculate</div>
    <div id="prefer-ignore-helper">
      Click on the relic fragment names below to cycle between <span>"prefer"</span> (only show overlaps with this relic), <span>"ignore"</span> (only show overlaps without this relic), and <span>"no preference"</span>
    </div>
    <div id="relics-in-sets">
      {Object.entries(activeSets).filter(entry => entry[1]).map(entry => entry[0]).map(set => {
        const setData = Sets.find(iset => iset.name === set)
        return (
          <div key={set.name}>
            <div className="left-panel">
              <div className="set-name">{setData.name}</div>
              <div className="set-activator-thresholds">
                {setData.activationThresholds.map(threshold => (
                  <div
                    className={`set-thres ${thresholdSelections[setData.name] === threshold ? 'active' : ''}`}
                    onClick={() => setThreshold({ setName: setData.name, setThreshold: threshold })}
                  >{threshold}</div>
                ))}
              </div>
            </div>
            <div className="set-relics">
              {setData?.fragments.map(frag => {
                {/* console.log(relicPrefs) */}
                const activeClass = state[frag] ? 'active' : ''
                const prefClass = relicPrefs[frag] === 1
                  ? 'prefer'
                  : (relicPrefs[frag] === 2 ? 'ignore' : '')
                return (
                  <div
                    key={frag}
                    onClick={() => cycleRelicPref(frag)}
                    className={`${activeClass} ${prefClass}`}
                  >{frag}</div>
                )
              })}
            </div>
          </div>
        )}
      )}
    </div>
    <div id="overlap-section">
      <div id="overlap-title">UP TO 25 COMBOS <span>(of lowest relic count)</span></div>
      <div id="actual-overlaps">{
        overlapData === null
        ? (<div>Selected items are too complex. Try narrowing it down by ignoring some relics, or choosing less sets.</div>)
        : overlapData.filter(overlap => overlap.length <= 7 && overlap.length === overlapData[0].length).slice(0,100).map(overlap => (
            <div className="set-relics">
              {overlap.map(frag => (
                <div key={frag} className={`active ${relicPrefs[frag] === 1 && 'prefer'}`}>{frag}</div>
              ))}
            </div>
          ))
        }
      </div>
    </div>
  </div>;
}
