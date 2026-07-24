"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ProjectVisual } from "@/lib/site-config";

type ProjectSceneProps = {
  visual: ProjectVisual;
  active?: boolean;
};

function AgentNodes() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * 0.55, Math.sin(angle) * 0.35, Math.sin(angle * 2) * 0.2);
    });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.35;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.15;
  });

  return (
    <group ref={group}>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#22d3ee" : "#fbbf24"}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh>
        <torusGeometry args={[0.55, 0.01, 8, 64]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.01, 8, 48]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function OrbitRings() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.45;
    group.current.rotation.z = t * 0.12;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.95} />
      </mesh>
      {[0.4, 0.55, 0.7].map((radius, i) => (
        <mesh key={radius} rotation={[Math.PI / 2.4, i * 0.4, i * 0.25]}>
          <torusGeometry args={[radius, 0.012, 8, 64]} />
          <meshBasicMaterial
            color={i === 1 ? "#fbbf24" : "#2dd4bf"}
            transparent
            opacity={0.75 - i * 0.08}
          />
        </mesh>
      ))}
      <mesh position={[0.7, 0, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

function LatticeGrid() {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let x = -1; x <= 1; x += 1) {
      for (let y = -1; y <= 1; y += 1) {
        for (let z = -1; z <= 1; z += 1) {
          arr.push(new THREE.Vector3(x * 0.28, y * 0.28, z * 0.28));
        }
      }
    }
    return arr;
  }, []);
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.56, 0.56, 0.56)),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.x = t * 0.25;
    group.current.rotation.y = t * 0.4;
  });

  return (
    <group ref={group}>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#22d3ee" : "#67e8f9"}
            transparent
            opacity={0.75}
          />
        </mesh>
      ))}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#67e8f9" transparent opacity={0.7} />
      </lineSegments>
    </group>
  );
}

function ScanDisc() {
  const group = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.x = -0.55;
      group.current.rotation.z = Math.sin(t * 0.3) * 0.08;
    }
    if (sweep.current) {
      sweep.current.rotation.z = t * 1.4;
    }
  });

  return (
    <group ref={group}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.72, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={sweep} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.72, 48, 1, 0, Math.PI / 3]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function NetworkGraph() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => {
    return [
      [0, 0.35, 0],
      [-0.45, -0.1, 0.2],
      [0.45, -0.05, 0.15],
      [-0.2, -0.4, -0.15],
      [0.25, -0.35, -0.2],
      [0, 0.05, -0.4],
    ].map((p) => new THREE.Vector3(...p));
  }, []);

  const linePositions = useMemo(() => {
    const pairs = [
      [0, 1],
      [0, 2],
      [0, 5],
      [1, 3],
      [2, 4],
      [3, 4],
      [1, 5],
      [2, 5],
    ];
    const arr = new Float32Array(pairs.length * 6);
    pairs.forEach(([a, b], i) => {
      arr[i * 6] = nodes[a].x;
      arr[i * 6 + 1] = nodes[a].y;
      arr[i * 6 + 2] = nodes[a].z;
      arr[i * 6 + 3] = nodes[b].x;
      arr[i * 6 + 4] = nodes[b].y;
      arr[i * 6 + 5] = nodes[b].z;
    });
    return arr;
  }, [nodes]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.3;
    group.current.rotation.x = Math.sin(t * 0.5) * 0.2;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#67e8f9" transparent opacity={0.8} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshBasicMaterial color={i === 0 ? "#fbbf24" : "#a5f3fc"} />
        </mesh>
      ))}
    </group>
  );
}

function PulseWaves() {
  const rings = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rings.current) return;
    const t = state.clock.elapsedTime;
    rings.current.children.forEach((child, i) => {
      const scale = 0.4 + ((t * 0.7 + i * 0.35) % 1.4);
      child.scale.setScalar(scale);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.75 - scale * 0.3);
    });
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={1} />
      </mesh>
      <group ref={rings}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.22, 0.28, 48]} />
            <meshBasicMaterial
              color="#67e8f9"
              transparent
              opacity={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CoreCrystal() {
  const mesh = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.35;
      mesh.current.rotation.y = t * 0.55;
      const pulse = 1 + Math.sin(t * 2) * 0.06;
      mesh.current.scale.setScalar(pulse);
    }
    if (shell.current) {
      shell.current.rotation.x = -t * 0.2;
      shell.current.rotation.y = t * 0.3;
    }
  });

  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.55, 0)), []);

  return (
    <group>
      <mesh ref={mesh}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshBasicMaterial color="#fcd34d" transparent opacity={0.9} wireframe />
      </mesh>
      <lineSegments ref={shell} geometry={edges}>
        <lineBasicMaterial color="#67e8f9" transparent opacity={0.75} />
      </lineSegments>
    </group>
  );
}

function HelixRibbon() {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const count = 220;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#22d3ee");
    const c2 = new THREE.Color("#fbbf24");

    for (let i = 0; i < count; i += 1) {
      const t = i / count;
      const angle = t * Math.PI * 6;
      positions[i * 3] = Math.cos(angle) * 0.35;
      positions[i * 3 + 1] = (t - 0.5) * 1.2;
      positions[i * 3 + 2] = Math.sin(angle) * 0.35;
      const color = c1.clone().lerp(c2, t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.5;
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
        size={0.05}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function VisualContent({ visual }: { visual: ProjectVisual }) {
  switch (visual) {
    case "agent":
      return <AgentNodes />;
    case "orbit":
      return <OrbitRings />;
    case "lattice":
      return <LatticeGrid />;
    case "scan":
      return <ScanDisc />;
    case "network":
      return <NetworkGraph />;
    case "pulse":
      return <PulseWaves />;
    case "helix":
      return <HelixRibbon />;
    case "core":
    default:
      return <CoreCrystal />;
  }
}

const VISUAL_CYCLE: ProjectVisual[] = [
  "agent",
  "orbit",
  "lattice",
  "scan",
  "network",
  "pulse",
  "core",
  "helix",
];

export function visualFromName(name: string): ProjectVisual {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % VISUAL_CYCLE.length;
  }
  return VISUAL_CYCLE[hash];
}

export function ProjectScene({ visual, active = true }: ProjectSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="project-visual absolute inset-0" aria-hidden>
      <div className="project-visual-glow" />
      {visible && active ? (
        <Canvas
          camera={{ position: [0, 0, 1.45], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <ambientLight intensity={1.05} />
          <pointLight position={[2, 2, 3]} intensity={2.4} color="#ecfeff" />
          <pointLight position={[-2, -1, 2]} intensity={1.6} color="#fde68a" />
          <group scale={1.45} position={[0, 0.02, 0]}>
            <VisualContent visual={visual} />
          </group>
        </Canvas>
      ) : (
        <div className="project-visual-fallback absolute inset-0" />
      )}
    </div>
  );
}
