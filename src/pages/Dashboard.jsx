import {
  AlertCircle,
  Building2,
  Calendar,
  FileText,
  Receipt,
  ReceiptText,
  ShoppingBag,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
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

import ChartCard from "../components/dashboard/ChartCard";
import DashboardFilters, { EMPTY_FILTERS } from "../components/dashboard/DashboardFilters";
import KpiCard from "../components/dashboard/KpiCard";
import { api } from "../services/api";
import { formatCurrency } from "../utils/format";

const CHART_COLORS = ["#C8102E", "#005EB8", "#1F2937", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#0EA5E9"];
const PAYMENT_STATUS_COLORS = { Aberta: "#005EB8", Paga: "#10B981", Vencida: "#C8102E" };

export default function Dashboard() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catalogs, setCatalogs] = useState({ categories: [], costCenters: [], branches: [] });

  useEffect(() => {
    Promise.all([api.get("/categories"), api.get("/cost-centers"), api.get("/branches")]).then(
      ([categories, costCenters, branches]) => {
        setCatalogs({ categories: categories.data, costCenters: costCenters.data, branches: branches.data });
      }
    );
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      const params = { ...filters };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);

      api
        .get("/dashboard/overview", { params })
        .then(({ data }) => setOverview(data))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  const summary = overview?.summary;
  const monthly = overview?.monthly;
  const monthlyCount = overview?.monthly_count;
  const suppliers = overview?.suppliers;
  const categories = overview?.categories;
  const serviceVsProduct = overview?.service_vs_product;
  const costCenters = overview?.cost_centers;
  const paymentStatus = overview?.payment_status;

  return (
    <div className="space-y-6">
      <DashboardFilters
        filters={filters}
        onChange={setFilters}
        categories={catalogs.categories}
        costCenters={catalogs.costCenters}
        branches={catalogs.branches}
      />

      {loading && !overview ? (
        <p className="text-sm text-gray-400">Carregando indicadores...</p>
      ) : (
        <>
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
            <KpiCard label="Maior Fornecedor" value={summary?.maior_fornecedor || "-"} icon={Star} accent="blue" />
            <KpiCard label="Categoria Destaque" value={summary?.maior_categoria || "-"} icon={Star} accent="amber" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Evolucao Mensal de Gastos" subtitle="Valor total por mes de emissao">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="valor" stroke="#C8102E" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Quantidade de Notas por Mes" subtitle="Volume de notas processadas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCount || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#005EB8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Servicos x Produtos" subtitle="Distribuicao de gasto por tipo de nota">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceVsProduct || []}
                    dataKey="valor"
                    nameKey="tipo"
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
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
            </ChartCard>

            <ChartCard title="Status de Pagamento" subtitle="Notas em aberto, pagas e vencidas">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatus || []}
                    dataKey="valor"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    label={(entry) => `${entry.status} (${entry.quantidade})`}
                  >
                    {(paymentStatus || []).map((entry, index) => (
                      <Cell key={index} fill={PAYMENT_STATUS_COLORS[entry.status] || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top 10 Fornecedores" subtitle="Maiores gastos por fornecedor">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={suppliers || []} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="fornecedor" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="valor" fill="#005EB8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Gastos por Categoria" subtitle="Total gasto por categoria de despesa">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="nome" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="valor" fill="#C8102E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Gastos por Centro de Custo" subtitle="Total gasto por centro de custo">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costCenters || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="nome" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="valor" fill="#1F2937" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
