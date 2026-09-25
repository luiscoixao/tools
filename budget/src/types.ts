export type CategoryId =
  | 'courses'
  | 'resto'
  | 'transport'
  | 'logement'
  | 'sante'
  | 'loisirs'
  | 'shopping'
  | 'autre';

export type Category = {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
};

export type Expense = {
  id: string;
  amount: number;
  label: string;
  category: CategoryId;
  /** ISO date, YYYY-MM-DD */
  date: string;
};

export type Data = {
  expenses: Expense[];
  /** Monthly budget in euros, 0 = none */
  budget: number;
};
