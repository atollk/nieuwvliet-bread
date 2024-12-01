const isTauri = "__TAURI_INTERNALS__" in window;
export default isTauri;
export const isMobile = navigator.maxTouchPoints > 0;
export const isDesktop = !isMobile;
export const isTauriMobile = isTauri && isMobile;
export const isTauriDesktop = isTauri && isDesktop;
