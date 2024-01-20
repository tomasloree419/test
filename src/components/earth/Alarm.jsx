import React, { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export function Alarm({ country }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
  });
  console.log(count);

  let lat = country.coord.lat;
  let long = country.coord.long;
  const polar = 180 - (lat + 90);
  const phi = THREE.MathUtils.degToRad(polar);
  const theta = THREE.MathUtils.degToRad(long);
  let position = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);

  let temp = position.x;
  position.x = position.z;
  position.z = -temp;
  const date = new Date();

  const time = date.toLocaleTimeString("en-US", {
    timeZone: country.zone,
  });
  const convertedtime = date.toLocaleTimeString("en-US", {
    timeZone: country.zone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  let renderText;

  // It shows country that time is day
  if (convertedtime > "06:00:00" && convertedtime < "19:00:00") {
    renderText = (
      <>
        <mesh position={position}>
          <sphereGeometry args={[0.005, 32, 32]} />
          <meshBasicMaterial color={"red"} />
        </mesh>
        <Html position={position} distanceFactor={1}>
          <div className="arrow_box">
            {country.name}
            <br></br>
            {time}
          </div>
        </Html>
      </>
    );
  }

  return <>{renderText}</>;
}
