import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Administracao from "./pages/Administracao";
import Alertas from "./pages/Alertas";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotaDetalhe from "./pages/NotaDetalhe";
import Notas from "./pages/Notas";
import Upload from "./pages/Upload";
import Vencimentos from "./pages/Vencimentos";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/notas/:id" element={<NotaDetalhe />} />
        <Route path="/vencimentos" element={<Vencimentos />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/administracao" element={<Administracao />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
