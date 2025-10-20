export function required(value: unknown) {
  if (value === null || value === undefined) return "Ce champ est requis";
  if (typeof value === "string" && value.trim().length === 0) return "Ce champ est requis";
  return null;
}
