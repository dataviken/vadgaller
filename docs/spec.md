# Vadgäller – Spec v1

## Mål
En enkel chatt där anställda kan fråga “vad gäller?” och få svar baserat på företagets godkända underlag.

## Åtkomst
- Varje företag har en unik ogissningsbar länk: /{slug_token}
- PIN krävs (4–6 siffror). Admin kan byta PIN och rotera länk.

## Anställdvy
- PIN-sida → chat-sida.
- Svar ska vara kort och visa källa.

## Svarsordning (AI får aldrig gissa)
1) Officiella svar (admin/FAQ)
2) Dokumentbaserat svar (RAG)
3) Saknas: standardtext + “Kontakta HR”

## Demo
- /demo visar demo för “Vadgäller” med exempelchips och mock-svar.

## Admin (senare)
- Skapa länk/QR, byt PIN
- Ladda upp dokument
- Officiella svar (FAQ)
- Inkomna frågor + mailnotis (valfritt)

