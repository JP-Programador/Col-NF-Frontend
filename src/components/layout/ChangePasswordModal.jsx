import { X } from "lucide-react";
import { useState } from "react";

import { supabase } from "../../services/supabaseClient";

export default function ChangePasswordModal({ onClose }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas nao coincidem.");
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Erro ao trocar a senha.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-colgate-graphite">Trocar Senha</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-colgate-graphite">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-emerald-600">Senha alterada com sucesso.</p>
            <button onClick={onClose} className="btn-primary w-full">
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Nova senha</label>
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirmar nova senha</label>
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-colgate-red/10 px-3 py-2 text-sm font-medium text-colgate-red">{error}</p>
            )}

            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
