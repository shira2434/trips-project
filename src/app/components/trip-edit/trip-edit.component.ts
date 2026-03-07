import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// מייבא Component, OnInit, inject להזרקת תלויות,
// ואת ChangeDetectorRef לשליטה ידנית בזיהוי שינויים

import { ActivatedRoute, Router } from '@angular/router';
// ActivatedRoute לקריאת פרמטרים מה-URL
// Router לניווט בין דפים

import { CommonModule } from '@angular/common';
// מודול בסיסי עם דירקטיבות כמו ngIf ו-ngFor

import { FormsModule } from '@angular/forms';
// מאפשר עבודה עם טפסים ו-ngModel

import { TripsService } from '../../services/trips.service';
// שירות שאחראי על שליפת ועדכון טיולים

import { BookingsService } from '../../services/bookings.service';
// שירות שאחראי על שליפת הזמנות

import { NotificationService } from '../../services/notification.service';
// שירות להצגת הודעות למשתמש (שגיאה/הצלחה)

import { Trip } from '../../models/trip.model';
// מודל (טיפוס) של טיול

@Component({
  selector: 'app-trip-edit',
// סלקטור של הקומפוננטה

  standalone: true,
// קומפוננטה עצמאית

  imports: [CommonModule, FormsModule],
// מודולים זמינים לקומפוננטה

  templateUrl: './trip-edit.component.html',
// קובץ ה-HTML של הקומפוננטה

  styleUrls: ['./trip-edit.component.css']
// קובץ ה-CSS של הקומפוננטה
})
export class TripEditComponent implements OnInit {
// מחלקת הקומפוננטה שמממשת OnInit

  private route = inject(ActivatedRoute);
// מאפשר לקרוא את ה-id מה-URL

  private router = inject(Router);
// מאפשר ניווט בין דפים

  private tripsService = inject(TripsService);
// הזרקת שירות טיולים

  private bookingsService = inject(BookingsService);
// הזרקת שירות הזמנות

  private notificationService = inject(NotificationService);
// הזרקת שירות התראות

  private cdr = inject(ChangeDetectorRef);
// שליטה ידנית ברענון התצוגה

  trip: Trip = {
// אובייקט טיול שמאותחל עם ערכים ריקים (לטופס)

    name: '',
// שם הטיול

    destination: '',
// יעד הטיול

    startDate: '',
// תאריך התחלה

    endDate: '',
// תאריך סיום

    price: 0,
// מחיר

    description: '',
// תיאור הטיול

    image: ''
// קישור לתמונה
  };

  ngOnInit(): void {
// רץ כשהקומפוננטה נטענת

    const id = this.route.snapshot.paramMap.get('id');
// שולף את מזהה הטיול מהכתובת

    if (id) {
// אם קיים id

      this.loadTrip(id);
// טוען את פרטי הטיול מהשרת
    }
  }

  loadTrip(id: string): void {
// פונקציה לשליפת טיול לפי id

    this.tripsService.getTrip(id).subscribe(trip => {
// בקשה לשרת לקבלת הטיול

      this.trip = trip;
// שומר את הנתונים בטופס

      this.cdr.detectChanges();
// מרענן תצוגה ידנית
    });
  }

  updateTrip(): void {
// פונקציה לעדכון הטיול

    if (!this.trip.id) return;
// אם אין מזהה לטיול – מפסיק

    this.bookingsService.getBookings().subscribe(bookings => {
// שולף את כל ההזמנות

      const hasBookings = bookings.some(b => b.tripId === this.trip.id);
// בודק אם קיימות הזמנות לטיול הזה

      if (hasBookings) {
// אם יש נרשמים

        this.notificationService.show('לא ניתן לערוך טיול שיש לו נרשמים', 'error');
// מציג הודעת שגיאה
      } else if (this.trip.id) {
// אם אין נרשמים

        this.tripsService.updateTrip(this.trip.id, this.trip).subscribe(() => {
// שולח בקשת עדכון לשרת

          this.notificationService.show('הטיול עודכן בהצלחה', 'success');
// מציג הודעת הצלחה

          this.router.navigate(['/home/trips-all']);
// חוזר לרשימת כל הטיולים
        });
      }
    });
  }

  cancel(): void {
// פונקציה לביטול העריכה

    this.router.navigate(['/home/trips-all']);
// חוזר לרשימת כל הטיולים ללא שמירה
  }
}