// The 3D scene is inspired by https://codesandbox.io/s/ju368j
"use client";

import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  OrbitControls,
  PivotControls,
  RoundedBox,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";
import { useControls } from "leva";

export const Canvas3DStats = () => {
  return (
    <>
      <Canvas3D />
      <Stats />
    </>
  );
};

export const Canvas3D = () => {
  return (
    <Canvas orthographic camera={{ position: [6, -5, 10], zoom: 60 }}>
      <color attach="background" args={["#fef4ef"]} />
      <ambientLight />
      <directionalLight castShadow intensity={0.6} position={[0, 1000, 1000]} />
      <Scene scale={0.01} />
      <OrbitControls makeDefault />
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Lightformer
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
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
      </Environment>
      <EffectComposer>
        <N8AO
          halfRes
          color="black"
          aoRadius={2}
          intensity={1}
          aoSamples={6}
          denoiseSamples={4}
        />
        <Bloom mipmapBlur levels={7} intensity={1} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
};

function Scene({ ...props }) {
  const config = useControls({
    backside: false,
    samples: { value: 16, min: 1, max: 32, step: 1 },
    resolution: { value: 256, min: 64, max: 2048, step: 64 },
    transmission: { value: 0.95, min: 0, max: 1 },
    roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 0.4, min: 0, max: 1, step: 0.01 },
    clearcoatRoughness: { value: 0.1, min: 0, max: 1, step: 0.01 },
    thickness: { value: 200, min: 0, max: 200, step: 0.01 },
    backsideThickness: { value: 200, min: 0, max: 200, step: 0.01 },
    ior: { value: 1.5, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 1, min: 0, max: 1 },
    anisotropy: { value: 1, min: 0, max: 10, step: 0.01 },
    distortion: { value: 0, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.2, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
    attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
    attenuationColor: "#ffffff",
    color: "#ffffff",
  });
  return (
    <>
      <group {...props}>
        <PivotControls
          scale={2}
          activeAxes={[true, true, false]}
          offset={[0, 0, 100]}
        >
          <Shape name="Torus" float={0} color="#fef4ef" config={config} />
        </PivotControls>
        <Shape
          name="Rectangle 6"
          color="#FF718F"
          config={config}
          position={[-700.64, 343.77, -621.72]}
        />
        <Shape
          name="Rectangle 5"
          color="#29C1A2"
          config={config}
          position={[-458.87, 411.05, -330.92]}
        />
        <Shape
          name="Rectangle 4"
          color="#FF9060"
          config={config}
          position={[0.66, 47, -435.92]}
        />
        <Shape
          name="Rectangle 3"
          color="#823FFF"
          config={config}
          position={[-348.74, -162.23, -167.36]}
        />
        <Shape
          name="Rectangle 2"
          color="skyblue"
          config={config}
          position={[242.6, 207, -273.39]}
        />
      </group>
    </>
  );
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
function Shape({ float = 300, color, config, ...props }: any) {
  return (
    <Float floatIntensity={float} rotationIntensity={0} speed={2}>
      <RoundedBox
        renderOrder={100}
        args={[400, 400, 100]}
        radius={10}
        {...props}
      >
        <MeshTransmissionMaterial
          {...config}
          color={color}
          toneMapped={false}
        />
      </RoundedBox>
    </Float>
  );
}
