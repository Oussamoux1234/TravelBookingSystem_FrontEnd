// Converted from Next.js app/layout.tsx to React Router layout component
// Uses Outlet instead of children prop for nested routing
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function Layout() {
    return (
        <div className="font-body antialiased flex flex-col min-h-screen">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
