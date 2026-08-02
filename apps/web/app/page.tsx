"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BalanceBarChart } from "../components/BalanceBarChart";
import { Calendar } from "../components/Calendar";
import { HOME_DESCRIPTION, HOME_HEADING, HOME_TEXT } from "../lib/content";
import { formatJP, todayISO } from "../lib/date";
import {
  currentBalance,
  dailyBalanceSeries,
  forecastBalance,
} from "../lib/forecast";
import { loadAppData, saveAppData } from "../lib/storage";
import type { AppData } from "../lib/types";

const MAX_CHART_POINTS = 45;

export default function Home() {
  const [data, setData] = useState<AppData | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    setData(loadAppData());
  }, []);

  function selectDate(dateIso: string) {
    if (!data) return;
    const next: AppData = { ...data, selectedDate: dateIso };
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
  const forecast = forecastBalance(data, data.selectedDate);
  const rangeStart = data.selectedDate <= today ? data.selectedDate : today;
  const rangeEnd = data.selectedDate <= today ? today : data.selectedDate;
  const series = sampledSeries(data, rangeStart, rangeEnd);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 bg-white p-6">
      <header>
        <h1 className="text-xl font-bold text-gray-900">{HOME_HEADING}</h1>
        <p className="text-sm text-gray-500">{HOME_DESCRIPTION}</p>
      </header>

      <section className="rounded-lg border border-gray-200 p-4">
        <p className="text-xs text-gray-500">{HOME_TEXT.targetDateLabel}</p>
        <p className="text-base font-semibold text-gray-900">
          {formatJP(data.selectedDate)}
        </p>
        <button
          type="button"
          onClick={() => setShowCalendar((v) => !v)}
          className="mt-2 min-h-11 rounded-md border border-gray-300 px-4 text-sm text-gray-700"
        >
          {HOME_TEXT.changeDateButton}
        </button>
      </section>

      {showCalendar ? (
        <Calendar
          selected={data.selectedDate}
          onSelect={selectDate}
          onClose={() => setShowCalendar(false)}
        />
      ) : null}

      <section className="rounded-lg border border-gray-200 p-4">
        <p className="text-xs text-gray-500">{HOME_TEXT.forecastLabel}</p>
        <p className="text-4xl font-semibold text-gray-900">
          {forecast.toLocaleString("ja-JP")}
          <span className="ml-1 text-lg font-normal text-gray-500">円</span>
        </p>
        {data.selectedDate !== today ? (
          <p className="mt-1 text-xs text-gray-500">
            {HOME_TEXT.todayLabel}: {currentBalance(data).toLocaleString("ja-JP")}
            円
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <BalanceBarChart points={series} highlightDate={data.selectedDate} />
      </section>

      <Link
        href="/detail"
        className="min-h-11 rounded-md bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
      >
        {HOME_TEXT.detailLink}
      </Link>
    </main>
  );
}

function sampledSeries(data: AppData, fromIso: string, toIso: string) {
  const full = dailyBalanceSeries(data, fromIso, toIso);
  if (full.length <= MAX_CHART_POINTS) return full;
  const step = Math.ceil(full.length / MAX_CHART_POINTS);
  return full.filter((_, i) => i % step === 0 || i === full.length - 1);
}
