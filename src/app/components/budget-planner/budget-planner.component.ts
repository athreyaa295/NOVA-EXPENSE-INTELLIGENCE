import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseCategory, CATEGORY_COLORS } from '../../models/expense.model';

interface CategoryBudget {
    category: string;
    budgetAmt: number;
    spent: number;
    color: string;
    pct: number;
}

@Component({
    selector: 'app-budget-planner',
    imports: [CommonModule, FormsModule],
    templateUrl: './budget-planner.component.html',
    styleUrl: './budget-planner.component.scss'
})
export class BudgetPlannerComponent implements OnInit {
    totalBudget = 5000;
    totalSpent = 0;
    inputBudget = 5000;
    saved = false;

    categoryBudgets: CategoryBudget[] = [];

    constructor(private expenseService: ExpenseService) { }

    ngOnInit() {
        this.expenseService.budget$.subscribe(b => {
            this.totalBudget = b;
            this.inputBudget = b;
            this.buildCategoryBudgets();
        });
        this.expenseService.expenses$.subscribe(exps => {
            this.totalSpent = exps.reduce((s, e) => s + e.amount, 0);
            this.buildCategoryBudgets();
        });
    }

    buildCategoryBudgets() {
        const expenses = this.expenseService.getExpenses();
        const catMap: Record<string, number> = {};
        expenses.forEach(e => catMap[e.category] = (catMap[e.category] || 0) + e.amount);
        const cats = Object.values(ExpenseCategory);
        const perCatBudget = this.totalBudget / cats.length;

        this.categoryBudgets = cats.map(cat => {
            const spent = catMap[cat] || 0;
            const bAmt = perCatBudget;
            return {
                category: cat,
                budgetAmt: bAmt,
                spent,
                color: (CATEGORY_COLORS as any)[cat] || '#64748b',
                pct: Math.min((spent / bAmt) * 100, 100)
            };
        }).sort((a, b) => b.pct - a.pct);
    }

    saveBudget() {
        this.expenseService.updateBudget(this.inputBudget);
        this.saved = true;
        setTimeout(() => this.saved = false, 2000);
    }

    get remaining() { return this.totalBudget - this.totalSpent; }
    get budgetPct() { return Math.min((this.totalSpent / this.totalBudget) * 100, 100); }
    get budgetColor() {
        if (this.budgetPct < 50) return '#10b981';
        if (this.budgetPct < 80) return '#f59e0b';
        return '#ef4444';
    }
}
