import * as R from 'ramda';

import { getInput } from '../utils';

type Elf = number[];

const toNumber = (str: string): number => Number(str);

const formatInputData = R.pipe<[string], string[], Elf[]>(
  R.split('\n\n'),
  R.map(R.pipe(R.split('\n'), R.map(toNumber))),
);

const sortDescending = R.sort<number>(
  R.descend(R.identity),
);

const getMaxCalories = (count = 1) =>
  R.pipe<[Elf], Elf, Elf, number>(
    sortDescending,
    R.take(count),
    R.sum,
  );

const findElvesWithMostCalories = (count: number) =>
  R.pipe<[string], Elf[], number[], number>(
    formatInputData,
    R.map(R.sum),
    getMaxCalories(count),
  );

const challenge1 = findElvesWithMostCalories(1);
const challenge2 = findElvesWithMostCalories(3);

const inputData = getInput(import.meta.dir, 'input.txt');

console.log('Challenge 1: ', challenge1(inputData));
console.log('Challenge 2: ', challenge2(inputData));
