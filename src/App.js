import React from 'react';
import './App.css';
// TODO as the structure comes into place, start breaking things off

const POSSIBLE_TARGETS = [
  "allies",
  "enemies",
  "all units"
];

const TEMPLATES = [
  <>
    Deal damage to <RandomTargetType/>
  </>,
  <>
    Force
    <RandomTargetType/>
    to attack
    <RandomTargetType/>
  </>
];

function App() {

  return (
    <div id="backbox">
      <div id="topbar">Random Ability Generator</div>
          <AbilityTemplate/>
    </div>
  );
}

class AbilityTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {templateId: 0};
    this.pickRandomTemplate = this.pickRandomTemplate.bind(this);
    this.getTemplateFragment = this.getTemplateFragment.bind(this);
  }

  componentDidMount() {
    this.pickRandomTemplate();
  }

  pickRandomTemplate() {
    // avoid repeats so it feels more random (conveniently, also makes state change certain)
    function newRandomTemplate (omit) {
        let chosenTemplate = randomInt(TEMPLATES.length - 1);
        return chosenTemplate >= omit ? chosenTemplate + 1: chosenTemplate;
    };
  
    this.setState((state) => {
      return {templateId : newRandomTemplate(state.templateId)};
    });
  }

  getTemplateFragment() {
    return (
      <div>
        {pickSafely(this.state.templateId, TEMPLATES)}
      </div>
    )
  }

  render() {
    let generatedFragment = this.getTemplateFragment();
    return (
      <div id="content-main">
        <div className="text-content">
          {generatedFragment}
          <p>Template #: {this.state.templateId}</p>
        </div>
        <button className="btn" onClick={this.pickRandomTemplate}>Another One!</button>
      </div>
    )
  }
}

function RandomTargetType() {
  const targetInd = randomInt(POSSIBLE_TARGETS.length);

  return (
    <TargetType selectionIndex={targetInd}/>
  );
}

function TargetType(props) {
  const selectionIndex = props.selectionIndex;

  return (
    <div>
      {pickSafely(selectionIndex, POSSIBLE_TARGETS)}
    </div>
  );
}

function pickSafely(targetIndex, sourceList) {
  return targetIndex < sourceList.length 
  ? sourceList[targetIndex]
  : '???'
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default App;
