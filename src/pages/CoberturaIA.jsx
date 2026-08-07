import { Bot, FileText, Percent, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import Badge from "../components/common/Badge";
import KpiCard from "../components/dashboard/KpiCard";
import { api } from "../services/api";
import { formatDate } from "../utils/format";

export default function CoberturaIA() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    api
      .get("/admin/ai-coverage")
      .then(({ data }) => setData(data))
      .catch((err) => {
        if (err.response?.status === 403) setForbidden(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (forbidden) {
    return (
      <div className="card py-12 text-center">
        <p className="text-sm font-semibold text-colgate-graphite">Acesso restrito</p>
        <p className="mt-1 text-sm text-gray-500">Essa tela e' visivel apenas para administradores.</p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Carregando cobertura...</p>;
  }

  const summary = data?.summary;
  const bySupplier = data?.by_supplier || [];
  const percentualRegex = summary ? 100 - summary.percentual_geral_ia : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-colgate-graphite">Cobertura de IA</h2>
        <p className="text-sm text-gray-500">
          Quais fornecedores mais dependem da IA (Groq/OpenRouter) para serem lidos, em vez do regex por formato
          dar conta sozinho. Use para priorizar onde vale a pena escrever suporte de regex especifico.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Total de Notas" value={summary?.total_notas ?? 0} icon={FileText} accent="blue" />
        <KpiCard label="Lidas via IA" value={summary?.total_via_ia ?? 0} icon={Bot} accent="amber" />
        <KpiCard
          label="Cobertura por Regex"
          value={`${percentualRegex.toFixed(1)}%`}
          icon={ShieldCheck}
          accent="graphite"
        />
      </div>

      <div className="card overflow-x-auto p-0">
        <div className="border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-bold text-colgate-graphite">Fornecedores que mais caem na IA</h3>
          <p className="text-xs text-gray-400">Ordenado por quantidade de notas que precisaram de IA.</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase text-gray-400">
              <th className="px-4 py-3">Fornecedor</th>
              <th className="px-4 py-3">CNPJ</th>
              <th className="px-4 py-3 text-right">Total de Notas</th>
              <th className="px-4 py-3 text-right">Via IA</th>
              <th className="px-4 py-3 text-right">% via IA</th>
              <th className="px-4 py-3">Ultima vez</th>
            </tr>
          </thead>
          <tbody>
            {bySupplier.length ? (
              bySupplier.map((row) => (
                <tr key={row.supplier_cnpj || row.supplier_name} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-colgate-graphite">{row.supplier_name}</td>
                  <td className="px-4 py-3 text-gray-500">{row.supplier_cnpj || "-"}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{row.total_notas}</td>
                  <td className="px-4 py-3 text-right font-semibold text-colgate-graphite">{row.notas_via_ia}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge status={row.percentual_ia >= 80 ? "vencida" : row.percentual_ia >= 40 ? "revisao" : "default"}>
                      <Percent size={11} className="mr-0.5 inline" />
                      {row.percentual_ia}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(row.ultima_vez_ia)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma nota precisou da IA ate agora - todo o volume esta coberto por regex.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
