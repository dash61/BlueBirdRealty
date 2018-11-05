import React from "react";
import {
  Container,
} from 'semantic-ui-react';
import MapComponent from '../Components/MapComponent';
import Filter from '../Components/Filter';
import faker from 'faker';
import _ from 'lodash';
import zipCodeData from './mapData.json';
import houseImages from './houseImages.json'; // an array of url strings
import { YEARMIN, YEARMAX, SQFTMIN, SQFTMAX } from '../Components/Constants';


class MapPage extends React.Component {
  constructor(props) {
    super(props);
    console.log("MapPage - props=", props); // loadLayerData is passed; call this to update the store (during init, and later)
    this.fakeData = {};
    this.priceMin = 0;
    this.bedsMin = 0;
    this.bathsMin = 0;
    this.yearMin = 0;//YEARMIN;
    this.yearMax = 0;//YEARMAX;
    this.sqftMin = SQFTMIN;
    this.sqftMax = SQFTMAX;
    this.prevYearMin = 0;
    this.prevYearMax = 0;
    this.minYearOk = false;
    this.maxYearOk = false;
    this.minSqftOk = false;
    this.maxSqftOk = false;
    this.filterObj = {}; // for use in filtering map data
    //this.fakeDataFiltered = [];
    this.state = {
      //fakeDataUpdated: false,
      fakeDataFiltered: [],
    }

    if (props.location && props.location.state && props.location.state.bsr)
    {
      this.bsr = props.location.state.bsr;
      console.log("MapPage - bsr term = ", props.location.state.bsr);
    }
  }

  // Invoked immediately after component is inserted into tree.
  // Ok to call setState here.
  componentDidMount = () => {
    console.log("cdm - MapPage");
  }

  componentDidUpdate = (prevProps, prevState) => {
    // code to run when the component receives new props or state
    //console.log ("cdu - MapPage");
    //console.log (prevProps);
    //console.log (prevState);
    //console.log (this.state);
  }

  componentWillMount = () => {
    console.log("cwm - MapPage - generating fake data");

    this.fakeData = _.times(20000, (i) => {
      return ({
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        zip: zipCodeData['items'][i]['zip'],
        streetAddr: faker.address.streetAddress(),
        sqft: Math.floor(SQFTMIN + Math.random() * 4001), // 1000 min, 4000 max
        beds: Math.floor(1 + Math.random() * 5), // 1 min, 5 max
        baths: Math.floor(1 + Math.random() * 4), // 1 min, 4 max
        price: (this.bsr === 'buy' ?
          Math.floor(75 + Math.random() * 906) * 1000.0 : // 75k to 980k
          Math.floor(250 + Math.random() * 4251)), // 250 to 4500
        lat: this.randomize(zipCodeData['items'][i]['lat']),
        lng: this.randomize(zipCodeData['items'][i]['lng']),
        city: zipCodeData['items'][i]['city'],
        state: zipCodeData['items'][i]['abbr'],
        image: houseImages['items'][Math.floor(0 + Math.random() * 282)], // 281 images
        yearBuilt: Math.floor(YEARMIN + Math.random() * 84) // 1935 min, 2018 max
        /* Need this data: name (ie, name of seller), street, suite, city,
           state, zip, lat, long.
           Ignore city from faker; instead use geonames lookup below to turn
           the zip code into a city, state, lat and long. Then randomize the
           lat/long data.
           Then console.log it. When done, save this block of data to a
           .json file.
           NOTE: These are strings: name, zip, addr.
                 These are numbers: baths, beds, price, sqft.
        */
      });
  	});
    //console.log(this.fakeData);
    //this.fakeDataFiltered = this.fakeData.slice(0);
    // this.setState((prevState, currentProps) => {
    //   return { ...prevState, fakeDataUpdated: true }; });
    this.setState((prevState, currentProps) => {
      return { ...prevState, fakeDataFiltered: [...this.fakeData] }; });
    console.log("cwm - MapPage - Length of fakeData = " + this.fakeData.length.toString());
    console.log("cwm - MapPage - Length of fakeDataF = " + this.state.fakeDataFiltered.length.toString());
  }

  // Given a latitude or longitude value, randomize it so that it is close
  // to the given value, but randomly a small distance away. Ideally, it
  // remains in the same zip code, or very close to it.
  randomize (value) {
    return value + ((Math.random() - 0.5) * 0.05);
  }

  // obj will be one element of the this.fakeData array.
  // Price will be a float, as will sqft, beds, baths.
  // this.filterObj will be obj={"price":"$500/month+"}. /^\$[0-9]/$/
  // or will be obj={"price":"$100,000+"}. /^\$[0-9,]\+$/
  // Beds will be obj={"beds":"1+ Beds"}.
  // Baths will be obj={"baths":"1+ Baths"}.
  // Type we will ignore.
  // Year built - tbd
  // Sq ft - tbd
  filterTheData = (obj) => {
    //console.log("filterTheData running");
    if (this.priceMin !== 0)
    {
      if (obj.price < this.priceMin)
        return false; // we can reject this house right away
    }
    if (this.bedsMin !== 0)
    {
      if (obj.beds < this.bedsMin)
        return false;
    }
    if (this.bathsMin !== 0)
    {
      if (obj.baths < this.bathsMin)
        return false;
    }
    if (obj.yearBuilt < this.yearMin || obj.yearBuilt > this.yearMax)
      return false;
    // for (const key of Object.keys(obj)){
    //   console.log("filterTheData - key = " + key + ", value = " + obj[key].toString());
    // }
    return true;
  }

  parseFloatIgnoreCommas = (number) => {
    //console.log("parseFloatIgnoreCommas - number = ", number);
    let numberNoCommas = number.replace(/,/g, '');
    return parseFloat(numberNoCommas);
  }

  onFilterChange = async (obj) => {
    this.filterObj = obj;
    let okToFilter = true;
    let checkYear = false;
    let checkSqft = false;
    let savedKey = '';

    for (const key of Object.keys(obj)) {
      console.log("onFilterChange - key = " + key + ", value = " + obj[key].toString());
      switch (key)
      {
        case 'price':
          if (this.bsr === 'buy') { // obj={"price":"$500,000"}
            this.priceMin = obj[key].match(/[0-9,]+/);
          }
          else {  // obj={"price":"$500/month+"}
            this.priceMin = obj[key].match(/[0-9]+/);
          }
          //console.log("onFilterChange - priceMin = ", this.priceMin);
          if (this.priceMin == null)
            this.priceMin = 0;
          else
            // priceMin will be an array of stuff, we need [0].
            this.priceMin = this.parseFloatIgnoreCommas(this.priceMin[0]);
          //console.log("onFilterChange - priceMin = " + this.priceMin.toString());
          break;

        // If the user picks 'Any', the 1st char will be 'A'.
        // If the user clear the filter, the 1st char will be 'B'.
        case 'beds':
          this.bedsMin = obj[key].charAt(0);  // obj={"beds":"1+ Beds"}
          if (this.bedsMin === 'A' || this.bedsMin === 'B')
            this.bedsMin = 0;
          else
            this.bedsMin = parseInt(this.bedsMin);
          //console.log("onFilterChange - bedsMin = " + this.bedsMin.toString());
          break;

        // ditto from the beds comment.
        case 'baths':
          this.bathsMin = obj[key].charAt(0);  // obj={"baths":"1+ Baths"}
          if (this.bathsMin === 'A' || this.bathsMin === 'B')
            this.bathsMin = 0;
            else
              this.bathsMin = parseInt(this.bathsMin);
          //console.log("onFilterChange - bathsMin = " + this.bathsMin.toString());
          break;

        case 'yearMin':
          this.yearMin = parseInt(obj[key]);
          checkYear = true;
          savedKey = key; // key track of which item user was just editing
          break;

        case 'yearMax':
          this.yearMax = parseInt(obj[key]);
          checkYear = true;
          savedKey = key; // key track of which item user was just editing
          break;

        default:
          console.log("onFilterChange - default, key=" + key);
      }
    }
    console.log("checkYear=", checkYear, ", yearMin=", this.yearMin,
      ", yearMax=", this.yearMax);

    if (checkYear) {
      // Check if year being typed is valid.
      this.minYearOk = true; // reset
      this.maxYearOk = true; // ditto
      let newYearMinValid = (this.yearMin >= YEARMIN && this.yearMin <=YEARMAX);
      let newYearMaxValid = (this.yearMax >= YEARMIN && this.yearMax <=YEARMAX);
      let prevYearMinValid = (this.prevYearMin >= YEARMIN && this.prevYearMin <=YEARMAX);
      let prevYearMaxValid = (this.prevYearMax >= YEARMIN && this.prevYearMax <=YEARMAX);
      if (newYearMinValid && newYearMaxValid) {
        if (this.yearMin > this.yearMax) {
          if (savedKey === 'yearMin') // user was typing in year min box
            newYearMinValid = false;
          else if (savedKey === 'yearMax')
            newYearMaxValid = false;
        }
      }
      console.log("mappage - ", newYearMinValid, newYearMaxValid, prevYearMinValid,
        prevYearMaxValid);
      console.log("mappage - ", this.yearMin, this.yearMax, this.prevYearMin,
        this.prevYearMax);
      this.minYearOk = newYearMinValid;
      this.maxYearOk = newYearMaxValid;

      /*
      1 - don't filter if value changes from implied to invalid
      2 - don't filter if value changes from invalid to invalid
      3 - don't filter if value changes from empty to invalid
      4 - don't filter if value changes from invalid to implied
      5 - don't filter if value changes from invalid to valid BUT min>max
      6 - don't filter if value changes from valid to invalid BUT min>max when valid
      */
      if (savedKey === 'yearMin') {
        if (this.prevYearMin === YEARMIN && newYearMinValid === false)
          okToFilter = false;
        else if (prevYearMinValid === false && newYearMinValid === false)
          okToFilter = false;
        else if (this.prevYearMin === 0 && newYearMinValid === false)
          okToFilter = false;
        else if (prevYearMinValid === false && newYearMinValid === YEARMIN)
          okToFilter = false;
        else if (prevYearMinValid === false && newYearMinValid === true) {
          if (this.yearMin > this.yearMax) {
            okToFilter = false;
          }
        }
        else if (prevYearMinValid === true && newYearMinValid === false) {
          if (this.prevYearMin > this.yearMax) {
            okToFilter = false;
          }
        }
      }

      if (savedKey === 'yearMax') {
        if (this.prevYearMax === YEARMIN && newYearMaxValid === false)
          okToFilter = false;
        else if (prevYearMaxValid === false && newYearMaxValid === false)
          okToFilter = false;
        else if (this.prevYearMax === 0 && newYearMaxValid === false)
          okToFilter = false;
        else if (prevYearMaxValid === false && newYearMaxValid === YEARMIN)
          okToFilter = false;
        else if (prevYearMaxValid === false && newYearMaxValid === true) {
          if (this.yearMin > this.yearMax) {
            okToFilter = false;
          }
        }
        else if (prevYearMaxValid === true && newYearMaxValid === false) {
          if (this.yearMin > this.prevYearMax) {
            okToFilter = false;
          }
        }
      }

      // At end of everything:
      if (savedKey === 'yearMin')
        this.prevYearMin = this.yearMin; // save for next go-around
      if (savedKey === 'yearMax')
        this.prevYearMax = this.yearMax; // save for next go-around

      // // If user is changing year min and it went from valid to invalid, refilter.
      // if (savedKey == 'yearMin' && !newYearMinValid && !this.prevYearMinValid) {
      //   okToFilter = false;
      // } not true if prevyear was the default min, and valid???
      // false if : was valid, now invalid
      //
      //
      // // If user is changing year min and it went from valid to invalid, refilter.
      // if (savedKey == 'yearMin' && !newYearMinValid && this.prevYearMinValid) {
      //   okToFilter = true;
      //   this.prevYearMinValid = false;
      // }
      // // If user is changing year min and it went from invalid to valid, refilter.
      // if (savedKey == 'yearMin' && newYearMinValid && !this.prevYearMinValid) {
      //   okToFilter = true;
      //   this.prevYearMinValid = true;
      // }
      //
      // // If user is changing year max and it went from valid to invalid, refilter.
      // if (savedKey == 'yearMax' && !newYearMaxValid && this.prevYearMaxValid) {
      //   okToFilter = true;
      //   this.prevYearMaxValid = false;
      // }
      // // If user is changing year max and it went from invalid to valid, refilter.
      // if (savedKey == 'yearMax' && newYearMaxValid && !this.prevYearMaxValid) {
      //   okToFilter = true;
      //   this.prevYearMaxValid = true;
      // }

      // if (this.yearMinValid )
      // if (this.yearMin <= this.yearMax) {
      //   if (this.yearMin >= YEARMIN) {
      //     if (this.yearMax <= YEARMAX) {
      //       okToFilter = true;
      //     }
      //   }
      // }
    }

    //console.log("Filter, onFilterChange - got obj=" + JSON.stringify(obj));
    // this.fakeDataFiltered = this.fakeData.filter(this.filterTheData);
    // this.setState((prevState, currentProps) => {
    //   return { ...prevState, fakeDataUpdated: true }; });

    // let tempNewFakeData = await this.fakeData.filter(this.filterTheData);
    // console.log("onFilterChange - length of new fakeData = ", tempNewFakeData.length);
    // this.setState((prevState, currentProps) => {
    //     return { ...prevState, fakeDataFiltered: [...tempNewFakeData] };
    // });
    if (okToFilter) {
      console.log("Ok to filter is true");
      this.setState((prevState, currentProps) => {
          return { ...prevState, fakeDataFiltered: [...this.fakeData.filter(this.filterTheData)] };
      });
    }
  }

  // Make this function pure and never update state here.
  render() {
    console.log("MapPage - rendering filter and map, minYearOk=", this.minYearOk);
    return (
      <div>
        <Filter
          {...this.props}
          onFilterChange={this.onFilterChange}
          minYearColor={this.minYearOk}
          maxYearColor={this.maxYearOk}
          minSqftColor={this.minSqftOk}
          maxSqftColor={this.maxSqftOk}
        />
        <Container style={{ width: '95%', marginBottom: '20px'}}>
          <MapComponent
            {...this.props}
            fakeData={this.state.fakeDataFiltered}
            fakeDataUpdated={true}
          />
        </Container>
      </div>
    );
  }
}

export default MapPage;
