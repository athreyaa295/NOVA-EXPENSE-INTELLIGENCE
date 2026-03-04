export interface Expense {
    id: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    paymentMethod: string;
    notes?: string;
}

export enum ExpenseCategory {
    Housing = 'Housing',
    Transportation = 'Transportation',
    Food = 'Food',
    Utilities = 'Utilities',
    Entertainment = 'Entertainment',
    Healthcare = 'Healthcare',
    Education = 'Education',
    Other = 'Other'
}

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
    [ExpenseCategory.Housing]: '🏠',
    [ExpenseCategory.Transportation]: '🚗',
    [ExpenseCategory.Food]: '🍽️',
    [ExpenseCategory.Utilities]: '⚡',
    [ExpenseCategory.Entertainment]: '🎮',
    [ExpenseCategory.Healthcare]: '❤️',
    [ExpenseCategory.Education]: '📚',
    [ExpenseCategory.Other]: '📦',
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
    [ExpenseCategory.Housing]: '#f97316',
    [ExpenseCategory.Transportation]: '#3b82f6',
    [ExpenseCategory.Food]: '#10b981',
    [ExpenseCategory.Utilities]: '#f59e0b',
    [ExpenseCategory.Entertainment]: '#8b5cf6',
    [ExpenseCategory.Healthcare]: '#ef4444',
    [ExpenseCategory.Education]: '#06b6d4',
    [ExpenseCategory.Other]: '#6b7280',
};
