//אני
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// ReactiveFormsModule - המודול שמאפשר לנו לבנות טפסים מבוססי מחלקה (Reactive Forms)
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // הזרקת שירותים: שירות האימות ושירות הניווט
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // משתנה שיחזיק הודעת שגיאה במקרה שההתחברות נכשלת
  errorMessage = '';

  // בניית מבנה הטופס: הגדרת השדות והוולידציות (חוקי אימות) שלהם
  form = new FormGroup({
    // Validators.required אומר שהשדה חובה ולא יכול להישאר ריק
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  // Getters - קיצורי דרך כדי לגשת לשדות הטופס בקלות מתוך ה-HTML
  get username(): FormControl {
    return this.form.controls.username;
  }

  get password(): FormControl {
    return this.form.controls.password;
  }

  // הפונקציה שמתבצעת כשלוחצים על כפתור ה-Submit בטופס
  onSubmit(): void {
    // בדיקה: האם כל השדות בטופס תקינים לפי החוקים שהגדרנו?
    if (this.form.valid) {
      // קריאה לשירות ה-Login עם הנתונים שהמשתמש הזין
      // .trim() מסיר רווחים מיותרים מהתחלה וסוף הטקסט
      this.authService.login(this.form.value.username!.trim(), this.form.value.password!.trim()).subscribe({
        // במקרה של הצלחה (next)
        next: (user) => {
          if (user) {
            // אם המשתמש נמצא במערכת - עבור לדף הבית
            this.router.navigate(['/home']);
          } else {
            // אם השרת החזיר null (משתמש לא קיים)
            this.errorMessage = 'שם משתמש או סיסמה שגויים';
          }
        },
        // במקרה של שגיאת תקשורת עם השרת
        error: () => {
          this.errorMessage = 'שגיאה בהתחברות - ודא שהשרת רץ';
        }
      });
    } else {
      // אם הטופס לא תקין, סמן את כל השדות כ"נגועים" כדי להציג למשתמש הודעות שגיאה אדומות
      this.form.markAllAsTouched();
    }
  }
}