import { useState } from 'react';
import { Property, PropertyType } from '../types';

interface SearchFilters {
  type?: PropertyType;
  priceMin?: number;
  priceMax?: number;
  bedroomsMin?: number;
  bathroomsMin?: number;
  location?: string;
  searchQuery?: string;
}

export const useSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'date' | 'relevance'>('relevance');

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const applyFilters = (properties: Property[]): Property[] => {
    let filtered = [...properties];

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    // Filter by price range
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.priceMax!);
    }

    // Filter by bedrooms
    if (filters.bedroomsMin !== undefined) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin!);
    }

    // Filter by bathrooms
    if (filters.bathroomsMin !== undefined) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin!);
    }

    // Filter by location
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(p => 
        p.location.address.toLowerCase().includes(locationLower) ||
        p.location.city.toLowerCase().includes(locationLower) ||
        p.location.country.toLowerCase().includes(locationLower)
      );
    }

    // Filter by search query
    if (filters.searchQuery) {
      const queryLower = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(queryLower) ||
        p.description.toLowerCase().includes(queryLower) ||
        p.location.address.toLowerCase().includes(queryLower)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'date':
        filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // relevance - keep original order
        break;
    }

    return filtered;
  };

  const hasActiveFilters = (): boolean => {
    return Object.keys(filters).length > 0;
  };

  return {
    filters,
    sortBy,
    updateFilter,
    setSortBy,
    clearFilters,
    applyFilters,
    hasActiveFilters,
  };
};
