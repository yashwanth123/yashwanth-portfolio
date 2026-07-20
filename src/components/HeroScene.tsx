"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const mouseTarget = { x: 0, y: 0 };
const mouseCurrent = { x: 0, y: 0 };

function MouseLerp() {
  useFrame(() => {
    mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
    mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;
  });

  return null;
}

function sampleTorusPoint(): THREE.Vector3 {
  const u = Math.random() * Math.PI * 2;
  const v = Math.random() * Math.PI * 2;
  const R = 0.72;
  const r = 0.28 + Math.random() * 0.08;
  const x = (R + r * Math.cos(v)) * Math.cos(u);
  const y = (R + r * Math.cos(v)) * Math.sin(u);
  const z = r * Math.sin(v) + (Math.random() - 0.5) * 0.12;

  return new THREE.Vector3(x, y, z);
}

function ParticleTorus() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 7500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color("#22d3ee");
    const teal = new THREE.Color("#2dd4bf");
    const gold = new THREE.Color("#fbbf24");
    const white = new THREE.Color("#ecfeff");

    for (let i = 0; i < count; i += 1) {
      const point = sampleTorusPoint();
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;

      const mix = Math.random();
      const color =
        mix < 0.12 ? white : mix < 0.45 ? cyan : mix < 0.78 ? teal : gold;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.x = mouseCurrent.y * 0.4 + t * 0.06;
    pointsRef.current.rotation.y = mouseCurrent.x * 0.55 + t * 0.1;
    pointsRef.current.position.y = Math.sin(t * 0.6) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.011}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function WireframeIcosahedron() {
  const meshRef = useRef<THREE.LineSegments>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.x = mouseCurrent.y * 0.25 + t * 0.15;
      meshRef.current.rotation.y = mouseCurrent.x * 0.35 + t * 0.2;
      meshRef.current.rotation.z = t * 0.05;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x = -mouseCurrent.y * 0.2 - t * 0.12;
      innerRef.current.rotation.y = -mouseCurrent.x * 0.25 - t * 0.18;
      const pulse = 1 + Math.sin(t * 1.2) * 0.06;
      innerRef.current.scale.setScalar(pulse);
    }
  });

  const edges = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.42, 1);
    return new THREE.EdgesGeometry(geo);
  }, []);

  return (
    <group>
      <lineSegments ref={meshRef} geometry={edges}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </lineSegments>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color="#2dd4bf"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function AmbientParticles() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 900;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;
    }

    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      state.clock.elapsedTime * 0.015 + mouseCurrent.x * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.0035}
        color="#67e8f9"
        transparent
        opacity={0.2}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent() {
  return (
    <>
      <MouseLerp />
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 4]} intensity={1.4} color="#22d3ee" />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#fbbf24" />
      <pointLight position={[0, -3, 3]} intensity={0.5} color="#2dd4bf" />
      <AmbientParticles />
      <ParticleTorus />
      <WireframeIcosahedron />
    </>
  );
}

export function HeroScene() {
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      mouseTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseTarget.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    mouseTarget.x = 0;
    mouseTarget.y = 0;
  }, []);

  return (
    <div
      className="absolute inset-0 h-full w-full"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 52 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
