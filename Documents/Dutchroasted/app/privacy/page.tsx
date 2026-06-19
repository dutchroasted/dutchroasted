import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Privacyverklaring Outfit Roaster",
  description: "Privacyverklaring van Outfit Roaster.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacyverklaring Outfit Roaster"
      intro="We bouwen Outfit Roaster privacy-first: geen permanente opslag van outfitfoto’s en alleen beperkte gebruiksmeting om de app te verbeteren."
      sections={[
        {
          title: "Wie zijn wij?",
          body: [
            "Outfit Roaster is een Nederlandse AI outfit checker. Je uploadt een outfitfoto en krijgt stylingfeedback met humor, score en verbeterpunten.",
            "Voor privacyvragen of verwijderverzoeken kun je mailen naar info@outfitroaster.nl.",
          ],
        },
        {
          title: "Welke gegevens verzamelen we?",
          body: [
            "We verwerken de outfitfoto die je uploadt, de gekozen gelegenheid, de gekozen Roaster en het AI-resultaat dat daarna wordt getoond.",
            "Als je je vrijwillig aanmeldt voor early access, verzamelen we je e-mailadres, toestemmingstekst, marketingtoestemming en beperkte context zoals gelegenheid en score. We sturen geen foto of AI-resultaat mee naar de lead-database.",
          ],
        },
        {
          title: "Waarvoor gebruiken we je gegevens?",
          body: [
            "Je outfitfoto en instellingen gebruiken we alleen om de outfitcheck uit te voeren en het resultaat aan jou te tonen.",
            "Je e-mailadres gebruiken we alleen voor updates van Outfit Roaster, early access tot Premium en relevante productinformatie.",
          ],
        },
        {
          title: "Outfitfoto’s",
          body: [
            "Outfitfoto’s worden alleen gebruikt voor de AI-analyse en niet opgeslagen door Outfit Roaster.",
            "De foto kan tijdelijk zichtbaar zijn als preview in je browser en tijdelijk worden verstuurd naar onze server-side API-route voor de outfitcheck. Foto’s worden niet opgeslagen in Supabase, niet gelogd en niet meegestuurd naar leads.",
          ],
        },
        {
          title: "AI-verwerking",
          body: [
            "Outfit Roaster gebruikt OpenAI voor AI-analyse. De foto en context worden tijdelijk verwerkt om stylingfeedback te genereren.",
            "De feedback gaat over kleding, styling, kleuren, pasvorm van kleding, accessoires en gelegenheid. Outfit Roaster is niet bedoeld om lichamen, gezondheid, afkomst, leeftijd, gender of aantrekkelijkheid te beoordelen.",
          ],
        },
        {
          title: "E-mailupdates",
          body: [
            "Je meldt je alleen aan voor e-mailupdates als je hier actief toestemming voor geeft via de checkbox.",
            "Afmelden kan altijd. Mail naar info@outfitroaster.nl als je verwijderd wilt worden uit de early access lijst.",
          ],
        },
        {
          title: "Hoe lang bewaren we gegevens?",
          body: [
            "Outfitfoto’s bewaren we niet permanent. Early access e-mails bewaren we zolang Outfit Roaster in ontwikkeling is of totdat je vraagt om verwijdering.",
            "Resultaten en gratis limieten kunnen tijdelijk in je browser staan voor gebruiksgemak, bijvoorbeeld via localStorage. Je kunt dit wissen via je browserinstellingen.",
          ],
        },
        {
          title: "Met welke diensten werken we?",
          body: [
            "We gebruiken OpenAI voor AI-analyse, Supabase voor het bewaren van early access leads en Vercel voor hosting.",
            "Outfit Roaster gebruikt Google Analytics 4 om paginaweergaven en productinteracties te meten, zoals uploads, outfitchecks, deelacties en klikken op shopsuggesties.",
          ],
        },
        {
          title: "Jouw rechten",
          body: [
            "Je kunt vragen welke gegevens we van je hebben, je kunt correctie vragen en je kunt verzoeken om verwijdering van je e-mailadres uit de early access lijst.",
            "Stuur hiervoor een mail naar info@outfitroaster.nl.",
          ],
        },
        {
          title: "Contact",
          body: [
            "Voor privacyvragen, verzoeken of opmerkingen kun je mailen naar info@outfitroaster.nl.",
            "Deze privacyverklaring is bedoeld voor de MVP-fase en moet juridisch worden gecontroleerd voordat Outfit Roaster commercieel grootschalig wordt ingezet.",
          ],
        },
      ]}
    />
  );
}
