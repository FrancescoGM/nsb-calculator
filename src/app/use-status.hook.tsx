"use client";
import { Scroll, scrollList } from "@/src/constants/scrolls";
import { createContext } from "@/src/utils/context";
import { ReactNode, useMemo, useReducer, useState } from "react";

type StatKey =
  | "level"
  | "vitality"
  | "energy"
  | "power"
  | "protection"
  | "critical"
  | "dexterity";

type StatsState = Record<StatKey, number>;

type Derived = {
  hp: number;
  hpRegen: number;
  chakra: number;
  chakraRegen: number;
  cooldownReduction: number;
  damage: number;
  defense: number;
  criticalReduction: number;
  criticalChance: number;
  criticalDamage: number;
  evasion: number;
  defensePenetration: number;
};

const initialStats: StatsState = {
  level: 1,
  vitality: 0,
  energy: 0,
  power: 0,
  protection: 0,
  critical: 0,
  dexterity: 0,
};

interface UseStatusContext {
  stats: StatsState;
  setStat: (key: StatKey, val: number) => void;
  availablePoints: number;
  derived: Derived;

  scrolls: Scroll[];
  updateScrollQuantity: (id: string, value: number) => void;
  activeScrolls: Scroll[];
}

const [Provider, useStatus] = createContext<UseStatusContext>({
  name: "StatusContext",
  strict: true,
  errorMessage: "useStatus must be within a StatusProvider",
});

export { useStatus };

type StatAction =
  | { type: "SET_STAT"; payload: { key: StatKey; value: number } }
  | { type: "RESET_STATS" }
  | { type: "RESET_ONLY_STATUS" };

function statsReducer(state: StatsState, action: StatAction): StatsState {
  switch (action.type) {
    case "SET_STAT": {
      const { key, value } = action.payload;

      let newValue = Number(value);
      if (isNaN(newValue)) {
        newValue = 0;
      }

      newValue = Math.max(0, newValue);
      newValue = Math.min(100, newValue);

      if (key === "level") {
        newValue = Math.max(1, newValue);
      }

      return {
        ...state,
        [key]: newValue,
      };
    }

    case "RESET_ONLY_STATUS":
      return { ...initialStats, level: state.level };
    case "RESET_STATS":
      return { ...initialStats };

    default:
      return state;
  }
}

function calculateScrollBonus(
  activeScrolls: Scroll[],
  type: Scroll["type"],
  stat: string
): number {
  const matching = activeScrolls.filter(
    (s) => s.type === type && s.stat === stat
  );
  return matching.reduce((sum, s) => sum + s.quantity * s.value, 0);
}

const getPercent = (active: Scroll[], stat: string) =>
  calculateScrollBonus(active, "percentage", stat);

const getFlat = (active: Scroll[], stat: string) =>
  calculateScrollBonus(active, "flat", stat);

interface StatusProviderProps {
  children?: ReactNode;
}

export function StatusProvider({ children }: StatusProviderProps) {
  const [stats, dispatch] = useReducer(statsReducer, initialStats);
  const totalPoints = useMemo(() => stats.level * 3, [stats.level]);
  const [scrolls, setScrolls] = useState<Scroll[]>(scrollList);
  const activeScrolls = useMemo(
    () => scrolls.filter((s) => s.quantity > 0),
    [scrolls]
  );

  const updateScrollQuantity = (id: string, newQty: number) => {
    setScrolls((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: Math.max(0, newQty) } : s
      )
    );
  };

  const spentPoints = useMemo(
    () =>
      stats.vitality +
      stats.energy +
      stats.power +
      stats.protection +
      stats.critical +
      stats.dexterity,
    [stats]
  );

  const availablePoints = totalPoints - spentPoints;

  const setStat = (key: keyof StatsState, value: number) => {
    const current = stats[key];
    const delta = value - current;

    if (key === "level") {
      dispatch({
        type: "RESET_ONLY_STATUS",
      });
    }

    if (delta > 0 && delta > availablePoints && key !== "level") {
      dispatch({
        type: "SET_STAT",
        payload: { key, value: current + availablePoints },
      });
      return;
    }

    dispatch({
      type: "SET_STAT",
      payload: { key, value },
    });
  };

  const derived = useMemo(() => {
    const p = (stat: string) => getPercent(activeScrolls, stat);
    const f = (stat: string) => getFlat(activeScrolls, stat);

    const hpBase = 5 * stats.level + stats.vitality * 30;
    const chakraBase = 10 * stats.level + stats.energy * 50;
    const dmgBase = 0.2 * stats.level + stats.power * 1;
    const defBase = 0.05 * stats.level + stats.protection * 0.3;
    const penBase = stats.dexterity * 0.3;

    return {
      hp: hpBase * (1 + p("hp")) + f("hp"),
      hpRegen: 0.3 + stats.vitality * 0.01 + p("hpRegen"),
      chakra: chakraBase * (1 + p("chakra")) + f("chakra"),
      chakraRegen: 0.3 + stats.energy * 0.01 + p("chakraRegen"),
      cooldownReduction: stats.energy * 0.15 + p("cdr"),
      damage: dmgBase * (1 + p("damage")) + f("damage"),
      defense: defBase * (1 + p("defense")) + f("defense"),
      criticalReduction: stats.protection * 0.1 + p("criticalReduction"),
      criticalChance: 5 + stats.critical * 0.2 + p("criticalChance"),
      criticalDamage: 20 + stats.critical * 0.15 + p("criticalDamage"),
      evasion: 5 + stats.dexterity * 0.15 + p("evasion"),
      defensePenetration:
        penBase * (1 + p("defensePenetration")) + f("defensePenetration"),
    };
  }, [activeScrolls, stats]);

  return (
    <Provider
      value={{
        stats,
        setStat,
        derived,
        scrolls,
        updateScrollQuantity,
        activeScrolls,
        availablePoints,
      }}
    >
      {children}
    </Provider>
  );
}
