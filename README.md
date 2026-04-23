# Trustlytics

## Features

- Responsive landing page with company intro, about section, and database-backed contact form
- User registration and login with hashed passwords using `bcryptjs`
- JWT-based authentication and protected dashboard
- Admin-only view to review all contact form submissions
- MongoDB data persistence for users and contacts

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Project Structure

```text
trustlytics/
|-- client/
|-- server/
|-- .env
|-- package.json
|-- server.js
```

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   npm --prefix client install
   ```

2. Create a local environment file named .env in the base directory.

## Environment Variables

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/trustlytics
JWT_SECRET=replace-with-a-strong-secret
ADMIN_EMAIL=admin@example.com
```

3. Update `.env` with your MongoDB connection string and JWT secret.

## Create JWT secret with the following code

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. Admin setup:
   Set `ADMIN_EMAIL` to the email address that should receive admin access after registration.

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open the frontend at `http://localhost:5173`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/contacts`
- `GET /api/contacts` (admin only)
