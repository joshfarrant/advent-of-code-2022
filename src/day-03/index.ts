import * as R from 'ramda';

import { getInput } from '../utils';

const formatInputData = R.split('\n');

const isUpperCase = (str: string): boolean =>
  str === str.toUpperCase();

const getPriority = (str: string): number => {
  let priority = parseInt(str, 36) - 9;

  if (isUpperCase(str)) {
    priority += 26;
  }

  return priority;
};

const splitStringInHalf = (
  str: string,
): [string, string] => {
  const firstHalf = str.slice(0, str.length / 2);
  const secondHalf = str.slice(str.length / 2, str.length);
  return [firstHalf, secondHalf];
};

const getIntersection = (rucksack: string): string[] => {
  const [firstHalf, secondHalf] =
    splitStringInHalf(rucksack);
  const firstHalfArray = firstHalf.split('');
  const secondHalfArray = secondHalf.split('');
  const intersection = R.intersection(
    firstHalfArray,
    secondHalfArray,
  );

  return intersection;
};

const intersectN = (arr: string[][]): string[] => {
  return arr.reduce((a, c) => R.intersection(a, c));
};

// const intersectN = R.reduce<string[], string[]>(
//   R.intersection,
// );

const computePriority = R.pipe(R.map(getPriority), R.sum);

const getTotalIntersectionPriority = R.pipe(
  getIntersection,
  computePriority,
);

const getTotalPriority = R.pipe(
  formatInputData,
  R.map(getTotalIntersectionPriority),
  R.sum,
);

const getBadgePriorities = R.pipe<
  [string],
  string[],
  string[][],
  string[][],
  string[],
  number
>(
  formatInputData,
  R.splitEvery(3),
  R.map(R.pipe(R.map(R.split('')), intersectN)),
  R.flatten,
  computePriority,
);

const inputData = getInput(import.meta.dir, 'input.txt');

console.debug('Challenge 1: ', getTotalPriority(inputData));
console.debug(
  'Challenge 2: ',
  getBadgePriorities(inputData),
);
