"use client";

import Image from "next/image";
import { useState } from "react";

type Role = "user" | "assistant";

type Message = {
  id: number;
  role: Role;
  content: string;
  source?: string;
};

const DEMO_CHIPS = [
  "När betalas lönen?",
  "Hur sjukanmäler jag mig?",
  "Hur funkar flex?",
  "Hur funkar semester?",
  "Vad gäller för OB och övertid?",
  "Hur funkar VAB?",
  "Vad gäller för föräldraledighet?",
  "Har vi friskvårdsbidrag?",
  "Vad händer med min tjänstepension?",
  "Vad gäller för uppsägningstid?",
];

const MOCK_ANSWERS: Record<string, Message[]> = {
  "När betalas lönen?": [
    {
      id: 1,
      role: "assistant",
      content: "Lönen betalas ut den 25:e varje månad, eller närmaste vardag innan.",
      source: "Lönepolicy 2024-01-01",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Vid helgdag på utbetalningsdag justeras utbetalningen automatiskt av lönesystemet.",
      source: "Lönepolicy 2024-01-01",
    },
  ],
  "Hur sjukanmäler jag mig?": [
    {
      id: 1,
      role: "assistant",
      content:
        "Du sjukanmäler dig genom att meddela din närmaste chef före arbetspassets start.",
      source: "Frånvarorutin 2023-10-01",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Vid sjukfrånvaro längre än 7 dagar krävs läkarintyg enligt företagets policy.",
      source: "Frånvarorutin 2023-10-01",
    },
  ],
  "Hur funkar flex?": [
    {
      id: 1,
      role: "assistant",
      content:
        "Flex registreras i tidssystemet och ska hållas inom de ramar som är avtalade med din chef.",
      source: "Flextidsavtal 2022-05-01",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Överskjutande flex över gränsen nollställs automatiskt i slutet av månaden.",
      source: "Flextidsavtal 2022-05-01",
    },
  ],
  "Hur funkar semester?": [
    {
      id: 1,
      role: "assistant",
      content:
        "Semester ansöker du om i HR-systemet och den godkänns av din närmaste chef.",
      source: "Semesterpolicy 2023-01-01",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Antal semesterdagar och semesterår framgår av ditt anställningsavtal och kollektivavtal.",
      source: "Semesterpolicy 2023-01-01",
    },
  ],
};

let globalId = 1;

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const addMessages = (newMessages: Message[]) => {
    setMessages((current) => [
      ...current,
      ...newMessages.map((m) => ({ ...m, id: globalId++ })),
    ]);
  };

  const handleAsk = (question: string) => {
    if (!question.trim()) return;

    const trimmed = question.trim();
    const userMessage: Message = {
      id: globalId++,
      role: "user",
      content: trimmed,
    };

    const mock = MOCK_ANSWERS[trimmed];

    setMessages((current) => [
      ...current,
      userMessage,
      ...(mock
        ? mock.map((m) => ({ ...m, id: globalId++ }))
        : [
            {
              id: globalId++,
              role: "assistant",
              content:
                "Jag hittar inget officiellt svar eller stöd i era dokument ännu. Kontakta HR så att ett officiellt svar kan läggas till.",
              source: "Standardtext (saknas)",
            } as Message,
          ]),
    ]);

    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(input);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-4 sm:py-6">
        {/* Header */}
        <header className="mb-4 flex items-center gap-3 sm:mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900">
            <Image
              src="/vadgaller-logo.svg"
              alt="Vadgäller logotyp"
              width={24}
              height={24}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Demo
            </span>
            <h1 className="text-lg font-semibold text-zinc-900">
              Vadgäller – demo
            </h1>
            <p className="text-xs text-zinc-500">
              Svar baseras på personalhandbok, kollektivavtal och officiella
              HR-svar.
            </p>
          </div>
        </header>

        {/* Chat container */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <main className="flex min-h-0 flex-1 flex-col px-4 pb-24 pt-4 sm:px-6">
            <p className="mb-4 text-xs text-zinc-500">
              Svar baseras på företagets dokument och officiella svar. Det här
              är en öppen demo utan riktiga företagsuppgifter.
            </p>

            {/* Empty state chips */}
            {messages.length === 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {DEMO_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
                    onClick={() => handleAsk(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto pb-2">
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl text-sm shadow-sm ${
                        isUser
                          ? "bg-[#e5f0ff] text-zinc-900"
                          : "bg-white text-zinc-900 border border-zinc-200"
                      }`}
                    >
                      <div className="px-3 py-2 space-y-2">
                        <p>{message.content}</p>
                        {!isUser &&
                          message.source === "Standardtext (saknas)" && (
                            <button
                              type="button"
                              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                              Kontakta HR
                            </button>
                          )}
                      </div>
                      {!isUser && message.source && (
                        <div className="border-t border-zinc-100 px-3 py-1.5 text-[10px] uppercase tracking-wide text-zinc-500">
                          Källa: {message.source}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* Sticky input */}
          <footer className="sticky bottom-0 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 shadow-sm"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ställ en fråga…"
                className="flex-1 border-none bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="inline-flex h-8 items-center rounded-full bg-zinc-900 px-4 text-xs font-semibold text-zinc-50 hover:bg-zinc-800 disabled:opacity-40"
                disabled={!input.trim()}
              >
                Skicka
              </button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
}

