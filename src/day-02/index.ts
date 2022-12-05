import * as R from 'ramda';

import { getInput } from '../utils';

const O = {
  WIN: 6,
  DRAW: 3,
  LOSE: 0,
};

const outcomeScoreMap = new Map([
  ['A X', O.DRAW],
  ['A Y', O.WIN],
  ['A Z', O.LOSE],
  ['B X', O.LOSE],
  ['B Y', O.DRAW],
  ['B Z', O.WIN],
  ['C X', O.WIN],
  ['C Y', O.LOSE],
  ['C Z', O.DRAW],
]);

const throwScoreMap = new Map([
  ['X', 1],
  ['Y', 2],
  ['Z', 3],
]);

const throwResultMap = new Map([
  ['A X', 'A Z'],
  ['A Y', 'A X'],
  ['A Z', 'A Y'],
  ['B X', 'B X'],
  ['B Y', 'B Y'],
  ['B Z', 'B Z'],
  ['C X', 'C Y'],
  ['C Y', 'C Z'],
  ['C Z', 'C X'],
]);

const formatInputData = R.split('\n');

const inputData = getInput(import.meta.dir, 'input.txt');

const getResult = R.reduce<string, number>(
  (total, round) => {
    const outcomeScore = outcomeScoreMap.get(round);
    const [, myThrow] = round.split(' ');
    const throwScore = throwScoreMap.get(myThrow);
    return total + outcomeScore + throwScore;
  },
  0,
);

const mapData = R.map<string, string>((key) =>
  throwResultMap.get(key),
);

const getFinalScoreChallenge1 = R.pipe(
  formatInputData,
  getResult,
);
const getFinalScoreChallenge2 = R.pipe(
  formatInputData,
  mapData,
  getResult,
);

console.log(
  'Challenge 1: ',
  getFinalScoreChallenge1(inputData),
);
console.log(
  'Challenge 2: ',
  getFinalScoreChallenge2(inputData),
);
