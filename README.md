# EstateIQ – AI Powered Real Estate Intelligence Platform

EstateIQ is a modern, AI-driven real estate platform designed for buyers, sellers, and agents.

## Features

- **AI Recommendations**: Personalized property suggestions based on user behavior and preferences.
- **Price Predictions**: Intelligent market price estimation using advanced AI models.
- **Neighborhood Analysis**: Safety, commute, and local amenity insights powered by AI.
- **Smart Chatbot**: Direct property-specific inquiries with instant AI-powered responses.
- **Secure Authentication**: Integration with NextAuth (Credentials & Google).
- **Production Ready**: Optimized for Cloud PostgreSQL (Supabase) and production deployments.

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: Custom Genkit Flows

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   - `DATABASE_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
4. Generate Prisma client:
   ```bash
   npm run build
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
