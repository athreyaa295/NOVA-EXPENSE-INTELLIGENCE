import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
    path: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    navItems: NavItem[] = [
        { path: '/dashboard', label: 'Dashboard', icon: '⬡' },
        { path: '/expenses', label: 'Expenses', icon: '◈' },
        { path: '/analytics', label: 'Analytics', icon: '◉' },
        { path: '/budget', label: 'Budget', icon: '◎' },
    ];
}
