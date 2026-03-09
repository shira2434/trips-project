//אני

import { Injectable, inject } from '@angular/core';
// מייבא את Injectable כדי להגדיר Service באנגולר
// ואת inject כדי להזריק תלויות (Dependency Injection)

import { HttpClient } from '@angular/common/http';
// מאפשר לבצע בקשות HTTP לשרת (GET, POST וכו')

import { BehaviorSubject, Observable, map } from 'rxjs';
// Observable – זרם נתונים אסינכרוני
// BehaviorSubject – Observable ששומר את הערך האחרון
// map – אופרטור שמאפשר לעבד נתונים שמגיעים מהשרת

import { User } from '../models/user.model';
// ייבוא מודל המשתמש שמגדיר את מבנה הנתונים של משתמש

@Injectable({
  providedIn: 'root'
})
// מציין שהשירות זמין בכל האפליקציה (Singleton)
export class AuthService {

  private http = inject(HttpClient);
  // הזרקת HttpClient כדי לבצע בקשות לשרת

  private apiUrl = 'http://localhost:3000/users';
  // כתובת ה-API שממנה נשלפים המשתמשים

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  // BehaviorSubject ששומר את המשתמש המחובר כרגע
  // מאתחל אותו לפי מה ששמור ב-localStorage

  public currentUser$ = this.currentUserSubject.asObservable();
  // הופך את BehaviorSubject ל-Observable לקריאה בלבד
  // קומפוננטות יכולות להאזין לשינויים במשתמש המחובר

  private getUserFromStorage(): User | null {
  // פונקציה פרטית שמביאה את המשתמש מהזיכרון המקומי של הדפדפן

    const user = localStorage.getItem('currentUser');
    // מנסה לקרוא את המשתמש ששמור ב-localStorage

    return user ? JSON.parse(user) : null;
    // אם נמצא משתמש – ממיר מ-JSON לאובייקט
    // אחרת מחזיר null
  }

  private saveUserToStorage(user: User): void {
  // שומר את המשתמש ב-localStorage

    localStorage.setItem('currentUser', JSON.stringify(user));
    // ממיר את המשתמש ל-JSON ושומר בדפדפן
  }

  private removeUserFromStorage(): void {
  // מוחק את המשתמש מה-localStorage

    localStorage.removeItem('currentUser');
  }

  login(name: string, password: string): Observable<User | null> {
  // פונקציה להתחברות משתמש
  // מחזירה Observable שיחזיר משתמש אם הצליח או null אם לא

    return this.http.get<User[]>(`${this.apiUrl}?name=${name}`).pipe(
    // שולח בקשת GET לשרת כדי למצוא משתמש לפי שם

      map(users => {
      // מעבד את הרשימה שהתקבלה מהשרת

        const user = users.find(u => u.password === password);
        // מחפש משתמש עם הסיסמה המתאימה

        if (user) {
          this.saveUserToStorage(user);
          // שומר את המשתמש ב-localStorage

          this.currentUserSubject.next(user);
          // מעדכן את BehaviorSubject במשתמש המחובר

          return user;
          // מחזיר את המשתמש
        }

        return null;
        // אם הסיסמה לא נכונה מחזיר null
      })
    );
  }

  register(name: string, password: string): Observable<User> {
  // פונקציה להרשמת משתמש חדש

    const newUser: User = { name, password, isAdmin: false };
    // יוצר אובייקט משתמש חדש (ברירת מחדל לא מנהל)

    return this.http.post<User>(this.apiUrl, newUser).pipe(
    // שולח בקשת POST לשרת כדי לשמור את המשתמש

      map(user => {

        this.saveUserToStorage(user);
        // שומר את המשתמש החדש ב-localStorage

        this.currentUserSubject.next(user);
        // מעדכן שהמשתמש החדש מחובר

        return user;
        // מחזיר את המשתמש שנוצר
      })
    );
  }

  logout(): void {
  // פונקציה להתנתקות

    this.removeUserFromStorage();
    // מוחק את המשתמש מה-localStorage

    this.currentUserSubject.next(null);
    // מעדכן שאין משתמש מחובר
  }

  getCurrentUser(): User | null {
  // מחזיר את המשתמש המחובר כרגע

    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
  // בודק אם יש משתמש מחובר

    return this.currentUserSubject.value !== null;
  }

  checkUserExists(name: string): Observable<boolean> {
  // בודק אם כבר קיים משתמש עם השם הזה

    return this.http.get<User[]>(`${this.apiUrl}?name=${name}`).pipe(
    // מבצע חיפוש משתמשים לפי שם

      map(users => users.length > 0)
      // אם נמצא לפחות משתמש אחד – מחזיר true
    );
  }
}