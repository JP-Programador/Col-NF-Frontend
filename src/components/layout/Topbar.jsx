import { KeyRound, LogOut, User } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";

export default function Topbar() {
  const { user, signOut } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-bold text-colgate-graphite">Central de Inteligencia de Notas Fiscais</h1>
        <p className="text-xs text-gray-400">Visao executiva de gastos, fornecedores e vencimentos</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5">
          <User size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">{user?.email}</span>
        </div>
        <button
          onClick={() => setShowChangePassword(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-colgate-blue"
        >
          <KeyRound size={16} />
          Trocar Senha
        </button>
        <button
          onClick={signOut}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-colgate-red"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </header>
  );
}
