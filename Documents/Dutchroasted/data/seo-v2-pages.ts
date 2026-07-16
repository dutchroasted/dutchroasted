export type SeoV2Section = {
  title: string;
  paragraphs: string[];
};

export type SeoV2FaqItem = {
  question: string;
  answer: string;
};

export type SeoV2PageCategory = "algemeen" | "gelegenheid" | "stijl";

export type SeoV2Page = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: SeoV2Section[];
  examples: string[];
  mistakes: string[];
  checklist: string[];
  faq: SeoV2FaqItem[];
  relatedSlugs: string[];
  published: boolean;
  lastModified: string;
  category: SeoV2PageCategory;
};

type SeoV2PageInput = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  category: SeoV2PageCategory;
  searchIntent: string;
  context: string;
  examples: string[];
  mistakes: string[];
  checklist: string[];
  faq: SeoV2FaqItem[];
  relatedSlugs: string[];
  lastModified?: string;
  published?: boolean;
};

const defaultLastModified = "2026-07-13";

function page(input: SeoV2PageInput): SeoV2Page {
  return {
    slug: input.slug,
    title: input.title,
    description: input.description,
    h1: input.h1,
    intro: input.intro,
    category: input.category,
    published: input.published ?? true,
    lastModified: input.lastModified ?? defaultLastModified,
    examples: input.examples,
    mistakes: input.mistakes,
    checklist: input.checklist,
    faq: input.faq,
    relatedSlugs: input.relatedSlugs,
    sections: [
      {
        title: `Wanneer gebruik je ${input.h1}?`,
        paragraphs: [
          input.searchIntent,
          `OutfitRoaster kijkt naar zichtbare kledingstukken, kleuren, schoenen, accessoires, pasvorm en de gekozen context. De feedback gaat over je outfit, niet over je lichaam, gezicht of persoonlijke kenmerken. Daardoor krijg je een oordeel dat scherp mag zijn, maar wel veilig en bruikbaar blijft.`,
        ],
      },
      {
        title: "Waar let OutfitRoaster op?",
        paragraphs: [
          input.context,
          "De belangrijkste vraag is of de onderdelen samen één duidelijk verhaal vertellen. Een outfit hoeft niet duur of ingewikkeld te zijn. Hij moet vooral kloppen voor het moment: schoenen, bovenlaag, broek of jurk, kleurgebruik en accessoires moeten dezelfde richting op werken.",
        ],
      },
      {
        title: "Hoe helpt de AI-check?",
        paragraphs: [
          "Je uploadt een duidelijke foto, kiest de gelegenheid en ontvangt direct een AI-score met eerlijke feedback. In de gratis Outfit Roast krijg je een korte, deelbare verdict met humor. In Premium Verdict Beta krijg je een uitgebreidere analyse van kleur, pasvorm, stijl, samenhang, context en trends.",
          "Gebruik de uitkomst als tweede blik voordat je de deur uitgaat, een foto post of twijfelt tussen twee combinaties. De tool is vooral handig wanneer je zelf te lang naar dezelfde spiegel hebt gekeken en kleine stijlbreuken niet meer ziet.",
        ],
      },
    ],
  };
}

export const seoV2Pages = [
  page({
    slug: "ai-outfit-checker",
    title: "AI Outfit Checker – Check jouw outfit met AI | OutfitRoaster",
    description:
      "Upload je outfit en ontvang direct een AI-score, outfitcheck en eerlijke feedback over stijl, pasvorm, kleur en vibe.",
    h1: "AI Outfit Checker",
    category: "algemeen",
    intro:
      "Twijfel je of je outfit werkt? Met de AI Outfit Checker van OutfitRoaster krijg je direct een tweede blik op je kleding, schoenen, kleuren en uitstraling.",
    searchIntent:
      "Deze pagina is bedoeld voor iedereen die zoekt naar een snelle AI-beoordeling van een outfit. Je wilt weten of de look klopt, waar de twijfel zit en of de outfit past bij het moment waarvoor je hem draagt.",
    context:
      "De AI kijkt naar het totaalbeeld: stijlrichting, kleurcontrast, pasvorm, schoenen, accessoires en gelegenheid. Een goede check begint bij observatie, niet bij willekeurige modepraat.",
    examples: ["Witte sneakers met donkere jeans en een rustige bovenlaag.", "Een blazer met casual schoenen voor een smart casual look.", "Een festivalfit met laagjes, tas en stevige schoenen."],
    mistakes: ["Schoenen die een andere gelegenheid uitstralen dan de rest.", "Te veel stijlen tegelijk zonder duidelijke keuze.", "Kleuren die geen rustpunt of herhaling hebben."],
    checklist: ["Is de hele outfit zichtbaar?", "Past de look bij de gelegenheid?", "Vertellen schoenen en bovenlaag hetzelfde verhaal?", "Is er genoeg balans tussen kleur en pasvorm?"],
    faq: [
      { question: "Is de AI Outfit Checker gratis?", answer: "Ja. Je kunt gratis een Outfit Roast maken. Premium Verdict Beta geeft extra uitgebreide analyse." },
      { question: "Wat beoordeelt de AI?", answer: "De AI beoordeelt zichtbare kleding, kleuren, schoenen, accessoires, pasvorm en context." },
      { question: "Wordt mijn lichaam beoordeeld?", answer: "Nee. OutfitRoaster beoordeelt de outfit en vermijdt feedback op lichaam, gezicht of persoonlijke kenmerken." },
    ],
    relatedSlugs: ["outfit-checker", "rate-my-outfit", "outfit-roast", "outfit-score"],
  }),
  page({
    slug: "outfit-checker",
    title: "Outfit Checker – Laat je outfit direct beoordelen | OutfitRoaster",
    description:
      "Gebruik de gratis Outfit Checker voor feedback op je kleding, schoenen, kleurgebruik, pasvorm en uitstraling.",
    h1: "Outfit Checker",
    category: "algemeen",
    intro:
      "Een outfit checker helpt wanneer je voor de spiegel staat en niet weet of de look sterk, saai, rommelig of precies goed is.",
    searchIntent:
      "Deze pagina beantwoordt de vraag hoe je snel kunt controleren of een outfit als geheel klopt. Het gaat niet om losse kledingstukken, maar om de combinatie die iemand straks ziet.",
    context:
      "OutfitRoaster beoordeelt of je kledingstukken samenwerken. Een trui kan goed zijn, een broek kan goed zijn en toch kan de combinatie voelen alsof twee plannen door elkaar lopen.",
    examples: ["Een nette werklook met rustige kleuren.", "Een casual schooloutfit met sneakers en denim.", "Een uitgaanslook met één opvallend accessoire."],
    mistakes: ["Een outfit kiezen zonder rekening te houden met locatie.", "Een sterke bovenlaag combineren met schoenen die te sportief ogen.", "Alles veilig houden waardoor de look geen richting krijgt."],
    checklist: ["Kies eerst de gelegenheid.", "Check pasvorm van bovenlaag en broek.", "Bekijk schoenen als onderdeel van de outfit.", "Houd accessoires ondersteunend."],
    faq: [
      { question: "Hoe werkt een outfit checker?", answer: "Je uploadt een foto en krijgt feedback op zichtbare stylingkeuzes zoals pasvorm, kleuren en schoenen." },
      { question: "Kan ik meerdere outfits checken?", answer: "Ja, maar gratis roasts hebben een dagelijkse limiet. Premium Verdict Beta telt tijdelijk niet mee." },
      { question: "Welke foto werkt het beste?", answer: "Gebruik een scherpe full-body foto met goed licht." },
    ],
    relatedSlugs: ["ai-outfit-checker", "outfit-tester", "outfit-beoordelen", "kledingstijl-check"],
  }),
  page({
    slug: "outfit-tester",
    title: "Outfit Tester – Test of je look werkt | OutfitRoaster",
    description:
      "Test je outfit met AI en ontdek of je kleding, schoenen, kleuren en vibe goed samenwerken.",
    h1: "Outfit Tester",
    category: "algemeen",
    intro:
      "Met de Outfit Tester zie je snel of je look klaar is voor buiten of nog voelt als een conceptversie uit je kledingkast.",
    searchIntent:
      "Deze pagina is voor mensen die hun outfit willen testen voordat ze naar een date, werk, school, feest of festival gaan. Je zoekt geen modetheorie, maar een duidelijke ja, nee of bijna.",
    context:
      "De test kijkt of de outfit logisch is opgebouwd. De AI let op verhouding, kleur, schoenen, laagjes en of de uitstraling past bij de gekozen situatie.",
    examples: ["Een dinerlook met nette schoenen.", "Een gym outfit die praktisch blijft.", "Een casual outfit die toch verzorgd oogt."],
    mistakes: ["Alleen op één kledingstuk letten.", "De schoenen vergeten in de beoordeling.", "Een outfit testen zonder gelegenheid te kiezen."],
    checklist: ["Upload een recente foto.", "Zorg dat schoenen zichtbaar zijn.", "Kies Date, Werk, School, Gym, Feest of Festival.", "Lees vooral de concrete observaties."],
    faq: [
      { question: "Wat test OutfitRoaster precies?", answer: "De tool test of zichtbare kledingstukken qua stijl, pasvorm, kleur en context samenwerken." },
      { question: "Is dit serieus of grappig?", answer: "Je kunt kiezen tussen een snelle roast en Premium Verdict Beta voor serieuzere analyse." },
      { question: "Kan een goede outfit ook geroast worden?", answer: "Ja. Ook sterke outfits kunnen grappige feedback krijgen zonder dat de score laag hoeft te zijn." },
    ],
    relatedSlugs: ["outfit-checker", "outfit-score", "rate-my-outfit", "ai-stylist"],
  }),
  page({
    slug: "rate-my-outfit",
    title: "Rate My Outfit – AI beoordeelt jouw kleding | OutfitRoaster",
    description:
      "Laat AI jouw outfit raten met een score, korte feedback en een deelbare outfitquote.",
    h1: "Rate My Outfit",
    category: "algemeen",
    intro:
      "Wil je gewoon weten welk cijfer je outfit krijgt? Rate My Outfit geeft je direct een score en een korte uitleg waarom de look wel of niet werkt.",
    searchIntent:
      "Deze pagina richt zich op de zoekintentie ‘geef mijn outfit een score’. Je wilt geen lange modeschool, maar een concreet cijfer met een reden die je snapt.",
    context:
      "De score hoort bij wat zichtbaar is: kleurgebruik, schoenen, pasvorm, samenhang en gelegenheid. Een roast hoeft niet automatisch een lage score te betekenen; ook een sterke outfit kan een scherpe oneliner krijgen.",
    examples: ["8/10 voor een rustige outfit met sterke schoenen.", "5/10 voor een look die veilig is maar weinig richting heeft.", "3/10 voor een combinatie waarin elk onderdeel iets anders wil."],
    mistakes: ["Denken dat een roast altijd slecht betekent.", "Een score los zien van de gekozen gelegenheid.", "Een onduidelijke foto uploaden en precieze feedback verwachten."],
    checklist: ["Gebruik een duidelijke foto.", "Kies de juiste context.", "Let op de score én de uitleg.", "Gebruik Premium Verdict Beta voor diepere analyse."],
    faq: [
      { question: "Hoe bepaalt OutfitRoaster de score?", answer: "De score is gebaseerd op zichtbare outfitdetails en de gekozen gelegenheid." },
      { question: "Kan ik een decimale score krijgen?", answer: "Ja, OutfitRoaster gebruikt geen vaste hele cijfers en kan bijvoorbeeld 7.4/10 geven." },
      { question: "Kan ik de score delen?", answer: "Ja, je kunt een share card of video maken met je score en quote." },
    ],
    relatedSlugs: ["outfit-score", "outfit-roast", "ai-outfit-checker", "fashion-ai"],
  }),
  page({
    slug: "outfit-beoordelen",
    title: "Outfit beoordelen – Krijg direct feedback | OutfitRoaster",
    description:
      "Laat je outfit beoordelen door AI en krijg feedback over stijl, kleurcombinaties, pasvorm en uitstraling.",
    h1: "Outfit beoordelen",
    category: "algemeen",
    intro:
      "Je outfit laten beoordelen helpt wanneer je wilt weten of een look verzorgd, passend en logisch overkomt.",
    searchIntent:
      "Deze pagina is bedoeld voor mensen die een praktische beoordeling zoeken. Geen losse complimenten, maar een duidelijke analyse van wat werkt en waar de outfit uit balans raakt.",
    context:
      "OutfitRoaster kijkt naar de eerste indruk van de kleding. De beoordeling blijft bij stylingkeuzes zoals schoenen, laagjes, kleuren, accessoires en gelegenheid.",
    examples: ["Een outfit voor werk die professioneel moet ogen.", "Een datefit die ontspannen maar verzorgd moet voelen.", "Een festivaloutfit die praktisch én fotogeniek moet zijn."],
    mistakes: ["Verzorgd verwarren met formeel.", "Te veel accessoires gebruiken om twijfel te maskeren.", "Een outfit kiezen die niet bij de context past."],
    checklist: ["Bepaal het doel van de outfit.", "Check of pasvorm rustig oogt.", "Laat schoenen aansluiten bij de vibe.", "Gebruik de AI-check als tweede blik."],
    faq: [
      { question: "Kan AI mijn outfit beoordelen?", answer: "Ja, op basis van zichtbare kleding, kleuren, pasvorm en context." },
      { question: "Is de beoordeling persoonlijk?", answer: "Nee, de beoordeling gaat over de outfit en niet over jou als persoon." },
      { question: "Wanneer gebruik ik Premium Verdict Beta?", answer: "Gebruik Premium Verdict Beta als je meer detail wilt over kleur, pasvorm en verbeterpunten." },
    ],
    relatedSlugs: ["outfit-checker", "ai-outfit-checker", "kledingstijl-check", "fashion-ai"],
  }),
  page({
    slug: "ai-stylist",
    title: "AI Stylist – Digitale outfitfeedback | OutfitRoaster",
    description:
      "Gebruik OutfitRoaster als AI stylist voor feedback op stijl, kleur, pasvorm, context en outfitkeuzes.",
    h1: "AI Stylist",
    category: "algemeen",
    intro:
      "Een AI stylist geeft je een snelle tweede blik op je outfit, zonder afspraak, zonder winkelpraat en zonder moeilijke modewoorden.",
    searchIntent:
      "Deze pagina helpt mensen die zoeken naar digitale stijlhulp. Je wilt weten of AI kan meekijken naar kledingkeuzes en hoe bruikbaar dat is in de praktijk.",
    context:
      "OutfitRoaster combineert stylingobservaties met normale Nederlandse taal. De gratis roast is luchtig en deelbaar; Premium Verdict Beta is serieuzer en kijkt dieper naar kleur, pasvorm en samenhang.",
    examples: ["Hulp bij twijfel tussen casual en smart casual.", "Feedback op een outfit voor een sollicitatie.", "Analyse van kleur en pasvorm voor een nieuwe look."],
    mistakes: ["AI zien als vervanging voor eigen smaak.", "Alleen zoeken naar complimenten.", "Een slechte foto uploaden waardoor details verdwijnen."],
    checklist: ["Gebruik AI als extra blik.", "Kies je gelegenheid bewust.", "Bekijk of de feedback aansluit bij wat zichtbaar is.", "Pas alleen aan wat logisch voelt."],
    faq: [
      { question: "Is OutfitRoaster een echte stylist?", answer: "OutfitRoaster is een AI-tool voor outfitfeedback, geen menselijke stylist." },
      { question: "Kan de AI kledingstukken herkennen?", answer: "De AI probeert zichtbare items te herkennen en gebruikt algemene termen als iets onzeker is." },
      { question: "Krijg ik ook shop suggesties?", answer: "Bij analyses kunnen shop suggesties verschijnen op basis van verbeterpunten." },
    ],
    relatedSlugs: ["fashion-ai", "outfit-score", "kledingstijl-check", "outfit-beoordelen"],
  }),
  page({
    slug: "outfit-roast",
    title: "Outfit Roast – Laat je outfit roasten | OutfitRoaster",
    description:
      "Upload je outfit en ontvang een scherpe, grappige maar veilige roast die je outfit raakt, niet jou.",
    h1: "Outfit Roast",
    category: "algemeen",
    intro:
      "Een outfit roast is de korte realitycheck die je kledingkast soms verdient: grappig, direct en bedoeld om te delen.",
    searchIntent:
      "Deze pagina is voor mensen die geen brave modefeedback willen, maar entertainment. De roast moet lachen opleveren, maar altijd gebaseerd zijn op echte outfitobservaties.",
    context:
      "OutfitRoaster roast alleen kleding, schoenen, kleuren, accessoires, stijl en gelegenheid. Geen opmerkingen over lichaam, gezicht, leeftijd, gender of andere persoonskenmerken.",
    examples: ["Een kantoorlook met sneakers die weekend willen.", "Een festivalfit waar de tas meer plan heeft dan de schoenen.", "Een datefit die verzorgd begint maar halverwege casual afslaat."],
    mistakes: ["Grappen maken die niets met de foto te maken hebben.", "Een standaardquote gebruiken die op elke outfit past.", "Modeadvies vermommen als roast."],
    checklist: ["Roast de outfit, niet de persoon.", "Begin bij een echte observatie.", "Maak de quote kort en deelbaar.", "Gebruik Premium Verdict Beta voor serieuze analyse."],
    faq: [
      { question: "Is een outfit roast beledigend?", answer: "Nee. De roast mag scherp zijn, maar blijft gericht op kleding en styling." },
      { question: "Kan ik mijn roast delen?", answer: "Ja, je kunt een share card of TikTok/Reels-video maken." },
      { question: "Wat gebeurt er met mijn foto?", answer: "De app gebruikt je foto voor de analyse en slaat hem niet als openbaar profiel op." },
    ],
    relatedSlugs: ["rate-my-outfit", "outfit-score", "ai-outfit-checker", "fashion-ai"],
  }),
  page({
    slug: "kledingstijl-check",
    title: "Kledingstijl Check – Ontdek of je stijl klopt | OutfitRoaster",
    description:
      "Check je kledingstijl met AI-feedback over stijlrichting, kleuren, pasvorm, schoenen en samenhang.",
    h1: "Kledingstijl Check",
    category: "algemeen",
    intro:
      "Een kledingstijl check laat zien of je outfit een duidelijke richting heeft of voelt alsof meerdere stijlen tegelijk de leiding nemen.",
    searchIntent:
      "Deze pagina helpt wanneer je niet alleen wilt weten of een outfit mooi is, maar welke stijl hij uitstraalt: casual, smart casual, streetwear, sportief, business casual of iets ertussenin.",
    context:
      "De AI kijkt naar zichtbare stijlcodes zoals schoenen, silhouet, laagjes, materiaalindruk, kleurgebruik en accessoires. Daarna wordt beoordeeld of die codes elkaar versterken of juist botsen.",
    examples: ["Smart casual met chino, trui en nette sneakers.", "Streetwear met oversized bovenlaag en stevige sneakers.", "Minimalistisch met rustige kleuren en weinig accessoires."],
    mistakes: ["Te veel stijlrichtingen tegelijk combineren.", "Accessoires kiezen die een ander verhaal vertellen.", "Een outfit te veilig houden waardoor hij vlak wordt."],
    checklist: ["Kies één dominante stijlrichting.", "Laat schoenen die stijl ondersteunen.", "Gebruik kleur als rustpunt.", "Controleer of accessoires nodig zijn."],
    faq: [
      { question: "Welke stijlen herkent OutfitRoaster?", answer: "Onder meer casual, streetwear, smart casual, business casual, sportief en minimalistisch." },
      { question: "Kan mijn stijl een mix zijn?", answer: "Ja, maar de mix moet bewust voelen." },
      { question: "Is dit hetzelfde als Premium Verdict Beta?", answer: "Nee, Premium Verdict Beta gaat dieper in op analyse en verbeterpunten." },
    ],
    relatedSlugs: ["streetwear-outfit", "casual-outfit", "smart-casual-outfit", "business-casual-outfit"],
  }),
  page({
    slug: "fashion-ai",
    title: "Fashion AI – Nederlandse outfitcheck met AI | OutfitRoaster",
    description:
      "Ontdek hoe Fashion AI jouw outfit kan beoordelen op stijl, kleur, pasvorm, context en uitstraling.",
    h1: "Fashion AI",
    category: "algemeen",
    intro:
      "Fashion AI klinkt groot, maar voor OutfitRoaster betekent het vooral: sneller zien wat er in een outfit werkt en wat niet.",
    searchIntent:
      "Deze pagina legt uit hoe AI praktisch kan helpen bij kledingkeuzes. Niet als vervanging van smaak, maar als extra blik op zichtbare outfitdetails.",
    context:
      "De tool gebruikt AI om kledingstukken, kleuren, stijlrichting en context te beoordelen. De output moet menselijk, duidelijk en Nederlands blijven, zonder vage modeclaims.",
    examples: ["Een AI-score voor een complete look.", "Een roastquote die op echte kledingdetails slaat.", "Een Premium Verdict met kleur- en pasvormanalyse."],
    mistakes: ["AI-output blind volgen.", "Onzichtbare details laten beoordelen.", "Verwachten dat AI de gelegenheid raadt zonder input."],
    checklist: ["Upload een heldere foto.", "Geef de juiste gelegenheid mee.", "Lees feedback als suggestie.", "Gebruik eigen smaak als eindfilter."],
    faq: [
      { question: "Wat is Fashion AI?", answer: "Fashion AI gebruikt beeldanalyse en taalmodellen om kleding en styling te beoordelen." },
      { question: "Is OutfitRoaster Nederlands?", answer: "Ja, de output is gericht op Nederlandse taal en context." },
      { question: "Is Fashion AI altijd correct?", answer: "Nee, maar met duidelijke foto's en context wordt de feedback specifieker." },
    ],
    relatedSlugs: ["ai-stylist", "ai-outfit-checker", "outfit-beoordelen", "outfit-score"],
  }),
  page({
    slug: "outfit-score",
    title: "Outfit Score – Krijg een cijfer voor je outfit | OutfitRoaster",
    description:
      "Upload je outfit en krijg direct een score op basis van stijl, pasvorm, kleur, schoenen en gelegenheid.",
    h1: "Outfit Score",
    category: "algemeen",
    intro:
      "Een outfit score maakt twijfel concreet. Je ziet niet alleen of de look werkt, maar ook hoe sterk hij overkomt.",
    searchIntent:
      "Deze pagina is voor gebruikers die een duidelijk cijfer zoeken. De score helpt om outfits te vergelijken en sneller te bepalen of iets sterk genoeg is voor de gekozen situatie.",
    context:
      "De score gebruikt de volledige schaal. Een goede outfit hoeft geen lage roastscore te krijgen; humor en kwaliteit kunnen prima samen bestaan.",
    examples: ["9.1/10 voor een sterke, coherente look.", "6.4/10 voor een outfit die werkt maar weinig spanning heeft.", "3.2/10 voor een combinatie met duidelijke stijlbreuken."],
    mistakes: ["Alleen het cijfer lezen en de observaties negeren.", "Een outfit zonder context laten scoren.", "Een lage score zien als persoonskritiek."],
    checklist: ["Bekijk score én quote.", "Controleer de gelegenheid.", "Let op terugkerende opmerkingen.", "Test alternatieven als je twijfelt."],
    faq: [
      { question: "Waarom gebruikt OutfitRoaster decimalen?", answer: "Decimalen maken scores natuurlijker dan alleen vaste hele cijfers." },
      { question: "Kan een outfit 10/10 krijgen?", answer: "Ja, maar alleen als de look bijna perfect werkt voor de context." },
      { question: "Is een lage score erg?", answer: "Nee, het is feedback op de outfit en vaak juist grappig bedoeld." },
    ],
    relatedSlugs: ["rate-my-outfit", "outfit-roast", "outfit-checker", "ai-outfit-checker"],
  }),
] satisfies SeoV2Page[];

const extraPages = [
  ["date-outfit", "Date Outfit Checker – Check jouw date outfit | OutfitRoaster", "Twijfel je over je date-outfit? Upload je look en ontvang direct een AI-score en eerlijke feedback.", "Date Outfit Checker", "Datefits draaien om eerste indruk: verzorgd genoeg, ontspannen genoeg en niet alsof je drie uur voor de spiegel hebt gevochten.", "gelegenheid", "Deze pagina helpt je kiezen wat je aantrekt voor een date, van café tot restaurant of wandeling.", "Bij Date kijkt OutfitRoaster naar verzorging, vertrouwen, schoenen, kleur, pasvorm en of de outfit ontspannen overkomt.", ["Donkere jeans met nette sneakers en een goed vallende bovenlaag.", "Een jurk met rustige accessoires en schoenen die bij de avond passen.", "Smart casual zonder sollicitatiegesprek-energie."], ["Te formeel voor een simpele koffiedate.", "Te casual voor een restaurant.", "Schoenen die de eerste indruk onderuit halen."], ["Kies de setting.", "Houd het verzorgd maar ontspannen.", "Laat schoenen schoon en bewust zijn.", "Vermijd overdreven accessoires."], "Past mijn outfit bij een eerste date?", "Ja, als de look verzorgd, comfortabel en niet geforceerd oogt.", ["eerste-date-outfit", "uitgaan-outfit", "smart-casual-outfit", "outfit-score"]],
  ["eerste-date-outfit", "Eerste date outfit – Laat je look checken | OutfitRoaster", "Check je eerste date outfit met AI-feedback over eerste indruk, schoenen, kleuren en vibe.", "Eerste date outfit", "Voor een eerste date wil je eruitzien alsof je moeite hebt gedaan, maar niet alsof de outfit een eigen PR-team heeft.", "gelegenheid", "Deze pagina richt zich op outfits voor een eerste date waarbij balans tussen verzorgd en relaxed belangrijk is.", "OutfitRoaster kijkt naar uitstraling, toegankelijkheid, comfort en of de kleding past bij de gekozen date-setting.", ["Een rustige top met goede jeans en nette sneakers.", "Een simpele jurk met één sterk accessoire.", "Een overhemd dat netjes is zonder kantoor te schreeuwen."], ["Te veel parfum in kledingvorm.", "Een outfit die meer spanning heeft dan de date zelf.", "Sportschoenen die geen romantisch plan ondersteunen."], ["Kies één stijlrichting.", "Blijf comfortabel.", "Check schoenen en jas.", "Laat de outfit niet harder praten dan jij."], "Wat trek je aan op een eerste date?", "Kies iets verzorgd, comfortabel en passend bij de setting.", ["date-outfit", "uitgaan-outfit", "casual-outfit", "outfit-roast"]],
  ["festival-outfit", "Festival Outfit Checker – Check jouw festivalfit | OutfitRoaster", "Upload je festival outfit en krijg feedback over comfort, schoenen, laagjes, tas, kleur en vibe.", "Festival Outfit Checker", "Een festivaloutfit moet dansen, lopen, regen en foto’s overleven. Alleen leuk op de spiegel is niet genoeg.", "gelegenheid", "Deze pagina helpt bij festivalfits waar comfort, statement en praktische keuzes samen moeten werken.", "OutfitRoaster let op schoenen, laagjes, tas, kleur, bewegingsruimte en of de look fotogeniek blijft zonder onhandig te worden.", ["Stevige sneakers of boots met een lichte bovenlaag.", "Een opvallend item met rustige basis.", "Een kleine tas die niet de hele dag irritant wordt."], ["Nieuwe schoenen zonder festivaltest.", "Geen laagje voor avondkou.", "Een tas die meer werk vraagt dan de timetable."], ["Check het weer.", "Kies schoenen die uren aankunnen.", "Neem laagjes serieus.", "Laat één item de aandacht pakken."], "Wat maakt een goede festival outfit?", "Een goede festivaloutfit combineert comfort, expressie, stevige schoenen en praktische laagjes.", ["feestje-outfit", "zomer-outfit", "sneaker-outfit", "vakantie-outfit"]],
  ["sollicitatie-outfit", "Sollicitatie outfit – Check je professionele look | OutfitRoaster", "Laat je sollicitatie outfit beoordelen op professionaliteit, pasvorm, kleur, schoenen en branchefit.", "Sollicitatie outfit", "Een sollicitatie outfit moet betrouwbaar ogen zonder dat je verkleed lijkt als iemand uit een kantoorstockfoto.", "gelegenheid", "Deze pagina helpt bij outfits voor sollicitaties, van formele branches tot creatieve werkplekken.", "De check let op netheid, geloofwaardigheid, kleuren, schoenen, pasvorm en het risico van overdressing of underdressing.", ["Blazer met rustige top en nette schoenen.", "Chino met overhemd voor business casual.", "Donkere jeans alleen als de branche dat toelaat."], ["Te casual voor de functie.", "Te formeel waardoor het geforceerd voelt.", "Schoenen die niet verzorgd ogen."], ["Ken de branche.", "Kies rustige kleuren.", "Zorg dat alles schoon en passend is.", "Laat één detail persoonlijkheid geven."], "Wat trek je aan naar een sollicitatie?", "Kies kleding die professioneel, verzorgd en passend bij de branche oogt.", ["werk-outfit", "business-casual-outfit", "smart-casual-outfit", "outfit-score"]],
  ["werk-outfit", "Werk Outfit Checker – Check je kantoorlook | OutfitRoaster", "Krijg AI-feedback op je werk outfit over professionaliteit, pasvorm, kleuren, schoenen en uitstraling.", "Werk Outfit Checker", "Een goede werkoutfit zegt: ik heb mijn leven genoeg op orde voor deze meeting.", "gelegenheid", "Deze pagina gaat over kleding voor kantoor, meetings, klantgesprekken en gewone werkdagen.", "OutfitRoaster beoordeelt of je outfit professioneel genoeg is zonder saai, stijf of rommelig te worden.", ["Trui met chino en nette sneakers.", "Blazer met jeans in een informele omgeving.", "Overhemd met rustige schoenen voor klantcontact."], ["VrijMiBo-kleding om 09:00 dragen.", "Te drukke kleuren in een formele setting.", "Sneakers die te veel sportschool zeggen."], ["Check de dresscode.", "Kies nette schoenen.", "Houd kleuren rustig.", "Laat pasvorm verzorgd ogen."], "Hoe ziet een goede werkoutfit eruit?", "Een goede werkoutfit is verzorgd, geloofwaardig en passend bij je branche.", ["sollicitatie-outfit", "business-casual-outfit", "smart-casual-outfit", "kledingstijl-check"]],
  ["smart-casual-outfit", "Smart casual outfit – Laat je look beoordelen | OutfitRoaster", "Check je smart casual outfit met AI-feedback op balans tussen netjes, relaxed, schoenen en pasvorm.", "Smart casual outfit", "Smart casual is de dresscode waarbij iedereen knikt en daarna toch twijfelt voor de kast.", "gelegenheid", "Deze pagina helpt bij de balans tussen netjes en ontspannen voor werk, diner, date of events.", "De AI kijkt of formele en casual onderdelen bewust gemixt zijn in plaats van toevallig samengevoegd.", ["Blazer met T-shirt en nette sneakers.", "Trui met chino en boots.", "Overhemd met donkere jeans en rustige schoenen."], ["Te formeel waardoor casual verdwijnt.", "Te sportief waardoor smart wegvalt.", "Geen duidelijk ankerpunt in de look."], ["Combineer één net item met één relaxed item.", "Maak schoenen bewust.", "Houd kleuren volwassen.", "Let op pasvorm."], "Wat betekent smart casual?", "Smart casual combineert verzorgde kleding met ontspannen onderdelen.", ["business-casual-outfit", "werk-outfit", "date-outfit", "casual-outfit"]],
  ["bruiloft-gast-outfit", "Bruiloft gast outfit – Check je look | OutfitRoaster", "Laat je outfit als bruiloftsgast beoordelen op stijl, kleur, formaliteit, schoenen en gelegenheid.", "Bruiloft gast outfit", "Als bruiloftsgast wil je goed gekleed zijn zonder eruit te zien alsof jij per ongeluk het altaar claimt.", "gelegenheid", "Deze pagina helpt bij outfits voor bruiloften, recepties en diners waar feestelijk en respectvol samen moeten gaan.", "OutfitRoaster kijkt naar formaliteit, kleurkeuze, schoenen, accessoires en of de outfit past bij dag, locatie en seizoen.", ["Linnen pak voor zomerse bruiloft.", "Midi-jurk met subtiele accessoires.", "Nette schoenen met rustige kleurcombinatie."], ["Wit dragen als dat niet gevraagd is.", "Te casual schoenen.", "Accessoires die meer aandacht vragen dan het paar."], ["Lees de dresscode.", "Vermijd wit tenzij toegestaan.", "Kies comfortabele nette schoenen.", "Stem accessoires af."], "Wat draag je als bruiloftsgast?", "Kies feestelijke, verzorgde kleding die de dresscode respecteert.", ["feestje-outfit", "zomer-outfit", "date-outfit", "outfit-score"]],
  ["feestje-outfit", "Feestje outfit – Check je partylook | OutfitRoaster", "Upload je feestje outfit en krijg feedback over uitstraling, schoenen, accessoires, kleur en vibe.", "Feestje outfit", "Een feestje outfit mag meer energie hebben dan je maandaglook, maar moet nog steeds één plan volgen.", "gelegenheid", "Deze pagina is voor verjaardagen, borrels, drinks, diners, huisfeesten en avonden uit.", "De check let op uitstraling, comfort, kleur, accessoires en of de look feestelijk is zonder chaotisch te worden.", ["Zwarte basis met opvallende schoenen.", "Top of jurk met één sterk accessoire.", "Casual broek met feestelijke bovenlaag."], ["Alles tegelijk opvallend maken.", "Schoenen kiezen die de avond niet halen.", "Een outfit dragen die meer kantoor dan feest zegt."], ["Kies één statement.", "Check of je kunt bewegen.", "Laat schoenen de avond aankunnen.", "Stem jas of tas mee af."], "Wat trek je aan naar een feestje?", "Kies iets dat feestelijk voelt, maar nog steeds comfortabel en samenhangend is.", ["uitgaan-outfit", "festival-outfit", "date-outfit", "sneaker-outfit"]],
  ["vakantie-outfit", "Vakantie outfit – Laat je look checken | OutfitRoaster", "Check je vakantie outfit op comfort, kleur, schoenen, pasvorm en fotogenieke uitstraling.", "Vakantie outfit", "Een vakantie outfit moet ontspannen ogen, maar niet alsof je koffer onderweg alle beslissingen heeft genomen.", "gelegenheid", "Deze pagina helpt bij outfits voor citytrips, stranddagen, diners op vakantie en reisdagen.", "OutfitRoaster kijkt naar luchtigheid, comfort, schoenen, kleurgebruik en of de outfit past bij klimaat en activiteit.", ["Linnen overhemd met short en sandalen.", "Witte outfit met rustige accessoires.", "Sneakers voor citytrip met lichte laagjes."], ["Te warme materialen.", "Schoenen die niet bij lopen passen.", "Alles kreukgevoelig zonder plan."], ["Denk aan temperatuur.", "Kies loopbare schoenen.", "Gebruik lichte lagen.", "Houd kleuren rustig of bewust zomers."], "Wat is een goede vakantie outfit?", "Een goede vakantie outfit is comfortabel, passend bij het klimaat en sterk genoeg voor foto's.", ["zomer-outfit", "festival-outfit", "casual-outfit", "sneaker-outfit"]],
  ["uitgaan-outfit", "Uitgaan outfit – Check je avondlook | OutfitRoaster", "Laat je uitgaansoutfit beoordelen op vibe, schoenen, accessoires, kleur en eerste indruk.", "Uitgaan outfit", "Een uitgaansoutfit moet binnenkomen zonder eruit te zien alsof hij onderweg drie keer van bestemming wisselde.", "gelegenheid", "Deze pagina is voor club, bar, drinks, diner en nachtleven waar uitstraling en comfort samen tellen.", "De AI let op schoenen, silhouet, opvallende details, kleur en of de outfit genoeg avondenergie heeft.", ["Donkere basis met opvallend accessoire.", "Jurk of top met schoenen die de look dragen.", "Smart casual met sterkere avondkleur."], ["Te veel dagkleding.", "Oncomfortabele schoenen.", "Geen jas of tas meenemen in de styling."], ["Kies avondenergie.", "Check schoenen.", "Houd één focuspunt.", "Zorg dat de look past bij locatie."], "Wat draag je met uitgaan?", "Kies een look met uitstraling, comfortabele schoenen en één duidelijke stijlrichting.", ["feestje-outfit", "date-outfit", "zomer-outfit", "zwarte-outfit"]],
  ["streetwear-outfit", "Streetwear Outfit Checker – Check je streetwear look | OutfitRoaster", "Laat je streetwear outfit beoordelen op sneakers, fit, lagen, proporties en vibe.", "Streetwear Outfit Checker", "Streetwear draait om proportie, sneakers en houding van de kleding. Eén verkeerde verhouding en de fit valt uit de groepschat.", "stijl", "Deze pagina helpt bij streetwear looks met oversized items, sneakers, hoodies, cargos, denim en laagjes.", "OutfitRoaster let op silhouet, sneakerkeuze, kleurblokken, laagjes en of de look bewust of gewoon te groot oogt.", ["Oversized hoodie met rechte jeans en stevige sneakers.", "Cargo met rustige top en opvallende schoenen.", "Monochrome streetwear met materiaalcontrast."], ["Oversized zonder proportie.", "Sneakers die niet aansluiten op broekvorm.", "Te veel logo’s tegelijk."], ["Bepaal het silhouet.", "Laat sneakers een rol spelen.", "Houd kleurblokken bewust.", "Gebruik accessoires spaarzaam."], "Wat maakt streetwear sterk?", "Sterke streetwear heeft bewuste proporties, goede sneakers en een duidelijke vibe.", ["sneaker-outfit", "oversized-outfit", "zwarte-outfit", "casual-outfit"]],
  ["old-money-outfit", "Old money outfit – Check je quiet luxury look | OutfitRoaster", "Check je old money outfit op kleur, pasvorm, materialen, schoenen en rustige luxe uitstraling.", "Old money outfit", "Old money werkt alleen als het moeiteloos lijkt. Zodra het te hard probeert, wordt het gewoon verkleed als golfclub.", "stijl", "Deze pagina is voor rustige, klassieke outfits met neutrale kleuren, knitwear, overhemden, loafers en nette silhouetten.", "De AI let op ingetogen kleuren, pasvorm, materiaalindruk, schoenen en of de outfit luxe oogt zonder schreeuwerig te worden.", ["Beige trui met witte broek en loafers.", "Navy blazer met rustige denim.", "Knit polo met chino en nette schoenen."], ["Te veel logo’s.", "Kleding die niet goed valt.", "Sneakers die de klassieke sfeer breken."], ["Kies neutrale kleuren.", "Let sterk op pasvorm.", "Gebruik subtiele accessoires.", "Laat kwaliteit spreken zonder drukte."], "Wat is een old money outfit?", "Een old money outfit is rustig, klassiek en verzorgd met focus op pasvorm en materialen.", ["smart-casual-outfit", "business-casual-outfit", "zomer-outfit", "outfit-score"]],
  ["casual-outfit", "Casual outfit – Laat je dagelijkse look checken | OutfitRoaster", "Check je casual outfit met AI-feedback over pasvorm, schoenen, kleur en verzorgde uitstraling.", "Casual outfit", "Casual mag ontspannen zijn. Het hoeft niet te klinken als ‘ik had nog vijf minuten’.", "stijl", "Deze pagina helpt bij dagelijkse outfits die comfortabel zijn maar toch bewust en verzorgd moeten ogen.", "OutfitRoaster kijkt of simpele kledingstukken samen sterker worden: T-shirt, jeans, hoodie, trui, sneakers, jas en accessoires.", ["Goed vallend T-shirt met denim en schone sneakers.", "Hoodie met jas en rechte broek.", "Trui met chino voor rustige casual stijl."], ["Te slordige pasvorm.", "Sneakers die versleten ogen.", "Geen enkel detail dat de outfit afmaakt."], ["Zorg dat basics goed vallen.", "Houd schoenen schoon.", "Kies één kleuranker.", "Gebruik één accessoire als detail."], "Hoe maak je casual stijlvol?", "Door goede pasvorm, schone schoenen en bewuste kleurkeuzes.", ["smart-casual-outfit", "sneaker-outfit", "zomer-outfit", "heren-outfit-check"]],
  ["business-casual-outfit", "Business casual outfit – Check je werklook | OutfitRoaster", "Laat je business casual outfit beoordelen op professionaliteit, comfort, schoenen en pasvorm.", "Business casual outfit", "Business casual is professioneel zonder pakpaniek. Het moet werk zeggen, niet weekend met laptop.", "stijl", "Deze pagina helpt bij outfits voor kantoor, klantgesprekken en zakelijke settings zonder formeel pak.", "De AI beoordeelt balans tussen professioneel en ontspannen, vooral via schoenen, bovenlaag, broek, kleur en pasvorm.", ["Chino met overhemd en nette sneakers.", "Blazer met T-shirt en donkere jeans.", "Trui met pantalon en boots."], ["Te sportief worden.", "Te formeel voor de bedrijfscultuur.", "Kreukels of slechte pasvorm negeren."], ["Kies één net ankerpunt.", "Gebruik rustige kleuren.", "Laat schoenen verzorgd zijn.", "Controleer de branchecontext."], "Wat is business casual?", "Business casual combineert zakelijke verzorging met comfortabele, minder formele kleding.", ["werk-outfit", "sollicitatie-outfit", "smart-casual-outfit", "old-money-outfit"]],
  ["zomer-outfit", "Zomer outfit – Check je zomerse look | OutfitRoaster", "Upload je zomer outfit en krijg feedback op kleur, luchtigheid, schoenen, pasvorm en gelegenheid.", "Zomer outfit", "Een zomeroutfit moet luchtig zijn zonder eruit te zien alsof comfort de enige projectleider was.", "stijl", "Deze pagina helpt bij warmweerlooks voor vakantie, terras, werk, date, festival of gewone dagen.", "OutfitRoaster kijkt naar lichte materialen, kleur, schoenen, laagjes, pasvorm en of de outfit fris maar verzorgd oogt.", ["Linnen overhemd met short.", "Witte sneakers met lichte jeans.", "Zomerjurk met subtiele accessoires."], ["Te doorschijnende of kreukelige stoffen zonder plan.", "Schoenen die te zwaar ogen.", "Geen rekening houden met avondtemperatuur."], ["Kies ademende materialen.", "Gebruik lichte kleuren bewust.", "Check schoenen bij temperatuur.", "Neem laagjes mee als context vraagt."], "Wat draag je in de zomer?", "Kies luchtige, goed passende kleding met schoenen die bij warmte en activiteit passen.", ["vakantie-outfit", "festival-outfit", "casual-outfit", "sneaker-outfit"]],
  ["winter-outfit", "Winter outfit – Check je winterlook | OutfitRoaster", "Laat je winter outfit beoordelen op jas, laagjes, schoenen, kleuren, pasvorm en uitstraling.", "Winter outfit", "Een winteroutfit moet warm zijn zonder dat je jas de hele styling gijzelt.", "stijl", "Deze pagina helpt bij winterlooks met jas, trui, hoodie, boots, laagjes en donkere kleuren.", "De AI kijkt naar jasvorm, lagen, schoengewicht, kleurcontrast en of de outfit nog vorm houdt.", ["Wollen jas met trui en nette schoenen.", "Puffer met rechte broek en stevige sneakers.", "Hoodie onder jas met rustige kleuren."], ["Een te grote jas zonder silhouet.", "Zomerschoenen onder winterlagen.", "Alleen zwart dragen zonder contrast."], ["Laat de jas meedoen aan de outfit.", "Kies schoenen met genoeg gewicht.", "Gebruik laagjes bewust.", "Voeg contrast toe waar nodig."], "Hoe maak je een winteroutfit stijlvol?", "Met goede laagjes, passende schoenen, vorm in de jas en rustig kleurcontrast.", ["business-casual-outfit", "streetwear-outfit", "zwarte-outfit", "casual-outfit"]],
  ["sneaker-outfit", "Sneaker outfit – Check je look met sneakers | OutfitRoaster", "Check of je sneakers goed passen bij je outfit, broek, kleuren, stijl en gelegenheid.", "Sneaker outfit", "Sneakers kunnen een outfit maken of verraden dat niemand de eindcontrole deed.", "stijl", "Deze pagina helpt bij outfits waarin sneakers een belangrijke rol spelen, van casual tot smart casual en streetwear.", "OutfitRoaster kijkt naar sneakerstijl, kleur, schoenvolume, broekvorm en of sneakers passen bij de gelegenheid.", ["Witte sneakers met donkere denim.", "Chunky sneakers met streetwear proportie.", "Minimalistische sneakers onder smart casual."], ["Sportschoenen dragen waar nette sneakers nodig zijn.", "Broeklengte die de sneaker raar breekt.", "Sneakerkleur die nergens terugkomt."], ["Check schoenvolume.", "Stem broeklengte af.", "Laat kleur ergens terugkomen.", "Kies sneakers passend bij context."], "Welke sneakers passen bij mijn outfit?", "Dat hangt af van broekvorm, kleur, gelegenheid en hoe sportief de rest van de look is.", ["streetwear-outfit", "casual-outfit", "smart-casual-outfit", "festival-outfit"]],
  ["oversized-outfit", "Oversized outfit – Check je proporties | OutfitRoaster", "Laat je oversized outfit beoordelen op silhouet, balans, schoenen, lagen en stijlrichting.", "Oversized outfit", "Oversized is stijl als de proporties kloppen. Anders is het gewoon textiel met ambitie.", "stijl", "Deze pagina helpt bij ruime T-shirts, hoodies, jassen, broeken en laagjes die bewust groot moeten ogen.", "De AI kijkt of oversized items balans hebben met schoenen, broekvorm, lengte en de rest van de outfit.", ["Oversized hoodie met rechte jeans.", "Ruim T-shirt met cargobroek en stevige sneakers.", "Lange jas met smalle basis."], ["Alles tegelijk oversized zonder vorm.", "Te kleine schoenen onder zware proporties.", "Laagjes die elkaar verstoppen."], ["Kies één dominant oversized item.", "Balanceer met schoenen.", "Let op lengte.", "Houd kleur rustig als volume groot is."], "Hoe draag je oversized kleding goed?", "Door proporties bewust te balanceren met schoenen, broekvorm en lengte.", ["streetwear-outfit", "sneaker-outfit", "zwarte-outfit", "casual-outfit"]],
  ["zwarte-outfit", "Zwarte outfit – Laat je all black look checken | OutfitRoaster", "Check je zwarte outfit op contrast, materialen, pasvorm, schoenen en uitstraling.", "Zwarte outfit", "All black kan sterk zijn. Of gewoon alsof je kledingkast alle kleurvergaderingen heeft geannuleerd.", "stijl", "Deze pagina helpt bij zwarte outfits voor casual, date, werk, uitgaan en streetwear.", "OutfitRoaster kijkt naar materiaalcontrast, silhouet, schoenen, laagjes en details, omdat kleurverschil minder zichtbaar is.", ["Zwarte jeans met zwarte boots en ander materiaal in de jas.", "All black met zilveren accessoire.", "Zwarte jurk met rustige schoenen."], ["Alles zwart zonder textuur.", "Vervaagde zwarte tinten door elkaar.", "Schoenen die te licht of te sportief ogen."], ["Gebruik materiaalcontrast.", "Let op tintverschil.", "Maak schoenen bewust.", "Voeg één detail toe."], "Is een zwarte outfit saai?", "Niet als pasvorm, materiaalcontrast en schoenen sterk genoeg zijn.", ["uitgaan-outfit", "streetwear-outfit", "old-money-outfit", "date-outfit"]],
  ["heren-outfit-check", "Heren outfit check – Laat je mannenoutfit beoordelen | OutfitRoaster", "Check je heren outfit met AI-feedback over pasvorm, schoenen, kleuren, stijl en gelegenheid.", "Heren outfit check", "Een herenoutfit hoeft niet ingewikkeld te zijn. Hij moet vooral niet klinken als ‘de stoel was schoner dan de spiegel’.", "stijl", "Deze pagina helpt mannen en iedereen die herenmode zoekt met outfits voor werk, date, casual, feest of festival.", "De AI kijkt naar pasvorm, schoenen, broeklengte, bovenlaag, kleurgebruik en of de look past bij de context.", ["Overhemd met chino en nette sneakers.", "T-shirt met goede jeans en schone schoenen.", "Trui met jas en boots voor winter."], ["Te lange broekspijpen.", "Versleten sneakers onder nette kleding.", "Een overhemd dat niet past bij de rest."], ["Check schouders en lengte.", "Maak schoenen schoon.", "Kies één stijlrichting.", "Gebruik accessoires subtiel."], "Hoe verbeter je een herenoutfit snel?", "Begin met pasvorm, schoenen en één duidelijke stijlrichting.", ["outfit-checker", "business-casual-outfit", "date-outfit", "sneaker-outfit"]],
] as const;

export const allSeoV2Pages = [
  ...seoV2Pages,
  ...extraPages.map(
    ([
      slug,
      title,
      description,
      h1,
      intro,
      category,
      searchIntent,
      context,
      examples,
      mistakes,
      checklist,
      faqQuestion,
      faqAnswer,
      relatedSlugs,
    ]) =>
      page({
        slug,
        title,
        description,
        h1,
        intro,
        category,
        searchIntent,
        context,
        examples: [...examples],
        mistakes: [...mistakes],
        checklist: [...checklist],
        faq: [
          { question: faqQuestion, answer: faqAnswer },
          { question: "Kan ik deze outfit gratis laten checken?", answer: "Ja, je kunt gratis een Outfit Roast maken en tijdelijk Premium Verdict Beta testen." },
          { question: "Waar let de AI vooral op?", answer: "Op zichtbare kleding, schoenen, kleur, pasvorm, accessoires en de gekozen gelegenheid." },
        ],
        relatedSlugs: [...relatedSlugs],
      }),
  ),
] satisfies SeoV2Page[];

function validatePublishedPage(page: SeoV2Page) {
  const publishedSlugs = new Set(allSeoV2Pages.filter((seoPage) => seoPage.published).map((seoPage) => seoPage.slug));
  const missingFields = [
    ["slug", page.slug],
    ["title", page.title],
    ["description", page.description],
    ["h1", page.h1],
    ["intro", page.intro],
    ["sections", page.sections.length >= 3],
    ["examples", page.examples.length >= 3],
    ["mistakes", page.mistakes.length >= 3],
    ["checklist", page.checklist.length >= 4],
    ["faq", page.faq.length >= 3],
    ["relatedSlugs", page.relatedSlugs.length >= 3],
    ["lastModified", page.lastModified],
  ].filter(([, value]) => !value);

  if (missingFields.length > 0) {
    throw new Error(
      `SEO page "${page.slug}" is missing quality fields: ${missingFields
        .map(([field]) => field)
        .join(", ")}`,
    );
  }

  const missingRelatedSlugs = page.relatedSlugs.filter(
    (relatedSlug) => !publishedSlugs.has(relatedSlug),
  );

  if (missingRelatedSlugs.length > 0) {
    throw new Error(
      `SEO page "${page.slug}" has missing relatedSlugs: ${missingRelatedSlugs.join(", ")}`,
    );
  }
}

allSeoV2Pages.filter((page) => page.published).forEach(validatePublishedPage);

export const publishedSeoV2Pages = allSeoV2Pages.filter((page) => page.published);

export function getSeoV2Page(slug: string): SeoV2Page | undefined {
  return publishedSeoV2Pages.find((page) => page.slug === slug);
}

export function getRelatedSeoV2Pages(page: SeoV2Page) {
  return page.relatedSlugs
    .map((slug) => getSeoV2Page(slug))
    .filter((relatedPage): relatedPage is SeoV2Page => Boolean(relatedPage));
}
