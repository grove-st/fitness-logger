-- ============================================================
-- FITNESS LOGGER – Supabase Datenbankschema
-- ============================================================
-- Dieses SQL im Supabase SQL Editor ausführen:
--   Supabase Dashboard → SQL Editor → New Query → Einfügen → Run
-- ============================================================


-- ============================================================
-- TABELLE: profiles
-- Speichert die Nutzerprofile (Ilia und Hanna)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id           uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  key          text    UNIQUE NOT NULL,                    -- "ilia" oder "hanna"
  name         text    NOT NULL,                           -- Anzeigename
  goal         text    DEFAULT '',                         -- z.B. "Muskelaufbau"
  calorie_goal integer NOT NULL DEFAULT 2000
               CHECK (calorie_goal > 0),
  protein_goal integer NOT NULL DEFAULT 100
               CHECK (protein_goal > 0),
  created_at   timestamp with time zone DEFAULT now()
);


-- ============================================================
-- TABELLE: entries
-- Speichert alle Mahlzeiten und Trainings
-- ============================================================
CREATE TABLE IF NOT EXISTS entries (
  id               uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_key      text    NOT NULL
                   REFERENCES profiles(key) ON DELETE CASCADE,
  -- ON DELETE CASCADE: Wenn ein Profil gelöscht wird, werden auch alle Einträge gelöscht

  type             text    NOT NULL
                   CHECK (type IN ('meal', 'training')),   -- nur diese zwei Werte erlaubt

  name             text    NOT NULL DEFAULT '',
  calories         numeric NOT NULL DEFAULT 0 CHECK (calories         >= 0),
  protein          numeric NOT NULL DEFAULT 0 CHECK (protein          >= 0),
  duration_minutes integer NOT NULL DEFAULT 0 CHECK (duration_minutes >= 0),
  distance_km      numeric NOT NULL DEFAULT 0 CHECK (distance_km      >= 0),
  burned_calories  numeric NOT NULL DEFAULT 0 CHECK (burned_calories  >= 0),
  note             text    DEFAULT '',
  entry_date       date    NOT NULL DEFAULT CURRENT_DATE,
  created_at       timestamp with time zone DEFAULT now()
);

-- Index für schnelle Abfragen nach Person + Datum
-- Ohne Index müsste die Datenbank jede Zeile prüfen.
-- Mit Index ist die Suche logarithmisch schnell.
CREATE INDEX IF NOT EXISTS idx_entries_profile_date
  ON entries(profile_key, entry_date);


-- ============================================================
-- STARTDATEN: Ilia und Hanna einfügen
-- ON CONFLICT DO NOTHING = kein Fehler wenn schon vorhanden
-- ============================================================
INSERT INTO profiles (key, name, goal, calorie_goal, protein_goal) VALUES
  ('ilia',  'Ilia',  'Muskelaufbau',       3000, 160),
  ('hanna', 'Hanna', 'Fitness / Abnehmen', 1800, 100)
ON CONFLICT (key) DO NOTHING;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- RLS kontrolliert wer Daten lesen/schreiben darf.
-- Da unsere App ohne Login arbeitet, erlauben wir alles für den Anon-Key.
--
-- WICHTIG für echte Apps: Hier Authentifizierung einbauen!
--   z.B. auth.uid() = profile.user_id  (nur eigene Daten sehen)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries  ENABLE ROW LEVEL SECURITY;

-- Profiles: nur lesen (niemand soll Profile anlegen/löschen können)
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

-- Entries: alles erlaubt für anonyme Nutzer
CREATE POLICY "entries_select" ON entries FOR SELECT USING (true);
CREATE POLICY "entries_insert" ON entries FOR INSERT WITH CHECK (true);
CREATE POLICY "entries_update" ON entries FOR UPDATE USING (true);
CREATE POLICY "entries_delete" ON entries FOR DELETE USING (true);
