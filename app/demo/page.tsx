"use client";

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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-[720px] flex-col border-x border-zinc-200 bg-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Demo
            </span>
            <h1 className="text-base font-semibold text-zinc-900">
              Vad gäller hos oss?
            </h1>
          </div>
          <span className="text-xs text-zinc-400">vadgäller.se</span>
        </header>

        {/* Content */}
        <main className="flex min-h-0 flex-1 flex-col px-4 pb-24 pt-3">
          <p className="mb-3 text-xs text-zinc-500">
            Svar baseras på företagets dokument och officiella svar.
          </p>

          {/* Empty state chips */}
          {messages.length === 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {DEMO_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-100"
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
                    className={`max-w-[80%] rounded-2xl border text-sm shadow-sm ${
                      isUser
                        ? "bg-zinc-900 text-zinc-50 border-zinc-900"
                        : "bg-white text-zinc-900 border-zinc-200"
                    }`}
                  >
                    <div className="px-3 py-2">{message.content}</div>
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
        <footer className="sticky bottom-0 border-t border-zinc-200 bg-white px-4 py-3">
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 shadow-sm"
          >
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ställ en fråga…"
                className="w-full border-none bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:ring-0"
              />
              <p className="mt-1 text-[10px] text-zinc-400">
                Svar baseras på företagets dokument och officiella svar.
              </p>
            </div>
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
  );
}

