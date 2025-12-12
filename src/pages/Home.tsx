// Converted from Next.js to React
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Plane, Hotel, Route } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import ListingCard from "@/components/listing-card";
import { getHotels, getFlights } from "@/lib/data";
import type { Hotel as HotelType, Flight as FlightType } from "@/lib/types";

export default function Home() {
    const [hotels, setHotels] = useState<HotelType[]>([]);
    const [flights, setFlights] = useState<FlightType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allHotels, allFlights] = await Promise.all([getHotels(), getFlights()]);
                setHotels(allHotels.slice(0, 3));
                setFlights(allFlights.slice(0, 3));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const heroImage = placeholderImages.find(p => p.id === "hero-home");

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Nomad Navigator - Your Modern Travel Assistant</title>
                <meta name="description" content="Your modern compass for seamless travel planning. Discover hotels, flights, and plan your next adventure." />
            </Helmet>

            <section className="relative w-full h-[60vh] md:h-[70vh] text-white">
                {heroImage && (
                    <img
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter mb-4 animate-fade-in-down">
                        Nomad Navigator
                    </h1>
                    <p className="text-lg md:text-2xl max-w-2xl mb-8 animate-fade-in-up">
                        Your modern compass for seamless travel planning.
                    </p>
                    <Button asChild size="lg" className="animate-fade-in-up delay-200">
                        <Link to="/ai-route-planner">
                            Plan Your Next Adventure <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="py-12 md:py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <Card className="hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
                                    <Hotel className="w-8 h-8" />
                                </div>
                                <CardTitle className="font-headline">Hotels</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    Discover and book from our curated list of top-rated hotels.
                                </p>
                                <Button asChild variant="outline">
                                    <Link to="/hotels">Browse Hotels</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
                                    <Plane className="w-8 h-8" />
                                </div>
                                <CardTitle className="font-headline">Flights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    Find the best deals on flights to destinations worldwide.
                                </p>
                                <Button asChild variant="outline">
                                    <Link to="/flights">Browse Flights</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-xl transition-shadow duration-300 bg-primary/5">
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
                                    <Route className="w-8 h-8" />
                                </div>
                                <CardTitle className="font-headline">AI Route Planner</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    Let our AI assistant craft the perfect itinerary for your trip.
                                </p>
                                <Button asChild>
                                    <Link to="/ai-route-planner">Start Planning</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20 bg-secondary/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center font-headline mb-8">
                        Featured Stays
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hotels.map((hotel) => (
                            <ListingCard key={hotel.id} item={hotel} type="hotel" />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center font-headline mb-8">
                        Popular Flights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {flights.map((flight) => (
                            <ListingCard key={flight.id} item={flight} type="flight" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
