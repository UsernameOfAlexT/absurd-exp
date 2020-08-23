export function pickSafely(targetIndex, sourceList) {
    return targetIndex < sourceList.length 
    ? sourceList[targetIndex]
    : '???'
}
  
export function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * 
 * @param {number} max maximum in either positive or negative direction
 */
export function randomIntEitherSign(max) {
    return randomInt(2) > 0 ? randomInt(max) : - randomInt(max);
}

/**
 * 
 * @param {number} omit omitted index when randomizing. Negatives mean do not omit
 * @param {number} max non inclusive maximum
 */
export function randomIntOmitting(omit, max) {
    if (omit < 0) {
        return randomInt(max);
    }
    let chosenTemplate = randomInt(max - 1);
    return chosenTemplate >= omit ? chosenTemplate + 1: chosenTemplate;
}

// varFunction should take the step for that dimension, then return some offset amount
export function uniformBaseGenerator(pointsToGen, varFunction, heightmax, widthmax) {
    let newCoords = [];
    // premature optimization is the root of all evil; but this can probably be better
    let ptsPerSide = Math.ceil(Math.sqrt(pointsToGen));
    let ystep = Math.round(heightmax / ptsPerSide);
    let xstep = Math.round(widthmax / ptsPerSide);
    for (let i = 0; i < ptsPerSide; i++) {
      for (let j = 0; j < ptsPerSide; j++) {
        newCoords.push({
          x: xstep * i + Math.round(xstep / 2) + varFunction(xstep),
          y: ystep * j + Math.round(ystep / 2) + varFunction(ystep)
        });
      }
    }
    return newCoords;
  }