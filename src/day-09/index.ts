import * as R from 'ramda';

import { getInput } from '../utils';

type Position = [number, number];
type Direction = 'U' | 'R' | 'D' | 'L';
type Vector = [number, number];
type Motion = `${Direction} ${string}`;

const isDirection = (direction: Direction) =>
  R.pipe(R.head, R.equals(direction));

const convertMotionToVector: (str: Motion) => Vector =
  R.pipe(
    R.split(' '),
    ([direction, magnitude]) => [
      direction,
      Number(magnitude),
    ],
    R.cond([
      [
        isDirection('U'),
        ([_, magnitude]) => [0, magnitude],
      ],
      [
        isDirection('R'),
        ([_, magnitude]) => [magnitude, 0],
      ],
      [
        isDirection('D'),
        ([_, magnitude]) => [0, -1 * magnitude],
      ],
      [
        isDirection('L'),
        ([_, magnitude]) => [magnitude * -1, 0],
      ],
    ]),
  );

const formatInputData = R.pipe<
  [string],
  Motion[],
  Vector[]
>(R.split('\n'), R.map(convertMotionToVector));

const interpolateTailToHead = (
  tailPosition: Position,
  headPosition: Position,
): Position[] => {
  let [tx, ty] = tailPosition;
  const [hx, hy] = headPosition;

  let positions: Position[] = [tailPosition];

  while (Math.abs(hx - tx) > 1 || Math.abs(hy - ty) > 1) {
    const dx = hx - tx;
    const dy = hy - ty;

    if (Math.abs(dx) >= 1) {
      tx += Math.sign(dx);
    }

    if (Math.abs(dy) >= 1) {
      ty += Math.sign(dy);
    }

    positions.push([tx, ty]);
  }

  return positions;
};

const applyVectorToPosition = (
  [vx, vy]: Vector,
  [px, py]: Position,
): Position => [px + vx, py + vy];

const getMinAndMax = (
  numbers: number[],
): [number, number] => [
  Math.min(...numbers),
  Math.max(...numbers),
];

const printGrid = (grid: string[][]): void => {
  console.log('\n');
  grid.forEach((row) => {
    console.log(row.join(''));
  });
  console.log('\n');
};

const emptyGrid = (size: number): string[][] => {
  const row = new Array(size).fill('.');
  const grid = new Array(size).fill([...row]);

  return JSON.parse(JSON.stringify(grid));
};

const plotPositions = (
  positions: { head: Position; tail: Position[] }[],
): void => {
  const [min, max] = R.pipe(
    R.map(R.values),
    R.flatten,
    getMinAndMax,
  )(positions);

  const size = max - min;

  const modifiedPositions = R.map(({ head, tail }) => ({
    head: head.map((x) => x + Math.abs(min)),
    tail: tail.map((x) => x.map((y) => y + Math.abs(min))),
  }))(positions);

  modifiedPositions.map(({ head, tail }) => {
    const grid = emptyGrid(size);
    const [hx, hy] = head;

    grid[Math.abs(min) - 1][Math.abs(min) - 1] = 's';

    grid[hy - 1][hx - 1] = 'H';

    tail.forEach(([tx, ty], i) => {
      grid[ty - 1][tx - 1] = `${i + 1}`;
    });

    printGrid(grid.reverse());
  });
};

const countVisited = R.pipe(
  formatInputData,
  R.reduce<
    Vector,
    {
      visited: Set<string>;
      headPosition: Position;
      tailPosition: Position[];
      positions: { head: Position; tail: Position[] }[];
    }
  >(
    (
      { visited, headPosition, tailPosition, positions },
      vector,
    ) => {
      const nextHeadPosition = applyVectorToPosition(
        vector,
        headPosition,
      );

      const { visitedArr, tailPosition: nextTailPosition } =
        tailPosition.reduce(
          (
            { tailPosition, prevTailPosition },
            currentTailPosition,
            i,
            arr,
          ) => {
            const isLast = i === arr.length - 1;
            const positions = interpolateTailToHead(
              currentTailPosition,
              prevTailPosition,
            );

            const nextTailPosition = R.last(positions);

            const res = {
              tailPosition: [
                ...tailPosition,
                nextTailPosition,
              ],
              prevTailPosition: nextTailPosition,
              visitedArr: isLast ? positions : [],
            };

            return res;
          },
          {
            tailPosition: [],
            prevTailPosition: nextHeadPosition,
            visitedArr: [],
          },
        );

      visitedArr.forEach((x) => visited.add(x.toString()));

      return {
        visited,
        headPosition: nextHeadPosition,
        tailPosition: nextTailPosition,
        positions: [
          ...positions,
          {
            head: nextHeadPosition,
            tail: nextTailPosition,
          },
        ],
      };
    },
    {
      visited: new Set(),
      headPosition: [0, 0],
      tailPosition: new Array(9).fill([0, 0]),
      positions: [],
    },
  ),
  R.tap(({ positions }) => plotPositions(positions)),
  ({ visited }) => visited.size,
);

const inputData = getInput(
  import.meta.dir,
  'basic-input-2.txt',
);

console.debug('Challenge 1: ', countVisited(inputData));

// 2466 - too low
