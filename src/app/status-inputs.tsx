import { FormControl } from "../components/form-control";
import { NumberInput } from "../components/input";
import { JutsuSimulator } from "./jutsu-simulator";
import { Status } from "./status";
import { useStatus } from "./use-status.hook";

export function StatusInputs() {
  const { stats, setStat, availablePoints } = useStatus();
  return (
    <div className="flex justify-between">
      <div>
        <h2 className="text-4xl font-bold">Status</h2>
        <div className="flex gap-10">
          <form className="flex flex-col gap-1">
            <span>Pontos disponíveis: {availablePoints}</span>
            <FormControl>
              <label>Nivel: </label>
              <NumberInput
                value={stats.level}
                onChange={(value) => setStat("level", value)}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Vitalidade: </label>
              <NumberInput
                value={stats.vitality}
                onChange={(value) => setStat("vitality", value)}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Energia: </label>
              <NumberInput
                value={stats.energy}
                max={100}
                min={0}
                onChange={(value) => setStat("energy", value)}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Poder: </label>
              <NumberInput
                value={stats.power}
                onChange={(value) => setStat("power", value)}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Proteção: </label>
              <NumberInput
                value={stats.protection}
                onChange={(value) => setStat("protection", value)}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Crítico: </label>
              <NumberInput
                value={stats.critical}
                onChange={(value) => setStat("critical", value)}
                className="w-14"
              />
            </FormControl>
            <FormControl>
              <label>Destreza: </label>
              <NumberInput
                value={stats.dexterity}
                onChange={(value) => setStat("dexterity", value)}
                className="w-14"
              />
            </FormControl>
          </form>
          <Status />
        </div>
      </div>
      <JutsuSimulator />
    </div>
  );
}
