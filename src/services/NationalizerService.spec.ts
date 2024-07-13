import { vi, test, expect, describe } from 'vitest';
import NationalizerService from './NationalizerService';
import { NameResult, NationalitiesByName } from '../types/nationalities';

vi.mock('../api/NationalizerBatchApiClient', () => ({
  default: {
    fetch: (names: string[]): NameResult[] =>
      names.map((name) => ({
        name,
        country: [{ country_id: 'US', probability: 0.5 }],
        count: 1,
      })),
  },
}));

describe('NationalizerService', async () => {
  describe('nationalize', async () => {
    test('should nationalize full names', async () => {
      const fullNames = [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Smith' },
      ];

      const nationalized = await NationalizerService.nationalize(fullNames);

      expect(nationalized.length).toBe(2);
    });

    test('should return combined probabilities', async () => {
      const fullNames = [{ firstName: 'John', lastName: 'Doe' }];

      const nationalized = await NationalizerService.nationalize(fullNames);

      expect(nationalized[0].nationalities.length).toBe(1);
      expect(nationalized[0].nationalities[0].country_id).toEqual('US');
      expect(nationalized[0].nationalities[0].probability).toEqual(0.5);
    });
  });

  describe('separateFullNames', () => {
    test('should separate full names', () => {
      const fullNames = [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Smith' },
      ];

      const names = NationalizerService.separateFullNames(fullNames);

      expect(names).toEqual(['John', 'Doe', 'Jane', 'Smith']);
    });
  });

  describe('convertResultsToHash', () => {
    test('should convert results to hash', () => {
      const results: NameResult[] = [
        {
          name: 'John',
          country: [{ country_id: 'US', probability: 0.5 }],
          count: 1,
        },
      ];

      const hash = NationalizerService.convertResultsToHash(results);

      expect(hash).toEqual({
        John: [{ country_id: 'US', probability: 0.5 }],
      });
    });

    test('should not fail on empty country array', () => {
      const results: NameResult[] = [{ country: [], name: 'John', count: 0 }];

      const hash = NationalizerService.convertResultsToHash(results);

      expect(hash).toEqual({});
    });
  });

  describe('combineFullNameResults', () => {
    test('should combine full name results', () => {
      const fullName = { firstName: 'John', lastName: 'Doe' };
      const nationalityByName: NationalitiesByName = {
        John: [{ country_id: 'US', probability: 0.3 }],
        Doe: [{ country_id: 'US', probability: 0.6 }],
      };

      const { nationalities } = NationalizerService.combineFullNameResults(
        fullName,
        nationalityByName
      );

      expect(nationalities.length).toBe(1);
      expect(nationalities[0].country_id).toBe('US');
      expect(nationalities[0].probability).toBe(0.45);
    });

    test('should handle missing last name result', () => {
      const fullName = { firstName: 'John', lastName: 'Doe' };
      const nationalityByName: NationalitiesByName = {
        John: [{ country_id: 'US', probability: 0.3 }],
      };

      const { nationalities } = NationalizerService.combineFullNameResults(
        fullName,
        nationalityByName
      );

      expect(nationalities.length).toBe(1);
    });

    test('should handle missing first name result', () => {
      const fullName = { firstName: 'John', lastName: 'Doe' };
      const nationalityByName: NationalitiesByName = {
        Doe: [{ country_id: 'US', probability: 0.3 }],
      };

      const { nationalities } = NationalizerService.combineFullNameResults(
        fullName,
        nationalityByName
      );

      expect(nationalities.length).toBe(1);
    });
  });
});
