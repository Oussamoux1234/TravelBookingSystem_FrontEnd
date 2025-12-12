// Converted from Next.js to React
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin } from 'lucide-react';
import type { HotelDisplay, FlightDisplay } from '@/lib/types';
import { placeholderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ListingCardProps = {
    item: HotelDisplay | FlightDisplay;
    type: 'hotel' | 'flight';
    className?: string;
};

export default function ListingCard({ item, type, className }: ListingCardProps) {
    const isHotel = (_item: HotelDisplay | FlightDisplay): _item is HotelDisplay => type === 'hotel';
    const isFlight = (_item: HotelDisplay | FlightDisplay): _item is FlightDisplay => type === 'flight';

    const image = placeholderImages.find((img) => img.id === item.imageId);
    const href = `/${type}s/${item.id}`;

    // Get display name based on type
    const displayName = isHotel(item) ? item.nom : `${item.aeroportDepart} → ${item.aeroportArrivee}`;

    return (
        <Link to={href} className="group block">
            <Card className={cn("overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1", className)}>
                <CardHeader className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        {image && (
                            <img
                                src={image.imageUrl}
                                alt={image.description}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        )}
                        <div className="absolute top-3 right-3">
                            {isHotel(item) && (
                                <Badge variant="default" className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    {item.rating.toFixed(1)}
                                </Badge>
                            )}
                            {isFlight(item) && (
                                <Badge variant="default" className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {item.placesDisponibles} seats
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg font-headline mb-1 leading-tight">{displayName}</CardTitle>
                    <CardDescription>
                        {isHotel(item) ? (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.ville}
                            </span>
                        ) : (
                            <span>{item.airline} - {item.numeroVol}</span>
                        )}
                    </CardDescription>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center">
                    <div>
                        <span className="text-xs text-muted-foreground">From </span>
                        <p className="text-xl font-bold text-primary">
                            ${isHotel(item) ? item.pricePerNight : item.prix}
                        </p>
                    </div>
                    <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
