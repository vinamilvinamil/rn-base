import { Budget } from "./models/budget";

export interface BudgetRepository {
    getBudget(userId: string) : Promise<Budget | null>;

    upsertBudget(userId: string, amount: number) : Promise<Budget>;
    
}