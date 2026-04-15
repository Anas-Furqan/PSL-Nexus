"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ── Realistic Cricket Ground ── */
function StadiumGrass() {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Main Oval Grass (Circle stretched into an oval on Z axis) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]} receiveShadow>
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial color="#1f4d29" roughness={0.9} />
      </mesh>
      
      {/* Central 22-yard Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[3, 10]} />
        <meshStandardMaterial color="#8b7b5c" roughness={1} />
      </mesh>
    </group>
  );
}

/* ── Cricket Pitch Lines ── */
function PitchLines() {
  // Inner 30-yard circle equivalent (Scaled to match oval)
  const innerCirclePts = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push([Math.cos(angle) * 8, 0.02, Math.sin(angle) * 9.6]);
    }
    return pts;
  }, []);

  // Crease lines on the pitch
  const creaseLines = useMemo(() => [
    // Top crease
    [-1.2, 0.02, -4], [1.2, 0.02, -4],
    // Bottom crease
    [-1.2, 0.02, 4], [1.2, 0.02, 4],
    // Middle stumps indicator
    [0, 0.02, -4.8], [0, 0.02, 4.8]
  ] as [number, number, number][], []);

  // Outer boundary rope
  const boundaryPts = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push([Math.cos(angle) * 19, 0.02, Math.sin(angle) * 22.8]);
    }
    return pts;
  }, []);

  return (
    <group>
      <Line points={innerCirclePts} color="#ffffff" lineWidth={1} transparent opacity={0.5} />
      {/* Boundary Rope */}
      <Line points={boundaryPts} color="#ffffff" lineWidth={4} />
      {/* Pitch Creases */}
      <Line points={[creaseLines[0], creaseLines[1]]} color="#ffffff" lineWidth={2} />
      <Line points={[creaseLines[2], creaseLines[3]]} color="#ffffff" lineWidth={2} />
    </group>
  );
}

/* ── Realistic Audience Seating & Stadium Bowl ── */
function StadiumStands() {
  const tiers = 20; // Number of seating rows
  const rowHeight = 0.5;
  const rowDepth = 0.8;
  const startRadius = 22;

  return (
    <group>
      {/* Solid Floor connecting the grass edge to the first stair row */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]} receiveShadow>
        <ringGeometry args={[19.9, startRadius, 64]} />
        <meshStandardMaterial color="#1f4d29" roughness={0.9} />
      </mesh>

      {/* Generate Stepped Seating (Stairs) */}
      {Array.from({ length: tiers }).map((_, i) => (
        <group key={`tier-${i}`}>
          <mesh position={[0, i * rowHeight + (rowHeight / 2), 0]} scale={[1, 1, 1.2]} receiveShadow>
            <cylinderGeometry args={[startRadius + i * rowDepth, startRadius + i * rowDepth, rowHeight, 64, 1, true]} />
            <meshStandardMaterial side={THREE.DoubleSide} color="#0c1618" roughness={0.9} />
          </mesh>
          <mesh position={[0, i * rowHeight, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]} receiveShadow>
            <ringGeometry args={[startRadius + i * rowDepth, startRadius + (i + 1) * rowDepth, 64]} />
            <meshStandardMaterial color="#152b36" side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Massive Solid Exterior Wall Foundation (Like the reference image) */}
      <mesh position={[0, (tiers * rowHeight) / 2, 0]} scale={[1, 1, 1.2]} receiveShadow castShadow>
        <cylinderGeometry args={[startRadius + tiers * rowDepth + 1, startRadius + tiers * rowDepth + 1, tiers * rowHeight, 64, 1, true]} />
        <meshStandardMaterial side={THREE.DoubleSide} color="#8a959e" roughness={0.8} />
      </mesh>
      
      {/* Top Rim Walkway (Solid Top Edge covering the wall gap) */}
      <mesh position={[0, tiers * rowHeight, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.2, 1]} receiveShadow>
        <ringGeometry args={[startRadius + (tiers - 1) * rowDepth, startRadius + tiers * rowDepth + 1, 64]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Stadium Floodlights (Realistic Light Arrays) ── */
function Floodlights() {
  const poles = [
    [32, 28], [-32, 28], [32, -28], [-32, -28]
  ];

  return (
    <group>
      {poles.map((pos, i) => (
        <group key={i} position={[pos[0], 0, pos[1] * 1.2]}>
          <mesh position={[0, 10, 0]}>
            <cylinderGeometry args={[0.3, 0.6, 20, 8]} />
            <meshStandardMaterial color="#2d3748" roughness={0.5} />
          </mesh>
          
          <group position={[0, 20, 0]} rotation={[pos[1] > 0 ? -Math.PI / 6 : Math.PI / 6, pos[0] > 0 ? -Math.PI / 4 : Math.PI / 4, 0]}>
            <mesh position={[0, 0, -0.1]}>
              <boxGeometry args={[5, 2.5, 0.3]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            
            {Array.from({ length: 6 }).map((_, x) => 
               Array.from({ length: 3 }).map((_, y) => (
                 <mesh key={`bulb-${x}-${y}`} position={[(x - 2.5) * 0.8, (y - 1) * 0.8, 0.15]}>
                   <sphereGeometry args={[0.25, 8, 8]} />
                   <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
                 </mesh>
               ))
            )}
          </group>
        </group>
      ))}
    </group>
  );
}

/* ── $NEXUS Coin (Vertical Wheel) ── */
function NexusCoin() {
  const coinRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += delta;
      coinRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 + 2.5;
    }
  });

  return (
    <group ref={coinRef} position={[0, 2.5, 0]}>
      {/* Transparent Text is notoriously bad at depth testing. Adding a pure black, pure opaque blocker block precisely in the center prevents the back text from bleeding directly through! */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.23, 64]} />
        <meshBasicMaterial color="#000000" depthWrite={true} />
      </mesh>

      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.25, 64]} />
        <meshStandardMaterial color="#00ff88" metalness={0.8} roughness={0.2} emissive="#001108" transparent={true} opacity={0.9} />
      </mesh>

      <Text position={[0, 0, 0.131]} fontSize={0.6} color="#000000" anchorX="center" anchorY="middle" fillOpacity={1}>
        $NEXUS
      </Text>
      <Text position={[0, 0, -0.131]} rotation={[0, Math.PI, 0]} fontSize={0.6} color="#000000" anchorX="center" anchorY="middle" fillOpacity={1}>
        $NEXUS
      </Text>
    </group>
  );
}

/* ── Scene Wrapper ── */
function MetaverseScene() {
  return (
    <>
      <color attach="background" args={["#010302"]} />
      {/* Ambient Lighting so field is visible */}
      <ambientLight intensity={1.5} color="#e0f0ff" />
      {/* Main sun/shadow spotlight */}
      <spotLight position={[20, 40, 20]} intensity={2} color="#ffffff" castShadow penumbra={1} angle={0.5} distance={100} />
      <directionalLight position={[-10, 20, -10]} intensity={1} color="#00ff88" />
      
      <Suspense fallback={null}>
        <StadiumGrass />
        <PitchLines />
        <StadiumStands />
        <Floodlights />
        <NexusCoin />
        <Stars radius={150} depth={50} count={3000} factor={4} saturation={0.5} fade speed={0.5} />
      </Suspense>

      <OrbitControls
        makeDefault
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minPolarAngle={Math.PI / 12}
        maxDistance={120}
        minDistance={2}
      />
    </>
  );
}

/* ── Main Export ── */
export default function StadiumMetaverse({
  onClose,
  embedded = false,
}: {
  onClose?: () => void;
  embedded?: boolean;
}) {
  return (
    <div
      className={
        embedded
          ? "metaverse-embedded relative w-full h-full bg-black"
          : "metaverse-container fixed inset-0 z-[9999] bg-black w-screen h-screen"
      }
    >
      {!embedded && (
        <>
          {/* CRITICAL - Cyberpunk Exit Button Overlay */}
          <button
            onClick={onClose}
            className="fixed top-6 left-6 z-[99999] bg-black/50 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 font-orbitron font-bold text-lg cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] tracking-widest backdrop-blur-md rounded-md flex items-center gap-2"
            style={{ pointerEvents: "auto" }}
          >
            <span className="text-2xl leading-none -mt-1">✕</span> EXIT 3D
          </button>

          {/* Futuristic HUD Interlays */}
          <div className="absolute bottom-6 left-6 z-40 pointer-events-none flex items-center gap-3">
            <span className="block w-3 h-3 bg-neon-green rounded-full animate-blink shadow-neon" />
            <span className="font-share-tech text-neon-green text-sm tracking-widest uppercase">
              Live Rendering
            </span>
          </div>

          <div className="absolute bottom-6 right-6 z-40 pointer-events-none font-orbitron text-text-muted text-sm tracking-wide opacity-50">
            v1.0.0 - WIREFLUID EVM
          </div>
        </>
      )}

      {/* React Three Fiber Canvas */}
      <div className="w-full h-full relative z-10">
        <Canvas 
          camera={embedded ? { position: [0, 7, 12], fov: 42 } : { position: [0, 8, 14], fov: 45 }}
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          shadows
        >
          <MetaverseScene />
        </Canvas>
      </div>
    </div>
  );
}
