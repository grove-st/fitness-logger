// WeeklySummary.jsx – Wochenübersicht der letzten 7 Tage
//
// Props:
//   profile – Profil-Objekt (für Ziele)
//   entries – Array aller Einträge der letzten 7 Tage (aus Supabase geladen)

// Deutsche Wochentagsnamen: 0=Sonntag, 1=Montag, ...
const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

// Datum-Objekt in "YYYY-MM-DD"-String umwandeln
function toDateStr(date) {
  return date.toISOString().split('T')[0]
}

export default function WeeklySummary({ profile, entries }) {
  const today = new Date()

  // Letzte 7 Tage als Array berechnen (ältestes zuerst)
  // Array.from({ length: 7 }, (_, i) => ...) erstellt ein 7-Element-Array
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))  // i=0 → vor 6 Tagen, i=6 → heute
    return d
  })

  // Wochensummen für alle 7 Tage zusammen berechnen
  // Wir berechnen dies einmal außerhalb der map()-Schleife
  const totals = days.reduce((acc, day) => {
    const dateStr     = toDateStr(day)
    const dayMeals    = entries.filter(e => e.entry_date === dateStr && e.type === 'meal')
    const dayTrains   = entries.filter(e => e.entry_date === dateStr && e.type === 'training')
    return {
      calories:  acc.calories  + dayMeals.reduce((s, e) => s + (e.calories        || 0), 0),
      protein:   acc.protein   + dayMeals.reduce((s, e) => s + (e.protein         || 0), 0),
      burned:    acc.burned    + dayTrains.reduce((s, e) => s + (e.burned_calories || 0), 0),
      trainings: acc.trainings + dayTrains.length,
      meals:     acc.meals     + dayMeals.length,
    }
  }, { calories: 0, protein: 0, burned: 0, trainings: 0, meals: 0 })

  return (
    <div className="section">
      <h2>Wochenübersicht (letzte 7 Tage)</h2>

      <div className="week-list">
        {days.map(day => {
          const dateStr   = toDateStr(day)
          const isToday   = dateStr === toDateStr(today)
          const weekday   = WEEKDAYS[day.getDay()]

          // Einträge dieses Tages herausfiltern
          const dayMeals  = entries.filter(e => e.entry_date === dateStr && e.type === 'meal')
          const dayTrains = entries.filter(e => e.entry_date === dateStr && e.type === 'training')

          const dayCal    = dayMeals.reduce((s, e) => s + (e.calories        || 0), 0)
          const dayProt   = dayMeals.reduce((s, e) => s + (e.protein         || 0), 0)
          const dayBurned = dayTrains.reduce((s, e) => s + (e.burned_calories || 0), 0)
          const hasData   = dayMeals.length > 0 || dayTrains.length > 0

          return (
            <div key={dateStr} className={`week-day${isToday ? ' week-day-today' : ''}`}>
              <div className="week-day-header">
                <span className="week-day-name">{weekday}</span>
                <span className="week-day-date">{dateStr}</span>
                {isToday && <span className="today-badge">heute</span>}
              </div>

              {hasData ? (
                <div className="week-day-data">
                  <span className="tag tag-kcal">{Math.round(dayCal)} kcal</span>
                  <span className="tag tag-protein">{Math.round(dayProt)} g</span>
                  {dayBurned > 0 && (
                    <span className="tag tag-burned">{Math.round(dayBurned)} verbr.</span>
                  )}
                  <span className="week-day-counts">
                    {dayMeals.length} Mahlzeit(en) · {dayTrains.length} Training(s)
                  </span>
                </div>
              ) : (
                <span className="week-day-empty">keine Einträge</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Wochensumme */}
      <div className="week-summary-box">
        <h3>Wochensumme</h3>
        <div className="week-stats">
          <div className="week-stat">
            <div className="week-stat-value">{Math.round(totals.calories / 7)}</div>
            <div className="week-stat-label">Ø kcal/Tag</div>
          </div>
          <div className="week-stat">
            <div className="week-stat-value">{Math.round(totals.protein / 7)}</div>
            <div className="week-stat-label">Ø Protein/Tag</div>
          </div>
          <div className="week-stat">
            <div className="week-stat-value">{Math.round(totals.burned)}</div>
            <div className="week-stat-label">kcal verbrannt</div>
          </div>
          <div className="week-stat">
            <div className="week-stat-value">{totals.trainings}</div>
            <div className="week-stat-label">Trainings</div>
          </div>
        </div>
      </div>
    </div>
  )
}
