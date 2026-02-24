"use client";
import { useState, useRef } from "react";
import { NumberInput } from "../components/input";
import { useStatus } from "./use-status.hook";
import { cn } from "../utils/cn";
import { toFixed } from "../utils/toFixed";

type JutsuLog = {
  id: number;
  totalDamage: number;
  chakraUsed: number;
  baseDamage: number;
  critDamage: number | null;
  isCrit: boolean;
};

export function JutsuSimulator() {
  const { derived } = useStatus();

  const [damageMultiplier, setDamageMultiplier] = useState(2);
  const [chakraCostMultiplier, setChakraCostMultiplier] = useState(0.93);
  const [targetDefense, setTargetDefense] = useState(0);
  const [targetCritDamageReduction, setTargetCritDamageReduction] = useState(0);

  const [logs, setLogs] = useState<JutsuLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const simulateJutsu = () => {
    const effectiveCritDamage = Math.max(
      0,
      derived.criticalDamage - targetCritDamageReduction
    );

    const isCrit = Math.random() * 100 < derived.criticalChance;
    const baseDamage = derived.damage * damageMultiplier;
    const effectiveDefense = Math.max(
      0,
      targetDefense - derived.defensePenetration < 0
        ? 0
        : targetDefense - derived.defensePenetration
    );
    const finalDamage = baseDamage;

    const chakraUsed = baseDamage * chakraCostMultiplier;
    let critDamage: number | null = 0;
    if (isCrit) {
      const critMultiplier = effectiveCritDamage / 100;
      critDamage = finalDamage + finalDamage * critMultiplier;
    }

    const newLog: JutsuLog = {
      id: Date.now(),
      chakraUsed,
      totalDamage: finalDamage + critDamage - effectiveDefense,
      baseDamage: Math.round(baseDamage * 100) / 100,
      critDamage,
      isCrit,
    };

    setLogs((prev) => [...prev, newLog]);
  };

  return (
    <section className="p-6 bg-zinc-900 rounded-lg shadow-md max-w-[600px]">
      <h2 className="text-3xl font-bold mb-6 text-white">Simulador de Jutsu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">
            Configurações do Jutsu/Alvo
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1"></label>
              Multiplicador de Dano (ex: 2.2):
              <NumberInput
                value={damageMultiplier}
                isDecimal
                onChange={(value) => {
                  setDamageMultiplier(value);
                }}
                min={0}
                className="w-full bg-zinc-800 text-white border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Multiplicador de Chakra (ex: 3.3):
              </label>
              <NumberInput
                value={chakraCostMultiplier}
                isDecimal
                onChange={(value) => setChakraCostMultiplier(value)}
                step={0.1}
                min={0}
                className="w-full bg-zinc-800 text-white border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Defesa do Alvo:
              </label>
              <NumberInput
                value={targetDefense}
                onChange={(value) => setTargetDefense(value)}
                min={0}
                className="w-full bg-zinc-800 text-white border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Redução de Crítico do Alvo (%):
              </label>
              <NumberInput
                value={targetCritDamageReduction}
                onChange={(value) => setTargetCritDamageReduction(value)}
                className="w-full bg-zinc-800 text-white border-zinc-700"
              />
            </div>

            <button
              onClick={simulateJutsu}
              className="mt-4 px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Simular Jutsu
            </button>
          </div>
        </div>

        {/* Logs/Chat */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-300">
            Logs de Simulação
          </h3>

          <div className="bg-zinc-800 p-4 rounded-md flex flex-col h-96 overflow-y-auto space-y-4">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum jutsu simulado ainda
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "p-3 rounded-md border ",
                    log.isCrit
                      ? "bg-yellow-700 border-yellow-600"
                      : "bg-zinc-700 border-zinc-600"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-white">
                      Dano Total: {toFixed(log.totalDamage)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-300">
                    <p>Chakra gasto: {toFixed(log.chakraUsed)}</p>
                    {log.isCrit && (
                      <>
                        <p>
                          Dano: {log.critDamage ? toFixed(log.baseDamage) : "-"}
                        </p>
                        <p>
                          Dano Crítico:{" "}
                          {log.critDamage ? toFixed(log.critDamage) : "-"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

          {logs.length > 0 && (
            <button
              onClick={() => setLogs([])}
              className="mt-2 text-sm text-red-400 hover:text-red-300"
            >
              Limpar Logs
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
