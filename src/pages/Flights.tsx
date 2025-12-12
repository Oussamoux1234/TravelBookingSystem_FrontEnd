// Converted from Next.js to React
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plane } from 'lucide-react';
import type { Flight as FlightType } from '@/lib/types';
import { getFlights } from '@/lib/data';
import ListingCard from '@/components/listing-card';
import { ListingGridSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 6;

export default function Flights() {
    const [loading, setLoading] = useState(true);
    const [flights, setFlights] = useState<FlightType[]>([]);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            const flightsData = await getFlights();
            setFlights(flightsData);
            setLoading(false);
        };

        fetchFlights();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
    };

    const visibleFlights = flights.slice(0, visibleCount);

    return (
        <>
            <Helmet>
                <title>Find Flights - Nomad Navigator</title>
                <meta name="description" content="Find the best deals on flights to destinations worldwide." />
            </Helmet>

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Plane className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold font-headline">Find Flights</h1>
                </div>

                {loading ? (
                    <ListingGridSkeleton count={ITEMS_PER_PAGE} />
                ) : flights.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Could not load flights.</p>
                        <p>Is the backend server running and configured correctly in your .env file?</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {visibleFlights.map((flight) => (
                                <ListingCard key={flight.id} item={flight} type="flight" />
                            ))}
                        </div>
                        {visibleCount < flights.length && (
                            <div className="text-center mt-12">
                                <Button size="lg" onClick={handleLoadMore}>
                                    Load More
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
