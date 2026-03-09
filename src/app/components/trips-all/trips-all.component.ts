import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripsService } from '../../services/trips.service';
import { BookingsService } from '../../services/bookings.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Trip } from '../../models/trip.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-trips-all',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trips-all.component.html',
  styleUrls: ['./trips-all.component.css']
})
export class TripsAllComponent implements OnInit {
  private tripsService = inject(TripsService);
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  trips: Trip[] = [];
  currentUser: User | null = null;
  showAddForm = false;
  loading = true;

  tripForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    destination: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.tripsService.getTrips().subscribe({
      next: (trips) => {
        this.trips = trips;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading trips:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.isAdmin || false;
  }

  addTrip(): void {
    if (this.tripForm.valid) {
      const newTrip: Trip = this.tripForm.value as Trip;
      this.tripsService.addTrip(newTrip).subscribe(() => {
        this.loadTrips();
        this.showAddForm = false;
        this.tripForm.reset({ price: 0 });
      });
    } else {
      this.tripForm.markAllAsTouched();
    }
  }

  editTrip(trip: Trip): void {
    this.router.navigate(['/home/trip-edit', trip.id]);
  }

  async deleteTrip(id: string): Promise<void> {
    this.bookingsService.getBookings().subscribe(async bookings => {
      const hasBookings = bookings.some(b => b.tripId === id);
      if (hasBookings) {
        this.notificationService.show('לא ניתן למחוק טיול שיש לו נרשמים', 'error');
      } else {
        const confirmed = await this.notificationService.confirm('האם אתה בטוח שברצונך למחוק את הטיול?');
        if (confirmed) {
          this.tripsService.deleteTrip(id).subscribe(() => {
            this.notificationService.show('הטיול נמחק בהצלחה', 'success');
            this.loadTrips();
          });
        }
      }
    });
  }

  viewTrip(id: string): void {
    this.router.navigate(['/home/trip', id]);
  }
}
