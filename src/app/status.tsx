import { useStatus } from "./use-status.hook";
import { toFixed } from "../utils/toFixed";

export function Status() {
  const { derived } = useStatus();

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
