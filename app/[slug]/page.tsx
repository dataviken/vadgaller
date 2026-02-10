"use client";

import Image from "next/image";
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
  "Vad gäller för OB och övertid?",
  "Hur funkar VAB?",
  "Vad gäller för föräldraledighet?",
  "Har vi friskvårdsbidrag?",
  "Vad händer med min tjänstepension?",
  "Vad gäller för uppsägningstid?",
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
  const [isSending, setIsSending] = useState(false);

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

  const handleAsk = async (question: string) => {
    if (!question.trim()) return;
    const trimmed = question.trim();

    const userMessage: Message = {
      id: globalId++,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    try {
      setIsSending(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companySlug: params.slug,
          question: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat API error");
      }

      const data = (await response.json()) as {
        answer: string;
        source: string;
      };

      setMessages((current) => [
        ...current,
        {
          id: globalId++,
          role: "assistant",
          content: data.answer,
          source: data.source,
        },
      ]);
    } catch {
      setMessages((current) => [...current, createFallbackMessage()]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleAsk(input);
  };

  if (stage === "pin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900">
              <Image
                src="/vadgaller-logo.svg"
                alt="Vadgäller logotyp"
                width={20}
                height={20}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-semibold text-zinc-900">
                Vad gäller hos oss?
              </h1>
              <p className="text-xs text-zinc-500">
                Skriv in PIN-koden du fått av din arbetsgivare.
              </p>
            </div>
          </div>
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
          <p className="mt-3 text-[10px] text-zinc-400">
            Du behöver inte konto eller e-post. Dela aldrig PIN-koden utanför
            företaget.
          </p>
        </div>
      </div>
    );
  }

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
              {params.slug}
            </span>
            <h1 className="text-lg font-semibold text-zinc-900">
              Vad gäller hos oss?
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
              Svar baseras på företagets dokument och officiella svar.
            </p>

            {/* Empty state chips */}
            {messages.length === 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {DEMO_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-40"
                    onClick={() => void handleAsk(chip)}
                    disabled={isSending}
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
                disabled={!input.trim() || isSending}
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

