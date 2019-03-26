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
    this.fakeData = {};
    this.priceMin = 0;
    this.bedsMin = 0;
    this.bathsMin = 0;
    this.yearMin = YEARMIN; // altered value typed in; could be replaced w/ YEARMIN
    this.yearMax = YEARMAX; // ditto-ish
    this.yearMinReal = 0;   // real values typed in
    this.yearMaxReal = 0;   // ditto
    this.minYearColor = 'red';
    this.maxYearColor = 'red';
    this.prevMinYearColor = 'red';
    this.prevMaxYearColor = 'red';
    this.prevYearMinMode = 0;
    this.prevYearMaxMode = 0;
    this.sqftMin = SQFTMIN;
    this.sqftMax = SQFTMAX;
    this.minSqftColor = 'red';
    this.maxSqftColor = 'red';
    this.prevMinSqftColor = 'red';
    this.prevMaxSqftColor = 'red';
    this.prevSqftMinMode = 0;
    this.prevSqftMaxMode = 0;
    this.filterObj = {}; // for use in filtering map data
    this.okToFilter = false;
    this.state = {
      fakeDataFiltered: [],
      updateFilter: false
    }

    if (props.location && props.location.state && props.location.state.bsr)
    {
      this.bsr = props.location.state.bsr;
    }
  }

  // NOTE - this function is being deprecated.
  componentWillMount = () => {

    // Generate all fake data I need.
    this.fakeData = _.times(17000, (i) => {
      return ({
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        zip: zipCodeData['items'][i]['zip'],
        streetAddr: faker.address.streetAddress(),
        sqft: Math.floor(SQFTMIN + Math.random() * 3001), // 1000 min, 4000 max
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
      });
  	});
    this.setState((prevState, currentProps) => {
      return { ...prevState, fakeDataFiltered: [...this.fakeData] }; });
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

    if (obj.sqft < this.sqftMin || obj.sqft > this.sqftMax)
      return false;
    return true;
  }

  parseFloatIgnoreCommas = (number) => {
    let numberNoCommas = number.replace(/,/g, '');
    return parseFloat(numberNoCommas);
  }

  onFilterChange = async (obj) => {
    this.filterObj = obj;
    this.okToFilter = false;
    let checkYear = false;
    let checkSqft = false;
    let savedKey = '';
    let minYearMode = 0; // ie, the state of the state machine
    let maxYearMode = 0; // ie, the state of the state machine
    let minSqftMode = 0; // ie, the state of the state machine
    let maxSqftMode = 0; // ie, the state of the state machine


    for (const key of Object.keys(obj)) {
      switch (key)
      {
        case 'price':
          if (this.bsr === 'buy') { // obj={"price":"$500,000"}
            this.priceMin = obj[key].match(/[0-9,]+/);
          }
          else {  // obj={"price":"$500/month+"}
            this.priceMin = obj[key].match(/[0-9]+/);
          }
          if (this.priceMin == null)
            this.priceMin = 0;
          else
            // priceMin will be an array of stuff, we need [0].
            this.priceMin = this.parseFloatIgnoreCommas(this.priceMin[0]);
          break;

        // If the user picks 'Any', the 1st char will be 'A'.
        // If the user clear the filter, the 1st char will be 'B'.
        case 'beds':
          this.bedsMin = obj[key].charAt(0);  // obj={"beds":"1+ Beds"}
          if (this.bedsMin === 'A' || this.bedsMin === 'B')
            this.bedsMin = 0;
          else
            this.bedsMin = parseInt(this.bedsMin);
          break;

        // ditto from the beds comment.
        case 'baths':
          this.bathsMin = obj[key].charAt(0);  // obj={"baths":"1+ Baths"}
          if (this.bathsMin === 'A' || this.bathsMin === 'B')
            this.bathsMin = 0;
            else
              this.bathsMin = parseInt(this.bathsMin);
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

        case 'sqftMin':
          this.sqftMin = parseInt(obj[key]);
          checkSqft = true;
          savedKey = key; // key track of which item user was just editing
          break;

        case 'sqftMax':
          this.sqftMax = parseInt(obj[key]);
          checkSqft = true;
          savedKey = key; // key track of which item user was just editing
          break;

        default:
          console.log("onFilterChg - default, key=" + key);
      }
    }

    if (checkYear) {
      /* implied values: 1935 for min, 2018 for max (ie, the limits)
      State 1 - 0-3 digits, red, invalid, val = implied value
      State 2 - 4 digits, red, invalid, out of range of min,max
      State 3 - 4 digits, red, valid but min > max
      State 4 - 4 digits, black, val = implied value
      State 5 - 4 digits, black, render, val != implied value
      Backspacing when 4 digits causes transition back to state 1.
      Transitioning from state 5 to state 1 causes render.
      I optimized the code below to collapse states 0-2 and get
      rid of unnecessary code.
      */
      // Check if year being typed is valid.
      let newYearMinValid = (this.yearMin >= YEARMIN && this.yearMin <= YEARMAX);
      let newYearMaxValid = (this.yearMax >= YEARMIN && this.yearMax <= YEARMAX);

      if (savedKey === 'yearMin')
      {
        maxYearMode = this.prevYearMaxMode;
        if (this.yearMin < 1000)
        {
          if (this.prevYearMinMode === 4)
          {
            //this.yearMinReal = this.yearMin;
            this.yearMin = YEARMIN;
            this.okToFilter = true;
          }
        }
        else  // min year has 4 digits or more
        {
          if (newYearMaxValid && newYearMinValid)
          {
            if (this.yearMin <= this.yearMax)
            {
              minYearMode = 3;
              if (this.yearMin !== YEARMIN)
              {
                minYearMode = 4;
                this.okToFilter = true;
              }
            }
          }
          else if (newYearMinValid) // max is not in range
          {
            minYearMode = 3;
            if (this.yearMin !== YEARMIN)
            {
              minYearMode = 4;
              this.okToFilter = true;
            }
          }
        }
      }
      else if (savedKey === 'yearMax')
      {
        minYearMode = this.prevYearMinMode;
        if (this.yearMax < 1000)
        {
          if (this.prevYearMaxMode === 4)
          {
            //this.yearMaxReal = this.yearMax;
            this.yearMax = YEARMAX;
            this.okToFilter = true;
          }
        }
        else
        {
          if (newYearMinValid && newYearMaxValid)
          {
            if (this.yearMin <= this.yearMax)
            {
              maxYearMode = 3;
              if (this.yearMax !== YEARMAX)
              {
                maxYearMode = 4;
                this.okToFilter = true;
              }
            }
          }
          else if (newYearMaxValid) // min is not in range
          {
            maxYearMode = 3;
            if (this.yearMax !== YEARMAX)
            {
              maxYearMode = 4;
              this.okToFilter = true;
            }
          }
        }
      }

      this.minYearColor = 'red';
      if (minYearMode >= 3)
        this.minYearColor = 'black';

      this.maxYearColor = 'red';
      if (maxYearMode >= 3)
        this.maxYearColor = 'black';

      if (this.prevMinYearColor !== this.minYearColor ||
          this.prevMaxYearColor !== this.maxYearColor)
      {
        this.setState ({ updateFilter: true }); // cause render of filter
      }

      this.prevMinYearColor = this.minYearColor;
      this.prevMaxYearColor = this.maxYearColor;
      this.prevYearMinMode = minYearMode;
      this.prevYearMaxMode = maxYearMode;
    }
    else if (checkSqft)
    {
      let newSqftMinValid = (this.sqftMin >= SQFTMIN && this.sqftMin <= SQFTMAX);
      let newSqftMaxValid = (this.sqftMax >= SQFTMIN && this.sqftMax <= SQFTMAX);

      if (savedKey === 'sqftMin')
      {
        maxSqftMode = this.prevSqftMaxMode;
        if (this.sqftMin < 1000)
        {
          if (this.prevSqftMinMode === 4)
          {
            this.sqftMin = SQFTMIN;
            this.okToFilter = true;
          }
        }
        else  // min sqft has 4 digits or more
        {
          if (newSqftMaxValid && newSqftMinValid)
          {
            if (this.sqftMin <= this.sqftMax)
            {
              minSqftMode = 3;
              if (this.sqftMin !== SQFTMIN)
              {
                minSqftMode = 4;
                this.okToFilter = true;
              }
            }
          }
          else if (newSqftMinValid) // max is not in range
          {
            minSqftMode = 3;
            if (this.sqftMin !== SQFTMIN)
            {
              minSqftMode = 4;
              this.okToFilter = true;
            }
          }
        }
      }
      else if (savedKey === 'sqftMax')
      {
        minSqftMode = this.prevSqftMinMode;
        if (this.sqftMax < 1000)
        {
          if (this.prevSqftMaxMode === 4)
          {
            this.sqftMax = SQFTMAX;
            this.okToFilter = true;
          }
        }
        else
        {
          if (newSqftMinValid && newSqftMaxValid)
          {
            if (this.sqftMin <= this.sqftMax)
            {
              maxSqftMode = 3;
              if (this.sqftMax !== SQFTMAX)
              {
                maxSqftMode = 4;
                this.okToFilter = true;
              }
            }
          }
          else if (newSqftMaxValid) // min is not in range
          {
            maxSqftMode = 3;
            if (this.sqftMax !== SQFTMAX)
            {
              maxSqftMode = 4;
              this.okToFilter = true;
            }
          }
        }
      }

      this.minSqftColor = 'red';
      if (minSqftMode >= 3)
        this.minSqftColor = 'black';

      this.maxSqftColor = 'red';
      if (maxSqftMode >= 3)
        this.maxSqftColor = 'black';

      if (this.prevMinSqftColor !== this.minSqftColor ||
          this.prevMaxSqftColor !== this.maxSqftColor)
      {
        this.setState ({ updateFilter: true }); // cause render of filter
      }

      this.prevMinSqftColor = this.minSqftColor;
      this.prevMaxSqftColor = this.maxSqftColor;
      this.prevSqftMinMode = minSqftMode;
      this.prevSqftMaxMode = maxSqftMode;
    }
    else {
      this.okToFilter = true; // for non-year and non-sqft situations
    }

    if (this.okToFilter)
    {
      this.setState((prevState, currentProps) => {
          return { ...prevState, fakeDataFiltered: [...this.fakeData.filter(this.filterTheData)],
            updateFilter: false };
      });
    }
  }

  // Make this function pure and never update state here.
  render() {
    return (
      <div>
        <Filter
          {...this.props}
          onFilterChange={this.onFilterChange}
          minYearColor={this.minYearColor}
          maxYearColor={this.maxYearColor}
          minSqftColor={this.minSqftColor}
          maxSqftColor={this.maxSqftColor}
        />
        <Container style={{ width: '95%', marginBottom: '24px'}}>
          <MapComponent
            {...this.props}
            fakeData={this.state.fakeDataFiltered}
            fakeDataUpdated={this.okToFilter}
          />
        </Container>
      </div>
    );
  }
}

export default MapPage;
