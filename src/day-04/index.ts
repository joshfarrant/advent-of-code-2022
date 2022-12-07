import * as R from 'ramda';

import { getInput } from '../utils';

const formatPair = R.pipe(R.split('-'), R.map(Number));
const formatLine = R.pipe(R.split(','), R.map(formatPair));

const formatInputData = R.pipe<
  [string],
  string[],
  number[][][]
>(R.split('\n'), R.map(formatLine));

const isContained = ([[start1, end1], [start2, end2]]: [
  [number, number],
  [number, number],
]) =>
  (start1 <= start2 && end1 >= end2) ||
  (start2 <= start1 && end2 >= end1);

const isOverlapping = ([[start1, end1], [start2, end2]]: [
  [number, number],
  [number, number],
]) =>
  (start2 >= start1 && start2 <= end1) ||
  (end2 >= start1 && end2 <= end1);

const countContainedPairs = R.pipe(
  formatInputData,
  R.count(isContained),
);

const countOverlappingAndContainedPairs = R.pipe(
  formatInputData,
  R.count(
    (pair) => isOverlapping(pair) || isContained(pair),
  ),
);

const inputData = getInput(import.meta.dir, 'input.txt');

console.debug(
  'Challenge 1: ',
  countContainedPairs(inputData),
);
console.debug(
  'Challenge 2: ',
  countOverlappingAndContainedPairs(inputData),
);
