import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { Expense, CATEGORY_ICONS, CATEGORY_COLORS } from '../../models/expense.model';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterLink, ExpenseFormComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    expenses: Expense[] = [];
    budget = 5000;
    totalSpent = 0;
    topCategory = '';
    savings = 0;
    showForm = false;
    categoryIcons = CATEGORY_ICONS;
    categoryColors = CATEGORY_COLORS;

    recentExpenses: Expense[] = [];

    constructor(public expenseService: ExpenseService) { }

    ngOnInit() {
        this.expenseService.expenses$.subscribe(exps => {
            this.expenses = exps;
            this.totalSpent = exps.reduce((sum, e) => sum + e.amount, 0);
            this.topCategory = this.expenseService.getTopCategory();
            this.recentExpenses = exps.slice(0, 5);
        });
        this.expenseService.budget$.subscribe(b => {
            this.budget = b;
            this.savings = this.budget - this.totalSpent;
        });
    }

    get budgetPercent(): number {
        return Math.min((this.totalSpent / this.budget) * 100, 100);
    }

    get budgetColor(): string {
        if (this.budgetPercent < 50) return '#10b981';
        if (this.budgetPercent < 80) return '#f59e0b';
        return '#ef4444';
    }

    deleteExpense(id: string) {
        this.expenseService.deleteExpense(id);
    }

    toggleForm() { this.showForm = !this.showForm; }
    onFormClose() { this.showForm = false; }
}
