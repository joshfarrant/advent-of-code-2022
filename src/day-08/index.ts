import * as R from 'ramda';

import { getInput } from '../utils';

type Tree = [number, boolean];
type LineOfTrees = Tree[];

const reduceIndexed = R.addIndex(R.reduce);
const mapIndexed = R.addIndex(R.map);

const getMaxInList = R.pipe(R.sort(R.lt), R.head);

const markTrees = R.pipe(
  mapIndexed(([height, seen], i, line) => {
    if (seen) {
      return [height, seen];
    }

    if (i === 0) {
      return [height, true];
    }

    const prevHighest = R.pipe(
      R.take(i),
      R.map(R.head),
      getMaxInList,
      R.defaultTo(0),
    )(line);

    if (height > prevHighest) {
      return [height, true];
    }

    return [height, false];
  }),
);

const formatInputData = R.pipe<
  [string],
  string[],
  [number, boolean][][]
>(
  R.split('\n'),
  R.map(R.map((height) => [Number(height), false])),
);

const reverseRows = R.map<LineOfTrees, LineOfTrees>(
  R.reverse,
);

const countTrues = R.pipe(
  R.map(R.map(R.last)),
  R.flatten,
  R.count((x) => x === true),
);

const countVisibleTrees = R.pipe(
  formatInputData,
  R.map(markTrees),
  reverseRows,
  R.map(markTrees),
  R.transpose,
  R.map(markTrees),
  reverseRows,
  R.map(markTrees),
  countTrues,
);

const inputData = getInput(import.meta.dir, 'input.txt');

console.debug(
  'Challenge 1: ',
  countVisibleTrees(inputData),
);
