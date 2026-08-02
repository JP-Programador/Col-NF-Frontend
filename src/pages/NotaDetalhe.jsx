import { ArrowLeft, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Badge from "../components/common/Badge";
import { api } from "../services/api";
import { formatCnpj, formatCurrency, formatDate } from "../utils/format";

export default function NotaDetalhe() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [catalogs, setCatalogs] = useState({ categories: [], costCenters: [], branches: [] });
  const [saving, setSaving] = useState(false);

  const loadInvoice = () => {
    api.get(`/invoices/${id}`).then(({ data }) => setInvoice(data));
  };

  useEffect(() => {
    loadInvoice();
    Promise.all([api.get("/categories"), api.get("/cost-centers"), api.get("/branches")]).then(
      ([categories, costCenters, branches]) => {
        setCatalogs({ categories: categories.data, costCenters: costCenters.data, branches: branches.data });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (field, value) => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/invoices/${id}`, { [field]: value || null });
      setInvoice((prev) => ({ ...prev, ...data }));
    } finally {
      setSaving(false);
    }
  };

  if (!invoice) {
    return <p className="text-sm text-gray-400">Carregando nota fiscal...</p>;
  }

  return (
    <div className="space-y-6">
      <Link to="/notas" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-colgate-red">
        <ArrowLeft size={16} /> Voltar para lista de notas
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-colgate-graphite">
            {invoice.invoice_type === "NFSE" ? "NFS-e" : "NF-e"} #{invoice.number}
          </h2>
          <p className="text-sm text-gray-500">{invoice.supplier_name}</p>
        </div>
        <div className="flex gap-2">
          <Badge status={invoice.workflow_status}>{invoice.workflow_status}</Badge>
          <Badge status={invoice.payment_status}>{invoice.payment_status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <h3 className="text-sm font-bold text-colgate-graphite">Dados Extraidos</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <Field label="Numero" value={invoice.number} />
            <Field label="Serie" value={invoice.series} />
            <Field label="Data de Emissao" value={formatDate(invoice.issue_date)} />
            <Field label="Fornecedor" value={invoice.supplier_name} />
            <Field label="CNPJ" value={formatCnpj(invoice.supplier_cnpj)} />
            <Field label="Valor Total" value={formatCurrency(invoice.total_value)} />
            {invoice.invoice_type === "NFSE" ? (
              <>
                <Field label="Codigo de Servico" value={invoice.service_code} />
                <Field label="Descricao" value={invoice.description} span={2} />
              </>
            ) : (
              <>
                <Field label="Natureza da Operacao" value={invoice.operation_nature} />
                <Field label="Chave de Acesso" value={invoice.access_key} span={2} mono />
              </>
            )}
          </dl>

          {invoice.pdf_url && (
            <a
              href={invoice.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-2 w-full"
            >
              <FileText size={16} /> Abrir PDF original
            </a>
          )}
        </div>

        <div className="card space-y-4">
          <h3 className="text-sm font-bold text-colgate-graphite">Classificacao e Controle</h3>

          <SelectField
            label="Categoria"
            value={invoice.category_id || ""}
            options={catalogs.categories}
            onChange={(v) => handleUpdate("category_id", v)}
            disabled={saving}
          />
          <SelectField
            label="Centro de Custo"
            value={invoice.cost_center_id || ""}
            options={catalogs.costCenters}
            onChange={(v) => handleUpdate("cost_center_id", v)}
            disabled={saving}
          />
          <SelectField
            label="Filial"
            value={invoice.branch_id || ""}
            options={catalogs.branches}
            onChange={(v) => handleUpdate("branch_id", v)}
            disabled={saving}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Vencimento</label>
            <input
              type="date"
              className="input-field"
              value={invoice.due_date || ""}
              onChange={(e) => handleUpdate("due_date", e.target.value)}
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status de Pagamento</label>
            <select
              className="input-field"
              value={invoice.payment_status}
              onChange={(e) => handleUpdate("payment_status", e.target.value)}
              disabled={saving}
            >
              <option value="aberta">Aberta</option>
              <option value="paga">Paga</option>
              <option value="vencida">Vencida</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status do Fluxo</label>
            <select
              className="input-field"
              value={invoice.workflow_status}
              onChange={(e) => handleUpdate("workflow_status", e.target.value)}
              disabled={saving}
            >
              <option value="recebida">Recebida</option>
              <option value="processada">Processada</option>
              <option value="conferida">Conferida</option>
            </select>
          </div>
        </div>
      </div>

      {invoice.items?.length > 0 && (
        <div className="card overflow-x-auto p-0">
          <div className="border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-bold text-colgate-graphite">Itens da Nota</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase text-gray-400">
                <th className="px-4 py-3">Descricao</th>
                <th className="px-4 py-3 text-right">Quantidade</th>
                <th className="px-4 py-3 text-right">Valor Unit.</th>
                <th className="px-4 py-3 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3 text-right">{item.quantity ?? "-"}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.unit_value)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.total_value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, span = 1, mono = false }) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <dt className="text-xs font-medium uppercase text-gray-400">{label}</dt>
      <dd className={`mt-0.5 text-colgate-graphite ${mono ? "break-all font-mono text-xs" : ""}`}>{value || "-"}</dd>
    </div>
  );
}

function SelectField({ label, value, options, onChange, disabled }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <select className="input-field" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        <option value="">Nao definido</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
