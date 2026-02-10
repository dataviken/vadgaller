Vadgäller – Produkt- och systembeskrivning
==========================================

1. Bakgrund och problem
-----------------------

I de flesta svenska företag, särskilt inom retail, logistik, industri och tjänstesektor, uppstår dagligen återkommande frågor från anställda kring:

- lön (utbetalningsdag, OB, revision, procent)
- arbetstid, schema, flex, övertid
- semester, sjukfrånvaro, VAB
- kollektivavtal
- interna rutiner (sjukanmälan, ledighetsansökan, kontaktvägar)

Denna information:

- finns ofta utspridd i personalhandböcker, PDF:er, Word-filer, Excel, intranät eller i chefers huvud
- är ofta inaktuell eller okänd för nyanställda
- leder till hög belastning på chefer och HR
- är svåråtkomlig för personal utan företagsmail eller dator

Målet med Vadgäller är att skapa en enda sanningskälla där anställda enkelt kan fråga “Vad gäller?” och få samma, korrekta svar – varje gång.

2. Övergripande produktidé
--------------------------

Vadgäller är en webbaserad tjänst som ger varje företag:

- en unik, ogissningsbar länk (och QR-kod)
- en PIN-skyddad chatt

som svarar på frågor baserat på:

- företagets egna dokument
- företagets officiella svar
- företagsspecifika regler och kollektivavtal

Tjänsten ska:

- fungera utan inloggning eller mail
- fungera på mobil
- vara extremt enkel för anställda
- vara helt självadministrerbar för företaget

3. Målgrupper
-------------

### 3.1 Anställda (primär användare)

Ska kunna:

- skanna QR-kod eller gå till länk
- slå in PIN
- ställa frågor i naturligt språk

Ska inte:

- behöva konto
- behöva e-post
- se menyer, inställningar eller annan komplexitet

### 3.2 Företagsadmin (HR / chef / kontor)

Ska kunna:

- skapa och administrera företagets instans
- ladda upp dokument (PDF, Word, Excel, text)
- skriva egna officiella svar
- se obesvarade frågor
- styra notifieringar
- byta PIN och länk

Ska inte behöva teknisk kompetens.

4. Åtkomst och säkerhet
-----------------------

### 4.1 Företagsinstans

Varje företag får:

- en unik slug/token: `/x7Kp92aL`
  - som inte ska gå att gissa
  - kopplad till företagets data

### 4.2 PIN-skydd

- PIN på 4–6 siffror
- krävs för att komma in i chatten
- kan bytas av admin
- enkel men tydlig säkerhetsnivå

5. Anställdvy – användarflöde
-----------------------------

### 5.1 PIN-sida

- Minimal sida
- Företagsnamn (och logga om valt)
- 4 PIN-rutor
- Auto-submit
- Tydlig feltext vid fel PIN

### 5.2 Chattsida

- Liknande ChatGPT/Google i känsla
- Stor textinput längst ner (sticky)
- Förslag (chips) på vanliga frågor
- Svar visas i kort (cards)

Varje svar ska visa:

- själva svaret
- källa (t.ex. “Personalhandbok”, “Officiellt svar HR”)

### 5.3 Svarsregler (viktigt)

AI:n får aldrig gissa.

Svar ska ges i denna ordning:

1. Officiella svar som admin lagt in
2. Tolkning av uppladdade dokument
3. Om inget finns:
   - visa standardtext
   - erbjuda “Kontakta HR”

6. Adminvy – funktioner
-----------------------

### 6.1 Grundinställningar

- Företagsnamn
- Logga (valfri)
- Kontaktmail till HR/admin
- Fakturauppgifter (senare)

### 6.2 Åtkomst

- Skapa/rotera länk
- Skapa/ändra PIN
- Generera QR-kod
- Ladda ner A4-blad med:
  - QR-kod
  - företagsnamn
  - valfri text
  - “vadgäller.se” som avsändare

### 6.3 Innehåll

- Ladda upp dokument:
  - PDF
  - Word
  - Excel
  - fritext
- Redigera eller ta bort dokument
- Lägga in officiella svar (FAQ)
- Märka svar som “prioriterade”

### 6.4 Inkomna frågor

- Lista på frågor som saknar svar

Admin kan:

- skriva svar
- markera som officiellt

Notifieringar via e-post:

- valbart
- till en eller flera admins

7. Demo
-------

`/demo` ska visa en helt öppen demo med:

- Företagsnamn: “Vadgäller”
- Mock-data
- Exempelfrågor och svar
- Ingen PIN

Syfte:

- sälj
- onboarding
- marknadsföring
- QR-utskick

8. Designprinciper
------------------

- Ljust tema
- Mobil först
- Maxbredd 720px på desktop
- Väldigt få färger
- Fokus på text och tydlighet
- Ingen “app-känsla”, mer “verktyg”

9. Teknik – principer (inte implementation)
-------------------------------------------

- Molnbaserad
- Ingen lokal installation

Frontend:

- modern React/Next-stack

Backend:

- API-driven
- AI med tydliga guardrails

Dokumenthantering:

- RAG (retrieval-baserat)

All känslig konfiguration via environment variables.

Skalbar per företag (multi-tenant).

10. Affärsmodell (framåtblick)
------------------------------

- Gratis testperiod (30 dagar)
- Därefter abonnemang per företag

Prissättning baserad på:

- antal anställda
- eller fast pris per månad

Inga kostnader per användare.

11. Viktig produktprincip
-------------------------

Vadgäller ska aldrig vara “en chatbot som svarar lite på allt”.
Det ska vara företagets röst, konsekvent, korrekt och trygg.

