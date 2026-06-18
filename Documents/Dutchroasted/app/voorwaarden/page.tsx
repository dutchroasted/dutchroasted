import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Voorwaarden Outfit Roaster",
  description: "Voorwaarden van Outfit Roaster.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Voorwaarden"
      title="Voorwaarden Outfit Roaster"
      intro="Outfit Roaster geeft AI-gegenereerde stylingfeedback met humor. Leuk, scherp en nuttig, maar niet bedoeld als professioneel advies."
      sections={[
        {
          title: "Gebruik van Outfit Roaster",
          body: [
            "Je gebruikt Outfit Roaster om een outfitfoto te laten beoordelen op kleding, styling, kleuren, pasvorm van kleding, accessoires en gelegenheid.",
            "Je uploadt alleen foto’s van jezelf of foto’s waarvoor je toestemming hebt gekregen.",
          ],
        },
        {
          title: "Outfitfeedback",
          body: [
            "De feedback wordt automatisch gegenereerd door AI en is bedoeld als humor, inspiratie en stylingadvies.",
            "Outfit Roaster kan scherp en grappig zijn, maar de feedback hoort over de outfit te gaan en niet over de persoon.",
          ],
        },
        {
          title: "Geen professioneel advies",
          body: [
            "Outfit Roaster geeft geen professioneel, medisch, psychologisch, juridisch of definitief stylingadvies.",
            "Gebruik de feedback als suggestie. Mode blijft context, smaak en eigen keuze.",
          ],
        },
        {
          title: "Eigen verantwoordelijkheid",
          body: [
            "Je blijft zelf verantwoordelijk voor hoe je de feedback gebruikt, deelt of toepast.",
            "Controleer zelf of suggesties passen bij jouw situatie, budget, stijl en gelegenheid.",
          ],
        },
        {
          title: "Toegestaan gebruik",
          body: [
            "Je mag Outfit Roaster gebruiken voor persoonlijke outfitchecks, inspiratie, stylingverbetering en het delen van je eigen resultaat.",
            "Je mag resultaten delen zolang je geen privacy van anderen schendt.",
          ],
        },
        {
          title: "Niet toegestaan gebruik",
          body: [
            "Je mag Outfit Roaster niet gebruiken voor haatdragend, discriminerend, seksueel, intimiderend, onrechtmatig of schadelijk gebruik.",
            "Gebruik de tool niet om anderen belachelijk te maken, te shamen of zonder toestemming foto’s van anderen te beoordelen.",
          ],
        },
        {
          title: "Beschikbaarheid",
          body: [
            "Outfit Roaster is een MVP. De app kan tijdelijk niet beschikbaar zijn, fouten bevatten of veranderen zonder voorafgaande aankondiging.",
            "Premium, betaling en accounts zijn nog niet actief, tenzij later anders wordt aangekondigd.",
          ],
        },
        {
          title: "Aansprakelijkheid",
          body: [
            "Outfit Roaster kan fouten maken. AI-output kan onvolledig, onjuist of niet passend zijn.",
            "Voor zover wettelijk toegestaan zijn we niet aansprakelijk voor schade of keuzes die voortkomen uit het gebruik van Outfit Roaster of de AI-feedback.",
          ],
        },
        {
          title: "Contact",
          body: [
            "Heb je vragen over deze voorwaarden? Mail naar info@outfitroaster.nl.",
          ],
        },
      ]}
    />
  );
}
