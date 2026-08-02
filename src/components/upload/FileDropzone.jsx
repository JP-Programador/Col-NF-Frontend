import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

export default function FileDropzone({ onFilesSelected }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files).filter((f) => f.type === "application/pdf");
    if (files.length) onFilesSelected(files);
  };

  const handleSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length) onFilesSelected(files);
    event.target.value = "";
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
        dragging ? "border-colgate-red bg-colgate-red/5" : "border-gray-200 bg-gray-50 hover:border-colgate-blue/50"
      }`}
    >
      <UploadCloud className="mb-3 h-10 w-10 text-colgate-blue" />
      <p className="text-sm font-semibold text-colgate-graphite">
        Arraste os PDFs aqui ou clique para selecionar
      </p>
      <p className="mt-1 text-xs text-gray-400">Suporta multiplos arquivos PDF (NFS-e e NF-e)</p>
      <input ref={inputRef} type="file" accept="application/pdf" multiple className="hidden" onChange={handleSelect} />
    </div>
  );
}
