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
    console.log("MapPage - ctor props=", props); // loadLayerData is passed; call this to update the store (during init, and later)
    this.fakeData = {};
    this.priceMin = 0;
    this.bedsMin = 0;
    this.bathsMin = 0;
    this.yearMin = YEARMIN; // altered value typed in; could be replaced w/ YEARMIN
    this.yearMax = YEARMAX; // ditto-ish
    this.yearMinReal = 0;   // real values typed in
    this.yearMaxReal = 0;   // ditto
    this.sqftMin = SQFTMIN;
    this.sqftMax = SQFTMAX;
    this.minYearColor = 'red';
    this.maxYearColor = 'red';
    this.prevMinMode = 0;
    this.prevMaxMode = 0;
    this.prevMinYearColor = 'red';
    this.prevMaxYearColor = 'red';
    this.minSqftOk = false;
    this.maxSqftOk = false;
    this.filterObj = {}; // for use in filtering map data
    //this.fakeDataFiltered = [];
    this.state = {
      //fakeDataUpdated: false,
      fakeDataFiltered: [],
      updateFilter: false
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
    console.log ("MapPage - cdu - prevState=", prevState);
    // if (prevState.updateFilter === true && this.state.updateFilter === true)
    // {
    //   this.setState ({ updateFilter: false });
    // }
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
    let okToFilter = false;
    let checkYear = false;
    let checkSqft = false;
    let savedKey = '';
    let minMode = 0; // ie, the state of the state machine
    let maxMode = 0; // ie, the state of the state machine


    for (const key of Object.keys(obj)) {
      console.log("onFilterChg - key = " + key + ", value =", obj[key]);
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
          console.log("onFilterChg - default, key=" + key);
      }
    }
    console.log("onFilterChg - checkYear=", checkYear, ", yearMin=", this.yearMin,
      ", yearMax=", this.yearMax);

    if (checkYear) {
      console.log("onFilterChg - 1 minMode=", minMode, ", prevMinMode=",
        this.prevMinMode, ", maxMode=", maxMode,
        ", prevMaxMode=", this.prevMaxMode);

      /* implied values: 1935 for min, 2018 for max (ie, the limits)
      State 1 - 0-3 digits, red, invalid, val = implied value
      State 2 - 4 digits, red, invalid, out of range of min,max
      State 3 - 4 digits, red, valid but min > max
      State 4 - 4 digits, black, val = implied value
      State 5 - 4 digits, black, render, val != implied value
      Backspacing when 4 digits causes transition back to state 1.
      Transitioning from state 5 to state 1 causes render.
      */
      // Check if year being typed is valid.
      let newYearMinValid = (this.yearMin >= YEARMIN && this.yearMin <= YEARMAX);
      let newYearMaxValid = (this.yearMax >= YEARMIN && this.yearMax <= YEARMAX);
      if (savedKey === 'yearMin')
      {
        maxMode = this.prevMaxMode;
        if (this.yearMin < 1000)
        {
          if (this.prevMinMode === 4)
          {
            this.yearMinReal = this.yearMin;
            this.yearMin = YEARMIN;
            okToFilter = true;
          }
        }
        else  // min year has 4 digits or more
        {
          if (newYearMinValid)
          {
            if (newYearMaxValid)
            {
              if (this.yearMin <= this.yearMax)
              {
                if (this.yearMin === YEARMIN)
                {
                  minMode = 3;
                }
                else
                {
                  minMode = 4;
                  okToFilter = true;
                  if (this.yearMin <= this.yearMaxReal)
                  {
                    maxMode = 4;
                  }
                }
              }
            }
            else // max is not in range
            {
              if (this.yearMin === YEARMIN)
              {
                minMode = 3;
              }
              else
              {
                minMode = 4;
                okToFilter = true;
              }
            }
          }
        }
      }
      else if (savedKey === 'yearMax')
      {
        minMode = this.prevMinMode;
        if (this.yearMax < 1000)
        {
          if (this.prevMaxMode === 4)
          {
            this.yearMaxReal = this.yearMax;
            this.yearMax = YEARMAX;
            okToFilter = true;
          }
        }
        else
        {
          if (newYearMaxValid)
          {
            if (newYearMinValid)
            {
              if (this.yearMin <= this.yearMax)
              {
                if (this.yearMax === YEARMAX)
                {
                  maxMode = 3;
                }
                else if (this.yearMax !== YEARMAX)
                {
                  maxMode = 4;
                  okToFilter = true;
                  if ((this.yearMinReal >= YEARMIN) && (this.yearMinReal <= this.yearMax))
                  {
                    minMode = 4;
                  }
                }
              }
            }
            else // min is not in range
            {
              if (this.yearMax === YEARMAX)
              {
                maxMode = 3;
              }
              else if (this.yearMax !== YEARMAX)
              {
                maxMode = 4;
                okToFilter = true;
              }
            }
          }
        }
      }

      this.minYearColor = 'red';
      if (minMode >= 3)
        this.minYearColor = 'black';

      this.maxYearColor = 'red';
      if (maxMode >= 3)
        this.maxYearColor = 'black';

      if (this.prevMinYearColor !== this.minYearColor ||
        this.prevMaxYearColor !== this.maxYearColor)
      {
        this.setState ({ updateFilter: true }); // cause render of filter
      }

      this.prevMinYearColor = this.minYearColor;
      this.prevMaxYearColor = this.maxYearColor;
      this.prevMinMode = minMode;
      this.prevMaxMode = maxMode;

      console.log("onFilterChg - 2 minMode=", minMode, ", prevMinMode=",
        this.prevMinMode, ", maxMode=", maxMode,
        ", prevMaxMode=", this.prevMaxMode);

      console.log("onFilterChg - 3 minYearColor=", this.minYearColor, ", prevMinYearColor=",
        this.prevMinYearColor, ", maxYearColor=", this.maxYearColor,
        ", prevMaxYearColor=", this.prevMaxYearColor);
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
    if (okToFilter)
    {
      console.log("onFilterChg - Ok to filter is true");
      this.setState((prevState, currentProps) => {
          return { ...prevState, fakeDataFiltered: [...this.fakeData.filter(this.filterTheData)],
            updateFilter: false };
      });
    }
  }

  // Make this function pure and never update state here.
  render() {
    console.log("MapPage ------ rendering filter and map, minYearColor=", this.minYearColor);
    return (
      <div>
        <Filter
          {...this.props}
          onFilterChange={this.onFilterChange}
          minYearColor={this.minYearColor}
          maxYearColor={this.maxYearColor}
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
