import React, { useEffect, useState } from "react";
import Navbar from "./Nav.js"
import useSocket from "../hooks/useSocket.js";
import Chart from "./Chart.js"
import Details from "./Details.js";
import Viz from "./Viz.js";
import GPS from "./GPS.js";

const Dashboard = () => {


  const { data, isConnect, webSocket } = useSocket('ws://localhost:8765');

  const [formattedData, setFormattedData] = useState({});

  const [timeWhenConnected, setTimeWhenConnected] = useState(0);

  const [numDataPoints, setNumDataPoints] = useState(0);


  useEffect(() => {
    if(isConnect && timeWhenConnected == 0) {
      console.log('changing')
      setTimeWhenConnected(Date.now())
    }

    if(!isConnect) {
     setTimeWhenConnected(0)
    }

    if(data){
      setFormattedData((prevFormattedData) => {
        let tempFormat = {...prevFormattedData};
        Object.keys(data).forEach((key) => {
          if (!tempFormat[key]) {
            tempFormat[key] = [];
          }
          tempFormat[key].push(data[key])
        })
        setNumDataPoints(numDataPoints + 1);
        return tempFormat; 
      });
    
    } 
    else {
      console.log('no data')
    }
  }, [data, isConnect]);


  

  return (
    <main className="flex flex-col h-screen">
          <Navbar data={{'connection': isConnect, 'numDataPoints': numDataPoints}} webSocket={webSocket} />
          <div className="grid grid-flow-row grid-cols-4 bg-gray-900 h-screen overflow-auto">
          
            <div className="border-double border-r-4 border-sky-500 col-span-3 grid grid-cols-2 h-full overflow-auto">
              <div className="col-span-2 grid grid-cols-2 gap-4 p-4 ">
                <div className="col-span-2">
                  <GPS data={{'latitude': formattedData['latitude'], 'longitude': formattedData['longitude']}} />
                </div>
                <Chart title='Position'  data={formattedData['position']} />
                <Viz quaternion={{'x': formattedData['x'], 'y': formattedData['y'], 'z': formattedData['z'], 'w': formattedData['w']}}/>
                <Chart title='Acceleration' data={formattedData["acceleration"]} />
                <Chart title='Velocity'  data={formattedData['velocity']} />
                <Chart title='Barometric Altitude'  data={formattedData['barometer_hMSL_m']} />
                <Chart title='Z Acceleration' data={formattedData['z_acceleration']}/>
              </div>
            </div>
            <div className="col-span-1 gap-4 p-4">
            <Details
            data={formattedData}
            timeWhenConnected={timeWhenConnected}
          />
            </div>
          </div>
            
    </main>
  );
};

export default Dashboard;
