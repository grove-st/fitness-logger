// entriesService.js – Alle Supabase-Datenbankoperationen
//
// Dieses Modul kapselt alle Datenbankzugriffe.
// Komponenten rufen diese Funktionen auf – sie kennen kein Supabase direkt.
//
// Alle Funktionen sind async und geben entweder Daten zurück oder werfen einen Error.
// Das ermöglicht sauberes Error-Handling in den Komponenten mit try/catch.

import { supabase } from '../supabaseClient.js'

// ============================================================
// PROFILE laden
// ============================================================

// Alle Profile aus der profiles-Tabelle laden.
// Rückgabe: Array von Profil-Objekten
export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('key')      // alphabetisch: hanna, ilia

  if (error) throw error
  return data
}

// ============================================================
// EINTRÄGE laden
// ============================================================

// Einträge eines bestimmten Tages laden.
//   profileKey – z.B. "ilia" oder "hanna"
//   date       – ISO-Datum, z.B. "2026-05-26"
export async function getEntriesByDate(profileKey, date) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('profile_key', profileKey)   // .eq = "equals" → WHERE profile_key = ...
    .eq('entry_date', date)
    .order('created_at')             // älteste zuerst

  if (error) throw error
  return data
}

// Einträge eines Datumsbereichs laden (für Wochenübersicht).
//   startDate – frühestes Datum, z.B. "2026-05-20"
//   endDate   – spätestes Datum, z.B. "2026-05-26"
export async function getEntriesForRange(profileKey, startDate, endDate) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('profile_key', profileKey)
    .gte('entry_date', startDate)    // .gte = "greater than or equal" → >=
    .lte('entry_date', endDate)      // .lte = "less than or equal"    → <=
    .order('entry_date')

  if (error) throw error
  return data
}

// ============================================================
// EINTRAG erstellen
// ============================================================

// Neuen Eintrag in die entries-Tabelle einfügen.
//   entry – Objekt mit allen Pflichtfeldern
// Rückgabe: der neu erstellte Eintrag (mit generierter UUID und Zeitstempel)
export async function createEntry(entry) {
  const { data, error } = await supabase
    .from('entries')
    .insert([entry])   // insert erwartet ein Array
    .select()          // gibt den eingefügten Datensatz zurück
    .single()          // .single() = wir erwarten genau einen Datensatz

  if (error) throw error
  return data
}

// ============================================================
// EINTRAG aktualisieren
// ============================================================

// Bestehenden Eintrag aktualisieren.
//   id      – UUID des Eintrags
//   updates – Objekt mit den zu ändernden Feldern
export async function updateEntry(id, updates) {
  const { data, error } = await supabase
    .from('entries')
    .update(updates)
    .eq('id', id)      // nur diesen einen Eintrag
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================
// EINTRAG löschen
// ============================================================

// Einen Eintrag permanent aus der Datenbank löschen.
//   id – UUID des Eintrags
export async function deleteEntry(id) {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)

  if (error) throw error
  // Kein Rückgabewert – delete gibt keine Daten zurück
}
