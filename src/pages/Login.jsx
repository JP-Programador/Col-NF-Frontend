import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message === "Invalid login credentials" ? "E-mail ou senha invalidos." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-colgate-red via-colgate-red-dark to-colgate-graphite p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15 text-lg font-extrabold">
            CP
          </div>
          <span className="text-lg font-bold tracking-tight">Colgate-Palmolive</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight">
            Central de Inteligencia
            <br />
            de Notas Fiscais
          </h1>
          <p className="mt-4 max-w-md text-white/80">
            Upload, leitura automatica e consolidacao de notas fiscais em um unico painel
            executivo.
          </p>
        </div>
        <p className="text-xs text-white/60">
          &copy; {new Date().getFullYear()} Colgate-Palmolive. Uso interno e corporativo.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-colgate-red text-sm font-extrabold text-white">
              CP
            </div>
            <span className="text-base font-bold text-colgate-graphite">Colgate-Palmolive</span>
          </div>

          <h2 className="text-2xl font-bold text-colgate-graphite">Entrar</h2>
          <p className="mt-1 text-sm text-gray-500">Acesse com suas credenciais corporativas.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">E-mail</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nome@colgate.com"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  className="input-field pl-9"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-colgate-red/10 px-3 py-2 text-sm font-medium text-colgate-red">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
