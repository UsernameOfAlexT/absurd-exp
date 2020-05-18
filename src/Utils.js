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