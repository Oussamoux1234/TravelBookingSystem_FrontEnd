# **App Name**: Nomad Navigator

## Core Features:

- Hotel Listing: Display a list of hotels fetched from the API (/hotels endpoint) with essential details and a 'View' CTA.
- Flight Listing: Display a list of flights fetched from the API (/vols endpoint) with essential details and a 'View' CTA.
- Booking Submission: Submit reservation data to the backend API (/reservations endpoint) for processing and simulate payment.
- User Authentication: Authenticate users using Firebase Auth, with options for standard email/password login and 'Sign in with Google'.
- Profile Management: Display authenticated user data and their bookings (fetched from /reservations?clientEmail={email}).
- Route generation tool: Use generative AI to compute the fastest, most beautiful route from a origin and a destination taking real-time transport data, restaurants, and local preferences into account.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) for a sense of trust and exploration. This saturated color will draw attention and work well against a lighter background.
- Background color: Light gray (#F0F2F5) provides a clean, neutral backdrop that enhances readability and gives a modern feel. This is a very desaturated color that will pair well with a strong primary color.
- Accent color: Soft purple (#9575CD) is used for interactive elements and highlights, complementing the primary color for a cohesive feel.
- Headline font: 'Space Grotesk', a sans-serif font for a techy and modern look; body font: 'Inter', a grotesque sans-serif suitable for the app's content.
- Simple, modern icons from a set like Font Awesome or Feather, consistently styled and used sparingly to guide users.
- Grid layout for hotel/flight listings, transitioning from single-column on mobile to a 3-column grid on desktop for optimal viewing.
- Subtle fade and slide animations for page transitions using Framer Motion, enhancing the sense of fluidity.