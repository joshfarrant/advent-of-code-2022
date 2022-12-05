import { readFileSync } from 'fs';

export const getInput = (...paths: string[]): string => {
  const inputPath = paths.join('/');
  return readFileSync(inputPath, 'utf-8');
};
