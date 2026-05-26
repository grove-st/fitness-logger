// EntriesList.jsx – Liste der heutigen Einträge mit Bearbeiten/Löschen
//
// Props:
//   meals     – Array heutiger Mahlzeit-Einträge
//   trainings – Array heutiger Training-Einträge
//   onEdit    – Funktion(entry) → öffnet Bearbeitungsformular
//   onDelete  – Funktion(entry) → löscht den Eintrag

import { useState } from 'react'

export default function EntriesList({ meals, trainings, onEdit, onDelete }) {
  // activeTab steuert welche Liste sichtbar ist
  const [activeTab, setActiveTab] = useState('meals')

  const isEmpty = meals.length === 0 && trainings.length === 0

  if (isEmpty) {
    return (
      <div className="section">
        <h2>Heutige Einträge</h2>
        <p className="empty-hint">
          Noch keine Einträge für heute. Füge eine Mahlzeit oder ein Training hinzu!
        </p>
      </div>
    )
  }

  return (
    <div className="section">
      <h2>Heutige Einträge</h2>

      {/* Tab-Navigation */}
      <div className="tabs">
        <button
          className={`tab${activeTab === 'meals' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          Mahlzeiten ({meals.length})
        </button>
        <button
          className={`tab${activeTab === 'trainings' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('trainings')}
        >
          Trainings ({trainings.length})
        </button>
      </div>

      {/* Mahlzeiten-Liste */}
      {activeTab === 'meals' && (
        <div className="entry-list">
          {meals.length === 0 ? (
            <p className="empty-hint">Noch keine Mahlzeiten heute eingetragen.</p>
          ) : (
            meals.map(meal => (
              <div key={meal.id} className="entry-card">
                <div className="entry-info">
                  <div className="entry-name">{meal.name}</div>
                  <div className="entry-tags">
                    <span className="tag tag-kcal">{Math.round(meal.calories)} kcal</span>
                    <span className="tag tag-protein">{Math.round(meal.protein)} g Protein</span>
                  </div>
                  {meal.note && <div className="entry-note">{meal.note}</div>}
                  <div className="entry-date">{meal.entry_date}</div>
                </div>
                <div className="entry-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit(meal)}
                    title="Bearbeiten"
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(meal)}
                    title="Löschen"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Trainings-Liste */}
      {activeTab === 'trainings' && (
        <div className="entry-list">
          {trainings.length === 0 ? (
            <p className="empty-hint">Noch kein Training heute eingetragen.</p>
          ) : (
            trainings.map(training => (
              <div key={training.id} className="entry-card">
                <div className="entry-info">
                  <div className="entry-name">{training.name}</div>
                  <div className="entry-tags">
                    <span className="tag tag-duration">{training.duration_minutes} Min</span>
                    <span className="tag tag-kcal">{Math.round(training.burned_calories)} kcal verbrannt</span>
                    {training.distance_km > 0 && (
                      <span className="tag tag-distance">{training.distance_km} km</span>
                    )}
                  </div>
                  {training.note && <div className="entry-note">{training.note}</div>}
                  <div className="entry-date">{training.entry_date}</div>
                </div>
                <div className="entry-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit(training)}
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(training)}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
