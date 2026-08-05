import { KeyRound, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";

export default function Topbar({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-colgate-graphite lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-colgate-graphite sm:text-lg">
            Central de Inteligencia de Notas Fiscais
          </h1>
          <p className="hidden truncate text-xs text-gray-400 sm:block">
            Visao executiva de gastos, fornecedores e vencimentos
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 md:flex">
          <User size={16} className="text-gray-400" />
          <span className="max-w-[160px] truncate text-sm font-medium text-gray-600">{user?.email}</span>
        </div>
        <button
          onClick={() => setShowChangePassword(true)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-colgate-blue sm:px-3"
          aria-label="Trocar Senha"
        >
          <KeyRound size={16} />
          <span className="hidden sm:inline">Trocar Senha</span>
        </button>
        <button
          onClick={signOut}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-colgate-red sm:px-3"
          aria-label="Sair"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </header>
  );
}
