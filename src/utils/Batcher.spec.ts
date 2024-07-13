import { describe, test, expect } from 'vitest';
import { Batcher } from './batcher';

describe('Batcher', () => {
  test('should batch items', () => {
    const batchSize = 2;
    const batcher = new Batcher(batchSize);
    const items = [1, 2, 3, 4, 5];
    const batches = batcher.batch(items);

    expect(batches).toEqual([[1, 2], [3, 4], [5]]);
  });
});
