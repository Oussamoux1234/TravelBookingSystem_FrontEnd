# Nomad Navigator

Nomad Navigator is a minimal, modern, and responsive frontend for a travel booking platform. Built with Next.js, Tailwind CSS, and Firebase, it provides a seamless user experience for browsing flights and hotels, planning trips with an AI assistant, and managing bookings.

## Features

- **Hotel & Flight Listings**: Browse available hotels and flights with a clean, grid-based layout.
- **AI Route Planner**: Generate detailed travel routes using a generative AI assistant that considers your preferences.
- **User Authentication**: Secure sign-up, sign-in, and Google authentication powered by Firebase.
- **User Profiles**: View your profile and manage your bookings in one place.
- **Modern UI/UX**: A beautiful, responsive design with a minimal aesthetic, subtle animations, and a dark mode.
- **Ready for Microservices**: Designed to integrate with a backend microservices architecture.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animation**: Framer Motion
- **Authentication**: Firebase Authentication
- **AI**: Genkit for connecting to Google Gemini
- **Deployment**: Firebase App Hosting

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Firebase project
- A running instance of the backend microservices gateway.

### 1. Clone the repository

```bash
git clone <repository-url>
cd nomad-navigator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  In your project, go to **Project settings** > **General**.
3.  Under "Your apps", click the **Web** icon (`</>`) to add a new web app.
4.  Give it a name (e.g., "Nomad Navigator Web") and register the app.
5.  You will be given a `firebaseConfig` object. You need these values for your environment variables.
6.  In the Firebase Console, go to **Authentication** > **Sign-in method** and enable the **Email/Password** and **Google** providers.

### 4. Set up Environment Variables

Create a `.env.local` file in the root of your project. Copy the contents of `.env.local.example` and fill in the values from your Firebase project settings.

You also need to configure credentials for the Genkit AI backend and the API gateway.

1.  Go to the [Google AI Studio](https://aistudio.google.com/app/apikey) to generate an API key.
2.  Add this key to your `.env.local` file as `GOOGLE_GENAI_API_KEY`.
3.  Set `NEXT_PUBLIC_API_BASE_URL` to the URL of your running backend gateway (e.g., `http://localhost:8080`).

Your `.env.local` file should look like this:
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# Genkit/Google AI
GOOGLE_GENAI_API_KEY=your-google-genai-api-key

# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 5. Run the development server

The app uses Genkit for the AI features, which runs as a separate process.

- **Terminal 1 (AI Backend):**
  ```bash
  npm run genkit:watch
  ```
- **Terminal 2 (Next.js Frontend):**
  ```bash
  npm run dev
  ```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## How to use

1.  **Create an account**: Go to the "Sign In" page and either create an account with your email and password or use the "Sign in with Google" option.
2.  **Explore**: Navigate to the "Hotels" or "Flights" pages to see listings. The data is fetched from your backend API.
3.  **Plan a Trip**: Use the "AI Route Planner" to generate a custom travel itinerary.
4.  **Book an Item**: View a hotel or flight detail page and click "Book Now". Complete the form to create a reservation.
5.  **View Profile**: Once signed in, click on your user icon in the header to navigate to your profile page and see your bookings.

## Backend Integration & CORS

This frontend is designed to work with a separate microservices backend, expecting a specific API structure.

- **API Base URL**: The frontend directs all API calls to the `NEXT_PUBLIC_API_BASE_URL` defined in your environment variables.
- **Endpoints**: The application expects the following endpoints to be available on your gateway:
  - `GET /hotels`
  - `GET /hotels/{id}`
  - `GET /flights`
  - `GET /flights/{id}`
  - `POST /reservations`
  - `GET /reservations?clientEmail={email}`

- **Authentication**: The app uses Firebase Authentication. For authenticated API requests, the user's `idToken` is automatically fetched and sent in the `Authorization` header: `Authorization: Bearer <idToken>`. Your backend gateway must validate this JWT.

- **CORS**: For local development, your backend gateway must be configured to allow requests from the frontend's origin (`http://localhost:9002`). The `Authorization` and `Content-Type` headers must be allowed in your CORS policy.

Example CORS configuration for an Express.js backend server:
```javascript
// Allow requests from the frontend development server
const allowedOrigins = ['http://localhost:9002'];

// ... middleware setup ...
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
```

## Deployment

This project is set up for deployment on **Firebase App Hosting**.

1.  **Initialize Firebase:** If you haven't already, install the Firebase CLI and initialize it in your project directory.
    ```bash
    npm install -g firebase-tools
    firebase login
    firebase init hosting
    ```
    Select your Firebase project and choose your App Hosting backend.

2.  **Deploy:**
    ```bash
    firebase deploy --only hosting
    ```
This command will build the Next.js application and deploy it to Firebase App Hosting.
