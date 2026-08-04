import { X } from "lucide-react";
import { useState } from "react";

import { api } from "../../services/api";
import { showAlert } from "../../utils/alerts";
import { formatInvoiceType } from "../../utils/format";

const EDITABLE_FIELDS = [
  "number",
  "series",
  "issue_date",
  "supplier_name",
  "supplier_cnpj",
  "total_value",
  "purchase_order",
  "description",
  "service_code",
  "operation_nature",
  "access_key",
];

export default function InvoiceEditModal({ invoice, onClose, onSaved }) {
  const [form, setForm] = useState(() => {
    const initial = {};
    EDITABLE_FIELDS.forEach((field) => {
      initial[field] = invoice[field] ?? "";
    });
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        total_value: form.total_value === "" ? null : Number(form.total_value),
        issue_date: form.issue_date || null,
      };
      const { data } = await api.patch(`/invoices/${invoice.id}`, payload);
      onSaved(data);
      onClose();
      showAlert.toast("Nota atualizada com sucesso!", "success");
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao salvar as alteracoes.");
    } finally {
      setSaving(false);
    }
  };

  const isNfse = invoice.invoice_type === "NFSE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-colgate-graphite">
            Editar {formatInvoiceType(invoice.invoice_type)} #{invoice.number}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-colgate-graphite">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Numero" value={form.number} onChange={(v) => update("number", v)} />
            <TextField label="Serie" value={form.series} onChange={(v) => update("series", v)} />
            <TextField
              label="Data de Emissao"
              type="date"
              value={form.issue_date}
              onChange={(v) => update("issue_date", v)}
            />
            <TextField
              label="Valor Total"
              type="number"
              step="0.01"
              value={form.total_value}
              onChange={(v) => update("total_value", v)}
            />
            <TextField label="Fornecedor" value={form.supplier_name} onChange={(v) => update("supplier_name", v)} />
            <TextField label="CNPJ do Fornecedor" value={form.supplier_cnpj} onChange={(v) => update("supplier_cnpj", v)} />
            <TextField label="Numero do Pedido" value={form.purchase_order} onChange={(v) => update("purchase_order", v)} />

            {isNfse ? (
              <TextField label="Codigo de Servico" value={form.service_code} onChange={(v) => update("service_code", v)} />
            ) : (
              <>
                <TextField
                  label="Natureza da Operacao"
                  value={form.operation_nature}
                  onChange={(v) => update("operation_nature", v)}
                />
                <TextField label="Chave de Acesso" value={form.access_key} onChange={(v) => update("access_key", v)} mono />
              </>
            )}
          </div>

          {isNfse && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Descricao do Servico</label>
              <textarea
                className="input-field min-h-[80px]"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-colgate-red/10 px-3 py-2 text-sm font-medium text-colgate-red">{error}</p>
          )}

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Salvando..." : "Salvar alteracoes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", step, mono = false }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        step={step}
        className={`input-field ${mono ? "font-mono text-xs" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
