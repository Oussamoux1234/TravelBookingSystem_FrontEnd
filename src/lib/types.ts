// Backend entity types matching the Spring Boot microservices
export type Chambre = {
  id: number;
  numero: string;
  type: string;
  prix: number;
  disponible: boolean;
};

export type Hotel = {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  chambres?: Chambre[];
};

export type Vol = {
  id: number;
  numeroVol: string;
  aeroportDepart: string;
  aeroportArrivee: string;
  dateHeureDepart: string; // ISO date string
  prix: number;
  placesDisponibles: number;
};

export type Reservation = {
  id: number;
  clientEmail: string;
  hotelId?: number;
  volId?: number;
  dateReservation?: string;
};

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

// Frontend display types (transformed from backend types)
export type HotelDisplay = Hotel & {
  imageId: string;
  rating: number;
  description: string;
  pricePerNight: number;
};

export type FlightDisplay = Vol & {
  imageId: string;
  airline: string;
};
