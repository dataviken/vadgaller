import { NextRequest, NextResponse } from "next/server";
import {
  ChatRequestPayload,
  ChatResponsePayload,
  Company,
  FaqEntry,
} from "../../../lib/domain";

// Mockad företags- och FAQ-data för demo.
// I en riktig implementation hämtas detta från databasen per företag.
const MOCK_COMPANIES: Company[] = [
  {
    id: "company-demo",
    slug: "test",
    name: "Vadgäller Demo",
    hrEmail: "hr@example.com",
  },
];

const MOCK_FAQ: FaqEntry[] = [
  {
    id: "faq-salary-date",
    companyId: "company-demo",
    question: "När betalas lönen?",
    answer:
      "Lönen betalas ut den 25:e varje månad, eller närmaste vardag innan.",
    sourceLabel: "Officiellt svar HR",
    category: "Lön",
    showAsSuggestion: true,
  },
  {
    id: "faq-sick-leave",
    companyId: "company-demo",
    question: "Hur sjukanmäler jag mig?",
    answer:
      "Du sjukanmäler dig genom att meddela din närmaste chef före arbetspassets start.",
    sourceLabel: "Officiellt svar HR",
    category: "Frånvaro",
    showAsSuggestion: true,
  },
  {
    id: "faq-flex",
    companyId: "company-demo",
    question: "Hur funkar flex?",
    answer:
      "Flex regleras enligt företagets flextidspolicy. Se personalhandboken för exakta ramar.",
    sourceLabel: "Officiellt svar HR",
    category: "Arbetstid",
    showAsSuggestion: true,
  },
  {
    id: "faq-vacation",
    companyId: "company-demo",
    question: "Hur funkar semester?",
    answer:
      "Semester tjänas in enligt semesterlagen och eventuellt kollektivavtal. Detaljer om antal dagar och uttag finns i personalhandboken.",
    sourceLabel: "Officiellt svar HR",
    category: "Semester",
    showAsSuggestion: true,
  },
  {
    id: "faq-ob-overtime",
    companyId: "company-demo",
    question: "Vad gäller för OB och övertid?",
    answer:
      "Regler och ersättning för OB och övertid styrs av ert kollektivavtal. Se avsnittet om arbetstid och ersättningar i kollektivavtalet.",
    sourceLabel: "Officiellt svar HR",
    category: "Lön",
    showAsSuggestion: true,
  },
  {
    id: "faq-vab",
    companyId: "company-demo",
    question: "Hur funkar VAB?",
    answer:
      "Vid VAB anmäler du frånvaron enligt företagets rutin och ansöker om ersättning från Försäkringskassan. Se personalhandboken för exakt rutin.",
    sourceLabel: "Officiellt svar HR",
    category: "Frånvaro",
    showAsSuggestion: true,
  },
  {
    id: "faq-parental-leave",
    companyId: "company-demo",
    question: "Vad gäller för föräldraledighet?",
    answer:
      "Föräldraledighet följer föräldraledighetslagen och eventuellt förstärkta villkor i kollektivavtalet. Se personalhandbokens avsnitt om föräldraledighet.",
    sourceLabel: "Officiellt svar HR",
    category: "Ledighet",
    showAsSuggestion: true,
  },
  {
    id: "faq-wellness",
    companyId: "company-demo",
    question: "Har vi friskvårdsbidrag?",
    answer:
      "Information om friskvårdsbidrag, belopp och hur du använder det finns i personalhandboken under förmåner.",
    sourceLabel: "Officiellt svar HR",
    category: "Förmåner",
    showAsSuggestion: true,
  },
  {
    id: "faq-pension",
    companyId: "company-demo",
    question: "Vad händer med min tjänstepension?",
    answer:
      "Tjänstepensionen regleras av ert kollektivavtal och de avtal arbetsgivaren har med pensionsbolag. Se avsnittet om pension i kollektivavtalet.",
    sourceLabel: "Officiellt svar HR",
    category: "Pension",
    showAsSuggestion: true,
  },
  {
    id: "faq-notice-period",
    companyId: "company-demo",
    question: "Vad gäller för uppsägningstid?",
    answer:
      "Uppsägningstid beror på anställningsform, anställningstid och kollektivavtal. Exakta tider framgår av ditt anställningsavtal och kollektivavtalet.",
    sourceLabel: "Officiellt svar HR",
    category: "Anställningsvillkor",
    showAsSuggestion: true,
  },
];

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function findCompanyBySlug(slug: string): Company | undefined {
  return MOCK_COMPANIES.find((c) => c.slug === slug);
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ChatResponsePayload>> {
  const body = (await request.json()) as ChatRequestPayload | null;

  if (!body || !body.companySlug || !body.question) {
    return NextResponse.json(
      {
        answer:
          "Jag hittar inget officiellt svar eller stöd i era dokument ännu. Kontakta HR så att ett officiellt svar kan läggas till.",
        source: "Standardtext (saknas)",
        origin: "fallback",
      },
      { status: 400 }
    );
  }

  const company = findCompanyBySlug(body.companySlug);

  if (!company) {
    // Ingen matchande instans – svara med standardtext.
    return NextResponse.json(
      {
        answer:
          "Jag hittar inget officiellt svar eller stöd i era dokument ännu. Kontakta HR så att ett officiellt svar kan läggas till.",
        source: "Standardtext (saknas)",
        origin: "fallback",
      },
      { status: 200 }
    );
  }

  const questionNorm = normalize(body.question);

  // 1) Försök hitta ett officiellt FAQ-svar (ingen AI-gissning).
  const faqMatch = MOCK_FAQ.find(
    (faq) =>
      faq.companyId === company.id && normalize(faq.question) === questionNorm
  );

  if (faqMatch) {
    return NextResponse.json(
      {
        answer: faqMatch.answer,
        source: faqMatch.sourceLabel,
        origin: "faq",
        matchedFaqId: faqMatch.id,
      },
      { status: 200 }
    );
  }

  // 2) Här ska dokumentbaserade svar (RAG) in i framtiden.
  // Just nu hoppar vi direkt till punkt 3.

  // 3) Standardtext + "Kontakta HR" när inget finns.
  return NextResponse.json(
    {
      answer:
        "Jag hittar inget officiellt svar eller stöd i era dokument ännu. Kontakta HR så att ett officiellt svar kan läggas till.",
      source: "Standardtext (saknas)",
      origin: "fallback",
    },
    { status: 200 }
  );
}

