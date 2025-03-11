'use client'

import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Canvas, extend, Object3DNode, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react';
import { Mesh, MeshPhysicalMaterial } from 'three';



export const Canvas3D = () => {
  return (
    <Canvas camera={{ position: [6, 5, 10], zoom: 1 }}>
      <color attach="background" args={['#fef4ef']} />
      <ambientLight />
      <directionalLight castShadow intensity={0.6} position={[0, 1000, 1000]} />
      <Scene />
      <OrbitControls makeDefault />
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
            <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
          ))}
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        </group>
      </Environment>
    </Canvas>
  );
}




class CustomPhysicalMaterial extends MeshPhysicalMaterial {
  constructor(parameters = {}) {
    super(parameters);

    this.onBeforeCompile = (shader) => {
      //   console.log(shader.fragmentShader); // 打印整个片元着色器代码
      //   console.log(shader.vertexShader);   // 打印整个顶点着色器代码
      // 保存原始的uniforms，我们将添加新的uniforms
      shader.uniforms.time = { value: 0 };

      // 修改顶点着色器
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec2 vUv;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vUv = uv;
        `
      );

      // 修改片元着色器
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float time;
        varying vec2 vUv;
        `
      );

      // 修改output_fragment部分添加效果
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        `
        vec3 baseColor = outgoingLight;
        // 添加自定义效果
        baseColor.r += sin(vUv.x * 10.0 + time) * 0.2;
        baseColor.g += cos(vUv.y * 10.0 + time) * 0.2;
        
        gl_FragColor = vec4(baseColor, diffuseColor.a);

        `
      );

      this.userData.shader = shader;
    };
  }

  // 更新shader中的uniforms
  update(time: number) {
    if (this.userData.shader) {
      this.userData.shader.uniforms.time.value = time;
    }
  }
}

extend({ CustomPhysicalMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    customPhysicalMaterial: Object3DNode<MeshPhysicalMaterial, typeof MeshPhysicalMaterial>
  }
}

function Scene({ ...props }) {
  const materialRef = useRef<CustomPhysicalMaterial>(null);
  const meshRef = useRef<Mesh>(null);

  const material = useMemo(() => {
    return new CustomPhysicalMaterial({
      color: '#ff0000',
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3
    });
  }, []);

  useFrame(({ clock }) => {

    const time = clock.getElapsedTime();

    // 更新自定义材质的time
    if (materialRef.current) {
      materialRef.current.update(time);
    }
    // if (meshRef.current) {
    //   meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() / 2);
    //   meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() / 4);
    // }
  });

  return (
    <>
      <group {...props}>
        <mesh ref={meshRef}>
          <boxGeometry args={[10, 1, 10, 32, 2, 32]} />
          <primitive object={material} ref={materialRef} attach="material" />
        </mesh>
      </group>
    </>
  )
}


