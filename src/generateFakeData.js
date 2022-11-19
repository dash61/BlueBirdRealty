
import { faker } from '@faker-js/faker';
import zipCodeData from './Pages/mapData.json';
import houseImages from './Pages/houseImages.json'; // an array of url strings
import { YEARMIN, SQFTMIN } from './Components/Constants';
import { times } from 'lodash';

export default function generateFakeData () {
    // Given a latitude or longitude value, randomize it so that it is close
    // to the given value, but randomly a small distance away. Ideally, it
    // remains in the same zip code, or very close to it.
    const randomize = (value) => {
      return value + ((Math.random() - 0.5) * 0.05);
    }

    console.log("generateFakeData - start");

    // Generate all fake data I need. TODO - move this up to index, pass data down.
    // This data generation takes around 4 seconds.
    const result = times(17000, (i) => {
      return ({
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        zip: zipCodeData['items'][i]['zip'],
        streetAddr: faker.address.streetAddress(),
        sqft: Math.floor(SQFTMIN + Math.random() * 3001), // 1000 min, 4000 max
        beds: Math.floor(1 + Math.random() * 5), // 1 min, 5 max
        baths: Math.floor(1 + Math.random() * 4), // 1 min, 4 max
        price: 0, // calc this on the fly in MapComponent
        lat: randomize(zipCodeData['items'][i]['lat']),
        lng: randomize(zipCodeData['items'][i]['lng']),
        city: zipCodeData['items'][i]['city'],
        state: zipCodeData['items'][i]['abbr'],
        image: houseImages['items'][Math.floor(0 + Math.random() * 282)], // 281 images
        yearBuilt: Math.floor(YEARMIN + Math.random() * 84) // 1935 min, 2018 max
      });
    });
    console.log("generateFakeData - done");
    return result;
}
