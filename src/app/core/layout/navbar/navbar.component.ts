import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../../services/expense.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    currentDate = new Date();

    constructor(public expenseService: ExpenseService) { }
}
