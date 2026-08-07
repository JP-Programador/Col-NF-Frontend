import { RotateCcw } from "lucide-react";

const EMPTY_FILTERS = {
  date_from: "",
  date_to: "",
  category_id: "",
  cost_center_id: "",
  branch_id: "",
};

export default function DashboardFilters({ filters, onChange, categories, costCenters, branches }) {
  const update = (field, value) => onChange({ ...filters, [field]: value });
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="card grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">De</label>
        <input
          type="date"
          className="input-field"
          value={filters.date_from}
          onChange={(e) => update("date_from", e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Ate</label>
        <input
          type="date"
          className="input-field"
          value={filters.date_to}
          onChange={(e) => update("date_to", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Categoria</label>
        <select
          className="input-field"
          value={filters.category_id}
          onChange={(e) => update("category_id", e.target.value)}
        >
          <option value="">Todas</option>
          {(categories || []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Centro de Custo</label>
        <select
          className="input-field"
          value={filters.cost_center_id}
          onChange={(e) => update("cost_center_id", e.target.value)}
        >
          <option value="">Todos</option>
          {(costCenters || []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Filial</label>
        <select
          className="input-field"
          value={filters.branch_id}
          onChange={(e) => update("branch_id", e.target.value)}
        >
          <option value="">Todas</option>
          {(branches || []).map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          disabled={!hasActiveFilters}
          className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={14} /> Limpar filtros
        </button>
      </div>
    </div>
  );
}

export { EMPTY_FILTERS };
