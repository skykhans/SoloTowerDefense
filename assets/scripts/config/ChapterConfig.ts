export interface ChapterDefinition {
  id: number;
  name: string;
  description: string;
  levelIds: number[];
}

export const CHAPTER_CONFIG: Record<number, ChapterDefinition> = {
  1: {
    id: 1,
    name: "边境守卫",
    description: "熟悉基础建塔、开波和升级循环。",
    levelIds: [1, 2, 3],
  },
  2: {
    id: 2,
    name: "前线告急",
    description: "敌人数量和强度同步抬升，需要更稳定的中期火力。",
    levelIds: [4, 5, 6],
  },
  3: {
    id: 3,
    name: "钢铁风暴",
    description: "长线守关与高压波次，要求更完整的炮塔搭配。",
    levelIds: [7, 8, 9],
  },
};
