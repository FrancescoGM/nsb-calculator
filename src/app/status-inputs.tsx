import { FormControl } from "../components/form-control";
import { NumberInput } from "../components/input";
import { Status } from "./status";
import { useStatus } from "./use-status.hook";

export function StatusInputs() {
  const { stats, setStat, availablePoints } = useStatus();
  return (
    <div>
      <h2 className="text-4xl font-bold">Status</h2>
      <div className="flex gap-10">
        <form className="flex flex-col gap-1">
          <span>Pontos disponíveis: {availablePoints}</span>
          <FormControl>
            <label>Nivel: </label>
            <NumberInput
              value={stats.level}
              onChange={(e) => setStat("level", Number(e.target.value))}
              className="w-14"
            />
          </FormControl>
          <FormControl>
            <label>Vitalidade: </label>
            <NumberInput
              value={stats.vitality}
              onChange={(e) => setStat("vitality", Number(e.target.value))}
              className="w-14"
            />
          </FormControl>
          <FormControl>
            <label>Energia: </label>
            <NumberInput
              value={stats.energy}
              max={100}
              min={0}
              onChange={(e) => setStat("energy", Number(e.target.value))}
              className="w-14"
            />
          </FormControl>
          <FormControl>
            <label>Poder: </label>
            <NumberInput
              value={stats.power}
              onChange={(e) => setStat("power", Number(e.target.value))}
              className="w-14"
            />
          </FormControl>
          <FormControl>
            <label>Proteção: </label>
            <NumberInput
              value={stats.protection}
              onChange={(e) => setStat("protection", Number(e.target.value))}
              className="w-14"
            />
          </FormControl>
          <FormControl>
            <label>Crítico: </label>
            <NumberInput
              value={stats.critical}
              onChange={(e) => setStat("critical", Number(e.target.value))}
              className="w-14"
            />
          </FormControl>
          <FormControl>
            <label>Destreza: </label>
            <NumberInput
              value={stats.dexterity}
              onChange={(e) => setStat("dexterity", Number(e.target.value))}
              className="w-14"
            />
          </FormControl>
        </form>
        <Status />
      </div>
    </div>
  );
}
