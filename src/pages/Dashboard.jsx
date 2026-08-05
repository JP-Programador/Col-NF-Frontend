import {
  AlertCircle,
  Building2,
  Calendar,
  FileText,
  Receipt,
  ReceiptText,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import KpiCard from "../components/dashboard/KpiCard";
import { useApi } from "../hooks/useApi";
import { api } from "../services/api";
import { formatCurrency } from "../utils/format";

const CHART_COLORS = ["#C8102E", "#005EB8", "#1F2937", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#0EA5E9"];

export default function Dashboard() {
  const { data: summary, loading: loadingSummary } = useApi(() => api.get("/dashboard/summary"), []);
  const { data: monthly } = useApi(() => api.get("/dashboard/monthly"), []);
  const { data: suppliers } = useApi(() => api.get("/dashboard/suppliers"), []);
  const { data: categories } = useApi(() => api.get("/dashboard/categories"), []);
  const { data: serviceVsProduct } = useApi(() => api.get("/dashboard/service-vs-product"), []);
  const { data: costCenters } = useApi(() => api.get("/dashboard/cost-centers"), []);
  const { data: branches } = useApi(() => api.get("/dashboard/branches"), []);

  if (loadingSummary) {
    return <p className="text-sm text-gray-400">Carregando indicadores...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Gasto" value={formatCurrency(summary?.total_gasto)} icon={Wallet} accent="red" />
        <KpiCard label="Notas Processadas" value={summary?.quantidade_notas ?? 0} icon={FileText} accent="blue" />
        <KpiCard label="NFS-e" value={summary?.quantidade_nfse ?? 0} icon={Receipt} accent="graphite" />
        <KpiCard label="NF-e" value={summary?.quantidade_nfe ?? 0} icon={ShoppingBag} accent="graphite" />
        <KpiCard label="Recibos" value={summary?.quantidade_recibo ?? 0} icon={ReceiptText} accent="graphite" />
        <KpiCard label="Fornecedores Ativos" value={summary?.fornecedores_ativos ?? 0} icon={Users} accent="blue" />
        <KpiCard label="Ticket Medio" value={formatCurrency(summary?.ticket_medio)} icon={Building2} accent="graphite" />
        <KpiCard label="Vence em 7 Dias" value={summary?.vence_7_dias ?? 0} icon={Calendar} accent="amber" />
        <KpiCard label="Notas Vencidas" value={summary?.vencidas ?? 0} icon={AlertCircle} accent="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-colgate-graphite">Evolucao Mensal de Gastos</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthly || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="valor" stroke="#C8102E" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-colgate-graphite">Servicos x Produtos</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={serviceVsProduct || []}
                dataKey="valor"
                nameKey="tipo"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => entry.tipo}
              >
                {(serviceVsProduct || []).map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-colgate-graphite">Top 10 Fornecedores</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={suppliers || []} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="fornecedor" width={140} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="valor" fill="#005EB8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-colgate-graphite">Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={categories || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="nome" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="valor" fill="#C8102E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-colgate-graphite">Gastos por Centro de Custo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costCenters || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="nome" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="valor" fill="#1F2937" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-bold text-colgate-graphite">Gastos por Filial</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={branches || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="nome" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="valor" fill="#005EB8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
