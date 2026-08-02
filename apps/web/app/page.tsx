import Link from "next/link";

import { Button } from "@repo/ui";

import {
  ESTIMATE_LINK,
  HOME_DESCRIPTION,
  HOME_HEADING,
  SHARED_BUTTON_LABEL,
} from "../lib/content";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">{HOME_HEADING}</h1>
      <p className="text-gray-600">{HOME_DESCRIPTION}</p>
      <Button>{SHARED_BUTTON_LABEL}</Button>
      <Link
        className="text-sm text-blue-600 underline"
        href={ESTIMATE_LINK.href}
      >
        {ESTIMATE_LINK.label}
      </Link>
    </main>
  );
}
