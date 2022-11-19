import React from 'react';
import L from "leaflet";
import 'leaflet.markercluster';
import '../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css';
// // import "leaflet-dvf";
// import { vectorBasemapLayer } from "esri-leaflet-vector"; // old: , tiledMapLayer, basemapLayer
import { MapContainer, TileLayer } from "react-leaflet"; // old: , TileLayer
import "../../node_modules/leaflet/dist/leaflet.css";
import "./leaflet-control-geosearch.css";
import "./MapPage.css";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
// import token from "../secrets.json";

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
  ],
  // version: 8,
};
// config.tileLayer = {
//   params: {
//     id: "",
//     accessToken: token.MAP_ACCESS_TOKEN, // old, check later if we can eliminate this
//     apiKey: token.MAP_ACCESS_TOKEN,
//     // basemapEnum: "ArcGIS:Navigation", // added, see https://www.esri.com/arcgis-blog/products/developers/developers/open-source-developers-time-to-upgrade-to-the-new-arcgis-basemap-layer-service/#leaflet
//     noWrap: false,
//     continuousWorld: false,
//     bounds: [[-90, -180], [90, 180]], // keep from duplicating world map
//     // version: 8,
//     // sources: {},
//     // layers: {},
//   }
// };


export default class MapComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    console.log("mapComp - CTOR - props=", props);

    // See if we got passed a search string. If we did, set the zoom to 9.
    config.params.zoom = props.searchTerm ? 9 : config.params.zoom;

    this.state = {
      currentZoomLevel: config.params.zoom,
      map: null,
      visible: false, // this is from some old code that I copied that deals w/ markers; inside zoomend fn
      baseMap: null,  // this is the 'streets' layer that gets added to the map
      coordsUpdated: false, // set to true once coords are updated
      initialized: false,
    };
    this.currentLat = config.params.center[0];
    this.currentLng = config.params.center[1];
    this.state.mapIsValid = false;
    this.markers = [];
    this.markerCluster = null;
    this.provider = new OpenStreetMapProvider();
    this.searchControl = new GeoSearchControl({
      provider: this.provider,
      style: 'button',
      showMarker: false,
      zoomLevel: 9,
    });

    // from some example:
    this.smallIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
        iconSize:    [25, 41],
        iconAnchor:  [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        shadowSize:  [41, 41]
    });
  }


/*
Flickr url has the form:
https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
like: "https://farm2.staticflickr.com/1833/44104167362_d80021358b_m.jpg",
where you have to get the various fields from a previous search (and its
returned json). {secret} is your api key; mstzb are letters you can
provide for sizing control (m=small, 240px on longest side).
What I did: used the python script I created called getFlickrUrls.py to create
a json file of urls, then used viewPix.py to view download each file,
then manually looked at each file to see if it was a usable good picture.
If it was, I kept it in the json file, otherwise I deleted it. I built up
a few hundred good URLs this way and saved them to houseImages.json.
*/

  componentDidUpdate = async () => {
      if (!this.state.map) {
        return;
      }
      console.log("mapComp - CDU - props=", this.props);

      this.updateMarkers(this.props.fakeData);

//       // Create the various layers for the map.
//       let esriNatGeo = vectorBasemapLayer("NationalGeographic", config.tileLayer.params);

//       //var esriStreets = basemapLayer("Streets", config.tileLayer.params);
//       let esriTopo = vectorBasemapLayer("Topographic", config.tileLayer.params);
//       let esriShadedRelief = vectorBasemapLayer("ShadedRelief", config.tileLayer.params);
//       let esriImagery = vectorBasemapLayer("Imagery", config.tileLayer.params);
//       let esriTerrain = vectorBasemapLayer("Terrain", config.tileLayer.params);

//       // json object for layer switcher control basemaps
//       let baseLayers = {
//         "Esri Topographic": esriTopo, //this.state.baseMap,
//         "National Geographic": esriNatGeo,
//         Streets: this.state.baseMap, //esriStreets,
//         "Shaded Relief": esriShadedRelief,
//         Imagery: esriImagery,
//         Terrain: esriTerrain
//       };

//       // add layer groups to layer switcher control
//       let controlLayers = L.control.layers(baseLayers).addTo(this.state.map);
//       controlLayers.setPosition("bottomright");

      this.state.map.addControl(this.searchControl);

      // If the user provided a search term, search for the latlng
      // of that term. Use the leaflet geocoder plugin for this.
      if (this.props.searchTerm) {
        const results = await this.provider.search({ query: this.props.searchTerm });
        console.log("MapComp - IF (top) - results=", results, this.props.searchTerm);
        if (results.length > 0) {
          this.currentLat = results[0].y;
          this.currentLng = results[0].x;
          // this is 1st render, plus user wants to search, so zoom
          this.setState ({ coordsUpdated : true, currentZoomLevel: 9},
            () => { console.log("MapComp - (post setState) After setting zoom to 9")});
        }
        else {
          // Get the user's current coords from the browser; the browser will ask
          // the user for permission. Assume the user is not moving and so we only
          // have to do this once when the map is initialized.
          // Getting the user coords is asynchronous, so it will return later
          // and set a state variable.
          await navigator.geolocation.getCurrentPosition((location) => {
            this.currentLat = location.coords.latitude;
            this.currentLng = location.coords.longitude;
            this.setState ({ coordsUpdated : true, currentZoomLevel: 9});
            console.log("MapComp - IF inside getCurrentPos - just set zoom=9");
          });
        }
        console.log("MapComp - IF - should have set zoom=9");
      } else {
        this.currentLat = config.params.center[0];
        this.currentLng = config.params.center[1];
        this.setState({currentZoomLevel: config.params.zoom});
        console.log("MapComp - ELSE - should have set zoom=", config.params.zoom)
      }
      if (this.state.map) {
        this.state.map.panTo([this.currentLat, this.currentLng],
          { animate: false, duration: 0 });
      }
  };

  updateMarkers = (fakeData) =>
  {
    if (this.markerCluster) {
      this.state.map.removeLayer (this.markerCluster);
      this.markercluster = null;
    }

    this.markerCluster = L.markerClusterGroup(); // create the cluster group (now empty)

    // Add markers to an array:
    const markerArray = [];
    for (const data of fakeData)
    {
      const zipStr = (data.zip < 10000 ? '0' + data.zip.toString() : data.zip.toString());
      const bedsText = data.beds > 1 ? ' beds, ' : ' bed, ';
      const bathsText = data.baths > 1 ? ' baths, ' : ' bath, ';
      const price = (this.props.bsr === 'buy' ?
        Math.floor(75 + Math.random() * 906) * 1000.0 : // 75k to 980k, buyer prices
        Math.floor(250 + Math.random() * 4251));        // 250 to 4500, renter prices
      const priceExtra = this.props.bsr === 'buy' ? '</b><br/>' : '</b> per month<br/>'
      // Added width styling to force img to 280px wide max, because the default
      // popup width is 300. This seemed to make all the images fit well, even
      // altering the height to make it fit right.
      const popup = '<img style="width:280px" src=' + data.image + '/>' +
       '<br/><b>$ ' + price + priceExtra +
        data.beds + bedsText + data.baths + bathsText +
        data.sqft + ' sq. ft., built ' + data.yearBuilt + '<br/>' +
        data.streetAddr + ', ' + data.city + ', ' + data.state +
        ' ' + zipStr + '<br/>Agent: ' + data.name;
      markerArray.push (L.marker([data.lat, data.lng],
        { icon: this.smallIcon }).bindPopup(popup));
    }
    this.markerCluster.addLayers(markerArray);
    this.state.map.addLayer (this.markerCluster);
  };

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

//   async init(id) {
//     console.log("map - init - map=", this.state.map, " id=", id);

//     if (!this.state.map || this.state.initialized) return;

//     // this function creates the Leaflet map object and is called after the Map component mounts
//     const leafletMap = this.state.map; // id.leafletElement;
//     console.log("map - init - id=", id, " initialized=", this.state.initialized);

//     // set our state to include the tile layer.
//     // DON'T USE this.state.map BELOW; WON'T WORK! (set state is async)
//     // this.setState({ map: id.leafletElement }, () => {
//     //   this.state.mapIsValid = true;
//     // });
//     console.log("Map - init - about to call BasemapLayer, leafletMap=", leafletMap);

//     const obj = vectorBasemapLayer("Streets", config.tileLayer.params);
//     console.log("Map - init - obj=", obj);
//     const res = obj.addTo(leafletMap);
//     console.log("Map - init - res=", res);
//     this.setState({baseMap: res});
//     // a TileLayer is used as the "basemap"
//     //this.state.baseMap = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(this.state.map);
//     // this.setState({
//     //   baseMap: BasemapLayer("Streets", config.tileLayer.params).addTo(
//     //     leafletMap
//     //   )
//     // });
//     console.log("Map - init - after setState for baseMap");

//     leafletMap.fitBounds(config.params.imageBounds);
//     console.log("Map - init - after fitBounds");
//     leafletMap.on("zoomend", e => {
//       const updatedZoomLevel = leafletMap.getZoom();
//       this.handleZoomLevelChange(updatedZoomLevel);
//     });
//     console.log("Map - init - after leafletMap.on");
//     this.setState({initialized: true});
//   }

//   handleZoomLevelChange = newZoomLevel => {
//     this.setState({ currentZoomLevel: newZoomLevel });
//   };


render() {
    if (this.state.map && this.props.fakeDataUpdated) {
      this.updateMarkers(this.props.fakeData);
    }
    config.params.center = [this.currentLat, this.currentLng];
    config.params.zoom = this.state.currentZoomLevel;
    console.log("MapComp - render - zoom =", config.params.zoom);
    if (this.state.map) {
      // this is needed when a zoom change doesn't cause the map to redraw.
      this.state.map.setView(config.params.center, config.params.zoom);
    }

    return (
      <div id="map-component">
        <MapContainer
          id="map"
          ref={m => (this.setState({map: m}))}
          center={config.params.center}
          zoom={config.params.zoom}
          maxZoom={config.params.maxZoom}
          minZoom={config.params.minZoom}
          style={{ borderRadius: '6px'}}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    );
  }
}
