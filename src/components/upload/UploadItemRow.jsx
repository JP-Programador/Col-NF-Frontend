import { AlertTriangle, CheckCircle2, Clock, Copy, FileWarning, Loader2 } from "lucide-react";

const STATUS_CONFIG = {
  pendente: { icon: Loader2, label: "Aguardando", className: "text-gray-400", spin: false },
  enviando: { icon: Loader2, label: "Enviando...", className: "text-colgate-blue", spin: true },
  sucesso: { icon: CheckCircle2, label: "Sucesso", className: "text-emerald-600", spin: false },
  revisao: { icon: AlertTriangle, label: "Necessita revisao", className: "text-amber-600", spin: false },
  aguardando_ia: { icon: Clock, label: "Aguardando cota da IA", className: "text-purple-600", spin: false },
  duplicada: { icon: Copy, label: "Duplicada", className: "text-purple-600", spin: false },
  erro: { icon: FileWarning, label: "Erro", className: "text-colgate-red", spin: false },
};

export default function UploadItemRow({ fileName, status, message }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pendente;
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-colgate-graphite">{fileName}</p>
        {message && <p className="mt-0.5 truncate text-xs text-gray-400">{message}</p>}
      </div>
      <div className={`ml-4 flex items-center gap-1.5 text-xs font-semibold ${config.className}`}>
        <Icon size={16} className={config.spin ? "animate-spin" : ""} />
        {config.label}
      </div>
    </div>
  );
}
