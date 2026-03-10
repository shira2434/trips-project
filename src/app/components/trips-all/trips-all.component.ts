//אני
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// Component – להגדרת קומפוננטה באנגולר
// OnInit – מאפשר להריץ קוד כשהקומפוננטה נטענת
// inject – להזרקת שירותים
// ChangeDetectorRef – מאפשר רענון ידני של התצוגה

import { Router } from '@angular/router';
// Router – מאפשר מעבר בין דפים באפליקציה

import { CommonModule } from '@angular/common';
// מודול בסיסי עם דירקטיבות כמו ngIf ו-ngFor

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// FormGroup ו-FormControl – ליצירת טפסים ריאקטיביים
// Validators – בדיקות תקינות לשדות בטופס

import { TripsService } from '../../services/trips.service';
// שירות שמטפל בשליפת טיולים מהשרת

import { BookingsService } from '../../services/bookings.service';
// שירות שמטפל בהזמנות של משתמשים

import { AuthService } from '../../services/auth.service';
// שירות שמנהל את המשתמש המחובר

import { NotificationService } from '../../services/notification.service';
// שירות שמציג הודעות למשתמש (שגיאה / הצלחה / אישור)

import { Trip } from '../../models/trip.model';
// מודל שמגדיר את מבנה הנתונים של טיול

import { User } from '../../models/user.model';
// מודל שמגדיר את מבנה הנתונים של משתמש

@Component({
  selector: 'app-trips-all',
  // שם הסלקטור של הקומפוננטה לשימוש ב-HTML

  
  imports: [CommonModule, ReactiveFormsModule],
  // מודולים שניתן להשתמש בהם בתוך הקומפוננטה

  templateUrl: './trips-all.component.html',
  // קובץ ה-HTML של הקומפוננטה

  styleUrls: ['./trips-all.component.css']
  // קובץ ה-CSS של הקומפוננטה
})
export class TripsAllComponent implements OnInit {

  private tripsService = inject(TripsService);
  // הזרקת שירות טיולים

  private bookingsService = inject(BookingsService);
  // הזרקת שירות הזמנות

  private authService = inject(AuthService);
  // הזרקת שירות משתמשים

  private notificationService = inject(NotificationService);
  // הזרקת שירות הודעות למשתמש

  private router = inject(Router);
  // הזרקת שירות ניווט

  private cdr = inject(ChangeDetectorRef);
  // מנגנון לזיהוי שינויים ורענון התצוגה

  trips: Trip[] = [];
  // מערך שמכיל את כל הטיולים

  currentUser: User | null = null;
  // המשתמש המחובר כרגע

  showAddForm = false;
  // קובע אם להציג את טופס הוספת הטיול

  loading = true;
  // מציין אם הנתונים עדיין נטענים

  tripForm = new FormGroup({
  // יצירת טופס ריאקטיבי להוספת טיול חדש

    name: new FormControl('', [Validators.required]),
    // שם הטיול – שדה חובה

    destination: new FormControl('', [Validators.required]),
    // יעד הטיול – שדה חובה

    startDate: new FormControl('', [Validators.required]),
    // תאריך התחלה – שדה חובה

    endDate: new FormControl('', [Validators.required]),
    // תאריך סיום – שדה חובה

    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    // מחיר – חובה ולא יכול להיות קטן מ-0

    description: new FormControl('', [Validators.required]),
    // תיאור הטיול – שדה חובה

    image: new FormControl('', [Validators.required])
    // קישור לתמונה – שדה חובה
  });

  ngOnInit(): void {
  // פונקציה שרצה אוטומטית כשהקומפוננטה נטענת

    this.currentUser = this.authService.getCurrentUser();
    // מביא את המשתמש המחובר

    this.loadTrips();
    // טוען את כל הטיולים מהשרת
  }

  loadTrips(): void {
  // פונקציה שטוענת את רשימת הטיולים

    this.loading = true;
    // מציין שהטעינה התחילה

    this.tripsService.getTrips().subscribe({
      next: (trips) => {
        this.trips = trips;
        // שומר את רשימת הטיולים

        this.loading = false;
        // מסמן שהטעינה הסתיימה

        this.cdr.detectChanges();
        // רענון התצוגה
      },

      error: (error) => {
        console.error('Error loading trips:', error);
        // מדפיס שגיאה אם קרתה בעיה

        this.loading = false;
        // מסמן שהטעינה הסתיימה גם במקרה של שגיאה

        this.cdr.detectChanges();
        // רענון התצוגה
      }
    });
  }

  isAdmin(): boolean {
  // פונקציה שבודקת אם המשתמש הוא מנהל

    return this.currentUser?.isAdmin || false;
    // אם המשתמש מנהל מחזיר true
  }

  addTrip(): void {
  // פונקציה להוספת טיול חדש

    if (this.tripForm.valid) {
      // בודק אם כל השדות בטופס תקינים

      const newTrip: Trip = this.tripForm.value as Trip;
      // יוצר אובייקט טיול מהנתונים בטופס

      this.tripsService.addTrip(newTrip).subscribe(() => {
        this.loadTrips();
        // טוען מחדש את רשימת הטיולים

        this.showAddForm = false;
        // סוגר את טופס ההוספה

        this.tripForm.reset({ price: 0 });
        // מאפס את הטופס
      });

    } else {
      this.tripForm.markAllAsTouched();
      // מסמן את כל השדות כדי להציג הודעות שגיאה
    }
  }

  editTrip(trip: Trip): void {
  // פונקציה לעריכת טיול

    this.router.navigate(['/home/trip-edit', trip.id]);
    // מעביר לדף עריכת הטיול לפי ה-id
  }

  async deleteTrip(id: string): Promise<void> {
  // פונקציה למחיקת טיול

    this.bookingsService.getBookings().subscribe(async bookings => {

      const hasBookings = bookings.some(b => b.tripId === id);
      // בודק אם יש הזמנות לטיול

      if (hasBookings) {

        this.notificationService.show('לא ניתן למחוק טיול שיש לו נרשמים', 'error');
        // מציג הודעת שגיאה אם יש משתמשים שנרשמו לטיול

      } else {

        const confirmed = await this.notificationService.confirm('האם אתה בטוח שברצונך למחוק את הטיול?');
        // מבקש אישור מהמשתמש למחיקה

        if (confirmed) {

          this.tripsService.deleteTrip(id).subscribe(() => {

            this.notificationService.show('הטיול נמחק בהצלחה', 'success');
            // מציג הודעת הצלחה

            this.loadTrips();
            // טוען מחדש את רשימת הטיולים
          });

        }
      }
    });
  }

  viewTrip(id: string): void {
  // פונקציה לצפייה בפרטי טיול

    this.router.navigate(['/home/trip', id]);
    // מעביר לדף פרטי הטיול לפי id
  }
}