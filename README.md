# ShopVerse

Full-stack e-commerce app built with Next.js, TypeScript, Redux Toolkit and Prisma.

**Live demo:** https://YOUR-APP.vercel.app
**Demo admin:** admin@shopverse.com / (password in your seed)

![ShopVerse screenshot](./docs/home.png)

## Features
- Product listing with search, category filter, sorting and pagination
- Product detail pages, cart (persisted in localStorage)
- Authentication (Auth.js, JWT) with USER and ADMIN roles
- Checkout with server-side price calculation and stock validation inside a DB transaction
- Order history and order confirmation
- Admin dashboard: product CRUD, order status management, stats
- Unit and component tests, CI on every push

## Tech stack
Next.js (App Router), TypeScript, Redux Toolkit + RTK Query, Tailwind CSS, Prisma, PostgreSQL (Neon), Auth.js, Zod, React Hook Form, Jest + React Testing Library, GitHub Actions, Vercel

## Key engineering decisions
- Prices are stored as integers (paise) to avoid floating point errors
- Order totals are recalculated on the server from DB prices, never trusted from the client
- Stock is decremented with a conditional `updateMany` in a transaction, so overselling is not possible
- Admin API routes verify the role on the server, not just in the UI
- Zod schemas are shared between client forms and API validation

## Run locally
1. `git clone` the repo and `npm install`
2. Copy `.env.example` to `.env` and fill in values
3. `npx prisma migrate dev`
4. `npx prisma db seed`
5. `npm run dev`

## Scripts
`npm run dev` · `npm test` · `npm run lint` · `npm run typecheck` · `npm run build`