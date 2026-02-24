"use client";

import { ScrollsList } from "./scrolls-list";

import { StatusInputs } from "./status-inputs";

export default function Home() {
  return (
    <div className="flex min-h-screen py-10 items-center justify-center font-sansbg-black">
      <main className="flex flex-col gap-5 w[2000px]">
        <StatusInputs />
        <ScrollsList />
      </main>
    </div>
  );
}
