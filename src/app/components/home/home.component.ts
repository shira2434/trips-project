import { Component, OnInit, inject } from '@angular/core'; 
// מייבא מ-Angular את הדקורטור Component, הממשק OnInit ואת הפונקציה inject להזרקת תלויות

import { Router, RouterModule } from '@angular/router'; 
// מייבא את Router לניווט בין דפים ואת RouterModule כדי לאפשר שימוש ב-router בקומפוננטה

import { CommonModule } from '@angular/common'; 
// מייבא מודול שמכיל דירקטיבות בסיסיות כמו ngIf ו-ngFor

import { AuthService } from '../../services/auth.service'; 
// מייבא את שירות האימות שאחראי על התחברות, התנתקות וניהול משתמש

import { User } from '../../models/user.model'; 
// מייבא את המודל (טיפוס) של משתמש לצורך טיפוס נתונים

@Component({
  selector: 'app-home', 
  // שם הסלקטור של הקומפוננטה – כך משתמשים בה ב-HTML

  standalone: true, 
  // מציין שזו קומפוננטה עצמאית (לא תלויה ב-NgModule)

  imports: [CommonModule, RouterModule], 
  // מגדיר אילו מודולים זמינים בתוך הקומפוננטה

  templateUrl: './home.component.html', 
  // קובץ ה-HTML של הקומפוננטה

  styleUrls: ['./home.component.css'] 
  // קובץ ה-CSS של הקומפוננטה
})
export class HomeComponent implements OnInit { 
// הגדרת מחלקת הקומפוננטה שמממשת את הממשק OnInit

  private authService = inject(AuthService); 
  // הזרקת שירות האימות כדי להשתמש בפונקציות שלו

  private router = inject(Router); 
  // הזרקת שירות הניווט כדי לאפשר מעבר בין דפים

  currentUser: User | null = null; 
  // משתנה שמחזיק את המשתמש הנוכחי (או null אם אין משתמש מחובר)

  ngOnInit(): void { 
  // מתודה שרצה אוטומטית כאשר הקומפוננטה נטענת

    this.authService.currentUser$.subscribe(user => { 
      // מאזין ל-Observable שמחזיר את המשתמש המחובר

      this.currentUser = user; 
      // מעדכן את המשתנה המקומי לפי המשתמש שהתקבל
    });
  }

  logout(): void { 
  // פונקציה שמתבצעת בעת לחיצה על כפתור התנתקות

    this.authService.logout(); 
    // קוראת לפונקציה בשירות שמבצעת התנתקות

    this.router.navigate(['/login']); 
    // מעבירה את המשתמש לדף ההתחברות
  }

  onActivate(): void { 
  // פונקציה שנקראת כאשר נטען רכיב חדש בתוך router-outlet

    window.scrollTo(0, 0); 
    // מגלילה את המסך לראש הדף (למעלה)
  }
}