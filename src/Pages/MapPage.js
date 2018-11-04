import React from "react";
import MapComponent from '../Components/MapComponent';
import Filter from '../Components/Filter';
import faker from 'faker';
import _ from 'lodash';
import zipCodeData from './mapData.json';
import houseImages from './houseImages.json'; // an array of url strings


class MapPage extends React.Component {
  constructor(props) {
    super(props);
    console.log("MapPage - props=", props); // loadLayerData is passed; call this to update the store (during init, and later)
    this.fakeData = {};
    this.priceMin = 0;
    this.bedsMin = 0;
    this.bathsMin = 0;
    this.yearMin = 1935;
    this.yearMax = 2018;
    this.sqftMin = 1000;
    this.sqftMax = 4000;
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
        sqft: Math.floor(1000 + Math.random() * 4001), // 1000 min, 4000 max
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
        yearBuilt: Math.floor(1935 + Math.random() * 84) // 1935 min, 2018 max
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
    for (const key of Object.keys(obj)) {
      //console.log("onFilterChange - key = " + key + ", value = " + obj[key].toString());
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

        default:
          console.log("onFilterChange - default, key=" + key);
      }
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
    this.setState((prevState, currentProps) => {
        return { ...prevState, fakeDataFiltered: [...this.fakeData.filter(this.filterTheData)] };
    });

    // this.setState(prevState => ({
    //   fakeDataFiltered: [...this.fakeData.filter(this.filterTheData)]
    // }));

    //this.fakeDataFiltered = this.fakeData.filter(this.filterTheData);
  }

  // Make this function pure and never update state here.
  render() {
    if (this.state.fakeDataFiltered.length > 0) // if we have data to show
    {
      //console.log("MapPage - rendering filter and map");
      return (
        <div>
          <Filter {...this.props} onFilterChange={this.onFilterChange} />
          <MapComponent
            {...this.props}
            fakeData={this.state.fakeDataFiltered}
            fakeDataUpdated={true}/>
        </div>
      );
    }
  }
}

export default MapPage;
