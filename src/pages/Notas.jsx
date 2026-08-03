import { Download, FileSpreadsheet, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import Badge from "../components/common/Badge";
import InvoiceFilters from "../components/notas/InvoiceFilters";
import { api } from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";

const EMPTY_FILTERS = {
  search: "",
  invoice_type: "",
  payment_status: "",
  category_id: "",
  cost_center_id: "",
  branch_id: "",
  date_from: "",
  date_to: "",
};

export default function Notas() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [result, setResult] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [catalogs, setCatalogs] = useState({ categories: [], costCenters: [], branches: [] });

  useEffect(() => {
    Promise.all([api.get("/categories"), api.get("/cost-centers"), api.get("/branches")]).then(
      ([categories, costCenters, branches]) => {
        setCatalogs({ categories: categories.data, costCenters: costCenters.data, branches: branches.data });
      }
    );
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      const params = { ...filters, page, page_size: 20 };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);

      api
        .get("/invoices", { params })
        .then(({ data }) => setResult(data))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, page]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // 🎨 MODAL MODERNA DE CONFIRMAÇÃO DE EXCLUSÃO
  const handleDelete = async (invoice) => {
    const label = `${invoice.invoice_type === "NFSE" ? "NFS-e" : "NF-e"} #${invoice.number}`;

    const confirmResult = await Swal.fire({
      title: "Excluir Nota Fiscal?",
      html: `Deseja excluir permanentemente a nota <b style="color: #f3f4f6">${label}</b>?<br><span style="font-size: 0.85em; color: #9ca3af;">Essa ação não pode ser desfeita.</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Vermelho
      cancelButtonColor: "#374151",  // Cinza escuro
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      background: "#1f2937",        // Fundo escuro (Dark Mode)
      color: "#f9fafb",              // Cor do texto
      border: "1px solid #374151",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-700",
        confirmButton: "px-4 py-2 rounded-xl font-medium",
        cancelButton: "px-4 py-2 rounded-xl font-medium",
      },
    });

    // Se o usuário clicou em "Sim, excluir"
    if (confirmResult.isConfirmed) {
      try {
        await api.delete(`/invoices/${invoice.id}`);

        // Atualiza a lista na tela imediatamente
        setResult((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== invoice.id),
          total: Math.max(0, (prev.total || 1) - 1),
        }));

        // Toast discreto confirmando a exclusão
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Nota excluída com sucesso!",
          showConfirmButton: false,
          timer: 2500,
          background: "#111827",
          color: "#fff",
        });
      } catch (error) {
        // Alerta em caso de erro na requisição
        Swal.fire({
          title: "Erro ao excluir",
          text: "Não foi possível remover a nota fiscal. Tente novamente.",
          icon: "error",
          background: "#1f2937",
          color: "#f9fafb",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  const handleExport = async (format) => {
    const response = await api.get(`/export/${format}`, { responseType: "blob" });
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = format === "excel" ? "notas_fiscais.xlsx" : "notas_fiscais.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const totalPages = Math.max(1, Math.ceil((result.total || 0) / 20));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-colgate-graphite">Lista de Notas</h2>
          <p className="text-sm text-gray-500">{result.total ?? 0} notas encontradas</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => handleExport("csv")}>
            <Download size={16} /> CSV
          </button>
          <button className="btn-secondary" onClick={() => handleExport("excel")}>
            <FileSpreadsheet size={16} /> Excel
          </button>
        </div>
      </div>

      <InvoiceFilters
        filters={filters}
        onChange={handleFiltersChange}
        categories={catalogs.categories}
        costCenters={catalogs.costCenters}
        branches={catalogs.branches}
      />

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase text-gray-400">
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Numero</th>
              <th className="px-4 py-3">Fornecedor</th>
              <th className="px-4 py-3">Emissao</th>
              <th className="px-4 py-3">Vencimento</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : result.items?.length ? (
              result.items.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-gray-500">
                      {invoice.invoice_type === "NFSE" ? "NFS-e" : "NF-e"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/notas/${invoice.id}`} className="font-medium text-colgate-blue hover:underline">
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-colgate-graphite">{invoice.supplier_name || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(invoice.issue_date)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(invoice.due_date)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-colgate-graphite">
                    {formatCurrency(invoice.total_value)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={invoice.payment_status}>{invoice.payment_status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(invoice)}
                      title="Excluir nota"
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-colgate-red/10 hover:text-colgate-red"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">Nenhuma nota encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button className="btn-secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <span className="text-sm text-gray-500">
            Pagina {page} de {totalPages}
          </span>
          <button className="btn-secondary" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Proxima
          </button>
        </div>
      )}
    </div>
  );
}