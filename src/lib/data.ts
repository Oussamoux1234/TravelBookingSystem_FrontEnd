import type { Hotel, Vol, Reservation, HotelDisplay, FlightDisplay } from './types';
import { api } from './api';

// Placeholder images for hotels and flights
const hotelImages = [
  'hotel-1', 'hotel-2', 'hotel-3', 'hotel-4', 'hotel-5', 'hotel-6'
];

const flightImages = [
  'flight-1', 'flight-2', 'flight-3', 'flight-4'
];

const airlines = ['Air France', 'Emirates', 'Lufthansa', 'Qatar Airways', 'Turkish Airlines', 'British Airways'];

// Helper to get a consistent image for an ID
const getImageForId = (id: number, imageList: string[]): string => {
  return imageList[id % imageList.length];
};

// Transform backend Hotel to HotelDisplay
const transformHotel = (hotel: Hotel): HotelDisplay => ({
  ...hotel,
  imageId: getImageForId(hotel.id, hotelImages),
  rating: 4 + (hotel.id % 10) / 10, // Generate rating between 4.0-4.9
  description: `Découvrez ${hotel.nom}, situé à ${hotel.ville}. Un établissement de qualité pour votre séjour.`,
  pricePerNight: hotel.chambres && hotel.chambres.length > 0
    ? Math.min(...hotel.chambres.map(c => c.prix))
    : 100 + (hotel.id * 25)
});

// Transform backend Vol to FlightDisplay
const transformVol = (vol: Vol): FlightDisplay => ({
  ...vol,
  imageId: getImageForId(vol.id, flightImages),
  airline: airlines[vol.id % airlines.length]
});

/**
 * Fetch hotels from backend
 * Handles both direct arrays and HAL/JSON responses from Spring Data REST
 */
export const getHotels = async (): Promise<HotelDisplay[]> => {
  try {
    const response = await api.get<any>('/hotels');

    // Handle Spring Data REST HAL response
    let hotels: Hotel[];
    if (response._embedded && response._embedded.hotels) {
      hotels = response._embedded.hotels;
    } else if (Array.isArray(response)) {
      hotels = response;
    } else {
      console.warn('Unexpected hotels response format:', response);
      return [];
    }

    return hotels.map(transformHotel);
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
    return [];
  }
};

/**
 * Fetch a single hotel by ID
 */
export const getHotelById = async (id: string): Promise<HotelDisplay | undefined> => {
  try {
    const hotel = await api.get<Hotel>(`/hotels/${id}`);
    return transformHotel(hotel);
  } catch (error) {
    console.error(`Failed to fetch hotel ${id}:`, error);
    return undefined;
  }
};

/**
 * Fetch flights (vols) from backend
 * Handles both direct arrays and HAL/JSON responses from Spring Data REST
 */
export const getFlights = async (): Promise<FlightDisplay[]> => {
  try {
    // Backend uses /vols endpoint
    const response = await api.get<any>('/vols');

    // Handle Spring Data REST HAL response
    let vols: Vol[];
    if (response._embedded && response._embedded.vols) {
      vols = response._embedded.vols;
    } else if (Array.isArray(response)) {
      vols = response;
    } else {
      console.warn('Unexpected vols response format:', response);
      return [];
    }

    return vols.map(transformVol);
  } catch (error) {
    console.error('Failed to fetch flights:', error);
    return [];
  }
};

/**
 * Fetch a single flight by ID
 */
export const getFlightById = async (id: string): Promise<FlightDisplay | undefined> => {
  try {
    const vol = await api.get<Vol>(`/vols/${id}`);
    return transformVol(vol);
  } catch (error) {
    console.error(`Failed to fetch flight ${id}:`, error);
    return undefined;
  }
};

/**
 * Create a new reservation
 */
type ReservationPayload = {
  clientEmail: string;
  type: 'flight' | 'hotel';
  itemId: number;
};

export const createReservation = async (bookingData: ReservationPayload): Promise<Reservation> => {
  const payload: { clientEmail: string; hotelId?: number; volId?: number } = {
    clientEmail: bookingData.clientEmail
  };

  if (bookingData.type === 'hotel') {
    payload.hotelId = bookingData.itemId;
  } else {
    payload.volId = bookingData.itemId;
  }

  return api.post<Reservation>('/reservations', payload);
};

/**
 * Get reservations by email
 */
export const getReservationsByEmail = async (email: string): Promise<Reservation[]> => {
  try {
    const response = await api.get<any>(`/reservations/search/findByClientEmail?clientEmail=${encodeURIComponent(email)}`);

    // Handle Spring Data REST HAL response
    if (response._embedded && response._embedded.reservations) {
      return response._embedded.reservations;
    } else if (Array.isArray(response)) {
      return response;
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    return [];
  }
};
