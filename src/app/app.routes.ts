import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { BudgetPlannerComponent } from './components/budget-planner/budget-planner.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'expenses', component: ExpenseListComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: 'budget', component: BudgetPlannerComponent },
];
