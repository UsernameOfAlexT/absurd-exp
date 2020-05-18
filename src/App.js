import React from 'react';
import * as utils from './Utils.js';
import POSSIBLE_TARGETS from './TargetPicker.js'
import './App.css';

function App() {

  return (
    <div id="backbox">
      <div id="topbar">Random Ability Generator</div>
          <PhraseTemplate isTop={true} template={TEMPLATES} parent="top"/>
    </div>
  );
}

/**
 * template prop defines the phrase list to use
 * isTop prop defines whether the phrase should be rendered with wrappings
 * canReroll prop decides whether the template can be clicked on to reroll its value
 * parent prop can be used to differentiate between templates higher up
 */
class PhraseTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {templateId: -1};
    this.pickRandomTemplate = this.pickRandomTemplate.bind(this);
    this.getTemplateFragment = this.getTemplateFragment.bind(this);
    this.getTopLevelFragment = this.getTopLevelFragment.bind(this);
  }

  componentDidMount() {
    this.pickRandomTemplate();
  }

  pickRandomTemplate() {
    // avoid repeats so it feels more random (conveniently, also makes state change certain)
    this.setState((state, props) => {
      return {templateId : utils.randomIntOmitting(state.templateId, props.template.length)};
    });
  }

  getTemplateFragment() {
    return (
      <div>
        {utils.pickSafely(this.state.templateId, this.props.template)}
      </div>
    )
  }

  getTopLevelFragment() {
    return (
      <div id="content-main">
        <div className="text-content">
          {this.getTemplateFragment()}
          <p>Template #: {this.state.templateId}</p>
        </div>
        <button className="btn" onClick={this.pickRandomTemplate}>Another One!</button>
      </div>
    )
  }

  render() {
    // TODO rerolling logic

    let generatedFragment = this.props.isTop ?
      this.getTopLevelFragment() :
      this.getTemplateFragment()
    ;
    
    return (
      <>{generatedFragment}</>
    )
  }
}

// TODO react is too smart and doesn't want to reroll these when changed
const TEMPLATES = [
  <div className="ability-content">
    Deal damage to <PhraseTemplate isTop={false} template={POSSIBLE_TARGETS}/>
  </div>,
  <div className="ability-content">
    Force
    <PhraseTemplate isTop={false} template={POSSIBLE_TARGETS}/>
    to attack
    <PhraseTemplate isTop={false} template={POSSIBLE_TARGETS}/>
  </div>
];

export default App;
