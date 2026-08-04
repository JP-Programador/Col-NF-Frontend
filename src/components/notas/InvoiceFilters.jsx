import { Search } from "lucide-react";

export default function InvoiceFilters({ filters, onChange, categories, costCenters, branches }) {
  const update = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <div className="card grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <div className="relative lg:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          className="input-field pl-9"
          placeholder="Numero, fornecedor, CNPJ ou valor"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>

      <select className="input-field" value={filters.invoice_type} onChange={(e) => update("invoice_type", e.target.value)}>
        <option value="">Todos os tipos</option>
        <option value="NFSE">NFS-e</option>
        <option value="NFE">NF-e</option>
        <option value="RECIBO">Recibo</option>
      </select>

      <select className="input-field" value={filters.payment_status} onChange={(e) => update("payment_status", e.target.value)}>
        <option value="">Todos os status</option>
        <option value="aberta">Aberta</option>
        <option value="paga">Paga</option>
        <option value="vencida">Vencida</option>
      </select>

      <select className="input-field" value={filters.category_id} onChange={(e) => update("category_id", e.target.value)}>
        <option value="">Todas as categorias</option>
        {(categories || []).map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select className="input-field" value={filters.cost_center_id} onChange={(e) => update("cost_center_id", e.target.value)}>
        <option value="">Todos os centros de custo</option>
        {(costCenters || []).map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select className="input-field" value={filters.branch_id} onChange={(e) => update("branch_id", e.target.value)}>
        <option value="">Todas as filiais</option>
        {(branches || []).map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <input
        className="input-field"
        placeholder="Numero do pedido"
        value={filters.purchase_order}
        onChange={(e) => update("purchase_order", e.target.value)}
      />

      <input type="date" className="input-field" value={filters.date_from} onChange={(e) => update("date_from", e.target.value)} />
      <input type="date" className="input-field" value={filters.date_to} onChange={(e) => update("date_to", e.target.value)} />
    </div>
  );
}
