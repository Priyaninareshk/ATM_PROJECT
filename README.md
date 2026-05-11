# ATM SPA (Full-Stack)

Secure and interactive single-page ATM simulator built with:
- Frontend: React (Hooks, React Router, Bootstrap)
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: 4-digit PIN + JWT in HttpOnly cookie

## Features
- Signup (`name`, `pin`, `confirmPin`)
- PIN login
- Dashboard with account name and live balance
- Deposit and withdraw with server-side validation
- Insufficient funds protection
- Transaction history (date, type, amount, balance after)
- Auto logout after 2 minutes of inactivity
- Manual logout

## Folder Structure
```text
client/   # React SPA
server/   # Express API + MongoDB models
```

## Local Setup
1. Clone the repository.
2. Install dependencies:
```bash
cd server && npm install
cd ../client && npm install
```
3. Configure environment files:
- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`
4. Start MongoDB locally (or use MongoDB Atlas URI in `server/.env`).
5. Seed demo user:
```bash
cd server
npm run seed
```
6. Run backend and frontend:
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```
7. Open `http://localhost:5173`.

## Demo Account (Seeded)
- Name: from `SEED_DEMO_NAME` (default `Demo User`)
- PIN: from `SEED_DEMO_PIN` (default `1234`)

## API Endpoints
- `POST /api/signup`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `GET /api/account/:id`
- `POST /api/transaction/withdraw`
- `POST /api/transaction/deposit`
- `GET /api/transactions/:id`

## Security Notes
- PIN stored as bcrypt hash only
- JWT stored in HttpOnly cookie
- Helmet enabled
- CORS locked to frontend URL
- Rate limiting on login/signup routes
- Input validation with `express-validator`
- Authorization checks enforce account ownership

## Render Deployment (Client + Server)
- Deployed Backend and Frontend in Rendor
- Frontend: https://atm-project-ui.onrender.com/
- Backend: https://atm-project-077f.onrender.com/

