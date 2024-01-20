import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "./index.css";
import "./tooltip.css";
//COMPONENTS
import { Earth } from "./components/earth/Earth";

function App() {
  return (
    <div className="earth">
      <Canvas>
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
