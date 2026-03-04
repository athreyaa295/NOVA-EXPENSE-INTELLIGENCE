import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Expense, ExpenseCategory, CATEGORY_ICONS, CATEGORY_COLORS } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';

@Component({
    selector: 'app-expense-list',
    imports: [CommonModule, FormsModule, ExpenseFormComponent],
    templateUrl: './expense-list.component.html',
    styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {
    expenses: Expense[] = [];
    filtered: Expense[] = [];
    categoryIcons = CATEGORY_ICONS;
    categoryColors = CATEGORY_COLORS;
    categories = ['All', ...Object.values(ExpenseCategory)];

    selectedCategory = 'All';
    searchQuery = '';
    sortBy = 'date';

    showForm = false;
    editingExpense?: Expense;
    deleteConfirmId: string | null = null;

    constructor(private expenseService: ExpenseService) { }

    ngOnInit() {
        this.expenseService.expenses$.subscribe(exps => {
            this.expenses = exps;
            this.applyFilters();
        });
    }

    applyFilters() {
        let result = [...this.expenses];
        if (this.selectedCategory !== 'All') {
            result = result.filter(e => e.category === this.selectedCategory);
        }
        if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase();
            result = result.filter(e => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
        }
        if (this.sortBy === 'date') {
            result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (this.sortBy === 'amount') {
            result.sort((a, b) => b.amount - a.amount);
        } else if (this.sortBy === 'title') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }
        this.filtered = result;
    }

    openAdd() { this.editingExpense = undefined; this.showForm = true; }
    openEdit(exp: Expense) { this.editingExpense = exp; this.showForm = true; }
    onFormClose() { this.showForm = false; this.editingExpense = undefined; }

    confirmDelete(id: string) { this.deleteConfirmId = id; }
    cancelDelete() { this.deleteConfirmId = null; }
    doDelete(id: string) { this.expenseService.deleteExpense(id); this.deleteConfirmId = null; }

    get totalFiltered(): number {
        return this.filtered.reduce((s, e) => s + e.amount, 0);
    }
}
