import { createContext, useContext, useState } from "react";

import { api } from "../services/api";
import { showAlert } from "../utils/alerts";

const UploadContext = createContext(null);

// Guarda a fila de upload num contexto no topo da arvore (montado uma vez
// em App.jsx, fora das rotas) em vez de estado local da pagina Upload -
// assim o upload continua rodando (e a fila continua visivel) mesmo que o
// usuario troque de tela no meio do envio. Sem isso, a requisicao ate
// continuava no navegador (nao e cancelada so por trocar de rota), mas o
// componente que guardava o estado desmontava e a tela, ao voltar,
// aparecia vazia como se nada tivesse acontecido.
export function UploadProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = (files) => {
    const newItems = files.map((file) => ({ file, name: file.name, status: "pendente", message: null }));
    setQueue((prev) => [...prev, ...newItems]);
  };

  const clearQueue = () => setQueue([]);

  const uploadAll = async () => {
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
  const sendingCount = queue.filter((item) => item.status === "enviando").length;
  const successCount = queue.filter((item) => ["sucesso", "revisao"].includes(item.status)).length;

  const value = {
    queue,
    uploading,
    addFiles,
    clearQueue,
    uploadAll,
    pendingCount,
    sendingCount,
    successCount,
  };

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload deve ser usado dentro de um UploadProvider");
  }
  return context;
}
