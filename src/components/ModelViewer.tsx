"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useGLTF, useThree, Html, OrbitControls, axes } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { useDropzone } from "react-dropzone";

export interface ModelViewerProps {
  id: string;
  onSelect?: (modelUrl: string) => void;
  initialPosition?: [number, number, number];
}

export function ModelViewer({ id, onSelect, initialPosition = [0, 0, 0] }: ModelViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { getRootRef, update } = useThree();

  const { handleDrop, isDragActive, button } = useDropzone({
    accept: ".stl,.obj,.gltf,.glb",
    onDrop: (files) => {
      if (files.length > 0) {
        const url = URL.createObjectURL(files[0]);
        setModelUrl(url);
        onSelect?.(url);
      }
    },
  });

  const toggleAR = () => {
    const button = document.getElementById("ar-button") as HTMLButtonElement | null;
    if (button) button.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Canvas 3D */}
      <Canvas
        camera={{ position: initialPosition, fov: 60 }}
        shadows
        resize
        onCreated={({ gl }) => {
          // DRACO loader for compressed models
          const dracoLoader = new THREE.DRACOLoader();
          dracoLoader.setDecoderPath("/draco/");
          ;(gl as any).setDRACOLoader(dracoLoader);
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <OrbitControls enableDamping={true} />
        
        {modelUrl && (
          <group>
            <axes size={1} />
            
            {/* Simple placeholder mesh */}
            <mesh>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="#10b981" roughness={0.3} metalness={0.1} />
            </mesh>
            
            {/* Drop zone overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center text-center pointer-events-none"
            >
              {isDragging ? (
                <p className="text-lg text-amber-500">Soltando modelo...</p>
              ) : (
                <div className="border-2 border-dashed rounded-3xl p-8 cursor-pointer hover:bg-amber-50">
                  <p className="text-amber-600 mb-2">Haz clic o arrastra</p>
                  <p className="text-sm text-amber-500">STL, OBJ, GLTF/GLB</p>
                  <button className="mt-3 px-4 py-2 bg-amber-500 text-white rounded">{button}</button>
                </div>
              )}
            </div>
          </group>
        )}
      </Canvas>

      {/* AR Button (simulated - would need WebXR support) */}
      {/* <Html position={[0, -4, 0]} className="text-center">
        <button id="ar-button" onClick={toggleAR} className="rounded-2xl bg-gradient-warm px-4 py-2 text-sm font-bold text-rose-foreground shadow-soft">
          Ver en AR
        </button>
      </Html> */}
    </div>
  );
}