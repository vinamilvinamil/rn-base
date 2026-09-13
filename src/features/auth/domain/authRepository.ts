import { Account } from "./models/accounts";

export interface AuthRepository {
    getAccounts(userId: string) : Promise<Account[]>
}