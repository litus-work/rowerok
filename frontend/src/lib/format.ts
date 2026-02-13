export function formatMoney(value: number | string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "0";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);
}
