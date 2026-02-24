import { useMemo } from "react";
import { useStatus } from "./use-status.hook";
import { Scroll } from "@/src/constants/scrolls";
import { toFixed } from "../utils/toFixed";

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

export function Status() {
  const { stats, activeScrolls } = useStatus();

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
    <div className="flex flex-col">
      <span>Vida: {toFixed(derived.hp)}</span>
      <span>Regeneração de vida: {toFixed(derived.hpRegen)}%</span>
      <span>Chakra: {toFixed(derived.chakra)}</span>
      <span>Regeneração de chakra: {toFixed(derived.chakraRegen)}%</span>
      <span>Redução de cooldown: {toFixed(derived.cooldownReduction)}%</span>
      <span>Dano: {toFixed(derived.damage)}</span>
      <span>Defesa: {toFixed(derived.defense)}</span>
      <span>Redução de crítico: {toFixed(derived.criticalReduction)}%</span>
      <span>Chance de crítico: {toFixed(derived.criticalChance)}%</span>
      <span>Dano de crítico: {toFixed(derived.criticalDamage)}%</span>
      <span>Esquiva: {toFixed(derived.evasion)}%</span>
      <span>Penetração de defesa: {toFixed(derived.defensePenetration)}</span>
    </div>
  );
}
