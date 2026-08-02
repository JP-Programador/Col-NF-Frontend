import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";

const WINDOWS = [
  { key: "vencidas", label: "Vencidas", accent: "text-colgate-red" },
  { key: "hoje", label: "Hoje", accent: "text-colgate-graphite" },
  { key: "7_dias", label: "Proximos 7 dias", accent: "text-amber-600" },
  { key: "15_dias", label: "Proximos 15 dias", accent: "text-colgate-blue" },
  { key: "30_dias", label: "Proximos 30 dias", accent: "text-gray-500" },
];

export default function Vencimentos() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/invoices/due/summary").then(({ data }) => setData(data));
  }, []);

  if (!data) {
    return <p className="text-sm text-gray-400">Carregando vencimentos...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-colgate-graphite">Vencimentos</h2>
        <p className="text-sm text-gray-500">Notas fiscais em aberto agrupadas por janela de vencimento.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {WINDOWS.map(({ key, label, accent }) => (
          <div key={key} className="card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className={`text-sm font-bold ${accent}`}>{label}</h3>
              <span className="text-xs font-semibold text-gray-400">{data[key]?.length || 0} notas</span>
            </div>

            {data[key]?.length ? (
              <div className="space-y-2">
                {data[key].map((invoice) => (
                  <Link
                    key={invoice.id}
                    to={`/notas/${invoice.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-colgate-graphite">{invoice.supplier_name || "Fornecedor nao identificado"}</p>
                      <p className="text-xs text-gray-400">
                        #{invoice.number} &middot; vence em {formatDate(invoice.due_date)}
                      </p>
                    </div>
                    <span className="ml-4 shrink-0 font-semibold text-colgate-graphite">
                      {formatCurrency(invoice.total_value)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">Nenhuma nota nesta janela.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
