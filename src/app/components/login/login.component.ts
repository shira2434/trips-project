import { Component, inject } from '@angular/core'; 
// מייבא את הדקורטור Component ואת הפונקציה inject להזרקת תלויות

import { Router, RouterModule } from '@angular/router'; 
// מייבא את Router לניווט בין דפים ואת RouterModule לשימוש ב-router בקומפוננטה

import { FormsModule } from '@angular/forms'; 
// מייבא מודול שמאפשר שימוש ב-ngModel וטפסים מבוססי Template

import { CommonModule } from '@angular/common'; 
// מייבא מודול בסיסי שמכיל דירקטיבות כמו ngIf ו-ngFor

import { AuthService } from '../../services/auth.service'; 
// מייבא את שירות האימות שאחראי על התחברות וניהול משתמשים

@Component({
  selector: 'app-login', 
  // שם הסלקטור של הקומפוננטה לשימוש ב-HTML

  standalone: true, 
  // מציין שזו קומפוננטה עצמאית שלא תלויה ב-NgModule

  imports: [CommonModule, FormsModule, RouterModule],
  // מגדיר אילו מודולים זמינים בתוך הקומפוננטה

  templateUrl: './login.component.html', 
  // קובץ ה-HTML של הקומפוננטה

  styleUrls: ['./login.component.css']
  // קובץ ה-CSS של הקומפוננטה
})
export class LoginComponent { 
// מחלקת הקומפוננטה

  private authService = inject(AuthService); 
  // הזרקת שירות האימות כדי להשתמש בפונקציות התחברות

  private router = inject(Router); 
  // הזרקת שירות הניווט כדי לעבור בין דפים

  username = ''; 
  // משתנה שמחזיק את שם המשתמש מהטופס

  password = ''; 
  // משתנה שמחזיק את הסיסמה מהטופס

  errorMessage = ''; 
  // משתנה להצגת הודעת שגיאה למשתמש

  onSubmit(): void { 
  // פונקציה שמופעלת כאשר שולחים את הטופס

    if (!this.username || !this.password) { 
      // בדיקה אם אחד מהשדות ריק

      this.errorMessage = 'נא למלא את כל השדות'; 
      // מציג הודעת שגיאה אם חסר מידע

      return; 
      // עוצר את המשך הפעולה
    }

    this.authService.login(this.username.trim(), this.password.trim()).subscribe({
    // קורא לפונקציית login בשירות ושולח את הערכים (לאחר הסרת רווחים מיותרים)
    // subscribe מאזין לתוצאה שמגיעה מהשרת (Observable)

      next: (user) => { 
      // מתבצע אם הבקשה הצליחה והשרת החזיר תשובה

        if (user) { 
          // אם התקבל משתמש (התחברות הצליחה)

          this.router.navigate(['/home']); 
          // מעביר את המשתמש לדף הבית
        } else {
          this.errorMessage = 'שם משתמש או סיסמה שגויים'; 
          // אם לא התקבל משתמש – מציג שגיאה
        }
      },

      error: () => { 
      // מתבצע אם הייתה שגיאה בבקשה לשרת (למשל שרת לא פעיל)

        this.errorMessage = 'שגיאה בהתחברות - ודא שהשרת רץ'; 
        // מציג הודעת שגיאה מתאימה
      }
    });
  }
}