import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pkg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

await client.connect();
console.log("✅ Connected to DB");

// ─── USERS ───────────────────────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    phone        TEXT UNIQUE,
    email        TEXT UNIQUE,
    password     TEXT,
    role         TEXT CHECK (role IN ('user','workshop','distributor','driver')),
    city         TEXT,
    avatar_url   TEXT,
    is_active    BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ users");

// ─── VEHICLES ────────────────────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    brand      TEXT,
    model      TEXT,
    year       INTEGER,
    plate      TEXT,
    color      TEXT,
    notes      TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ vehicles");

// ─── WORKSHOPS ───────────────────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS workshops (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    city        TEXT,
    location    TEXT,
    phone       TEXT,
    logo_url    TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    rating      NUMERIC DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ workshops");

// ─── PARTS ───────────────────────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS parts (
    id             SERIAL PRIMARY KEY,
    distributor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name           TEXT NOT NULL,
    description    TEXT,
    price          NUMERIC NOT NULL,
    stock          INTEGER DEFAULT 0,
    image_url      TEXT,
    category       TEXT,
    brand          TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ parts");

// ─── ORDERS (صيانة) ──────────────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id          SERIAL PRIMARY KEY,
    client_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    vehicle_id  INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    workshop_id INTEGER REFERENCES workshops(id) ON DELETE SET NULL,
    description TEXT,
    status      TEXT DEFAULT 'created'
                CHECK (status IN ('created','accepted','in_progress','done','cancelled')),
    total_price NUMERIC,
    notes       TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ orders");

// ─── PRICE QUOTES (عروض أسعار الورش) ────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS price_quotes (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    workshop_id INTEGER REFERENCES workshops(id) ON DELETE CASCADE,
    price       NUMERIC NOT NULL,
    note        TEXT,
    status      TEXT DEFAULT 'pending'
                CHECK (status IN ('pending','accepted','rejected')),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ price_quotes");

// ─── PARTS ORDERS (طلبات قطع الغيار) ────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS parts_orders (
    id             SERIAL PRIMARY KEY,
    buyer_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
    part_id        INTEGER REFERENCES parts(id) ON DELETE SET NULL,
    quantity       INTEGER DEFAULT 1,
    total_price    NUMERIC,
    status         TEXT DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','delivered','cancelled')),
    address        TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ parts_orders");

// ─── TOW REQUESTS (طلبات السطحة) ────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS tow_requests (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    driver_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
    vehicle_id     INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    from_lat       NUMERIC,
    from_lng       NUMERIC,
    from_address   TEXT,
    to_address     TEXT,
    status         TEXT DEFAULT 'searching'
                   CHECK (status IN ('searching','accepted','on_the_way','arrived','done','cancelled')),
    price          NUMERIC,
    notes          TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ tow_requests");

// ─── DELIVERIES (توصيل قطع) ──────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS deliveries (
    id           SERIAL PRIMARY KEY,
    parts_order_id INTEGER REFERENCES parts_orders(id) ON DELETE SET NULL,
    driver_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status       TEXT DEFAULT 'waiting'
                 CHECK (status IN ('waiting','picked_up','on_the_way','delivered','failed')),
    picked_at    TIMESTAMP,
    delivered_at TIMESTAMP,
    notes        TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ deliveries");

// ─── NOTIFICATIONS (إشعارات) ─────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS notifications (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title      TEXT NOT NULL,
    body       TEXT,
    type       TEXT,
    ref_id     INTEGER,
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ notifications");

// ─── REVIEWS (تقييمات) ───────────────────────────────────
await client.query(`
  CREATE TABLE IF NOT EXISTS reviews (
    id          SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    workshop_id INTEGER REFERENCES workshops(id) ON DELETE CASCADE,
    order_id    INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ reviews");

// ─── DRIVER LOCATIONS (مواقع السائقين اللحظية) ──────────
await client.query(`
  CREATE TABLE IF NOT EXISTS driver_locations (
    id         SERIAL PRIMARY KEY,
    driver_id  INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    lat        NUMERIC,
    lng        NUMERIC,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
console.log("✅ driver_locations");

console.log("\n🎉 All tables ready!");
await client.end();
