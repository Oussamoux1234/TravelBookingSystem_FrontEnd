import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getReservationById, getHotelById, getFlightById } from '@/lib/data';
import type { Reservation, HotelDisplay, FlightDisplay } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { placeholderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Plane,
    Hotel as HotelIcon,
    Calendar,
    MapPin,
    User,
    Mail,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    ArrowLeft
} from 'lucide-react';

// Status badge variants
const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof CheckCircle }> = {
    CONFIRMEE: { label: 'Confirmée', variant: 'default', icon: CheckCircle },
    EN_ATTENTE_PAIEMENT: { label: 'En attente de paiement', variant: 'secondary', icon: Clock },
    ANNULEE: { label: 'Annulée', variant: 'destructive', icon: XCircle },
};

// Room type labels
const ROOM_TYPE_LABELS: Record<string, string> = {
    SIMPLE: 'Chambre Simple',
    DOUBLE: 'Chambre Double',
    SUITE: 'Suite',
};

// Flight class labels
const FLIGHT_CLASS_LABELS: Record<string, string> = {
    ECONOMY: 'Économique',
    BUSINESS: 'Business',
    FIRST: 'Première Classe',
};

export default function ReservationDetail() {
    const { id } = useParams<{ id: string }>();
    const [reservation, setReservation] = useState<Reservation | null | undefined>(null);
    const [hotel, setHotel] = useState<HotelDisplay | null>(null);
    const [flight, setFlight] = useState<FlightDisplay | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;

            setIsLoading(true);
            const reservationData = await getReservationById(id);
            setReservation(reservationData);

            if (reservationData) {
                // Fetch associated hotel or flight details
                if (reservationData.hotelId && reservationData.hotelId > 0) {
                    const hotelData = await getHotelById(String(reservationData.hotelId));
                    setHotel(hotelData || null);
                }
                if (reservationData.volId && reservationData.volId > 0) {
                    const flightData = await getFlightById(String(reservationData.volId));
                    setFlight(flightData || null);
                }
            }

            setIsLoading(false);
        }
        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <>
                <Helmet><title>Détails de Réservation - Nomad Navigator</title></Helmet>
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-64 w-full rounded-lg" />
                        <Skeleton className="h-48 w-full rounded-lg" />
                    </div>
                </div>
            </>
        );
    }

    if (!reservation) {
        return (
            <>
                <Helmet><title>Réservation Non Trouvée - Nomad Navigator</title></Helmet>
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Réservation non trouvée</h1>
                    <p className="text-muted-foreground mb-6">La réservation demandée n'existe pas ou a été supprimée.</p>
                    <Button asChild>
                        <Link to="/profile"><ArrowLeft className="w-4 h-4 mr-2" />Retour au profil</Link>
                    </Button>
                </div>
            </>
        );
    }

    const statusConfig = STATUS_CONFIG[reservation.statutReservation || 'EN_ATTENTE_PAIEMENT'];
    const StatusIcon = statusConfig?.icon || Clock;
    const isHotelBooking = hotel !== null;
    const isFlightBooking = flight !== null;
    const image = hotel?.imageId || flight?.imageId;
    const placeholderImage = image ? placeholderImages.find(p => p.id === image) : null;

    return (
        <>
            <Helmet>
                <title>Réservation #{reservation.id} - Nomad Navigator</title>
                <meta name="description" content={`Détails de la réservation #${reservation.id}`} />
            </Helmet>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Back button */}
                    <Button variant="ghost" asChild className="mb-6">
                        <Link to="/profile"><ArrowLeft className="w-4 h-4 mr-2" />Retour au profil</Link>
                    </Button>

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold font-headline">Réservation #{reservation.id}</h1>
                            {reservation.dateReservation && (
                                <p className="text-muted-foreground mt-1">
                                    Réservée le {format(new Date(reservation.dateReservation), 'PPP à HH:mm', { locale: fr })}
                                </p>
                            )}
                        </div>
                        <Badge variant={statusConfig?.variant || 'secondary'} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig?.label || 'Inconnu'}
                        </Badge>
                    </div>

                    {/* Main content */}
                    <div className="space-y-6">
                        {/* Booking item card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {isHotelBooking && <><HotelIcon className="w-5 h-5" /> Hôtel</>}
                                    {isFlightBooking && <><Plane className="w-5 h-5" /> Vol</>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col md:flex-row gap-6">
                                    {placeholderImage && (
                                        <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={placeholderImage.imageUrl}
                                                alt={hotel?.nom || flight?.aeroportArrivee || 'Booking image'}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-3">
                                        {isHotelBooking && hotel && (
                                            <>
                                                <h3 className="text-xl font-semibold">{hotel.nom}</h3>
                                                <p className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="w-4 h-4" />
                                                    {hotel.ville} - {hotel.adresse}
                                                </p>
                                                {reservation.typeChambre && (
                                                    <p className="flex items-center gap-2">
                                                        <HotelIcon className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Type de chambre:</span>
                                                        <span className="font-medium">{ROOM_TYPE_LABELS[reservation.typeChambre] || reservation.typeChambre}</span>
                                                    </p>
                                                )}
                                                {reservation.checkInDate && (
                                                    <p className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Arrivée:</span>
                                                        <span className="font-medium">{reservation.checkInDate}</span>
                                                    </p>
                                                )}
                                                {reservation.checkOutDate && (
                                                    <p className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Départ:</span>
                                                        <span className="font-medium">{reservation.checkOutDate}</span>
                                                    </p>
                                                )}
                                            </>
                                        )}
                                        {isFlightBooking && flight && (
                                            <>
                                                <h3 className="text-xl font-semibold">
                                                    {flight.aeroportDepart} → {flight.aeroportArrivee}
                                                </h3>
                                                <p className="flex items-center gap-2 text-muted-foreground">
                                                    <Plane className="w-4 h-4" />
                                                    {flight.airline} - {flight.numeroVol}
                                                </p>
                                                {flight.dateHeureDepart && (
                                                    <p className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Départ:</span>
                                                        <span className="font-medium">
                                                            {format(new Date(flight.dateHeureDepart), 'PPP à HH:mm', { locale: fr })}
                                                        </span>
                                                    </p>
                                                )}
                                                {reservation.flightClass && (
                                                    <p className="flex items-center gap-2">
                                                        <Plane className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Classe:</span>
                                                        <span className="font-medium">{FLIGHT_CLASS_LABELS[reservation.flightClass] || reservation.flightClass}</span>
                                                    </p>
                                                )}
                                                {reservation.seatNumber && (
                                                    <p className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Siège:</span>
                                                        <span className="font-medium">{reservation.seatNumber}</span>
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Passenger / Customer info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" /> Informations du Client
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {reservation.passengerName && (
                                    <p className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Nom:</span>
                                        <span className="font-medium">{reservation.passengerName}</span>
                                    </p>
                                )}
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium">{reservation.clientEmail}</span>
                                </p>
                            </CardContent>
                        </Card>

                        {/* Payment info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" /> Paiement
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {reservation.transactionPaiementId && (
                                    <p className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Transaction ID:</span>
                                        <span className="font-mono text-sm">{reservation.transactionPaiementId}</span>
                                    </p>
                                )}
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-semibold">Montant Total</span>
                                        <span className="font-bold text-2xl text-primary">
                                            ${reservation.montantTotal?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
