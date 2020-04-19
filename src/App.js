import React from 'react';
import './App.css';
// TODO as the structure comes into place, start breaking things off

const POSSIBLE_TARGETS = [
  "allies",
  "enemies",
  "all units"
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
  }

  componentDidMount() {
    this.pickRandomTemplate();
  }

  pickRandomTemplate() {
    // TODO meaningless for now, use length when there is a real list to choose from
    const randomTemplate = randomInt(10);
    this.setState({
      templateId : randomTemplate
    });
  }

  render() {
    // TODO cond render when we have multiple templates
    let generatedFragment = <RandomTargetType/>;
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
  const maxTargetsPossible = POSSIBLE_TARGETS.length;
  const targetInd = randomInt(maxTargetsPossible);

  return (
    <TargetType selectionIndex={targetInd}/>
  );
}

function TargetType(props) {
  const selectionIndex = props.selectionIndex;

  return (
    <div>
      {selectionIndex < POSSIBLE_TARGETS.length 
      ? POSSIBLE_TARGETS[selectionIndex]
      : '???'
      }
    </div>
  );
}

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default App;
