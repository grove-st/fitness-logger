// MealForm.jsx – Formular zum Eintragen und Bearbeiten von Mahlzeiten
//
// Wird für zwei Fälle genutzt:
//   1. Neue Mahlzeit hinzufügen  → editingEntry ist null/undefined
//   2. Mahlzeit bearbeiten       → editingEntry enthält die vorhandenen Daten
//
// Props:
//   profile      – Profil-Objekt
//   editingEntry – (optional) vorhandener Eintrag zum Bearbeiten
//   onSave       – Funktion nach erfolgreichem Speichern
//   onCancel     – Funktion beim Abbrechen

import { useState, useEffect } from 'react'
import { MEAL_PRESETS } from '../data/presets.js'
import { createEntry, updateEntry } from '../services/entriesService.js'

export default function MealForm({ profile, editingEntry, onSave, onCancel }) {
  // isEditing = true wenn ein bestehender Eintrag bearbeitet wird
  const isEditing = Boolean(editingEntry)

  // Formularfelder als ein Zustandsobjekt
  const [form, setForm] = useState({
    name:       '',
    calories:   '',
    protein:    '',
    note:       '',
    entry_date: new Date().toISOString().split('T')[0],  // heute als Standard
  })

  const [errors, setErrors]         = useState([])     // Liste von Fehlermeldungen
  const [saving, setSaving]         = useState(false)  // verhindert Doppel-Klicks
  const [showPresets, setShowPresets] = useState(!isEditing)  // Presets im Bearbeitungsmodus verstecken

  // Bei Bearbeitungsmodus: Formular mit vorhandenen Daten befüllen
  // useEffect mit [editingEntry] läuft wenn sich editingEntry ändert
  useEffect(() => {
    if (editingEntry) {
      setForm({
        name:       editingEntry.name || '',
        calories:   editingEntry.calories ?? '',
        protein:    editingEntry.protein  ?? '',
        note:       editingEntry.note     || '',
        entry_date: editingEntry.entry_date || new Date().toISOString().split('T')[0],
      })
    }
  }, [editingEntry])

  // Preset auswählen: Formularfelder mit Preset-Werten befüllen
  function handlePresetSelect(preset) {
    setForm({
      name:       preset.name,
      calories:   preset.calories,
      protein:    preset.protein,
      note:       preset.note || '',
      entry_date: new Date().toISOString().split('T')[0],
    })
    setShowPresets(false)
    setErrors([])
  }

  // Eingabefeld geändert: e.target.name = Feldname, e.target.value = neuer Wert
  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))  // nur das geänderte Feld aktualisieren
    setErrors([])
  }

  // Validierung: gibt Array mit Fehlermeldungen zurück (leer = alles ok)
  function validate() {
    const errs = []
    const cal  = parseFloat(form.calories)
    const prot = parseFloat(form.protein)
    if (isNaN(cal)  || cal  < 0) errs.push('Kalorien müssen eine Zahl ≥ 0 sein.')
    if (isNaN(prot) || prot < 0) errs.push('Protein muss eine Zahl ≥ 0 sein.')
    return errs
  }

  // Formular absenden
  async function handleSubmit(e) {
    e.preventDefault()   // verhindert Seiten-Reload (Standard-HTML-Verhalten)

    const errs = validate()
    if (errs.length > 0) { setErrors(errs); return }

    setSaving(true)
    try {
      const entryData = {
        profile_key: profile.key,
        type:        'meal',
        name:        form.name.trim() || 'Unbekannte Mahlzeit',
        calories:    parseFloat(form.calories) || 0,
        protein:     parseFloat(form.protein)  || 0,
        note:        form.note.trim(),
        entry_date:  form.entry_date,
      }

      if (isEditing) {
        await updateEntry(editingEntry.id, entryData)
      } else {
        await createEntry(entryData)
      }

      onSave()   // Dashboard neu laden + zurück zur Hauptansicht
    } catch (err) {
      setErrors([`Fehler beim Speichern: ${err.message}`])
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <div className="form-header">
        <h1>{isEditing ? 'Mahlzeit bearbeiten' : 'Mahlzeit eintragen'}</h1>
        <p className="subtitle">für {profile.name}</p>
      </div>

      {/* Fehlermeldungen */}
      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((e, i) => <p key={i}>⚠ {e}</p>)}
        </div>
      )}

      {/* Voreingestellte Mahlzeiten – nur beim Hinzufügen */}
      {!isEditing && (
        <div className="section">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowPresets(!showPresets)}
          >
            {showPresets ? '▲ Presets ausblenden' : '▼ Voreingestellte Mahlzeiten'}
          </button>
          {showPresets && (
            <div className="preset-grid">
              {MEAL_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  className="preset-card"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div className="preset-name">{preset.name}</div>
                  <div className="preset-info">
                    {preset.calories} kcal · {preset.protein} g Protein
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Formular */}
      <form onSubmit={handleSubmit} className="form">

        <div className="form-group">
          <label htmlFor="meal-name">Name der Mahlzeit</label>
          {/* htmlFor muss mit id des Inputs übereinstimmen → Klick auf Label fokussiert Input */}
          <input
            type="text"
            id="meal-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="z.B. Hähnchen mit Reis"
            className="form-input"
          />
          <small className="form-hint">Leer lassen = "Unbekannte Mahlzeit"</small>
        </div>

        {/* Kalorien und Protein nebeneinander */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="meal-calories">Kalorien (kcal) *</label>
            <input
              type="number" id="meal-calories" name="calories"
              value={form.calories} onChange={handleChange}
              min="0" step="1" required
              placeholder="z.B. 500" className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="meal-protein">Protein (g) *</label>
            <input
              type="number" id="meal-protein" name="protein"
              value={form.protein} onChange={handleChange}
              min="0" step="0.1" required
              placeholder="z.B. 40" className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="meal-note">Notiz (optional)</label>
          <input
            type="text" id="meal-note" name="note"
            value={form.note} onChange={handleChange}
            placeholder="z.B. Nach dem Training"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="meal-date">Datum</label>
          <input
            type="date" id="meal-date" name="entry_date"
            value={form.entry_date} onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          {/* disabled während dem Speichern – verhindert Doppelklick */}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Speichere...' : (isEditing ? 'Aktualisieren' : 'Speichern')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Abbrechen
          </button>
        </div>

      </form>
    </div>
  )
}
