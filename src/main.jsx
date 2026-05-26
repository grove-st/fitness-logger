// main.jsx – Einstiegspunkt der React-App
//
// Was passiert hier?
//   1. React wird importiert
//   2. Das globale CSS wird geladen
//   3. Die App-Komponente wird in das <div id="root"> in index.html eingehängt
//
// StrictMode: React prüft in der Entwicklung extra streng auf Fehler.
//             Im fertigen Build (npm run build) wird er automatisch entfernt.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
