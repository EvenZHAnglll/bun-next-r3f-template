"use cilent";
import { CameraControls } from "@react-three/drei";
import { RefObject } from "react";
import { Vector3 } from "three";
import { create } from "zustand";

interface CameraState {
  cameraContrl: RefObject<CameraControls> | null;
  setCameraContrl: (newCameraContrl: RefObject<CameraControls>) => void;
  getCurrentLookAt: () => {
    position: Vector3;
    target: Vector3;
  };
  setLookAt: (position: Vector3, target: Vector3) => void;
  zoomTo: (zoom: number) => void;
  getCameraContrl: () => RefObject<CameraControls> | null;
  labelRoot: RefObject<HTMLDivElement> | undefined;
  setLabelRoot: (newLabelRoot: RefObject<HTMLDivElement>) => void;
}

export const useCameraStore = create<CameraState>()((set, get) => ({
  cameraContrl: null,
  setCameraContrl: (newCameraContrl) => set({ cameraContrl: newCameraContrl }),
  getCurrentLookAt: () => {
    // for getting the current look at position for debugging
    const positionVector = new Vector3();
    const targetVector = new Vector3();

    return {
      position:
        get().cameraContrl?.current?.getPosition(positionVector, true) ||
        positionVector,
      target:
        get().cameraContrl?.current?.getTarget(targetVector, true) ||
        targetVector,
    };
  },
  setLookAt: (position: Vector3, target: Vector3) => {
    get().cameraContrl?.current?.setLookAt(
      position.x,
      position.y,
      position.z,
      target.x,
      target.y,
      target.z,
      true
    );
  },
  zoomTo: (zoom) => {
    get().cameraContrl?.current?.zoomTo(zoom, true);
  },
  getCameraContrl: () => get().cameraContrl,
  labelRoot: undefined,
  setLabelRoot: (newLabelRoot) => set({ labelRoot: newLabelRoot }),
}));
