import { Component, OnInit, inject } from '@angular/core';
// Component – להגדרת קומפוננטה באנגולר
// OnInit – ממשק שמאפשר להריץ קוד כשהקומפוננטה נטענת
// inject – פונקציה להזרקת שירותים

import { Router, RouterModule } from '@angular/router';
// Router – מאפשר ניווט בין דפים
// RouterModule – מאפשר שימוש ב-routerLink ויכולות ניווט ב-HTML

import { CommonModule } from '@angular/common';
// מודול בסיסי שמכיל דירקטיבות כמו ngIf ו-ngFor

import { AuthService } from '../../services/auth.service';
// שירות שאחראי על ניהול המשתמש המחובר (התחברות, התנתקות וכו')

import { User } from '../../models/user.model';
// מודל שמגדיר את מבנה הנתונים של משתמש

@Component({
  selector: 'app-nav-bar',
  // שם הסלקטור של הקומפוננטה – כך משתמשים בה ב-HTML <app-nav-bar>

  imports: [CommonModule, RouterModule],
  // מגדיר אילו מודולים זמינים בתוך הקומפוננטה

  templateUrl: './nav-bar.component.html',
  // קובץ ה-HTML שמגדיר את התצוגה של הניווט

  styleUrls: ['./nav-bar.component.css']
  // קובץ ה-CSS שמגדיר את העיצוב של הניווט
})
export class NavBarComponent implements OnInit {
// מחלקת הקומפוננטה שמממשת את OnInit

  private authService = inject(AuthService);
  // הזרקת שירות האימות כדי לקבל מידע על המשתמש המחובר

  private router = inject(Router);
  // הזרקת שירות הניווט כדי לעבור בין דפים

  currentUser: User | null = null;
  // משתנה שמחזיק את המשתמש המחובר כרגע
  // אם אין משתמש מחובר הערך יהיה null

  ngOnInit(): void {
  // פונקציה שרצה אוטומטית כשהקומפוננטה נטענת

    this.authService.currentUser$.subscribe(user => {
    // מאזין ל-Observable שמחזיר את המשתמש המחובר

      this.currentUser = user;
      // מעדכן את המשתנה המקומי לפי המשתמש שהתקבל
    });
  }

  logout(): void {
  // פונקציה שמתבצעת כאשר המשתמש לוחץ על כפתור התנתקות

    this.authService.logout();
    // קוראת לפונקציה בשירות שמבצעת התנתקות

    this.router.navigate(['/login']);
    // מעבירה את המשתמש לדף ההתחברות
  }
}