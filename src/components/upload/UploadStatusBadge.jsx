import { Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useUpload } from "../../contexts/UploadContext";

// Indicador flutuante visivel em qualquer tela enquanto um upload esta
// rodando - permite trocar de pagina sem perder a nocao de que o envio
// continua em segundo plano. Some sozinho quando termina, e nao aparece na
// propria tela de Upload (onde a fila detalhada ja fica visivel).
export default function UploadStatusBadge() {
  const { uploading, sendingCount } = useUpload();
  const location = useLocation();

  if (!uploading || location.pathname === "/upload") return null;

  return (
    <Link
      to="/upload"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-colgate-graphite px-4 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-colgate-graphite/90"
    >
      <Loader2 size={16} className="animate-spin" />
      Enviando {sendingCount} arquivo{sendingCount === 1 ? "" : "s"}...
    </Link>
  );
}
