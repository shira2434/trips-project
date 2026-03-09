import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TripsAllComponent } from './components/trips-all/trips-all.component';
import { TripDetailComponent } from './components/trip-detail/trip-detail.component';
import { TripEditComponent } from './components/trip-edit/trip-edit.component';
import { MyTripsComponent } from './components/my-trips/my-trips.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    component: NavBarComponent,
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'trips-all', component: TripsAllComponent, runGuardsAndResolvers: 'always' },
      { path: 'my-trips', component: MyTripsComponent, runGuardsAndResolvers: 'always' },
      { path: 'trip/:id', component: TripDetailComponent },
      { path: 'trip-edit/:id', component: TripEditComponent }
    ]
  }
];
