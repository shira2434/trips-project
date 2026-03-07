import { Component, inject } from '@angular/core';
// מייבא את הדקורטור Component ואת הפונקציה inject להזרקת תלויות

import { Router, RouterModule } from '@angular/router';
// מייבא את Router לניווט בין דפים ואת RouterModule לשימוש ב-router בקומפוננטה

import { FormsModule } from '@angular/forms';
// מייבא מודול שמאפשר עבודה עם טפסים ו-ngModel

import { CommonModule } from '@angular/common';
// מייבא מודול בסיסי שמכיל דירקטיבות כמו ngIf ו-ngFor

import { AuthService } from '../../services/auth.service';
// מייבא את שירות האימות שאחראי על רישום, בדיקת משתמשים וכו'

@Component({
  selector: 'app-register',
// שם הסלקטור של הקומפוננטה לשימוש ב-HTML

  standalone: true,
// מציין שזו קומפוננטה עצמאית שלא תלויה ב-NgModule

  imports: [CommonModule, FormsModule, RouterModule],
// מגדיר אילו מודולים זמינים בתוך הקומפוננטה

  templateUrl: './register.component.html',
// קובץ ה-HTML של הקומפוננטה

  styleUrls: ['./register.component.css']
// קובץ ה-CSS של הקומפוננטה
})
export class RegisterComponent {
// מחלקת הקומפוננטה

  private authService = inject(AuthService);
// הזרקת שירות האימות כדי להשתמש בפונקציות רישום ובדיקת משתמש

  private router = inject(Router);
// הזרקת שירות ניווט כדי להעביר את המשתמש בין דפים

  username = '';
// משתנה שמחזיק את שם המשתמש מהטופס

  password = '';
// משתנה שמחזיק את הסיסמה

  verifyPassword = '';
// משתנה שמחזיק את אימות הסיסמה (שדה חזרה)

  errorMessage = '';
// משתנה להצגת הודעות שגיאה למשתמש

  onSubmit(): void {
// פונקציה שמופעלת כאשר שולחים את טופס ההרשמה

    if (this.password !== this.verifyPassword) {
// בודק אם הסיסמה ושדה האימות אינם תואמים

      this.errorMessage = 'הסיסמאות אינן תואמות';
// מציג הודעת שגיאה

      return;
// מפסיק את המשך הפעולה
    }

    this.authService.checkUserExists(this.username).subscribe({
// בודק מול השרת האם המשתמש כבר קיים במערכת

      next: (exists) => {
// מתבצע כאשר מתקבלת תשובה מהשרת

        if (exists) {
// אם המשתמש כבר קיים

          this.errorMessage = 'שם המשתמש כבר קיים במערכת';
// מציג הודעת שגיאה מתאימה
        } else {
// אם המשתמש לא קיים

          this.authService.register(this.username, this.password).subscribe({
// קורא לפונקציית רישום כדי ליצור משתמש חדש

            next: () => this.router.navigate(['/home']),
// אם הרישום הצליח – מעביר לדף הבית

            error: () => this.errorMessage = 'שגיאה ברישום'
// אם הייתה שגיאה – מציג הודעת שגיאה
          });
        }
      }
    });
  }
}