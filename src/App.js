import React from 'react';
import TEMPLATES from './phrasebook/FullPhrasePicker.js'
import PhraseTemplate from './phrasebook/PhraseTemplate.js'
import './App.css';

/**
 * Props are applications: list of applications containing objs that have
 * title, content and description
 */
class ApplicationPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active : 0}
    this.pickActiveApp = this.pickActiveApp.bind(this);
    this.nextApp = this.nextApp.bind(this);
    this.previousApp = this.previousApp.bind(this);
  }

  pickActiveApp() {
    return this.props.applications[this.state.active];
  }

  nextApp() {
    let newActive = this.state.active + 1 > this.props.applications.length - 1
    ? 0
    : this.state.active + 1;
    this.setState({
      active: newActive
    });
  }

  previousApp() {
    let newActive = this.state.active - 1 < 0
    ? this.props.applications.length - 1
    : this.state.active - 1;
    this.setState({
      active: newActive
    });
  }

  render() {
    return (
      <>
      <div id="topbar">{this.pickActiveApp().title}
        <div id="selectors">
          <button className="btn equalbtn" onClick={this.previousApp}>Previous</button>
          <button className="btn equalbtn" onClick={this.nextApp}>Next</button>
        </div>
      </div>
      {this.pickActiveApp().content}
      <div id="botbar">What is this? 
        <div id="desc">{this.pickActiveApp().description}</div>
      </div>
      </>
    )
  }
}

function App() {

  return (
    <div id="backbox">
      <ApplicationPicker applications={appPicker}/>
    </div>
  );
}

const abilityGen = {
  title: "Random Terrible Ability Generator",
  content: <PhraseTemplate isTop={true} template={TEMPLATES} canBeRerolled={false}/>,
  description: "Generate silly random ability ideas. Click on highlighted words to reroll them" 
}

const welcome = {
  title: "Gallery of Pointless Creations",
  content: <></>,
  description: "Collection of random pointless things. Not useful, but I still love them. " + 
  "This is a welcome page, so there is nothing here. " + 
  "Use the buttons at the top to look through what there is!" 
}

const appPicker = [
  welcome,
  abilityGen
]

export default App;