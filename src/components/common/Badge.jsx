const STYLE_MAP = {
  sucesso: "bg-emerald-50 text-emerald-700",
  processada: "bg-emerald-50 text-emerald-700",
  conferida: "bg-emerald-50 text-emerald-700",
  paga: "bg-emerald-50 text-emerald-700",
  processando: "bg-colgate-blue/10 text-colgate-blue",
  recebida: "bg-colgate-blue/10 text-colgate-blue",
  aberta: "bg-amber-50 text-amber-700",
  revisao: "bg-amber-50 text-amber-700",
  erro: "bg-colgate-red/10 text-colgate-red",
  vencida: "bg-colgate-red/10 text-colgate-red",
  duplicada: "bg-purple-50 text-purple-700",
  default: "bg-gray-100 text-gray-600",
};

export default function Badge({ status, children }) {
  const style = STYLE_MAP[status] || STYLE_MAP.default;
  return <span className={`badge ${style}`}>{children}</span>;
}
