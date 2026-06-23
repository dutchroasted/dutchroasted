import { SeoLandingPage } from "@/components/SeoLandingPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "AI Outfit Checker | Gratis outfit laten beoordelen",
  description:
    "Upload je outfit en ontvang direct eerlijke feedback over stijl, pasvorm, kleuren en uitstraling. Gratis AI Outfit Checker van OutfitRoaster.",
  path: "/ai-outfit-checker",
});

const sections = [
  {
    title: "Wat is een AI outfit checker?",
    paragraphs: [
      "Een AI outfit checker bekijkt een foto van je kleding en vertaalt zichtbare details naar begrijpelijke feedback. Denk aan de combinatie van kleuren, de verhouding tussen een bovenlaag en broek, de rol van schoenen en de indruk die het geheel maakt. Het doel is niet om te bepalen of iemand mooi is. Een goede outfitchecker kijkt alleen naar kleding, styling en de context waarin je de outfit wilt dragen.",
      "Outfit Roaster voegt daar een duidelijke Nederlandse toon aan toe. Je krijgt geen vaag rapport vol moeilijke modetermen, maar een helder verdict. In de gratis roast gebeurt dat kort en met humor. In Premium Verdict Beta krijg je een veel uitgebreidere analyse van kleur, pasvorm, stijl, gelegenheid en trends. Daardoor kun je de tool gebruiken voor een snelle realitycheck én voor serieuzere outfitkeuzes.",
    ],
  },
  {
    title: "Hoe werkt Outfit Roaster?",
    paragraphs: [
      "Je begint met een duidelijke foto waarop je outfit zo volledig mogelijk zichtbaar is. Daarna kies je voor wie de feedback wordt geschreven, waar je de outfit wilt dragen en welke toon je prettig vindt. Voor de snelle Outfit Roast kies je bijvoorbeeld Stijlcoach, Pittig of Genadeloos. Wie meer details wil, kan Premium Verdict Beta selecteren. Die uitgebreide versie is tijdens de beta tijdelijk gratis te testen.",
      "De foto wordt vervolgens geanalyseerd op zichtbare kledingstukken en accessoires. Outfit Roaster maakt eerst een inventaris, zodat een overhemd niet zomaar een vest wordt en schoenen niet worden verzonnen. Daarna wordt de feedback opgebouwd. Je ontvangt het resultaat direct in je browser. Outfitfoto’s worden door Outfit Roaster niet permanent opgeslagen. Meer informatie daarover staat in de privacyverklaring.",
    ],
  },
  {
    title: "Waar kijkt de AI naar?",
    paragraphs: [
      "Een outfit bestaat uit meer dan losse kledingstukken. De AI kijkt daarom naar het samenspel. Een donkerblauwe broek kan op zichzelf prima zijn, maar krijgt een andere uitstraling naast felgekleurde sneakers dan naast nette schoenen. Ook een goed kledingstuk kan minder sterk overkomen wanneer de pasvorm of gelegenheid niet klopt. De beoordeling probeert juist die onderlinge relaties zichtbaar te maken.",
    ],
    bullets: [
      "Stijl: welke richting de outfit uitgaat en of alle onderdelen hetzelfde verhaal vertellen.",
      "Kleurgebruik: welke kleuren elkaar versterken, waar contrast werkt en waar kleuren botsen.",
      "Pasvorm: hoe kleding valt, hoe de verhoudingen ogen en of een andere snit sterker zou zijn.",
      "Gelegenheid: of de outfit past bij Date, Werk, School, Gym, Feest of Festival.",
      "Details: de invloed van schoenen, accessoires, lagen en zichtbare materialen.",
      "Vibe: de eerste indruk van het geheel, zonder de persoon zelf te beoordelen.",
    ],
  },
  {
    title: "Stijl, kleurgebruik en pasvorm",
    paragraphs: [
      "Stijl gaat niet alleen over het volgen van trends. Het gaat vooral om samenhang. Een minimalistische outfit werkt wanneer kleuren, vormen en details rustig op elkaar aansluiten. Smart casual vraagt juist om een geloofwaardige mix van verzorgd en ontspannen. Sportieve onderdelen kunnen prima buiten de sportschool werken, zolang ze bewust gecombineerd zijn. De AI benoemt welke stijlrichting zichtbaar is en waar verschillende richtingen elkaar helpen of tegenwerken.",
      "Bij kleurgebruik wordt gekeken naar herhaling, contrast en balans. Een neutrale basis kan sterker worden door één duidelijke accentkleur. Meerdere opvallende kleuren kunnen ook werken, maar hebben meer samenhang nodig. Bij pasvorm kijkt Outfit Roaster naar hoe zichtbaar textiel valt. Een broek kan te ruim ogen tegenover een strakke bovenlaag, terwijl een jas juist extra vorm kan geven. De feedback blijft bij de kleding en doet geen uitspraken over je lichaam.",
    ],
  },
  {
    title: "Waarom de gelegenheid verschil maakt",
    paragraphs: [
      "Dezelfde outfit kan uitstekend zijn voor school en minder overtuigend voor een sollicitatie. Daarom kies je vooraf de gelegenheid. Bij Werk ligt de nadruk op verzorgdheid, geloofwaardigheid en professionaliteit. Voor een Date telt de eerste indruk mee, zonder aantrekkelijkheid te beoordelen. Gym vraagt om praktisch en sportief, terwijl Feest en Festival meer ruimte geven voor expressie, opvallende details en comfort tijdens een lange avond.",
      "Context voorkomt standaardadvies. Een leren schoen is niet automatisch beter dan een sneaker. Dat hangt af van het doel van de outfit. Door de setting mee te nemen, wordt de feedback bruikbaarder. Je krijgt geen algemeen oordeel over je kledingkast, maar een antwoord op een concretere vraag: werkt deze combinatie voor wat ik vandaag van plan ben?",
    ],
  },
  {
    title: "Waarom mensen hun outfit laten beoordelen",
    paragraphs: [
      "Twijfel over een outfit ontstaat vaak vlak voordat je de deur uit moet. Je ziet de kleding dan al zo lang dat kleine botsingen niet meer opvallen. Een frisse blik kan helpen om te zien dat de schoenen een andere richting kiezen, dat één kleur te veel aandacht vraagt of dat de pasvormen elkaar niet ondersteunen. Dat betekent niet dat je elk advies moet volgen. Het geeft je extra informatie waarmee je zelf kunt kiezen.",
      "Mensen gebruiken een outfitchecker ook voor inspiratie, bevestiging en plezier. Een scherpe roast kan precies benoemen waarom een combinatie rommelig voelt. Een positieve Stijlcoach-feedback kan duidelijk maken wat al goed werkt. En Premium Verdict Beta geeft een uitgebreider verslag voor wie gericht wil verbeteren. Het resultaat is persoonlijk genoeg om nuttig te zijn, maar blijft altijd over de outfit gaan.",
    ],
  },
];

const faqs = [
  {
    question: "Is de AI outfit checker gratis?",
    answer:
      "Ja. Outfit Roaster biedt dagelijks vijf gratis Outfit Roasts. Premium Verdict Beta is momenteel tijdelijk gratis te testen en telt niet mee als gewone roast.",
  },
  {
    question: "Hoe beoordeelt de AI mijn outfit?",
    answer:
      "De AI identificeert eerst zichtbare kledingstukken en kijkt daarna naar stijl, kleurgebruik, pasvorm, samenhang, accessoires en de gekozen gelegenheid. De feedback gaat alleen over de outfit.",
  },
  {
    question: "Werkt het voor mannen en vrouwen?",
    answer:
      "Ja. Je kunt Man, Vrouw of een neutrale voorkeur kiezen. Outfit Roaster leidt gender nooit af uit de foto en past alleen de formulering aan op jouw keuze.",
  },
  {
    question: "Kan ik meerdere outfits beoordelen?",
    answer:
      "Ja. Je kunt meerdere foto’s gebruiken. Voor de gewone Outfit Roast geldt een limiet van vijf gratis roasts per dag. Zo kun je bijvoorbeeld verschillende schoenen of lagen vergelijken.",
  },
];

export default function AiOutfitCheckerPage() {
  return (
    <SeoLandingPage
      eyebrow="Gratis Nederlandse outfitcheck"
      title="AI Outfit Checker"
      intro={[
        "Twijfel je of je outfit echt werkt? Met de gratis AI Outfit Checker van Outfit Roaster upload je een foto en krijg je direct feedback over stijl, pasvorm, kleurgebruik en uitstraling. Geen vage complimenten en geen oordeel over je lichaam, maar concrete observaties over de kleding die zichtbaar is.",
        "Kies voor een korte roast met humor of test Premium Verdict Beta voor een uitgebreide stijlanalyse. Je bepaalt zelf de gelegenheid en toon. Zo krijg je feedback die past bij een date, werkdag, school, sportschool, feest of festival.",
      ]}
      sections={sections}
      faqs={faqs}
      relatedLinks={[
        {
          href: "/outfit-roast",
          label: "Outfit Roast",
          description: "Ontdek hoe een scherpe maar vriendelijke outfit roast werkt.",
        },
        {
          href: "/outfit-beoordelen",
          label: "Outfit beoordelen",
          description: "Lees waar je op kunt letten bij stijl, kleuren en pasvorm.",
        },
        {
          href: "/",
          label: "Outfit Roaster",
          description: "Bekijk alle mogelijkheden van de Nederlandse AI-outfitchecker.",
        },
      ]}
    />
  );
}
