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
        ([_, magnitude]) => [magnitude, 0],
      ],
      [
        isDirection('R'),
        ([_, magnitude]) => [0, magnitude],
      ],
      [
        isDirection('D'),
        ([_, magnitude]) => [magnitude * -1, 0],
      ],
      [
        isDirection('L'),
        ([_, magnitude]) => [0, -1 * magnitude],
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

const countVisited = R.pipe(
  formatInputData,
  R.reduce<
    Vector,
    {
      visited: Set<string>;
      headPosition: Position;
      tailPosition: Position;
    }
  >(
    ({ visited, headPosition, tailPosition }, vector) => {
      const nextHeadPosition = applyVectorToPosition(
        vector,
        headPosition,
      );

      const tailPositions = interpolateTailToHead(
        tailPosition,
        nextHeadPosition,
      );

      const nextTailPosition = R.last(tailPositions);

      tailPositions.forEach((x) =>
        visited.add(x.toString()),
      );

      return {
        visited,
        headPosition: nextHeadPosition,
        tailPosition: nextTailPosition,
      };
    },
    {
      visited: new Set(),
      headPosition: [0, 0],
      tailPosition: [0, 0],
    },
  ),
  ({ visited }) => visited.size,
);

const inputData = getInput(import.meta.dir, 'input.txt');

console.debug('Challenge 1: ', countVisited(inputData));
