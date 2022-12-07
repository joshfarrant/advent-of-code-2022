import * as R from 'ramda';

import { getInput } from '../utils';

const findMessageStartIdx = (apertureSize: number) =>
  R.pipe(
    R.aperture(apertureSize),
    R.findIndex(
      (arr) =>
        // TODO idk the way to do this using Ramda
        R.pipe(R.uniq, R.length)(arr) === R.length(arr),
    ),
    R.add(apertureSize),
  );

const inputData = getInput(import.meta.dir, 'input.txt');

console.debug(
  'Challenge 1: ',
  findMessageStartIdx(4)(inputData),
);
console.debug(
  'Challenge 2: ',
  findMessageStartIdx(14)(inputData),
);
