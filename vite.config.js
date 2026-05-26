import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite-Konfiguration
// Dokumentation: https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // base = der URL-Pfad unter dem die App auf GitHub Pages erreichbar ist.
  // WICHTIG: Muss dem GitHub-Repository-Namen entsprechen!
  //   Beispiel: Repo heißt "fitness-logger"  → base: '/fitness-logger/'
  //   Beispiel: Repo heißt "meine-app"       → base: '/meine-app/'
  //
  // Lokal (npm run dev) ignoriert Vite diesen Wert – da läuft alles unter "/"
  base: '/fitness-logger/',
})
