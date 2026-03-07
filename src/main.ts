import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// אתחול האפליקציה עם הקונפיגורציה
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));  // טיפול בשגיאות אתחול
