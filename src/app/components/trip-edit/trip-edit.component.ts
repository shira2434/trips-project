import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripsService } from '../../services/trips.service';
import { BookingsService } from '../../services/bookings.service';
import { NotificationService } from '../../services/notification.service';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.css']
})
export class TripEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripsService = inject(TripsService);
  private bookingsService = inject(BookingsService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  tripId: string | null = null;

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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tripId = id;
      this.loadTrip(id);
    }
  }

  loadTrip(id: string): void {
    this.tripsService.getTrip(id).subscribe(trip => {
      this.tripForm.patchValue({
        name: trip.name,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        price: trip.price,
        description: trip.description,
        image: trip.image
      });
      this.cdr.detectChanges();
    });
  }

  updateTrip(): void {
    if (!this.tripId) return;

    if (this.tripForm.valid) {
      this.bookingsService.getBookings().subscribe(bookings => {
        const hasBookings = bookings.some(b => b.tripId === this.tripId);
        if (hasBookings) {
          this.notificationService.show('לא ניתן לערוך טיול שיש לו נרשמים', 'error');
        } else if (this.tripId) {
          const updatedTrip: Trip = {
            id: this.tripId,
            ...this.tripForm.value as Trip
          };
          this.tripsService.updateTrip(this.tripId, updatedTrip).subscribe(() => {
            this.notificationService.show('הטיול עודכן בהצלחה', 'success');
            this.router.navigate(['/home/trips-all']);
          });
        }
      });
    } else {
      this.tripForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/home/trips-all']);
  }
}
