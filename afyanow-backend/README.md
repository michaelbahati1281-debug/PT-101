# AfyaNow API

Node/Express and MySQL API for the existing AfyaNow React client. It uses Prisma, JWT access/refresh tokens, role-based middleware, validation, rate limiting, and secure response envelopes.

## Setup

1. Copy `.env.example` to `.env`, create the `afyanow` MySQL database/user, and provide its URL and JWT values.
2. Run `npm install`.
3. Run `npm run prisma:migrate -- --name init`, then `npm run prisma:seed`.
4. Run `npm run dev`.

The health check is `GET /api/v1/health`. The frontend API base is configured with `VITE_API_URL=http://localhost:5000/api/v1`.

## Important security behaviour

- Passwords are hashed with bcrypt; no frontend password is trusted.
- Appointment creation is authenticated and validates doctor, service, hospital relationship, home-visit eligibility, and the unique doctor/date/start-time slot.
- Payments are pending until a protected provider webhook confirms them. The code does not fake a successful payment.
- Set a production payment provider adapter and cryptographic webhook verification before enabling payments in production.
