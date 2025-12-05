import React, { useState, useEffect } from 'react';
import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/WebGLTile';
import LayerSwitcher from 'ol-layerswitcher';
import { XYZ } from 'ol/source';
import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css'; 
import { Point } from 'ol/geom';
import {Style, Icon} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

//GPS Component, (ik it's not very React-like, but leaflet is very annoying to work with)
const GPS = ( {data} ) => {

    const [point, setPoint] = useState(null)
    const [mapState, setMapState] = useState()
    const [center, setCenter] = useState([0,0]);
    const [minZoom, setMinzoom] = useState(null);
    const [maxZoom, setMaxzoom] = useState(null);
    const [maxBounds, setMaxbounds] = useState([0,0,0,0])
    const [zoomLevel, setZoomlevel] = useState(13);
    const [currPos, setCurrPos] = useState(center); //[long, lat]


    //Load once component mounts: load tile settings
    useEffect(() => {

        const jsonFile = fetch('/gps-info/Tiles/tiles.json')
        .then(res => res.text()) //tiles.json contains comments, so convert contents into text to be deleted later
        .then((tilesText) => {
  
          if(tilesText)
          { 
            const deletedComments = tilesText.replace(/\/\/.*$/gm, "").trim(); //return contents of tiles.json without the comments
  
            const tilesOptions = JSON.parse(deletedComments); //convert the contents into a json object
            // console.log(tilesOptions);
            setCenter([tilesOptions['center'][0], tilesOptions['center'][1]])
            setMinzoom(tilesOptions['minzoom'])
            setMaxzoom(tilesOptions['maxzoom'])
            setMaxbounds([
                tilesOptions["bounds"][0], tilesOptions["bounds"][1],
                tilesOptions["bounds"][2], tilesOptions["bounds"][3]])
            setZoomlevel(tilesOptions["center"][2]);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      }, [])
  

      //Render map whenever center and bounds change
      useEffect(() => {

       
        //OSM Tile Layer
        const osmLayer2 = new TileLayer({
            source: new XYZ({
                url:'/gps-info/Tiles/{z}/{x}/{y}.png' //get tiles from public/gps-info/Tiles in raster tile format
            }),
            title: 'OSM',
            type: 'base',
            visible: true,
        });

       
        //Sattelite Tile Layer
        const satLayer = new TileLayer({
            source: new XYZ({
                url:'/gps-info/sattelite/{z}/{x}/{y}.png' //get sattelite tiles from public/gps-info/sattelite in raster tile format
            }),
            title: 'Sattelite',
            type: 'base',
            visible: false,
        });
       
        //Render map
        const map = new Map({
            target: "map",
            layers: [osmLayer2, satLayer],
            renderer: 'webgl',
            view: new View({
                center: [0,0],
                zoom: zoomLevel,
                maxZoom: maxZoom,
                minZoom: minZoom,
                extent: maxBounds,
                projection: 'EPSG:4326',
                
              }),
              
          });

        //Render Layer Switcher
        const layerSwitcher = new LayerSwitcher({
            tipLabel: 'Legend'
        });

        map.addControl(layerSwitcher);

        setMapState(map);
        
        //Clean up
        return () => map.setTarget(null)
    }, [center, maxBounds]);


    
    //Update current position
    useEffect(() => {
        if(data['longitude'] && data['latitude']){
            setCurrPos([data['longitude'].slice(-1), data['latitude'].slice(-1)]);
        }
    }, [data['longitude']?.length, data['latitude']?.length]);



    //Render a point at current rocket location
    useEffect(() => {
        try
        {   
            // console.log('lat/long', currPos)
            if(!point && currPos && mapState) {
            const pointFeature = new Feature({
                geometry: new Point(currPos),
            });
            pointFeature.setStyle(
                new Style({
                    image: new Icon({
                        src:'spaceship.png',
                        scale:0.1
                    })
                })
            )
            const vectorLayer = new VectorLayer({
                source: new VectorSource({
                    features: [pointFeature]
                })
            })

            mapState.addLayer(vectorLayer);

            setPoint(pointFeature);
            // console.log('point added')
            // setMapState(mapState)
            }
            else if(point && currPos && mapState) {
                point.getGeometry().setCoordinates(currPos);
                setPoint(point);
            }
        }
        catch (error) {
            console.log(error);
        }
       
        
    }, [currPos])

    return (
      <div className="bg-gray-800 p-4 rounded shadow-md flex justify-center items-center h-96">
            <div style={{height:'100%', width:'100%', overflow:'hidden'}} id="map" className='map-container' />
      </div>
    );


}

export default GPS;
