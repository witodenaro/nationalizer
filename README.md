## Nationalizer

Nationalizer is an NPM package that provides a simple interface for determining the probable nationalities of individuals based on their names.

## Installation
Install the package via npm:

sh
npm install public-nationalizer-service

### Usage

First, import the NationalizerService class from the package. Then, create an instance of the class and use the nationalize method to get the probable nationalities of the provided names.

Example
```typescript
import { NationalizerService } from 'nationalizer';

const fullNames = [
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'Marie', lastName: 'Curie' }
];

NationalizerService.nationalize(fullNames)
  .then((nationalizedNames) => {
    console.log(nationalizedNames);
  })
  .catch((error) => {
    console.error(error);
  });
```

API

```typescript
nationalize(fullNames: FullName[]): Promise<NationalizedName[]>
```

This method accepts an array of FullName objects and returns a promise that resolves to an array of NationalizedName objects, each containing the original FullName and an array of CountryResult objects representing the probable nationalities.

License

This project is licensed under the MIT License.

Contributing

Contributions are welcome! Please open an issue or submit a pull request with any improvements or bug fixes.

Support

For any questions or issues, please open a new issue on the GitHub repository.

Happy Nationalizing!