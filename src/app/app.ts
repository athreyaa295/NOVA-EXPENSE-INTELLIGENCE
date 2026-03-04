import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { NavbarComponent } from './core/layout/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="app-shell">
      <app-sidebar></app-sidebar>
      <div class="main-area">
        <app-navbar></app-navbar>
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrl: './app.scss',
})
export class App { }
