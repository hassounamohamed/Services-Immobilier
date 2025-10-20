export function formatPrice(v: number, currency = "TND", locale = "fr-TN") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(v);
}
