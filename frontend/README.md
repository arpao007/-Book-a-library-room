# Library Room Booking — Frontend

React single-page application for students and library staff. It uses the Express API in `../api` and keeps the existing Vite and React project structure.

## Run locally

```bash
npm install
npm run dev
```

Start the API on port `3001` in a separate terminal. Vite proxies `/api` requests to `http://localhost:3001`.

## Routes

| Route | Purpose |
|---|---|
| `/` | Booking dashboard |
| `/rooms` | Room list and staff room creation |
| `/rooms/:roomId` | Room details and staff room management |
| `/bookings/new` | Create a room booking |
| `/bookings/:bookingId` | Booking details and available actions |
| `/bookings/history` | Signed-in user's booking history |
| `/staff/bookings` | Staff approval and rejection queue |
| `/login` | Login or student registration |

## Checks

```bash
npm run check
npm test
npm run build
```

The UI stores the JWT and current user in browser storage after authentication. Room and booking records remain managed by the API.
