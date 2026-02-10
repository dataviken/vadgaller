"use client";

import { useEffect, useRef, useState } from "react";

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

let globalId = 1;

function createFallbackMessage(): Message {
  return {
    id: globalId++,
    role: "assistant",
    content:
      "Jag hittar inget officiellt svar eller stöd i era dokument ännu. Kontakta HR så att ett officiellt svar kan läggas till.",
    source: "Standardtext (saknas)",
  };
}

export default function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const [stage, setStage] = useState<"pin" | "chat">("pin");
  const [pinValues, setPinValues] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (stage === "pin" && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [stage]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...pinValues];
    next[index] = value;
    setPinValues(next);
    setPinError(null);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const pin = next.join("");
    if (pin.length === 4) {
      if (pin === "1234") {
        setStage("chat");
      } else {
        setPinError("Fel PIN-kod. Försök igen.");
        setPinValues(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    }
  };

  const handleAsk = (question: string) => {
    if (!question.trim()) return;
    const trimmed = question.trim();

    const userMessage: Message = {
      id: globalId++,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage, createFallbackMessage()]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(input);
  };

  if (stage === "pin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-xs rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-base font-semibold text-zinc-900">
            Vad gäller hos oss?
          </h1>
          <p className="mb-4 text-xs text-zinc-500">
            Ange PIN-kod för att fortsätta.
          </p>
          <div className="mb-3 flex justify-between gap-2">
            {pinValues.map((digit, index) => (
              <input
                key={index}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="h-12 w-12 rounded-xl border border-zinc-200 text-center text-xl font-semibold tracking-widest text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            ))}
          </div>
          {pinError && (
            <p className="text-xs text-red-500" role="alert">
              {pinError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-[720px] flex-col border-x border-zinc-200 bg-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {params.slug}
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

