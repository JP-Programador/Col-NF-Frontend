import { Link } from "react-router-dom";

import FileDropzone from "../components/upload/FileDropzone";
import UploadItemRow from "../components/upload/UploadItemRow";
import { useUpload } from "../contexts/UploadContext";

export default function UploadPage() {
  const { queue, uploading, addFiles, clearQueue, uploadAll, pendingCount, successCount } = useUpload();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-colgate-graphite">Upload de Notas Fiscais</h2>
        <p className="text-sm text-gray-500">
          Envie PDFs de NFS-e e NF-e em lote. O sistema identifica automaticamente o tipo do documento. Voce pode
          trocar de tela enquanto o envio roda - ele continua em segundo plano.
        </p>
      </div>

      <FileDropzone onFilesSelected={addFiles} />

      {queue.length > 0 && (
        <div className="card">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-bold text-colgate-graphite">
              Arquivos ({queue.length}) &middot; {successCount} processados
            </h3>
            <div className="flex gap-2">
              <button className="btn-secondary flex-1 sm:flex-none" onClick={clearQueue} disabled={uploading}>
                Limpar lista
              </button>
              <button className="btn-primary flex-1 sm:flex-none" onClick={uploadAll} disabled={uploading || pendingCount === 0}>
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
