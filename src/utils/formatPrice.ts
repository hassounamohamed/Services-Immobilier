export function formatPrice(v: number, currency = "MAD") {
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency }).format(v);
}
