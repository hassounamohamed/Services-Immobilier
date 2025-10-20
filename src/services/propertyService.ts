export type Property = {
  id: string;
  title: string;
  price: number;
  location?: string;
  imageUrl?: string;
  type?: 'rent' | 'sale';
};

const demo: Property[] = [
  { id: "1", title: "Appartement centre ville", price: 6500, location: "Casablanca", type: 'rent', imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200' },
  { id: "2", title: "Villa avec jardin", price: 15000, location: "Rabat", type: 'sale', imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200' },
];

export async function listProperties() {
  return demo;
}

export async function getProperty(id: string) {
  return demo.find((p) => p.id === id) ?? null;
}

export async function addProperty(p: Omit<Property, "id">) {
  const newP: Property = { ...p, id: Math.random().toString(36).slice(2) };
  demo.push(newP);
  return newP;
}
