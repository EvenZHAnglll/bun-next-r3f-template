import {
  EffectComposer,
  N8AO,
  Bloom,
  Vignette,
  SMAA,
} from "@react-three/postprocessing";
import { useControls } from "leva";
import { FC, Suspense } from "react";

const PostProcess: FC = () => {
  const { bloom, vignette, smaa, n8ao } = useControls("PostProcess", {
    bloom: { value: true },
    vignette: { value: true },
    smaa: { value: true },
    n8ao: { value: true },
  });
  return (
    <Suspense fallback={null}>
      <EffectComposer multisampling={0}>
        <>{smaa && <SMAA />}</>
        <>
          {n8ao && (
            <N8AO
              color="black"
              aoRadius={2}
              intensity={1}
              aoSamples={6}
              denoiseSamples={4}
            />
          )}
        </>

        <>
          {bloom && (
            <Bloom mipmapBlur levels={7} intensity={1} luminanceThreshold={1} />
          )}
        </>

        <>{vignette && <Vignette />}</>
      </EffectComposer>
    </Suspense>
  );
};

export { PostProcess };
