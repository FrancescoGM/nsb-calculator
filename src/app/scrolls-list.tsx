import { FormControl } from "../components/form-control";
import { NumberInput } from "../components/input";
import { Scroll } from "../constants/scrolls";
import { cn } from "../utils/cn";
import { useStatus } from "./use-status.hook";

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

export function ScrollsList() {
  const { scrolls, activeScrolls, updateScrollQuantity } = useStatus();

  const getScrollsByRank = (rank: "A" | "B" | "C") =>
    scrolls.filter((s) => s.rank === rank);

  return (
    <section>
      <h2 className="text-4xl font-bold">Scrolls</h2>

      <div className=" text-sm text-gray-400 mb-4">
        Scrolls ativos: {activeScrolls.reduce((acc, s) => acc + s.quantity, 0)}
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-amber-400">
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
          <h3 className="text-2xl font-bold mb-4 text-blue-400">
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
          <h3 className="text-2xl font-bold mb-4 text-gray-500">
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
  );
}
