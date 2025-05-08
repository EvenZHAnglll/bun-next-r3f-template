"use client";
import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import { useControls, button } from "leva";
import { FC, RefObject, useEffect, useRef } from "react";
import { useCameraStore } from "./cameraStore";
import CamCtrl from "camera-controls";

const CameraControl: FC = () => {
  const cameraCtrlRef = useRef<CameraControls>(null);
  const { setCameraContrl, getCurrentLookAt } = useCameraStore();

  useControls("Camera", {
    GetCamera: button(() => {
      console.log(getCurrentLookAt());
    }),
  });

  useEffect(() => {
    if (cameraCtrlRef?.current) {
      setCameraContrl(cameraCtrlRef as RefObject<CameraControls>);
    }
  }, [cameraCtrlRef, setCameraContrl]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[-6, 5, 10]}
        fov={35}
        near={0.4}
      />
      <CameraControls
        makeDefault
        ref={cameraCtrlRef}
        minPolarAngle={0.1}
        maxPolarAngle={1.4}
        maxDistance={30}
        dollyToCursor
        mouseButtons={{
          left: CamCtrl.ACTION.ROTATE,
          middle: CamCtrl.ACTION.DOLLY,
          right: CamCtrl.ACTION.SCREEN_PAN,
          wheel: CamCtrl.ACTION.DOLLY,
        }}
      />
    </>
  );
};

export { CameraControl };
