import React from 'react';
import TEMPLATES from './phrasebook/FullPhrasePicker.js'
import PhraseTemplate from './phrasebook/PhraseTemplate.js'
import './App.css';

function App() {

  return (
    <div id="backbox">
      <div id="topbar">Random Terrible Ability Generator</div>
          <PhraseTemplate isTop={true} template={TEMPLATES} canBeRerolled={false}/>
    </div>
  );
}

export default App;
