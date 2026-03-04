import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense, ExpenseCategory } from '../models/expense.model';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {
    private readonly STORAGE_KEY = 'nova_expenses';
    private readonly BUDGET_KEY = 'nova_budget';

    private expensesSubject = new BehaviorSubject<Expense[]>([]);
    public expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();

    private budgetSubject = new BehaviorSubject<number>(5000);
    public budget$: Observable<number> = this.budgetSubject.asObservable();

    constructor() {
        this.loadInitialData();
    }

    private getToday(): string {
        return new Date().toISOString();
    }

    private getDaysAgo(days: number): string {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d.toISOString();
    }

    private loadInitialData() {
        const savedBudget = localStorage.getItem(this.BUDGET_KEY);
        if (savedBudget) {
            this.budgetSubject.next(Number(savedBudget));
        }

        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            this.expensesSubject.next(JSON.parse(saved));
        } else {
            const mockData: Expense[] = [
                { id: this.generateId(), title: 'Cloud Server Rental', amount: 450, category: ExpenseCategory.Utilities, date: this.getToday(), paymentMethod: 'Card', notes: 'AWS monthly bill' },
                { id: this.generateId(), title: 'Health Insurance', amount: 320, category: ExpenseCategory.Healthcare, date: this.getDaysAgo(1), paymentMethod: 'Bank Transfer', notes: '' },
                { id: this.generateId(), title: 'Hyperloop Monthly Pass', amount: 280, category: ExpenseCategory.Transportation, date: this.getDaysAgo(2), paymentMethod: 'Card', notes: '' },
                { id: this.generateId(), title: 'Premium Streaming', amount: 45, category: ExpenseCategory.Entertainment, date: this.getDaysAgo(3), paymentMethod: 'Card', notes: 'Netflix + Spotify' },
                { id: this.generateId(), title: 'Organic Groceries', amount: 180, category: ExpenseCategory.Food, date: this.getDaysAgo(4), paymentMethod: 'Cash', notes: '' },
                { id: this.generateId(), title: 'Online Masterclass', amount: 99, category: ExpenseCategory.Education, date: this.getDaysAgo(5), paymentMethod: 'Card', notes: 'Angular Advanced Course' },
                { id: this.generateId(), title: 'Rent Payment', amount: 1500, category: ExpenseCategory.Housing, date: this.getDaysAgo(6), paymentMethod: 'Bank Transfer', notes: 'Monthly rent' },
                { id: this.generateId(), title: 'Restaurant Dinner', amount: 75, category: ExpenseCategory.Food, date: this.getDaysAgo(7), paymentMethod: 'Card', notes: '' },
                { id: this.generateId(), title: 'Gym Membership', amount: 60, category: ExpenseCategory.Healthcare, date: this.getDaysAgo(8), paymentMethod: 'Card', notes: '' },
                { id: this.generateId(), title: 'Electric Bill', amount: 130, category: ExpenseCategory.Utilities, date: this.getDaysAgo(9), paymentMethod: 'Bank Transfer', notes: '' },
            ];
            this.saveToStorage(mockData);
        }
    }

    private saveToStorage(expenses: Expense[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(expenses));
        this.expensesSubject.next(expenses);
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    getExpenses(): Expense[] {
        return this.expensesSubject.getValue();
    }

    addExpense(expense: Omit<Expense, 'id'>) {
        const newExpense: Expense = { ...expense, id: this.generateId() };
        this.saveToStorage([newExpense, ...this.getExpenses()]);
    }

    updateExpense(updated: Expense) {
        const list = this.getExpenses().map(e => e.id === updated.id ? updated : e);
        this.saveToStorage(list);
    }

    deleteExpense(id: string) {
        this.saveToStorage(this.getExpenses().filter(e => e.id !== id));
    }

    updateBudget(amount: number) {
        localStorage.setItem(this.BUDGET_KEY, String(amount));
        this.budgetSubject.next(amount);
    }

    getTotalSpending(): number {
        return this.getExpenses().reduce((sum, e) => sum + e.amount, 0);
    }

    getTopCategory(): string {
        const expenses = this.getExpenses();
        if (!expenses.length) return 'N/A';
        const totals: Record<string, number> = {};
        expenses.forEach(e => totals[e.category] = (totals[e.category] || 0) + e.amount);
        return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
    }

    getCategoryTotals(): { category: string; total: number }[] {
        const expenses = this.getExpenses();
        const totals: Record<string, number> = {};
        expenses.forEach(e => totals[e.category] = (totals[e.category] || 0) + e.amount);
        return Object.entries(totals).map(([category, total]) => ({ category, total }));
    }
}
