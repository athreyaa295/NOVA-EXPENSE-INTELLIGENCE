import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';
import { Expense, ExpenseCategory, CATEGORY_COLORS } from '../../models/expense.model';

@Component({
    selector: 'app-analytics',
    imports: [CommonModule],
    templateUrl: './analytics.component.html',
    styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
    expenses: Expense[] = [];
    budget = 5000;
    categoryTotals: { category: string; total: number; color: string; pct: number }[] = [];
    categoryColors = CATEGORY_COLORS;

    // Monthly trend (last 7 days)
    dailyTotals: { label: string; total: number }[] = [];
    maxDaily = 0;

    // Bar chart: Budget vs Actual by category
    budgetPerCat = 500;

    constructor(private expenseService: ExpenseService) { }

    ngOnInit() {
        this.expenseService.expenses$.subscribe(exps => {
            this.expenses = exps;
            this.buildStats();
        });
        this.expenseService.budget$.subscribe(b => {
            this.budget = b;
            this.buildStats();
        });
    }

    buildStats() {
        this.buildCategoryTotals();
        this.buildDailyTrend();
    }

    buildCategoryTotals() {
        const total = this.expenses.reduce((s, e) => s + e.amount, 0) || 1;
        const map: Record<string, number> = {};
        this.expenses.forEach(e => {
            map[e.category] = (map[e.category] || 0) + e.amount;
        });
        this.categoryTotals = Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .map(([category, catTotal]) => ({
                category,
                total: catTotal,
                color: (CATEGORY_COLORS as any)[category] || '#64748b',
                pct: Math.round((catTotal / total) * 100)
            }));
    }

    buildDailyTrend() {
        const days: { label: string; total: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('en', { weekday: 'short' });
            const dayStr = d.toISOString().slice(0, 10);
            const total = this.expenses
                .filter(e => (e.date as string).slice(0, 10) === dayStr)
                .reduce((s, e) => s + e.amount, 0);
            days.push({ label, total });
        }
        this.dailyTotals = days;
        this.maxDaily = Math.max(...days.map(d => d.total), 1);
    }

    get totalSpent() {
        return this.expenses.reduce((s, e) => s + e.amount, 0);
    }

    get avgPerDay() {
        const daySet = new Set(this.expenses.map(e => (e.date as string).slice(0, 10)));
        return daySet.size ? this.totalSpent / daySet.size : 0;
    }
}
