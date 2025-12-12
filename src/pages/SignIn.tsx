// Simple SignIn page - authentication disabled for this demo
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

export default function SignIn() {
    return (
        <>
            <Helmet>
                <title>Sign In - Nomad Navigator</title>
                <meta name="description" content="Sign in to your Nomad Navigator account" />
            </Helmet>

            <div className="container flex items-center justify-center py-12">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="font-headline">Sign In</CardTitle>
                        <CardDescription>Authentication is disabled for this demo.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                            <Info className="h-5 w-5 text-primary mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                You can browse all features without signing in.
                                Explore hotels, flights, and plan your trips!
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button asChild className="w-full">
                                <Link to="/">Go to Homepage</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link to="/hotels">Browse Hotels</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link to="/flights">Browse Flights</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
