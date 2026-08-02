"use client";

import { useState } from "react";

import { DETAIL_TEXT } from "../lib/content";
import { todayISO } from "../lib/date";
import type { Transaction, TransactionType } from "../lib/types";

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void;
}

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      date,
      type,
      amount: amountNumber,
      memo,
    });
    setAmount("");
    setMemo("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4"
    >
      <h2 className="text-sm font-semibold text-gray-900">
        {DETAIL_TEXT.entryFormHeading}
      </h2>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        {DETAIL_TEXT.dateLabel}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="min-h-11 rounded-md border border-gray-300 px-3"
        />
      </label>

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
          onChange={(e) => setAmount(e.target.value)}
          className="min-h-11 rounded-md border border-gray-300 px-3"
        />
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
