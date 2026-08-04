"use client";

import { useState } from "react";

import { Calendar } from "./Calendar";
import { DETAIL_TEXT, HOME_TEXT, MAX_TRANSACTION_AMOUNT } from "../lib/content";
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
  const [amountError, setAmountError] = useState<"empty" | "max" | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setAmountError("empty");
      return;
    }
    if (amountNumber > MAX_TRANSACTION_AMOUNT) {
      setAmountError("max");
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
    setAmountError(null);
  }

  const accent = type === "expense" ? "red" : "blue";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <input
            type="radio"
            className="peer sr-only"
            checked={type === "expense"}
            onChange={() => setType("expense")}
          />
          <span className="flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-500 peer-checked:border-red-600 peer-checked:bg-red-600 peer-checked:text-white">
            {DETAIL_TEXT.typeExpense}
          </span>
        </label>
        <label className="block">
          <input
            type="radio"
            className="peer sr-only"
            checked={type === "income"}
            onChange={() => setType("income")}
          />
          <span className="flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white">
            {DETAIL_TEXT.typeIncome}
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
        {DETAIL_TEXT.amountLabel}
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setAmountError(null);
          }}
          className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-lg font-semibold text-gray-900"
        />
        {amountError ? (
          <span className="text-xs font-normal text-red-600">
            {amountError === "max" ? DETAIL_TEXT.amountMaxError : DETAIL_TEXT.amountError}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
        {DETAIL_TEXT.dateLabel}
        <button
          type="button"
          onClick={() => setShowCalendar((v) => !v)}
          className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-left text-sm font-normal text-gray-900"
        >
          {formatJP(date)}
          {HOME_TEXT.changeDateSuffix}
        </button>
        {showCalendar ? (
          <Calendar
            selected={date}
            onSelect={setDate}
            onClose={() => setShowCalendar(false)}
          />
        ) : null}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
        {DETAIL_TEXT.memoLabel}
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 font-normal text-gray-900"
        />
      </label>

      <button
        type="submit"
        className={`min-h-11 rounded-lg text-sm font-semibold text-white ${
          accent === "red" ? "bg-red-600" : "bg-blue-600"
        }`}
      >
        {DETAIL_TEXT.addButton}
      </button>
    </form>
  );
}
