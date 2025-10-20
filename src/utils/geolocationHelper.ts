export type Coordinates = { latitude: number; longitude: number };

export async function getCurrentPosition(): Promise<Coordinates> {
  // Placeholder: integrate expo-location later
  return { latitude: 33.5731, longitude: -7.5898 }; // Casablanca
}
