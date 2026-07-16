export type BlogSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogLink = {
  href: string;
  label: string;
  description: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  articleCategory: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  cta: {
    label: string;
    subtext: string;
    target: string;
  };
  intro: string[];
  sections: BlogSection[];
  faqs: BlogFaq[];
  relatedLinks: BlogLink[];
};

export const blogPosts = [
  {
    slug: "festival-outfit-2026",
    title: "Festival outfit 2026: wat trek je aan naar een festival?",
    metaTitle: "Festival outfit 2026: tips voor dames en heren | OutfitRoaster",
    metaDescription:
      "Wat trek je aan naar een festival? Bekijk praktische tips voor kleding, schoenen, laagjes en accessoires en laat je festivaloutfit gratis beoordelen door AI.",
    excerpt:
      "Praktische festival outfit tips voor 2026: schoenen, laagjes, accessoires, weer, dames- en herencombinaties plus AI-check.",
    articleCategory: "festival",
    publishedAt: "2026-07-16",
    updatedAt: "2026-07-16",
    readingTime: "10 min leestijd",
    cta: {
      label: "Check mijn festivaloutfit",
      subtext: "Upload je look en ontvang direct een AI-score en eerlijke outfitcheck.",
      target: "/outfit-check/festival-outfit",
    },
    intro: [
      "Een festivaloutfit moet meer kunnen dan alleen goed staan op de eerste foto van de dag. Je loopt veel, staat in rijen, danst, zit misschien op gras, krijgt te maken met zon, wind, regen of modder en wil aan het einde van de avond nog steeds niet het gevoel hebben dat je outfit je heeft verraden. Mooi is dus niet genoeg. Een goede festivalfit is stijl, comfort en praktisch nadenken in één.",
      "Dat betekent niet dat je veilig of saai moet gaan. Juist op festivals mag kleding meer karakter hebben: kleur, textuur, accessoires, sneakers, boots, denim, laagjes, alles kan. De kunst is dat de look klopt voor het type festival én dat je hem een hele dag volhoudt. Twijfel je? Dan kun je je outfit laten checken met OutfitRoaster: upload je foto en krijg direct een AI-score, eerlijke outfitcheck en eventueel een roast die je kleding aanpakt, niet jou.",
    ],
    sections: [
      {
        title: "Wat trek je aan naar een festival?",
        paragraphs: [
          "Begin niet bij het kledingstuk, maar bij het festival zelf. Een dagfestival in de stad vraagt iets anders dan drie dagen camping, een dancefestival in juli of een buitenfestival waar regen praktisch een gastartiest is. Kijk naar locatie, ondergrond, duur, temperatuur en hoeveel je moet lopen. Een outfit die perfect is voor een middag op asfalt kan compleet onhandig zijn op gras of modder.",
          "Denk ook aan het verschil tussen overdag en avond. Overdag wil je luchtigheid, zonbescherming en bewegingsruimte. Zodra het afkoelt, wil je een laag die je niet haat om mee te dragen. Een dun jack, overshirt, vest of blouse kan genoeg zijn. De beste festivaloutfit voelt niet alsof je elk uur opnieuw moet onderhandelen met het weer.",
          "Vraag jezelf af: kan ik hierin zitten, lopen, dansen en naar het toilet zonder drama? Als het antwoord ergens nee is, is de outfit misschien goed voor Instagram, maar niet voor een echte festivaldag.",
        ],
      },
      {
        title: "Festival outfit voor dames",
        paragraphs: [
          "Voor dames werkt een luchtige top met cargobroek vaak goed omdat je comfort en stijl combineert. De cargobroek geeft ruimte, zakken en een stoerdere basis, terwijl een top, cropped shirt of blouse de look lichter maakt. Met stevige sneakers of boots wordt het praktisch zonder dat het saai wordt.",
          "Een jurk kan ook prima naar een festival, zolang je hem combineert met schoenen die de dag aankunnen. Denk aan een simpele jurk met stevige sneakers, boots of sandalen die al zijn ingelopen. Voeg een denim jack, oversized blouse of licht vest toe voor later op de dag. Zo blijft de outfit fotogeniek zonder dat je bij elke windvlaag spijt krijgt.",
          "Een denim short met oversized blouse is een klassieker omdat hij makkelijk aan te passen is. Open blouse over een tanktop, zonnebril, kleine tas en goede schoenen: simpel, maar met genoeg festivalenergie. Wil je meer statement, kies dan één opvallend item zoals kleur, print, metallic tas of zonnebril. Niet alles tegelijk, tenzij je outfit auditie doet voor de mainstage.",
        ],
      },
      {
        title: "Festival outfit voor heren",
        paragraphs: [
          "Voor heren is een T-shirt met overshirt en cargobroek een sterke basis. Het T-shirt houdt het relaxed, het overshirt geeft laag en vorm, en de cargobroek is praktisch zonder dat het meteen survivalmodus wordt. Met sneakers of boots kun je de look streetwear, casual of wat netter maken.",
          "Een luchtig overhemd met short werkt goed voor warme festivals. Kies liever een overhemd dat losjes valt dan iets dat te strak zit zodra het warm wordt. Combineer met sneakers, lage boots of stevige sandalen, afhankelijk van het terrein. Een ketting, zonnebril of pet kan genoeg zijn om de look minder standaard te maken.",
          "Streetwear blijft festivalproof wanneer de proporties kloppen. Oversized T-shirt, rechte jeans of cargo, goede sneakers en een crossbodytas kunnen sterk zijn. Let wel op temperatuur: een zware hoodie om 14:00 in de zon is geen outfit, dat is een persoonlijke sauna met logo.",
        ],
      },
      {
        title: "Schoenen: het belangrijkste festivalonderdeel",
        paragraphs: [
          "Schoenen bepalen of je festivaldag leuk blijft. Sneakers zijn vaak de beste keuze als ze stevig, schoon genoeg en ingelopen zijn. Witte sneakers kunnen goed, maar accepteer dat ze na regen of modder niet meer dezelfde persoonlijkheid hebben. Boots zijn handig bij modder, ruiger terrein of festivals waar je veel staat.",
          "Nieuwe schoenen zijn bijna altijd een slecht idee. Een festival is geen testomgeving voor blaren. Draag schoenen waarvan je weet dat ze lange afstanden aankunnen. Open schoenen kunnen bij warm weer fijn zijn, maar zijn minder handig in drukte, bij modder of wanneer mensen om je heen dansen alsof ze hun enkels niet nodig hebben.",
          "Let ook op de verhouding met je outfit. Hele lompe schoenen onder een luchtige zomerlook kunnen werken als het bewust voelt. Te nette schoenen op een veldfestival voelen meestal alsof je onderweg naar een bruiloft verkeerd bent afgeslagen.",
        ],
      },
      {
        title: "Laagjes en weer",
        paragraphs: [
          "Laagjes zijn geen bijzaak. Een poncho klinkt niet sexy, maar regen in een dunne top is dat ook niet. Kies een compacte poncho als het weer twijfelachtig is. Een licht jack, vest of overshirt is handig voor de avond en kan overdag om je middel of in je tas.",
          "Bescherming tegen zon hoort ook bij styling. Een pet, hoed of zonnebril kan de look sterker maken én praktisch zijn. Lichte stoffen helpen bij warmte, maar let op doorschijnen, kreuken en hoe het materiaal valt wanneer je beweegt. Festivalstijl werkt het beste wanneer praktisch en opvallend elkaar niet tegenwerken.",
        ],
      },
      {
        title: "Accessoires die echt iets toevoegen",
        paragraphs: [
          "Een kleine crossbodytas is vaak beter dan een grote shopper. Je wilt je spullen bij je houden zonder dat je tas de hele dag als extra festivalgast aan je schouder hangt. Kies ruimte voor telefoon, pasjes, oordoppen, lipbalm, zonnebrand en eventueel een poncho.",
          "Zonnebrillen, petten, sieraden en opvallende riemen kunnen een simpele outfit meteen meer karakter geven. Houd wel balans. Als je outfit al veel kleur of print heeft, hoeven accessoires niet allemaal ook nog een solo te spelen. Oordoppen zijn trouwens geen mode-item, maar wel topniveau praktisch. Je toekomstige zelf bedankt je.",
        ],
      },
      {
        title: "Veelgemaakte festivaloutfit-fouten",
        paragraphs: [
          "De grootste fout is alleen op de foto letten. Natuurlijk wil je dat je outfit er goed uitziet, maar als je na twee uur niet meer normaal kunt lopen, heeft de look verloren. Festivaloutfits moeten in beweging werken.",
        ],
        bullets: [
          "Nieuwe schoenen aantrekken en hopen dat het goedkomt.",
          "Geen laag meenemen voor de avond.",
          "Een te zware tas meenemen.",
          "De outfit niet vooraf passen of bewegen testen.",
          "Stoffen kiezen die snel schuren, plakken of extreem kreuken.",
          "Geen rekening houden met regen, gras of modder.",
          "Te veel losse accessoires dragen die je kwijt kunt raken.",
          "Een outfit kiezen die niet past bij het type festival.",
        ],
      },
      {
        title: "Festivaloutfit-checklist",
        paragraphs: [
          "Gebruik deze checklist voordat je vertrekt. Als je op de meeste vragen ja kunt antwoorden, zit je waarschijnlijk goed. Als je bij schoenen of weer twijfelt, los dat eerst op.",
        ],
        bullets: [
          "Kan ik hier minstens acht uur in lopen en staan?",
          "Zijn mijn schoenen ingelopen?",
          "Heb ik een laag voor kou of regen?",
          "Past de outfit bij terrein, muziekstijl en locatie?",
          "Kan mijn tas alles dragen zonder irritant te worden?",
          "Is er één opvallend detail zonder dat alles schreeuwt?",
          "Heb ik gedacht aan zon, modder en temperatuurverschil?",
          "Voelt de outfit nog steeds als mezelf?",
        ],
      },
      {
        title: "AI festival outfit checker",
        paragraphs: [
          "Met de festival outfit checker van OutfitRoaster upload je een foto van je look en krijg je direct feedback. De AI kijkt naar zichtbare kleding, schoenen, laagjes, kleur, accessoires en festivalvibe. Daarna krijg je een score, korte outfitcheck en eventueel een roast die grappig is, maar veilig blijft: de outfit wordt beoordeeld, niet jij als persoon.",
          "AI vervangt geen persoonlijke smaak. Als jij je goed voelt in een look, telt dat zwaar. De tool helpt vooral bij twijfel: zijn de schoenen logisch, is de outfit praktisch genoeg, mist er een laag, of voelt de combinatie juist sterk? Zie het als een laatste check voordat je de deur uitgaat.",
        ],
      },
    ],
    faqs: [
      { question: "Wat trek je aan naar een festival?", answer: "Kies kleding die past bij het type festival, het weer en hoeveel je moet lopen. Comfort, schoenen en laagjes zijn net zo belangrijk als uitstraling." },
      { question: "Welke schoenen zijn geschikt voor een festival?", answer: "Ingelopen sneakers of boots zijn meestal het veiligst. Vermijd nieuwe schoenen en te kwetsbare open schoenen als je veel loopt of modder verwacht." },
      { question: "Wat draag je bij regen?", answer: "Neem een compacte poncho, licht jack of waterafstotende laag mee. Kies schoenen die modder aankunnen en vermijd stoffen die zwaar worden als ze nat zijn." },
      { question: "Wat is een goede festivaloutfit voor warm weer?", answer: "Lichte stoffen, ademende tops, shorts, jurken of wijde broeken werken goed. Denk wel aan zonbescherming en een laag voor de avond." },
      { question: "Hoe maak je een simpele festivaloutfit opvallender?", answer: "Voeg één sterk detail toe: zonnebril, tas, kleuraccent, print, sieraden of opvallende sneakers. Houd de rest rustiger." },
      { question: "Kan AI mijn festivaloutfit beoordelen?", answer: "Ja. OutfitRoaster analyseert je foto en geeft een score, outfitcheck en feedback op kleding, schoenen, kleuren en festivalgeschiktheid." },
    ],
    relatedLinks: [
      { href: "/outfit-check/festival-outfit", label: "Festival outfit checker", description: "Laat je festivalfit gratis beoordelen door AI." },
      { href: "/outfit-check/zomer-outfit", label: "Zomer outfit", description: "Tips voor luchtige outfits bij warm weer." },
      { href: "/outfit-check/sneaker-outfit", label: "Sneaker outfit", description: "Check of je sneakers bij je outfit passen." },
      { href: "/outfit-check/streetwear-outfit", label: "Streetwear outfit", description: "Bekijk hoe je streetwearfit in elkaar valt." },
      { href: "/blog/eerste-date-outfit", label: "Eerste date outfit", description: "Ook twijfels buiten festivals? Check date-outfit tips." },
    ],
  },
  {
    slug: "eerste-date-outfit",
    title: "Eerste date outfit: wat trek je aan?",
    metaTitle: "Eerste date outfit: wat trek je aan? | OutfitRoaster",
    metaDescription:
      "Twijfel je over je eerste date outfit? Bekijk tips voor restaurant, café en wandeling en laat je look gratis beoordelen door AI.",
    excerpt:
      "Wat trek je aan op een eerste date? Tips voor restaurant, café, wandeling, bioscoop, schoenen, kleuren en AI-check.",
    articleCategory: "date",
    publishedAt: "2026-07-16",
    updatedAt: "2026-07-16",
    readingTime: "9 min leestijd",
    cta: {
      label: "Check mijn date-outfit",
      subtext: "Upload je look en ontdek hoe jouw outfit scoort.",
      target: "/outfit-check/date-outfit",
    },
    intro: [
      "Een eerste date outfit voelt vaak lastiger dan hij is. Je wilt verzorgd overkomen, maar niet verkleed. Je wilt moeite laten zien, maar niet alsof je hele kledingkast crisisoverleg heeft gehad. En ondertussen wil je vooral iets dragen waarin je normaal kunt zitten, lopen, lachen en jezelf blijven.",
      "De beste eerste date outfit is meestal een verzorgde versie van je normale stijl. Niet compleet nieuw, niet overdreven veilig, maar herkenbaar jij met iets meer aandacht voor pasvorm, schoenen en details. Twijfel je vlak voor vertrek? OutfitRoaster kan meekijken: upload je foto en krijg direct een AI-score, roast of outfitcheck.",
    ],
    sections: [
      {
        title: "De belangrijkste regel",
        paragraphs: [
          "Draag iets dat bij jezelf past. Een eerste date is niet het moment om ineens een volledig nieuwe stijl uit te proberen waarin je je de hele avond bewust bent van elke beweging. Als je normaal casual gekleed gaat, maak dat dan netter. Als je graag opvallend draagt, houd dat erin, maar kies één duidelijk statement.",
          "Comfort is geen bijzaak. Een outfit die alleen werkt wanneer je rechtop voor de spiegel staat, is geen goede datefit. Je moet kunnen zitten, lopen en ontspannen zonder steeds aan je kleding te trekken. Zelfvertrouwen komt niet uit een kledingstuk, maar kleding kan het wel makkelijker maken.",
        ],
      },
      {
        title: "Restaurantdate",
        paragraphs: [
          "Voor een restaurant mag je outfit iets verzorgder zijn. Denk aan een nette jeans of pantalon met blouse, overhemd, top, blazer of nette trui. De exacte combinatie hangt af van het restaurant, maar de uitstraling moet zijn: bewust gekozen, niet per ongeluk te chic of te casual.",
          "Schoenen maken hier veel verschil. Nette sneakers kunnen prima als ze schoon en rustig zijn. Loafers, boots, hakken, sandalen of nette schoenen kunnen ook werken, zolang ze passen bij de rest. Een restaurantdate vraagt geen gala, maar joggingbroekenergie is zelden het plan.",
        ],
      },
      {
        title: "Café of borrel",
        paragraphs: [
          "Bij een café of borrel werkt smart casual vaak het best. Ontspannen, maar verzorgd. Een goede jeans met mooie top, overhemd, trui, blouse of overshirt is vaak genoeg. Voeg eventueel een subtiel accessoire toe: horloge, ketting, riem, tas of jas die de look afmaakt.",
          "Houd accessoires rustig. Een eerste date is geen perspresentatie van je sieradencollectie. Eén of twee details kunnen veel doen. De outfit moet helpen, niet alle aandacht opeisen voordat je iets hebt gezegd.",
        ],
      },
      {
        title: "Wandeling, bioscoop of actieve date",
        paragraphs: [
          "Voor een wandeling zijn comfortabele schoenen verplicht. Niet onderhandelbaar. Kies kleding die past bij het weer en laagjes die je makkelijk aan of uit kunt doen. Praktisch hoeft niet slordig te zijn: een goede jas, nette sneakers en een rustige bovenlaag kunnen prima datewaardig zijn.",
          "Bij de bioscoop telt comfort meer dan mensen denken. Je zit lang, zalen kunnen koud zijn en te strakke of onhandige kleding gaat snel irriteren. Een nette trui, goed zittende broek en schoenen die passen bij de rest zijn vaak sterker dan iets dat alleen staand goed oogt.",
          "Een actieve date vraagt kleding die geschikt is voor de activiteit. Ga je bowlen, fietsen, wandelen of iets sportiefs doen, kleed je dan niet alsof je naar een formeel diner gaat. Je wilt meedoen zonder dat je outfit klinkt als een bezwaarbrief.",
        ],
      },
      {
        title: "Kleurkeuze voor een date",
        paragraphs: [
          "Neutrale kleuren zijn veilig omdat ze rustig en verzorgd ogen: zwart, wit, navy, beige, grijs, denim en bruin werken vaak goed. Dat betekent niet dat kleur verboden is. Eén accentkleur kan juist persoonlijkheid geven, vooral als je hem combineert met een rustige basis.",
          "Draag vooral kleuren waarin jij je goed voelt. Een kleur die theoretisch perfect is maar waarin je je ongemakkelijk voelt, gaat niet helpen. Vermijd geforceerde combinaties die je alleen kiest omdat je denkt dat ze spannend zijn. Een outfit hoeft niet ingewikkeld te zijn om indruk te maken.",
        ],
      },
      {
        title: "Schoenen voor een eerste date",
        paragraphs: [
          "Schoenen moeten schoon, passend en comfortabel zijn. Ze hoeven niet nieuw te zijn; liever niet zelfs. Nieuwe schoenen kunnen knellen, blaren geven of je de hele avond afleiden. Kies schoenen waarvan je weet dat ze werken.",
          "De balans tussen casual en verzorgd is belangrijk. Sneakers kunnen prima, maar niet als ze eruitzien alsof ze net een festivalweekend hebben overleefd. Nette schoenen kunnen sterk zijn, maar niet als de rest van de outfit heel relaxed is. Schoenen moeten de outfit afmaken, niet een andere date plannen.",
        ],
      },
      {
        title: "Accessoires en laatste controle",
        paragraphs: [
          "Accessoires kunnen een date-outfit net persoonlijker maken. Denk aan een horloge, subtiele sieraden, een riem, tas, pet of jas die goed bij de rest past. Het doel is niet om te laten zien hoeveel opties je bezit, maar om de outfit af te maken. Eén goed detail werkt vaak sterker dan vijf losse accenten die allemaal aandacht vragen.",
          "Pas je outfit vooraf minimaal één keer helemaal aan, inclusief jas, tas en schoenen. Kijk niet alleen staand in de spiegel, maar ga ook even zitten en loop een stukje. Veel datefits vallen pas door de mand wanneer je merkt dat een broek trekt, een top verschuift of schoenen toch niet zo ontspannen zijn als ze in theorie leken.",
          "Neem ook de praktische dingen mee: waar laat je je jas, moet je veel lopen, is het buiten koud, zit je in fel licht of juist in een donker café? Dat klinkt klein, maar precies die details bepalen of je de outfit vergeet zodra je aankomt. En dat is eigenlijk het doel: je kleding moet goed genoeg voelen om er niet meer mee bezig te zijn.",
        ],
      },
      {
        title: "Veelgemaakte eerste-date-fouten",
        paragraphs: [
          "Veel fouten ontstaan doordat mensen te veel willen oplossen met kleding. Een datefit hoeft niet perfect te zijn. Hij moet bij jou passen, bij de setting passen en je niet in de weg zitten.",
        ],
        bullets: [
          "Te veel parfum gebruiken.",
          "Een compleet nieuwe stijl proberen.",
          "Overdressed zijn voor een simpele setting.",
          "Underdressed zijn voor restaurant of nette borrel.",
          "Ongemakkelijke schoenen dragen.",
          "De outfit niet vooraf passen.",
          "Te veel accessoires tegelijk dragen.",
          "Een jas of tas vergeten mee te nemen in de styling.",
        ],
      },
      {
        title: "Eerste-date-checklist",
        paragraphs: [
          "Loop deze checklist kort langs voordat je vertrekt. Als je outfit bij de setting past en jij je er goed in voelt, ben je al verder dan de meeste paniekwissels voor de spiegel.",
        ],
        bullets: [
          "Past de outfit bij het type date?",
          "Voelt dit als een verzorgde versie van mijn eigen stijl?",
          "Zijn mijn schoenen schoon en comfortabel?",
          "Kan ik hierin zitten, lopen en ontspannen?",
          "Is mijn jas of tas onderdeel van de look?",
          "Gebruik ik maximaal één duidelijk statement?",
          "Heb ik de outfit al even gepast in normaal licht?",
          "Voelt de look goed zonder dat ik eraan blijf trekken?",
        ],
      },
      {
        title: "AI date outfit checker",
        paragraphs: [
          "Met de date outfit checker van OutfitRoaster upload je een foto van je look. De AI kijkt naar kleding, kleuren, schoenen, accessoires, pasvorm en date-vibe. Daarna krijg je een score en een korte outfitcheck. Je kunt kiezen voor een roast als je humor wilt, of een serieuzere analyse als je vooral duidelijkheid zoekt.",
          "AI bepaalt natuurlijk niet wat jouw date mooi vindt. Smaak blijft persoonlijk. De tool is bedoeld als laatste controle: oogt de outfit verzorgd, past hij bij restaurant, café of wandeling, zijn de schoenen logisch, en voelt de combinatie als één geheel? Zie het als die directe vriend die even meekijkt voordat je de deur uitgaat.",
        ],
      },
    ],
    faqs: [
      { question: "Wat trek je aan op een eerste date?", answer: "Kies een verzorgde versie van je normale stijl. Stem je outfit af op restaurant, café, wandeling of activiteit en zorg dat je je comfortabel voelt." },
      { question: "Kun je een spijkerbroek dragen op een eerste date?", answer: "Ja. Een goede jeans kan prima, vooral met een nette top, overhemd, trui, blazer of verzorgde schoenen." },
      { question: "Welke kleur werkt goed voor een date?", answer: "Neutrale kleuren zoals zwart, wit, navy, beige, grijs en denim werken vaak goed. Eén accentkleur kan persoonlijkheid toevoegen." },
      { question: "Moet je je netter kleden dan normaal?", answer: "Een beetje verzorgder dan normaal is vaak goed, maar ga niet zo ver dat je je verkleed voelt." },
      { question: "Welke schoenen draag je op een eerste date?", answer: "Draag schone, comfortabele schoenen die passen bij de setting. Nieuwe schoenen zijn meestal geen goed idee." },
      { question: "Kan AI helpen bij het kiezen van een date-outfit?", answer: "Ja. OutfitRoaster kan je outfit beoordelen op zichtbare kleding, kleur, schoenen, pasvorm en dategeschiktheid." },
    ],
    relatedLinks: [
      { href: "/outfit-check/date-outfit", label: "Date outfit checker", description: "Laat je datefit gratis beoordelen door AI." },
      { href: "/outfit-check/smart-casual-outfit", label: "Smart casual outfit", description: "Vind balans tussen netjes en ontspannen." },
      { href: "/outfit-check/sneaker-outfit", label: "Sneaker outfit", description: "Check of je sneakers je look helpen." },
      { href: "/outfit-check/casual-outfit", label: "Casual outfit", description: "Maak je dagelijkse stijl datewaardig." },
      { href: "/blog/festival-outfit-2026", label: "Festival outfit 2026", description: "Ook een festival op de planning? Bekijk praktische outfit tips." },
    ],
  },
  {
    slug: "wat-is-een-goede-outfit",
    title: "Wat is een goede outfit?",
    metaTitle: "Wat is een goede outfit? Praktische checklist voor stijl",
    metaDescription:
      "Ontdek waar een goede outfit aan voldoet: pasvorm, kleur, schoenen, gelegenheid en uitstraling. Met praktische checklist van OutfitRoaster.",
    excerpt:
      "Een goede outfit draait niet om dure kleding, maar om pasvorm, samenhang, kleur, schoenen en context.",
    articleCategory: "stijl",
    publishedAt: "2026-07-13",
    updatedAt: "2026-07-13",
    readingTime: "7 min leestijd",
    cta: {
      label: "Check mijn outfit",
      subtext: "Upload een duidelijke foto en krijg direct een Nederlandse outfit verdict met humor.",
      target: "/outfit-check",
    },
    intro: [
      "Een goede outfit is geen outfit die iedereen mooi moet vinden. Een goede outfit is een outfit die klopt. De kleding past bij de persoon, bij het moment, bij de omgeving en bij elkaar.",
      "Bij OutfitRoaster kijken we op twee manieren naar outfits. De gratis roast is entertainment: scherp, grappig en deelbaar. Premium Verdict Beta is de serieuze analyse: kleur, pasvorm, samenhang, stijl en context.",
    ],
    sections: [
      {
        title: "Een goede outfit heeft een duidelijk plan",
        paragraphs: [
          "De sterkste outfits voelen alsof iemand vooraf één beslissing heeft genomen. Casual, netjes, sportief, minimalistisch, festival, date of werk: het maakt niet uit welke richting je kiest, zolang de kledingstukken hetzelfde verhaal vertellen.",
          "Een outfit zonder plan voelt alsof je kledingkast op shuffle stond. Een nette blazer met totaal versleten sneakers kan werken als het bewust is gestyled, maar voelt rommelig als de rest niet meedoet.",
        ],
        bullets: [
          "Past de outfit bij de gelegenheid?",
          "Vertellen schoenen, broek en bovenlaag hetzelfde verhaal?",
          "Is er één duidelijke stijlrichting?",
          "Voelt de look gekozen in plaats van toevallig?",
        ],
      },
      {
        title: "Pasvorm is belangrijker dan merk",
        paragraphs: [
          "Een goedkoop kledingstuk dat goed valt, wint vaak van een duur kledingstuk dat verkeerd zit. Pasvorm bepaalt hoe rustig, sterk en verzorgd een outfit oogt.",
          "Pasvorm is geen oordeel over lichaam. Het gaat om hoe kleding valt: een jas kan te groot zijn voor de styling, een broek kan te lang vallen voor de schoenen en een overhemd kan trekken of juist verdwijnen.",
        ],
      },
      {
        title: "Kleur hoeft niet ingewikkeld te zijn",
        paragraphs: [
          "In de praktijk draait kleur meestal om rust, contrast en herhaling. Een outfit met zwart, wit en denim kan sterker zijn dan een outfit met vijf kleuren die allemaal om aandacht vragen.",
          "Belangrijk: beoordeel kleur op wat er echt zichtbaar is. Als iemand volledig wit draagt, is er geen kleurencrisis. Dan gaat de vraag eerder over stof, vorm, contrast met schoenen, accessoires en gelegenheid.",
        ],
      },
      {
        title: "Schoenen bepalen de eindzin",
        paragraphs: [
          "Schoenen zijn vaak het laatste onderdeel dat je aantrekt, maar visueel geven ze de outfit vaak de conclusie. Sneakers maken een look sportiever of casualer. Nette schoenen maken hem volwassener. Boots geven gewicht.",
          "Goede schoenen hoeven niet duur te zijn, maar ze moeten de outfit afmaken.",
        ],
      },
      {
        title: "Snelle checklist voor een goede outfit",
        paragraphs: [
          "Gebruik deze checklist voordat je de deur uitgaat of voordat je een foto uploadt naar OutfitRoaster.",
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
    ],
    faqs: [
      { question: "Wat maakt een outfit goed?", answer: "Een goede outfit heeft samenhang tussen pasvorm, kleur, schoenen, stijl en gelegenheid." },
      { question: "Hoe weet ik of mijn outfit bij de gelegenheid past?", answer: "Kijk naar de context. Werk vraagt netheid, Date vraagt eerste indruk, School vraagt comfort, Gym vraagt praktisch, Feest vraagt uitstraling en Festival vraagt vibe plus draagbaarheid." },
      { question: "Zijn schoenen echt zo belangrijk?", answer: "Ja. Schoenen bepalen vaak of een outfit casual, netjes, sportief of rommelig oogt." },
      { question: "Kan OutfitRoaster mijn outfit gratis beoordelen?", answer: "Ja. Je kunt gratis een Outfit Roast maken. Premium Verdict Beta geeft een diepere analyse van kleur, pasvorm, samenhang, context en trends." },
    ],
    relatedLinks: [
      { href: "/outfit-check/outfit-checker", label: "Outfit checker", description: "Laat je outfit direct beoordelen door AI." },
      { href: "/outfit-check/kledingstijl-check", label: "Kledingstijl check", description: "Ontdek of je stijlrichting klopt." },
      { href: "/blog/eerste-date-outfit", label: "Eerste date outfit", description: "Lees wat werkt op een eerste date." },
    ],
  },
] satisfies BlogPost[];

export const blogPostSlugs = blogPosts.map((post) => post.slug);

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
