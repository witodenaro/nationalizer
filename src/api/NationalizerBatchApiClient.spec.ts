import { vi, describe, expect, test } from 'vitest';

import NationalizerBatchApiClient from './NationalizerBatchApiClient';

vi.mock('./NationalizerApiClient', () => ({
  default: {
    fetchMany: (names: string[]) =>
      Promise.resolve(names.map((name) => ({ name }))),
  },
}));

describe('NationalizerBatchApiClient', () => {
  test('should fetch names in batches', async () => {
    const names = [
      'John',
      'Doe',
      'Jane',
      'Smith',
      'Alice',
      'Bob',
      'Charlie',
      'David',
      'Eve',
      'Frank',
    ];
    const results = await NationalizerBatchApiClient.fetch(names);

    expect(results.length).toBe(10);
  });
});
