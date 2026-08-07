export default function KpiCard({ label, value, icon: Icon, accent = "graphite", suffix }) {
  const accentMap = {
    red: "bg-colgate-red/10 text-colgate-red",
    blue: "bg-colgate-blue/10 text-colgate-blue",
    graphite: "bg-gray-100 text-colgate-graphite",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="card flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <p className="mt-2 truncate text-2xl font-extrabold text-colgate-graphite" title={typeof value === "string" ? value : undefined}>
          {value}
          {suffix && <span className="ml-1 text-sm font-medium text-gray-400">{suffix}</span>}
        </p>
      </div>
      {Icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accentMap[accent]}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}
