import nationalizer from '../api/NationalizerBatchApiClient';
import {
  COUNTRY_ID,
  CountryResult,
  NameResult,
  NationalitiesByName,
} from '../types/nationalities';
import Arithmetics from '../utils/Arithmetics';

interface FullName {
  id?: string;
  firstName: string;
  lastName: string;
}

interface NationalizedName {
  fullName: FullName;
  nationalities: CountryResult[];
}

interface PublicNationalizerServiceInterface {
  nationalize(fullNames: FullName[]): Promise<any>;
}

class NationalizerService implements PublicNationalizerServiceInterface {
  async nationalize(fullNames: FullName[]): Promise<NationalizedName[]> {
    const names = this.separateFullNames(fullNames);

    const results = await nationalizer.fetch(names);

    return this.combineFullNamesWithResults(fullNames, results);
  }

  separateFullNames(fullNames: FullName[]) {
    return fullNames.reduce<string[]>((acc, name) => {
      return [...acc, name.firstName, name.lastName];
    }, []);
  }

  combineFullNamesWithResults(fullName: FullName[], results: NameResult[]) {
    const nationalityByName = this.convertResultsToHash(results);

    return fullName.map((name) =>
      this.combineFullNameResults(name, nationalityByName)
    );
  }

  convertResultsToHash(nameResults: NameResult[]) {
    return nameResults.reduce<NationalitiesByName>((hash, response) => {
      const countries = response.country;

      if (!countries.length) {
        return hash;
      }

      hash[response.name] = countries;
      return hash;
    }, {});
  }

  combineFullNameResults(
    fullName: FullName,
    nationalityByName: NationalitiesByName
  ): NationalizedName {
    const { firstName, lastName } = fullName;

    const firstNameNationalities = nationalityByName[firstName] || [];
    const lastNameNationalities = nationalityByName[lastName] || [];

    const combinedResults = this.combineResults(
      firstNameNationalities,
      lastNameNationalities
    );

    return {
      fullName,
      nationalities: combinedResults,
    };
  }

  combineResults(
    firstResults: CountryResult[],
    secondResults: CountryResult[]
  ): CountryResult[] {
    const countryResults = [...firstResults, ...secondResults];

    const combinedResults = countryResults.reduce<
      Partial<Record<COUNTRY_ID, number>>
    >((hash, country) => {
      const { probability } = country;
      const currentProbability = hash[country.country_id];

      if (!currentProbability) {
        hash[country.country_id] = country.probability;
        return hash;
      }

      hash[country.country_id] = Arithmetics.getAverage(
        currentProbability,
        probability
      );

      return hash;
    }, {});

    return (Object.entries(combinedResults) as [COUNTRY_ID, number][]).map(
      ([country_id, probability]) => ({
        country_id,
        probability,
      })
    );
  }
}

export default new NationalizerService();
