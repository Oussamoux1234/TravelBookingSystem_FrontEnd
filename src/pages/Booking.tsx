// Converted from Next.js to React
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getHotelById, getFlightById, createReservation } from '@/lib/data';
import type { FlightDisplay, HotelDisplay } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images';

const bookingSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2, 'Name is required'),
    cardNumber: z.string().length(16, 'Card number must be 16 digits'),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format'),
    cvc: z.string().length(3, 'CVC must be 3 digits'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

// Room types matching backend enum
const ROOM_TYPES = [
    { value: 'SIMPLE', label: 'Chambre Simple', priceMultiplier: 1 },
    { value: 'DOUBLE', label: 'Chambre Double', priceMultiplier: 1.5 },
    { value: 'SUITE', label: 'Suite', priceMultiplier: 2.5 },
];

// Flight classes
const FLIGHT_CLASSES = [
    { value: 'ECONOMY', label: 'Économique', priceMultiplier: 1 },
    { value: 'BUSINESS', label: 'Business', priceMultiplier: 2 },
    { value: 'FIRST', label: 'Première Classe', priceMultiplier: 3 },
];

export default function Booking() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();

    const type = searchParams.get('type') as 'hotel' | 'flight' | null;
    const id = searchParams.get('id');

    const [item, setItem] = useState<HotelDisplay | FlightDisplay | null | undefined>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isItemLoading, setIsItemLoading] = useState(true);

    // Booking options state
    const [roomType, setRoomType] = useState('SIMPLE');
    const [flightClass, setFlightClass] = useState('ECONOMY');
    const [seatNumber, setSeatNumber] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');

    useEffect(() => {
        async function fetchItem() {
            if (id && type) {
                setIsItemLoading(true);
                const data = type === 'hotel' ? await getHotelById(id) : await getFlightById(id);
                setItem(data);
                setIsItemLoading(false);
            }
        }
        fetchItem();
    }, [id, type]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: { email: 'user@example.com' }
    });

    const calculatePrice = () => {
        if (!item) return 0;
        const isHotel = type === 'hotel';
        const basePrice = isHotel ? (item as HotelDisplay).pricePerNight : (item as FlightDisplay).prix;

        if (isHotel) {
            const roomMultiplier = ROOM_TYPES.find(r => r.value === roomType)?.priceMultiplier || 1;
            return basePrice * roomMultiplier;
        } else {
            const classMultiplier = FLIGHT_CLASSES.find(c => c.value === flightClass)?.priceMultiplier || 1;
            return basePrice * classMultiplier;
        }
    };

    const onSubmit = async (data: BookingFormValues) => {
        setIsLoading(true);
        if (!type || !id || !item) {
            toast({ variant: 'destructive', title: 'Booking Error', description: 'Invalid booking item.' });
            setIsLoading(false);
            return;
        }

        try {
            await createReservation({
                clientEmail: data.email,
                type: type,
                itemId: item.id,
                passengerName: data.name,
                typeChambre: type === 'hotel' ? roomType : undefined,
                seatNumber: type === 'flight' ? seatNumber : undefined,
                flightClass: type === 'flight' ? flightClass : undefined,
                checkInDate: type === 'hotel' ? checkInDate : undefined,
                checkOutDate: type === 'hotel' ? checkOutDate : undefined,
            });

            toast({
                title: 'Réservation Confirmée!',
                description: `Votre ${type === 'hotel' ? 'hôtel' : 'vol'} a été réservé. Une confirmation a été envoyée à ${data.email}.`,
            });
            navigate('/profile');

        } catch (error) {
            console.error('Booking failed:', error);
            toast({
                variant: 'destructive',
                title: 'Réservation Échouée',
                description: 'Il y a eu un problème lors du traitement de votre réservation. Veuillez réessayer.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isItemLoading) {
        return (
            <>
                <Helmet><title>Booking - Nomad Navigator</title></Helmet>
                <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>
            </>
        );
    }

    if (!item) {
        return (
            <>
                <Helmet><title>Booking - Nomad Navigator</title></Helmet>
                <div className="text-center py-12">Item not found or invalid booking link.</div>
            </>
        );
    }

    const image = placeholderImages.find(p => p.id === item.imageId);
    const isHotel = type === 'hotel';
    const totalPrice = calculatePrice();

    return (
        <>
            <Helmet>
                <title>Confirm Booking - Nomad Navigator</title>
                <meta name="description" content="Complete your booking reservation" />
            </Helmet>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <div className="order-2 md:order-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Confirmer Votre Réservation</CardTitle>
                                <CardDescription>Veuillez remplir vos informations pour compléter la réservation.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom Complet</Label>
                                        <Input id="name" {...register('name')} placeholder="Tel qu'il apparaît sur votre carte" />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" {...register('email')} />
                                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                                    </div>

                                    {/* Booking Options */}
                                    <h3 className="text-lg font-semibold pt-4 font-headline">Options de Réservation</h3>

                                    {isHotel ? (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="roomType">Type de Chambre</Label>
                                                <Select value={roomType} onValueChange={setRoomType}>
                                                    <SelectTrigger id="roomType">
                                                        <SelectValue placeholder="Sélectionner le type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ROOM_TYPES.map(room => (
                                                            <SelectItem key={room.value} value={room.value}>
                                                                {room.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="checkIn">Date d'arrivée</Label>
                                                    <Input
                                                        id="checkIn"
                                                        type="date"
                                                        value={checkInDate}
                                                        onChange={(e) => setCheckInDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="checkOut">Date de départ</Label>
                                                    <Input
                                                        id="checkOut"
                                                        type="date"
                                                        value={checkOutDate}
                                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="flightClass">Classe de Vol</Label>
                                                <Select value={flightClass} onValueChange={setFlightClass}>
                                                    <SelectTrigger id="flightClass">
                                                        <SelectValue placeholder="Sélectionner la classe" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {FLIGHT_CLASSES.map(fc => (
                                                            <SelectItem key={fc.value} value={fc.value}>
                                                                {fc.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="seatNumber">Numéro de Siège (optionnel)</Label>
                                                <Input
                                                    id="seatNumber"
                                                    placeholder="Ex: 12A"
                                                    value={seatNumber}
                                                    onChange={(e) => setSeatNumber(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <h3 className="text-lg font-semibold pt-4 font-headline">Détails de Paiement</h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="cardNumber">Numéro de Carte</Label>
                                        <Input id="cardNumber" {...register('cardNumber')} placeholder="•••• •••• •••• ••••" />
                                        {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiryDate">Expiration</Label>
                                            <Input id="expiryDate" {...register('expiryDate')} placeholder="MM/YY" />
                                            {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" {...register('cvc')} placeholder="123" />
                                            {errors.cvc && <p className="text-sm text-destructive">{errors.cvc.message}</p>}
                                        </div>
                                    </div>

                                    <Button disabled={isLoading} className="w-full" size="lg">
                                        {isLoading ? <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />En cours...
                                        </> : `Confirmer & Payer $${totalPrice.toFixed(2)}`}
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                                        <Lock className="w-3 h-3" /> Simulation de paiement sécurisé
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="order-1 md:order-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Résumé de la Commande</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {image && (
                                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                                        <img
                                            src={image.imageUrl}
                                            alt={isHotel ? (item as HotelDisplay).nom : (item as FlightDisplay).aeroportArrivee}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <h3 className="font-semibold text-lg">
                                    {isHotel ? (item as HotelDisplay).nom : `${(item as FlightDisplay).aeroportDepart} → ${(item as FlightDisplay).aeroportArrivee}`}
                                </h3>
                                <p className="text-muted-foreground">
                                    {isHotel ? (item as HotelDisplay).ville : `${(item as FlightDisplay).airline} - ${(item as FlightDisplay).numeroVol}`}
                                </p>

                                {/* Selected options summary */}
                                <div className="mt-4 space-y-1 text-sm">
                                    {isHotel ? (
                                        <>
                                            <p><span className="text-muted-foreground">Type:</span> {ROOM_TYPES.find(r => r.value === roomType)?.label}</p>
                                            {checkInDate && <p><span className="text-muted-foreground">Arrivée:</span> {checkInDate}</p>}
                                            {checkOutDate && <p><span className="text-muted-foreground">Départ:</span> {checkOutDate}</p>}
                                        </>
                                    ) : (
                                        <>
                                            <p><span className="text-muted-foreground">Classe:</span> {FLIGHT_CLASSES.find(c => c.value === flightClass)?.label}</p>
                                            {seatNumber && <p><span className="text-muted-foreground">Siège:</span> {seatNumber}</p>}
                                        </>
                                    )}
                                </div>

                                <div className="border-t my-4"></div>
                                <div className="flex justify-between items-center text-lg">
                                    <p>Total</p>
                                    <p className="font-bold text-xl">${totalPrice.toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
