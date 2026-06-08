import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';

// @Injectable - דקורטור שמגדיר את המחלקה כשירות שניתן להזריק אותו לקומפוננטות
// providedIn: 'root' - אומר שהשירות הוא Singleton (קיים עותק אחד שלו בכל האפליקציה)
@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  // הזרקת שירות ה-HttpClient לביצוע בקשות רשת לשרת
  private http = inject(HttpClient);
  
  // כתובת ה-API של ההזמנות בשרת המקומי
  private apiUrl = 'http://localhost:3000/bookings';

  // שליפת כל ההזמנות מהשרת. מחזיר Observable כי זו פעולה אסינכרונית
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  // שליפת הזמנות ספציפיות לפי מזהה משתמש באמצעות Query Parameter (?userId=...)
  getUserBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // הוספת הזמנה חדשה
  addBooking(booking: Booking): Observable<Booking> {
    // יצירת אובייקט חדש הכולל את נתוני ההזמנה ומזהה (ID) ייחודי שנוצר רנדומלית
    // שימוש ב-Spread Operator (...) כדי להעתיק את כל השדות הקיימים
    const bookingWithId = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9)
    };
    // שליחת בקשת POST לשרת עם האובייקט החדש
    return this.http.post<Booking>(this.apiUrl, bookingWithId);
  }

  // מחיקת הזמנה לפי ה-ID שלה מה-URL
  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // פונקציית עזר לבדיקה האם משתמש מסוים כבר רשום לטיול מסוים
  // משתמשת בסינון כפול בשרת כדי לייעל את הבקשה
  getBookingByUserAndTrip(userId: string, tripId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}?userId=${userId}&tripId=${tripId}`);
  }
}