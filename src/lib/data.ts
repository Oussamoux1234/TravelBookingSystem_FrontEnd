import type { Hotel, Vol, Reservation, HotelDisplay, FlightDisplay, ReservationDisplay } from './types';
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
const transformHotel = (hotel: any): HotelDisplay => ({
  ...hotel,
  imageId: getImageForId(hotel.id, hotelImages),
  rating: 4 + (hotel.id % 10) / 10, // Generate rating between 4.0-4.9
  description: `Découvrez ${hotel.nom}, situé à ${hotel.ville}. Un établissement de qualité pour votre séjour.`,
  // Handle prixParNuit from backend or calculate from chambres
  pricePerNight: hotel.prixParNuit
    ? Number(hotel.prixParNuit)
    : (hotel.chambres && hotel.chambres.length > 0
      ? Math.min(...hotel.chambres.map((c: any) => Number(c.prix) || 100))
      : 100 + (hotel.id * 25))
});

// Transform backend Vol to FlightDisplay
const transformVol = (vol: Vol): FlightDisplay => ({
  ...vol,
  imageId: getImageForId(vol.id, flightImages),
  airline: airlines[vol.id % airlines.length]
});

// Helper to extract ID from Spring Data REST HAL _links.self.href
const extractIdFromHal = (item: any): number | undefined => {
  if (item.id !== undefined) {
    return item.id;
  }

  // Extract from HAL _links.self.href (e.g., "http://localhost:8082/hotels/1")
  if (item._links?.self?.href) {
    const match = item._links.self.href.match(/\/(\d+)$/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return undefined;
};

/**
 * Fetch hotels from backend
 * Handles both direct arrays and HAL/JSON responses from Spring Data REST
 */
export const getHotels = async (): Promise<HotelDisplay[]> => {
  try {
    const response = await api.get<any>('/hotels');

    // Handle Spring Data REST HAL response
    let hotels: any[];
    if (response._embedded && response._embedded.hotels) {
      hotels = response._embedded.hotels;
    } else if (Array.isArray(response)) {
      hotels = response;
    } else {
      console.warn('Unexpected hotels response format:', response);
      return [];
    }

    // Extract IDs from HAL links and add to objects
    const hotelsWithIds = hotels.map(hotel => ({
      ...hotel,
      id: extractIdFromHal(hotel) || hotel.id
    }));

    return hotelsWithIds.map(transformHotel);
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
    const hotel = await api.get<any>(`/hotels/${id}`);
    // Add ID if not present
    hotel.id = extractIdFromHal(hotel) || parseInt(id, 10);
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
    let vols: any[];
    if (response._embedded && response._embedded.vols) {
      vols = response._embedded.vols;
    } else if (Array.isArray(response)) {
      vols = response;
    } else {
      console.warn('Unexpected vols response format:', response);
      return [];
    }

    // Extract IDs from HAL links and add to objects
    const volsWithIds = vols.map(vol => ({
      ...vol,
      id: extractIdFromHal(vol) || vol.id
    }));

    return volsWithIds.map(transformVol);
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
    const vol = await api.get<any>(`/vols/${id}`);
    // Add ID if not present
    vol.id = extractIdFromHal(vol) || parseInt(id, 10);
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
  passengerName: string;
  // Hotel-specific options
  typeChambre?: string;
  checkInDate?: string;
  checkOutDate?: string;
  // Flight-specific options
  seatNumber?: string;
  flightClass?: string;
};

export const createReservation = async (bookingData: ReservationPayload): Promise<Reservation> => {
  const payload = {
    clientEmail: bookingData.clientEmail,
    hotelId: bookingData.type === 'hotel' ? bookingData.itemId : 0,
    volId: bookingData.type === 'flight' ? bookingData.itemId : 0,
    passengerName: bookingData.passengerName,
    typeChambre: bookingData.typeChambre || '',
    seatNumber: bookingData.seatNumber || '',
    flightClass: bookingData.flightClass || '',
    checkInDate: bookingData.checkInDate || null,
    checkOutDate: bookingData.checkOutDate || null,
  };

  console.log('Creating reservation with payload:', payload);
  return api.post<Reservation>('/reservations', payload);
};

/**
 * Get a single reservation by ID
 */
export const getReservationById = async (id: string): Promise<Reservation | undefined> => {
  try {
    const reservation = await api.get<Reservation>(`/reservations/${id}`);
    return reservation;
  } catch (error) {
    console.error(`Failed to fetch reservation ${id}:`, error);
    return undefined;
  }
};

/**
 * Get current user's reservations (requires authentication)
 */
export const getMyReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await api.get<Reservation[]>('/reservations/my');
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch my reservations:', error);
    return [];
  }
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

/**
 * Get reservations with full hotel/flight details for display
 */
export const getReservationsWithDetails = async (email: string): Promise<ReservationDisplay[]> => {
  try {
    const reservations = await getReservationsByEmail(email);

    // Enrich each reservation with hotel or flight details
    const enrichedReservations = await Promise.all(
      reservations.map(async (reservation) => {
        const enriched: ReservationDisplay = {
          ...reservation,
          itemType: reservation.hotelId ? 'hotel' : 'flight',
          itemName: '',
          bookingDate: reservation.dateReservation || new Date().toISOString(),
        };

        try {
          if (reservation.hotelId) {
            // Fetch hotel details
            const hotel = await getHotelById(String(reservation.hotelId));
            if (hotel) {
              enriched.hotel = hotel;
              enriched.itemName = hotel.nom;
            } else {
              enriched.itemName = `Hôtel #${reservation.hotelId}`;
            }
          } else if (reservation.volId) {
            // Fetch flight details
            const flight = await getFlightById(String(reservation.volId));
            if (flight) {
              enriched.flight = flight;
              enriched.itemName = `${flight.aeroportDepart} → ${flight.aeroportArrivee}`;
            } else {
              enriched.itemName = `Vol #${reservation.volId}`;
            }
          }
        } catch (error) {
          console.error(`Failed to fetch details for reservation ${reservation.id}:`, error);
          // Keep the reservation with basic info
        }

        return enriched;
      })
    );

    return enrichedReservations;
  } catch (error) {
    console.error('Failed to fetch reservations with details:', error);
    return [];
  }
};

/**
 * Get current user's reservations with full hotel/flight details (requires auth)
 */
export const getMyReservationsWithDetails = async (): Promise<ReservationDisplay[]> => {
  try {
    const reservations = await getMyReservations();

    const enrichedReservations = await Promise.all(
      reservations.map(async (reservation) => {
        const enriched: ReservationDisplay = {
          ...reservation,
          itemType: reservation.hotelId ? 'hotel' : 'flight',
          itemName: '',
          bookingDate: reservation.dateReservation || new Date().toISOString(),
        };

        try {
          if (reservation.hotelId) {
            const hotel = await getHotelById(String(reservation.hotelId));
            if (hotel) {
              enriched.hotel = hotel;
              enriched.itemName = hotel.nom;
            } else {
              enriched.itemName = `Hôtel #${reservation.hotelId}`;
            }
          } else if (reservation.volId) {
            const flight = await getFlightById(String(reservation.volId));
            if (flight) {
              enriched.flight = flight;
              enriched.itemName = `${flight.aeroportDepart} → ${flight.aeroportArrivee}`;
            } else {
              enriched.itemName = `Vol #${reservation.volId}`;
            }
          }
        } catch (error) {
          console.error(`Failed to fetch details for reservation ${reservation.id}:`, error);
        }

        return enriched;
      })
    );

    return enrichedReservations;
  } catch (error) {
    console.error('Failed to fetch my reservations with details:', error);
    return [];
  }
};
