"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FixedDailyExpenseSection } from "../../components/FixedDailyExpenseSection";
import { RecurringSummary } from "../../components/RecurringSummary";
import { TransactionForm } from "../../components/TransactionForm";
import { TransactionList } from "../../components/TransactionList";
import { DETAIL_TEXT } from "../../lib/content";
import { detectRecurringMonthly } from "../../lib/recurring";
import { loadAppData, saveAppData } from "../../lib/storage";
import type { AppData, FixedDailyExpense, Transaction } from "../../lib/types";

export default function Detail() {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(loadAppData());
  }, []);

  function update(next: AppData) {
    setData(next);
    saveAppData(next);
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white p-8">
        <h1 className="text-lg font-bold text-gray-900">
          {DETAIL_TEXT.heading}
        </h1>
      </main>
    );
  }

  const expenses = data.transactions.filter((t) => t.type === "expense");
  const incomes = data.transactions.filter((t) => t.type === "income");
  const recurring = detectRecurringMonthly(data.transactions);

  function addTransaction(t: Transaction) {
    if (!data) return;
    update({ ...data, transactions: [...data.transactions, t] });
  }

  function deleteTransaction(id: string) {
    if (!data) return;
    update({
      ...data,
      transactions: data.transactions.filter((t) => t.id !== id),
    });
  }

  function addFixedDaily(item: FixedDailyExpense) {
    if (!data) return;
    update({ ...data, fixedDailyExpenses: [...data.fixedDailyExpenses, item] });
  }

  function deleteFixedDaily(id: string) {
    if (!data) return;
    update({
      ...data,
      fixedDailyExpenses: data.fixedDailyExpenses.filter((f) => f.id !== id),
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 bg-white p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          {DETAIL_TEXT.heading}
        </h1>
        <Link href="/" className="text-sm text-blue-600 underline">
          {DETAIL_TEXT.backLink}
        </Link>
      </header>

      <TransactionForm onAdd={addTransaction} />

      <TransactionList
        heading={DETAIL_TEXT.expenseListHeading}
        emptyMessage={DETAIL_TEXT.emptyExpense}
        transactions={expenses}
        onDelete={deleteTransaction}
      />

      <TransactionList
        heading={DETAIL_TEXT.incomeListHeading}
        emptyMessage={DETAIL_TEXT.emptyIncome}
        transactions={incomes}
        onDelete={deleteTransaction}
      />

      <FixedDailyExpenseSection
        items={data.fixedDailyExpenses}
        onAdd={addFixedDaily}
        onDelete={deleteFixedDaily}
      />

      <RecurringSummary rules={recurring} />
    </main>
  );
}
