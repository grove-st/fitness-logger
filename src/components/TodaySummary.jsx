// TodaySummary.jsx – Tagesübersicht: Fortschrittsbalken + regelbasierte Tipps
//
// Props:
//   profile   – Profil-Objekt mit calorie_goal, protein_goal, key, goal
//   meals     – Array heutiger Mahlzeit-Einträge
//   trainings – Array heutiger Training-Einträge

// ============================================================
// REGELBASIERTE TIPPS (ohne KI)
// ============================================================
// Diese Funktion berechnet Tipps basierend auf einfachen Regeln (if/else).
// Noch keine echte KI – nur Logik aus dem Python-Original übernommen.
function getRuleBasedTips(profile, totalCal, totalProt, totalBurned, hasTraining) {
  const tips = []
  const { calorie_goal, protein_goal, key } = profile

  // Kalorientipps
  if (totalCal < calorie_goal * 0.6) {
    if (key === 'ilia') {
      tips.push('Für Muskelaufbau brauchst du noch deutlich mehr Kalorien. Probier einen Protein-Shake oder eine große Mahlzeit!')
    } else {
      tips.push('Du hast heute noch wenig gegessen. Vergiss nicht, deinen Körper mit Nährstoffen zu versorgen!')
    }
  } else if (totalCal > calorie_goal * 1.15 && key === 'hanna') {
    tips.push('Du bist über deinem Kalorienziel. Probiere bei der nächsten Mahlzeit leichtere Optionen wie Salat oder Gemüse.')
  }

  // Proteintipp
  if (totalProt < protein_goal * 0.7) {
    const missing = Math.round(protein_goal - totalProt)
    tips.push(`Du brauchst noch ca. ${missing} g Protein. Hähnchen, Quark, Eier oder ein Protein-Shake helfen!`)
  }

  // Trainingstipps
  if (hasTraining) {
    tips.push(`Super! ${Math.round(totalBurned)} kcal verbrannt. Achte auf ausreichend Schlaf und mind. 2–3 Liter Wasser!`)
  } else {
    tips.push('Heute noch kein Training? Auch ein 20-Minuten-Spaziergang tut deinem Körper gut!')
  }

  return tips
}

// ============================================================
// KI-PLATZHALTER FUNKTIONEN
// ============================================================
// Diese Funktionen sind aktuell nur Dummy-Implementierungen.
// Sie zeigen wo später echte KI eingebaut werden soll.
//
// WICHTIG: KI-API-Keys NIEMALS direkt im Browser verwenden!
// Später: Backend-Proxy erstellen (z.B. Supabase Edge Function),
// der die Anthropic-API aufruft und das Ergebnis zurückgibt.

// Platzhalter: Nährwerte aus Text schätzen
// Später: Aufruf an Backend → Anthropic Claude API
export async function estimateMealFromText(text) {
  console.log('[KI-Platzhalter] estimateMealFromText:', text)
  // === SPÄTER HIER KI EINBAUEN ===
  // const response = await fetch('/api/estimate-meal', { method: 'POST', body: JSON.stringify({ text }) })
  // return response.json()
  return { calories: 400, protein: 30, note: 'KI-Schätzung (Platzhalter)' }
}

// Platzhalter: Mahlzeit aus Foto erkennen
// Später: Bild als Base64 an Backend → Claude Vision API
export async function estimateMealFromPhoto(file) {
  console.log('[KI-Platzhalter] estimateMealFromPhoto:', file?.name)
  // === SPÄTER HIER KI EINBAUEN ===
  // const formData = new FormData()
  // formData.append('image', file)
  // const response = await fetch('/api/estimate-photo', { method: 'POST', body: formData })
  // return response.json()
  return { calories: 350, protein: 25, note: 'Foto-Erkennung (Platzhalter)' }
}

// Platzhalter: KI-Tipp generieren
// Später: Profil + Zusammenfassung an Backend → Claude generiert personalisierten Tipp
export async function generateAiTip(profile, summary) {
  console.log('[KI-Platzhalter] generateAiTip:', profile.name, summary)
  // === SPÄTER HIER KI EINBAUEN ===
  // const response = await fetch('/api/ai-tip', { method: 'POST', body: JSON.stringify({ profile, summary }) })
  // return response.json()
  return null
}

// ============================================================
// WEARABLE-PLATZHALTER
// ============================================================
// Diese Kommentare zeigen, wie Watch-Daten später eingebunden werden könnten.
//
// APPLE WATCH / HEALTHKIT:
//   Nicht direkt über GitHub Pages möglich.
//   Lösung: Native iOS-App (Swift) liest HealthKit und sendet Daten an Supabase.
//   Dann erscheinen die Daten automatisch in dieser Web-App.
//
// ANDROID HEALTH CONNECT:
//   Ähnlich: Native Android-App liest Health Connect und sendet an Supabase.
//
// GARMIN:
//   Garmin Developer Program (developer.garmin.com) bietet eine REST API.
//   OAuth-Login → Daten per fetch() an Supabase senden.


// ============================================================
// KOMPONENTE
// ============================================================
export default function TodaySummary({ profile, meals, trainings }) {
  // Tagessummen berechnen
  // Array.reduce() addiert alle Werte:  [100, 200, 300].reduce((sum, x) => sum + x, 0) = 600
  const totalCal     = meals.reduce((sum, m) => sum + (m.calories || 0), 0)
  const totalProt    = meals.reduce((sum, m) => sum + (m.protein  || 0), 0)
  const totalBurned  = trainings.reduce((sum, t) => sum + (t.burned_calories || 0), 0)
  const netCalories  = totalCal - totalBurned

  const { calorie_goal, protein_goal } = profile

  // Prozentwerte für Fortschrittsbalken (0–100%)
  // Math.min(..., 100) verhindert Überläufe über 100%
  const calPercent  = calorie_goal  > 0 ? Math.min(Math.round((totalCal  / calorie_goal)  * 100), 100) : 0
  const protPercent = protein_goal  > 0 ? Math.min(Math.round((totalProt / protein_goal)  * 100), 100) : 0

  const tips = getRuleBasedTips(profile, totalCal, totalProt, totalBurned, trainings.length > 0)

  return (
    <div className="section">
      <h2>Tagesübersicht – {new Date().toLocaleDateString('de-DE')}</h2>

      {/* Statistik-Karten */}
      <div className="card-grid">

        {/* Kalorien-Karte */}
        <div className="card">
          <div className="card-label">Kalorien gegessen</div>
          <div className="card-value">{Math.round(totalCal)}</div>
          <div className="card-sub">/ {calorie_goal} kcal</div>
          <div className="progress-bar">
            <div
              className={`progress-fill${calPercent >= 100 ? ' progress-full' : ''}`}
              style={{ width: `${calPercent}%` }}
            />
          </div>
          <div className="progress-label">{calPercent}% des Tagesziels</div>
        </div>

        {/* Protein-Karte */}
        <div className="card">
          <div className="card-label">Protein</div>
          <div className="card-value">{Math.round(totalProt)}</div>
          <div className="card-sub">/ {protein_goal} g</div>
          <div className="progress-bar">
            <div
              className={`progress-fill progress-protein${protPercent >= 100 ? ' progress-full' : ''}`}
              style={{ width: `${protPercent}%` }}
            />
          </div>
          <div className="progress-label">{protPercent}% des Tagesziels</div>
        </div>

        {/* Training-Karte */}
        <div className="card">
          <div className="card-label">Training verbrannt</div>
          <div className="card-value">{Math.round(totalBurned)}</div>
          <div className="card-sub">kcal</div>
          <div className="card-net">
            Netto: <strong>{Math.round(netCalories)} kcal</strong>
          </div>
        </div>

      </div>

      {/* Tipps */}
      {tips.length > 0 && (
        <div className="tips-box">
          <h3>Tipps für heute</h3>
          {tips.map((tip, i) => (
            <p key={i} className="tip">{tip}</p>
          ))}
          <small className="tip-note">
            Regelbasierte Tipps — KI-Tipps folgen später (siehe estimateMealFromText, generateAiTip)
          </small>
        </div>
      )}
    </div>
  )
}
