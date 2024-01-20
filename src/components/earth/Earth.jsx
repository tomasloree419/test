import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import { Alarm } from "./Alarm";
//ASSETS
import EarthDayMap from "../../assets/textures/8k_earth_daymap.jpg";
import EarthNormalMap from "../../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../../assets/textures/8k_earth_clouds.jpg";
import { countries } from "./countrylist";

export function initialLightPosition(currenttime) {
  // When Newyork time is AM 0:0, the light point is (15,0,-48)
  let x = 15,
    z = -48,
    cx = 0,
    cz = 0; // Axis is (-0.28, 0.96) but the distance is far from the earth to point, so we ignore it.
  let radians = (currenttime * Math.PI) / 43200,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (z - cz) + cx,
    nz = cos * (z - cz) - sin * (x - cx) + cz;
  return [-nx, 0, nz];
}

export function Earth(props) {
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap]
  );

  const earthRef = useRef();
  const cloudsRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    earthRef.current.rotation.y = (elapsedTime * 2 * Math.PI) / 86400;
    cloudsRef.current.rotation.y = (elapsedTime * 2 * Math.PI) / 1000;
  });

  const alarmItems = countries.map((country, idx) => (
    <Alarm key={idx} country={country} />
  ));

  const date = new Date();

  let seconds =
    date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  let lightposition = initialLightPosition(seconds);

  return (
    <>
      <pointLight color="#f6f3ea" position={lightposition} intensity={1.2} />
      <Stars
        radius={400}
        depth={90}
        count={10000}
        factor={7}
        saturation={0}
        fade={true}
      />
      <mesh ref={cloudsRef} scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[1.005, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.4}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        ref={earthRef}
        className="flex absolute h-80 w-80 drop-shadow-3xl shadow-inner"
        scale={[2.5, 2.5, 2.5]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial specular specularMap={specularMap} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          metalness={0.4}
          roughness={0.7}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.4}
          panSpeed={0.6}
          rotateSpeed={0.5}
        />
        {alarmItems}
      </mesh>
    </>
  );
}
