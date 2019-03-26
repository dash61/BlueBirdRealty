import React from 'react';
import L from "leaflet";
import 'leaflet.markercluster';
import '../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css';
import "leaflet-dvf";
import { basemapLayer } from "esri-leaflet"; // old: , tiledMapLayer
import { Map } from "react-leaflet"; // old: , TileLayer
import "../../node_modules/leaflet/dist/leaflet.css";
import "./leaflet-control-geosearch.css";
import "./MapPage.css";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

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
  params: {
    id: "",
    accessToken: process.env.REACT_APP_MAP_ACCESS_TOKEN,
    noWrap: false,
    continuousWorld: false,
    bounds: [[-90, -180], [90, 180]] // keep from duplicating world map
  }
};


export default class MapComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.searchTerm = ''; // default
    this.bsr = 'buy';     // default

    // Do this first, to see if we got passed a search string.
    // If we did, set the zoom to 9.
    if (props.location && props.location.state && props.location.state.searchTerm)
    {
      this.searchTerm = props.location.state.searchTerm;
      config.params.zoom = 9;
    }
    if (props.location && props.location.state && props.location.state.bsr)
    {
      this.bsr = props.location.state.bsr;
    }

    this.state = {
      currentZoomLevel: config.params.zoom,
      map: null,
      visible: false, // this is from some old code that I copied that deals w/ markers; inside zoomend fn
      baseMap: null,  // this is the 'streets' layer that gets added to the map
      coordsUpdated: false, // set to true once coords are updated
    };
    this.currentLat = config.params.center[0];
    this.currentLong = config.params.center[1];
    //this.currentZoom = config.params.zoom;
    this._mapNode = null;
    this.mapIsValid = false;
    this.markers = [];
    this.markerCluster = null;
    this.provider = new OpenStreetMapProvider();
    this.searchControl = new GeoSearchControl({
      provider: this.provider,
      style: 'button',
      showMarker: false,
      retainZoomLevel: true,
    });
    // from another example:
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


  // Use this method for async state updates and render triggering, but be
  // careful not to get in an infinite loop; only update if a change occurred.
  componentDidMount = async () => {
    // code to run just after the component "mounts" / DOM elements are created

    // create the Leaflet map object
    if (!this.state.map)
    {
      await this.init(this._mapNode);

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

      this.updateMarkers(this.props.fakeData);

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

      this._mapNode.leafletElement.addControl(this.searchControl);

      // If the user provided a search term, search for the latlng
      // of that term. Use the leaflet geocoder plugin for this.
      if (this.searchTerm) {
        const results = await this.provider.search({ query: this.searchTerm });
        if (results.length > 0) {
          this.currentLat = results[0].y;
          this.currentLong = results[0].x;
          // this is 1st render, plus user wants to search, so zoom
          this.setState ({ coordsUpdated : true, currentZoomLevel: 9});
        }
        else {
          // Get the user's current coords from the browser; the browser will ask
          // the user for permission. Assume the user is not moving and so we only
          // have to do this once when the map is initialized.
          // Getting the user coords is asynchronous, so it will return later
          // and set a state variable.
          await navigator.geolocation.getCurrentPosition((location) => {
            this.currentLat = location.coords.latitude;
            this.currentLong = location.coords.longitude;
            //this.currentZoom = 9; //location.coords.accuracy;
            this.setState ({ coordsUpdated : true, currentZoomLevel: 9});
          });
        }
      }
      if (this._mapNode) {
        this._mapNode.leafletElement.panTo([this.currentLat, this.currentLong],
          { animate: true, duration: 1.0 });
      }
    }
  };

  updateMarkers = (fakeData) =>
  {
    if (this.markerCluster) {
      this._mapNode.leafletElement.removeLayer (this.markerCluster);
      this.markercluster = null;
    }

    this.markerCluster = L.markerClusterGroup(); // create the cluster group (now empty)

    // Add markers to an array:
    let markerArray = [];
    for (let data of fakeData)
    {
      let zipStr = (data.zip < 10000 ? '0' + data.zip.toString() :
        data.zip.toString());
      let bedsText = data.beds > 1 ? ' beds, ' : ' bed, ';
      let bathsText = data.baths > 1 ? ' baths, ' : ' bath, ';
      let priceExtra = this.bsr === 'buy' ? '</b><br/>' : '</b> per month<br/>'
      // Added width styling to force img to 280px wide max, because the default
      // popup width is 300. This seemed to make all the images fit well, even
      // altering the height to make it fit right.
      let popup = '<img style="width:280px" src=' + data.image + '/>' +
       '<br/><b>$ ' + data.price + priceExtra +
        data.beds + bedsText + data.baths + bathsText +
        data.sqft + ' sq. ft., built ' + data.yearBuilt + '<br/>' +
        data.streetAddr + ', ' + data.city + ', ' + data.state +
        ' ' + zipStr + '<br/>Agent: ' + data.name;
      markerArray.push (L.marker([data.lat, data.lng],
        { icon: this.smallIcon }).bindPopup(popup));
    }
    this.markerCluster.addLayers(markerArray);
    this._mapNode.leafletElement.addLayer (this.markerCluster);
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
    });
  }

  handleZoomLevelChange = newZoomLevel => {
    this.setState({ currentZoomLevel: newZoomLevel });
  };

  // Make this function pure and never update state here.
  render() {
    if (this._mapNode && this.props.fakeDataUpdated)
    {
      this.updateMarkers(this.props.fakeData);
    }
    config.params.center = [this.currentLat, this.currentLong];
    config.params.zoom = this.state.currentZoomLevel;

    return (
      <div id="map-component">
        <Map
          ref={m => (this._mapNode = m)} // leaflet needs the node
          center={config.params.center}
          zoom={config.params.zoom}
          maxZoom={config.params.maxZoom}
          minZoom={config.params.minZoom}
          style={{ borderRadius: '6px'}}
        />
      </div>
    );
  }
}
