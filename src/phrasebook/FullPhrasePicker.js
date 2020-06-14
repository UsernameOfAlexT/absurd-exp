import React from 'react';
import POSSIBLE_TARGETS from './TargetPicker.js'
import DAMAGE_TYPE from './DamageTypePicker.js'
import CONDITIONAL from './ConditionPicker.js'
import PROJECTILE from './ProjectilePicker.js'
import PhraseTemplate from './PhraseTemplate.js'

const TEMPLATES = [
    <div className="ability-content">
      Launch a
      <PhraseTemplate isTop={false} template={PROJECTILE} canBeRerolled={true}/>
      at
      <PhraseTemplate isTop={false} template={POSSIBLE_TARGETS} canBeRerolled={true}/>
      nearby that deals
      <PhraseTemplate isTop={false} template={DAMAGE_TYPE} canBeRerolled={true}/>
      damage
    </div>,
    <div className="ability-content">
      Launch a
      <PhraseTemplate isTop={false} template={PROJECTILE} canBeRerolled={true}/>
      that deals
      <PhraseTemplate isTop={false} template={DAMAGE_TYPE} canBeRerolled={true}/> 
      damage.
      Only usable if
      <PhraseTemplate isTop={false} template={CONDITIONAL} canBeRerolled={false}/>
    </div>,
    <div className="ability-content">
    Release a
    <PhraseTemplate isTop={false} template={PROJECTILE} canBeRerolled={true}/>
    that deals
    <PhraseTemplate isTop={false} template={DAMAGE_TYPE} canBeRerolled={true}/> 
    damage in a random direction.
  </div>
  ];

export default TEMPLATES;