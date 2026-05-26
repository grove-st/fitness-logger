// Dashboard.jsx – Persönliches Dashboard (Hauptansicht nach der Profilauswahl)
//
// Was macht Dashboard?
//   - Lädt heutige Einträge und Wocheneinträge aus Supabase
//   - Verwaltet den internen Anzeigestatus (Hauptansicht, Formular, Bearbeiten)
//   - Gibt Daten an untergeordnete Komponenten weiter
//
// Props:
//   profile – das ausgewählte Profil-Objekt (key, name, calorie_goal, protein_goal, ...)
//   onBack  – Funktion zum Zurücknavigieren zur Profilauswahl

import { useState, useEffect, useCallback } from 'react'
import TodaySummary from './TodaySummary.jsx'
import EntriesList from './EntriesList.jsx'
import MealForm from './MealForm.jsx'
import TrainingForm from './TrainingForm.jsx'
import WeeklySummary from './WeeklySummary.jsx'
import { getEntriesByDate, getEntriesForRange, deleteEntry } from '../services/entriesService.js'

// Hilfsfunktion: heutiges Datum als "YYYY-MM-DD"-String
function getToday() {
  return new Date().toISOString().split('T')[0]
}

// Hilfsfunktion: Datum von vor n Tagen als String
function getDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export default function Dashboard({ profile, onBack }) {
  // view steuert was gerade angezeigt wird:
  //   'main'         – Tagesübersicht + Listen
  //   'add-meal'     – Formular: Mahlzeit hinzufügen
  //   'add-training' – Formular: Training hinzufügen
  //   'edit'         – Formular: Eintrag bearbeiten
  const [view, setView]                 = useState('main')
  const [editingEntry, setEditingEntry] = useState(null)   // der zu bearbeitende Eintrag

  const [todayEntries, setTodayEntries] = useState([])
  const [weekEntries, setWeekEntries]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  // useCallback verhindert, dass bei jedem Render eine neue Funktionsreferenz
  // entsteht – wichtig für useEffect-Dependencies
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    const today     = getToday()
    const weekStart = getDaysAgo(6)   // 6 Tage zurück + heute = 7 Tage

    try {
      // Promise.all() führt beide Ladevorgänge gleichzeitig aus (parallel)
      const [todayData, weekData] = await Promise.all([
        getEntriesByDate(profile.key, today),
        getEntriesForRange(profile.key, weekStart, today),
      ])
      setTodayEntries(todayData)
      setWeekEntries(weekData)
    } catch (err) {
      console.error('Fehler beim Laden:', err.message)
      setError('Daten konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }, [profile.key])

  // Beim ersten Laden und wenn sich das Profil ändert
  useEffect(() => {
    loadData()
  }, [loadData])

  // Eintrag löschen
  async function handleDelete(entry) {
    const name = entry.name || 'Eintrag'
    if (!window.confirm(`"${name}" wirklich löschen?`)) return

    try {
      await deleteEntry(entry.id)
      await loadData()   // Liste neu laden nach dem Löschen
    } catch (err) {
      alert('Fehler beim Löschen: ' + err.message)
    }
  }

  // Bearbeitungsmodus starten
  function handleEdit(entry) {
    setEditingEntry(entry)
    setView('edit')
  }

  // Wird aufgerufen nachdem ein Formular gespeichert wurde
  async function handleFormSave() {
    await loadData()        // Daten neu laden
    setView('main')         // zurück zur Hauptansicht
    setEditingEntry(null)
  }

  function handleFormCancel() {
    setView('main')
    setEditingEntry(null)
  }

  // Heutige Einträge nach Typ aufteilen
  const todayMeals     = todayEntries.filter(e => e.type === 'meal')
  const todayTrainings = todayEntries.filter(e => e.type === 'training')

  // ---- Formular-Ansichten ----
  if (view === 'add-meal') {
    return (
      <div className="app-page">
        <nav className="navbar">
          <button className="btn-back" onClick={handleFormCancel}>← Zurück</button>
          <span className="navbar-title">Mahlzeit eintragen</span>
          <span />
        </nav>
        <MealForm profile={profile} onSave={handleFormSave} onCancel={handleFormCancel} />
      </div>
    )
  }

  if (view === 'add-training') {
    return (
      <div className="app-page">
        <nav className="navbar">
          <button className="btn-back" onClick={handleFormCancel}>← Zurück</button>
          <span className="navbar-title">Training eintragen</span>
          <span />
        </nav>
        <TrainingForm profile={profile} onSave={handleFormSave} onCancel={handleFormCancel} />
      </div>
    )
  }

  if (view === 'edit' && editingEntry) {
    // Je nach Typ das passende Formular anzeigen
    const FormComponent = editingEntry.type === 'meal' ? MealForm : TrainingForm
    return (
      <div className="app-page">
        <nav className="navbar">
          <button className="btn-back" onClick={handleFormCancel}>← Zurück</button>
          <span className="navbar-title">Eintrag bearbeiten</span>
          <span />
        </nav>
        <FormComponent
          profile={profile}
          editingEntry={editingEntry}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  // ---- Hauptansicht ----
  return (
    <div className="app-page">
      <nav className="navbar">
        <button className="btn-back" onClick={onBack}>← Zurück</button>
        <span className="navbar-title">{profile.name}</span>
        <button className="btn-refresh" onClick={loadData} title="Aktualisieren">⟳</button>
      </nav>

      <div className="container">
        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="loading">Lade Daten...</div>
        ) : (
          <>
            {/* Tagesübersicht mit Fortschrittsbalken und Tipps */}
            <TodaySummary
              profile={profile}
              meals={todayMeals}
              trainings={todayTrainings}
            />

            {/* Buttons: Eintrag hinzufügen */}
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={() => setView('add-meal')}>
                + Mahlzeit eintragen
              </button>
              <button className="btn btn-success" onClick={() => setView('add-training')}>
                + Training eintragen
              </button>
            </div>

            {/* Liste heutiger Einträge mit Bearbeiten/Löschen */}
            <EntriesList
              meals={todayMeals}
              trainings={todayTrainings}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Übersicht der letzten 7 Tage */}
            <WeeklySummary
              profile={profile}
              entries={weekEntries}
            />
          </>
        )}
      </div>
    </div>
  )
}
