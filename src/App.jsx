// App.jsx – Haupt-Komponente der React-App
//
// Was macht App?
//   - Lädt beim Start die Profile aus Supabase
//   - Verwaltet den Zustand: Welches Profil ist ausgewählt?
//   - Zeigt entweder die Profilauswahl oder das Dashboard an
//
// React-Konzepte in dieser Datei:
//   useState()  – speichert Werte, die sich ändern können (Zustand)
//   useEffect() – führt Code aus wenn sich etwas ändert (Seiteneffekte)
//   Bedingtes Rendering: { condition ? <A /> : <B /> }

import { useState, useEffect } from 'react'
import ProfileSelector from './components/ProfileSelector.jsx'
import Dashboard from './components/Dashboard.jsx'
import { getProfiles } from './services/entriesService.js'

// Fallback-Profile wenn Supabase nicht erreichbar ist.
// Verhindert, dass die App bei einem Netzwerkfehler komplett leer bleibt.
const FALLBACK_PROFILES = [
  { key: 'ilia',  name: 'Ilia',  goal: 'Muskelaufbau',       calorie_goal: 3000, protein_goal: 160 },
  { key: 'hanna', name: 'Hanna', goal: 'Fitness / Abnehmen', calorie_goal: 1800, protein_goal: 100 },
]

export default function App() {
  // profiles: Liste aller Profile aus Supabase
  const [profiles, setProfiles]           = useState(FALLBACK_PROFILES)
  // currentProfile: das aktuell ausgewählte Profil-Objekt (null = Startseite)
  const [currentProfile, setCurrentProfile] = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  // useEffect mit leerem Array [] = läuft nur beim ersten Laden der Seite
  useEffect(() => {
    async function loadProfiles() {
      try {
        const data = await getProfiles()
        // Nur ersetzen wenn Supabase wirklich Daten zurückgab
        if (data && data.length > 0) setProfiles(data)
      } catch (err) {
        console.error('Profile konnten nicht geladen werden:', err.message)
        setError('Supabase-Verbindung fehlgeschlagen – bitte .env prüfen. Fallback-Profile werden verwendet.')
        // Fallback-Profile bleiben aktiv
      } finally {
        // setLoading(false) wird IMMER ausgeführt, egal ob Fehler oder nicht
        setLoading(false)
      }
    }
    loadProfiles()
  }, []) // <- leeres Array = nur einmal beim Start

  // Ladeanzeige während Profile geladen werden
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Lade Daten...</p>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Warnhinweis wenn Supabase nicht erreichbar war */}
      {error && (
        <div className="error-banner">
          ⚠ {error}
        </div>
      )}

      {/* Bedingtes Rendering:
          - currentProfile === null → Profilauswahl anzeigen
          - currentProfile !== null → Dashboard anzeigen */}
      {currentProfile === null ? (
        <ProfileSelector
          profiles={profiles}
          onSelect={setCurrentProfile}   // Profil auswählen = in currentProfile speichern
        />
      ) : (
        <Dashboard
          profile={currentProfile}
          onBack={() => setCurrentProfile(null)}   // Zurück = Profile zurücksetzen
        />
      )}
    </div>
  )
}
