import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  LayoutDashboard,
  ListChecks,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload de Notas", icon: Upload },
  { to: "/notas", label: "Lista de Notas", icon: ListChecks },
  { to: "/vencimentos", label: "Vencimentos", icon: CalendarClock },
  { to: "/alertas", label: "Alertas", icon: AlertTriangle },
  { to: "/administracao", label: "Administracao", icon: Settings },
];

const ADMIN_NAV_ITEMS = [
  { to: "/cobertura-ia", label: "Cobertura de IA", icon: BarChart3 },
];

function SidebarContent({ onNavigate }) {
  const { isAdmin } = useAuth();
  const items = isAdmin ? [...NAV_ITEMS, ...ADMIN_NAV_ITEMS] : NAV_ITEMS;

  return (
    <>
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-colgate-red text-sm font-extrabold text-white">
          CP
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight text-colgate-graphite">Colgate-Palmolive</p>
          <p className="truncate text-xs text-gray-400">Central de NFs</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-colgate-red/10 text-colgate-red"
                  : "text-gray-600 hover:bg-gray-50 hover:text-colgate-graphite"
              }`
            }
          >
            <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <p className="text-xs text-gray-400">Versao 1.0.0 &middot; MVP Fase 1</p>
      </div>
    </>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-100 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-colgate-graphite"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
