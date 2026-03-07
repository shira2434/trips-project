import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// מייבא Component, OnInit, inject להזרקת תלויות,
// ואת ChangeDetectorRef לשליטה ידנית בזיהוי שינויים

import { Router } from '@angular/router';
// Router לניווט בין דפים

import { CommonModule } from '@angular/common';
// מודול בסיסי עם דירקטיבות כמו ngIf ו-ngFor

import { FormsModule } from '@angular/forms';
// מאפשר עבודה עם טפסים ו-ngModel

import { TripsService } from '../../services/trips.service';
// שירות לשליפת, הוספת, עדכון ומחיקת טיולים

import { BookingsService } from '../../services/bookings.service';
// שירות לניהול הזמנות

import { AuthService } from '../../services/auth.service';
// שירות לניהול המשתמש המחובר

import { NotificationService } from '../../services/notification.service';
// שירות להצגת הודעות ואישורי פעולה

import { Trip } from '../../models/trip.model';
// מודל (טיפוס) של טיול

import { User } from '../../models/user.model';
// מודל (טיפוס) של משתמש

@Component({
  selector: 'app-trips-all',
// סלקטור של הקומפוננטה

  standalone: true,
// קומפוננטה עצמאית

  imports: [CommonModule, FormsModule],
// מודולים זמינים לקומפוננטה

  templateUrl: './trips-all.component.html',
// קובץ ה-HTML

  styleUrls: ['./trips-all.component.css']
// קובץ ה-CSS
})
export class TripsAllComponent implements OnInit {
// מחלקת הקומפוננטה שמממשת OnInit

  private tripsService = inject(TripsService);
// הזרקת שירות טיולים

  private bookingsService = inject(BookingsService);
// הזרקת שירות הזמנות

  private authService = inject(AuthService);
// הזרקת שירות משתמש

  private notificationService = inject(NotificationService);
// הזרקת שירות התראות

  private router = inject(Router);
// הזרקת שירות ניווט

  private cdr = inject(ChangeDetectorRef);
// שליטה ידנית ברענון תצוגה

  trips: Trip[] = [];
// מערך שמכיל את כל הטיולים

  currentUser: User | null = null;
// המשתמש המחובר

  showAddForm = false;
// קובע אם להציג את טופס הוספת טיול

  loading = true;
// מציין אם הנתונים בטעינה

  newTrip: Trip = {
// אובייקט טיול חדש (לטופס הוספה)

    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    price: 0,
    description: '',
    image: ''
  };

  ngOnInit(): void {
// רץ כשהקומפוננטה נטענת

    this.currentUser = this.authService.getCurrentUser();
// שומר את המשתמש המחובר

    this.loadTrips();
// טוען את רשימת הטיולים
  }

  loadTrips(): void {
// פונקציה לשליפת כל הטיולים

    this.loading = true;
// מפעיל מצב טעינה

    this.tripsService.getTrips().subscribe({
// בקשה לשרת לקבלת כל הטיולים

      next: (trips) => {
// במקרה של הצלחה

        this.trips = trips;
// שומר את הטיולים במערך

        this.loading = false;
// מבטל מצב טעינה

        this.cdr.detectChanges();
// מרענן תצוגה
      },

      error: (error) => {
// במקרה של שגיאה

        console.error('Error loading trips:', error);
// מדפיס שגיאה לקונסול

        this.loading = false;
// מבטל מצב טעינה

        this.cdr.detectChanges();
// מרענן תצוגה
      }
    });
  }

  isAdmin(): boolean {
// בודק אם המשתמש הוא מנהל מערכת

    return this.currentUser?.isAdmin || false;
// מחזיר true אם המשתמש מנהל, אחרת false
  }

  addTrip(): void {
// הוספת טיול חדש

    this.tripsService.addTrip(this.newTrip).subscribe(() => {
// שולח את הטיול לשרת

      this.loadTrips();
// טוען מחדש את הרשימה

      this.showAddForm = false;
// מסתיר את טופס ההוספה

      this.resetForm();
// מאפס את הטופס
    });
  }

  editTrip(trip: Trip): void {
// מעבר למסך עריכת טיול

    this.router.navigate(['/home/trip-edit', trip.id]);
// ניווט עם מזהה הטיול
  }

  async deleteTrip(id: string): Promise<void> {
// מחיקת טיול (פונקציה אסינכרונית)

    this.bookingsService.getBookings().subscribe(async bookings => {
// שולף את כל ההזמנות

      const hasBookings = bookings.some(b => b.tripId === id);
// בודק אם קיימות הזמנות לטיול

      if (hasBookings) {
// אם יש נרשמים

        this.notificationService.show('לא ניתן למחוק טיול שיש לו נרשמים', 'error');
// מציג הודעת שגיאה
      } else {
// אם אין נרשמים

        const confirmed = await this.notificationService.confirm('האם אתה בטוח שברצונך למחוק את הטיול?');
// מציג חלון אישור

        if (confirmed) {
// אם המשתמש אישר

          this.tripsService.deleteTrip(id).subscribe(() => {
// מוחק את הטיול מהשרת

            this.notificationService.show('הטיול נמחק בהצלחה', 'success');
// מציג הודעת הצלחה

            this.loadTrips();
// טוען מחדש את הרשימה
          });
        }
      }
    });
  }

  viewTrip(id: string): void {
// מעבר למסך פרטי טיול

    this.router.navigate(['/home/trip', id]);
// ניווט עם מזהה הטיול
  }

  resetForm(): void {
// איפוס טופס הוספת טיול

    this.newTrip = {
// יצירת אובייקט ריק חדש

      name: '',
      destination: '',
      startDate: '',
      endDate: '',
      price: 0,
      description: '',
      image: ''
    };
  }
}