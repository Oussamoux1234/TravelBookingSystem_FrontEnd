// Converted from Next.js to React
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hotel } from 'lucide-react';
import type { Hotel as HotelType } from '@/lib/types';
import { getHotels } from '@/lib/data';
import ListingCard from '@/components/listing-card';
import { ListingGridSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 6;

export default function Hotels() {
    const [loading, setLoading] = useState(true);
    const [hotels, setHotels] = useState<HotelType[]>([]);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            const hotelsData = await getHotels();
            setHotels(hotelsData);
            setLoading(false);
        };

        fetchHotels();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
    };

    const visibleHotels = hotels.slice(0, visibleCount);

    return (
        <>
            <Helmet>
                <title>Explore Hotels - Nomad Navigator</title>
                <meta name="description" content="Discover and book from our curated list of top-rated hotels worldwide." />
            </Helmet>

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Hotel className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold font-headline">Explore Hotels</h1>
                </div>

                {loading ? (
                    <ListingGridSkeleton count={ITEMS_PER_PAGE} />
                ) : hotels.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Could not load hotels.</p>
                        <p>Is the backend server running and configured correctly in your .env file?</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {visibleHotels.map((hotel) => (
                                <ListingCard key={hotel.id} item={hotel} type="hotel" />
                            ))}
                        </div>
                        {visibleCount < hotels.length && (
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
