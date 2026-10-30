/**
 * Opens a PDF blob in a new tab. Call `openBlankTab()` first, inside the click handler, so the browser
 * does not block the popup while the file is downloading.
 */
export const openBlankTab = () => window.open("", "_blank");

export function showPdfInTab(tab: Window | null, blob: Blob) {
  const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
  if (tab && !tab.closed) tab.location.href = url;
  else window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
