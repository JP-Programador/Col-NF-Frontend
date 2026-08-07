export default function KpiCard({ label, value, icon: Icon, accent = "graphite", suffix }) {
  const accentMap = {
    red: "bg-colgate-red/10 text-colgate-red",
    blue: "bg-colgate-blue/10 text-colgate-blue",
    graphite: "bg-gray-100 text-colgate-graphite",
    amber: "bg-amber-50 text-amber-600",
  };

  const isLongText = typeof value === "string" && value.length > 14;

  return (
    <div className="card flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <p
          className={`mt-2 break-words font-extrabold leading-tight text-colgate-graphite ${
            isLongText ? "text-base sm:text-lg" : "text-2xl"
          }`}
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </p>
        {suffix && <p className="mt-0.5 text-sm font-medium text-gray-400">{suffix}</p>}
      </div>
      {Icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accentMap[accent]}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}
