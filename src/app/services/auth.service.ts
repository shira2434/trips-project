import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private removeUserFromStorage(): void {
    localStorage.removeItem('currentUser');
  }

  login(name: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?name=${name}`).pipe(
      map(users => {
        const user = users.find(u => u.password === password);
        if (user) {
          this.saveUserToStorage(user);
          this.currentUserSubject.next(user);
          return user;
        }
        return null;
      })
    );
  }

  register(name: string, password: string): Observable<User> {
    const newUser: User = { name, password, isAdmin: false };
    return this.http.post<User>(this.apiUrl, newUser).pipe(
      map(user => {
        this.saveUserToStorage(user);
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    this.removeUserFromStorage();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  checkUserExists(name: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?name=${name}`).pipe(
      map(users => users.length > 0)
    );
  }
}
