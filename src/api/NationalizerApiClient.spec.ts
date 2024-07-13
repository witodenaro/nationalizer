import { vi, describe, test, expect } from 'vitest';

vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: () =>
        Promise.resolve({
          data: [{ country: [{ country_id: 'US', probability: 0.5 }] }],
        }),
    }),
  },
}));

import NationalizerApiClient from './NationalizerApiClient';

describe('NationalizerApiClient', () => {
  test('should fetch names', async () => {
    const names = ['John', 'Doe', 'Jane', 'Smith'];
    const results = await NationalizerApiClient.fetchMany(names);

    expect(results.length).toBe(1);
  });
});
