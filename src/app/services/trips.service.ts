import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/trips';

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  getTrip(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  updateTrip(id: string, trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, trip);
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
