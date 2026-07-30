import type { ComponentType } from "react";

export interface TestPlayProps {
  onFinish: (score: number) => void;
}

export interface TestMeta {
  id: string; // DB Test.id와 동일한 slug
  name: string;
  description: string;
  unit: string;
  Component: ComponentType<TestPlayProps>;
}
