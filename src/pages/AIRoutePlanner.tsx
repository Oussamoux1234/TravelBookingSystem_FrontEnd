// Converted from Next.js to React - NOTE: AI features disabled (server actions removed)
// To enable AI features, create a separate Express server with Genkit
import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Route, Zap, Loader2, AlertCircle } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AIRoutePlanner() {
    const [loading, setLoading] = useState(false);
    const [route, setRoute] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const heroImage = placeholderImages.find(p => p.id === "ai-route-planner-hero");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRoute(null);

        // Placeholder - requires Express server setup with Genkit
        setTimeout(() => {
            setError('AI Route Planner requires a separate server setup. See setup guide for instructions.');
            setLoading(false);
        }, 1000);
    };

    return (
        <>
            <Helmet>
                <title>AI Route Planner - Nomad Navigator</title>
                <meta name="description" content="Let our intelligent AI assistant craft the perfect journey for you" />
            </Helmet>

            <div>
                <section className="relative w-full py-20 md:py-28 text-center bg-secondary/50 overflow-hidden">
                    {heroImage && (
                        <img
                            src={heroImage.imageUrl}
                            alt={heroImage.description}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30"></div>
                    <div className="container relative z-10">
                        <Route className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-bold font-headline">AI Route Planner</h1>
                        <p className="text-lg md:text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Let our intelligent assistant craft the perfect journey for you.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <Alert className="mb-8">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>AI Features Disabled</AlertTitle>
                        <AlertDescription>
                            The AI route planner requires a separate Express server with Genkit. See the setup guide for instructions on enabling this feature.
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline">Plan Your Trip</CardTitle>
                                    <CardDescription>
                                        Provide your travel details and let our AI create a custom itinerary.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="origin">Origin</Label>
                                            <Input id="origin" name="origin" placeholder="e.g., New York, NY" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="destination">Destination</Label>
                                            <Input id="destination" name="destination" placeholder="e.g., Los Angeles, CA" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="preferences">Preferences</Label>
                                            <Textarea
                                                id="preferences"
                                                name="preferences"
                                                placeholder="e.g., scenic routes, vegetarian restaurants, museums..."
                                            />
                                        </div>
                                        <Button type="submit" disabled={loading} size="lg" className="w-full">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating Route...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="mr-2 h-4 w-4" />
                                                    Generate Route
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold font-headline">Your Generated Route</h2>
                            <Card className="min-h-[300px]">
                                <CardContent className="p-6">
                                    {error && (
                                        <div className="text-destructive">
                                            <h3 className="font-bold">Error</h3>
                                            <p>{error}</p>
                                        </div>
                                    )}
                                    {route ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <pre className="whitespace-pre-wrap font-body text-sm bg-secondary/50 p-4 rounded-md">{route}</pre>
                                        </div>
                                    ) : (
                                        <div className="text-muted-foreground h-full flex items-center justify-center text-center">
                                            <p>Your generated travel route will appear here.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
