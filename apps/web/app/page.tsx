"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BalanceChart } from "../components/BalanceChart";
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
  const isToday = data.selectedDate === today;
  const forecast = forecastBalance(data, data.selectedDate);
  const isShortfall = forecast < 0;
  const displayAmount = Math.abs(forecast);
  const current = currentBalance(data);
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
        <p className="mb-2 text-xs text-gray-500">{HOME_TEXT.dateQuestion}</p>
        <button
          type="button"
          onClick={() => setShowCalendar((v) => !v)}
          className="min-h-11 rounded-md border border-gray-300 px-4 text-sm font-semibold text-gray-900"
        >
          {formatJP(data.selectedDate)}
          {HOME_TEXT.changeDateSuffix}
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
        <p className="text-sm text-gray-500">
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
          <p className="mt-2 text-xs text-gray-400">
            {current < 0
              ? HOME_TEXT.currentShortfallPrefix
              : HOME_TEXT.currentBalancePrefix}
            {Math.abs(current).toLocaleString("ja-JP")}
            {HOME_TEXT.currentBalanceSuffix}
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <BalanceChart points={series} highlightDate={data.selectedDate} />
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
