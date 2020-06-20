import React from 'react';
import * as utils from '../Utils.js';

/**
 * template prop defines the phrase list to use
 * isTop prop defines whether the phrase should be rendered with wrappings
 * canBeRerolled defines whether it should be clickable to reroll
 */
class PhraseTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {templateId: -1};
    this.pickRandomTemplate = this.pickRandomTemplate.bind(this);
    this.getTemplateFragment = this.getTemplateFragment.bind(this);
    this.getTopLevelFragment = this.getTopLevelFragment.bind(this);
    this.setTemplateIdInRange = this.setTemplateIdInRange.bind(this);
  }

  componentDidMount() {
    this.pickRandomTemplate();
  }

  /**
   * Pick a random valid template
   * @param {boolean} avoidPrevious  avoid the previous template to 'feel' more random
   */
  pickRandomTemplate(avoidPrevious) {
    let cachedId = avoidPrevious ?
    this.state.templateId :
    -1
    // to ensure children get randomized, blank this out first to force remounting TODO is there a better way?
    this.setState(() => {
      return {templateId : -1};
    }, () => this.setTemplateIdInRange(cachedId));
  }

  /**
   * Set template id to a random valid one that is not the given
   * @param {number} cachedId id to omit, negatives mean do not omit
   */
  setTemplateIdInRange(cachedId) {
    this.setState((state, props) => {
      return {templateId : utils.randomIntOmitting(cachedId, props.template.length)};
    });
  }

  getTemplateFragment() {
    let generatedFragment = this.state.templateId === -1 ?
      <></> :
      <>{utils.pickSafely(this.state.templateId, this.props.template)}</>
    ;

    if (this.props.canBeRerolled) {
      generatedFragment = <div className="rerollable" onClick={() => this.pickRandomTemplate(true)}>{generatedFragment}</div>;
    }

    return (
      generatedFragment
    )
  }

  getTopLevelFragment() {
    return (
      <div id="content-main">
        <div className="text-content">
          {this.getTemplateFragment()}
        </div>
        <button className="btn" onClick={() => this.pickRandomTemplate(false)}>Another One!</button>
      </div>
    )
  }

  render() {
    let generatedFragment = this.props.isTop ?
      this.getTopLevelFragment() :
      <div className="nested-phrase">{this.getTemplateFragment()}</div>
    ;
    
    return (
      <>{generatedFragment}</>
    )
  }
}

export default PhraseTemplate;
