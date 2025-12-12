// Converted from Next.js to React
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getHotelById } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Check, Loader2, Bed } from 'lucide-react';
import type { HotelDisplay } from '@/lib/types';

export default function HotelDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [hotel, setHotel] = useState<HotelDisplay | null | undefined>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotel = async () => {
            if (!slug) return;
            setLoading(true);
            const data = await getHotelById(slug);
            setHotel(data);
            setLoading(false);
        };
        fetchHotel();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!hotel) {
        return <Navigate to="/hotels" replace />;
    }

    const image = placeholderImages.find((img) => img.id === hotel.imageId);

    return (
        <>
            <Helmet>
                <title>{hotel.nom} - Nomad Navigator</title>
                <meta name="description" content={hotel.description} />
            </Helmet>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                        {image && (
                            <Card className="overflow-hidden">
                                <div className="relative aspect-video">
                                    <img
                                        src={image.imageUrl}
                                        alt={hotel.nom}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            </Card>
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <Badge variant="secondary" className="w-fit mb-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {hotel.ville}
                        </Badge>
                        <h1 className="text-4xl font-bold font-headline mb-2">{hotel.nom}</h1>
                        <div className="flex items-center gap-2 text-lg mb-4">
                            <Star className="w-5 h-5 text-primary fill-primary" />
                            <span className="font-bold">{hotel.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">/ 5.0</span>
                        </div>
                        <p className="text-muted-foreground mb-2">
                            <strong>Adresse:</strong> {hotel.adresse}
                        </p>
                        <p className="text-muted-foreground text-lg mb-6">{hotel.description}</p>

                        {hotel.chambres && hotel.chambres.length > 0 && (
                            <Card className="bg-secondary/50 mb-6">
                                <CardContent className="p-4">
                                    <h3 className="font-bold mb-3 text-lg font-headline flex items-center gap-2">
                                        <Bed className="w-5 h-5" />
                                        Chambres Disponibles
                                    </h3>
                                    <div className="space-y-3">
                                        {hotel.chambres.map((chambre) => (
                                            <div
                                                key={chambre.id}
                                                className="flex items-center justify-between p-3 bg-background rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-semibold">Chambre {chambre.numero}</p>
                                                    <p className="text-sm text-muted-foreground">{chambre.type}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary">${chambre.prix}/nuit</p>
                                                    <Badge variant={chambre.disponible ? "default" : "secondary"} className="text-xs">
                                                        {chambre.disponible ? <Check className="w-3 h-3 mr-1" /> : null}
                                                        {chambre.disponible ? 'Disponible' : 'Occupée'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-primary/5 p-4 rounded-lg">
                            <div>
                                <span className="text-muted-foreground">À partir de</span>
                                <p className="text-3xl font-bold text-primary">${hotel.pricePerNight}/nuit</p>
                            </div>
                            <Button asChild size="lg">
                                <Link to={`/booking?type=hotel&id=${hotel.id}`}>
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
