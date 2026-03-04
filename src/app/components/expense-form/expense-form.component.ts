import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense, ExpenseCategory } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';

@Component({
    selector: 'app-expense-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './expense-form.component.html',
    styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent implements OnInit {
    @Input() editExpense?: Expense;
    @Output() closed = new EventEmitter<void>();

    form!: FormGroup;
    categories = Object.values(ExpenseCategory);
    paymentMethods = ['Card', 'Cash', 'Bank Transfer', 'Crypto', 'UPI'];
    submitted = false;
    showSuccess = false;

    constructor(private fb: FormBuilder, private expenseService: ExpenseService) { }

    ngOnInit() {
        this.form = this.fb.group({
            title: [this.editExpense?.title || '', [Validators.required, Validators.minLength(2)]],
            amount: [this.editExpense?.amount || '', [Validators.required, Validators.min(0.01)]],
            category: [this.editExpense?.category || '', Validators.required],
            date: [this.editExpense?.date ? new Date(this.editExpense.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10), Validators.required],
            paymentMethod: [this.editExpense?.paymentMethod || 'Card', Validators.required],
            notes: [this.editExpense?.notes || ''],
        });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) return;

        const data = { ...this.form.value, date: new Date(this.form.value.date).toISOString() };

        if (this.editExpense) {
            this.expenseService.updateExpense({ ...data, id: this.editExpense.id });
        } else {
            this.expenseService.addExpense(data);
        }

        this.showSuccess = true;
        setTimeout(() => {
            this.showSuccess = false;
            this.closed.emit();
        }, 1200);
    }

    onCancel() {
        this.closed.emit();
    }
}
