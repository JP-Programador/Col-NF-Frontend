import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../services/api";
import { formatInvoiceType } from "../utils/format";

const ALERT_LABELS = {
  duplicidade: "Possivel duplicidade",
  sem_categoria: "Sem categoria",
  sem_vencimento: "Sem vencimento",
  erro_leitura: "Erro de leitura",
};

export default function Alertas() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = () => {
    setLoading(true);
    api
      .get("/alerts", { params: { resolved: false } })
      .then(({ data }) => setAlerts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolve = async (id) => {
    await api.patch(`/alerts/${id}/resolve`);
    loadAlerts();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-colgate-graphite">Alertas</h2>
        <p className="text-sm text-gray-500">Ocorrencias que precisam de atencao manual.</p>
      </div>

      <div className="card p-0">
        {loading ? (
          <p className="px-4 py-8 text-center text-sm text-gray-400">Carregando...</p>
        ) : alerts.length ? (
          <div className="divide-y divide-gray-50">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-colgate-graphite">
                      {ALERT_LABELS[alert.alert_type] || alert.alert_type}
                    </p>
                    <p className="text-xs text-gray-500">{alert.message}</p>
                    {alert.invoices && (
                      <Link
                        to={`/notas/${alert.invoice_id}`}
                        className="text-xs font-medium text-colgate-blue hover:underline"
                      >
                        {formatInvoiceType(alert.invoices.invoice_type)} #{alert.invoices.number} -{" "}
                        {alert.invoices.supplier_name}
                      </Link>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="flex shrink-0 items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 sm:self-auto"
                >
                  <CheckCircle2 size={14} /> Resolver
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-gray-400">Nenhum alerta pendente.</p>
        )}
      </div>
    </div>
  );
}
