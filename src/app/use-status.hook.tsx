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

  return (
    <Provider
      value={{
        stats,
        setStat,
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
