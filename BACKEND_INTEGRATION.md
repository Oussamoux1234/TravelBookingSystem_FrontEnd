# Frontend-Backend Integration Guide

## Overview
This document explains how to connect the **NomadNavigator** React frontend with the **TravelBookingSystem** Spring Boot microservices backend.

## Backend Services

Your backend consists of the following microservices:

### Service Endpoints

| Service | Direct URL | Gateway URL | Description |
|---------|-----------|-------------|-------------|
| Eureka Dashboard | http://localhost:8761 | N/A | Service discovery |
| Hotel Service | http://localhost:8082/hotels | http://localhost:8080/hotels | Hotel management |
| Vol Service | http://localhost:8081/vols | http://localhost:8080/vols | Flight management |
| Booking Service | http://localhost:8083/reservations | http://localhost:8080/reservations | Reservation management |
| API Gateway | http://localhost:8080 | N/A | Main entry point |

## Frontend Configuration

### 1. Create Environment File

Create a `.env` file in the `NomadNavigator-main` directory:

```bash
# Backend API - Spring Cloud Gateway
VITE_API_BASE_URL=http://localhost:8080

# AI Server (optional)
VITE_AI_SERVER_URL=http://localhost:3001

# Firebase (optional - for authentication)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 2. Install Dependencies

```powershell
cd "c:\Projets IntelliJ IDEA\Nouveau dossier\NomadNavigator-main"
npm install
```

### 3. Start the Frontend

```powershell
npm run dev
```

The frontend will start on `http://localhost:5173` (or the next available port).

## Integration Details

### API Client (`src/lib/api.ts`)
- Centralized HTTP client using `fetch`
- Automatically adds `Content-Type` and `Authorization` headers
- Supports GET, POST, PUT, DELETE methods
- Uses environment variable `VITE_API_BASE_URL` for backend URL

### Data Service (`src/lib/data.ts`)
- Handles Spring Data REST HAL/JSON responses
- Transforms backend entities to frontend display types
- Key functions:
  - `getHotels()`: Fetches all hotels from `/hotels`
  - `getFlights()`: Fetches all flights from `/vols`
  - `getHotelById(id)`: Fetches a specific hotel
  - `getFlightById(id)`: Fetches a specific flight
  - `createReservation(data)`: Creates a new reservation
  - `getReservationsByEmail(email)`: Fetches user reservations

### Type Mappings

#### Backend (Java) → Frontend (TypeScript)

**Hotel Entity:**
```java
// Java
class Hotel {
    Long id;
    String nom;
    String adresse;
    String ville;
    List<Chambre> chambres;
}
```
```typescript
// TypeScript
type Hotel = {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
    chambres?: Chambre[];
}
```

**Vol Entity:**
```java
// Java
class Vol {
    Long id;
    String numeroVol;
    String aeroportDepart;
    String aeroportArrivee;
    LocalDateTime dateHeureDepart;
    BigDecimal prix;
    Integer placesDisponibles;
}
```
```typescript
// TypeScript
type Vol = {
    id: number;
    numeroVol: string;
    aeroportDepart: string;
    aeroportArrivee: string;
    dateHeureDepart: string;
    prix: number;
    placesDisponibles: number;
}
```

**Reservation Entity:**
```java
// Java
class Reservation {
    Long id;
    String clientEmail;
    Long hotelId;
    Long volId;
}
```
```typescript
// TypeScript
type Reservation = {
    id: number;
    clientEmail: string;
    hotelId?: number;
    volId?: number;
}
```

## Testing the Integration

### 1. Start Backend Services

Make sure all your Spring Boot services are running:
- Eureka Server
- API Gateway
- Hotel Service
- Vol Service
- Booking Service

### 2. Verify Backend

Open http://localhost:8761 to see all services registered in Eureka.

Test the endpoints:
```powershell
# Get all hotels
curl http://localhost:8080/hotels

# Get all flights
curl http://localhost:8080/vols

# Create a reservation
curl -X POST http://localhost:8080/reservations `
  -H "Content-Type: application/json" `
  -d '{"clientEmail":"test@example.com","hotelId":1}'
```

### 3. Start Frontend

```powershell
npm run dev
```

### 4. Test Features

1. **Browse Hotels**: http://localhost:5173/hotels
2. **Browse Flights**: http://localhost:5173/flights
3. **View Hotel Details**: Click on any hotel card
4. **View Flight Details**: Click on any flight card
5. **Make a Booking**: Click "Réserver" on a detail page
6. **View Reservations**: Go to Profile page

## Troubleshooting

### CORS Issues
If you see CORS errors, add this to your Spring Boot Gateway configuration:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173");
        config.setAllowCredentials(true);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### Empty Data
If services return empty arrays:
1. Check that your services have data in their databases
2. Verify Spring Data REST is exposing endpoints correctly
3. Check console for error messages

### Connection Refused
- Ensure all backend services are running
- Check that ports match (8080 for gateway)
- Verify `VITE_API_BASE_URL` in `.env`

## Development Workflow

1. **Backend Changes**: Restart the affected Spring Boot service
2. **Frontend Changes**: Vite will hot-reload automatically
3. **Type Changes**: Update both `src/lib/types.ts` and Java entities to stay in sync

## Next Steps

- Add authentication with Firebase or Spring Security
- Implement search and filtering
- Add pagination for large datasets
- Implement real payment processing
- Add user profile management

## Updated Files

The following files have been modified to integrate with the backend:

- `src/lib/types.ts` - Type definitions matching backend entities
- `src/lib/data.ts` - API service functions
- `src/lib/api.ts` - HTTP client (already configured)
- `src/components/listing-card.tsx` - Updated to use new types
- `src/pages/Hotels.tsx` - Already configured
- `src/pages/Flights.tsx` - Already configured
- `src/pages/HotelDetail.tsx` - Updated for backend data
- `src/pages/FlightDetail.tsx` - Updated for backend data
- `src/pages/Booking.tsx` - Updated to create reservations
- `src/pages/Profile.tsx` - (You may need to update this for reservations)

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for errors
3. Verify all services are registered in Eureka
4. Test endpoints directly with curl/Postman
