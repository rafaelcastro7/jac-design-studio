"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { toast } from "sonner";
import { 
  Box, 
  RotateCcw, 
  Play, 
  Pause, 
  Grid as GridIcon, 
  Layers, 
  UploadCloud, 
  Sparkles, 
  Check, 
  Clock, 
  Scale, 
  ShieldCheck, 
  ShoppingCart,
  Maximize2
} from "lucide-react";

export interface QuotedItem {
  id: string;
  name: string;
  price: number;
  details?: string;
}

interface Quoter3DProps {
  onAddToCart?: (item: QuotedItem) => void;
}

// Engineering Material Specs
export const MATERIALS = [
  {
    id: "pla-eco",
    name: "PLA+ Eco Pro",
    tag: "Estándar & Decorativo",
    density: 1.24, // g/cm³
    pricePerCm3: 0.12,
    baseCost: 3.5,
    speedFactor: 1.0,
    desc: "Biodegradable, gran estabilidad dimensional y excelente acabado estético sin alabeo.",
    properties: ["Rigidez alta", "Eco-friendly", "Detalle limpio"],
  },
  {
    id: "petg-tough",
    name: "PETG Tough Industrial",
    tag: "Uso Mecánico & Exterior",
    density: 1.27,
    pricePerCm3: 0.18,
    baseCost: 4.5,
    speedFactor: 1.15,
    desc: "Resistencia térmica hasta 75°C, alta absorción de impactos y resistencia química y a rayos UV.",
    properties: ["Resistente al calor", "Anti-impacto", "Uso rudo"],
  },
  {
    id: "resin-12k",
    name: "Resina UV 12K Tough",
    tag: "Ultra Alta Definición",
    density: 1.15,
    pricePerCm3: 0.35,
    baseCost: 8.0,
    speedFactor: 1.4,
    desc: "Resolución óptica milimétrica con capas imperceptibles de 25 a 50 micras. Ideal para miniaturas.",
    properties: ["Capa 25 micras", "Superficie lisa", "Máxima precisión"],
  },
  {
    id: "nylon-pa12",
    name: "Nylon PA12 SLS",
    tag: "Ingeniería de Grado Industrial",
    density: 1.01,
    pricePerCm3: 0.52,
    baseCost: 12.0,
    speedFactor: 1.6,
    desc: "Poliamida de grado aeronáutico e industrial. Máxima tenacidad a la fatiga cíclica sin soportes.",
    properties: ["Indestructible", "Grado aeroespacial", "Resistencia a fricción"],
  },
  {
    id: "tpu-flex",
    name: "TPU Flexible 95A",
    tag: "Goma Elástica & Sellos",
    density: 1.21,
    pricePerCm3: 0.28,
    baseCost: 6.0,
    speedFactor: 1.8,
    desc: "Elastómero termoplástico flexible tipo goma. Absorbe vibraciones, impactos y presiones.",
    properties: ["Flexible 95A", "Antichoque", "Memoria elástica"],
  },
];

// Color Palette with Metallic / Roughness characteristics
export const COLOR_OPTIONS = [
  { name: "Negro Carbón Mate", hex: "#1f2328", roughness: 0.6, metalness: 0.1 },
  { name: "Blanco Ártico", hex: "#f8f9fa", roughness: 0.4, metalness: 0.05 },
  { name: "Naranja Neón Studio", hex: "#ff5722", roughness: 0.35, metalness: 0.1 },
  { name: "Azul Cobalto Eléctrico", hex: "#1d4ed8", roughness: 0.3, metalness: 0.2 },
  { name: "Oro Seda Perlado", hex: "#d4af37", roughness: 0.25, metalness: 0.6 },
  { name: "Verde Esmeralda Silk", hex: "#059669", roughness: 0.28, metalness: 0.4 },
  { name: "Gris Titanio Satinado", hex: "#64748b", roughness: 0.45, metalness: 0.5 },
];

// Presets that can be generated procedurally
type PresetKey = "dice-tower" | "helical-gear" | "voronoi-vase" | "lowpoly-skull";

interface PresetItem {
  id: PresetKey;
  name: string;
  category: string;
  estimatedVolumeCm3: number;
  dimensionsMm: [number, number, number];
}

const PRESETS: PresetItem[] = [
  {
    id: "dice-tower",
    name: "Torre de Dados Fortaleza RPG",
    category: "Accesorios Gaming",
    estimatedVolumeCm3: 64.5,
    dimensionsMm: [72, 72, 120],
  },
  {
    id: "helical-gear",
    name: "Engranaje Helicoidal Mecánico",
    category: "Ingeniería & Robótica",
    estimatedVolumeCm3: 38.2,
    dimensionsMm: [80, 80, 35],
  },
  {
    id: "voronoi-vase",
    name: "Florero Escultórico Paramétrico",
    category: "Decoración & Diseño",
    estimatedVolumeCm3: 52.8,
    dimensionsMm: [75, 75, 110],
  },
  {
    id: "lowpoly-skull",
    name: "Monolito Facetado Low-Poly",
    category: "Coleccionable & Arte",
    estimatedVolumeCm3: 41.6,
    dimensionsMm: [65, 70, 85],
  },
];

export function Quoter3D({ onAddToCart }: Quoter3DProps) {
  // Model & File state
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("dice-tower");
  const [fileName, setFileName] = useState<string>("Torre_Dados_Fortaleza.stl");
  const [triangleCount, setTriangleCount] = useState<number>(18420);
  const [dimensions, setDimensions] = useState<{ x: number; y: number; z: number }>({ x: 72, y: 72, z: 120 });
  const [volumeCm3, setVolumeCm3] = useState<number>(64.5);
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Print Configuration state
  const [materialId, setMaterialId] = useState<string>("pla-eco");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[2]); // Naranja Neón Studio
  const [infillPercent, setInfillPercent] = useState<number>(20);
  const [layerHeight, setLayerHeight] = useState<number>(0.20);
  const [quantity, setQuantity] = useState<number>(1);

  // Viewport toggles
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Canvas Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentMeshRef = useRef<THREE.Mesh | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Active Material Info
  const activeMaterial = useMemo(() => {
    return MATERIALS.find((m) => m.id === materialId) || MATERIALS[0];
  }, [materialId]);

  // Pricing & Metrics Formula
  const { partWeightGrams, printTimeMinutes, unitPrice, totalPrice } = useMemo(() => {
    // Effective volume factoring in infill percentage
    // Shell is ~25% of solid volume at 100%, interior volume scales with infill
    const shellVolumeRatio = 0.30;
    const coreVolumeRatio = 0.70;
    const effectiveVolumeCm3 = volumeCm3 * (shellVolumeRatio + coreVolumeRatio * (infillPercent / 100));

    // Weight in grams = Volume (cm³) * Density (g/cm³)
    const weightGrams = Math.round(effectiveVolumeCm3 * activeMaterial.density);

    // Height in layers
    const totalLayers = Math.round(dimensions.z / layerHeight);
    
    // Print time estimate (minutes): base calibration + volume extrusion + layer transitions
    const baseMinutes = 20;
    const extrusionMinutes = effectiveVolumeCm3 * 1.8 * activeMaterial.speedFactor;
    const layerMinutes = totalLayers * 0.08 * activeMaterial.speedFactor;
    const timeMinutes = Math.round(baseMinutes + extrusionMinutes + layerMinutes);

    // Cost Breakdown:
    // 1. Material cost
    const materialCost = effectiveVolumeCm3 * activeMaterial.pricePerCm3;
    // 2. Machine operating cost ($2.20/hour)
    const machineCost = (timeMinutes / 60) * 2.20;
    // 3. Setup & QA inspect
    const setupCost = activeMaterial.baseCost;

    const rawUnitPrice = Math.max(8.0, materialCost + machineCost + setupCost);
    const unit = Math.round(rawUnitPrice * 100) / 100;
    const total = Math.round(unit * quantity * 100) / 100;

    return {
      partWeightGrams: weightGrams,
      printTimeMinutes: timeMinutes,
      unitPrice: unit,
      totalPrice: total,
    };
  }, [volumeCm3, infillPercent, activeMaterial, layerHeight, dimensions.z, quantity]);

  // Format print time humanly
  const formattedTime = useMemo(() => {
    const hours = Math.floor(printTimeMinutes / 60);
    const minutes = printTimeMinutes % 60;
    if (hours === 0) return `${minutes} min`;
    return `${hours}h ${minutes}m`;
  }, [printTimeMinutes]);

  // Compute exact volume of a BufferGeometry using signed tetrahedrons
  const calculateGeometryVolume = (geo: THREE.BufferGeometry): number => {
    let position = geo.attributes.position;
    let faces = position.count / 3;
    let totalVolume = 0;
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const p3 = new THREE.Vector3();

    for (let i = 0; i < faces; i++) {
      p1.fromBufferAttribute(position, i * 3 + 0);
      p2.fromBufferAttribute(position, i * 3 + 1);
      p3.fromBufferAttribute(position, i * 3 + 2);
      // Signed volume of tetrahedron from origin: (1/6) * (p1 . (p2 x p3))
      totalVolume += p1.dot(p2.cross(p3)) / 6.0;
    }

    // Convert from mm³ to cm³
    const volumeCm3 = Math.abs(totalVolume) / 1000.0;
    return Math.max(1.0, Math.round(volumeCm3 * 10) / 10);
  };

  // Build Procedural Geometries
  const createPresetGeometry = (key: PresetKey): THREE.BufferGeometry => {
    switch (key) {
      case "dice-tower": {
        // Multi-level fortress tower
        const baseGeo = new THREE.CylinderGeometry(28, 34, 40, 8);
        baseGeo.translate(0, 20, 0);
        const shaftGeo = new THREE.CylinderGeometry(24, 28, 60, 8);
        shaftGeo.translate(0, 70, 0);
        const crownGeo = new THREE.CylinderGeometry(30, 24, 20, 8);
        crownGeo.translate(0, 110, 0);
        
        // Simple composite via merging geometries
        const group = new THREE.Group();
        group.add(new THREE.Mesh(baseGeo));
        group.add(new THREE.Mesh(shaftGeo));
        group.add(new THREE.Mesh(crownGeo));
        
        // Return cylinder for clean single buffer
        const geo = new THREE.CylinderGeometry(26, 32, 120, 16, 8);
        // Twist slightly
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          const angle = (y / 120) * 0.8;
          const x = pos.getX(i);
          const z = pos.getZ(i);
          pos.setX(i, x * Math.cos(angle) - z * Math.sin(angle));
          pos.setZ(i, x * Math.sin(angle) + z * Math.cos(angle));
        }
        geo.computeVertexNormals();
        return geo;
      }
      case "helical-gear": {
        // High-detail gear with helical teeth
        const geo = new THREE.CylinderGeometry(38, 38, 30, 32, 12);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const radius = Math.sqrt(x * x + z * z);
          if (radius > 30) {
            const angle = Math.atan2(z, x) + (y / 30) * 0.6;
            const tooth = Math.sin(angle * 14) * 4.5;
            pos.setX(i, (radius + tooth) * Math.cos(angle));
            pos.setZ(i, (radius + tooth) * Math.sin(angle));
          }
        }
        geo.computeVertexNormals();
        return geo;
      }
      case "voronoi-vase": {
        // Fluted sculpted vase
        const geo = new THREE.CylinderGeometry(26, 34, 110, 24, 32);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const angle = Math.atan2(z, x);
          const flute = Math.sin(angle * 8 + (y / 110) * 4) * 4.0;
          const waist = Math.sin((y / 110 + 0.5) * Math.PI) * 6.0;
          const r = Math.sqrt(x * x + z * z) + flute - waist;
          pos.setX(i, r * Math.cos(angle));
          pos.setZ(i, r * Math.sin(angle));
        }
        geo.computeVertexNormals();
        return geo;
      }
      case "lowpoly-skull": {
        // Faceted collectible polygonal form
        const geo = new THREE.DodecahedronGeometry(35, 1);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          if (y < 0) {
            // Taper bottom jaw
            pos.setX(i, pos.getX(i) * 0.75);
            pos.setZ(i, pos.getZ(i) * 0.85);
          }
        }
        // Force flat faceted shading
        return geo.toNonIndexed();
      }
    }
  };

  // Apply geometry to scene
  const applyGeometryToScene = (geo: THREE.BufferGeometry, title: string) => {
    if (!sceneRef.current) return;

    geo.computeBoundingBox();
    const bbox = geo.boundingBox!;
    const size = new THREE.Vector3();
    bbox.getSize(size);

    // Update state dimensions (rounded to mm)
    setDimensions({
      x: Math.round(size.x * 10) / 10 || 50,
      y: Math.round(size.y * 10) / 10 || 50,
      z: Math.round(size.z * 10) / 10 || 50,
    });

    const triCount = geo.attributes.position.count / 3;
    setTriangleCount(Math.round(triCount));

    // Center geometry around origin
    geo.center();
    // Lift so it sits directly on top of the grid plane (y=0)
    geo.computeBoundingBox();
    const newBox = geo.boundingBox!;
    const minY = newBox.min.y;
    geo.translate(0, -minY, 0);

    // Calculate volume
    const calculatedVol = calculateGeometryVolume(geo);
    setVolumeCm3(calculatedVol);

    // Remove previous mesh
    if (currentMeshRef.current) {
      sceneRef.current.remove(currentMeshRef.current);
      currentMeshRef.current.geometry.dispose();
    }

    // Material with high-end PBR reflections
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedColor.hex),
      roughness: selectedColor.roughness,
      metalness: selectedColor.metalness,
      wireframe: wireframe,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    sceneRef.current.add(mesh);
    currentMeshRef.current = mesh;

    // Adjust camera distance nicely
    if (cameraRef.current && controlsRef.current) {
      const maxDim = Math.max(size.x, size.y, size.z, 50);
      cameraRef.current.position.set(maxDim * 1.5, maxDim * 1.2, maxDim * 1.8);
      controlsRef.current.target.set(0, size.y * 0.45, 0);
      controlsRef.current.update();
    }
  };

  // Mount Three.js Viewport
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#0c1117");

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 2000);
    camera.position.set(120, 100, 150);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go below floor
    controls.minDistance = 30;
    controls.maxDistance = 600;
    controlsRef.current = controls;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight("#e2e8f0", 0.65);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight("#ffffff", 1.8);
    mainLight.position.set(80, 140, 90);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 10;
    mainLight.shadow.camera.far = 400;
    mainLight.shadow.bias = -0.0005;
    const d = 100;
    mainLight.shadow.camera.left = -d;
    mainLight.shadow.camera.right = d;
    mainLight.shadow.camera.top = d;
    mainLight.shadow.camera.bottom = -d;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight("#38bdf8", 1.2);
    rimLight.position.set(-100, 60, -90);
    scene.add(rimLight);

    const warmFill = new THREE.DirectionalLight("#f59e0b", 0.8);
    warmFill.position.set(0, -50, 80);
    scene.add(warmFill);

    // Floor Grid Helper & Shadow receiver
    const grid = new THREE.GridHelper(220, 22, "#334155", "#1e293b");
    grid.position.y = 0;
    scene.add(grid);
    gridHelperRef.current = grid;

    const floorPlaneGeo = new THREE.PlaneGeometry(300, 300);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floorMesh = new THREE.Mesh(floorPlaneGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.1;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Load initial preset
    const initialGeo = createPresetGeometry(selectedPreset);
    applyGeometryToScene(initialGeo, PRESETS[0].name);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Sync Color / Wireframe Changes
  useEffect(() => {
    if (!currentMeshRef.current) return;
    const mat = currentMeshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.color.set(selectedColor.hex);
      mat.roughness = selectedColor.roughness;
      mat.metalness = selectedColor.metalness;
      mat.wireframe = wireframe;
      mat.needsUpdate = true;
    }
  }, [selectedColor, wireframe]);

  // Sync Grid Toggle
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // Preset Selection Handler
  const handleSelectPreset = (key: PresetKey) => {
    setSelectedPreset(key);
    setIsCustomUpload(false);
    const preset = PRESETS.find((p) => p.id === key);
    if (preset) {
      setFileName(`${preset.name.replace(/\s+/g, "_")}.stl`);
      const geo = createPresetGeometry(key);
      applyGeometryToScene(geo, preset.name);
      toast.success(`Cargado modelo: ${preset.name}`);
    }
  };

  // Parse & Load Custom STL File
  const processSTLFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".stl")) {
      toast.error("Por favor selecciona un archivo .STL válido");
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading("Analizando geometría 3D y calculando volumen...");

    try {
      const buffer = await file.arrayBuffer();
      const loader = new STLLoader();
      const geometry = loader.parse(buffer);

      if (!geometry || geometry.attributes.position.count === 0) {
        throw new Error("El archivo STL no contiene vértices válidos.");
      }

      setFileName(file.name);
      setIsCustomUpload(true);
      applyGeometryToScene(geometry, file.name);

      toast.dismiss(toastId);
      toast.success(`¡Modelo ${file.name} analizado exitosamente!`);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || "Error al procesar el archivo STL");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Camera Reset
  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z, 50);
    cameraRef.current.position.set(maxDim * 1.5, maxDim * 1.2, maxDim * 1.8);
    controlsRef.current.target.set(0, dimensions.y * 0.45, 0);
    controlsRef.current.update();
  };

  // Add Quote to Cart
  const handleAddToCart = () => {
    const item: QuotedItem = {
      id: `quote-3d-${Date.now()}`,
      name: `Impresión 3D: ${fileName.replace(/\.stl$/i, "")} (${activeMaterial.name})`,
      price: totalPrice,
      details: `${dimensions.x}×${dimensions.y}×${dimensions.z}mm · ${infillPercent}% infill · ${selectedColor.name} · ${quantity} ud(s)`,
    };

    if (onAddToCart) {
      onAddToCart(item);
    } else {
      toast.success(`Cotización añadida: $${totalPrice.toFixed(2)} USD`);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-card border border-border/80 shadow-2xl overflow-hidden text-card-foreground">
      {/* Top Studio Bar */}
      <div className="px-6 py-4 border-b border-border/60 bg-muted/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber-600">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight">{fileName}</span>
              {isCustomUpload ? (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  Custom STL
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  Preset Demo
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {dimensions.x} × {dimensions.y} × {dimensions.z} mm · {volumeCm3} cm³ · {triangleCount.toLocaleString()} triángulos
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">Modelos:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                !isCustomUpload && selectedPreset === p.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
              }`}
            >
              {p.name.split(" ")[0]} {p.name.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid: Viewport + Configurator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left / Center: Interactive 3D Canvas (7 cols) */}
        <div className="lg:col-span-7 relative bg-[#0c1117] flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-border/60">
          {/* 3D WebGL Canvas Container */}
          <div ref={containerRef} className="w-full h-[400px] sm:h-[480px] lg:h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Viewport Quick Controls */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 p-1 rounded-2xl bg-background/80 backdrop-blur-md border border-border/60 shadow-lg z-10">
            <button
              onClick={() => setAutoRotate((v) => !v)}
              title={autoRotate ? "Pausar rotación" : "Girar automáticamente"}
              className={`p-2 rounded-xl text-xs transition-colors ${
                autoRotate ? "bg-amber-500/20 text-amber-500 font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleResetCamera}
              title="Centrar vista"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWireframe((v) => !v)}
              title="Modo Malla (Wireframe)"
              className={`p-2 rounded-xl text-xs transition-colors ${
                wireframe ? "bg-amber-500/20 text-amber-500 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowGrid((v) => !v)}
              title="Mostrar/Ocultar cuadrícula"
              className={`p-2 rounded-xl text-xs transition-colors ${
                showGrid ? "bg-amber-500/20 text-amber-500 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <GridIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Live Dimension HUD Overlay */}
          <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-background/85 backdrop-blur-md border border-border/60 shadow-lg text-xs space-y-1.5 max-w-[260px] pointer-events-none">
            <div className="flex items-center justify-between text-muted-foreground font-semibold">
              <span>Dimensiones (X × Y × Z)</span>
              <span className="text-foreground">{dimensions.x} × {dimensions.y} × {dimensions.z} mm</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Volumen real</span>
              <span className="font-semibold text-foreground">{volumeCm3.toFixed(1)} cm³</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Peso estimado</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">~{partWeightGrams} g</span>
            </div>
          </div>

          {/* Floating STL Drag & Drop Bar at Bottom Right */}
          <div className="absolute bottom-4 right-4 z-10">
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95">
              <UploadCloud className="w-4 h-4" />
              <span>{isAnalyzing ? "Analizando..." : "Subir mi STL"}</span>
              <input
                type="file"
                accept=".stl"
                className="hidden"
                disabled={isAnalyzing}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) processSTLFile(f);
                }}
              />
            </label>
          </div>
        </div>

        {/* Right: Technical Parameters & Live Instant Quote (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[720px]">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Parámetros de Fabricación
              </span>
              <h3 className="text-2xl font-black tracking-tight mt-1">Configuración del Modelo</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Ajusta material, densidad y capa para recalcular costos y tiempos al milímetro.
              </p>
            </div>

            {/* Material Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                1. Material de Fabricación
              </label>
              <div className="space-y-2">
                {MATERIALS.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => setMaterialId(mat.id)}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      materialId === mat.id
                        ? "border-amber-500 bg-amber-500/10 shadow-sm"
                        : "border-border/60 bg-muted/20 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{mat.name}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/40">
                          {mat.tag}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{mat.desc}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {mat.properties.map((prop, idx) => (
                          <span key={idx} className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            ✓ {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-foreground">${mat.pricePerCm3.toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground block">/cm³</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  2. Color de Acabado (Shader 3D en vivo)
                </label>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{selectedColor.name}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center ${
                      selectedColor.name === c.name
                        ? "border-amber-500 scale-110 shadow-md ring-2 ring-amber-500/30"
                        : "border-border/80 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor.name === c.name && (
                      <Check className={`w-4 h-4 ${c.hex === "#f8f9fa" ? "text-dark" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Infill & Layer Height Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Infill Density Slider */}
              <div className="space-y-2 p-3 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-muted-foreground">Relleno (Infill)</span>
                  <span className="font-bold text-foreground bg-card px-2 py-0.5 rounded-md border border-border/40">
                    {infillPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={infillPercent}
                  onChange={(e) => setInfillPercent(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>10% (Ligero)</span>
                  <span>40% (Robusto)</span>
                  <span>100% (Sólido)</span>
                </div>
              </div>

              {/* Layer Resolution */}
              <div className="space-y-2 p-3 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-muted-foreground">Resolución de Capa</span>
                  <span className="font-bold text-foreground bg-card px-2 py-0.5 rounded-md border border-border/40">
                    {layerHeight} mm
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {[
                    { val: 0.12, label: "Fino" },
                    { val: 0.20, label: "Estándar" },
                    { val: 0.28, label: "Rápido" },
                  ].map((res) => (
                    <button
                      key={res.val}
                      onClick={() => setLayerHeight(res.val)}
                      className={`py-1 text-[11px] font-bold rounded-lg transition-colors ${
                        layerHeight === res.val
                          ? "bg-amber-500 text-white"
                          : "bg-background hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/60">
              <span className="text-xs font-bold text-muted-foreground">Cantidad de unidades:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg bg-card border border-border/60 flex items-center justify-center font-bold text-sm hover:bg-muted"
                >
                  -
                </button>
                <span className="font-bold text-sm w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-lg bg-card border border-border/60 flex items-center justify-center font-bold text-sm hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Live Quote Breakdown & Cart Action */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Tiempo de impresión estimado:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {formattedTime} por pieza
                </span>
              </div>
              <div className="flex justify-between">
                <span>Inspección geométrica & Post-proceso:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Incluido (Tolerancia ±0.1mm)
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">Presupuesto Total Estimado</span>
                  <span className="text-3xl font-black tracking-tight text-foreground">
                    ${totalPrice.toFixed(2)}{" "}
                    <span className="text-xs font-semibold text-muted-foreground">USD</span>
                  </span>
                </div>
                {quantity > 1 && (
                  <span className="text-xs text-muted-foreground font-medium">
                    (${unitPrice.toFixed(2)} c/u)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Añadir Cotización al Carrito</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
