import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { useControls } from "leva";
import { FC, useState } from "react";

const Env: FC = () => {
  const [preset, setPreset] = useState<
    | "sunset"
    | "dawn"
    | "night"
    | "warehouse"
    | "forest"
    | "apartment"
    | "studio"
    | "city"
    | "park"
    | "lobby"
  >("sunset");
  const { bg_color, lightformer } = useControls("Environment", {
    bg_color: { value: "#050e20" },
    lightformer: { value: false },
    preset: {
      value: preset,
      options: [
        "sunset",
        "dawn",
        "night",
        "warehouse",
        "forest",
        "apartment",
        "studio",
        "city",
        "park",
        "lobby",
      ],
      onChange: (value) => setPreset(value),
    },
  });
  const {
    mixStrength,
    depthScale,
    minDepthThreshold,
    maxDepthThreshold,
    metalness,
    roughness,
  } = useControls("Reflector", {
    mixStrength: { value: 20 },
    depthScale: { value: 1 },
    minDepthThreshold: { value: 0.4 },
    maxDepthThreshold: { value: 1.1 },
    metalness: { value: 0.6 },
    roughness: { value: 1 },
  });
  return (
    <>
      <Environment
        resolution={256}
        preset={preset}
        environmentIntensity={0.5}
        environmentRotation={[0, Math.PI, 0]}
      >
        {lightformer && (
          <group rotation={[-Math.PI / 2, 0, 0]}>
            {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
              <Lightformer
                key={i}
                form="circle"
                intensity={4}
                rotation={[Math.PI / 2, 0, 0]}
                position={[x, 4, i * 4]}
                scale={[4, 1, 1]}
              />
            ))}
            <Lightformer
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, 1, -1]}
              scale={[50, 2, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, -1, -1]}
              scale={[50, 2, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={-Math.PI / 2}
              position={[10, 1, 0]}
              scale={[50, 2, 1]}
            />
          </group>
        )}
      </Environment>
      <color attach="background" args={[bg_color]} />
      <fog attach="fog" args={[bg_color, 25, 35]} />
      {/* <ambientLight /> */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[400, 300]}
          mixBlur={1}
          resolution={1024}
          mixStrength={mixStrength}
          depthScale={depthScale}
          minDepthThreshold={minDepthThreshold}
          maxDepthThreshold={maxDepthThreshold}
          color={bg_color}
          metalness={metalness}
          roughness={roughness}
          mirror={0}
        />
      </mesh>
    </>
  );
};

export { Env };
