import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ion.camera',
  appName: 'ion-camera',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
