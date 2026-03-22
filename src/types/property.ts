export type OfferType = 'louer' | 'vendre';

export type PropertyCategory =
  | 'appartement-meuble'
  | 'appartement-non-meuble'
  | 'villa-meublee'
  | 'villa-non-meublee'
  | 'terrain'
  | 'bureau';

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  offerType: OfferType;
  category: PropertyCategory;
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  district: string;
  city: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  isFurnished: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  status: 'active' | 'rented' | 'sold';
  amenities: string[];
  createdAt: string;
}

export interface PropertyFilters {
  offerType?: OfferType;
  category?: PropertyCategory;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  district?: string;
  search?: string;
}
