"use client";

import { useEffect, useState } from "react";

import { BalanceChart } from "../components/BalanceChart";
import { Calendar } from "../components/Calendar";
import { FixedDailyExpenseSection } from "../components/FixedDailyExpenseSection";
import { RecurringSummary } from "../components/RecurringSummary";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { DETAIL_TEXT, HOME_DESCRIPTION, HOME_HEADING, HOME_TEXT } from "../lib/content";
import { formatJP, todayISO } from "../lib/date";
import {
  currentBalance,
  dailyBalanceSeries,
  forecastBalance,
} from "../lib/forecast";
import { detectRecurringMonthly } from "../lib/recurring";
import { loadAppData, saveAppData } from "../lib/storage";
import type { AppData, FixedDailyExpense, Transaction } from "../lib/types";

const MAX_CHART_POINTS = 45;

export default function Home() {
  const [data, setData] = useState<AppData | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

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
        <h1 className="text-lg font-bold text-gray-900">{HOME_HEADING}</h1>
      </main>
    );
  }

  const today = todayISO();
  const isToday = data.selectedDate === today;
  const forecast = forecastBalance(data, data.selectedDate);
  const isShortfall = forecast < 0;
  const displayAmount = Math.abs(forecast);
  const current = currentBalance(data);
  const rangeStart = data.selectedDate <= today ? data.selectedDate : today;
  const rangeEnd = data.selectedDate <= today ? today : data.selectedDate;
  const series = sampledSeries(data, rangeStart, rangeEnd);

  const expenses = data.transactions.filter((t) => t.type === "expense");
  const incomes = data.transactions.filter((t) => t.type === "income");
  const recurring = detectRecurringMonthly(data.transactions);

  function selectDate(dateIso: string) {
    if (!data) return;
    update({ ...data, selectedDate: dateIso });
  }

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
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-3 bg-white p-4">
      <header>
        <h1 className="text-xl font-bold text-gray-900">{HOME_HEADING}</h1>
        <p className="text-sm text-gray-500">{HOME_DESCRIPTION}</p>
      </header>

      <section className="rounded-lg border border-gray-200 p-3">
        <h2 className="mb-1 text-sm font-semibold text-gray-900">
          {HOME_TEXT.forecastHeadingPrefix}
          {formatJP(data.selectedDate)}
        </h2>

        <p className="mb-1 text-xs text-gray-500">{HOME_TEXT.dateQuestion}</p>
        <button
          type="button"
          onClick={() => setShowCalendar((v) => !v)}
          className="min-h-11 rounded-md border border-gray-300 px-4 text-sm font-semibold text-gray-900"
        >
          {formatJP(data.selectedDate)}
          {HOME_TEXT.changeDateSuffix}
        </button>

        {showCalendar ? (
          <div className="mt-2">
            <Calendar
              selected={data.selectedDate}
              onSelect={selectDate}
              onClose={() => setShowCalendar(false)}
            />
          </div>
        ) : null}

        <p className="mt-2 text-sm text-gray-500">
          {isToday
            ? HOME_TEXT.todayCaption
            : `${formatJP(data.selectedDate)}${HOME_TEXT.futureConnector}`}
        </p>
        <p className="text-5xl font-bold text-gray-900">
          {displayAmount.toLocaleString("ja-JP")}
          <span className="ml-1 text-xl font-normal text-gray-500">円</span>
        </p>
        <p className="text-sm text-gray-500">
          {isToday
            ? isShortfall
              ? HOME_TEXT.todayShortfallCaptionSuffix
              : HOME_TEXT.todayCaptionSuffix
            : isShortfall
              ? HOME_TEXT.futureShortfallCaption
              : HOME_TEXT.futureCaption}
        </p>
        {!isToday ? (
          <p className="mt-1 text-xs text-gray-400">
            {current < 0
              ? HOME_TEXT.currentShortfallPrefix
              : HOME_TEXT.currentBalancePrefix}
            {Math.abs(current).toLocaleString("ja-JP")}
            {HOME_TEXT.currentBalanceSuffix}
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <BalanceChart points={series} highlightDate={data.selectedDate} />
      </section>

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

function sampledSeries(data: AppData, fromIso: string, toIso: string) {
  const full = dailyBalanceSeries(data, fromIso, toIso);
  if (full.length <= MAX_CHART_POINTS) return full;
  const step = Math.ceil(full.length / MAX_CHART_POINTS);
  return full.filter((_, i) => i % step === 0 || i === full.length - 1);
}
