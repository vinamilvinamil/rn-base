import { DefaultAccount } from "./models/account";

export interface OnboardingRepository {
  updateUserCurrency(
    userId: string,
    currency: string,
  ): Promise<void>;

  getDefaultAccount(
    userId: string,
  ): Promise<DefaultAccount>;

  createTransaction(params: {
    userId: string;
    accountId: string;
    amount: number;
  }): Promise<void>;

  updateAccountBalance(
    accountId: string,
    balance: number,
  ): Promise<void>;
}