import { extend, ThreeElement, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { FC, useEffect, useRef } from "react";
import { Color, DoubleSide, ShaderMaterial } from "three";
import { CustomGridMaterial } from "./gridMaterial";

extend({ CustomGridMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements {
    customGridMaterial: ThreeElement<typeof ShaderMaterial>;
  }
}

const VFX: FC = () => {
  const dotMatRef = useRef<ShaderMaterial>(null);
  const dotMatRefBack = useRef<ShaderMaterial>(null);

  const { vfxOffset } = useControls("VFX", {
    dotColor: {
      value: "#a4c0f7",
      onChange: (e) => {
        if (dotMatRef.current?.uniforms.dotColor) {
          dotMatRef.current.uniforms.dotColor.value = new Color(e);
        }
      },
    },
    vfxOffset: {
      value: [0, 0, 0],
    },
  });

  useFrame((state) => {
    if (dotMatRef.current?.uniforms.time) {
      dotMatRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    if (dotMatRefBack.current?.uniforms.time) {
      dotMatRefBack.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    if (dotMatRefBack.current?.uniforms.secondaryOpacity) {
      dotMatRefBack.current.uniforms.secondaryOpacity.value = 0;
    }
  }, [dotMatRefBack]);

  return (
    <group position={vfxOffset}>
      {true && (
        <mesh
          position-y={0.003}
          rotation-x={-Math.PI / 2}
          name="dotGrid"
          renderOrder={1}
        >
          <planeGeometry args={[40, 40]} />
          <customGridMaterial
            ref={dotMatRef}
            transparent
            side={DoubleSide}
            // depthWrite={false}
            alphaHash={true}
          />
        </mesh>
      )}
      {true && (
        <mesh
          position-y={0.003 - 1.875}
          position-z={-3.125}
          rotation-x={0}
          name="dotGrid"
          renderOrder={1}
        >
          <planeGeometry args={[40, 40]} />

          <customGridMaterial ref={dotMatRefBack} transparent />
        </mesh>
      )}
    </group>
  );
};

export { VFX };
