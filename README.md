# Lost @ Yale

A platform for Yale students to report and find lost items on campus.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create `.env.local` File

Create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Run the Application

```bash
npm run dev
```

The app will run on `http://localhost:3000`

**IMPORTANT:** Due to current Google OAuth security policies, authentication requests can **only** be made from `http://localhost:3000`. You **must** use port 3000 - the app will not work on any other port (on supabase, we had to list the url origins that were allowed to make requests to Google's auth services; since we do not currently have a domain, we added http://localhost:3000 to the list). If port 3000 is already in use, stop the other process first. This restriction will change to the actual domain name once the site is deployed.

---

## Features

- **Google Sign-In** - Authenticate with your Google account
- **Post Lost/Found Items** - Create posts with title, description, location, date, and images
- **Browse Board** - View all active posts (lost items in red, found items in green)
- **Real-Time Updates** - See posts update live as their status changes
- **Contact Posters** - Email users directly about their posts
