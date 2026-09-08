"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useGLTF, useThree, Html, OrbitControls, axes } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { useThree as useThreeHook } from "@react-three/drei";
import { Dropzone } from "react-dropzone";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export interface ModelViewerProps {
  id: string;
  onSelect?: (modelUrl: string) => void;
  initialPosition?: [number, number, number];
}

export function ModelViewer({ id, onSelect, initialPosition = [0, 0, 0] }: ModelViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("default");
  const [price, setPrice] = useState<number>(0);
  const [isAR, setIsAR] = useState<boolean>(false);

  // TanStack Query for model caching
  const { data: gltfData, isLoading, isError } = useQuery(
    ["model", id],
    async () => {
      if (!modelUrl) return null;
      const response = await fetch(`/api/models/${id}?url=${encodeURIComponent(modelUrl)}`);
      if (!response.ok) throw new Error("Failed to load model");
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    }
  );

  // Load GLTF model
  const onLoad = useCallback(
    (instance: THREE.Group) => {
      // Calculate price based on model complexity
      const geometry = instance.children[0] as THREE.Mesh;
      if (geometry) {
        const vertices = geometry.geometry?.attributes?.position?.array?.length || 0;
        setPrice(Math.round(vertices * 0.05)); // Simple pricing: $0.05 per 100 vertices
      }
      if (onSelect) onSelect(modelUrl);
    },
    [modelUrl, onSelect]
  );

  const onError = useCallback(
    (error: Error) => {
      console.error("Model load error:", error);
    },
    []
  );

  // Material selection handlers
  const changeMaterial = useCallback(
    (material: string) => {
      setSelectedMaterial(material);
      // Apply material to the mesh - simplified
      setPrice(prev => prev + (material === "premium" ? 20 : 0));
    },
    []
  );

  // AR toggle
  const toggleAR = useCallback(() => {
    setIsAR(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Model Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        shadows
        resize
        onCreated={({ gl }) => {
          // Set up DRACO loader for compressed models
          const dracoLoader = new THREE.DRACOLoader();
          dracoLoader.setDecoderPath("/draco/");
          // @ts-ignore - DRACOLoader is available in three-stdlib
          ;(gl as any).setDRACOLoader(dracoLoader);
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <OrbitControls enableDamping={true} />
        
        {glTFData && !isLoading && !isError && (
          <Html
            position={[0, -4, 0]}
            className="text-center text-sm text-muted-foreground"
          >
            <div>Cargando modelo...</div>
          </Html>
        )}

        {gltfData && !isLoading && !isError && (
          <group rotation={[0, 0, 0]} >
            <axes size={1} />
            
            {/* Model mesh with material selection */}
            {/* Simplified - in real app would map GLTF meshes to materials */}
            {selectedMaterial !== "default" && (
              <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial 
                  color={selectedMaterial === "premium" ? "# gold" : "# teal"} 
                  roughness={0.3}
                  metalness={0.1}
                />
              </mesh>
            )}

            {/* Drop zone for new models */}
            <DragDropZone onFileDropped={setModelUrl} />
          </group>
        )}

        {/* AR Button */}
        {isAR && (
          <Html position={[0, 4, 0]} className="text-center">
            <button
              onClick={toggleAR}
              className="rounded-2xl bg-gradient-warm px-4 py-2 text-sm font-bold text-rose-foreground shadow-soft"
            >
              Salir de AR
            </button>
          </Html>
        )}

        {!isAR && (
          <Html position={[0, 4, 0]} className="text-center">
            <button
              onClick={toggleAR}
              className="rounded-2xl bg-gradient-warm px-4 py-2 text-sm font-bold text-rose-foreground shadow-soft"
            >
              Ver en AR
            </button>
          </Html>
        )}
      </Canvas>

      {/* Price and controls panel */}
      <div className="p-6 bg-card/80 backdrop-blur-md">
        <h3 className="text-xl font-black tracking-tight">Personalizador 3D</h3>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Material</p>
            <select
              value={selectedMaterial}
              onChange={(e) => changeMaterial(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber"
            >
              <option value="default">Estándar</option>
              <option value="premium">Premium (resina)</option>
              <option value="eco">Ecológico (PLA)</option>
            </select>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Precio estimado</p>
            <p className="text-2xl font-black">{price > 0 ? `$${price}` : "Cargando..."}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Arrastra y suelta un archivo STL, OBJ o GLTF aquí, o haz clic para seleccionar
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Formatos compatibles: STL, OBJ, GLTF/GLB (hasta 120 MB)
          </p>
        </div>
      </div>
    </div>
  );
}

/* Drag and drop zone component */
function DragDropZone({ onFileDropped }: { onFileDropped: (url: string) => void }) {
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      setDroppedFile(file);
      // Create a URL for the file
      const url = URL.createObjectURL(file);
      onFileDropped(url);
    }
  };

  return (
    <div 
      className="border-2 border-dashed rounded-3xl p-12 text-center hover:bg-muted cursor-pointer transition-colors"
      onClick={() => document.querySelector('input[type="file"]')?.click()}
      onDrop={(e) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          handleDrop(Array.from(files));
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <p className="text-muted-foreground mb-2">Haz clic o arrastra un archivo</p>
      <p className="text-xs text-muted-foreground">STL, OBJ, GLTF/GLB (máx. 120 MB)</p>
      <input
        type="file"
        accept=".stl,.obj,.gltf,.glb"
        style={{ display: 'none' }}
        onChange={(e) => handleDrop(Array.from(e.target.files ?? []))}
      />
      <p className="mt-2 text-sm">
        <span className="text-rose-foreground">o</span> ingresa un enlace URL
      </p>
    </div>
  );
}