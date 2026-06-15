"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function JourneyAtmosphere({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="journey-atmosphere" aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        frameloop={reducedMotion ? "demand" : "always"}
        camera={{ position: [0, 0, 5], fov: 48 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} color="#87a37f" />
        <pointLight position={[2.5, 3, 2]} intensity={8} color="#f4c96c" distance={9} />
        <FibreField count={reducedMotion ? 70 : 280} reducedMotion={reducedMotion} />
        <LightRays reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

function FibreField({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    let seed = 73;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (random() - .5) * 10;
      values[index * 3 + 1] = (random() - .5) * 6;
      values[index * 3 + 2] = (random() - .5) * 5;
    }
    return values;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y += delta * .012;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * .12) * .025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={.025} color="#f4d88d" transparent opacity={.72} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function LightRays({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.z += delta * .003;
  });
  return (
    <group ref={ref} position={[2.6, 1.8, -2]} rotation={[0, 0, -.42]}>
      {Array.from({ length: 6 }).map((_, index) => (
        <mesh key={index} position={[index * .24, 0, index * -.05]} rotation={[0, 0, index * .025]}>
          <planeGeometry args={[.16 + index * .04, 8]} />
          <meshBasicMaterial color="#f0c66d" transparent opacity={.025 + index * .004} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
