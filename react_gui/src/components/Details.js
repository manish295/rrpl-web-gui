import React, { useEffect, useState } from "react";

const Details = ({ data, timeWhenConnected }) => {
  
  //calculates the average change of last 10 datapoints
  function calculateAverageChange(arr) {
		let difference = 0;
		difference = arr[arr.length - 1] - arr[0];
		return Math.round((difference / (0.1*arr.length)) * 1000) / 1000 ;
	}

  
  function getTimeElapsed() {
    const timeElapsed = new Date(Date.now() - timeWhenConnected);
    // console.log('updating time')
    // console.log('time when', timeWhenConnected)
    if(timeWhenConnected != 0) { 
      const seconds = Math.floor((timeElapsed / 1000) % 60).toString().padStart(2, '0');
      const minutes = Math.floor((timeElapsed / (1000 * 60)) % 60).toString().padStart(2, '0');
      const hours = Math.floor((timeElapsed / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      setCurrMissionTime(`${hours}:${minutes}:${seconds}`)
    }
  }

  const [batteryDeltaArr, setBatteryDeltaArr] = useState([]);
  const [batteryAvgChange, setBatteryAvgChange] = useState(0);
  const [currMissionTime, setCurrMissionTime] = useState(`00:00:00`);

  useEffect(() => {
    const interval = setInterval(() => {
     getTimeElapsed();
    
    }, 1000);

    return () => clearInterval(interval);
  }, [timeWhenConnected])

  const detailsList = {
    "Mission Time": currMissionTime,
    "Battery Delta ": batteryAvgChange,
    "Temperature": data['temperature_c']? data['temperature_c'].slice(-1)[0].toFixed(2): 'N/A',
    "Latitude": data['latitude']? data['latitude'].slice(-1)[0].toFixed(5): 'N/A',
    "Longitude": data['longitude']? data['longitude'].slice(-1)[0].toFixed(5): 'N/A',
    "Altitude (m)": data['barometer_hMSL_m']? data['barometer_hMSL_m'].slice(-1)[0].toFixed(1): 'N/A'
  };


  useEffect(() => {
    if(data['main_voltage_v'])
    { 
    const tempArr = [...batteryDeltaArr, data['main_voltage_v'].slice(-1)]
    if (tempArr.length > 10) {
      tempArr.shift();
      // console.log('shifted')
    }
    setBatteryDeltaArr(tempArr);

    setBatteryAvgChange(calculateAverageChange(tempArr));
    }

  }, [data['main_voltage_v']?.length])



  return (
    <div className="bg-gray-800 p-4 rounded shadow-md flex justify-center items-center h-96">
      <ul className="w-full h-full flex flex-col justify between divide-y-1 text-sky-100">
        {Object.keys(detailsList).map((item) => {
          return (
            <li key={item} className="flex-1 flex justify-between items-center">
              <span>{item}</span>
              <span>{detailsList[item]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Details;
