//אני
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/bookings';

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getUserBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addBooking(booking: Booking): Observable<Booking> {
    const bookingWithId = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9)
    };
    return this.http.post<Booking>(this.apiUrl, bookingWithId);
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBookingByUserAndTrip(userId: string, tripId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}?userId=${userId}&tripId=${tripId}`);
  }
}
