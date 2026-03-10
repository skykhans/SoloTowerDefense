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
    levelIds: [1, 2],
  },
  2: {
    id: 2,
    name: "前线告急",
    description: "敌人强度提升，并开始出现带护盾的精英怪。",
    levelIds: [3],
  },
};
