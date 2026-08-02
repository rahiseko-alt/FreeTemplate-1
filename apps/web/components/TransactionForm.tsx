"use client";

import { useState } from "react";

import { Calendar } from "./Calendar";
import { DETAIL_TEXT } from "../lib/content";
import { formatJP, todayISO } from "../lib/date";
import type { Transaction, TransactionType } from "../lib/types";

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void;
}

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [date, setDate] = useState(todayISO());
  const [showCalendar, setShowCalendar] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [showAmountError, setShowAmountError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setShowAmountError(true);
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      date,
      type,
      amount: amountNumber,
      memo,
    });
    setAmount("");
    setMemo("");
    setShowAmountError(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4"
    >
      <h2 className="text-sm font-semibold text-gray-900">
        {DETAIL_TEXT.entryFormHeading}
      </h2>

      <div className="flex flex-col gap-1 text-sm text-gray-700">
        {DETAIL_TEXT.dateLabel}
        <button
          type="button"
          onClick={() => setShowCalendar((v) => !v)}
          className="min-h-11 rounded-md border border-gray-300 px-3 text-left"
        >
          {formatJP(date)}
          {DETAIL_TEXT.changeDateSuffix}
        </button>
        {showCalendar ? (
          <Calendar
            selected={date}
            onSelect={setDate}
            onClose={() => setShowCalendar(false)}
          />
        ) : null}
      </div>

      <div className="flex gap-4 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={type === "expense"}
            onChange={() => setType("expense")}
          />
          {DETAIL_TEXT.typeExpense}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={type === "income"}
            onChange={() => setType("income")}
          />
          {DETAIL_TEXT.typeIncome}
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        {DETAIL_TEXT.amountLabel}
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setShowAmountError(false);
          }}
          className="min-h-11 rounded-md border border-gray-300 px-3"
        />
        {showAmountError ? (
          <span className="text-xs text-red-600">
            {DETAIL_TEXT.amountError}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        {DETAIL_TEXT.memoLabel}
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="min-h-11 rounded-md border border-gray-300 px-3"
        />
      </label>

      <button
        type="submit"
        className="min-h-11 rounded-md bg-blue-600 text-sm font-semibold text-white"
      >
        {DETAIL_TEXT.addButton}
      </button>
    </form>
  );
}
