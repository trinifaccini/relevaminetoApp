import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.relevamiento',
  appName: 'Relevamiento',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Tiempo mínimo que se muestra la splash screen
      launchAutoHide: false,    // No auto-ocultar, lo manejamos manualmente
      backgroundColor: "#ffffff", // Color de fondo
      showSpinner: false,
    }
  }
  };

export default config;
