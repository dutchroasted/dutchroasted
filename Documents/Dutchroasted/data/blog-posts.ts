export type BlogSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  intro: string[];
  sections: BlogSection[];
  faqs: BlogFaq[];
};

export const blogPosts = [
  {
    slug: "wat-is-een-goede-outfit",
    title: "Wat is een goede outfit?",
    metaTitle: "Wat is een goede outfit? Praktische checklist voor stijl",
    metaDescription:
      "Ontdek waar een goede outfit aan voldoet: pasvorm, kleur, schoenen, gelegenheid en uitstraling. Met praktische checklist van OutfitRoaster.",
    excerpt:
      "Een goede outfit draait niet om dure kleding, maar om pasvorm, samenhang, kleur, schoenen en context.",
    publishedAt: "2026-07-13",
    updatedAt: "2026-07-13",
    readingTime: "7 min leestijd",
    intro: [
      "Een goede outfit is geen outfit die iedereen mooi moet vinden. Een goede outfit is een outfit die klopt. De kleding past bij de persoon, bij het moment, bij de omgeving en bij elkaar. Dat klinkt simpel, maar precies daar gaat het vaak mis: één onderdeel doet werk, één onderdeel doet weekend en de schoenen hebben blijkbaar de uitnodiging niet gelezen.",
      "Bij OutfitRoaster kijken we op twee manieren naar outfits. De gratis roast is entertainment: scherp, grappig en deelbaar. Premium Verdict Beta is de serieuze analyse: kleur, pasvorm, samenhang, stijl en context. Deze gids zit daar tussenin. Geen modewoorden om interessant te doen, maar een evergreen checklist waarmee je elke outfit beter kunt beoordelen.",
    ],
    sections: [
      {
        title: "1. Een goede outfit heeft een duidelijk plan",
        paragraphs: [
          "De sterkste outfits voelen alsof iemand vooraf één beslissing heeft genomen. Niet tien kleine twijfels, maar één richting. Casual, netjes, sportief, minimalistisch, festival, date, werk: het maakt niet uit welke richting je kiest, zolang de kledingstukken hetzelfde verhaal vertellen.",
          "Een outfit zonder plan voelt alsof je kledingkast op shuffle stond. Een nette blazer met totaal versleten sneakers kan werken als het bewust is gestyled, maar voelt rommelig als de rest niet meedoet. Een hoodie met chino kan smart casual worden, of juist studiedag met ambitie. Het verschil zit in intentie.",
        ],
        bullets: [
          "Past de outfit bij de gelegenheid?",
          "Vertellen schoenen, broek en bovenlaag hetzelfde verhaal?",
          "Is er één duidelijke stijlrichting?",
          "Voelt de look gekozen in plaats van toevallig?",
        ],
      },
      {
        title: "2. Pasvorm is belangrijker dan merk",
        paragraphs: [
          "Een goedkoop kledingstuk dat goed valt, wint vaak van een duur kledingstuk dat verkeerd zit. Pasvorm bepaalt hoe rustig, sterk en verzorgd een outfit oogt. Te groot kan relaxed zijn, maar ook slordig. Te strak kan netjes lijken, maar snel geforceerd worden. Het gaat om verhouding.",
          "Let vooral op schouders, lengte, silhouet en balans. Een oversized bovenlaag vraagt vaak om een bewuste broekkeuze. Een wijde broek vraagt schoenen die genoeg gewicht hebben. Een strak shirt met een losse broek kan goed werken, maar alleen als het contrast logisch voelt.",
          "Pasvorm is geen oordeel over lichaam. Het gaat om hoe kleding valt. Een jas kan te groot zijn voor de styling. Een broek kan te lang vallen voor de schoenen. Een overhemd kan trekken of juist verdwijnen. Dat is kledingfeedback, geen persoonsfeedback.",
        ],
      },
      {
        title: "3. Kleur hoeft niet ingewikkeld te zijn",
        paragraphs: [
          "Veel mensen denken dat kleur gaat over ingewikkelde kleurtheorie. In de praktijk draait het meestal om rust, contrast en herhaling. Een outfit met zwart, wit en denim kan sterker zijn dan een outfit met vijf kleuren die allemaal om aandacht vragen.",
          "Een goede kleurcombinatie heeft balans. Neutrale tinten zoals zwart, wit, grijs, beige, navy en denim zijn makkelijk te combineren. Eén opvallende kleur kan veel doen, zolang hij ergens steun krijgt in de rest van de outfit. Als alles tegelijk hoofdrol wil spelen, voelt de look druk.",
          "Belangrijk: beoordeel kleur op wat er echt zichtbaar is. Als iemand volledig wit draagt, is er geen ‘kleurencrisis’. Dan gaat de vraag eerder over stof, vorm, contrast met schoenen, accessoires en gelegenheid.",
        ],
      },
      {
        title: "4. Schoenen bepalen de eindzin",
        paragraphs: [
          "Schoenen zijn vaak het laatste onderdeel dat je aantrekt, maar visueel geven ze de outfit vaak de conclusie. Sneakers maken een look sportiever of casualer. Nette schoenen maken hem volwassener. Boots geven gewicht. Sandalen kunnen luchtig en elegant zijn, of totaal verkeerd voelen bij de rest.",
          "Een outfit kan bijna goed zijn en alsnog vallen door schoenen die een andere afspraak hebben. Denk aan een nette werklook met te lompe sportschoenen, of een festivalfit met schoenen die er na tien minuten al spijt van krijgen. Goede schoenen hoeven niet duur te zijn, maar ze moeten de outfit afmaken.",
        ],
      },
      {
        title: "5. Context maakt of breekt de outfit",
        paragraphs: [
          "Een outfit kan goed zijn voor een festival en slecht voor een sollicitatie. Een datefit kan perfect zijn voor een drankje, maar te veel voor school. Een gym outfit kan praktisch zijn, maar bij een diner voelen alsof iemand vergeten is de tweede helft van de dag om te kleden.",
          "Daarom is de vraag ‘waar draag je dit?’ zo belangrijk. Date vraagt eerste indruk en vertrouwen. Werk vraagt geloofwaardigheid en netheid. School vraagt comfort zonder dat het voelt alsof je te hard probeert. Gym vraagt praktisch en sportief. Feest vraagt uitstraling. Festival vraagt vibe, comfort en expressie.",
        ],
      },
      {
        title: "6. Accessoires zijn ondersteuning, geen noodoplossing",
        paragraphs: [
          "Accessoires kunnen een simpele outfit optillen. Een horloge, tas, riem, ketting, pet of bril kan richting geven. Maar accessoires lossen geen outfit zonder basis op. Als de broek, bovenlaag en schoenen niet samenwerken, kan een tas niet ineens projectmanager worden.",
          "Gebruik accessoires bewust. Eén sterk detail werkt vaak beter dan vijf losse pogingen. Bij rustige outfits kan een accessoire karakter geven. Bij drukke outfits kan minder juist sterker zijn. De vraag is steeds: helpt dit detail de outfit, of vraagt het alleen extra aandacht?",
        ],
      },
      {
        title: "Snelle checklist voor een goede outfit",
        paragraphs: [
          "Gebruik deze checklist voordat je de deur uitgaat of voordat je een foto uploadt naar OutfitRoaster. Als je op de meeste vragen ‘ja’ antwoordt, zit je waarschijnlijk goed. Als drie onderdelen twijfelachtig voelen, dan heeft je outfit waarschijnlijk een teamoverleg nodig.",
        ],
        bullets: [
          "De outfit past bij de gelegenheid.",
          "De pasvorm voelt bewust, niet toevallig.",
          "De schoenen maken de look af.",
          "De kleuren werken rustig samen.",
          "Er is één duidelijke stijlrichting.",
          "Accessoires ondersteunen de outfit.",
          "De look voelt als vandaag, niet als paniek.",
        ],
      },
      {
        title: "Laat je outfit beoordelen",
        paragraphs: [
          "Uiteindelijk zie je een outfit vaak pas echt wanneer iemand anders ernaar kijkt. Dat kan een vriend zijn, een spiegel met eerlijk licht of OutfitRoaster. Upload een duidelijke foto waarop je kleding zichtbaar is van boven tot schoenen, kies de gelegenheid en krijg direct een verdict.",
          "Wil je vooral lachen en delen? Gebruik de Outfit Roast. Wil je serieus weten wat werkt en wat beter kan? Gebruik Premium Verdict Beta. Beide blijven bij dezelfde basisregel: we beoordelen de outfit, nooit de persoon.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wat maakt een outfit goed?",
        answer:
          "Een goede outfit heeft samenhang tussen pasvorm, kleur, schoenen, stijl en gelegenheid. De kleding hoeft niet duur te zijn, maar moet bewust gecombineerd voelen.",
      },
      {
        question: "Hoe weet ik of mijn outfit bij de gelegenheid past?",
        answer:
          "Kijk naar de context. Werk vraagt netheid, Date vraagt eerste indruk, School vraagt comfort, Gym vraagt praktisch, Feest vraagt uitstraling en Festival vraagt vibe plus draagbaarheid.",
      },
      {
        question: "Zijn schoenen echt zo belangrijk?",
        answer:
          "Ja. Schoenen bepalen vaak of een outfit casual, netjes, sportief of rommelig oogt. Ze zijn visueel vaak de conclusie van je look.",
      },
      {
        question: "Kan OutfitRoaster mijn outfit gratis beoordelen?",
        answer:
          "Ja. Je kunt gratis een Outfit Roast maken. Premium Verdict Beta geeft een diepere analyse van kleur, pasvorm, samenhang, context en trends.",
      },
    ],
  },
] satisfies BlogPost[];

export const blogPostSlugs = blogPosts.map((post) => post.slug);

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
