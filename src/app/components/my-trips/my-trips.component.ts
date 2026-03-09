import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// מייבא את Component, הממשק OnInit, הפונקציה inject להזרקת תלויות
// ואת ChangeDetectorRef לשליטה ידנית בזיהוי שינויים במסך

import { Router } from '@angular/router';
// מייבא את Router כדי לאפשר ניווט בין דפים

import { CommonModule } from '@angular/common';
// מייבא מודול בסיסי עם דירקטיבות כמו ngIf ו-ngFor

import { TripsService } from '../../services/trips.service';
// מייבא שירות שאחראי על שליפת טיולים מהשרת

import { BookingsService } from '../../services/bookings.service';
// מייבא שירות שאחראי על שליפת הזמנות

import { AuthService } from '../../services/auth.service';
// מייבא שירות שאחראי על ניהול המשתמש המחובר

import { Trip } from '../../models/trip.model';
// מייבא את המודל (טיפוס) של טיול

import { forkJoin } from 'rxjs';
// מייבא פונקציה שמאפשרת להריץ כמה בקשות במקביל ולחכות שכולן יסתיימו

@Component({
  selector: 'app-my-trips',
// שם הסלקטור של הקומפוננטה לשימוש ב-HTML

  //standalone: true,
// מציין שזו קומפוננטה עצמאית

  imports: [CommonModule],
// מגדיר אילו מודולים זמינים בתוך הקומפוננטה

  templateUrl: './my-trips.component.html',
// קובץ ה-HTML של הקומפוננטה

  styleUrls: ['./my-trips.component.css']
// קובץ ה-CSS של הקומפוננטה
})
export class MyTripsComponent implements OnInit {
// מחלקת הקומפוננטה שמממשת את OnInit

  private tripsService = inject(TripsService);
// הזרקת שירות טיולים

  private bookingsService = inject(BookingsService);
// הזרקת שירות הזמנות

  private authService = inject(AuthService);
// הזרקת שירות משתמש

  private router = inject(Router);
// הזרקת שירות ניווט

  private cdr = inject(ChangeDetectorRef);
// הזרקת מנגנון זיהוי שינויים ידני

  myTrips: (Trip & { bookingId: string })[] = [];
// מערך שמכיל טיולים + bookingId (שילוב טיפוס Trip עם שדה נוסף)

  ngOnInit(): void {
// פונקציה שרצה אוטומטית כשהקומפוננטה נטענת

    this.loadMyTrips();
// קוראת לפונקציה שטוענת את הטיולים של המשתמש
  }

  loadMyTrips(): void {
// פונקציה שטוענת את כל הטיולים שהמשתמש הזמין

    const userId = this.authService.getCurrentUser()?.id;
// שולף את ה-id של המשתמש המחובר

    if (!userId) return;
// אם אין משתמש מחובר – מפסיק את הפעולה

    this.bookingsService.getBookings().subscribe(allBookings => {
// שולף את כל ההזמנות מהשרת

      const bookings = allBookings.filter(b => b.userId === String(userId));
// מסנן רק את ההזמנות ששייכות למשתמש הנוכחי

      if (bookings.length === 0) {
// אם אין הזמנות

        this.myTrips = [];
// מאפס את רשימת הטיולים

        this.cdr.detectChanges();
// מכריח רענון תצוגה

        return;
// מפסיק את הפעולה
      }

      const tripRequests = bookings.map(booking =>
        this.tripsService.getTrip(booking.tripId)
      );
// יוצר מערך של בקשות לשליפת פרטי כל טיול לפי ה-tripId שלו

      forkJoin(tripRequests).subscribe(trips => {
// מריץ את כל הבקשות במקביל ומחכה שכולן יסתיימו

        this.myTrips = trips.map((trip, index) => ({
// יוצר מערך חדש של טיולים עם מידע נוסף

          ...trip,
// מעתיק את כל פרטי הטיול

          bookingId: bookings[index].id!
// מוסיף לכל טיול את ה-bookingId שלו
        }));

        this.cdr.detectChanges();
// מכריח רענון תצוגה לאחר עדכון הנתונים
      });
    });
  }

  viewTrip(id: string): void {
// פונקציה שמופעלת כאשר המשתמש רוצה לראות טיול מסוים

    this.router.navigate(['/home/trip', id]);
// מעבירה את המשתמש לדף פרטי הטיול לפי ה-id
  }
}