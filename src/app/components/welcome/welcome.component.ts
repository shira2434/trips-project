//אני
import { Component, OnInit, inject } from '@angular/core';
// Component – להגדרת קומפוננטה באנגולר
// OnInit – ממשק שמאפשר להריץ קוד כשהקומפוננטה נטענת
// inject – פונקציה להזרקת שירותים

import { CommonModule } from '@angular/common';
// מודול בסיסי שמכיל דירקטיבות כמו ngIf ו-ngFor

import { RouterModule } from '@angular/router';
// מאפשר שימוש ב-routerLink וניווט בין דפים ב-HTML

import { AuthService } from '../../services/auth.service';
// שירות שמנהל את המשתמש המחובר (התחברות, התנתקות וכו')

import { User } from '../../models/user.model';
// מודל שמגדיר את מבנה הנתונים של משתמש

@Component({
  selector: 'app-welcome',
  // שם הסלקטור של הקומפוננטה לשימוש ב-HTML <app-welcome>

  imports: [CommonModule, RouterModule],
  // מודולים זמינים בתוך הקומפוננטה

  templateUrl: './welcome.component.html',
  // קובץ ה-HTML שמגדיר את התצוגה של הקומפוננטה

  styleUrls: ['./welcome.component.css']
  // קובץ ה-CSS שמגדיר את העיצוב של הקומפוננטה
})
export class WelcomeComponent implements OnInit {
// מחלקת הקומפוננטה שמממשת את OnInit

  private authService = inject(AuthService);
  // הזרקת שירות האימות כדי לקבל מידע על המשתמש המחובר

  currentUser: User | null = null;
  // משתנה שמחזיק את המשתמש המחובר כרגע
  // אם אין משתמש מחובר הערך יהיה null

  ngOnInit(): void {
  // פונקציה שרצה אוטומטית כשהקומפוננטה נטענת

    this.currentUser = this.authService.getCurrentUser();
    // מביא את המשתמש המחובר מה-AuthService ושומר במשתנה המקומי
  }
}