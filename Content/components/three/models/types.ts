import type { ReactNode } from "react";

export interface ModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  children?: ReactNode;
}
