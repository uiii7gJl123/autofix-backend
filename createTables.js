import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

await client.connect();

await client.query(`
CREATE TABLE IF NOT EXISTS users(
id SERIAL PRIMARY KEY,
name TEXT,
phone TEXT UNIQUE,
password TEXT,
role TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

await client.query(`
CREATE TABLE IF NOT EXISTS vehicles(
id SERIAL PRIMARY KEY,
user_id INTEGER,
brand TEXT,
model TEXT,
year INTEGER,
plate TEXT
);
`);

await client.query(`
CREATE TABLE IF NOT EXISTS workshops(
id SERIAL PRIMARY KEY,
user_id INTEGER,
name TEXT,
location TEXT,
phone TEXT
);
`);

await client.query(`
CREATE TABLE IF NOT EXISTS parts(
id SERIAL PRIMARY KEY,
distributor_id INTEGER,
name TEXT,
price NUMERIC,
stock INTEGER
);
`);

await client.query(`
CREATE TABLE IF NOT EXISTS orders(
id SERIAL PRIMARY KEY,
client_id INTEGER,
vehicle_id INTEGER,
workshop_id INTEGER,
description TEXT,
status TEXT DEFAULT 'created',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

await client.query(`
CREATE TABLE IF NOT EXISTS deliveries(
id SERIAL PRIMARY KEY,
order_id INTEGER,
driver_id INTEGER,
status TEXT DEFAULT 'waiting'
);
`);

console.log("DB ready");

await client.end();
