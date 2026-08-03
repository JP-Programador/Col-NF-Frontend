import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import Badge from "../components/common/Badge";
import { api } from "../services/api";

const BASE_TABS = [
  { key: "categories", label: "Categorias", endpoint: "/categories", fields: ["name", "description"] },
  { key: "cost-centers", label: "Centros de Custo", endpoint: "/cost-centers", fields: ["code", "name"] },
  { key: "branches", label: "Filiais", endpoint: "/branches", fields: ["code", "name", "city", "state"] },
];

const USERS_TAB = { key: "users", label: "Usuarios", endpoint: "/users" };

export default function Administracao() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState(BASE_TABS[0]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.role === "admin";
  const tabs = isAdmin ? [...BASE_TABS, USERS_TAB] : BASE_TABS;

  useEffect(() => {
    api.get("/users/me").then(({ data }) => setCurrentUser(data));
  }, []);

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
        <p className="text-sm text-gray-500">Cadastro de categorias, centros de custo, filiais e usuarios.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-100">
        {tabs.map((tab) => (
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

      {activeTab.key === "users" ? (
        <UsersPanel items={items} loading={loading} form={form} setForm={setForm} onCreated={() => loadItems(activeTab)} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

function UsersPanel({ items, loading, form, setForm, onCreated }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/users", {
        email: form.email,
        full_name: form.full_name,
        role: form.role || "user",
      });
      setForm({});
      onCreated();
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao criar usuario.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (userRow) => {
    await api.patch(`/users/${userRow.id}`, { active: !userRow.active });
    onCreated();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          required
          placeholder="Nome completo"
          className="input-field"
          value={form.full_name || ""}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        <input
          required
          type="email"
          placeholder="E-mail"
          className="input-field"
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <select
          className="input-field"
          value={form.role || "user"}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">Funcionario</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit" disabled={saving} className="btn-primary">
          <Plus size={16} /> {saving ? "Criando..." : "Criar login"}
        </button>

        <p className="sm:col-span-2 lg:col-span-4 text-xs text-gray-400">
          Senha padrao: <span className="font-mono font-semibold">colgate@123</span> - o usuario deve troca-la apos o primeiro login (menu do usuario, no topo).
        </p>

        {error && <p className="sm:col-span-2 lg:col-span-4 text-sm font-medium text-colgate-red">{error}</p>}
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase text-gray-400">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Papel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : items.length ? (
              items.map((userRow) => (
                <tr key={userRow.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 text-colgate-graphite">{userRow.full_name}</td>
                  <td className="px-4 py-3 text-gray-500">{userRow.email}</td>
                  <td className="px-4 py-3">
                    <Badge status={userRow.role === "admin" ? "processada" : "default"}>
                      {userRow.role === "admin" ? "Administrador" : "Funcionario"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={userRow.active ? "sucesso" : "erro"}>
                      {userRow.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleActive(userRow)}
                      className="text-xs font-semibold text-colgate-blue hover:underline"
                    >
                      {userRow.active ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhum usuario cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
