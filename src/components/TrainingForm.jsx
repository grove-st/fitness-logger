// TrainingForm.jsx – Formular zum Eintragen und Bearbeiten von Trainings
//
// Gleiche Struktur wie MealForm.jsx – nur andere Felder.
// Felder: Name/Art, Dauer (Pflicht), Distanz (optional), verbrannte Kalorien (optional), Notiz, Datum
//
// Props:
//   profile      – Profil-Objekt
//   editingEntry – (optional) vorhandener Eintrag zum Bearbeiten
//   onSave       – Funktion nach erfolgreichem Speichern
//   onCancel     – Funktion beim Abbrechen

import { useState, useEffect } from 'react'
import { TRAINING_PRESETS } from '../data/presets.js'
import { createEntry, updateEntry } from '../services/entriesService.js'

export default function TrainingForm({ profile, editingEntry, onSave, onCancel }) {
  const isEditing = Boolean(editingEntry)

  const [form, setForm] = useState({
    name:             '',
    duration_minutes: '',
    distance_km:      '',
    burned_calories:  '',
    note:             '',
    entry_date:       new Date().toISOString().split('T')[0],
  })

  const [errors, setErrors]           = useState([])
  const [saving, setSaving]           = useState(false)
  const [showPresets, setShowPresets] = useState(!isEditing)

  useEffect(() => {
    if (editingEntry) {
      setForm({
        name:             editingEntry.name             || '',
        duration_minutes: editingEntry.duration_minutes ?? '',
        distance_km:      editingEntry.distance_km      ?? '',
        burned_calories:  editingEntry.burned_calories  ?? '',
        note:             editingEntry.note             || '',
        entry_date:       editingEntry.entry_date || new Date().toISOString().split('T')[0],
      })
    }
  }, [editingEntry])

  function handlePresetSelect(preset) {
    setForm({
      name:             preset.name,
      duration_minutes: preset.duration_minutes,
      distance_km:      preset.distance_km || '',
      burned_calories:  preset.burned_calories,
      note:             preset.note || '',
      entry_date:       new Date().toISOString().split('T')[0],
    })
    setShowPresets(false)
    setErrors([])
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors([])
  }

  function validate() {
    const errs    = []
    const dur     = parseInt(form.duration_minutes)
    const dist    = parseFloat(form.distance_km || 0)
    const burned  = parseFloat(form.burned_calories || 0)

    if (isNaN(dur) || dur < 1)               errs.push('Dauer muss mindestens 1 Minute sein.')
    if (!isNaN(dist)   && dist   < 0)        errs.push('Distanz kann nicht negativ sein.')
    if (!isNaN(burned) && burned < 0)        errs.push('Verbrannte Kalorien können nicht negativ sein.')
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const errs = validate()
    if (errs.length > 0) { setErrors(errs); return }

    setSaving(true)
    try {
      const entryData = {
        profile_key:      profile.key,
        type:             'training',
        name:             form.name.trim() || 'Unbekanntes Training',
        duration_minutes: parseInt(form.duration_minutes)       || 0,
        distance_km:      parseFloat(form.distance_km)          || 0,
        burned_calories:  parseFloat(form.burned_calories)      || 0,
        note:             form.note.trim(),
        entry_date:       form.entry_date,
      }

      if (isEditing) {
        await updateEntry(editingEntry.id, entryData)
      } else {
        await createEntry(entryData)
      }

      onSave()
    } catch (err) {
      setErrors([`Fehler beim Speichern: ${err.message}`])
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <div className="form-header">
        <h1>{isEditing ? 'Training bearbeiten' : 'Training eintragen'}</h1>
        <p className="subtitle">für {profile.name}</p>
      </div>

      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((e, i) => <p key={i}>⚠ {e}</p>)}
        </div>
      )}

      {/* Voreingestellte Trainings */}
      {!isEditing && (
        <div className="section">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowPresets(!showPresets)}
          >
            {showPresets ? '▲ Presets ausblenden' : '▼ Voreingestellte Trainings'}
          </button>
          {showPresets && (
            <div className="preset-grid">
              {TRAINING_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  className="preset-card"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div className="preset-name">{preset.name}</div>
                  <div className="preset-info">
                    {preset.duration_minutes} Min · {preset.burned_calories} kcal
                    {preset.distance_km > 0 ? ` · ${preset.distance_km} km` : ''}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">

        <div className="form-group">
          <label htmlFor="train-name">Trainingsart</label>
          <input
            type="text" id="train-name" name="name"
            value={form.name} onChange={handleChange}
            placeholder="z.B. Laufen, Gym, Fußball"
            className="form-input"
          />
          <small className="form-hint">Leer lassen = "Unbekanntes Training"</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="train-duration">Dauer (Minuten) *</label>
            <input
              type="number" id="train-duration" name="duration_minutes"
              value={form.duration_minutes} onChange={handleChange}
              min="1" step="1" required
              placeholder="z.B. 60" className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="train-distance">Distanz (km, optional)</label>
            <input
              type="number" id="train-distance" name="distance_km"
              value={form.distance_km} onChange={handleChange}
              min="0" step="0.1"
              placeholder="z.B. 10" className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="train-burned">Verbrannte Kalorien (optional)</label>
          <input
            type="number" id="train-burned" name="burned_calories"
            value={form.burned_calories} onChange={handleChange}
            min="0" step="1"
            placeholder="z.B. 400" className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="train-note">Notiz (optional)</label>
          <input
            type="text" id="train-note" name="note"
            value={form.note} onChange={handleChange}
            placeholder="z.B. Gutes Training heute"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="train-date">Datum</label>
          <input
            type="date" id="train-date" name="entry_date"
            value={form.entry_date} onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-actions">
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
