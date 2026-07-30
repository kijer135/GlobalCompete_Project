import type { TestMeta } from "./types";
import { ReactionTimeTest } from "./plugins/ReactionTimeTest";
import { CpsTest } from "./plugins/CpsTest";

/** 새 테스트는 plugins/에 컴포넌트를 만들고 여기에 1줄 등록한다. */
export const testRegistry: Record<string, TestMeta> = {
  "reaction-time": {
    id: "reaction-time",
    name: "반응속도",
    description: "화면이 초록색이 되면 최대한 빨리 클릭하세요. 5회 평균을 측정합니다.",
    unit: "ms",
    Component: ReactionTimeTest,
  },
  cps: {
    id: "cps",
    name: "클릭 속도",
    description: "10초 동안 최대한 많이 클릭하세요. 초당 클릭 수(CPS)를 측정합니다.",
    unit: "cps",
    Component: CpsTest,
  },
};
