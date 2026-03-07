import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// קונפיגורציה ראשית של האפליקציה
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),  // מאזין לשגיאות גלובליות
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),  // הגדרת הראוטר
    provideHttpClient()  // הגדרת HTTP Client לבקשות שרת
  ]
};
