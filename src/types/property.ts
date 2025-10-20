export type Property = {
  id: string;
  title: string;
  description?: string;
  price: number;
  type?: "rent" | "sale";
  location?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  ownerId?: string;
};
