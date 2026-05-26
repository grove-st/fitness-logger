// supabaseClient.js – Verbindung zu Supabase aufbauen
//
// Was ist Supabase?
//   Supabase ist eine "Backend as a Service"-Plattform.
//   Sie stellt uns eine Postgres-Datenbank, eine REST-API und
//   eine JavaScript-Bibliothek zur Verfügung.
//
// Was macht createClient()?
//   Es erstellt ein Objekt, mit dem wir direkt aus dem Browser
//   Daten lesen und schreiben können – ohne einen eigenen Server.
//
// Was sind import.meta.env-Variablen?
//   Vite liest beim Start die .env-Datei und stellt die Variablen
//   als import.meta.env.VITE_... bereit.
//   Nur Variablen mit VITE_-Präfix sind im Browser sichtbar.
//   Die .env-Datei NIEMALS in Git committen!

import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠ Supabase-Konfiguration fehlt!\n' +
    'Bitte .env.example als .env kopieren und die Werte eintragen.'
  )
}

// Diesen Client in allen anderen Dateien importieren:
//   import { supabase } from '../supabaseClient.js'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
