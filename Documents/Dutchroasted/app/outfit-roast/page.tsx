import { SeoLandingPage } from "@/components/SeoLandingPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Outfit Roast | Laat je outfit genadeloos beoordelen",
  description:
    "Benieuwd wat er echt van je outfit wordt gevonden? Upload je foto en ontvang een scherpe maar eerlijke outfit roast.",
  path: "/outfit-roast",
});

const sections = [
  {
    title: "Wat is een outfit roast?",
    paragraphs: [
      "Een outfit roast is een korte, grappige beoordeling van je kleding. Niet bedoeld om jou af te branden, maar om zichtbaar te maken waar een outfit zichzelf tegenspreekt. Misschien probeert een colbert zakelijk te zijn terwijl de sneakers al richting barbecue lopen. Of een broek kiest voor relaxed terwijl de bovenlaag duidelijk een afspraak in de agenda heeft. De humor ontstaat uit echte details in de foto.",
      "Bij Outfit Roaster geldt daarom één vaste regel: eerst observatie, dan humor. De roast mag scherp zijn, maar nooit willekeurig of persoonlijk. Er worden geen grappen gemaakt over lichaam, gezicht, leeftijd, gewicht, afkomst of aantrekkelijkheid. Alleen kleuren, kledingstukken, schoenen, accessoires, pasvorm en gelegenheid doen mee. Daardoor voelt een goede roast raak in plaats van gemeen.",
    ],
  },
  {
    title: "Waarom humor beter kan werken dan standaard modeadvies",
    paragraphs: [
      "Standaard modeadvies klinkt vaak voorzichtig: de combinatie kan misschien iets rustiger of een andere schoen zou eventueel beter passen. Dat is netjes, maar niet altijd duidelijk. Humor maakt het contrast concreter. Wanneer je hoort dat de schoenen niet in dezelfde groepsapp zitten als de rest van de outfit, begrijp je onmiddellijk waar de aandacht naartoe gaat. De grap blijft hangen en daardoor blijft het advies ook hangen.",
      "Een roast verlaagt bovendien de drempel om feedback te ontvangen. Kleding is persoonlijk, maar het hoeft niet zwaar te worden. Je kunt lachen om een vreemde combinatie en daarna besluiten of je iets verandert. Outfit Roaster geeft naast de roast ook een score, sterke punten en verbeteringen. De humor opent de deur; de concrete feedback helpt je vervolgens verder.",
    ],
  },
  {
    title: "Voorbeelden van outfit roasts",
    paragraphs: [
      "De beste outfit roasts zijn kort, herkenbaar en gebaseerd op wat daadwerkelijk zichtbaar is. Een nette bovenlaag met zeer sportieve schoenen kan leiden tot een vergelijking tussen teamoverleg en warming-up. Een outfit met veel verschillende stijlen kan voelen als een groepsproject met te veel projectleiders. Een kleuraccent dat nergens terugkomt kan worden beschreven als een collega die zonder uitnodiging bij de vergadering zit.",
      "Outfit Roaster maakt geen vaste grap die op iedere foto wordt geplakt. Eerst worden zichtbare kledingstukken geïdentificeerd. Daarna kijkt de AI naar contrast, gelegenheid en samenhang. De uiteindelijke shareQuote is maximaal twaalf woorden en bedoeld om direct begrijpelijk te zijn. Juist die korte zin maakt het resultaat geschikt voor een screenshot, groepsapp of story.",
    ],
    bullets: [
      "Een observatie over een zichtbaar kledingstuk.",
      "Een contrast tussen twee onderdelen of stijlen.",
      "Een vergelijking die logisch past bij de foto.",
      "Een punchline die de outfit raakt en niet de persoon.",
    ],
  },
  {
    title: "Veelgemaakte outfitfouten",
    paragraphs: [
      "Veel outfits gaan niet mis door één slecht kledingstuk. Het probleem zit meestal in de samenwerking. Schoenen kunnen te sportief zijn voor de gekozen bovenlaag. Meerdere kleuren kunnen aandacht vragen zonder dat één kleur de leiding neemt. Een wijde broek en ruime jas kunnen samen alle vorm uit het geheel halen. Of een outfit kan prima zijn, maar niet passen bij de gekozen gelegenheid.",
      "Andere veelvoorkomende punten zijn accessoires zonder duidelijke rol, verschillende niveaus van formaliteit en een pasvorm die per kledingstuk een ander verhaal vertelt. Outfit Roaster benoemt zulke botsingen zo concreet mogelijk. Daarbij wordt alleen verwezen naar kleding die op de foto is gedetecteerd. Als het type niet zeker is, gebruikt de feedback een veilige term zoals bovenlaag, broek, schoenen of accessoire.",
    ],
  },
  {
    title: "Van mild tot genadeloos",
    paragraphs: [
      "Niet iedereen wil dezelfde hoeveelheid vuur. Daarom kies je bij een Outfit Roast uit verschillende niveaus. Stijlcoach richt zich vooral op wat werkt en houdt de feedback positief. Pittig is directer en combineert scherpe Nederlandse humor met bruikbare verbeteringen. Genadeloos zoekt de sterkste punchlines en het grootste screenshotgehalte, maar blijft binnen dezelfde veiligheidsgrenzen.",
      "Het niveau verandert dus de toon, niet de regels. Ook Genadeloos mag nooit persoonlijk, discriminerend of hatelijk worden. De outfit is het onderwerp. Voor wie liever geen roast wil, bestaat Premium Verdict Beta. Dat is een veel langere, serieuze analyse van kleur, pasvorm, stijltype, context en trends zonder grappen.",
    ],
  },
  {
    title: "Waarom mensen hun outfit roast delen",
    paragraphs: [
      "Een lang stylingrapport kan nuttig zijn, maar een rake quote wordt gedeeld. Mensen herkennen zichzelf in twijfel over een outfit en sturen een goede roast graag door naar vrienden. Het resultaat voelt persoonlijk omdat het naar zichtbare details verwijst. Tegelijk blijft het luchtig genoeg om erom te lachen. Daarom bevat iedere roast één hoofdquote en twee alternatieven.",
      "Outfit Roaster maakt ook een verticale deelkaart die geschikt is voor Stories en Reels. De foto, score en gekozen quote staan samen in één beeld. Bij delen wordt de hashtag #outfitroaster toegevoegd aan de tekst, niet aan de quote zelf. Je quote blijft daardoor schoon en leesbaar. Delen is natuurlijk optioneel; je kunt het resultaat ook gewoon gebruiken om je outfit aan te passen.",
    ],
  },
];

const faqs = [
  {
    question: "Is een roast beledigend?",
    answer:
      "Nee. Outfit Roaster roast uitsluitend kleding en stylingkeuzes. Opmerkingen over lichaam, leeftijd, gewicht, afkomst, genderidentiteit of aantrekkelijkheid zijn niet toegestaan.",
  },
  {
    question: "Hoe werkt Outfit Roaster?",
    answer:
      "Je uploadt een duidelijke outfitfoto, kiest de gelegenheid en selecteert het roastniveau. Daarna ontvang je drie korte feedbackregels, een score, tips en deelbare quotes.",
  },
  {
    question: "Kan ik mijn roast delen?",
    answer:
      "Ja. Je kunt een verticale deelkaart genereren en via ondersteunde apps delen. Als bestandsdelen niet beschikbaar is, wordt de afbeelding gedownload en de deeltekst gekopieerd.",
  },
  {
    question: "Wat gebeurt er met mijn foto?",
    answer:
      "De foto wordt gebruikt om de outfit te analyseren en wordt door Outfit Roaster niet permanent opgeslagen. Bekijk de privacyverklaring voor de volledige uitleg.",
  },
];

export default function OutfitRoastPage() {
  return (
    <SeoLandingPage
      eyebrow="Nederlandse humor voor je kledingkast"
      title="Outfit Roast"
      intro={[
        "Soms heb je geen voorzichtig modeadvies nodig, maar één vriend die meteen ziet waarom je sneakers en colbert elkaar nog niet hebben gesproken. Met Outfit Roaster upload je een outfitfoto en ontvang je een scherpe, grappige en eerlijke roast.",
        "De humor is altijd gebaseerd op zichtbare kleding. We roastten de outfit, nooit de persoon. Je kiest zelf tussen Stijlcoach, Pittig en Genadeloos en krijgt daarnaast concrete sterke punten, verbeteringen en een deelbare quote.",
      ]}
      sections={sections}
      faqs={faqs}
      relatedLinks={[
        {
          href: "/ai-outfit-checker",
          label: "AI Outfit Checker",
          description: "Lees hoe AI kleding, kleuren, pasvorm en context analyseert.",
        },
        {
          href: "/outfit-beoordelen",
          label: "Outfit beoordelen",
          description: "Bekijk welke onderdelen bepalen of een outfit goed werkt.",
        },
        {
          href: "/",
          label: "Outfit Roaster",
          description: "Ga terug naar de homepage en ontdek alle outfitchecks.",
        },
      ]}
    />
  );
}
