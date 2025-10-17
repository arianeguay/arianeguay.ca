import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthUser | null>(null);
  private mockUser = { id: '1', email: 'admin@example.com', role: 'admin' };
  
  // Use signals for reactive state management
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Expose an observable of the authentication state
  isAuthenticated$ = this.authState.pipe(map(state => !!state));
  user$ = this.authState.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing session on startup
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        this.authState.next(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
  }

  login(email: string, password: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    // TODO: Replace with actual authentication against a backend/auth provider
    // This is just a mock implementation
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'password') {
          this.authState.next(this.mockUser);
          localStorage.setItem('auth_user', JSON.stringify(this.mockUser));
          this.isLoading.set(false);
          resolve();
        } else {
          this.error.set('Invalid email or password');
          this.isLoading.set(false);
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  }

  logout() {
    this.authState.next(null);
    localStorage.removeItem('auth_user');
    // Redirect to login happens via the guard
  }

  // Check if user has admin role
  isAdmin() {
    return this.authState.value?.role === 'admin';
  }
}
