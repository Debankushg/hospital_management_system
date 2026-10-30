/** "500.00" + "inr" -> "₹500.00" in the viewer's locale. Falls back to plain text for unknown codes. */
export function formatMoney(amount: string | number | null | undefined, currency: string): string {
  if (amount === null || amount === undefined || amount === "") return "–";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(Number(amount));
  } catch {
    return `${amount} ${currency.toUpperCase()}`;
  }
}
