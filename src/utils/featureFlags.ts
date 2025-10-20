import { config } from "../constants/config";

export function getFeatureFlag<K extends keyof typeof config.features>(key: K): boolean {
  return Boolean(config.features?.[key]);
}
