# OutfitRoaster SEO-landingspagina's

Dit project gebruikt een datagedreven SEO-systeem voor kwalitatieve landingspagina's onder:

```text
/outfit-check/[slug]
```

De centrale dataset staat in:

```text
data/seo-v2-pages.ts
```

## Nieuwe pagina toevoegen

Voeg een nieuwe pagina toe via de `page(...)` helper of via dezelfde structuur als de bestaande
pagina's. Publiceer alleen als de zoekintentie duidelijk anders is dan bestaande pagina's.

Elke gepubliceerde pagina moet minimaal bevatten:

- `slug`
- `title`
- `description`
- `h1`
- `intro`
- minimaal 3 inhoudelijke `sections`
- minimaal 3 concrete `examples`
- minimaal 3 `mistakes`
- minimaal 4 checklist-items
- minimaal 3 FAQ-items
- minimaal 3 `relatedSlugs`
- `published: true`
- `lastModified`

De build faalt bewust als een gepubliceerde pagina belangrijke kwaliteitsvelden mist.

## Duplicate content voorkomen

Maak geen losse pagina's voor bijna identieke varianten zoals:

```text
/date-outfit-man
/date-outfit-heren
/date-outfit-mannen
```

Kies één sterke pagina, bijvoorbeeld:

```text
/outfit-check/date-outfit
```

Behandel subvarianten binnen de content. Een nieuwe pagina is alleen logisch als de gebruiker een
andere vraag heeft en de pagina zelfstandig waarde heeft.

## Canonical URL's

De primaire host is:

```text
https://www.outfitroaster.com
```

Gebruik canonical URL's in deze vorm:

```text
https://www.outfitroaster.com/outfit-check/[slug]
```

Oude root-landingspagina's redirecten naar de nieuwe geneste structuur om duplicate content te
voorkomen.

## Interne links

Iedere SEO-pagina linkt naar:

- de gratis uploadflow;
- 3 tot 6 relevante landingspagina's;
- de hub `/outfit-check`.

Gebruik duidelijke anchor text. Vermijd generieke teksten zoals "klik hier".

## Search Console gebruiken

Gebruik Google Search Console om nieuwe onderwerpen te kiezen:

1. Kijk naar queries met impressies maar lage CTR.
2. Controleer of de zoekintentie al goed wordt bediend.
3. Voeg alleen een nieuwe pagina toe als bestaande pagina's de intentie niet dekken.
4. Werk liever bestaande pagina's bij dan bijna-identieke varianten te publiceren.

## Publicatiecheck

Voor iedere SEO-wijziging:

```text
npm run build
```

Controleer daarna:

- canonical klopt;
- sitemap bevat alleen canonical URL's;
- pagina is mobiel leesbaar;
- CTA linkt naar `/outfit-check`;
- FAQ is zichtbaar als er FAQ structured data wordt gebruikt.
