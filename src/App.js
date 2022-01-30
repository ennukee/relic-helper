import React, { useReducer } from 'react';
import RelicSidebar from './modules/RelicSidebar';
import MainPanel from './modules/MainPanel';
import './App.css';

export const RelicDataContext = React.createContext({})

const reducer = (state, relicName) => {
  const out = {
    ...state,
    [relicName]: !state[relicName]
  }
  localStorage.setItem('relicStorage', JSON.stringify(out))
  return out
}

function App() {
  const [state, dispatch] = useReducer(reducer, JSON.parse(localStorage.relicStorage || '{}'))

  return (
    <RelicDataContext.Provider value={{
      state,
      dispatch,
    }}>
      <div className="main-container">
        <RelicSidebar />
        <MainPanel />
      </div>
    </RelicDataContext.Provider>
  );
}

export default App;
