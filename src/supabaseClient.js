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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabaseConfigError = !isSupabaseConfigured
  ? 'Supabase URL und Anon Key müssen in der .env-Datei definiert sein.'
  : null

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null