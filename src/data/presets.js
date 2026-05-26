// presets.js – Voreingestellte Mahlzeiten und Trainings
//
// Diese Daten sind fest im Code gespeichert (kein Supabase-Aufruf).
// Wenn der Nutzer ein Preset auswählt, wird ein neuer Supabase-Eintrag erstellt.
//
// Felder für Mahlzeiten:  name, calories, protein, note
// Felder für Trainings:   name, duration_minutes, distance_km, burned_calories, note

export const MEAL_PRESETS = [
  {
    name:     'Protein Iced Coffee mit Mandelmilch',
    calories: 150,
    protein:  25,
    note:     'Lecker und schnell',
  },
  {
    name:     'Hähnchen-Wrap',
    calories: 650,
    protein:  45,
    note:     'Gute Proteinquelle',
  },
  {
    name:     'Portion Nudeln mit Sauce',
    calories: 700,
    protein:  20,
    note:     'Kohlenhydrate vor dem Training',
  },
  {
    name:     'Salat mit Hähnchen',
    calories: 500,
    protein:  40,
    note:     'Leicht und proteinreich',
  },
  {
    name:     'Protein-Pudding',
    calories: 200,
    protein:  20,
    note:     'Perfekter Snack',
  },
]

export const TRAINING_PRESETS = [
  {
    name:             '10 km Lauf locker',
    duration_minutes: 60,
    distance_km:      10.0,
    burned_calories:  600,
    note:             'Lockeres Ausdauertraining',
  },
  {
    name:             'Gym Push-Training',
    duration_minutes: 75,
    distance_km:      0,
    burned_calories:  350,
    note:             'Brust, Schultern, Trizeps',
  },
  {
    name:             'Fußballtraining',
    duration_minutes: 90,
    distance_km:      0,
    burned_calories:  700,
    note:             'Mannschaftstraining',
  },
  {
    name:             'Spaziergang',
    duration_minutes: 45,
    distance_km:      0,
    burned_calories:  150,
    note:             'Aktive Erholung',
  },
]
