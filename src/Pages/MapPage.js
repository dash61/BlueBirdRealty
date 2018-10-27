import React from "react";
import L from "leaflet";
import "leaflet-dvf";
import { basemapLayer } from "esri-leaflet"; // old: , tiledMapLayer
import { Map } from "react-leaflet"; // old: , TileLayer
import "../../node_modules/leaflet/dist/leaflet.css";
import "./MapPage.css";



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
  componentDidMount = () => {
    // code to run just after the component "mounts" / DOM elements are created
    console.log("cdm - entered");

    // create the Leaflet map object
    if (!this.state.map)
    {
      this.init(this._mapNode);
    }
    else
    {
      this.state.map.panTo([this.currentLat, this.currentLong],
        { animate: true, duration: 1.0 });
    }
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
    console.log ("cdu - enter");
    //console.log (prevProps);
    console.log (prevState);
    console.log (this.state);

    // This prevents recreating the layers (and control in lower right)
    // each time we navigate to the maps page.
    if (prevState.map || !this.mapIsValid) return;

    // Create the various layers for the map.
    var esriNatGeo = basemapLayer(
      "NationalGeographic",
      config.tileLayer.params
    );
    //var esriStreets = basemapLayer("Streets", config.tileLayer.params);
    var esriTopo = basemapLayer("Topographic", config.tileLayer.params);
    var esriShadedRelief = basemapLayer(
      "ShadedRelief",
      config.tileLayer.params
    );
    var esriImagery = basemapLayer("Imagery", config.tileLayer.params);
    var esriTerrain = basemapLayer("Terrain", config.tileLayer.params);

    // json object for layer switcher control basemaps
    var baseLayers = {
      "Esri Topographic": esriTopo, //this.state.baseMap,
      "National Geographic": esriNatGeo,
      Streets: this.state.baseMap, //esriStreets,
      "Shaded Relief": esriShadedRelief,
      Imagery: esriImagery,
      Terrain: esriTerrain
    };

    // add layer groups to layer switcher control
    var controlLayers = L.control.layers(baseLayers).addTo(this.state.map);
    controlLayers.setPosition("bottomright");
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
