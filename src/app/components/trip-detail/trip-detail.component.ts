//אני
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// מייבא Component, OnInit, inject להזרקת תלויות,
// ואת ChangeDetectorRef לשליטה ידנית בזיהוי שינויים

import { ActivatedRoute, Router } from '@angular/router';
// ActivatedRoute לקריאת פרמטרים מה-URL
// Router לניווט בין דפים

import { CommonModule } from '@angular/common';
// מודול בסיסי עם דירקטיבות כמו ngIf ו-ngFor

import { FormsModule } from '@angular/forms';
// מאפשר שימוש ב-ngModel ובטפסים

import { TripsService } from '../../services/trips.service';
// שירות לשליפת נתוני טיולים

import { BookingsService } from '../../services/bookings.service';
// שירות לניהול הזמנות

import { AuthService } from '../../services/auth.service';
// שירות לניהול משתמש מחובר

import { NotificationService } from '../../services/notification.service';
// שירות להצגת הודעות ואישורי ביטול

import { Trip } from '../../models/trip.model';
// מודל (טיפוס) של טיול

import { Booking } from '../../models/booking.model';
// מודל (טיפוס) של הזמנה

@Component({
  selector: 'app-trip-detail',
// סלקטור של הקומפוננטה


  imports: [CommonModule, FormsModule],
// מודולים זמינים לקומפוננטה

  templateUrl: './trip-detail.component.html',
// קובץ ה-HTML

  styleUrls: ['./trip-detail.component.css']
// קובץ ה-CSS
})
export class TripDetailComponent implements OnInit {
// מחלקת הקומפוננטה שמממשת OnInit

  private route = inject(ActivatedRoute);
// מאפשר לקרוא את הפרמטרים מהכתובת (URL)

  private router = inject(Router);
// מאפשר ניווט בין דפים

  private tripsService = inject(TripsService);
// הזרקת שירות טיולים

  private bookingsService = inject(BookingsService);
// הזרקת שירות הזמנות

  private authService = inject(AuthService);
// הזרקת שירות משתמש

  private notificationService = inject(NotificationService);
// הזרקת שירות התראות

  private cdr = inject(ChangeDetectorRef);
// שליטה ידנית ברענון התצוגה

  trip: Trip | null = null;
// מחזיק את פרטי הטיול הנוכחי

  numberOfPeople = 1;
// מספר המשתתפים שהמשתמש בוחר להזמין

  totalRegistered = 0;
// מספר כולל של אנשים שנרשמו לטיול

  isAlreadyBooked = false;
// מציין אם המשתמש כבר רשום לטיול

  currentBookingId: string | null = null;
// שומר את מזהה ההזמנה של המשתמש (אם קיימת)

  ngOnInit(): void {
// רץ אוטומטית כשהקומפוננטה נטענת

    const id = this.route.snapshot.paramMap.get('id');
// שולף את ה-id של הטיול מה-URL

    if (id) {
// אם קיים id

      this.loadTrip(id);
// טוען את פרטי הטיול

      this.checkBookingStatus(id);
// בודק אם המשתמש כבר רשום לטיול
    }
  }

  loadTrip(id: string): void {
// טוען את פרטי הטיול מהשרת

    this.tripsService.getTrip(id).subscribe(trip => {
// בקשה לשרת לקבלת הטיול לפי id

      this.trip = trip;
// שומר את הטיול במשתנה

      this.calculateTotalRegistered(id);
// מחשב כמה אנשים רשומים לטיול

      this.cdr.detectChanges();
// מרענן תצוגה ידנית
    });
  }

  calculateTotalRegistered(tripId: string): void {
// מחשב סה"כ משתתפים בטיול

    this.bookingsService.getBookings().subscribe(bookings => {
// שולף את כל ההזמנות

      this.totalRegistered = bookings.filter(b => b.tripId === tripId)
// מסנן רק הזמנות של הטיול הנוכחי
        .reduce((sum, b) => sum + b.people, 0);
// מסכם את מספר המשתתפים

      this.cdr.detectChanges();
// מרענן תצוגה
    });
  }

  checkBookingStatus(tripId: string): void {
// בודק אם המשתמש כבר רשום לטיול

    const userId = this.authService.getCurrentUser()?.id;
// שולף את ה-id של המשתמש המחובר

    if (!userId) return;
// אם אין משתמש מחובר – מפסיק

    this.bookingsService.getBookings().subscribe(bookings => {
// שולף את כל ההזמנות

      const userBooking = bookings.find(b => 
        b.userId === String(userId) && b.tripId === tripId);
// מחפש הזמנה ששייכת למשתמש ולטיול הזה

      if (userBooking) {
// אם נמצאה הזמנה

        this.isAlreadyBooked = true;
// מסמן שהמשתמש כבר רשום

        this.currentBookingId = userBooking.id || null;
// שומר את מזהה ההזמנה
      }

      this.cdr.detectChanges();
// מרענן תצוגה
    });
  }

  bookTrip(): void {
// מבצע הרשמה לטיול

    const userId = this.authService.getCurrentUser()?.id;
// שולף id של המשתמש

    if (!userId || !this.trip?.id) return;
// אם אין משתמש או טיול – מפסיק

    const booking: Booking = {
// יוצר אובייקט הזמנה חדש

      userId: String(userId),
// מזהה המשתמש

      tripId: String(this.trip.id),
// מזהה הטיול

      people: this.numberOfPeople
// מספר משתתפים
    };

    this.bookingsService.addBooking(booking).subscribe(() => {
// שולח את ההזמנה לשרת

      this.router.navigate(['/home/my-trips']);
// לאחר הצלחה – עובר לדף "הטיולים שלי"
    });
  }

  async cancelBooking(): Promise<void> {
// ביטול הרשמה (פונקציה אסינכרונית)

    if (!this.currentBookingId) return;
// אם אין מזהה הזמנה – מפסיק

    const confirmed = await this.notificationService.confirm('האם אתה בטוח שברצונך לבטל את ההרשמה?');
// מציג חלון אישור ומחכה לתשובה

    if (!confirmed) return;
// אם המשתמש ביטל – מפסיק

    this.bookingsService.deleteBooking(this.currentBookingId).subscribe(() => {
// מוחק את ההזמנה מהשרת

      this.notificationService.show('ההרשמה בוטלה בהצלחה', 'success');
// מציג הודעת הצלחה

      this.router.navigate(['/home/my-trips']);
// חוזר לדף "הטיולים שלי"
    });
  }

  goBack(): void {
// חזרה לרשימת כל הטיולים

    this.router.navigate(['/home/trips-all']);
// ניווט לעמוד כל הטיולים
  }
}