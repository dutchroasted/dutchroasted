import { SeoLandingPage } from "@/components/SeoLandingPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Outfit beoordelen | Krijg direct feedback op je kleding",
  description:
    "Laat je outfit beoordelen door AI. Ontvang feedback over stijl, kleurcombinaties, pasvorm en uitstraling.",
  path: "/outfit-beoordelen",
});

const sections = [
  {
    title: "Waarom een outfit beoordelen?",
    paragraphs: [
      "Een outfit beoordelen helpt wanneer je zelf niet meer objectief naar je kleding kijkt. Je hebt al meerdere shirts geprobeerd, schoenen gewisseld en misschien iemand in de groepsapp om advies gevraagd. Op zo’n moment vallen kleine problemen minder snel op. Een extra blik kan duidelijk maken waarom een combinatie rustig en overtuigend voelt of juist waarom verschillende onderdelen om aandacht vechten.",
      "Beoordelen betekent niet dat er één perfecte uitkomst bestaat. Stijl blijft persoonlijk en hangt af van smaak, budget, comfort en gelegenheid. Goede feedback geeft daarom geen universele regels, maar legt uit wat zichtbaar gebeurt. Welke kleur trekt de aandacht? Hoe werken de verhoudingen? Past het niveau van formaliteit bij de setting? Met die informatie kun je bewust kiezen of je iets verandert.",
    ],
  },
  {
    title: "De eerste indruk van kleding",
    paragraphs: [
      "Mensen zien een outfit vaak als geheel voordat ze losse kledingstukken registreren. De eerste indruk ontstaat uit kleurvlakken, silhouet, schoenen en de algemene mate van verzorgdheid. Een jas kan direct structuur geven. Sneakers kunnen een nette combinatie ontspannen maken. Een accessoire kan het geheel afmaken, maar ook concurreren met andere opvallende details.",
      "Bij een outfitbeoordeling kijkt Outfit Roaster naar die eerste samenhang. Voor Werk telt bijvoorbeeld geloofwaardigheid en netheid zwaarder. Bij een Date gaat het om een bewuste, ontspannen eerste indruk. School vraagt meestal om comfort en zelfvertrouwen. Gym draait om praktisch en sportief, terwijl Feest en Festival ruimte geven voor expressie. Dezelfde kleding kan daardoor per situatie anders scoren.",
    ],
  },
  {
    title: "Kleding en zelfvertrouwen",
    paragraphs: [
      "Een outfit die logisch voelt, geeft vaak rust. Je hoeft onderweg niet voortdurend aan een te strakke laag, ongemakkelijke schoenen of een opvallende kleur te denken. Dat betekent niet dat kleding zelfvertrouwen automatisch maakt. Wel kan een combinatie die past bij je doel ervoor zorgen dat je minder bezig bent met twijfel en meer met wat je daadwerkelijk gaat doen.",
      "Outfit Roaster probeert dat vertrouwen te ondersteunen zonder de persoon te beoordelen. De feedback gaat over keuzes die je kunt aanpassen: een andere schoen, een rustigere kleurverdeling, een duidelijker silhouet of één accessoire minder. Je lichaam is geen verbeterpunt. Kleding, styling en context zijn dat soms wel. Die grens maakt eerlijke feedback nuttiger en veiliger.",
    ],
  },
  {
    title: "Kleurcombinaties beoordelen",
    paragraphs: [
      "Kleuren hoeven niet allemaal hetzelfde te zijn om samen te werken. Contrast kan juist energie geven. Een lichte bovenlaag met een donkere broek creëert bijvoorbeeld duidelijke verdeling. Ton-sur-ton combinaties ogen rustiger, maar hebben verschil in materiaal of tint nodig om niet vlak te worden. Een accentkleur werkt het sterkst wanneer die bewust terugkomt of voldoende ruimte krijgt.",
      "Problemen ontstaan vaak wanneer meerdere kleuren tegelijk de hoofdrol willen spelen. Ook kan een warme kleur naast een koele basis onverwacht botsen. De AI benoemt de zichtbare kleuren en kijkt hoe ze verdeeld zijn. Het advies blijft praktisch: welke kleur ondersteunt de rest, welke vraagt te veel aandacht en waar zou herhaling of juist rust helpen?",
    ],
    bullets: [
      "Gebruik een neutrale basis wanneer één accentkleur moet opvallen.",
      "Herhaal een kleur subtiel in schoenen of accessoires voor meer samenhang.",
      "Let niet alleen op kleur, maar ook op de grootte van ieder kleurvlak.",
      "Bekijk een combinatie bij daglicht voordat je een definitief oordeel vormt.",
    ],
  },
  {
    title: "Pasvorm en verhoudingen",
    paragraphs: [
      "Pasvorm gaat over hoe kleding valt en hoe verschillende volumes samenwerken. Een ruim overhemd kan sterk zijn bij een rechtere broek, maar minder duidelijk ogen wanneer alle lagen tegelijk oversized zijn. Een korte jas kan lengte in de benen benadrukken. Een langere bovenlaag kan juist rust geven, zolang de verhoudingen bewust voelen. Er bestaat dus geen standaardregel dat strak of slim fit altijd beter is.",
      "Een foto kan niet alles vertellen over comfort, maar wel veel over zichtbare lijnen. Outfit Roaster kijkt naar schouders, lengte, plooien, taillepositie en de overgang naar schoenen. Als een specifiek kledingtype niet zeker zichtbaar is, wordt geen gok gedaan. De feedback gebruikt dan neutrale termen zoals bovenlaag, broek of schoenen. Zo blijft het advies dichter bij wat daadwerkelijk op de foto staat.",
    ],
  },
  {
    title: "Een snelle roast of een uitgebreid verdict",
    paragraphs: [
      "Soms wil je alleen weten of een outfit werkt voordat je vertrekt. De gratis Outfit Roast geeft dan drie korte feedbackregels, een score en concrete tips. Humor maakt zichtbaar waar kledingstukken verschillende plannen lijken te hebben. Je kunt kiezen voor een positieve Stijlcoach, een pittige beoordeling of maximale roastenergie met Genadeloos.",
      "Wie meer verdieping wil, kan Premium Verdict Beta gebruiken. Die analyse kijkt uitgebreider naar gedragen kleuren, pasvorm, stijlidentiteit, samenhang, gelegenheid en trends. Je krijgt deelscores, sterke punten, drie verbeterpunten en shoprichtingen met merkvoorbeelden. Tijdens de beta is deze uitgebreide beoordeling tijdelijk gratis te testen.",
    ],
  },
];

const faqs = [
  {
    question: "Hoe weet ik of mijn outfit goed is?",
    answer:
      "Een goede outfit past bij de gelegenheid, voelt bewust samengesteld en heeft samenhang in kleur, pasvorm en stijl. Comfort en jouw eigen voorkeur blijven daarbij net zo belangrijk als algemene stijlregels.",
  },
  {
    question: "Welke kleuren passen bij elkaar?",
    answer:
      "Neutrale kleuren combineren meestal eenvoudig. Complementaire of contrasterende kleuren kunnen ook sterk werken als één kleur de hoofdrol krijgt. Verdeling, tint en materiaal bepalen uiteindelijk het resultaat.",
  },
  {
    question: "Kan AI mijn outfit beoordelen?",
    answer:
      "Ja. AI kan zichtbare kledingstukken, kleuren, verhoudingen en context analyseren. De beoordeling blijft een hulpmiddel en kan details missen, maar geeft snel een bruikbare extra blik.",
  },
  {
    question: "Is Outfit Roaster gratis?",
    answer:
      "Je krijgt dagelijks vijf gratis Outfit Roasts. Premium Verdict Beta is momenteel eveneens tijdelijk gratis beschikbaar voor een uitgebreidere beoordeling.",
  },
];

export default function OutfitBeoordelenPage() {
  return (
    <SeoLandingPage
      eyebrow="Directe feedback op je kleding"
      title="Outfit beoordelen"
      intro={[
        "Wil je weten of je kleding goed samenwerkt voordat je de deur uitgaat? Laat je outfit beoordelen door Outfit Roaster. Je krijgt directe feedback over stijl, kleurcombinaties, pasvorm, schoenen, accessoires en de gelegenheid waarvoor je de outfit draagt.",
        "Kies een snelle roast met humor of gebruik Premium Verdict Beta voor een uitgebreide analyse. De feedback gaat uitsluitend over de outfit en nooit over je lichaam of aantrekkelijkheid.",
      ]}
      sections={sections}
      faqs={faqs}
      relatedLinks={[
        {
          href: "/ai-outfit-checker",
          label: "AI Outfit Checker",
          description: "Ontdek hoe de automatische outfitanalyse precies werkt.",
        },
        {
          href: "/outfit-roast",
          label: "Outfit Roast",
          description: "Krijg scherpe humor op basis van zichtbare kledingdetails.",
        },
        {
          href: "/",
          label: "Outfit Roaster",
          description: "Bekijk de homepage en start direct met je outfitcheck.",
        },
      ]}
    />
  );
}
