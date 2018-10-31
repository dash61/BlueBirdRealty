import React from "react";
import L from "leaflet";
import 'leaflet.markercluster';
import '../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css';
// <!-- <link rel="stylesheet" href="./MarkerCluster.css" />
// <link rel="stylesheet" href="./MarkerCluster.Default.css" />

import "leaflet-dvf";
import { basemapLayer } from "esri-leaflet"; // old: , tiledMapLayer
import { Map } from "react-leaflet"; // old: , TileLayer
import "../../node_modules/leaflet/dist/leaflet.css";
import "./MapPage.css";
import faker from 'faker';
import _ from 'lodash';
import zipCodeData from './mapData.json';
import houseImages from './houseImages.json'; // an array of url strings
//import $ from 'jquery';



// for large json data files, do: var data = JSON.parse(json_data);

// store the map configuration properties in an object,
// we could also move this to a separate file & import it if desired.
let config = {};
config.params = {
  center: [40.0, -100.0],
  zoom: 4,
  maxZoom: 20,
  minZoom: 2,
  imageBounds: [
    [48.1, -126.144], // latlng fmt
    [24.3, -69.35]
  ]
};
config.tileLayer = {
  //uri: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  //uri: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  params: {
    //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    id: "",
    accessToken: process.env.REACT_APP_MAP_ACCESS_TOKEN,
    noWrap: false,
    continuousWorld: false,
    bounds: [[-90, -180], [90, 180]] // keep from duplicating world map
  }
};




class MapPage extends React.Component {
  constructor(props) {
    super(props);
    console.log("MyMap - props=", props); // loadLayerData is passed; call this to update the store (during init, and later)
    //const { ?, ?, ? } = props; // why is mapData not used?
    this._mapNode = null;
    this.markers = [];
    //this.geoData = [];
    this.state = {
      currentZoomLevel: config.params.zoom,
      map: null,
      //ourLayerGroup: null,
      //layerData: null,
      visible: false, // this is from some old code that I copied that deals w/ markers; inside zoomend fn
      baseMap: null,  // this is the 'streets' layer that gets added to the map
      coordsUpdated: false, // set to true once coords are updated
    };
    this.currentLat = 40.0;
    this.currentLong = -100;
    this.currentZoom = 20;
    this.mapIsValid = false;
    this.fakeData = {};
  }


  // Don't call setState in here. The component is going away.
  componentWillUnmount = () => {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
    //this.state.map.remove();
  };

  // In React 17+, this method will be deprecated.
  // It is ok to call setState here if it involves a synchronous state
  // update. It is *NOT* ok to call setState here for async updates (use
  // componentDidMount for that). See comment before
  // componentWillReceiveProps for more info.
  componentWillMount = () => {
    console.log("cwm - entered");
    console.log(this.currentLat);
    console.log(this.currentLong);
    console.log(this.currentZoom);
    console.log("cwm - exited");
  }


  // Use this method for async state updates and render triggering, but be
  // careful not to get in an infinite loop; only update if a change occurred.
  componentDidMount = async () => {
    // code to run just after the component "mounts" / DOM elements are created
    console.log("cdm - entered");

    // create the Leaflet map object
    if (!this.state.map)
    {
      await this.init(this._mapNode);

      // from another example:
      let smallIcon = new L.Icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
          iconSize:    [25, 41],
          iconAnchor:  [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          shadowSize:  [41, 41]
      });

      let markerCluster = L.markerClusterGroup(); // create the cluster group (now empty)

      // Add markers to an array:
      let markerArray = [];
      for (let data of this.fakeData)
      {
        let bedsText = data.beds > 1 ? ' beds, ' : ' bed, ';
        let bathsText = data.baths > 1 ? ' baths, ' : ' bath, ';
        //console.log (data);
        // Added width styling to force img to 280px wide max, because the default
        // popup width is 300. This seemed to make all the images fit well, even
        // altering the height to make it fit right.
        let popup = '<img style="width:280px" src=' + data.image + '/>' +
         '<br/><b>$ ' + data.price + '</b><br/>' +
          data.beds + bedsText + data.baths + bathsText +
          data.sqft + ' sq. ft.<br/>' +
          data.streetAddr + ', ' + data.city + ', ' + data.state +
          ' ' + data.zip + '<br/>Agent: ' + data.name;
        markerArray.push (L.marker([data.lat, data.lng],
          { icon: smallIcon }).bindPopup(popup));
      }
      markerCluster.addLayers(markerArray);
      this._mapNode.leafletElement.addLayer (markerCluster);


/* You need this in the popup text: '<img src="' + the_url + '" />'
 Just need to figure out the_url, which might be a 2 step process.
 Step 1 might be:
  https://api.flickr.com/services/feeds/photos_public.gne?api_key={key here}&tags=house&format=json&per_page=1&safe_search=1&content_type=1
 Docs say you have to provide your api key; also specify per_page=1 or some small
 number.

Flickr url has the form:
https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
where you have to get the various fields from a previous search (and its
returned json). {secret} is your api key (not secret?); mstzb are letters you can
provide for sizing control (m=small, 240px on longest side). Experiment with these.
*/
      // Add handler for clicking a particular marker
      markerCluster.on('mouseover', async function (a) {
      	console.log(a.layer._popup._content);
        //a.layer._popup._content = "hi there!";
        //a.bindPopup(popup);
      });

      console.log("cdm - about to pan to current lat/long");
      this._mapNode.leafletElement.panTo([this.currentLat, this.currentLong],
        { animate: true, duration: 1.0 });

      // Create the various layers for the map.
      let esriNatGeo = basemapLayer(
        "NationalGeographic",
        config.tileLayer.params
      );
      //var esriStreets = basemapLayer("Streets", config.tileLayer.params);
      let esriTopo = basemapLayer("Topographic", config.tileLayer.params);
      let esriShadedRelief = basemapLayer(
        "ShadedRelief",
        config.tileLayer.params
      );
      let esriImagery = basemapLayer("Imagery", config.tileLayer.params);
      let esriTerrain = basemapLayer("Terrain", config.tileLayer.params);

      // json object for layer switcher control basemaps
      let baseLayers = {
        "Esri Topographic": esriTopo, //this.state.baseMap,
        "National Geographic": esriNatGeo,
        Streets: this.state.baseMap, //esriStreets,
        "Shaded Relief": esriShadedRelief,
        Imagery: esriImagery,
        Terrain: esriTerrain
      };

      // add layer groups to layer switcher control
      let controlLayers = L.control.layers(baseLayers).addTo(this._mapNode.leafletElement);
      controlLayers.setPosition("bottomright");

    }
    console.log("cdm - exit");
  };

  // From: https://medium.com/@nimelrian/as-of-react-16-you-should-use-componentwillreceiveprops-only-to-update-state-synchronously-as-in-a9d66457c510
  // As of React 16, you should use componentWillReceiveProps only to update
  // state synchronously (as in: Don’t dispatch requests/set timeouts here!).
  // With Fiber, the componentWill* methods may be called multiple times before
  // the lifecycle advances. Use componentDidUpdate if you want to update state
  // asynchronously when props change!
  componentWillReceiveProps = nextprops => {
    console.log("CWRP - props=", nextprops);
  };

  // shouldComponentUpdate - don't update state in this function.
  // componentWillUpdate - ditto.

  // Ok to call setState here, but first check that a state change occurred
  // or you will get an infinite loop. Check that prevState.xxxx != valueNow
  // before calling setState.
  componentDidUpdate (prevProps, prevState) {
    // code to run when the component receives new props or state
    console.log ("cdu - enter, this.mapIsValid=" + this.mapIsValid.toString());
    //console.log (prevProps);
    console.log (prevState);
    console.log (this.state);

    // This prevents recreating the layers (and control in lower right)
    // each time we navigate to the maps page.
    if (prevState.map != null || this.mapIsValid) return;
    console.log ("cdu - PAST BARRIER");

  }

  // This needs node.js fs.readFile.
  // readJSONFile(filename) {
  //   return new Promise((resolve, reject) => {
  //     fs.readFile(filename, 'utf-8', (err, data) => {
  //       if (err) reject(err);
  //       resolve(JSON.parse(data));
  //     });
  //   });
  // }

  // Given a latitude or longitude value, randomize it so that it is close
  // to the given value, but randomly a small distance away. Ideally, it
  // remains in the same zip code, or very close to it.
  randomize (value) {
    return value + ((Math.random() - 0.5) * 0.05);
  }

  // From leaflet docs: "There are two types of layers: (1) base layers that are mutually exclusive
  // (only one can be visible on your map at a time), e.g. tile layers, and (2) overlays, which are
  // all the other stuff you put over the base layers."
  // (Overlays can get more geom or can be markers, tooltips, etc.)

  // Create a L.layerGroup, then add all overlays you want visible to that group (.addLayer).
  // Remove them via removeLayer.

  // - Use map.removeLayer(layerptr); to remove a layer.
  // - L.control.layers adds a control to the map so you can switch on/off layers manually:
  //   Could also create a control layers group and use that to control on/off of layers:
  //   var controlLayers = L.control.layers().addTo(map);
  //   var geojsonLayer = L.geoJson(geojson, ...).addTo(map); // don't add to map if don't want to show initially, just create
  //   controlLayers.addOverlay(geojsonLayer, 'name of it');
  async init(id) {
    if (this.state.map) return;

    console.log("init - entered");

    // console.log('Current window pathname: ' + window.location.pathname);
    // console.log('Current doc pathname: ' + document.location.pathname);
    // console.log('Current directory: ' + process.cwd());
    // console.log('public url: ', process.env.REACT_APP_PUBLIC_URL);

    // Get the user's current coords from the browser; the browser will ask
    // the user for permission. Assume the user is not moving and so we only
    // have to do this once when the map is initialized.
    // Getting the user coords is asynchronous, so it will return later
    // and set a state variable.
    await navigator.geolocation.getCurrentPosition((location) => {
      this.currentLat = location.coords.latitude;
      this.currentLong = location.coords.longitude;
      this.currentZoom = 8;//location.coords.accuracy;
      this.setState ({ coordsUpdated : true});
    });

    // this function creates the Leaflet map object and is called after the Map component mounts
    const leafletMap = id.leafletElement;

    // set our state to include the tile layer.
    // DON'T USE this.state.map BELOW; WON'T WORK! (set state is async)
    this.setState({ map: id.leafletElement }, () => {
      this.mapIsValid = true;
    });

    // a TileLayer is used as the "basemap"
    //this.state.baseMap = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(this.state.map);
    this.setState({
      baseMap: basemapLayer("Streets", config.tileLayer.params).addTo(
        leafletMap
      )
    });

    leafletMap.fitBounds(config.params.imageBounds);
    leafletMap.on("zoomend", e => {
      const updatedZoomLevel = leafletMap.getZoom();
      this.handleZoomLevelChange(updatedZoomLevel);
      //console.log("new zoom is ", updatedZoomLevel, ", local state=", this.state);
      //console.log("new zoom is ", updatedZoomLevel, ", store state=", this.props.mapData);
      if (updatedZoomLevel > 5) {
        if (!this.state.visible) {
          for (let i = 0; i < this.markers.length; i++) {
            //this.markers[i].showLabel();
          }
          this.setState({ visible: true });
        }
      } else {
        if (this.state.visible) {
          for (let i = 0; i < this.markers.length; i++) {
            //this.markers[i].hideLabel();
          }
          this.setState({ visible: false });
        }
      }
    });

    console.log("init - generating fake data");
    //let zipCodeData = await this.readJSONFile ('./mapData.json');
    //console.log(zipCodeData);
    // zipCodeData has 5000 lines of json data organized like:
    // {[ { "zip": 0, "city": "xxx", "state": "xxx", "abbr": "zz", "lat": 0, "lng": 0 },
    //    { "zip": 0, "city": "xxx", "state": "xxx", "abbr": "zz", "lat": 0, "lng": 0 },
    //    ...
    // ]}
    this.fakeData = _.times(5000, (i) => {
        return ({
          name: faker.name.firstName() + ' ' + faker.name.lastName(),
          zip: zipCodeData['items'][i]['zip'],
          streetAddr: faker.address.streetAddress(),
          sqft: Math.floor(1000 + Math.random() * 3000), // 1000 min, 4000 max
          beds: Math.floor(1 + Math.random() * 4), // 1 min, 5 max
          baths: Math.floor(1 + Math.random() * 3), // 1 min, 4 max
          price: Math.floor(75 + Math.random() * 905) * 1000.0, // 75k to 980k
          lat: this.randomize(zipCodeData['items'][i]['lat']),
          lng: this.randomize(zipCodeData['items'][i]['lng']),
          city: zipCodeData['items'][i]['city'],
          state: zipCodeData['items'][i]['abbr'],
          image: houseImages['items'][Math.floor(1 + Math.random() * 280)]
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

    // I DON'T NEED TO DO THIS BLOCK ANY MORE SINCE I NOW HAVE A JSON FILE
    // WITH ZIP CODES, LAT/LONG DATA, AND OTHER STUFF. BEFORE, I HAD A
    // RANDOMLY GENERATED ZIP CODE AND USED THE CODE BELOW TO LOOK UP LAT/LONG,
    // BUT THE ZIP CODE WAS SOMETIMES INVALID (IT WAS REALLY JUST A RANDOM
    // 5 DIGIT NUMBER), SO I HAD TO DOWNLOAD ALL VALID ZIP CODES, MASSAGE THAT
    // THROUGH A PYTHON SCRIPT AND GENERATE A JSON FILE WITH 5000 RANDOM
    // ZIP CODES AND CITIES.
     // fetch data for each array element using lodash
     // _.forIn (temp_fakeData, async function (value, key) {
     //   console.log("Looping thru 1st fake data, value zip = " + value['zip']);
     //   let url = "http://api.geonames.org/postalCodeLookupJSON?postalcode=" +
     //     value['zip'] + "&country=US&username=dash61";
     //   let response = await fetch(url);
     //   let text = await response.text();
     //   console.log ("text from response = " + text + "where url was " + url);
     // });

    // $.each(temp_fakeData, function (i, item)
    // {
    //   (function (i, item) {
    //     console.log("Looping thru 1st fake data, zip = " + item['zip']);
    //     let url = "http://api.geonames.org/postalCodeLookupJSON?postalcode=" +
    //       item['zip'] + "&country=US&username=dash61";
    //     $.ajax({url: url, dataType: 'json', cache: false,
    //       success: function (result) { console.log(result);
    //         console.log("city is " + result.postalcodes[0]['placeName'])},
    //       error: function (err) { console.log(err); }});
    //   })(i, item);
    // });
    // state = postalcodes[0]['adminCode1']
    // city = postalcodes[0]['placeName']
    // lat = postalcodes[0]['lat']
    // long = postalcodes[0]['lng']
    /* Create an array.
    Loop thru the fakeData, create a new object in the array with: name, zip,
      address, keep my 4 random things, then ajax to geonames to convert the
      zip to: city, state, lat, long.
    */
    /*
    You can look up the correct city/state for a given zip code using:
    http://api.geonames.org/postalCodeLookupJSON?postalcode=53222&country=US&username=dash61
    (replace postalcode with the zip code you have). It returns json of the form:
    {
      "postalcodes":
      [
        {"adminCode2":"079",
         "adminCode1":"WI",
         "adminName2":"Milwaukee",
         "lng":-88.02687,
         "countryCode":"US",
         "postalcode":"53222",
         "adminName1":"Wisconsin",
         "placeName":"Milwaukee",
         "lat":43.08283}
      ]
    }
    There are rate limits for this service: 2000 per hour, 30000 per day (for my free acct).
    */
    console.log("init - exited");
  }

  handleZoomLevelChange = newZoomLevel => {
    this.setState({ currentZoomLevel: newZoomLevel });
    //console.log ("handleZoomLevelChange - layerData = ", this.state.layerData);
  };

  // Make this function pure and never update state here.
  render() {
    config.params.center = [this.currentLat, this.currentLong];
    config.params.zoom = this.currentZoom;
    console.log(config.params);

    return (
      <div id="map-component">
        <Map
          ref={m => (this._mapNode = m)} // in React, this is a 'callback ref'
          center={config.params.center}
          zoom={config.params.zoom}
          maxZoom={config.params.maxZoom}
          minZoom={config.params.minZoom}
        />
      </div>
    );
  }
}




export default MapPage;

// May need this if you want to turn on/off marker pane
// (named 'markerPane' by Leaflet by default).
  // Turn on or off an overlay layer. Pass in name string of layer and on/off boolean.
  // This will add or remove the layer from the layers group.
  // changeLayerVisibility = (layerName, isVisible) => {
  //   for (let key in this.state.layerData) {
  //     if (key === layerName) {
  //       let value = this.state.layerData[key];
  //       if (isVisible) {
  //         this.state.ourLayerGroup.addLayer(value.layerPtr);
  //         //this.state.layerData[key].visible = true;
  //         //this.setState({ layerData[key].visible: true });
  //         // return {...state,
  //         //         ...{ layerData: {...state.layerData,
  //         //         ...{ [action.layerName]: {...state.layerData[action.layerName],
  //         //         ...{ layerOn: true }}}}}}; // works
  //
  //         this.setState(prevState => ({
  //           layerData: {
  //             ...prevState.layerData,
  //             ...{
  //               [key]: {
  //                 ...prevState.layerData[key],
  //                 ...{ visible: true }
  //               }
  //             }
  //           }
  //         }));
  //       } else {
  //         this.state.ourLayerGroup.removeLayer(value.layerPtr);
  //         //this.state.layerData[key].visible = false;
  //         //this.setState({ layerData[key].visible: false });
  //         this.setState(prevState => ({
  //           layerData: {
  //             ...prevState.layerData,
  //             ...{
  //               [key]: {
  //                 ...prevState.layerData[key],
  //                 ...{ visible: false }
  //               }
  //             }
  //           }
  //         }));
  //       }
  //     }
  //   }
  // };
