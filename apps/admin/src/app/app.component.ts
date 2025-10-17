import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="container">
          <h1 class="app-title">Contentful Admin</h1>
          <nav class="app-nav">
            <ul>
              <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
              <li><a routerLink="/projects" routerLinkActive="active">Projects</a></li>
              <li><a routerLink="/posts" routerLinkActive="active">Posts</a></li>
              <li><a routerLink="/settings" routerLinkActive="active">Settings</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main class="app-content container">
        <router-outlet />
      </main>
      
      <footer class="app-footer">
        <div class="container">
          <p>&copy; 2025 Ariane Guay | Admin Interface</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .app-header {
      background-color: #333;
      color: white;
      padding: 1rem 0;
    }
    
    .app-header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .app-title {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .app-nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 1.5rem;
    }
    
    .app-nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 0;
    }
    
    .app-nav a.active {
      border-bottom: 2px solid white;
    }
    
    .app-content {
      flex: 1;
      padding: 2rem 0;
    }
    
    .app-footer {
      background-color: #f5f5f5;
      padding: 1rem 0;
      text-align: center;
      color: #666;
    }
  `]
})
export class AppComponent {
  title = 'Contentful Admin';
}
