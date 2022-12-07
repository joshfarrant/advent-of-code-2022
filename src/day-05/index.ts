import * as R from 'ramda';

import { getInput } from '../utils';

type Instruction = [number, number, number];

const parseInstruction = R.pipe<
  [string],
  string[],
  string[],
  Instruction
>(
  R.match(/\D+(\d+)\D+(\d+)\D+(\d+)/),
  R.takeLast(3),
  // TODO Could I use an Option monad here?
  R.map(Number),
);

const formatStart = R.pipe<
  [string],
  string[],
  string[][],
  string[][],
  string[][]
>(
  R.split('\n'),
  R.map(
    R.pipe(
      R.split(''),
      R.splitEvery(4),
      R.map(R.pipe(R.nth(1))),
    ),
  ),
  R.transpose,
  R.map(
    R.pipe(
      R.dropLast(1),
      R.dropWhile((x) => x === ' '),
    ),
  ),
);

const formatInstructions = R.pipe(
  R.split('\n'),
  R.map(parseInstruction),
);

const formatInputData = R.pipe(
  R.split('\n\n'),
  ([start, instructions]) => ({
    position: formatStart(start),
    instructions: formatInstructions(instructions),
  }),
);

const applyInstructions =
  (moveAsGroup: boolean) =>
  ({ position, instructions }) => {
    let remainingInstructions = [...instructions];
    let currentPosition = [...position];
    while (remainingInstructions.length > 0) {
      const [count, fromCol, toCol] =
        remainingInstructions.shift();
      const fromIdx = fromCol - 1;
      const toIdx = toCol - 1;
      const fromColumn = currentPosition[fromIdx];
      const toColumn = currentPosition[toIdx];

      const [itemsToMove, remainingItems] =
        R.splitAt(count)(fromColumn);
      currentPosition[fromIdx] = [...remainingItems];
      const movedItems = moveAsGroup
        ? itemsToMove
        : itemsToMove.reverse();
      currentPosition[toIdx] = [...movedItems, ...toColumn];
    }

    return R.pipe(
      R.map(R.head),
      R.join(''),
    )(currentPosition);
  };

const challenge1 = R.pipe(
  formatInputData,
  applyInstructions(false),
);
const challenge2 = R.pipe(
  formatInputData,
  applyInstructions(true),
);

const inputData = getInput(import.meta.dir, 'input.txt');

console.debug('Challenge 1: ', challenge1(inputData));
console.debug('Challenge 2: ', challenge2(inputData));
