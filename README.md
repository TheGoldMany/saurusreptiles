# Saurus Reptiles 🦎

Egzotikus állatok bemutató oldala, webshop, tartási tudásbázis és SaurusCoin
gyűjtögetős rendszer — egyetlen admin felületről kezelve. Kétnyelvű (magyar /
angol).

Exotic animal showcase, web shop, husbandry knowledge base and a SaurusCoin
collectible system — all managed from one admin panel. Bilingual (HU / EN).

## Funkciók / Features

- **Webshop**: termékek, kategóriák, keresés, kosár, pénztár (átutalás /
  utánvét), rendeléskövetés.
- **Készletkezelés**: bevételezés, készletmozgás-napló, alacsony készlet
  figyelmeztetés, automatikus készletlevonás rendeléskor.
- **Állataim**: saját egzotikus állatok bemutatója egyedi oldalakkal.
- **Tartási infók**: cikkek / blogbejegyzések kategóriákkal.
- **Felhasználók**: regisztráció, bejelentkezés (JWT session cookie), `user` és
  `admin` (főadmin) szerepkör. A főadmin a szokásos bejelentkező felületről lép
  be — nincs külön admin login.
- **SaurusCoin**: minden elköltött 1 Ft után 1 SaurusCoin jóváírás (a rendelés
  „Fizetve" státuszba állításakor). A coinokat packokra lehet költeni.
- **Packok (gacha)**: 4 packtípus különböző eséllyel. A packokból `common`,
  `rare`, `epic`, `legendary` fajokat lehet nyitni, egyedi ratinggel. **543
  gyűjthető faj.**
- **Admin felület** (`/admin`): vezérlőpult, termékek, rendelések, készlet,
  állatok, cikkek, felhasználók (szerepkör-váltás).

## Tech stack

- Next.js 15 (App Router, Server Components, Server Actions)
- Tailwind CSS v4
- Drizzle ORM + Neon Postgres (`@neondatabase/serverless`)
- `jose` JWT session, `bcryptjs` jelszó-hash

## Beüzemelés / Setup

### 1. Neon adatbázis létrehozása

1. Regisztrálj a [neon.tech](https://neon.tech) oldalon és hozz létre egy új
   projektet (régió: EU – pl. Frankfurt, `eu-central-1`).
2. Másold ki a **pooled** connection stringet (a `-pooler` végződésűt).

### 2. Környezeti változók

Másold a `.env.example` fájlt `.env.local` néven és töltsd ki:

```bash
cp .env.example .env.local
```

- `DATABASE_URL` – a Neon pooled connection string
- `AUTH_SECRET` – hosszú véletlen string (`openssl rand -base64 32`)
- `ADMIN_EMAILS` – vesszővel elválasztott admin emailek (alap:
  `terrarisztika1@gmail.com`). Az itt szereplő email automatikusan főadmin lesz
  regisztrációkor / bejelentkezéskor.

### 3. Séma és kezdőadatok

```bash
npm install
npm run db:push     # séma feltöltése a Neon adatbázisba
npm run db:seed     # 543 faj + admin fiók + minta termékek
```

A seed létrehozza a főadmin fiókot (`terrarisztika1@gmail.com`, jelszó:
`ADMIN_PASSWORD` env vagy alapból `saurus-admin-2026`). **Első bejelentkezés
után változtasd meg a jelszót** (vagy regisztrálj ezzel az emaillel, és
automatikusan admin szerepkört kapsz).

### 4. Futtatás

```bash
npm run dev         # http://localhost:3000
```

## Deploy (Vercel + Neon)

1. Importáld a repót a Vercelre.
2. A Vercel Storage fülön csatolj egy Neon integrációt, vagy add meg kézzel a
   `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAILS` env változókat.
3. Az első deploy után futtasd egyszer a `npm run db:push` és `npm run db:seed`
   parancsokat (lokálisan a production `DATABASE_URL`-lal).

## Adatmodell / Data model

`users`, `products`, `stock_movements`, `orders`, `order_items`, `animals`,
`articles`, `species`, `user_species`, `coin_transactions`.

## Nyelvváltás / i18n

A nyelvet a `locale` cookie tárolja (`hu` / `en`), a fejlécben lévő kapcsolóval
váltható. A tartalom kétnyelvű mezőpárokban tárolódik (`*_hu` / `*_en`).
