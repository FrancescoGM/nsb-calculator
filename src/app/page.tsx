"use client";
import { useMemo, useState } from "react";
import { FormControl } from "../components/form-control";
import { NumberInput } from "../components/input";
import { Scroll, scrollList } from "../constants/scrolls";
import { cn } from "../utils/cn";

function mergeScrolls(activeScrolls: Scroll[]) {
  return activeScrolls.filter((s) => s.quantity > 0);
}

function calculateScroll(
  activeScrolls: Scroll[],
  type: Scroll["type"],
  stat: string
) {
  const scrolls = activeScrolls.filter(
    (s) => s.type === type && s.stat === stat
  );

  if (!scrolls) return 0;

  return scrolls.reduce((acc, s) => acc + s.quantity * s.value, 0);
}

type ScrollCardProps = {
  scroll: Scroll;
  updateScrollQuantity: (id: string, quantity: number) => void;
};

function ScrollCard({ scroll, updateScrollQuantity }: ScrollCardProps) {
  return (
    <div
      key={scroll.id}
      className={cn(
        "border rounded-lg p-2 bg-white dark:bg-zinc-900 shadow-sm",
        scroll.quantity > 0 && "border-green-400 bg: bg-green-950!"
      )}
    >
      <div className="font-semibold">{scroll.name}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {scroll.description}
      </div>

      <div className="flex gap-4">
        <FormControl className="flex items-center gap-3">
          <label className="text-sm whitespace-nowrap">Quantidade:</label>
          <NumberInput
            value={scroll.quantity}
            onChange={(e) => {
              const val = e.target.value === "" ? 0 : Number(e.target.value);
              updateScrollQuantity(scroll.id, val);
            }}
            min={0}
            className="w-8"
          />
        </FormControl>
        {scroll.quantity > 0 && (
          <button
            className="bg-red-900 w-6 h-6 rounded cursor-pointer"
            onClick={() => updateScrollQuantity(scroll.id, 0)}
          >
            x
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [level, setLevel] = useState(1);
  const [vitality, setVitality] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [power, setPower] = useState(0);
  const [protection, setProtection] = useState(0);
  const [critical, setCritical] = useState(0);
  const [dextery, setDextery] = useState(0);
  const [scrolls, setScrolls] = useState<Scroll[]>(scrollList);
  const activeScrolls = useMemo(() => mergeScrolls(scrolls), [scrolls]);

  const hpFormula = 5 * level + vitality * 30;
  const hp =
    hpFormula +
    hpFormula * calculateScroll(activeScrolls, "percentage", "hp") +
    calculateScroll(activeScrolls, "flat", "hp");
  const hpRegen =
    0.3 +
    vitality * 0.01 +
    calculateScroll(activeScrolls, "percentage", "hpRegen") / 5;

  const chakraFormula = 10 * level + energy * 50;
  const chakra =
    chakraFormula +
    chakraFormula * calculateScroll(activeScrolls, "percentage", "chakra") +
    calculateScroll(activeScrolls, "flat", "chakra");
  const chakraRegen =
    0.3 +
    energy * 0.01 +
    calculateScroll(activeScrolls, "percentage", "chakraRegen") / 5;
  const cooldownReduction =
    energy * 0.15 + calculateScroll(activeScrolls, "percentage", "cdr");

  const damageFormula = 0.2 * level + power * 1;
  const damage =
    damageFormula +
    damageFormula *
      (0 + calculateScroll(activeScrolls, "percentage", "damage")) +
    calculateScroll(activeScrolls, "flat", "damage");

  const defenseFormula = 0.05 * level + protection * 0.3;
  const defense =
    defenseFormula +
    defenseFormula *
      (0 + calculateScroll(activeScrolls, "percentage", "defense")) +
    calculateScroll(activeScrolls, "flat", "defense");
  const criticalReduction =
    protection * 0.1 +
    calculateScroll(activeScrolls, "percentage", "criticalReduction");
  const criticalChance =
    5 +
    critical * 0.2 +
    calculateScroll(activeScrolls, "percentage", "criticalChance");
  const criticalDamage =
    20 +
    critical * 0.15 +
    calculateScroll(activeScrolls, "percentage", "criticalDamage");
  const evasion =
    5 +
    dextery * 0.15 +
    calculateScroll(activeScrolls, "percentage", "evasion");
  const defensePenetrationFormula = dextery * 0.3;
  const defensePenetration =
    defensePenetrationFormula +
    defensePenetrationFormula *
      calculateScroll(activeScrolls, "percentage", "defensePenetration") +
    calculateScroll(activeScrolls, "flat", "defensePenetration");

  const updateScrollQuantity = (id: string, newQty: number) => {
    setScrolls((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: Math.max(0, newQty) } : s
      )
    );
  };

  const getScrollsByRank = (rank: "A" | "B" | "C") =>
    scrolls.filter((s) => s.rank === rank);

  return (
    <div className="flex min-h-screen py-10 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col gap-5 w[2000px]">
        <h2 className="text-4xl font-bold">Status</h2>
        <div className="flex gap-10">
          <form className="flex flex-col gap-1">
            <FormControl>
              <label>Nivel: </label>
              <NumberInput
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Vitalidade: </label>
              <NumberInput
                value={vitality}
                onChange={(e) => setVitality(Number(e.target.value))}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Energia: </label>
              <NumberInput
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Poder: </label>
              <NumberInput
                value={power}
                onChange={(e) => setPower(Number(e.target.value))}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Proteção: </label>
              <NumberInput
                value={protection}
                onChange={(e) => setProtection(Number(e.target.value))}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Crítico: </label>
              <NumberInput
                value={critical}
                onChange={(e) => setCritical(Number(e.target.value))}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Destreza: </label>
              <NumberInput
                value={dextery}
                onChange={(e) => setDextery(Number(e.target.value))}
                className="w-14"
              />
            </FormControl>
          </form>
          <div className="flex flex-col">
            <span>Vida: {hp}</span>
            <span>Regeneração de vida: {hpRegen.toFixed(2)}%</span>
            <span>Chakra: {chakra}</span>
            <span>Regeneração de chakra: {chakraRegen.toFixed(2)}%</span>
            <span>Redução de cooldown: {cooldownReduction}%</span>
            <span>Dano: {damage}</span>
            <span>Defesa: {defense}</span>
            <span>Redução de crítico: {criticalReduction}%</span>
            <span>Chance de crítico: {criticalChance}%</span>
            <span>Dano de crítico: {criticalDamage}%</span>
            <span>Esquiva: {evasion}%</span>
            <span>Penetração de defesa: {defensePenetration}</span>
          </div>
        </div>
        <section>
          <h2 className="text-4xl font-bold">Scrolls</h2>

          <div className=" text-sm text-gray-600 dark:text-gray-400 mb-4">
            Scrolls ativos:{" "}
            {activeScrolls.reduce((acc, s) => acc + s.quantity, 0)}
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">
                Rank A (Mais fortes – Tesouro Scroll A)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {getScrollsByRank("A").map((scroll) => (
                  <ScrollCard
                    key={scroll.id}
                    scroll={scroll}
                    updateScrollQuantity={updateScrollQuantity}
                  />
                ))}
              </div>
            </div>

            {/* Rank B */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                Rank B (Intermediário – Tesouro Scroll B)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {getScrollsByRank("B").map((scroll) => (
                  <ScrollCard
                    key={scroll.id}
                    scroll={scroll}
                    updateScrollQuantity={updateScrollQuantity}
                  />
                ))}
              </div>
            </div>

            {/* Rank C */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-600 dark:text-gray-500">
                Rank C (Básico – Tesouro Scroll C)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {getScrollsByRank("C").map((scroll) => (
                  <ScrollCard
                    key={scroll.id}
                    scroll={scroll}
                    updateScrollQuantity={updateScrollQuantity}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
