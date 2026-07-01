export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SeoRelatedLink = {
  href: string;
  label: string;
  description: string;
};

export type SeoPage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string[];
  sections: SeoSection[];
  faqs: SeoFaq[];
  relatedLinks?: SeoRelatedLink[];
};

const defaultFaqs: SeoFaq[] = [
  {
    question: "Hoe werkt OutfitRoaster?",
    answer:
      "Je uploadt een duidelijke outfitfoto, kiest voor wie de feedback is, selecteert de gelegenheid en ontvangt direct een verdict over stijl, kleur, pasvorm en vibe.",
  },
  {
    question: "Is OutfitRoaster gratis?",
    answer:
      "Ja. Je kunt dagelijks gratis Outfit Roasts gebruiken. Premium Verdict Beta is tijdelijk gratis te testen en geeft een uitgebreidere analyse.",
  },
  {
    question: "Welke foto's werken het beste?",
    answer:
      "Gebruik een scherpe foto waarop je outfit van top tot schoenen zichtbaar is. Goed licht en weinig rommel op de achtergrond helpen de analyse beter te maken.",
  },
  {
    question: "Kan AI mijn outfit beoordelen?",
    answer:
      "AI kan zichtbare kleding, kleuren, pasvormen, accessoires en context analyseren. OutfitRoaster gebruikt die observaties voor feedback over de outfit, nooit over je lichaam.",
  },
];

const relatedLinks: SeoRelatedLink[] = [
  {
    href: "/ai-outfit-checker",
    label: "Outfit checker",
    description: "Lees hoe AI jouw kleding, kleuren, pasvorm en vibe beoordeelt.",
  },
  {
    href: "/date-outfit-check",
    label: "Date outfit checker",
    description: "Check of je look werkt voor een date of eerste indruk.",
  },
  {
    href: "/festival-outfit-check",
    label: "Festival outfit checker",
    description: "Bekijk of je festivalfit genoeg comfort, kleur en statement heeft.",
  },
  {
    href: "/outfit-roast",
    label: "Outfit roast",
    description: "Ontvang een scherpe Nederlandse roast die je outfit raakt, niet jou.",
  },
  {
    href: "/premium-outfit-analyse",
    label: "Premium analyse",
    description: "Ontdek Premium Verdict Beta voor diepe analyse van kleur, fit en trends.",
  },
];

function page(
  input: Omit<SeoPage, "relatedLinks" | "faqs"> & {
    faqs?: SeoFaq[];
    relatedLinks?: SeoRelatedLink[];
  },
): SeoPage {
  return {
    ...input,
    faqs: input.faqs ?? defaultFaqs,
    relatedLinks: input.relatedLinks ?? relatedLinks.filter((link) => link.href !== `/${input.slug}`),
  };
}

export const seoPages = [
  page({
    slug: "ai-outfit-checker",
    title: "AI Outfit Checker – Laat AI jouw outfit beoordelen",
    metaTitle: "AI Outfit Checker – Laat AI jouw outfit beoordelen",
    metaDescription:
      "Upload je outfit en ontvang direct eerlijke feedback over stijl, pasvorm, kleuren en uitstraling met de Nederlandse AI Outfit Checker van OutfitRoaster.",
    h1: "AI Outfit Checker",
    eyebrow: "Gratis Nederlandse outfitcheck",
    intro: [
      "Een goede outfit voelt vaak logisch zodra je hem draagt, maar de twijfel komt meestal vlak voordat je de deur uitgaat. De AI Outfit Checker van OutfitRoaster geeft je dan een snelle tweede blik: niet op jou als persoon, maar op de kleding, kleuren, schoenen, pasvorm en vibe die zichtbaar zijn.",
      "Je uploadt een foto, kiest de gelegenheid en krijgt direct een verdict. Dat kan als korte roast met humor of als Premium Verdict Beta met een diepere analyse. De toon is Nederlands, eerlijk en scherp, zonder bodyshaming of vage modewoorden.",
    ],
    sections: [
      {
        title: "Wat is een AI outfit checker?",
        paragraphs: [
          "Een AI outfit checker analyseert een foto van je kleding en vertaalt zichtbare details naar bruikbare feedback. De tool kijkt bijvoorbeeld of de bovenlaag en broek hetzelfde verhaal vertellen, of schoenen logisch aansluiten bij de rest en of kleuren elkaar versterken of juist ruzie maken. Dat klinkt technisch, maar het resultaat moet vooral makkelijk te begrijpen zijn.",
          "OutfitRoaster is gebouwd voor mensen die geen zin hebben in een stijladvies dat klinkt alsof het uit een dure brochure komt. Je krijgt een helder verdict in normale taal. Soms is dat positief, soms scherp, en soms precies die ene zin waarvan je denkt: pijnlijk, maar waar.",
        ],
      },
      {
        title: "Hoe werkt OutfitRoaster?",
        paragraphs: [
          "De flow is bewust kort gehouden. Upload een duidelijke foto, kies of de feedback voor Man, Vrouw of neutraal geschreven moet worden, kies de gelegenheid en selecteer het niveau van de feedback. Daarna analyseert OutfitRoaster eerst welke kledingstukken zichtbaar zijn. Als een item onzeker is, gebruikt de feedback veiligere woorden zoals bovenlaag, broek, schoenen of accessoire.",
          "Daarna wordt de outfit beoordeeld op stijl, kleurgebruik, pasvorm, samenhang en context. Bij een gewone Outfit Roast krijg je drie korte feedbackregels, een score en deelbare quotes. Bij Premium Verdict Beta krijg je een langer rapport met kleur-, pasvorm-, stijl-, context- en trendanalyse.",
        ],
      },
      {
        title: "Waar kijkt de AI naar?",
        paragraphs: [
          "Een outfit werkt niet omdat elk kledingstuk los mooi is. Het gaat om de samenwerking. Een nette trui kan prima zijn, maar als de schoenen volledig in sportschoolmodus staan, ontstaat er een ander verhaal. Een kleur kan sterk zijn, maar als die nergens terugkomt, voelt hij soms alsof hij zonder uitnodiging binnenloopt.",
          "Daarom kijkt OutfitRoaster naar het geheel. De analyse gaat over stijlrichting, kleurherhaling, contrast, verhouding tussen kledingstukken, schoenen, accessoires en de gekozen gelegenheid. Het systeem hoort geen lichaam of gezicht te beoordelen. De vraag is simpel: werkt deze outfit voor wat jij ermee wilt doen?",
        ],
        bullets: [
          "Stijl: casual, smart casual, streetwear, sportief, minimalistisch of een mix.",
          "Kleurgebruik: rust, contrast, botsende kleuren en opvallende accenten.",
          "Pasvorm: hoe zichtbaar kleding valt en of de verhoudingen kloppen.",
          "Gelegenheid: Date, Werk, School, Gym, Feest of Festival.",
          "Vibe: de eerste indruk van de outfit als totaalplaatje.",
        ],
      },
      {
        title: "Waarom mensen hun outfit laten beoordelen",
        paragraphs: [
          "Soms wil je bevestiging. Soms wil je weten waarom iets net niet klopt. En soms wil je gewoon lachen om je eigen kledingkeuzes voordat je vrienden dat doen. Een outfitchecker helpt vooral wanneer je zelf te lang naar dezelfde spiegel hebt gekeken. Kleine botsingen worden dan onzichtbaar: schoenen die niet meedoen, kleuren die elkaar overschreeuwen of lagen die geen duidelijke rol hebben.",
          "OutfitRoaster maakt die details zichtbaar. De gratis roast is snel, grappig en deelbaar. Premium Verdict Beta is nuttiger wanneer je echt wilt leren waarom een look wel of niet werkt. Beide varianten zijn gemaakt om de outfit centraal te houden. Jij blijft buiten schot; je kleding krijgt de microfoon.",
        ],
      },
      {
        title: "Voorbeelden van feedback",
        paragraphs: [
          "Een AI outfit checker kan bijvoorbeeld zien dat een donkere jeans en witte sneakers samen fris ogen, maar dat een fel shirt alle aandacht opeist. Of dat een blazer professioneel begint, terwijl een te sportieve schoen de vergadering direct naar de vrijdagmiddagborrel trekt. Zulke feedback werkt omdat hij begint bij observatie en daarna pas humor of advies toevoegt.",
          "Bij een sterke outfit kan het verdict juist bevestigen wat goed gaat: rustige kleuren, duidelijke lijn, passende schoenen en genoeg karakter. Bij een twijfelachtige outfit wordt het concreet: welk onderdeel trekt de look scheef, welke kleur botst en waarom past het geheel minder bij de gekozen gelegenheid.",
        ],
      },
    ],
  }),
  page({
    slug: "outfit-roast",
    title: "Outfit Roast – Ontvang een genadeloze AI-roast",
    metaTitle: "Outfit Roast – Ontvang een genadeloze AI-roast",
    metaDescription:
      "Upload je outfit en krijg een scherpe, grappige en veilige outfit roast. OutfitRoaster roast je kleding, nooit jou.",
    h1: "Outfit Roast",
    eyebrow: "TikTok-proof feedback voor je kledingkast",
    intro: [
      "Een outfit roast is de snelle, grappige realitycheck die je normaal van die ene directe vriend krijgt. Niet gemeen, wel raak. OutfitRoaster kijkt naar zichtbare kleding, kleuren, schoenen, accessoires en gelegenheid, en maakt daar een korte roast van die je kunt bewaren of delen.",
      "De regel is simpel: de outfit krijgt de klappen, niet de persoon. Geen grappen over lichaam, gezicht, leeftijd, afkomst of aantrekkelijkheid. Alleen stylingkeuzes, botsende vibes en kledingstukken die duidelijk niet in dezelfde groepsapp zitten.",
    ],
    sections: [
      {
        title: "Wat is een outfit roast?",
        paragraphs: [
          "Een outfit roast is geen lange stijlles. Het is een korte beoordeling met humor. De beste roast begint met iets wat echt zichtbaar is: een schoen die te sportief oogt, een overhemd dat netter is dan de rest, een broek die een andere gelegenheid heeft gekozen of kleuren die tegelijk de leiding willen nemen.",
          "Daarna komt de vergelijking. Dat is waar OutfitRoaster zijn kracht vandaan haalt. Een look kan voelen als een teamoverleg zonder voorzitter, een PowerPoint zonder inhoud of een festivalfit die onderweg per ongeluk een kantoor binnenliep. De grap werkt alleen als de observatie klopt.",
        ],
      },
      {
        title: "Waarom humor beter werkt dan vaag modeadvies",
        paragraphs: [
          "Veel modefeedback is te voorzichtig. Zinnen als ‘de samenhang kan beter’ of ‘misschien andere schoenen’ zeggen weinig. Een goede roast maakt hetzelfde punt sneller duidelijk. Als je hoort dat je schoenen niet geïnformeerd zijn over de rest van de outfit, begrijp je direct waar het probleem zit.",
          "Humor maakt feedback minder zwaar. Kleding is persoonlijk, maar het hoeft geen therapie te worden. Je kunt lachen, iets aanpassen en door. Daarom blijft OutfitRoaster kort, direct en Nederlands. Geen fashion-forward gebabbel, geen esthetische mist, maar een verdict dat je snapt voordat je koffie koud is.",
        ],
      },
      {
        title: "Hoe hard is genadeloos?",
        paragraphs: [
          "Genadeloos betekent bij OutfitRoaster: maximaal grappig binnen veilige grenzen. De roast mag stevig zijn, maar nooit hatelijk of persoonlijk. Het systeem mag zeggen dat een outfit klinkt als drie plannen tegelijk. Het mag niet zeggen dat iemand er slecht uitziet als persoon. Dat verschil is belangrijk.",
          "Je kunt ook kiezen voor Pittig of Stijlcoach. Pittig is scherp en sarcastisch, maar iets minder vernietigend. Stijlcoach legt de nadruk op wat werkt en houdt het positiever. De context blijft hetzelfde: OutfitRoaster beoordeelt zichtbare kleding en stylingkeuzes, niet degene die de kleding draagt.",
        ],
        bullets: [
          "0–3 score: hardere comedy, maar veilig en outfit-only.",
          "4–6 score: sarcastisch, duidelijk en herkenbaar.",
          "7–8 score: compliment met een grappige rand.",
          "9–10 score: hype alsof de outfit zelf de kamer binnenloopt.",
        ],
      },
      {
        title: "Voorbeelden van roast-hoeken",
        paragraphs: [
          "Niet elke roast moet beginnen met dezelfde zin. De ene outfit vraagt om kantoorhumor, de andere om een sportvergelijking, internetcultuur, reality-tv energie of een absurd dagelijkse situatie. Een nette bovenlaag met rommelige schoenen kan klinken als LinkedIn op slippers. Een outfit met te veel stijlen kan voelen als een groepsproject waar niemand de versiegeschiedenis heeft bijgehouden.",
          "OutfitRoaster probeert variatie te houden door meerdere mogelijke shareQuotes te bedenken en de scherpste te kiezen. De alternatieve quotes moeten echt andere grappen zijn, geen drie versies van dezelfde zin. Zo voelt elke roast minder voorspelbaar en meer alsof hij speciaal voor die foto geschreven is.",
        ],
      },
      {
        title: "Waarom mensen hun roast delen",
        paragraphs: [
          "Mensen delen geen lange analyses. Mensen delen quotes. Daarom is de shareQuote het belangrijkste onderdeel van een Outfit Roast. Die moet kort zijn, direct te begrijpen en hard genoeg om iemand te laten lachen. Denk aan een zin die in een groepsapp meteen reacties krijgt, niet aan een alinea met advies.",
          "Na je roast kun je een verticale share card of video maken. De quote blijft schoon en leesbaar, terwijl de deeltekst de hashtag #outfitroaster bevat. Zo kan de roast grappig blijven zonder dat de quote zelf vol marketing staat. Delen is optioneel, maar eerlijk: een goede roast wil toch een publiek.",
        ],
      },
    ],
  }),
  page({
    slug: "rate-my-outfit",
    title: "Rate My Outfit – AI beoordeelt jouw kleding",
    metaTitle: "Rate My Outfit – AI beoordeelt jouw kleding",
    metaDescription:
      "Laat AI jouw outfit beoordelen met een score, feedback over kleur en pasvorm en een deelbare quote. Gratis rate my outfit tool.",
    h1: "Rate My Outfit",
    eyebrow: "Score, feedback en een eerlijk verdict",
    intro: [
      "Rate My Outfit is voor het moment waarop je gewoon wilt weten: werkt deze look of niet? OutfitRoaster geeft je een score, korte feedback en een quote die je kunt delen. Niet als afstandelijke modejury, maar als snelle Nederlandse outfitcheck met humor.",
      "Je krijgt geen oordeel over wie je bent. De score gaat over zichtbare kleding, kleuren, schoenen, accessoires, pasvorm en de gelegenheid die je kiest. Daardoor is de feedback nuttig voor een date, werkdag, school, gym, feest of festival.",
    ],
    sections: [
      {
        title: "Wat betekent een outfitscore?",
        paragraphs: [
          "Een outfitscore is geen absolute waarheid. Het is een compacte samenvatting van hoe sterk de outfit overkomt op basis van zichtbare elementen. Een hoge score betekent dat de kledingstukken goed samenwerken, de kleuren logisch voelen, de pasvorm overtuigt en de outfit past bij de gekozen context. Een lagere score betekent meestal dat meerdere onderdelen tegelijk een andere richting kiezen.",
          "OutfitRoaster gebruikt de score als startpunt voor feedback. Bij een lage score wordt de roast harder en grappiger. Bij een hoge score wordt de toon positiever, maar nog steeds scherp genoeg om niet als standaard compliment te voelen. Het doel is dat je begrijpt waarom de score zo uitvalt.",
        ],
      },
      {
        title: "Waar wordt jouw outfit op beoordeeld?",
        paragraphs: [
          "De beoordeling kijkt naar meerdere lagen. Stijl is de richting van de look: streetwear, smart casual, sportief, minimalistisch, business casual of een mix. Kleur gaat over harmonie, contrast en accenten. Pasvorm draait om zichtbare verhoudingen tussen kledingstukken. Context bepaalt of dezelfde outfit werkt voor bijvoorbeeld Werk of Festival.",
          "Schoenen krijgen vaak veel invloed, omdat ze de hele outfit kunnen sturen. Een net overhemd met sneakers kan fris zijn, maar ook klinken als een vergadering die op weg is naar de kantine. Accessoires tellen mee wanneer ze zichtbaar zijn en een duidelijke rol spelen. Als iets niet zeker zichtbaar is, hoort OutfitRoaster het niet te verzinnen.",
        ],
        bullets: [
          "Stijlscore: vertelt of de look één richting heeft.",
          "Kleurscore: laat zien of kleuren samenwerken of botsen.",
          "Pasvormscore: kijkt naar zichtbare verhoudingen.",
          "Contextscore: beoordeelt of de outfit past bij je plan.",
          "Totaalscore: vat de eerste indruk samen.",
        ],
      },
      {
        title: "Waarom een AI-score handig is",
        paragraphs: [
          "Vrienden zeggen vaak dat iets ‘prima’ is. Dat helpt weinig. Een AI-score dwingt de feedback concreter te worden. Waarom is het een 6 en geen 8? Ligt het aan de schoenen, kleur, pasvorm of gelegenheid? Door die onderdelen uit elkaar te trekken, wordt duidelijk wat de outfit sterker maakt.",
          "Tegelijk blijft OutfitRoaster luchtig. De score is geen schoolrapport voor je persoonlijkheid. Het is meer een thermometer voor je outfit. Soms bevestigt hij dat je look werkt. Soms wijst hij precies naar dat ene onderdeel dat de hele boel saboteert alsof het nooit is uitgenodigd.",
        ],
      },
      {
        title: "Van score naar actie",
        paragraphs: [
          "Een goede Rate My Outfit-tool stopt niet bij een cijfer. Daarom geeft OutfitRoaster ook sterke punten en verbeterpunten. Misschien is de basis sterk, maar mist de outfit één kleurherhaling. Misschien is de pasvorm goed, maar voelt de schoen te casual voor de gelegenheid. Of misschien klopt alles en verdient de look gewoon wat applaus.",
          "Wie meer diepte wil, kan Premium Verdict Beta gebruiken. Daarin krijg je een langere analyse met kleurgebruik, pasvorm, stijlidentiteit, trends en concrete shoprichtingen. De gewone score is snel. De premium analyse is voor wanneer je precies wilt weten waarom een outfit werkt of niet.",
        ],
      },
      {
        title: "Deelbaar zonder jezelf serieus te nemen",
        paragraphs: [
          "Rate My Outfit is populair omdat het resultaat makkelijk te delen is. Een score plus één goede quote zegt meer dan een lange uitleg. OutfitRoaster maakt daarom een shareQuote die kort, grappig en begrijpelijk is. Bij delen wordt #outfitroaster toegevoegd aan de deeltekst, zodat de quote zelf schoon blijft.",
          "Je kunt het resultaat ook gewoon privé gebruiken. Niet elke outfit hoeft internet op. Soms is het genoeg om te weten dat de broek en schoenen elkaar net hebben ontmoet en dat je nog vijf minuten hebt om daar iets aan te doen.",
        ],
      },
    ],
  }),
  page({
    slug: "date-outfit-check",
    title: "Date Outfit Checker – Is jouw outfit datewaardig?",
    metaTitle: "Date Outfit Checker – Is jouw outfit datewaardig?",
    metaDescription:
      "Upload je date outfit en krijg feedback over eerste indruk, stijl, pasvorm, kleuren en vibe. Veilig, eerlijk en zonder bodyshaming.",
    h1: "Date Outfit Checker",
    eyebrow: "Eerste indruk zonder paniekspiegel",
    intro: [
      "Een date outfit moet iets lastigs doen: verzorgd voelen zonder te schreeuwen dat je drie uur voor de kast hebt gestaan. De Date Outfit Checker van OutfitRoaster helpt je zien of je kleding de juiste eerste indruk maakt.",
      "De feedback gaat over uitstraling, kleuren, pasvorm, schoenen en samenhang. Niet over aantrekkelijkheid of lichaam. Je outfit wordt beoordeeld op date vibe: ontspannen, zelfverzekerd, te veilig, te chaotisch of precies goed.",
    ],
    sections: [
      {
        title: "Wat maakt een outfit datewaardig?",
        paragraphs: [
          "Een goede date outfit voelt bewust, maar niet verkrampt. Je wilt eruitzien alsof je moeite hebt gedaan, zonder dat de outfit klinkt als een sollicitatiegesprek met kaarslicht. Dat evenwicht zit vaak in details: nette schoenen bij een casual basis, een goede bovenlaag, rustige kleuren of één opvallend accent.",
          "OutfitRoaster kijkt naar hoe die details samenwerken. Een te formele look kan afstandelijk voelen. Een te sportieve look kan lijken alsof je na het dessert direct naar de gym gaat. De beste date outfit laat zien dat je jezelf kent en de gelegenheid serieus neemt, zonder het ongemakkelijk groot te maken.",
        ],
      },
      {
        title: "Eerste indruk en vibe",
        paragraphs: [
          "De eerste indruk van een outfit ontstaat razendsnel. Kleur, pasvorm en schoenen vertellen al veel voordat iemand je jas heeft opgehangen. De Date Outfit Checker kijkt daarom naar de vibe van het totaalplaatje. Komt het relaxed over? Is het verzorgd genoeg? Is er één stijlrichting of lijkt het alsof drie vrienden tegelijk advies hebben gegeven?",
          "Die feedback blijft veilig. OutfitRoaster zegt niets over je lichaam of aantrekkelijkheid. Het systeem mag wel zeggen dat een overhemd moeite doet terwijl de broek al weekend heeft aangevraagd. De grap raakt de kleding, niet jou.",
        ],
      },
      {
        title: "Kleuren voor een date",
        paragraphs: [
          "Kleur bepaalt veel van de sfeer. Donkere tinten kunnen rustig en zelfverzekerd voelen. Neutrale kleuren geven ruimte aan pasvorm en details. Een accentkleur kan energie toevoegen, maar werkt het beste wanneer hij niet als enige een solo-optreden geeft. Als meerdere felle kleuren tegelijk roepen, wordt de date misschien eerder een groepsdiscussie.",
          "OutfitRoaster beoordeelt of kleuren elkaar versterken. Bij een date is balans belangrijk: genoeg karakter om niet saai te zijn, genoeg rust om niet af te leiden. Premium Verdict Beta gaat hier dieper op in en benoemt welke kleuren zichtbaar zijn, wat goed werkt en waar het botst.",
        ],
      },
      {
        title: "Pasvorm en schoenen",
        paragraphs: [
          "Pasvorm hoeft niet strak te zijn om goed te werken. Het gaat om verhouding. Een ruim overhemd kan sterk zijn met een strakkere broek. Een wijde broek kan juist goed vallen met een compacte bovenlaag. De Date Outfit Checker kijkt of de stukken elkaar vorm geven of dat alles tegelijk op pauze staat.",
          "Schoenen zijn vaak de verklikker. Nette schoenen kunnen een simpele look meteen datewaardiger maken. Sneakers kunnen prima, zolang ze bewust voelen en niet alsof ze uit een andere groepsapp komen. Als de schoen de outfit omlaag trekt, zegt OutfitRoaster dat meestal vrij duidelijk.",
        ],
      },
      {
        title: "Voorbeelden van date feedback",
        paragraphs: [
          "Een sterke date look kan feedback krijgen als: rustig, verzorgd en net nonchalant genoeg. Een twijfelachtige look kan worden beschreven als een outfit die niet weet of hij cocktails gaat drinken of een pakketje terugbrengt. Dat klinkt grappig, maar maakt ook duidelijk waar de spanning zit.",
          "Gebruik de checker vooral voordat je vertrekt. Upload één foto met je volledige outfit, kies Date als gelegenheid en kies je roast level. Wil je geruststelling, kies Stijlcoach. Wil je de harde waarheid, kies Genadeloos. Beide blijven gericht op kleding en vibe.",
        ],
      },
    ],
  }),
  page({
    slug: "festival-outfit-check",
    title: "Festival Outfit Checker – Check jouw festivalfit",
    metaTitle: "Festival Outfit Checker – Check jouw festivalfit",
    metaDescription:
      "Laat je festival outfit checken op vibe, comfort, kleuren, statement pieces en praktische keuzes voor een lange festivaldag.",
    h1: "Festival Outfit Checker",
    eyebrow: "Voor Lowlands, Pinkpop en alles ertussen",
    intro: [
      "Een festivalfit moet meer kunnen dan leuk zijn op één foto. Hij moet bewegen, tegen een lange dag kunnen, genoeg karakter hebben en niet instorten zodra het terrein modder ruikt. De Festival Outfit Checker helpt je zien of je look klaar is voor die taak.",
      "OutfitRoaster kijkt naar vibe, kleuren, schoenen, lagen, accessoires en comfort. De feedback is eerlijk en grappig, maar blijft gericht op kleding. Geen oordeel over jou, wel over die ene schoen die duidelijk geen regenplan heeft.",
    ],
    sections: [
      {
        title: "Wat maakt een sterke festivalfit?",
        paragraphs: [
          "Een sterke festivaloutfit heeft energie, maar ook een plan. Je wilt iets dragen dat opvalt zonder dat het voelt alsof elk kledingstuk zijn eigen headline wil. Kleur, print, accessoires en schoenen moeten samen een verhaal vertellen. Een festival is juist de plek waar expressie mag, maar ook daar kan een outfit verdwalen.",
          "OutfitRoaster beoordeelt of je festivalfit karakter heeft én praktisch blijft. Denk aan schoenen die een dag lopen aankunnen, lagen die werken bij wisselend weer en accessoires die iets toevoegen in plaats van alleen mee te liften. De beste looks voelen vrij, maar niet willekeurig.",
        ],
      },
      {
        title: "Vibe, comfort en statement pieces",
        paragraphs: [
          "Festivalstijl draait vaak om vibe. Een opvallend shirt, een sterke jas, gekleurde broek of opvallende tas kan de look dragen. Maar een statement piece werkt alleen wanneer de rest ruimte geeft. Als drie onderdelen tegelijk de hoofdact willen zijn, klinkt de outfit als een timetable met alleen headliners.",
          "Comfort telt minstens zo zwaar. Een outfit die om 14:00 perfect is maar om 22:00 spijt veroorzaakt, verdient geen hoge score. De Festival Outfit Checker kijkt daarom naar de zichtbare praktische kant: schoenen, lagen, bewegingsruimte en of de outfit geschikt lijkt voor een lange dag buiten.",
        ],
      },
      {
        title: "Kleuren op een festival",
        paragraphs: [
          "Festivals geven meer ruimte aan kleur dan veel andere gelegenheden. Felle accenten, contrast en prints kunnen juist goed werken. Toch blijft samenhang belangrijk. Een kleur die terugkomt in schoenen, accessoire of bovenlaag voelt bewuster dan een losse kleur die midden in de outfit staat te zwaaien.",
          "OutfitRoaster benoemt welke kleuren zichtbaar zijn en hoe ze samenwerken. Botst het op een leuke manier, dan kan dat juist festivalwaardig zijn. Botst het alsof Koningsdag en een bedrijfsuitje dezelfde tas hebben gepakt, dan hoor je dat ook.",
        ],
      },
      {
        title: "Schoenen: de festivaltest",
        paragraphs: [
          "Schoenen kunnen een festivalfit maken of breken. Ze bepalen niet alleen de uitstraling, maar ook of je de dag overleeft zonder mentale schade. Sneakers, boots of stevige schoenen kunnen allemaal werken, zolang ze passen bij de rest en niet te fragiel ogen voor het terrein.",
          "De checker kijkt of schoenen logisch zijn voor Festival. Te nette schoenen kunnen grappig veel vertrouwen uitstralen. Te sportieve schoenen kunnen de outfit richting warming-up trekken. Het perfecte paar ondersteunt de vibe en blijft praktisch genoeg voor uren staan, lopen en dansen.",
        ],
      },
      {
        title: "Premium Verdict Beta voor festivalfits",
        paragraphs: [
          "Voor een snelle check is de gewone Outfit Roast genoeg. Je krijgt een score, drie punchy feedbackregels en een shareQuote. Als je festivaloutfit echt wilt optimaliseren, is Premium Verdict Beta handiger. Die analyse gaat dieper in op kleurgebruik, stijltype, pasvorm, context en trends.",
          "Dat helpt vooral wanneer je meerdere opties hebt. Werkt de jas beter open of dicht? Is de tas een pluspunt of ruis? Is de look actueel of voelt hij als een festivalfoto uit 2017? Premium geeft meer context, zonder dat het verandert in een saaie stijlles.",
        ],
      },
    ],
  }),
  page({
    slug: "werk-outfit-check",
    title: "Werk Outfit Checker – Kom professioneel voor de dag",
    metaTitle: "Werk Outfit Checker – Kom professioneel voor de dag",
    metaDescription:
      "Check of je outfit geschikt is voor werk, kantoor, sollicitatie of meeting. AI-feedback over professionaliteit, pasvorm en stijl.",
    h1: "Werk Outfit Checker",
    eyebrow: "Voor kantoor, meetings en sollicitatie-energie",
    intro: [
      "Een werkoutfit moet geloofwaardig voelen. Niet altijd formeel, niet altijd strak, maar wel bewust. De Werk Outfit Checker van OutfitRoaster kijkt of je kleding professioneel, verzorgd en passend overkomt voor kantoor, meeting, presentatie of sollicitatie.",
      "De feedback gaat over kleding, niet over jou. Een blazer kan sterk zijn, sneakers kunnen prima, en casual hoeft niet slordig te zijn. De vraag is of de onderdelen samen genoeg vertrouwen uitstralen.",
    ],
    sections: [
      {
        title: "Wat maakt een outfit geschikt voor werk?",
        paragraphs: [
          "Werkoutfits verschillen per sector, maar een paar principes blijven terugkomen. De outfit moet verzorgd ogen, de pasvorm moet niet afleiden en de schoenen moeten het niveau van de rest ondersteunen. Smart casual kan prima werken wanneer de balans klopt. Te formeel kan stijf voelen; te casual kan je geloofwaardigheid onnodig verlagen.",
          "OutfitRoaster beoordeelt de werkvibe in context. Een outfit voor een creatieve werkplek mag meer expressie hebben dan een look voor een sollicitatiegesprek. Toch moet de combinatie bewust voelen. Als een overhemd naar LinkedIn gaat en de broek naar een barbecue, zegt de checker dat duidelijk.",
        ],
      },
      {
        title: "Professionaliteit zonder saai te worden",
        paragraphs: [
          "Professioneel hoeft niet kleurloos te betekenen. Een goed gekozen accentkleur, nette sneaker, sterke trui of verzorgde jas kan juist modern en benaderbaar ogen. De kunst is dat één onderdeel karakter geeft terwijl de rest de basis rustig houdt.",
          "De Werk Outfit Checker kijkt daarom naar balans. Is er genoeg structuur? Zijn kleuren niet te chaotisch? Past de schoen bij het niveau van de bovenlaag? Komt de outfit over als iemand die voorbereid is, of als iemand die om 08:43 nog snel iets van de stoel pakte?",
        ],
      },
      {
        title: "Pasvorm en geloofwaardigheid",
        paragraphs: [
          "Pasvorm heeft veel invloed op hoe professioneel een outfit overkomt. Te ruim kan snel nonchalant worden. Te strak kan onrustig voelen. Het gaat niet om lichaamsvorm, maar om hoe kledingstukken zichtbaar vallen en elkaar in verhouding houden. Een scherpe jas kan een simpele basis sterker maken. Een te slappe bovenlaag kan een nette broek juist naar beneden trekken.",
          "OutfitRoaster houdt de feedback concreet. Als de pasvorm goed werkt, wordt dat benoemd. Als de snit de outfit minder strak maakt dan nodig, krijg je een aanwijzing. Premium Verdict Beta gaat verder met pasvormanalyse en concrete alternatieven voor kledingstukken of categorieën.",
        ],
      },
      {
        title: "Sollicitatie, presentatie of gewone werkdag",
        paragraphs: [
          "Niet elke werkdag vraagt dezelfde outfit. Voor een sollicitatie wil je meestal iets meer betrouwbaarheid en rust. Voor een presentatie mag er meer autoriteit in de look zitten. Voor een gewone kantoordag kan smart casual voldoende zijn. Daarom is context belangrijker dan een algemene regel als ‘draag nette schoenen’.",
          "De checker beoordeelt of je look past bij het doel. Een sneaker kan bij een creatieve rol professioneel genoeg zijn. Een hoodie kan op sommige werkplekken prima, maar moet dan wel bewust gecombineerd zijn. OutfitRoaster helpt je die nuance snel te zien.",
        ],
      },
      {
        title: "Van feedback naar betere keuzes",
        paragraphs: [
          "Na de check weet je meestal welk onderdeel het meeste effect heeft. Soms is dat een andere schoen. Soms een rustigere bovenlaag. Soms juist één accessoire dat de outfit meer richting geeft. De gewone roast houdt het kort; Premium Verdict Beta geeft een uitgebreider plan met stijlidentiteit, sterke punten en verbeterpunten.",
          "Gebruik de Werk Outfit Checker vooral wanneer je twijfelt tussen casual en professioneel. Upload beide opties, vergelijk de scores en kies de look die het meest geloofwaardig voelt voor je situatie. Zo voorkom je dat je outfit een vergadering wordt die een e-mail had kunnen zijn.",
        ],
      },
    ],
  }),
  page({
    slug: "outfit-check-man",
    title: "Outfit Checker voor Mannen",
    metaTitle: "Outfit Checker voor Mannen",
    metaDescription:
      "Laat je mannenoutfit beoordelen op stijl, pasvorm, schoenen, kleuren en gelegenheid. Gratis AI outfit checker met Nederlandse feedback.",
    h1: "Outfit Checker voor Mannen",
    eyebrow: "Mannenoutfits zonder vaag stijladvies",
    intro: [
      "De Outfit Checker voor Mannen helpt je snel zien of je kleding werkt voor de situatie. Denk aan date, werk, school, gym, feest of festival. Je uploadt een foto en krijgt feedback over zichtbare kledingstukken, schoenen, kleuren, pasvorm en vibe.",
      "OutfitRoaster gebruikt geen lichaamsoordeel en leidt geen gender af uit de foto. Kies zelf Man als voorkeur wanneer je natuurlijke mannelijke Nederlandse wording wilt. De roast blijft gericht op de outfit, niet op de persoon.",
    ],
    sections: [
      {
        title: "Waar lopen mannenoutfits vaak op vast?",
        paragraphs: [
          "Veel mannenoutfits gaan niet mis door gebrek aan dure kleding, maar door samenhang. Een goed shirt met een verkeerde schoen kan het hele plan veranderen. Een nette broek met een te sportieve bovenlaag kan voelen alsof twee agenda’s door elkaar lopen. Een jas kan de look afmaken, maar ook alle vorm uit de outfit halen.",
          "OutfitRoaster kijkt naar die combinaties. Niet naar merken of status, maar naar het zichtbare effect. Werkt de jeans met de sneakers? Past de bovenlaag bij de gelegenheid? Heeft de outfit één duidelijke richting of voelt hij als drie tabbladen die tegelijk openstaan?",
        ],
      },
      {
        title: "Schoenen maken meer verschil dan je denkt",
        paragraphs: [
          "Bij mannenoutfits sturen schoenen vaak de hele indruk. Witte sneakers kunnen fris en modern zijn. Boots kunnen stevigheid geven. Nette schoenen kunnen een casual outfit volwassen maken. Maar als de schoenen niet kloppen met de rest, valt dat direct op.",
          "De checker benoemt zulke verschillen. Een outfit kan sterk beginnen met een overhemd, maar instorten wanneer de schoenen nog in weekendmodus staan. Andersom kunnen goede schoenen een simpele look juist optillen. Daarom is schoenfeedback een vast onderdeel van de analyse.",
        ],
      },
      {
        title: "Pasvorm zonder ingewikkelde regels",
        paragraphs: [
          "Pasvorm gaat niet om perfect strak of perfect ruim. Het gaat om balans. Een rechte jeans kan goed werken met een compacte bovenlaag. Een oversized hoodie kan sterk zijn wanneer de broek en schoenen de stijl ondersteunen. Een te wijde combinatie zonder structuur kan daarentegen alle richting uit de outfit halen.",
          "OutfitRoaster beschrijft hoe kleding zichtbaar valt. De feedback blijft bij het kledingstuk: broek, bovenlaag, jas, schoenen of accessoire. Daardoor krijg je bruikbare aanwijzingen zonder dat de analyse persoonlijk wordt.",
        ],
      },
      {
        title: "Van date tot werk",
        paragraphs: [
          "Voor een date telt eerste indruk en ontspannen zelfvertrouwen. Voor werk telt geloofwaardigheid. Voor gym telt praktische sportiviteit. Voor festival en feest mag de outfit meer karakter hebben. Dezelfde sneaker kan in de ene context perfect zijn en in de andere context aanvoelen alsof hij de verkeerde kamer is binnengelopen.",
          "Daarom kies je altijd een gelegenheid. OutfitRoaster past het verdict daarop aan. Een outfit hoeft niet overal voor te werken. Hij moet kloppen voor het plan dat jij vandaag hebt.",
        ],
      },
      {
        title: "Roast of Premium Verdict Beta",
        paragraphs: [
          "Wil je snel weten of je look werkt, kies dan de Outfit Roast. Je krijgt een score, drie korte feedbackregels en een shareQuote. Wil je serieuzer verbeteren, kies Premium Verdict Beta. Dan krijg je meer tekst over kleurgebruik, pasvorm, stijlidentiteit, context, trendgevoel en concrete upgrades.",
          "Beide varianten houden dezelfde grens aan: kleding wel, lichaam niet. De checker mag hard zijn over een schoen die de rest saboteert, maar nooit over wie de kleding draagt. Dat maakt de feedback scherp zonder vervelend te worden.",
        ],
      },
    ],
  }),
  page({
    slug: "outfit-check-vrouw",
    title: "Outfit Checker voor Vrouwen",
    metaTitle: "Outfit Checker voor Vrouwen",
    metaDescription:
      "Upload je outfit en krijg feedback over stijl, kleuren, pasvorm, schoenen en vibe. AI outfit checker voor vrouwen zonder bodyshaming.",
    h1: "Outfit Checker voor Vrouwen",
    eyebrow: "Outfitfeedback zonder bodyshaming",
    intro: [
      "De Outfit Checker voor Vrouwen geeft snelle feedback op je look zonder oordeel over lichaam, gezicht of aantrekkelijkheid. De analyse gaat over kleding, styling, kleuren, schoenen, accessoires en gelegenheid. Precies waar outfitfeedback over hoort te gaan.",
      "Kies Vrouw als voorkeur wanneer je natuurlijke vrouwelijke Nederlandse wording wilt. OutfitRoaster leidt gender nooit af uit de foto. Je bepaalt zelf de toon, van positief en stijlcoachend tot scherp en genadeloos.",
    ],
    sections: [
      {
        title: "Wat beoordeelt de checker wel en niet?",
        paragraphs: [
          "OutfitRoaster beoordeelt zichtbare kledingstukken en de manier waarop ze samenwerken. Denk aan een top met jeans, jurk met schoenen, blazer met tas of laagjes die samen een bepaalde stijl neerzetten. Het systeem kijkt naar kleur, contrast, pasvorm, gelegenheid en vibe.",
          "Wat de checker niet doet: opmerkingen maken over lichaamsvorm, gewicht, leeftijd, gezicht of aantrekkelijkheid. Ook bij een scherpe roast blijft de punchline gericht op de outfit. Een tas kan drama veroorzaken. Een schoen kan de vergadering verstoren. Jij niet.",
        ],
      },
      {
        title: "Stijl en samenhang",
        paragraphs: [
          "Veel outfits hebben sterke losse onderdelen, maar missen soms één duidelijke richting. Een elegante bovenlaag kan botsen met te sportieve schoenen. Een opvallende tas kan geweldig zijn, maar ook alle aandacht opeisen wanneer de rest rustig probeert te blijven. De checker kijkt hoe de onderdelen elkaar versterken of tegenwerken.",
          "Dat betekent niet dat alles matchy hoeft te zijn. Juist contrast kan stijlvol zijn. Het verschil zit in intentie. Een bewust contrast voelt spannend. Een onbewust contrast voelt alsof de outfit onderweg drie keer van plan is veranderd.",
        ],
      },
      {
        title: "Kleurgebruik en accessoires",
        paragraphs: [
          "Kleur bepaalt direct de sfeer van een outfit. Neutrale tinten kunnen luxe en rustig voelen. Felle accenten kunnen energie geven. Prints of opvallende accessoires kunnen de look persoonlijk maken. Maar zodra meerdere onderdelen tegelijk aandacht vragen, kan de outfit drukker worden dan nodig.",
          "OutfitRoaster benoemt waar kleur goed werkt en waar het botst. Accessoires worden meegenomen wanneer ze zichtbaar zijn: tas, horloge, sieraden of andere duidelijke details. Als een accessoire de look afmaakt, hoor je dat. Als hij klinkt alsof hij uit een andere aflevering komt, hoor je dat ook.",
        ],
      },
      {
        title: "Pasvorm en gelegenheid",
        paragraphs: [
          "Pasvorm gaat over hoe kleding zichtbaar valt. Een ruime blazer kan sterk zijn, een wijde broek kan heel modern voelen en een losse trui kan precies de juiste rust geven. Het gaat om verhouding tussen onderdelen, niet om het beoordelen van het lichaam eronder.",
          "De gekozen gelegenheid maakt het verdict specifieker. Voor Date telt eerste indruk en vertrouwen. Voor Werk telt professionaliteit. Voor School telt comfort. Voor Gym telt praktisch sportief. Voor Feest en Festival mag de look meer expressie hebben. De checker past de beoordeling daarop aan.",
        ],
      },
      {
        title: "Waarom Premium Verdict Beta handig is",
        paragraphs: [
          "De gewone Outfit Roast is snel en grappig. Premium Verdict Beta is uitgebreider en voelt meer als een serieuze stijlanalyse. Je krijgt kleur- en pasvormanalyse, stijlidentiteit, contextfit, trendanalyse, sterke punten en concrete verbeterpunten.",
          "Dat is handig wanneer je niet alleen wilt weten of iets werkt, maar waarom. Misschien zijn de kleuren sterk, maar vraagt de schoen om een andere gelegenheid. Misschien is de basis goed, maar mist één accessoire richting. Premium maakt dat concreet zonder het persoonlijk te maken.",
        ],
      },
    ],
  }),
  page({
    slug: "streetwear-check",
    title: "Streetwear Outfit Checker",
    metaTitle: "Streetwear Outfit Checker",
    metaDescription:
      "Check je streetwear outfit op sneakers, fit, lagen, kleuren, accessoires en vibe. AI-feedback met humor en concrete stijlpunten.",
    h1: "Streetwear Outfit Checker",
    eyebrow: "Sneakers, lagen en fit onder de loep",
    intro: [
      "Streetwear staat of valt met verhouding, details en houding van de outfit. Niet de persoon, maar de look. De Streetwear Outfit Checker kijkt naar sneakers, broek, bovenlaag, jas, accessoires, kleuren en de vibe van het totaalplaatje.",
      "OutfitRoaster geeft je snelle feedback met humor of een uitgebreide Premium Verdict Beta-analyse. Handig wanneer je wilt weten of je fit intentional voelt of alsof de kledingkast shuffle heeft aangezet.",
    ],
    sections: [
      {
        title: "Wat maakt streetwear sterk?",
        paragraphs: [
          "Sterke streetwear voelt bewust zonder te geforceerd te worden. Silhouet is belangrijk: oversized, boxy, straight, cropped of gelaagd. Sneakers hebben vaak een hoofdrol, maar mogen niet als enige auditie doen. Kleuren en materialen bepalen of de look rustig, luxe, sportief of chaotisch voelt.",
          "OutfitRoaster kijkt naar die balans. Een hoodie met wijde broek kan werken wanneer schoenen en jas dezelfde energie hebben. Een opvallende sneaker kan de look dragen wanneer de rest hem ondersteunt. Maar als elk onderdeel zijn eigen merkpresentatie geeft, wordt het snel druk.",
        ],
      },
      {
        title: "Sneakers en broekverhouding",
        paragraphs: [
          "In streetwear is de relatie tussen broek en sneaker cruciaal. Een broek die goed valt op de schoen kan de hele outfit sterker maken. Te veel stof kan de sneaker verbergen. Te weinig balans kan de schoen groter laten voelen dan de rest van de look.",
          "De checker benoemt hoe zichtbaar die verhouding werkt. Hij hoeft het merk niet te kennen om te zien of de schoen en broek samenwerken. Soms voelt het alsof ze elkaar net hebben ontmoet. Soms lopen ze binnen als een duo dat al jaren samen optreedt.",
        ],
      },
      {
        title: "Lagen, kleuren en accessoires",
        paragraphs: [
          "Streetwear gebruikt vaak lagen: T-shirt, hoodie, vest, jas, overshirt of blazerachtige bovenlaag. Lagen geven diepte, maar kunnen ook rommelig worden wanneer vormen en lengtes elkaar niet helpen. OutfitRoaster kijkt of de lagen een duidelijke volgorde hebben of dat ze klinken als openstaande actiepunten.",
          "Kleurgebruik hoeft niet veilig te zijn. Monochroom, aardetinten, felle accenten of contrasterende sneakers kunnen allemaal werken. De vraag is of de kleurkeuzes herhaling of intentie tonen. Accessoires zoals tas of horloge tellen mee wanneer ze zichtbaar bijdragen aan de fit.",
        ],
      },
      {
        title: "Streetwear voor verschillende gelegenheden",
        paragraphs: [
          "Streetwear kan voor school, festival, feest en zelfs werk werken, maar niet in precies dezelfde vorm. Voor School mag comfort meer ruimte krijgen. Voor Werk moet de outfit geloofwaardiger en netter voelen. Voor Festival mag hij expressiever zijn. Voor Date wil je dat de look niet alleen cool, maar ook benaderbaar voelt.",
          "Door de gelegenheid te kiezen voorkomt OutfitRoaster standaardadvies. Een hoodie is niet automatisch te casual. Een sneaker is niet automatisch goed. Het gaat om context en combinatie. De checker beoordeelt of jouw streetwearfit past bij het plan.",
        ],
      },
      {
        title: "Van roast naar verbetering",
        paragraphs: [
          "De snelle roast geeft je direct een gevoel: hard raak of juist bevestigend. Premium Verdict Beta gaat dieper en beschrijft stijlidentiteit, kleur, pasvorm, samenhang, trends en shoprichtingen. Dat is vooral nuttig wanneer je je streetwear consistenter wilt maken.",
          "Misschien heb je sterke sneakers, maar mist de bovenlaag structuur. Misschien is de broek goed, maar vraagt de kleur om rust. Of misschien klopt de hele fit en verdient hij gewoon een quote die harder binnenkomt dan je notificaties.",
        ],
      },
    ],
  }),
  page({
    slug: "premium-outfit-analyse",
    title: "Premium Outfit Analyse",
    metaTitle: "Premium Outfit Analyse",
    metaDescription:
      "Test Premium Verdict Beta: een uitgebreide AI-stijlanalyse van kleur, pasvorm, stijlidentiteit, samenhang, trends en verbeterpunten.",
    h1: "Premium Outfit Analyse",
    eyebrow: "Premium Verdict Beta tijdelijk gratis",
    intro: [
      "Premium Outfit Analyse is voor iedereen die meer wil dan een snelle roast. Premium Verdict Beta bekijkt je outfit alsof een persoonlijke stylist er rustig de tijd voor neemt: kleurgebruik, pasvorm, stijlidentiteit, context, trends, sterke punten en concrete verbeterpunten.",
      "Tijdens de beta is deze analyse tijdelijk gratis te testen. De toon is serieuzer dan de Outfit Roast. Geen grappen om de grappen, maar duidelijke feedback die helpt begrijpen waarom een look werkt of waar hij sterker kan.",
    ],
    sections: [
      {
        title: "Wat is Premium Verdict Beta?",
        paragraphs: [
          "Premium Verdict Beta is de uitgebreide analysemodus van OutfitRoaster. Waar de gewone roast kort, grappig en deelbaar is, gaat Premium dieper. Je krijgt een rapport dat uitlegt welke kleuren zichtbaar zijn, hoe de pasvorm overkomt, welke stijlrichting de outfit heeft en hoe goed de look past bij de gekozen gelegenheid.",
          "De analyse blijft natuurlijk Nederlands en praktisch. Geen ingewikkelde modetaal, geen afstandelijke AI-zinnen. Het doel is dat je na het lezen precies begrijpt welke onderdelen sterk zijn en welke keuzes je outfit beter kunnen maken.",
        ],
      },
      {
        title: "Kleuranalyse",
        paragraphs: [
          "De kleuranalyse benoemt welke kleuren gedragen worden en hoe ze samenwerken. Neutrale tinten kunnen rust geven, donkere kleuren kunnen krachtiger voelen en felle accenten kunnen energie toevoegen. Maar kleuren kunnen ook botsen wanneer ze allemaal tegelijk aandacht vragen.",
          "Premium kijkt naar harmonie, contrast en herhaling. Een accentkleur werkt vaak beter wanneer hij ergens terugkomt. Een volledig rustige outfit kan juist sterker worden door één duidelijk detail. De analyse legt uit waarom kleuren goed werken of waar ze de outfit minder samenhang geven.",
        ],
      },
      {
        title: "Pasvormanalyse",
        paragraphs: [
          "Pasvormanalyse gaat over kledingstukken, niet over het lichaam. Premium kijkt hoe zichtbaar items vallen: te ruim, te strak, mooi recht, boxy, clean, sportief of juist wat vormloos. Daarna wordt uitgelegd hoe die pasvormen elkaar beïnvloeden.",
          "Een ruime broek kan sterk zijn met de juiste bovenlaag. Een oversized jas kan stijl geven of de outfit juist overnemen. Een compact shirt kan balans brengen. Premium benoemt welke snit beter zou werken als de huidige verhouding de look minder scherp maakt.",
        ],
      },
      {
        title: "Stijlidentiteit en samenhang",
        paragraphs: [
          "Premium Verdict Beta probeert de stijlrichting van je outfit te benoemen. Denk aan streetwear, smart casual, business casual, minimalistisch, sportief, klassiek of een hybride mix. Dat label is geen hokje, maar een manier om te begrijpen welk verhaal je kleding vertelt.",
          "Daarna kijkt de analyse of alle onderdelen dat verhaal ondersteunen. Soms is een mix juist interessant. Soms voelt hij als een vergadering met te veel projectleiders. Premium maakt dat concreet en legt uit welk kledingstuk de meeste richting geeft.",
        ],
      },
      {
        title: "Context en trendanalyse",
        paragraphs: [
          "Een outfit kan goed zijn en toch niet goed passen bij de gekozen gelegenheid. Premium beoordeelt daarom contextfit voor Date, Werk, School, Gym, Feest of Festival. Voor Werk telt geloofwaardigheid. Voor Date telt eerste indruk. Voor Festival telt expressie en comfort. Voor Gym telt praktisch sportieve logica.",
          "De trendanalyse kijkt hoe modern de outfit oogt. Sommige items voelen tijdloos, andere actueel, en weer andere kunnen wat gedateerd overkomen. Premium benoemt dit zonder modepolitie te spelen. Het gaat om het effect van de outfit vandaag.",
        ],
      },
      {
        title: "Shoprichtingen en verbeterpunten",
        paragraphs: [
          "Voor elk verbeterpunt geeft Premium een concrete richting. Dat kan een kledingcategorie zijn, een alternatief kledingstuk, een zoekterm of merkvoorbeelden. Het systeem hoort geen willekeurige productlinks te verzinnen, maar wel praktische shoprichtingen geven waar je zelf mee verder kunt.",
          "Zo wordt de analyse actiegericht. Niet alleen ‘de schoenen passen minder goed’, maar waarom dat zo is en welke categorie beter werkt. Denk aan nettere sneakers, een rechtere jeans, een rustiger overshirt, een stevigere jas of een accessoire dat de kleuren verbindt.",
        ],
      },
    ],
    faqs: [
      ...defaultFaqs,
      {
        question: "Is Premium Verdict Beta een roast?",
        answer:
          "Nee. Premium Verdict Beta is een serieuze stijlanalyse. De gewone Outfit Roast is kort en grappig; Premium is uitgebreider, rustiger en praktischer.",
      },
    ],
  }),
  page({
    slug: "outfit-beoordelen",
    title: "Outfit beoordelen – Krijg direct feedback op je kleding",
    metaTitle: "Outfit beoordelen – Krijg direct feedback op je kleding",
    metaDescription:
      "Laat je outfit beoordelen door AI. Ontvang feedback over stijl, kleurcombinaties, pasvorm en uitstraling.",
    h1: "Outfit beoordelen",
    eyebrow: "Direct feedback op je kleding",
    intro: [
      "Je outfit beoordelen klinkt simpel, maar in de praktijk kijk je vaak te lang naar dezelfde spiegel. OutfitRoaster geeft een frisse blik op stijl, kleurcombinaties, pasvorm en uitstraling. Snel, Nederlands en zonder bodyshaming.",
      "Gebruik de tool voor een korte roast of voor Premium Verdict Beta wanneer je een uitgebreidere analyse wilt. De feedback gaat over de outfit: kledingstukken, schoenen, accessoires, samenhang en gelegenheid.",
    ],
    sections: [
      {
        title: "Waarom een outfit laten beoordelen?",
        paragraphs: [
          "Een outfit kan in je hoofd sterk lijken en op foto toch anders overkomen. Dat komt doordat kleding samenwerkt in verhoudingen, kleuren en context. Een item dat los mooi is, kan naast een ander item ineens minder logisch voelen. Een frisse beoordeling helpt dat sneller zien.",
          "OutfitRoaster is handig vlak voor een date, werkdag, feest, festival of gewoon wanneer je twijfelt. Je krijgt geen eindeloze lijst regels, maar een verdict dat duidelijk maakt waar de look sterk is en waar hij schuurt.",
        ],
      },
      {
        title: "Eerste indruk en zelfvertrouwen",
        paragraphs: [
          "Kleding beïnvloedt hoe je binnenkomt. Niet omdat kleding bepaalt wie je bent, maar omdat stijl, kleur en pasvorm meteen een signaal afgeven. Een outfit die klopt, geeft rust. Een outfit die twijfelt, voelt soms alsof de spiegel een openstaande vraag heeft achtergelaten.",
          "De beoordeling kan helpen meer vertrouwen te krijgen. Soms bevestigt de tool dat je look sterker is dan je dacht. Soms wijst hij naar één simpele aanpassing. In beide gevallen blijft de feedback gericht op kleding, niet op uiterlijk of lichaam.",
        ],
      },
      {
        title: "Kleurcombinaties",
        paragraphs: [
          "Kleuren bepalen de sfeer van een outfit. Een rustige basis kan stijlvol en clean voelen. Een felle kleur kan energie geven. Te veel losse kleuren kunnen daarentegen alle aandacht opeisen. OutfitRoaster kijkt of kleuren elkaar ondersteunen of dat ze tegelijk de leiding willen.",
          "Bij Premium Verdict Beta wordt dit uitgebreider. Je krijgt te zien welke kleuren gedragen worden, welke goed samenwerken en welke botsen. Zo leer je niet alleen of een outfit werkt, maar ook waarom.",
        ],
      },
      {
        title: "Pasvorm",
        paragraphs: [
          "Pasvorm gaat over hoe kleding valt. Een wijde broek, oversized jas, compact shirt of nette schoen kan allemaal werken, zolang de verhouding klopt. De beoordeling kijkt naar zichtbare kledingstukken en benoemt of de snit de outfit sterker of minder sterk maakt.",
          "Belangrijk: dit is geen oordeel over je lichaam. OutfitRoaster beoordeelt stof, silhouet en combinatie. Als iets te ruim of te strak oogt, gaat dat over het kledingstuk en hoe het binnen de look werkt.",
        ],
      },
      {
        title: "Veelgestelde situaties",
        paragraphs: [
          "Mensen laten hun outfit vaak beoordelen voor een eerste date, sollicitatie, presentatie, schooldag, avond uit of festival. In elk van die situaties telt iets anders. Voor Werk wil je geloofwaardigheid. Voor Feest mag de look meer energie hebben. Voor Gym moet de outfit praktisch zijn.",
          "Door de gelegenheid te kiezen wordt de feedback relevanter. Een sneaker kan perfect zijn voor School, prima voor Date en minder geschikt voor een formele meeting. OutfitRoaster geeft daarom geen algemene modewet, maar een contextueel verdict.",
        ],
      },
    ],
  }),
  page({
    slug: "school-outfit-check",
    title: "School Outfit Checker",
    metaTitle: "School Outfit Checker – Check je outfit voor school",
    metaDescription:
      "Laat je school outfit beoordelen op comfort, stijl, kleuren, pasvorm en casual vibe. Gratis AI outfit checker voor school, college en les.",
    h1: "School Outfit Checker",
    eyebrow: "Voor school, college en campusdagen",
    intro: [
      "Een school outfit moet vooral makkelijk voelen, maar dat betekent niet dat alles willekeurig hoeft te zijn. Je wilt iets dragen dat comfortabel is, niet te hard probeert en toch genoeg stijl heeft om niet als automatische piloot te voelen. De School Outfit Checker van OutfitRoaster helpt je zien of je look die balans heeft.",
      "Upload een duidelijke foto en krijg feedback over kleding, schoenen, kleuren, pasvorm en casual vibe. De beoordeling blijft bij je outfit. Geen oordeel over lichaam, gezicht of wie je bent; alleen een eerlijke blik op wat je draagt.",
    ],
    sections: [
      {
        title: "Wat maakt een goede school outfit?",
        paragraphs: [
          "Een sterke school outfit voelt ontspannen, praktisch en bewust. Je moet erin kunnen zitten, lopen, fietsen, hangen, overstappen, koffie morsen overleven en nog steeds niet ogen alsof je kledingkast ruzie had. Comfort is dus belangrijk, maar stijl zit juist in hoe je comfortabele items combineert.",
          "OutfitRoaster kijkt of je outfit één duidelijke richting heeft. Een hoodie met jeans en sneakers kan prima zijn wanneer de pasvorm en kleuren samenwerken. Een nette bovenlaag met volledig sportieve schoenen kan ook werken, maar dan moet het expres voelen. Anders lijkt het alsof je agenda school zei en je schoenen gym hoorden.",
        ],
      },
      {
        title: "Comfort zonder slordig te worden",
        paragraphs: [
          "Voor school is comfort bijna altijd een pluspunt. Een te formele outfit kan overdreven voelen, terwijl een te losse outfit snel richting pyjamadag schuift. De kunst zit in één of twee items die de look net wat scherper maken: schone sneakers, een goede jas, een rustige kleurcombinatie of een bovenlaag die structuur geeft.",
          "De checker benoemt waar comfort werkt en waar het te veel richting ‘ik had vijf minuten’ gaat. Dat hoeft geen groot probleem te zijn. Soms is één detail genoeg. Een betere schoen, minder botsende kleuren of een jas die de outfit afmaakt kan al zorgen dat de look bewuster voelt.",
        ],
      },
      {
        title: "Kleuren en lagen voor school",
        paragraphs: [
          "Schooloutfits gebruiken vaak basics: jeans, T-shirt, hoodie, trui, vest of sneakers. Juist daardoor vallen kleur en laagjes op. Neutrale kleuren kunnen rustig en clean zijn. Eén accentkleur kan de outfit interessanter maken. Maar wanneer meerdere kleuren tegelijk om aandacht vragen, voelt de look snel als een groepsproject zonder leider.",
          "Lagen zijn handig voor lange dagen, fietsen, lokalen met rare temperatuur en onverwachte plannen na school. OutfitRoaster kijkt of die lagen samenwerken. Een overshirt, vest of jas kan veel doen voor de outfit, zolang het niet klinkt alsof elk kledingstuk naar een andere les moet.",
        ],
      },
      {
        title: "Schoenen en tas maken de vibe",
        paragraphs: [
          "Bij een school outfit sturen schoenen en tas vaak de eerste indruk. Sneakers kunnen de look fris maken, boots geven stevigheid en nette schoenen kunnen een simpele outfit serieuzer maken. Een tas of rugzak telt mee wanneer die zichtbaar is, vooral als hij qua kleur of stijl volledig een eigen verhaal begint.",
          "De School Outfit Checker kijkt of schoenen en accessoires logisch meedoen. Als de schoenen de hele outfit sportiever maken, wordt dat benoemd. Als een tas de kleuren verbindt, is dat een pluspunt. Als de accessoires voelen alsof ze op Marktplaats uit een andere outfit zijn meegekomen, hoor je dat ook.",
        ],
      },
      {
        title: "Roast of Premium Verdict Beta voor school",
        paragraphs: [
          "Wil je snel weten of je fit werkt, kies dan de gewone Outfit Roast. Je krijgt een score, drie korte feedbackregels en een shareQuote. Ideaal voor een snelle check voordat je vertrekt. Wil je echt begrijpen waarom iets werkt, test dan Premium Verdict Beta.",
          "Premium kijkt dieper naar kleur, pasvorm, stijlidentiteit, context en trendgevoel. Dat is handig als je schooloutfits wilt bouwen die makkelijk blijven, maar er niet uitzien alsof de kledingkast op shuffle stond. De feedback blijft praktisch: wat werkt, wat botst en welk onderdeel de look het meeste stuurt.",
        ],
      },
    ],
  }),
  page({
    slug: "gym-outfit-check",
    title: "Gym Outfit Checker",
    metaTitle: "Gym Outfit Checker – Check je sportschool outfit",
    metaDescription:
      "Check je gym outfit op sportieve vibe, pasvorm, comfort, schoenen en praktische uitstraling. Gratis AI outfit checker voor de sportschool.",
    h1: "Gym Outfit Checker",
    eyebrow: "Voor fits die de sportschool aankunnen",
    intro: [
      "Een gym outfit moet praktisch zijn, maar dat betekent niet dat hij geen stijl kan hebben. De Gym Outfit Checker van OutfitRoaster kijkt of je sportschoolfit logisch, comfortabel en sportief overkomt zonder dat het lijkt alsof elk item uit een andere sporttas komt.",
      "De feedback gaat over zichtbare kleding: top, broek, schoenen, lagen en accessoires. Geen oordeel over lichaam, vorm, prestaties of gezondheid. Alleen de vraag: werkt deze outfit voor de gym en ziet het eruit alsof er een plan achter zit?",
    ],
    sections: [
      {
        title: "Wat maakt een goede gym outfit?",
        paragraphs: [
          "Een goede gym outfit voelt functioneel. Je moet erin kunnen bewegen, zweten, tillen, rennen of rustig trainen zonder dat de kleding alle aandacht opeist. Tegelijk wil je niet dat de look eruitziet alsof je onderweg naar de wasmand per ongeluk een dumbbell tegenkwam.",
          "OutfitRoaster kijkt naar sportieve samenhang. Een trainingstop, short, jogger, legging, hoodie of sneaker kan prima werken zolang de onderdelen hetzelfde doel lijken te hebben. Als de bovenlaag sportschool zegt maar de schoenen festivalterrein fluisteren, wordt dat duidelijk benoemd.",
        ],
      },
      {
        title: "Pasvorm en bewegingsruimte",
        paragraphs: [
          "Voor de gym draait pasvorm om bewegingsruimte en verhouding. Te ruim kan onhandig ogen, te strak kan afleiden, en een combinatie van beide kan lijken alsof de outfit niet wist welke training gepland stond. De checker beoordeelt hoe kleding zichtbaar valt zonder iets over je lichaam te zeggen.",
          "Een ruimere hoodie kan goed werken met een smallere sportbroek. Een oversized shirt kan prima zijn wanneer de rest van de look bewust sportief blijft. Schoenen en broek bepalen vaak of de fit er atletisch uitziet of alsof hij nog moet beslissen tussen bankdrukken en boodschappen doen.",
        ],
      },
      {
        title: "Kleur en materiaalgevoel",
        paragraphs: [
          "Gym outfits zijn vaak zwart, grijs, wit of donkerblauw, maar kleur kan juist energie geven. Een accentkleur in schoenen of top werkt goed wanneer hij niet volledig losstaat van de rest. Te veel felle kleuren kunnen snel voelen als een sportdag waar niemand de teamkleur heeft afgesproken.",
          "Materiaal is op een foto niet altijd perfect te herkennen, maar de uitstraling telt wel mee. Sportieve stoffen, strakke lijnen en praktische lagen geven een andere vibe dan zware jeans of nette schoenen. Als iets onpraktisch lijkt voor Gym, benoemt OutfitRoaster dat vanuit de outfit, niet vanuit jouw sportniveau.",
        ],
      },
      {
        title: "Schoenen zijn de basis",
        paragraphs: [
          "Voor Gym zijn schoenen belangrijker dan bijna elk ander zichtbaar item. Ze bepalen of de outfit sportief en praktisch overkomt. Sneakers kunnen perfect zijn, maar moeten wel passen bij het type fit. Te nette schoenen of schoenen met een volledig andere vibe trekken de outfit meteen uit de sportschoolcontext.",
          "De checker kijkt of schoenen de sportieve richting ondersteunen. Als ze stevig, clean en passend ogen, is dat een pluspunt. Als ze lijken alsof ze per ongeluk mee zijn gekomen uit een kantooroutfit, krijgt de roast daar waarschijnlijk vrij snel lucht van.",
        ],
      },
      {
        title: "Wanneer Premium Verdict Beta handig is",
        paragraphs: [
          "De gewone Gym Outfit Check is snel en grappig. Je krijgt meteen een score en feedback die duidelijk maakt of de outfit praktisch en sportief voelt. Premium Verdict Beta is nuttig als je je sportieve stijl bewuster wilt maken, bijvoorbeeld met betere kleurkeuzes, lagen of shoprichtingen.",
          "Premium kan uitleggen waarom een bepaalde broek beter werkt, welke schoenen de look sportiever maken en hoe je een hoodie of top combineert zonder dat de outfit rommelig wordt. Het blijft een outfitanalyse, geen fitnessadvies. Je kleding staat centraal, niet je training.",
        ],
      },
    ],
  }),
  page({
    slug: "feest-outfit-check",
    title: "Feest Outfit Checker",
    metaTitle: "Feest Outfit Checker – Check je outfit voor een feest",
    metaDescription:
      "Laat je feest outfit beoordelen op vibe, kleuren, pasvorm, schoenen en uitstraling. Gratis AI outfit checker voor verjaardag, borrel of avond uit.",
    h1: "Feest Outfit Checker",
    eyebrow: "Voor verjaardagen, borrels en avondplannen",
    intro: [
      "Een feest outfit moet energie hebben zonder eruit te zien alsof je hele kledingkast tegelijk mee wilde. De Feest Outfit Checker van OutfitRoaster kijkt of je look past bij verjaardagen, borrels, diners, huisfeesten en avonden waarop de groepsapp ineens plannen maakt.",
      "De feedback is scherp, Nederlands en outfit-only. We kijken naar kleding, kleur, pasvorm, schoenen, accessoires en vibe. Niet naar lichaam, leeftijd, gezicht of aantrekkelijkheid. Je outfit mag commentaar krijgen; jij niet.",
    ],
    sections: [
      {
        title: "Wat maakt een outfit geschikt voor feest?",
        paragraphs: [
          "Een feest outfit mag iets meer hebben dan een normale daglook. Dat kan kleur zijn, een mooie jas, nette schoen, opvallend shirt, sterke tas of een combinatie die net wat meer avond voelt. Maar feestelijk betekent niet automatisch druk. De beste looks hebben één duidelijke bron van energie.",
          "OutfitRoaster kijkt of de outfit weet waar hij heen gaat. Een look kan perfect zijn voor een verjaardag maar te casual voor een diner. Een outfit kan sterk starten, maar door schoenen ineens richting tankstation na middernacht gaan. De checker vertaalt dat naar een score, feedback en een quote.",
        ],
      },
      {
        title: "Vibe: relaxed, netjes of chaos?",
        paragraphs: [
          "Feestcontext is breed. Een borrel vraagt iets anders dan een clubavond, en een familiediner vraagt iets anders dan een huisfeest. Toch telt altijd de eerste indruk: ziet de outfit eruit alsof je moeite hebt gedaan zonder dat het toneelstuk wordt?",
          "De Feest Outfit Checker benoemt de vibe. Is de look verzorgd? Is hij te veilig? Zijn er te veel stijlen tegelijk? Een outfit kan bijvoorbeeld zeggen: ‘ik kom gezellig langs’, terwijl de schoenen zeggen: ‘ik moest eigenlijk naar de supermarkt’. Zulke contrasten maken de feedback direct duidelijk.",
        ],
      },
      {
        title: "Kleuren en statement pieces",
        paragraphs: [
          "Voor een feest mag kleur meer ruimte krijgen. Een accentkleur, print of opvallend accessoire kan de outfit interessanter maken. Het gevaar is dat meerdere statement pieces tegelijk hoofdact willen zijn. Dan voelt de look eerder als een buurtfeest met drie dj’s dan als één sterke outfit.",
          "OutfitRoaster kijkt daarom naar balans. Eén opvallend item kan heel goed werken wanneer de rest ondersteunt. Als kleuren botsen, wordt uitgelegd of dat leuk en feestelijk voelt of gewoon onrustig. Premium Verdict Beta gaat hier dieper op in met kleur- en samenhanganalyse.",
        ],
      },
      {
        title: "Schoenen bepalen hoe laat het is",
        paragraphs: [
          "Schoenen veranderen een feest outfit enorm. Nette schoenen maken de look direct verzorgder. Clean sneakers kunnen casual en modern voelen. Boots geven stevigheid. Maar schoenen die te sportief, te versleten of te praktisch ogen, kunnen een feestlook omlaag trekken.",
          "De checker kijkt of de schoenen meedoen met de gelegenheid. Een goede schoen hoeft niet duur te zijn; hij moet kloppen met de rest. Als de broek en bovenlaag al feest zeggen, maar de schoenen eruitzien alsof ze geen uitnodiging hebben gekregen, maakt OutfitRoaster daar waarschijnlijk een punt van.",
        ],
      },
      {
        title: "Van snelle roast naar betere feestfit",
        paragraphs: [
          "Gebruik de gewone Outfit Roast wanneer je snel wilt weten of je look werkt. Je krijgt korte, grappige feedback en een deelbare quote. Dat is ideaal als je twijfelt vlak voor vertrek. Premium Verdict Beta is beter wanneer je meerdere opties vergelijkt of wilt begrijpen waarom een outfit sterker kan.",
          "Premium geeft concretere verbeterpunten: andere schoencategorie, rustiger kleurgebruik, betere laag, sterker accessoire of meer samenhang tussen bovenlaag en broek. Zo wordt de feestfit geen compleet project, maar wel duidelijker dan ‘ziet er prima uit’.",
        ],
      },
    ],
  }),
  page({
    slug: "sollicitatie-outfit-check",
    title: "Sollicitatie Outfit Checker",
    metaTitle: "Sollicitatie Outfit Checker – Check je sollicitatie outfit",
    metaDescription:
      "Check of je sollicitatie outfit professioneel, verzorgd en geloofwaardig overkomt. AI-feedback over pasvorm, kleur, schoenen en eerste indruk.",
    h1: "Sollicitatie Outfit Checker",
    eyebrow: "Voor eerste indruk zonder paniek",
    intro: [
      "Een sollicitatie outfit hoeft niet altijd strak in pak te zijn, maar moet wel vertrouwen uitstralen. De Sollicitatie Outfit Checker van OutfitRoaster helpt je zien of je look professioneel, verzorgd en geloofwaardig overkomt voor het gesprek dat je hebt.",
      "De beoordeling gaat over kleding en styling: pasvorm, kleur, schoenen, lagen en samenhang. Niet over jou als persoon. OutfitRoaster helpt je voorkomen dat je outfit een fantastisch cv binnenbrengt met schoenen die nog op weekendstand staan.",
    ],
    sections: [
      {
        title: "Wat maakt een sollicitatie outfit sterk?",
        paragraphs: [
          "Een sterke sollicitatie outfit geeft rust. Hij laat zien dat je de situatie serieus neemt zonder jezelf te verkleden als iemand anders. Afhankelijk van de functie kan dat formeel, smart casual of creatiever zijn. Belangrijk is dat de outfit bewust voelt en niet afleidt van wat je wilt vertellen.",
          "OutfitRoaster kijkt naar professionaliteit, pasvorm, kleuren en schoenen. Een blazer kan helpen, maar is niet verplicht. Een sneaker kan soms prima, maar moet clean en passend zijn. Een overhemd, trui of bovenlaag moet samenwerken met de broek en schoenen zodat de look geloofwaardig blijft.",
        ],
      },
      {
        title: "Eerste indruk en geloofwaardigheid",
        paragraphs: [
          "Bij een sollicitatie telt de eerste indruk extra hard. Kleding hoeft niet perfect te zijn, maar moet geen onnodige vragen oproepen. Te casual kan overkomen alsof je het gesprek onderschat. Te formeel kan afstandelijk voelen wanneer het bedrijf juist informeel is. De juiste balans verschilt per rol.",
          "De checker beoordeelt daarom niet op één ouderwetse regel. Hij kijkt naar de gekozen context Werk en naar de uitstraling van het geheel. Komt de outfit voorbereid over? Straalt hij rust uit? Of voelt hij als een vergadering waar de agenda ontbreekt?",
        ],
      },
      {
        title: "Kleurgebruik voor sollicitaties",
        paragraphs: [
          "Voor sollicitaties werken rustige kleuren vaak goed omdat ze weinig afleiden. Donkerblauw, zwart, grijs, wit, beige of aardetinten kunnen professioneel ogen. Dat betekent niet dat kleur verboden is. Eén subtiel accent kan juist karakter geven, zolang het niet alle aandacht opeist.",
          "OutfitRoaster kijkt of kleuren geloofwaardig en samenhangend voelen. Een fel item kan prima zijn in een creatieve sector, maar minder logisch bij een formele rol. Premium Verdict Beta kan uitgebreider uitleggen welke kleuren vertrouwen geven en welke combinatie te druk oogt.",
        ],
      },
      {
        title: "Pasvorm en verzorging",
        paragraphs: [
          "Pasvorm is bij sollicitaties belangrijk omdat het direct invloed heeft op verzorgdheid. Een te ruime jas kan de look minder scherp maken. Een broek die niet logisch valt op de schoen kan rommelig ogen. Een bovenlaag met goede structuur kan juist meteen professioneler voelen.",
          "De feedback blijft bij kledingstukken. Het gaat niet om lichaamsvorm, maar om hoe textiel zichtbaar valt. Als iets netter of sterker kan, benoemt OutfitRoaster dat praktisch: welke categorie, welke snit of welke combinatie waarschijnlijk beter werkt.",
        ],
      },
      {
        title: "Waarom vooraf checken slim is",
        paragraphs: [
          "Voor een sollicitatie wil je je hoofd vrij hebben voor het gesprek, niet voor twijfel over je outfit. Een snelle check kan bevestigen dat je goed zit of aanwijzen welk onderdeel de indruk verstoort. Vaak is dat geen grote verbouwing, maar één duidelijke keuze.",
          "Gebruik de Sollicitatie Outfit Checker met Werk als gelegenheid. Kies Stijlcoach als je vooral nuttige feedback wilt of Pittig als je ook een scherpe realitycheck kunt hebben. Premium Verdict Beta geeft de meest uitgebreide voorbereiding met contextfit, stijlidentiteit en concrete verbeterpunten.",
        ],
      },
    ],
  }),
  page({
    slug: "eerste-date-outfit",
    title: "Eerste Date Outfit",
    metaTitle: "Eerste Date Outfit – Check je look voor een eerste date",
    metaDescription:
      "Twijfel je over je eerste date outfit? Laat AI je look checken op eerste indruk, confidence, kleuren, pasvorm en date vibe.",
    h1: "Eerste Date Outfit",
    eyebrow: "Voor die ene eerste indruk",
    intro: [
      "Een eerste date outfit moet precies genoeg zeggen. Verzorgd, maar niet wanhopig. Ontspannen, maar niet alsof je net de bank hebt verlaten. De Eerste Date Outfit checker van OutfitRoaster helpt je bepalen of je look datewaardig voelt.",
      "De feedback gaat over zichtbare kleding: bovenlaag, broek, schoenen, kleuren, accessoires en vibe. Nooit over aantrekkelijkheid, lichaam of gezicht. Je krijgt een eerlijk verdict over de outfit, zodat jij met minder spiegelstress de deur uit kunt.",
    ],
    sections: [
      {
        title: "Wat draag je naar een eerste date?",
        paragraphs: [
          "Er is geen universele eerste date outfit. Een koffiedate vraagt iets anders dan diner, wandeling, museum of drankjes. Toch werkt meestal dezelfde basis: kleding die verzorgd voelt, bij jou past en niet te veel toneel speelt. Je wilt eruitzien alsof je moeite hebt gedaan, maar niet alsof de outfit een eigen PR-team heeft.",
          "OutfitRoaster beoordeelt of je look die balans heeft. Een simpele outfit kan heel sterk zijn wanneer pasvorm, schoenen en kleuren kloppen. Een opvallende outfit kan ook werken, zolang hij niet alle ruimte in het gesprek opeist voordat jij iets hebt gezegd.",
        ],
      },
      {
        title: "Date vibe: zelfverzekerd of te veilig?",
        paragraphs: [
          "Bij een eerste date draait het niet alleen om netjes zijn. De outfit moet ook een beetje persoonlijkheid laten zien. Te veilig kan saai voelen. Te druk kan chaotisch worden. De beste date outfits hebben één duidelijk accent en een basis die rust geeft.",
          "De checker benoemt of de outfit relaxed, zelfverzekerd, awkward, te casual of juist sterk overkomt. Dat gebeurt via kledingobservaties. Bijvoorbeeld: de bovenlaag probeert diner, maar de sneakers willen nog even langs de snackbar. Zulke feedback is grappig, maar ook meteen bruikbaar.",
        ],
      },
      {
        title: "Kleuren die werken voor een eerste indruk",
        paragraphs: [
          "Rustige kleuren geven vaak vertrouwen. Donkere tinten, wit, beige, denim of aardetinten kunnen makkelijk werken. Een accentkleur kan de look interessanter maken. Het gevaar zit in kleuren die los van elkaar lijken te bestaan. Dan krijgt je outfit het karakter van een groepsapp waarin niemand durft te kiezen.",
          "OutfitRoaster kijkt of kleuren samenwerken en of ze passen bij Date als gelegenheid. Premium Verdict Beta kan precieser uitleggen welke kleuren sterk zijn, welke botsen en hoe je met kleine aanpassingen meer samenhang krijgt.",
        ],
      },
      {
        title: "Schoenen voor een eerste date",
        paragraphs: [
          "Schoenen zijn op een eerste date verraderlijk belangrijk. Ze maken een outfit direct netter, sportiever, relaxter of rommeliger. Clean sneakers zijn vaak prima. Nette schoenen kunnen sterker zijn bij diner of cocktails. Te afgetrapte of te sportieve schoenen kunnen de look omlaag trekken.",
          "De checker kijkt of je schoenen het verhaal ondersteunen. Als de rest van de outfit moeite doet en de schoenen duidelijk niet zijn ingelicht, wordt dat benoemd. Andersom kunnen goede schoenen een simpele outfit precies genoeg date-energie geven.",
        ],
      },
      {
        title: "Snel checken voordat je vertrekt",
        paragraphs: [
          "De Eerste Date Outfit pagina is bedoeld voor snelle twijfel. Upload je foto, kies Date en bepaal hoe hard de feedback mag zijn. Stijlcoach geeft vooral vertrouwen en positieve feedback. Pittig is eerlijker. Genadeloos is voor wie de harde waarheid liever van een app hoort dan van de groepsapp.",
          "Wil je meer dan een snelle roast, gebruik Premium Verdict Beta. Die analyse kijkt dieper naar kleur, pasvorm, stijlidentiteit en context. Handig als je tussen twee looks twijfelt en niet wil vertrekken in een outfit die onderweg drie keer van richting verandert.",
        ],
      },
    ],
  }),
  page({
    slug: "smart-casual-outfit-check",
    title: "Smart Casual Outfit Checker",
    metaTitle: "Smart Casual Outfit Checker – Check je smart casual look",
    metaDescription:
      "Laat je smart casual outfit beoordelen op balans tussen netjes en relaxed, kleur, pasvorm, schoenen en gelegenheid.",
    h1: "Smart Casual Outfit Checker",
    eyebrow: "Netjes zonder kantoorpaniek",
    intro: [
      "Smart casual klinkt makkelijk, maar is precies de dresscode waar outfits vaak verdwalen. Te netjes voelt stijf, te casual voelt alsof je de memo half hebt gelezen. De Smart Casual Outfit Checker van OutfitRoaster kijkt of jouw look de balans tussen verzorgd en relaxed goed raakt.",
      "Upload je outfit en krijg feedback over bovenlaag, broek, schoenen, kleuren, pasvorm en context. De beoordeling gaat alleen over kleding. Geen bodyshaming, geen persoonlijke opmerkingen, wel een eerlijk verdict dat meteen duidelijk maakt waar de look staat.",
    ],
    sections: [
      {
        title: "Wat is smart casual eigenlijk?",
        paragraphs: [
          "Smart casual is de middenweg tussen formeel en ontspannen. Denk aan een nette trui met chino, blazer met clean sneakers, overhemd zonder das, of een verzorgde jeans met goede schoenen. Het gaat niet om één verplicht kledingstuk, maar om balans.",
          "De valkuil is dat de ene helft van de outfit smart is en de andere helft casual, zonder dat ze elkaar ontmoeten. Dan krijg je een look die klinkt als LinkedIn met weekendplannen. OutfitRoaster kijkt of de twee kanten samenwerken of elkaar saboteren.",
        ],
      },
      {
        title: "Schoenen bepalen het niveau",
        paragraphs: [
          "In smart casual zijn schoenen vaak de knop waarmee je de outfit hoger of lager zet. Nette schoenen maken een casual basis meteen serieuzer. Clean sneakers kunnen een formele bovenlaag moderner maken. Maar sportieve sneakers of versleten schoenen kunnen het smart gedeelte volledig onderuit trekken.",
          "De checker beoordeelt of je schoenen passen bij de rest. Een blazer met sneakers kan sterk zijn wanneer de sneakers strak en bewust ogen. Een nette broek met schoenen die naar de gym willen, voelt sneller alsof twee dresscodes om voorrang vragen.",
        ],
      },
      {
        title: "Kleur en materiaal",
        paragraphs: [
          "Smart casual werkt vaak goed met rustige kleuren: donkerblauw, grijs, zwart, wit, beige, bruin of groen. Eén accentkleur kan karakter geven. Te veel felle kleuren maken de look minder rustig. Materiaalgevoel telt ook mee: denim, wol, katoen, leerlook of sportieve stof sturen de vibe.",
          "OutfitRoaster kan niet elk materiaal perfect herkennen, maar de uitstraling is zichtbaar genoeg voor nuttige feedback. Een sportieve hoodie kan onder een jas werken, maar moet dan bewust voelen. Een overhemd met verkeerde broek kan juist klinken alsof de outfit geen eindbesluit heeft genomen.",
        ],
      },
      {
        title: "Voor werk, date of feest",
        paragraphs: [
          "Smart casual is populair omdat het in veel situaties past: werk, date, diner, feest, borrel of presentatie. Toch verandert de ideale balans per context. Voor Werk mag het iets netter. Voor Date mag het relaxter en persoonlijker. Voor Feest mag er meer energie in kleur of accessoire zitten.",
          "Kies daarom altijd de juiste gelegenheid in OutfitRoaster. Dezelfde jeans en blazer kunnen voor Date perfect zijn, maar voor een sollicitatie net te los. Context maakt het verschil tussen ‘goed gekleed’ en ‘goede outfit voor dit moment’.",
        ],
      },
      {
        title: "Waarom een check helpt",
        paragraphs: [
          "Smart casual is lastig omdat kleine details veel veranderen. Eén schoen, riem, jas of kleur kan de hele look verschuiven. Een check helpt om dat snel te zien. Je krijgt geen stijlles van twintig minuten, maar een helder verdict over wat werkt en wat wringt.",
          "Voor een snelle beoordeling kies je de Outfit Roast. Voor een diepere analyse kies je Premium Verdict Beta. Dan krijg je kleur-, pasvorm-, samenhang- en contextfeedback, plus concrete verbeterpunten. Zo blijft smart casual geen dresscode met openstaande actiepunten.",
        ],
      },
    ],
  }),
] satisfies SeoPage[];

export const seoPageSlugs = seoPages.map((seoPage) => seoPage.slug);

export function getSeoPage(slug: string): SeoPage | undefined {
  return seoPages.find((seoPage) => seoPage.slug === slug);
}
