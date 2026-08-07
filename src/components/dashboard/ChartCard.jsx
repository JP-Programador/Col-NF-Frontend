import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChartCard({ title, subtitle, children }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);

  return (
    <div className="card min-w-0">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-colgate-graphite">{title}</h3>
          {subtitle && <p className="truncate text-xs text-gray-400">{subtitle}</p>}
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-colgate-graphite"
          aria-label={`Expandir ${title}`}
          title="Expandir grafico"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="h-56 w-full sm:h-64 md:h-72">{children}</div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setExpanded(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white p-4 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-colgate-graphite">{title}</h3>
                {subtitle && <p className="truncate text-xs text-gray-400">{subtitle}</p>}
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-colgate-graphite"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="h-[60vh] max-h-[600px] w-full">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
