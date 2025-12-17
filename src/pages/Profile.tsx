// Converted from Next.js to React
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Ticket, Hotel as HotelIcon, Plane, MapPin, Calendar } from 'lucide-react';
import type { ReservationDisplay } from '@/lib/types';
import { getReservationsWithDetails } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Profile() {
    const [bookings, setBookings] = useState<ReservationDisplay[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const userEmail = 'user@example.com'; // Mock user

    useEffect(() => {
        const fetchBookings = async () => {
            setBookingsLoading(true);
            const userBookings = await getReservationsWithDetails(userEmail);
            setBookings(userBookings);
            setBookingsLoading(false);
        };
        fetchBookings();
    }, [userEmail]);

    return (
        <>
            <Helmet>
                <title>Mon Profil - Nomad Navigator</title>
                <meta name="description" content="Consultez vos réservations de voyage et vos informations de profil" />
            </Helmet>

            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader className="bg-secondary/30 p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                <AvatarImage src={'/placeholder-avatar.jpg'} alt={'Nomad User'} />
                                <AvatarFallback className="text-4xl font-headline">
                                    NU
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center md:text-left pt-4">
                                <h1 className="text-3xl font-bold font-headline">Nomad User</h1>
                                <p className="text-lg text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-2">
                                    <Mail className="w-4 h-4" />
                                    {userEmail}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-primary" />
                            Mes Réservations
                        </h2>
                        <div className="space-y-4">
                            {bookingsLoading ? (
                                <>
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                </>
                            ) : bookings.length > 0 ? (
                                bookings.map(booking => {
                                    const image = booking.hotel?.imageId || booking.flight?.imageId;
                                    const placeholderImage = image ? placeholderImages.find(p => p.id === image) : null;

                                    return (
                                        <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row">
                                                    {/* Image */}
                                                    {placeholderImage && (
                                                        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                                                            <img
                                                                src={placeholderImage.imageUrl}
                                                                alt={booking.itemName}
                                                                className="absolute inset-0 w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                                <div>
                                                                    <Badge variant="secondary" className="mb-2">
                                                                        {booking.itemType === 'hotel'
                                                                            ? <><HotelIcon className="w-3 h-3 mr-1" /> Hôtel</>
                                                                            : <><Plane className="w-3 h-3 mr-1" /> Vol</>
                                                                        }
                                                                    </Badge>
                                                                    <h3 className="font-bold text-lg">{booking.itemName}</h3>
                                                                </div>
                                                            </div>

                                                            {/* Details */}
                                                            <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                                                {booking.hotel && (
                                                                    <>
                                                                        <p className="flex items-center gap-1">
                                                                            <MapPin className="w-3 h-3" />
                                                                            {booking.hotel.ville} - {booking.hotel.adresse}
                                                                        </p>
                                                                        <p>Prix à partir de: <span className="font-semibold text-primary">${booking.hotel.pricePerNight}/nuit</span></p>
                                                                    </>
                                                                )}
                                                                {booking.flight && (
                                                                    <>
                                                                        <p className="flex items-center gap-1">
                                                                            <Plane className="w-3 h-3" />
                                                                            {booking.flight.airline} - {booking.flight.numeroVol}
                                                                        </p>
                                                                        <p className="flex items-center gap-1">
                                                                            <Calendar className="w-3 h-3" />
                                                                            {format(new Date(booking.flight.dateHeureDepart), 'PPP à HH:mm', { locale: fr })}
                                                                        </p>
                                                                        <p>Prix: <span className="font-semibold text-primary">${booking.flight.prix}</span></p>
                                                                    </>
                                                                )}
                                                                <p className="text-xs pt-1">
                                                                    Réservé le: {format(new Date(booking.bookingDate), 'PPP', { locale: fr })}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Action Button */}
                                                        <div className="flex justify-end">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link to={`/reservations/${booking.id}`}>
                                                                    Voir Détails
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Ticket className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg">Vous n'avez pas encore de réservations.</p>
                                    <p className="mt-2">Commencez à explorer pour planifier votre prochain voyage !</p>
                                    <div className="flex gap-4 justify-center mt-6">
                                        <Button asChild>
                                            <Link to="/hotels">
                                                <HotelIcon className="w-4 h-4 mr-2" />
                                                Explorer les Hôtels
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link to="/flights">
                                                <Plane className="w-4 h-4 mr-2" />
                                                Trouver des Vols
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
