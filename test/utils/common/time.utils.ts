import util from 'util';

export const waitTime = async (ms: number): Promise<void> => {
  const wait = util.promisify(setTimeout);
  await wait(ms);
};
