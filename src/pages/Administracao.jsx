import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "../services/api";

const TABS = [
  { key: "categories", label: "Categorias", endpoint: "/categories", fields: ["name", "description"] },
  { key: "cost-centers", label: "Centros de Custo", endpoint: "/cost-centers", fields: ["code", "name"] },
  { key: "branches", label: "Filiais", endpoint: "/branches", fields: ["code", "name", "city", "state"] },
];

export default function Administracao() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const loadItems = (tab) => {
    setLoading(true);
    api
      .get(tab.endpoint)
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadItems(activeTab);
    setForm({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCreate = async (event) => {
    event.preventDefault();
    await api.post(activeTab.endpoint, form);
    setForm({});
    loadItems(activeTab);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-colgate-graphite">Administracao</h2>
        <p className="text-sm text-gray-500">Cadastro de categorias, centros de custo e filiais.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab.key === tab.key
                ? "border-colgate-red text-colgate-red"
                : "border-transparent text-gray-500 hover:text-colgate-graphite"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleCreate} className="card grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))_auto]">
        {activeTab.fields.map((field) => (
          <input
            key={field}
            required={field === "name" || field === "code"}
            placeholder={field}
            className="input-field"
            value={form[field] || ""}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}
        <button type="submit" className="btn-primary">
          <Plus size={16} /> Adicionar
        </button>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase text-gray-400">
              {activeTab.fields.map((field) => (
                <th key={field} className="px-4 py-3">{field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={activeTab.fields.length} className="px-4 py-8 text-center text-gray-400">
                  Carregando...
                </td>
              </tr>
            ) : items.length ? (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  {activeTab.fields.map((field) => (
                    <td key={field} className="px-4 py-3 text-colgate-graphite">
                      {item[field] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab.fields.length} className="px-4 py-8 text-center text-gray-400">
                  Nenhum registro cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
