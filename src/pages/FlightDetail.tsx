// Converted from Next.js to React
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getFlightById } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Plane, Users } from 'lucide-react';
import { format } from 'date-fns';
import type { FlightDisplay } from '@/lib/types';

export default function FlightDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [flight, setFlight] = useState<FlightDisplay | null | undefined>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlight = async () => {
            if (!slug) return;
            setLoading(true);
            const data = await getFlightById(slug);
            setFlight(data);
            setLoading(false);
        };
        fetchFlight();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!flight) {
        return <Navigate to="/flights" replace />;
    }

    const image = placeholderImages.find((img) => img.id === flight.imageId);
    const departure = new Date(flight.dateHeureDepart);

    return (
        <>
            <Helmet>
                <title>{flight.aeroportDepart} to {flight.aeroportArrivee} - Nomad Navigator</title>
                <meta name="description" content={`Vol ${flight.numeroVol} de ${flight.aeroportDepart} à ${flight.aeroportArrivee} avec ${flight.airline}`} />
            </Helmet>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        {image && (
                            <Card className="overflow-hidden">
                                <div className="relative aspect-video">
                                    <img
                                        src={image.imageUrl}
                                        alt={flight.aeroportArrivee}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            </Card>
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <Badge variant="secondary" className="w-fit mb-2 flex items-center gap-1">
                            <Plane className="w-3 h-3" />
                            {flight.airline}
                        </Badge>
                        <h1 className="text-4xl font-bold font-headline mb-4 flex items-center gap-4">
                            <span>{flight.aeroportDepart}</span>
                            <ArrowRight className="w-8 h-8 text-primary shrink-0" />
                            <span>{flight.aeroportArrivee}</span>
                        </h1>

                        <Card className="bg-secondary/50 mb-6">
                            <CardContent className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-bold text-sm text-muted-foreground mb-1">Numéro de Vol</h3>
                                        <p className="text-lg font-bold">{flight.numeroVol}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            Places Disponibles
                                        </h3>
                                        <p className="text-lg font-bold">{flight.placesDisponibles} sièges</p>
                                    </div>
                                </div>
                                <div className="pt-2 border-t">
                                    <h3 className="font-bold text-sm text-muted-foreground mb-1">Départ</h3>
                                    <p className="font-semibold">{format(departure, 'EEEE, d MMMM yyyy')}</p>
                                    <p className="text-2xl font-bold text-primary">{format(departure, 'HH:mm')}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-primary/5 p-4 rounded-lg">
                            <div>
                                <span className="text-muted-foreground">Prix par personne</span>
                                <p className="text-3xl font-bold text-primary">${flight.prix}</p>
                            </div>
                            <Button asChild size="lg">
                                <Link to={`/booking?type=flight&id=${flight.id}`}>
                                    Réserver
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
