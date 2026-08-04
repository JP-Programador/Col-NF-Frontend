import Swal from "sweetalert2";

/**
 * Helper centralizado de alertas/notificacoes (SweetAlert2), com o visual
 * Dark Premium da Central de Inteligencia. Nao use alert()/confirm() nativos
 * do navegador nem Swal.fire() direto em nenhuma tela - sempre passe por
 * este modulo, para o visual e o comportamento ficarem consistentes.
 */

const COLORS = {
  background: "#1a1a1a",
  text: "#ffffff",
  textMuted: "#a0a0a0",
  border: "rgba(255, 255, 255, 0.1)",
  action: "#2a2a2a",
  danger: "#e63946",
  neutral: "#333333",
};

const BASE_OPTIONS = {
  background: COLORS.background,
  color: COLORS.text,
  confirmButtonColor: COLORS.action,
  customClass: {
    popup: "cn-alert-popup",
    confirmButton: "cn-alert-btn cn-alert-btn-confirm",
    cancelButton: "cn-alert-btn cn-alert-btn-cancel",
    denyButton: "cn-alert-btn cn-alert-btn-deny",
  },
  buttonsStyling: false,
};

let stylesInjected = false;

/** Injeta o CSS customizado do popup uma unica vez (bordas, radius, fontes dos botoes). */
function ensureStyles() {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement("style");
  style.setAttribute("data-cn-alerts", "true");
  style.textContent = `
    .cn-alert-popup {
      border: 1px solid ${COLORS.border} !important;
      border-radius: 12px !important;
    }
    .cn-alert-popup .swal2-title {
      color: ${COLORS.text} !important;
    }
    .cn-alert-popup .swal2-html-container {
      color: ${COLORS.textMuted} !important;
    }
    .cn-alert-btn {
      border-radius: 8px !important;
      border: none !important;
      padding: 0.6rem 1.25rem !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      margin: 0 0.25rem !important;
      transition: filter 0.15s ease, transform 0.05s ease;
    }
    .cn-alert-btn:hover {
      filter: brightness(1.15);
    }
    .cn-alert-btn:active {
      transform: scale(0.98);
    }
    .cn-alert-btn-confirm {
      background: ${COLORS.action} !important;
      color: ${COLORS.text} !important;
    }
    .cn-alert-btn-deny {
      background: ${COLORS.danger} !important;
      color: ${COLORS.text} !important;
    }
    .cn-alert-btn-cancel {
      background: ${COLORS.neutral} !important;
      color: ${COLORS.text} !important;
    }
    .cn-alert-toast {
      border: 1px solid ${COLORS.border} !important;
    }
  `;
  document.head.appendChild(style);
}

ensureStyles();

function success(title, message) {
  return Swal.fire({
    ...BASE_OPTIONS,
    icon: "success",
    title,
    text: message,
    iconColor: "#22c55e",
  });
}

function error(title, message) {
  return Swal.fire({
    ...BASE_OPTIONS,
    icon: "error",
    title,
    text: message,
    iconColor: COLORS.danger,
    confirmButtonColor: COLORS.danger,
  });
}

function warning(title, message) {
  return Swal.fire({
    ...BASE_OPTIONS,
    icon: "warning",
    title,
    text: message,
    iconColor: "#f59e0b",
  });
}

/**
 * Mostra um spinner de carregamento bloqueante (ex.: aguardando upload de
 * PDF ou chamada a API). Retorna uma funcao `close()` - chame quando a
 * operacao terminar.
 */
function loading(title = "Processando...", message) {
  Swal.fire({
    ...BASE_OPTIONS,
    title,
    text: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  return () => Swal.close();
}

/**
 * Modal de confirmacao reutilizavel. `onConfirm` pode ser assincrono - o
 * botao mostra um spinner de loading enquanto ele roda, e o modal so fecha
 * depois que a promise resolver (ou mostra o erro, se rejeitar).
 */
async function confirm({
  title = "Tem certeza?",
  text,
  icon = "warning",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
  onConfirm,
}) {
  const result = await Swal.fire({
    ...BASE_OPTIONS,
    title,
    text,
    icon,
    iconColor: danger ? COLORS.danger : "#f59e0b",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: danger ? COLORS.danger : COLORS.action,
    customClass: {
      ...BASE_OPTIONS.customClass,
      confirmButton: danger
        ? "cn-alert-btn cn-alert-btn-deny"
        : "cn-alert-btn cn-alert-btn-confirm",
    },
    reverseButtons: true,
    showLoaderOnConfirm: Boolean(onConfirm),
    preConfirm: onConfirm
      ? async () => {
          try {
            return await onConfirm();
          } catch (err) {
            Swal.showValidationMessage(err.response?.data?.detail || err.message || "Ocorreu um erro.");
            return false;
          }
        }
      : undefined,
    allowOutsideClick: () => !Swal.isLoading(),
  });

  return result.isConfirmed && result.value !== false;
}

/** Notificacao discreta no canto superior direito. icon: success|error|warning|info */
function toast(title, icon = "success") {
  return Swal.fire({
    ...BASE_OPTIONS,
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: "cn-alert-popup cn-alert-toast",
    },
  });
}

export const showAlert = {
  success,
  error,
  warning,
  loading,
  confirm,
  toast,
};

export default showAlert;
