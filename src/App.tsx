import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/auth-provider'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'

// Pages
import HomePage from '@/pages/Home'
import HotelsPage from '@/pages/Hotels'
import HotelDetailPage from '@/pages/HotelDetail'
import FlightsPage from '@/pages/Flights'
import FlightDetailPage from '@/pages/FlightDetail'
import BookingPage from '@/pages/Booking'
import ProfilePage from '@/pages/Profile'
import SignInPage from '@/pages/SignIn'
import AIRoutePlannerPage from '@/pages/AIRoutePlanner'
import ReservationDetailPage from '@/pages/ReservationDetail'

function App() {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/hotels" element={<HotelsPage />} />
                        <Route path="/hotels/:slug" element={<HotelDetailPage />} />
                        <Route path="/flights" element={<FlightsPage />} />
                        <Route path="/flights/:slug" element={<FlightDetailPage />} />
                        <Route path="/booking" element={<BookingPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/reservations/:id" element={<ReservationDetailPage />} />
                        <Route path="/auth/signin" element={<SignInPage />} />
                        <Route path="/ai-route-planner" element={<AIRoutePlannerPage />} />
                    </Route>
                </Routes>
                <Toaster />
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App

