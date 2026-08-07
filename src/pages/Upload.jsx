import { useState } from "react";
import { Link } from "react-router-dom";

import FileDropzone from "../components/upload/FileDropzone";
import UploadItemRow from "../components/upload/UploadItemRow";
import { api } from "../services/api";
import { showAlert } from "../utils/alerts";

export default function UploadPage() {
  const [queue, setQueue] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFilesSelected = (files) => {
    const newItems = files.map((file) => ({ file, name: file.name, status: "pendente", message: null }));
    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleUploadAll = async () => {
    const pending = queue.filter((item) => item.status === "pendente");
    if (!pending.length) return;

    setUploading(true);
    setQueue((prev) => prev.map((item) => (item.status === "pendente" ? { ...item, status: "enviando" } : item)));

    try {
      const formData = new FormData();
      pending.forEach((item) => formData.append("files", item.file));

      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setQueue((prev) => {
        const updated = [...prev];
        let resultIndex = 0;
        return updated.map((item) => {
          if (item.status !== "enviando") return item;
          const result = data[resultIndex];
          resultIndex += 1;
          return {
            ...item,
            status: result?.status || "erro",
            message: result?.error_message || (result?.invoice_type ? `Tipo detectado: ${result.invoice_type}` : null),
          };
        });
      });

      const okCount = data.filter((r) => ["sucesso", "revisao"].includes(r.status)).length;
      const errorCount = data.filter((r) => r.status === "erro").length;
      const pendingIaCount = data.filter((r) => r.status === "aguardando_ia").length;

      if (errorCount === 0 && pendingIaCount === 0) {
        showAlert.toast(`${okCount} nota(s) processada(s) com sucesso!`, "success");
      } else if (okCount === 0 && errorCount === 0) {
        showAlert.warning(
          "Aguardando cota da IA",
          `${pendingIaCount} arquivo(s) esperando a cota diaria da IA renovar. Nao precisa reenviar - o sistema completa sozinho assim que houver cota disponivel.`
        );
      } else if (okCount === 0) {
        showAlert.error("Falha no processamento", `${errorCount} arquivo(s) nao puderam ser processados.`);
      } else {
        const parts = [`${okCount} processada(s) com sucesso`];
        if (errorCount) parts.push(`${errorCount} com erro`);
        if (pendingIaCount) parts.push(`${pendingIaCount} aguardando cota da IA (sera completada automaticamente)`);
        showAlert.warning("Processamento concluido com avisos", parts.join(", ") + ".");
      }
    } catch (error) {
      setQueue((prev) =>
        prev.map((item) =>
          item.status === "enviando"
            ? { ...item, status: "erro", message: error.response?.data?.detail || "Falha ao enviar." }
            : item
        )
      );
      showAlert.error("Erro ao enviar", error.response?.data?.detail || "Nao foi possivel enviar os arquivos.");
    } finally {
      setUploading(false);
    }
  };

  const pendingCount = queue.filter((item) => item.status === "pendente").length;
  const successCount = queue.filter((item) => ["sucesso", "revisao"].includes(item.status)).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-colgate-graphite">Upload de Notas Fiscais</h2>
        <p className="text-sm text-gray-500">
          Envie PDFs de NFS-e e NF-e em lote. O sistema identifica automaticamente o tipo do documento.
        </p>
      </div>

      <FileDropzone onFilesSelected={handleFilesSelected} />

      {queue.length > 0 && (
        <div className="card">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-bold text-colgate-graphite">
              Arquivos ({queue.length}) &middot; {successCount} processados
            </h3>
            <div className="flex gap-2">
              <button className="btn-secondary flex-1 sm:flex-none" onClick={() => setQueue([])} disabled={uploading}>
                Limpar lista
              </button>
              <button className="btn-primary flex-1 sm:flex-none" onClick={handleUploadAll} disabled={uploading || pendingCount === 0}>
                {uploading ? "Processando..." : `Enviar ${pendingCount || ""} arquivo(s)`}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {queue.map((item, index) => (
              <UploadItemRow key={index} fileName={item.name} status={item.status} message={item.message} />
            ))}
          </div>

          {successCount > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4 text-right">
              <Link to="/notas" className="text-sm font-semibold text-colgate-blue hover:underline">
                Ver notas processadas &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
