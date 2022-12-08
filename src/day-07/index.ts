import * as R from 'ramda';

import { getInput } from '../utils';

type File = {
  name: string;
  size: number;
};

type Directory = File & {
  contents: (File | Directory)[];
};

const formatInputData = R.split('\n');

const handleCd = R.cond([
  [
    R.pipe(R.prop('cmd'), R.drop(5), R.equals('/')),
    (x) => ({ ...x, pwd: '/' }),
  ],
  [
    R.pipe(R.prop('cmd'), R.drop(5), R.equals('..')),
    (x) => ({
      ...x,
      pwd: R.pipe(
        R.prop('pwd'),
        R.dropLastWhile((str) => str !== '/'),
        R.ifElse(
          (x) => R.gt(1, R.length(x)),
          R.dropLast(1),
          R.identity,
        ),
      )(x),
    }),
  ],
  [
    R.pipe(R.prop('cmd'), R.drop(5), R.test(/^[\w\d]+/)),
    (x) => ({
      ...x,
      pwd:
        x.pwd === '/'
          ? `${x.pwd}${R.drop(5)(x.cmd)}`
          : `${x.pwd}/${R.drop(5)(x.cmd)}`,
    }),
  ],
]);
const handleLs = R.identity;
const handleDir = R.identity;
const handleFile = R.identity;

const isCd = R.pipe(
  R.prop('cmd'),
  R.take(4),
  R.equals('$ cd'),
);
const isLs = R.pipe(
  R.prop('cmd'),
  R.take(4),
  R.equals('$ ls'),
);
const isDir = R.pipe(
  R.prop('cmd'),
  R.take(3),
  R.equals('dir'),
);
const isFile = R.pipe(R.prop('cmd'), R.test(/^\d+/));

const run = R.pipe(
  formatInputData,
  R.reduce(
    (a, cmd) =>
      R.pipe(
        R.cond([
          [isCd, handleCd],
          [isLs, handleLs],
          [isDir, handleDir],
          [isFile, handleFile],
        ]),
        R.tap(console.debug),
      )({ ...a, cmd }),
    {},
  ),
);

const inputData = getInput(
  import.meta.dir,
  'basic-input.txt',
);

const result = run(inputData);

console.debug('result: ', result);

const example: Directory = {
  name: '/',
  size: 0,
  contents: [
    {
      name: 'a',
      size: 0,
      contents: [
        {
          name: 'e',
          size: 0,
          contents: [],
        },
      ],
    },
    { name: 'b.txt', size: 14848514 },
    { name: 'c.dat', size: 8504156 },
    {
      name: 'd',
      size: 0,
      contents: [],
    },
  ],
};
