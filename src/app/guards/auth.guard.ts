import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard המגן על נתיבים שדורשים אימות משתמש
// מונע גישה לדפים מוגנים למשתמשים שלא מחוברים
export const authGuard: CanActivateFn = () => {
  // הזרקת שירות האימות
  const authService = inject(AuthService);
  // הזרקת שירות הניווט
  const router = inject(Router);

  // בדיקה אם המשתמש מחובר
  if (authService.isLoggedIn()) {
    return true;  // אישור גישה
  }

  // הפניה לדף התחברות אם המשתמש לא מחובר
  router.navigate(['/login']);
  return false;  // חסימת גישה
};
