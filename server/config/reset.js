// server/config/reset.js
import pool from './database.js'

const sql = `
-- Clean slate
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS locations;

-- Locations table
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  city        TEXT,
  state       TEXT,
  sport_types TEXT[] DEFAULT ARRAY['tennis','pickleball'],
  lat         NUMERIC,
  lng         NUMERIC,
  image       TEXT
);

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  location_id   INT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  sport         TEXT NOT NULL CHECK (sport IN ('tennis','pickleball')),
  start_time    TIMESTAMPTZ NOT NULL,
  duration_mins INT NOT NULL DEFAULT 90,
  host          TEXT,
  notes         TEXT
);

-- =========================
-- Seed LOCATIONS (Queens)
-- =========================
-- Insert order will assign IDs as:
-- 1 = Astoria Park
-- 2 = Kissena Park
-- 3 = Juniper Valley Park
-- 4 = Forest Park
INSERT INTO locations (name, city, state, sport_types, lat,    lng,     image) VALUES
 ('Astoria Park',        'Queens','NY', ARRAY['tennis','pickleball'], 40.7792, -73.9220, 'https://picsum.photos/seed/astoria/600/400'),
 ('Kissena Park',        'Queens','NY', ARRAY['tennis','pickleball'], 40.7439, -73.8124, 'https://picsum.photos/seed/kissena/600/400'),
 ('Juniper Valley Park', 'Queens','NY', ARRAY['tennis','pickleball'], 40.7197, -73.8728, 'https://picsum.photos/seed/juniper/600/400'),
 ('Forest Park',         'Queens','NY', ARRAY['tennis','pickleball'], 40.7039, -73.8504, 'https://picsum.photos/seed/forest/600/400');

-- =========================
-- Seed EVENTS
-- (mix of upcoming & past)
-- =========================
INSERT INTO events (location_id, title,                     sport,       start_time,                               duration_mins, host,  notes) VALUES
 (1, 'Astoria Evening Dinks',       'pickleball', NOW() + INTERVAL '18 hours',              90,  '@ari', 'Beginner friendly, paddles available'),
 (1, 'Astoria Saturday Rally',      'tennis',      NOW() + INTERVAL '3 days 5 hours',      120,  '@max', 'Doubles; courts by the track'),

 (2, 'Kissena Ladder',              'tennis',      NOW() + INTERVAL '2 days 2 hours',       90,  '@lin', 'Singles ladder, RSVP'),
 (2, 'Kissena Morning Mix',         'pickleball',  NOW() - INTERVAL '5 hours',              60,  '@noah','Casual play, bring water'),

 (3, 'Juniper Sunset Social',       'pickleball',  NOW() + INTERVAL '1 day 4 hours',        75,  '@jv',  'Open play, all levels'),
 (3, 'Juniper Drills',              'tennis',      NOW() - INTERVAL '1 day 1 hour',         60,  '@rey', 'Footwork & serves'),

 (4, 'Forest Park Round Robin',     'tennis',      NOW() + INTERVAL '4 days 7 hours',      120,  '@fp',  'Intermediate+'),
 (4, 'Forest Pickle Casual',        'pickleball',  NOW() + INTERVAL '8 hours',              60,  '@kim', 'Drop-in welcome');
`;

try {
  await pool.query(sql);
  console.log('✅ DB reset complete');
  process.exit(0);
} catch (e) {
  console.error('❌ Reset failed:', e);
  process.exit(1);
}
