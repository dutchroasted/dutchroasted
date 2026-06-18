import type { RoastReportData } from "@/lib/roastTypes";

const intensityLabels = {
  mild: "Mild",
  medium: "Medium",
  brutal: "Brutal",
};

type RoastReportProps = {
  result: RoastReportData;
};

export function RoastReport({ result }: RoastReportProps) {
  const createdAt = new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(result.createdAt));

  return (
    <article className="print-report print-only hidden">
      <header className="report-header">
        <div>
          <p className="report-brand">
            Dutch<span>Roasted</span>
          </p>
          <p className="report-subtitle">Upload iets. Krijg de waarheid.</p>
        </div>
        <p className="report-date">{createdAt}</p>
      </header>

      <section className="report-meta">
        <div>
          <p className="report-label">Categorie</p>
          <p>{result.category}</p>
        </div>
        <div>
          <p className="report-label">Intensiteit</p>
          <p>{intensityLabels[result.intensity]}</p>
        </div>
      </section>

      <ReportSection title="Originele ingestuurde tekst">
        <p>{result.originalText}</p>
      </ReportSection>

      <ReportSection title="🔥 Roast">
        <p>{result.roast}</p>
      </ReportSection>

      <ReportSection title="🔍 Analyse">
        <ul>
          {result.analysis.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection title="✅ Verbeterpunten">
        <ul>
          {result.improvements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection title="🚀 Verbeterde versie">
        <p>{result.improvedVersion}</p>
      </ReportSection>

      <footer className="report-footer">Gemaakt met OutfitRoaster.nl</footer>
    </article>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="report-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
