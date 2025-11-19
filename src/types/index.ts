export type PropertyType = 'sale' | 'rent';
export type PropertyCategory = 'apartment' | 'house' | 'villa' | 'studio' | 'office';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
  createdAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  propertyType: PropertyCategory;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  amenities: string[];
  ownerId: string;
  ownerName: string;
  ownerPhoto?: string;
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
  rentType?: 'month' | 'week' | 'day';
  status?: 'available' | 'rented' | 'sold';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  propertyId?: string;
  propertyTitle?: string;
}

export interface Favorite {
  userId: string;
  propertyId: string;
  addedAt: Date;
}
