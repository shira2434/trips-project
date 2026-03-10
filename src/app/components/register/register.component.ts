import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  errorMessage = '';

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    verifyPassword: new FormControl('', [Validators.required])
  });

  onSubmit(): void {
    if (this.form.value.password !== this.form.value.verifyPassword) {
      this.errorMessage = 'הסיסמאות אינן תואמות';
      return;
    }

    if (this.form.valid) {
      this.authService.checkUserExists(this.form.value.username!).subscribe({
        next: (exists) => {
          if (exists) {
            this.errorMessage = 'שם המשתמש כבר קיים במערכת';
          } else {
            this.authService.register(this.form.value.username!, this.form.value.password!).subscribe({
              next: () => this.router.navigate(['/home']),
              error: () => this.errorMessage = 'שגיאה ברישום'
            });
          }
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
