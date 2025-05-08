"use client";

import { Box, Html, PivotControls, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PostProcess } from "@/components/r3f/postProcess";
import { CameraControl } from "@/components/r3f/cameraControl";
import { Env } from "@/components/r3f/environment";
import { Card, CardContent } from "@/components/ui/card";
import { VFX } from "@/components/r3f/vfx";

export const Canvas3D = () => {
  return (
    <Canvas shadows gl={{ alpha: true }}>
      <Env />
      <Scene />
      <CameraControl />
      <PostProcess />
      <VFX />
    </Canvas>
  );
};

function Scene({ ...props }) {
  return (
    <>
      <group {...props}>
        <PivotControls
          scale={2}
          activeAxes={[true, true, true]}
          depthTest={true}
        >
          <Sphere args={[1, 32, 32]} position={[0, 1, 0]}>
            <meshPhysicalMaterial />
          </Sphere>
        </PivotControls>
        <Box args={[2, 2, 2]} position={[2, 1, 0]}>
          <meshPhysicalMaterial />
        </Box>
        <Sphere args={[1, 32, 32]} position={[-2, 1, 0]}>
          <meshPhysicalMaterial metalness={1} roughness={0} />
        </Sphere>
      </group>

      <Html
        className="-translate-y-full -translate-x-1/2 pointer-events-auto"
        position={[0, 2.5, 0]}
      >
        <Card className="p-2 rounded-full backdrop-blur-lg bg-white/30 shadow-[0_0_25px_rgba(0,0,0,0.3)] text-white">
          <CardContent>Sphere</CardContent>
        </Card>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-3 h-3 border-b-4 border-r-4 border-gray-100 transform rotate-45 origin-center" />
      </Html>
    </>
  );
}
