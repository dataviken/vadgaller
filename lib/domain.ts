export type CompanyId = string;

export interface Company {
  id: CompanyId;
  slug: string;
  name: string;
  hrEmail?: string;
  logoUrl?: string;
}

export interface DocumentMeta {
  id: string;
  companyId: CompanyId;
  title: string;
  type: "pdf" | "word" | "excel" | "text";
  sourceLabel: string;
}

export interface FaqEntry {
  id: string;
  companyId: CompanyId;
  question: string;
  answer: string;
  sourceLabel: string; // t.ex. "Officiellt svar HR"
  category?: string; // t.ex. "Lön", "Frånvaro", "Förmåner"
  showAsSuggestion?: boolean; // om den ska visas som chip i UI
}

export type QuestionStatus = "unanswered" | "answered";

export interface QuestionLog {
  id: string;
  companyId: CompanyId;
  question: string;
  createdAt: string;
  status: QuestionStatus;
  answeredByFaqId?: string;
  answeredByDocuments?: string[]; // DocumentMeta.id
}

export interface ChatRequestPayload {
  companySlug: string;
  question: string;
}

export type ChatAnswerOrigin = "faq" | "document" | "fallback";

export interface ChatResponsePayload {
  answer: string;
  source: string;
  origin: ChatAnswerOrigin;
  matchedFaqId?: string;
  documentReferences?: Array<{ id: string; title: string }>;
}

