export function formatCurrency(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(value) {
  if (!value) return "-";

  // Datas vindas da API sao "YYYY-MM-DD" (sem horario). Extrair os
  // componentes direto da string evita que o JS interprete como UTC
  // meia-noite e "volte" um dia ao converter para o fuso horario local
  // (ex.: America/Sao_Paulo), que e o bug que fazia 23/07 virar 22/07.
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR");
}

export function formatCnpj(cnpj) {
  if (!cnpj || cnpj.length !== 14) return cnpj || "-";
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

const INVOICE_TYPE_LABELS = {
  NFSE: "NFS-e",
  NFE: "NF-e",
  RECIBO: "Recibo",
};

export function formatInvoiceType(invoiceType) {
  return INVOICE_TYPE_LABELS[invoiceType] || invoiceType || "-";
}
