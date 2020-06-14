import React from 'react';
import DAMAGE_TYPE from './DamageTypePicker.js'
import PhraseTemplate from './PhraseTemplate.js'

const CONDITIONAL = [
    <>
      <PhraseTemplate isTop={false} template={DAMAGE_TYPE} canBeRerolled={true}/>
      damage was recently taken by the caster
    </>,
    <>  
      it is daytime
    </>,
    <>  
      it is nighttime
  </>
  ];

export default CONDITIONAL;