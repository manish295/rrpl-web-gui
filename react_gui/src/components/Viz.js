import React, { useEffect, useRef, useState } from "react";
import {useLoader} from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';


const Viz = ({ quaternion }) => {

    const rocket = useRef();
    const geometry = useLoader(GLTFLoader, 'rocket.glb');
    const cameraRef = useRef();
    const [cameraPos, setCameraPos] = useState([0, 0, 20]); // Initial camera position

    
    const resetCamera = () => {
        if (cameraRef.current) {
            cameraRef.current.position.set(0, 0, 20);
            cameraRef.current.lookAt(rocket.current.position);
            setCameraPos([0, 0, 20]);
        }
    };


    useEffect(() => {
        if(quaternion['x'] && quaternion['y'] && quaternion['z'] && quaternion['w']) {
            let x = quaternion['x'].slice(-1)[0];
            let y = quaternion['y'].slice(-1)[0];
            let z = quaternion['z'].slice(-1)[0];
            let w = quaternion['w'].slice(-1)[0];
            console.log(x);
            if (rocket.current) {
                rocket.current.quaternion.set(x, y,  z, w);
            }
        }
    }, [quaternion['x']?.length,  quaternion['y']?.length,  quaternion['z']?.length,  quaternion['w']?.length] )



    return(

        <div className="bg-gray-800 p-4 rounded shadow-md flex flex-col items-center h-96">
        
        <Canvas style={{ height: "100%", width: "100%", background: "#050126" }}>
            <PerspectiveCamera ref={cameraRef} makeDefault position={cameraPos} fov={60} />
            <ambientLight />
            <pointLight position={[10,10,10]} />
            
            <primitive ref= {rocket} object={geometry.scene} scale={[0.1, 0.1, 0.1]} 
            position={[1, -8, -1.3]} 
            rotation={[0, -0.5, 0]} />

            <OrbitControls 
                     enableZoom={true}  // allow zooming in/out
                     enablePan={false}  // disable panning to keep focus on rocket
                     target={[0, 0, 0]} // ensure the camera orbits around the rocket
                     maxPolarAngle={Math.PI}  // prevent flipping upside down
                     minPolarAngle={0}        // prevent looking from below
                     onChange={(e) => {
                        const { x, y, z } = e.target.object.position;
                        setCameraPos([x, y, z]); // update state when camera moves
                    }} 
                />
        </Canvas>

        <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={resetCamera}
        >
            Reset Camera
        </button>
        <span className="text-white">Camera: {cameraPos.map(p => p.toFixed(2)).join(", ")}</span>

    </div>
    );
}

export default Viz;