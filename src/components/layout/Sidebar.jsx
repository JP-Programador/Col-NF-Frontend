import {
  AlertTriangle,
  CalendarClock,
  LayoutDashboard,
  ListChecks,
  Settings,
  Upload,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload de Notas", icon: Upload },
  { to: "/notas", label: "Lista de Notas", icon: ListChecks },
  { to: "/vencimentos", label: "Vencimentos", icon: CalendarClock },
  { to: "/alertas", label: "Alertas", icon: AlertTriangle },
  { to: "/administracao", label: "Administracao", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-gray-100 bg-white lg:flex">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-colgate-red text-sm font-extrabold text-white">
          CP
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-colgate-graphite">Colgate-Palmolive</p>
          <p className="text-xs text-gray-400">Central de NFs</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-colgate-red/10 text-colgate-red"
                  : "text-gray-600 hover:bg-gray-50 hover:text-colgate-graphite"
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <p className="text-xs text-gray-400">Versao 1.0.0 &middot; MVP Fase 1</p>
      </div>
    </aside>
  );
}
