// ProfileSelector.jsx – Startseite mit Profilauswahl
//
// Props:
//   profiles – Array von Profil-Objekten aus Supabase
//   onSelect – Funktion, die mit dem gewählten Profil aufgerufen wird

export default function ProfileSelector({ profiles, onSelect }) {
  return (
    <div className="app-page">
      <div className="hero">
        <h1>Fitness &amp; Ernährungslogger</h1>
        <p className="subtitle">Wer bist du heute?</p>

        <div className="profile-cards">
          {/* profiles.map() = für jedes Profil eine Karte rendern */}
          {profiles.map(profile => (
            <button
              key={profile.key}           /* key = einzigartiger Bezeichner für React */
              className="profile-card"
              onClick={() => onSelect(profile)}   /* Klick = dieses Profil übergeben */
            >
              <div className="profile-icon">
                {profile.key === 'ilia' ? '🏋️' : '🏃'}
              </div>
              <h2>{profile.name}</h2>
              <p>Ziel: {profile.goal}</p>
              <p>{profile.calorie_goal.toLocaleString()} kcal</p>
              <p>{profile.protein_goal} g Protein</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
