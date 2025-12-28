
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial, PerspectiveCamera, PresentationControls, Sphere, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Balloon = ({ position, color }: { position: [number, number, number], color: string }) => {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* String */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1.2]} />
        <meshStandardMaterial color="white" transparent opacity={0.3} />
      </mesh>
    </Float>
  );
};

const BirthdayCake = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Cake Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.8, 32]} />
        <meshStandardMaterial color="#fce7f3" />
      </mesh>
      {/* Icing Top */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.15, 32]} />
        <meshStandardMaterial color="#ec4899" />
      </mesh>
      {/* Candles */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 0.7;
        const z = Math.sin(angle) * 0.7;
        return (
          <group key={i} position={[x, 0.7, z]}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
              <meshStandardMaterial color="#8b5cf6" />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <Sphere args={[0.04, 16, 16]}>
                <MeshWobbleMaterial factor={0.5} speed={10} color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
              </Sphere>
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const ParticleField = () => {
  const count = 800;
  const mesh = useRef<THREE.Points>(null!);
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 20;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 20;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return temp;
  }, []);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.0008;
      mesh.current.rotation.z += 0.0003;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ec4899" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

const GiftBox = ({ open }: { open: boolean }) => {
  const group = useRef<THREE.Group>(null!);
  useFrame(() => { if (group.current) group.current.rotation.y += 0.01; });

  return (
    <PresentationControls global rotation={[0, 0.3, 0]} polar={[-0.4, 0.2]} azimuth={[-0.4, 0.4]}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={group} scale={1.2}>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#8b5cf6" roughness={0.2} metalness={0.7} />
          </mesh>
          <mesh position={[0, open ? 1.5 : 0.3, 0]} rotation={[open ? -0.8 : 0, 0, 0]}>
            <boxGeometry args={[1.6, 0.3, 1.6]} />
            <meshStandardMaterial color="#ec4899" roughness={0.2} metalness={0.7} />
          </mesh>
          {/* Ribbon */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[1.55, 0.3, 1.55]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.3, 1.55, 1.55]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </group>
      </Float>
    </PresentationControls>
  );
};

export const Scene3D: React.FC<{ currentStep: number, isGiftOpen: boolean }> = ({ currentStep, isGiftOpen }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, 5]} color="#ec4899" intensity={1.5} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={2} />
        <ParticleField />
        
        {currentStep === 1 && (
          <>
            <Balloon position={[-3, 1, -2]} color="#ef4444" />
            <Balloon position={[3, 2, -1]} color="#3b82f6" />
            <Balloon position={[-2, -2, 0]} color="#10b981" />
            <Balloon position={[2.5, -1.5, -2]} color="#f59e0b" />
          </>
        )}

        {currentStep === 4 && <GiftBox open={isGiftOpen} />}
        
        {(currentStep === 1 || currentStep === 5) && (
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <BirthdayCake />
          </Float>
        )}
        
        <mesh position={[0, 0, -5]} scale={15}>
          <planeGeometry args={[2, 2]} />
          <MeshDistortMaterial color="#0f0524" speed={3} distort={0.3} radius={1} transparent opacity={0.4} />
        </mesh>
      </Canvas>
    </div>
  );
};
