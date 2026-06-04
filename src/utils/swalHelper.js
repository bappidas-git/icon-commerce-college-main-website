import Swal from 'sweetalert2';

/**
 * SweetAlert2 wrapper that ensures popups render ABOVE all overlays (drawers,
 * modals) and applies the Icon Commerce College navy + gold brand palette.
 * Use this instead of Swal.fire() throughout the app.
 */

// Brand palette (design-system §2).
const NAVY = '#1A2A52';
const GOLD = '#C8A04D';
const NAVY_INK = '#14233D';

const swalConfig = {
  backdrop: 'rgba(17, 29, 58, 0.72)', // --color-navy-overlay
  iconColor: GOLD,
  confirmButtonColor: NAVY,
  customClass: {
    container: 'swal-above-drawer',
    popup: 'swal-above-drawer-popup',
    title: 'swal-icc-title',
    confirmButton: 'swal-icc-confirm',
  },
  didOpen: () => {
    const container = document.querySelector('.swal2-container');
    if (container) container.style.zIndex = '100000';

    // Inject brand styling once (navy headings, gold-trimmed confirm button).
    if (!document.getElementById('swal-icc-styles')) {
      const style = document.createElement('style');
      style.id = 'swal-icc-styles';
      style.textContent = `
        .swal-icc-title { color: ${NAVY_INK} !important; font-family: 'Poppins', sans-serif !important; font-weight: 700 !important; }
        .swal-icc-confirm { font-family: 'Inter', sans-serif !important; font-weight: 600 !important; border-radius: 10px !important; box-shadow: 0 4px 14px rgba(26, 42, 82, 0.25) !important; border: 1px solid ${GOLD} !important; }
        .swal-icc-confirm:focus-visible { outline: 2px solid ${GOLD} !important; outline-offset: 2px; }
      `;
      document.head.appendChild(style);
    }
  },
};

export const showAlert = (options) => {
  return Swal.fire({
    ...swalConfig,
    ...options,
  });
};

export const showSuccess = (title, text) => {
  return showAlert({
    icon: 'success',
    title,
    text,
    iconColor: GOLD,
    confirmButtonColor: NAVY,
    confirmButtonText: 'Great!',
  });
};

export const showError = (title, text) => {
  return showAlert({
    icon: 'error',
    title,
    text,
    // Warm red for error icon reads clearly against navy text.
    iconColor: '#E0301E',
    confirmButtonColor: NAVY,
  });
};

export const showInfo = (title, text) => {
  return showAlert({
    icon: 'info',
    title,
    text,
    iconColor: GOLD,
    confirmButtonColor: NAVY,
  });
};

export default showAlert;
