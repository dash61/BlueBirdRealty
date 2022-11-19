import React, { useState, useEffect, useContext } from "react";
import { Container } from 'semantic-ui-react';
import MapComponent from '../Components/MapComponent';
import Filter from '../Components/Filter';
import { FakeDataContext } from '../index';

// import { faker } from '@faker-js/faker';
// import _ from 'lodash';
// import zipCodeData from './mapData.json';
// import houseImages from './houseImages.json'; // an array of url strings
import { YEARMIN, YEARMAX, SQFTMIN, SQFTMAX } from '../Components/Constants';
import { useLocation } from 'react-router-dom';

// let fakeData = {};
let priceMin = 0;
let bedsMin = 0;
let bathsMin = 0;
let yearMin = YEARMIN; // altered value typed in; could be replaced w/ YEARMIN
let yearMax = YEARMAX; // ditto-ish
let minYearColor = 'red';
let maxYearColor = 'red';
let prevMinYearColor = 'red';
let prevMaxYearColor = 'red';
let prevYearMinMode = 0;
let prevYearMaxMode = 0;
let sqftMin = SQFTMIN;
let sqftMax = SQFTMAX;
let minSqftColor = 'red';
let maxSqftColor = 'red';
let prevMinSqftColor = 'red';
let prevMaxSqftColor = 'red';
let prevSqftMinMode = 0;
let prevSqftMaxMode = 0;
let okToFilter = false;


function MapPage (props) {
  const [fakeDataFiltered, setFakeDataFiltered] = useState([]);
  const [, setUpdateFilter] = useState(false);
  const [bsr, setBsr] = useState("buy");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const value = useContext(FakeDataContext);

  // bsr = location?.state?.bsr;
  // searchTerm = location?.state?.searchTerm;
  console.log("mapPage fn - open - location=", location, " bsr=", bsr);

  useEffect(() => {
    if (value && value.length) {
      setFakeDataFiltered(value);
    }

  }, [value]);

  useEffect(() => {
    // Sometimes the location.state is not set if we get here via an odd path.
    // In that case, look at location.pathname, which will be /map1 or /map2.
    if (location?.state?.bsr) {
      setBsr(location.state.bsr);
    } else {
      setBsr(location?.pathname === "/map1" ? "buy" : "rent");
    }
    okToFilter = true;
    setSearchTerm(location?.state?.searchTerm);
    console.log("MapPage - useEffect (location) - searchTerm=", location?.state?.searchTerm);
  }, [location]);


  // // Given a latitude or longitude value, randomize it so that it is close
  // // to the given value, but randomly a small distance away. Ideally, it
  // // remains in the same zip code, or very close to it.
  // const randomize = (value) => {
  //   return value + ((Math.random() - 0.5) * 0.05);
  // }

  // obj will be one element of the fakeData array.
  // Price will be a float, as will sqft, beds, baths.
  // filterObj will be obj={"price":"$500/month+"}. /^\$[0-9]/$/
  // or will be obj={"price":"$100,000+"}. /^\$[0-9,]\+$/
  // Beds will be obj={"beds":"1+ Beds"}.
  // Baths will be obj={"baths":"1+ Baths"}.
  // Type we will ignore.
  // Year built - tbd
  // Sq ft - tbd
  const filterTheData = (obj) => {
    if (priceMin !== 0)
    {
      if (obj.price < priceMin)
        return false; // we can reject this house right away
    }
    if (bedsMin !== 0)
    {
      if (obj.beds < bedsMin)
        return false;
    }
    if (bathsMin !== 0)
    {
      if (obj.baths < bathsMin)
        return false;
    }
    if (obj.yearBuilt < yearMin || obj.yearBuilt > yearMax)
      return false;

    if (obj.sqft < sqftMin || obj.sqft > sqftMax)
      return false;
    return true;
  }

  const parseFloatIgnoreCommas = (number) => {
    let numberNoCommas = number.replace(/,/g, '');
    return parseFloat(numberNoCommas);
  }

  const onFilterChange = async (obj) => {
    // filterObj = obj;
    okToFilter = false;
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
          if (bsr === 'buy') { // obj={"price":"$500,000"}
            priceMin = obj[key].match(/[0-9,]+/);
          }
          else {  // obj={"price":"$500/month+"}
            priceMin = obj[key].match(/[0-9]+/);
          }
          if (priceMin == null)
            priceMin = 0;
          else
            // priceMin will be an array of stuff, we need [0].
            priceMin = parseFloatIgnoreCommas(priceMin[0]);
          break;

        // If the user picks 'Any', the 1st char will be 'A'.
        // If the user clear the filter, the 1st char will be 'B'.
        case 'beds':
          bedsMin = obj[key].charAt(0);  // obj={"beds":"1+ Beds"}
          if (bedsMin === 'A' || bedsMin === 'B')
            bedsMin = 0;
          else
            bedsMin = parseInt(bedsMin);
          break;

        // ditto from the beds comment.
        case 'baths':
          bathsMin = obj[key].charAt(0);  // obj={"baths":"1+ Baths"}
          if (bathsMin === 'A' || bathsMin === 'B')
            bathsMin = 0;
            else
              bathsMin = parseInt(bathsMin);
          break;

        case 'yearMin':
          yearMin = parseInt(obj[key]);
          checkYear = true;
          savedKey = key; // key track of which item user was just editing
          break;

        case 'yearMax':
          yearMax = parseInt(obj[key]);
          checkYear = true;
          savedKey = key; // key track of which item user was just editing
          break;

        case 'sqftMin':
          sqftMin = parseInt(obj[key]);
          checkSqft = true;
          savedKey = key; // key track of which item user was just editing
          break;

        case 'sqftMax':
          sqftMax = parseInt(obj[key]);
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
      let newYearMinValid = (yearMin >= YEARMIN && yearMin <= YEARMAX);
      let newYearMaxValid = (yearMax >= YEARMIN && yearMax <= YEARMAX);

      if (savedKey === 'yearMin')
      {
        maxYearMode = prevYearMaxMode;
        if (yearMin < 1000)
        {
          if (prevYearMinMode === 4)
          {
            //yearMinReal = yearMin;
            yearMin = YEARMIN;
            okToFilter = true;
          }
        }
        else  // min year has 4 digits or more
        {
          if (newYearMaxValid && newYearMinValid)
          {
            if (yearMin <= yearMax)
            {
              minYearMode = 3;
              if (yearMin !== YEARMIN)
              {
                minYearMode = 4;
                okToFilter = true;
              }
            }
          }
          else if (newYearMinValid) // max is not in range
          {
            minYearMode = 3;
            if (yearMin !== YEARMIN)
            {
              minYearMode = 4;
              okToFilter = true;
            }
          }
        }
      }
      else if (savedKey === 'yearMax')
      {
        minYearMode = prevYearMinMode;
        if (yearMax < 1000)
        {
          if (prevYearMaxMode === 4)
          {
            //yearMaxReal = yearMax;
            yearMax = YEARMAX;
            okToFilter = true;
          }
        }
        else
        {
          if (newYearMinValid && newYearMaxValid)
          {
            if (yearMin <= yearMax)
            {
              maxYearMode = 3;
              if (yearMax !== YEARMAX)
              {
                maxYearMode = 4;
                okToFilter = true;
              }
            }
          }
          else if (newYearMaxValid) // min is not in range
          {
            maxYearMode = 3;
            if (yearMax !== YEARMAX)
            {
              maxYearMode = 4;
              okToFilter = true;
            }
          }
        }
      }

      minYearColor = 'red';
      if (minYearMode >= 3)
        minYearColor = 'black';

      maxYearColor = 'red';
      if (maxYearMode >= 3)
        maxYearColor = 'black';

      if (prevMinYearColor !== minYearColor ||
          prevMaxYearColor !== maxYearColor)
      {
        setUpdateFilter(true);
      }

      prevMinYearColor = minYearColor;
      prevMaxYearColor = maxYearColor;
      prevYearMinMode = minYearMode;
      prevYearMaxMode = maxYearMode;
    }
    else if (checkSqft)
    {
      let newSqftMinValid = (sqftMin >= SQFTMIN && sqftMin <= SQFTMAX);
      let newSqftMaxValid = (sqftMax >= SQFTMIN && sqftMax <= SQFTMAX);

      if (savedKey === 'sqftMin')
      {
        maxSqftMode = prevSqftMaxMode;
        if (sqftMin < 1000)
        {
          if (prevSqftMinMode === 4)
          {
            sqftMin = SQFTMIN;
            okToFilter = true;
          }
        }
        else  // min sqft has 4 digits or more
        {
          if (newSqftMaxValid && newSqftMinValid)
          {
            if (sqftMin <= sqftMax)
            {
              minSqftMode = 3;
              if (sqftMin !== SQFTMIN)
              {
                minSqftMode = 4;
                okToFilter = true;
              }
            }
          }
          else if (newSqftMinValid) // max is not in range
          {
            minSqftMode = 3;
            if (sqftMin !== SQFTMIN)
            {
              minSqftMode = 4;
              okToFilter = true;
            }
          }
        }
      }
      else if (savedKey === 'sqftMax')
      {
        minSqftMode = prevSqftMinMode;
        if (sqftMax < 1000)
        {
          if (prevSqftMaxMode === 4)
          {
            sqftMax = SQFTMAX;
            okToFilter = true;
          }
        }
        else
        {
          if (newSqftMinValid && newSqftMaxValid)
          {
            if (sqftMin <= sqftMax)
            {
              maxSqftMode = 3;
              if (sqftMax !== SQFTMAX)
              {
                maxSqftMode = 4;
                okToFilter = true;
              }
            }
          }
          else if (newSqftMaxValid) // min is not in range
          {
            maxSqftMode = 3;
            if (sqftMax !== SQFTMAX)
            {
              maxSqftMode = 4;
              okToFilter = true;
            }
          }
        }
      }

      minSqftColor = 'red';
      if (minSqftMode >= 3)
        minSqftColor = 'black';

      maxSqftColor = 'red';
      if (maxSqftMode >= 3)
        maxSqftColor = 'black';

      if (prevMinSqftColor !== minSqftColor ||
          prevMaxSqftColor !== maxSqftColor)
      {
        setUpdateFilter(true);
      }

      prevMinSqftColor = minSqftColor;
      prevMaxSqftColor = maxSqftColor;
      prevSqftMinMode = minSqftMode;
      prevSqftMaxMode = maxSqftMode;
    }
    else {
      okToFilter = true; // for non-year and non-sqft situations
    }

    if (okToFilter)
    {
      setFakeDataFiltered([...props.fakeData.filter(filterTheData)]);
      setUpdateFilter(false);
    }
  }

  return (
    <div>
      <Filter
        {...props}
        onFilterChange={onFilterChange}
        minYearColor={minYearColor}
        maxYearColor={maxYearColor}
        minSqftColor={minSqftColor}
        maxSqftColor={maxSqftColor}
        bsr={bsr}
      />
      <Container style={{ width: '95%', marginBottom: '24px'}}>
        <MapComponent
          {...props}
          fakeData={fakeDataFiltered}
          fakeDataUpdated={okToFilter}
          bsr={bsr}
          searchTerm={searchTerm}
        />
      </Container>
    </div>
  )
}
// MapPage.contextType = FakeDataContext;
export default MapPage;
