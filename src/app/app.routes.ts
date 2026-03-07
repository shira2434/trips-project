import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TripsAllComponent } from './components/trips-all/trips-all.component';
import { TripDetailComponent } from './components/trip-detail/trip-detail.component';
import { TripEditComponent } from './components/trip-edit/trip-edit.component';
import { MyTripsComponent } from './components/my-trips/my-trips.component';
import { authGuard } from './guards/auth.guard';

// הגדרת נתיבי הניווט של האפליקציה
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // נתיב ברירת מחדל - הפניה להתחברות
  { path: 'login', component: LoginComponent },              // נתיב התחברות
  { path: 'register', component: RegisterComponent },        // נתיב רישום
  {
    path: 'home',                                           // נתיב הבית - מוגן על ידי authGuard
    component: HomeComponent,
    canActivate: [authGuard],                               // דורש אימות
    children: [
      { path: '', component: WelcomeComponent },                                        // דף ברוכים הבאים
      { path: 'trips-all', component: TripsAllComponent, runGuardsAndResolvers: 'always' },  // כל הטיולים
      { path: 'my-trips', component: MyTripsComponent, runGuardsAndResolvers: 'always' },    // הטיולים שלי
      { path: 'trip/:id', component: TripDetailComponent },                              // פרטי טיול
      { path: 'trip-edit/:id', component: TripEditComponent }                            // עריכת טיול
    ]
  }
];
