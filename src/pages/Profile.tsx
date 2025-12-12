// Converted from Next.js to React
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Ticket } from 'lucide-react';
import type { Reservation } from '@/lib/types';
import { getReservationsByEmail } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Profile() {
    const [bookings, setBookings] = useState<Reservation[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const userEmail = 'user@example.com'; // Mock user

    useEffect(() => {
        const fetchBookings = async () => {
            setBookingsLoading(true);
            const userBookings = await getReservationsByEmail(userEmail);
            setBookings(userBookings);
            setBookingsLoading(false);
        };
        fetchBookings();
    }, [userEmail]);

    return (
        <>
            <Helmet>
                <title>My Profile - Nomad Navigator</title>
                <meta name="description" content="View your travel bookings and profile information" />
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
                            My Bookings
                        </h2>
                        <div className="space-y-4">
                            {bookingsLoading ? (
                                <>
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                </>
                            ) : bookings.length > 0 ? (
                                bookings.map(booking => (
                                    <Card key={booking.id}>
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-bold">{booking.itemName}</p>
                                                <p className="text-sm text-muted-foreground">Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/${booking.itemType}s/${booking.itemType === 'hotel' ? booking.hotelId : booking.volId}`}>View Details</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-muted-foreground">You have no bookings yet. Start exploring to plan your next trip!</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
