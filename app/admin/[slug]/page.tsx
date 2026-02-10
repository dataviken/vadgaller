"use client";

import Image from "next/image";
import { useState } from "react";

type AdminTab = "settings" | "access" | "content" | "questions";

export default function AdminPage({
  params,
}: {
  params: { slug: string };
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("settings");

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-4 sm:py-6">
        {/* Header */}
        <header className="mb-3 flex items-center justify-between sm:mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900">
              <Image
                src="/vadgaller-logo.svg"
                alt="Vadgäller logotyp"
                width={20}
                height={20}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Admin · {params.slug}
              </span>
              <h1 className="text-base font-semibold text-zinc-900 sm:text-lg">
                Vadgäller admin
              </h1>
              <p className="text-xs text-zinc-500">
                Hantera inställningar, åtkomst, innehåll och frågor.
              </p>
            </div>
          </div>
          <span className="hidden text-xs text-zinc-400 sm:inline">
            Endast för HR/admin
          </span>
        </header>

        {/* Tabs */}
        <nav className="flex gap-2 rounded-full border border-zinc-200 bg-white px-2 py-1 text-xs shadow-sm">
          {[
            { id: "settings", label: "Inställningar" },
            { id: "access", label: "Åtkomst" },
            { id: "content", label: "Innehåll" },
            { id: "questions", label: "Inkomna frågor" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`rounded-full px-3 py-1 ${
                activeTab === tab.id
                  ? "bg-zinc-900 text-zinc-50"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="mt-4 flex-1 overflow-y-auto">
          {activeTab === "settings" && <SettingsSection />}
          {activeTab === "access" && <AccessSection />}
          {activeTab === "content" && <ContentSection />}
          {activeTab === "questions" && <QuestionsSection />}
        </main>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-zinc-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function SettingsSection() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  return (
    <>
      <SectionCard
        title="Grundinställningar"
        description="Grunduppgifter som visas för anställda och används i material."
      >
        <div className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">
              Företagsnamn
            </label>
            <input
              type="text"
              placeholder="Ex: Testkund"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10"
              disabled
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-700">
              Logga (valfri)
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="company-logo-upload"
                className="inline-flex cursor-pointer items-center rounded-full border border-dashed border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 hover:border-zinc-400"
              >
                Välj bild…
              </label>
              <input
                id="company-logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              {logoPreview && (
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                  <img
                    src={logoPreview}
                    alt="Förhandsvisning av logga"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
            </div>
            <p className="text-[10px] text-zinc-400">
              Detta är en förhandsvisning i admin och sparas inte ännu. I en
              senare version lagras loggan per företag.
            </p>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">
              Kontaktmail till HR/admin
            </label>
            <input
              type="email"
              placeholder="hr@foretag.se"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10"
              disabled
            />
          </div>
        </div>
      </SectionCard>
    </>
  );
}

function AccessSection() {
  return (
    <>
      <SectionCard
        title="Länk och slug"
        description="Ogissningsbar länk kopplad till företagets data."
      >
        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">
              Länk till anställdvy
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value="https://vadgäller.se/x7Kp92aL"
                readOnly
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700"
              />
              <button
                type="button"
                className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
              >
                Kopiera
              </button>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
          >
            Rotera länk (mock)
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="PIN-kod"
        description="Enkel men tydlig säkerhetsnivå till chatten."
      >
        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-700">
              Aktuell PIN (4–6 siffror)
            </label>
            <input
              type="password"
              value="1234"
              readOnly
              className="w-32 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-center text-sm tracking-[0.3em]"
            />
          </div>
          <button
            type="button"
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
          >
            Ändra PIN (mock)
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="QR-kod och A4-blad"
        description="Material för att sätta upp i personalutrymmen."
      >
        <div className="space-y-3 text-sm">
          <div className="h-28 w-28 rounded-lg border border-dashed border-zinc-300 bg-zinc-50" />
          <button
            type="button"
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
          >
            Ladda ner A4-blad (mock)
          </button>
        </div>
      </SectionCard>
    </>
  );
}

function ContentSection() {
  return (
    <>
      <SectionCard
        title="Dokument"
        description="Ladda upp de dokument (personalhandbok, policys, kollektivavtal m.m.) som AI ska kunna använda som underlag."
      >
        <div className="space-y-3 text-sm">
          <button
            type="button"
            className="rounded-full border border-dashed border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
          >
            Ladda upp dokument (mock)
          </button>
          <ul className="space-y-2 text-xs text-zinc-700">
            <li className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span>Personalhandbok 2024.pdf</span>
              <span className="text-[10px] uppercase text-zinc-500">
                PDF · 2 MB
              </span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span>Lönepolicy 2024-01-01.docx</span>
              <span className="text-[10px] uppercase text-zinc-500">
                DOCX · 240 kB
              </span>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span>Kollektivavtal 2023.pdf</span>
              <span className="text-[10px] uppercase text-zinc-500">
                PDF · 1,2 MB
              </span>
            </li>
          </ul>
        </div>
      </SectionCard>

      <SectionCard
        title="Officiella förtydliganden (fritext)"
        description="Skriv in sådant som inte finns i dokumenten eller som ska gälla istället. Vid konflikt är denna text master framför innehållet i dokumenten."
      >
        <div className="space-y-3 text-sm">
          <p className="text-xs text-zinc-600">
            Tänk på detta som företagets egna “facit”-text. När tjänsten är
            fullt utbyggd kommer Vadgäller först att läsa här, sedan i
            uppladdade dokument. Om samma sak står på två ställen är det
            förtydligandet här som gäller.
          </p>
          <textarea
            rows={6}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-800 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10"
            placeholder="Ex: Vi tillämpar alltid minst 3 månaders uppsägningstid för tillsvidareanställda, även om kollektivavtalet anger kortare tid i vissa fall. Detta gäller före texten i personalhandboken."
            disabled
          />
          <p className="text-[10px] text-zinc-400">
            Detta är en mockvy. I en senare version kommer denna fritext att
            sparas per företag och användas som primär källa före
            dokumentunderlaget.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Officiella svar (FAQ)"
        description="Svar som alltid prioriteras framför dokument när anställda frågar."
      >
        <div className="space-y-3 text-sm">
          <button
            type="button"
            className="rounded-full border border-dashed border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
          >
            Lägg till officiellt svar (mock)
          </button>
          <ul className="space-y-2 text-xs text-zinc-700">
            <li className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="font-medium">När betalas lönen?</p>
              <p className="mt-1 text-[11px] text-zinc-600">
                Lönen betalas ut den 25:e varje månad, eller närmaste vardag
                innan.
              </p>
              <p className="mt-1 text-[10px] uppercase text-zinc-500">
                PRIORITERAT · Lön
              </p>
            </li>
            <li className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="font-medium">Hur sjukanmäler jag mig?</p>
              <p className="mt-1 text-[11px] text-zinc-600">
                Du sjukanmäler dig enligt företagets sjukanmälningsrutin. Se
                personalhandboken under Frånvaro.
              </p>
              <p className="mt-1 text-[10px] uppercase text-zinc-500">
                PRIORITERAT · Frånvaro
              </p>
            </li>
            <li className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="font-medium">Hur funkar semester?</p>
              <p className="mt-1 text-[11px] text-zinc-600">
                Regler för intjäning och uttag av semester finns i
                personalhandboken och i kollektivavtalet.
              </p>
              <p className="mt-1 text-[10px] uppercase text-zinc-500">
                PRIORITERAT · Semester
              </p>
            </li>
            <li className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="font-medium">Har vi friskvårdsbidrag?</p>
              <p className="mt-1 text-[11px] text-zinc-600">
                Information om friskvårdsbidrag, belopp och vad som ingår finns
                i personalhandboken under Förmåner.
              </p>
              <p className="mt-1 text-[10px] uppercase text-zinc-500">
                PRIORITERAT · Förmåner
              </p>
            </li>
          </ul>
        </div>
      </SectionCard>

      <SectionCard
        title="Mall med vanliga HR-frågor"
        description="En checklista över frågor du kan välja att besvara för att göra Vadgäller så träffsäker som möjligt. Alla är frivilliga."
      >
        <div className="space-y-3 text-xs text-zinc-700">
          <div>
            <p className="font-semibold">
              Generella HR-frågor – Företagsgemensam FAQ
            </p>
          </div>

          <div>
            <p className="mb-1 font-semibold">Anställning & villkor</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Vilka anställningsformer tillämpas på företaget?</li>
              <li>Hur lång är uppsägningstiden vid egen uppsägning?</li>
              <li>
                Hur lång är uppsägningstiden vid uppsägning från arbetsgivarens
                sida?
              </li>
              <li>Tillämpar företaget provanställning?</li>
              <li>När övergår en provanställning till tillsvidareanställning?</li>
              <li>Kan arbetsuppgifter ändras inom ramen för anställningen?</li>
              <li>Vilket kollektivavtal omfattas företaget av?</li>
              <li>Hur hanteras förändringar vid omorganisation?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Personuppgifter & GDPR</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Vilka personuppgifter behandlar företaget om anställda?</li>
              <li>I vilket syfte behandlas personuppgifter?</li>
              <li>Hur länge sparas personaluppgifter?</li>
              <li>Vilka system lagrar personaldata?</li>
              <li>Vem ansvarar för personuppgiftshanteringen?</li>
              <li>Hur hanteras personuppgifter vid avslutad anställning?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Försäkringar & pension</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Vilka försäkringar omfattas anställda av?</li>
              <li>Ingår tjänstepension på företaget?</li>
              <li>När börjar tjänstepensionen gälla?</li>
              <li>Hur stora är pensionsavsättningarna?</li>
              <li>Vilken försäkringsgivare används?</li>
              <li>Hur hanteras arbetsskador?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Lön & ersättning</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>När betalas lön ut?</li>
              <li>Hur ofta sker löneutbetalning?</li>
              <li>Hur genomförs lönerevision på företaget?</li>
              <li>Är lönerevisionen individuell eller generell?</li>
              <li>Vilken procentsats gäller vid årets lönerevision?</li>
              <li>Hur hanteras övertid och mertid?</li>
              <li>Vilka OB-ersättningar tillämpas?</li>
              <li>Ersätts restid i tjänsten?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Förmåner & personalförmåner</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Vilka personalförmåner erbjuder företaget?</li>
              <li>Finns friskvårdsbidrag och hur stort är det?</li>
              <li>Erbjuds personalrabatter?</li>
              <li>Tillhandahåller företaget arbetsdator och mobil?</li>
              <li>Erbjuds terminalglasögon?</li>
              <li>Finns möjlighet till löneväxling?</li>
              <li>Erbjuds gymkort eller träningsförmåner?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">
              Distansarbete & arbetsutrustning
            </p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Tillåter företaget distansarbete?</li>
              <li>I vilken omfattning kan hemarbete ske?</li>
              <li>Finns ersättning för hemmakontor?</li>
              <li>Vem ansvarar för arbetsmiljön vid distansarbete?</li>
              <li>Vad gäller för utrustning vid hemarbete?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Arbetstid & ledighet</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Vilka arbetstidsmodeller tillämpas på företaget?</li>
              <li>Finns flextid?</li>
              <li>Hur många semesterdagar har anställda på företaget?</li>
              <li>Hur fördelas semesterdagar mellan olika yrkesgrupper?</li>
              <li>När ska semester planeras och godkännas?</li>
              <li>Hur hanteras sparad semester?</li>
              <li>Vilka röda dagar är arbetsfria?</li>
              <li>Finns extra lediga dagar utöver lagstadgad semester?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Sjukdom & föräldraledighet</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Hur anmäls sjukfrånvaro?</li>
              <li>Hur länge betalas sjuklön av arbetsgivaren?</li>
              <li>När krävs läkarintyg?</li>
              <li>Hur hanteras längre sjukfrånvaro?</li>
              <li>Hur fungerar föräldraledighet på företaget?</li>
              <li>Finns kompletterande ersättning vid föräldraledighet?</li>
              <li>Hur hanteras VAB?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Resor & utlägg</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Vad räknas som tjänsteresa?</li>
              <li>Hur bokas tjänsteresor?</li>
              <li>Hur redovisas utlägg?</li>
              <li>Vilka kostnader ersätts?</li>
              <li>Hur lång tid tar återbetalning av utlägg?</li>
              <li>Används företagsbil eller privat bil i tjänst?</li>
              <li>Vilka resepolicyer gäller?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Arbetsmiljö & hälsa</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Hur arbetar företaget med arbetsmiljö?</li>
              <li>Vem ansvarar för arbetsmiljöfrågor?</li>
              <li>Hur rapporteras arbetsskador och tillbud?</li>
              <li>Finns tillgång till företagshälsovård?</li>
              <li>Hur hanteras ergonomi på arbetsplatsen?</li>
              <li>Hur arbetar företaget mot diskriminering och trakasserier?</li>
              <li>Finns rutiner för krisstöd?</li>
              <li>Hur hanteras alkohol- och drogrelaterade frågor?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Avslut & offboarding</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Hur går en uppsägning till?</li>
              <li>När börjar uppsägningstiden gälla?</li>
              <li>Vad gäller för arbete under uppsägningstid?</li>
              <li>Hur hanteras semester vid uppsägning?</li>
              <li>När betalas slutlön ut?</li>
              <li>Utfärdas arbetsgivarintyg?</li>
              <li>Hur genomförs exitintervju?</li>
              <li>När ska arbetsutrustning lämnas tillbaka?</li>
            </ul>
          </div>

          <div>
            <p className="mb-1 font-semibold">Övriga vanliga policyfrågor</p>
            <ul className="list-disc space-y-0.5 pl-4">
              <li>Finns policy för bisysslor?</li>
              <li>Vad gäller för sociala medier?</li>
              <li>Finns visselblåsarfunktion?</li>
              <li>Hur hanteras sekretess och tystnadsplikt?</li>
              <li>Finns möjlighet till tillfälligt arbete utomlands?</li>
              <li>Hur hanteras konflikter på arbetsplatsen?</li>
            </ul>
          </div>
        </div>
      </SectionCard>
    </>
  );
}

function QuestionsSection() {
  return (
    <>
      <SectionCard
        title="Obesvarade frågor"
        description="Frågor där AI inte hittat något officiellt svar eller stöd i dokumenten."
      >
        <div className="space-y-3 text-sm">
          <ul className="space-y-2 text-xs text-zinc-700">
            <li className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="font-medium">
                “Hur funkar friskvårdsbidraget hos oss?”
              </p>
              <p className="mt-1 text-[11px] text-zinc-600">
                Inget officiellt svar inlagt ännu.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[11px] text-zinc-700 hover:bg-zinc-50"
                >
                  Skriv svar (mock)
                </button>
                <button
                  type="button"
                  className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[11px] text-zinc-700 hover:bg-zinc-50"
                >
                  Markera som officiellt (mock)
                </button>
              </div>
            </li>
          </ul>
          <p className="text-[11px] text-zinc-500">
            När du markerar ett svar som officiellt kommer det att prioriteras
            framför dokument när anställda frågar liknande saker.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Notifieringar"
        description="Styr om och hur admins får e-post när nya obesvarade frågor kommer in."
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-700">
              Skicka mail vid nya obesvarade frågor
            </span>
            <button
              type="button"
              className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
            >
              Konfigurera (mock)
            </button>
          </div>
          <p className="text-[11px] text-zinc-500">
            E-postadresser och frekvens styrs här. Detta är en mockvy utan
            backend-koppling.
          </p>
        </div>
      </SectionCard>
    </>
  );
}

