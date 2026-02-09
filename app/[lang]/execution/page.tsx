export default function ExecutionPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-slate-900">

      {/* Breadcrumb Schema — Option D */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Keystone FX",
                "item": "https://keystone-fx.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Execution",
                "item": "https://keystone-fx.com/execution"
              }
            ]
          })
        }}
      />

      {/* Breadcrumbs — Option C3 */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap gap-1">
          <li><a href="/" className="underline">Keystone FX</a><span className="mx-1">/</span></li>
          <li className="text-slate-700">Execution</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-semibold tracking-tight">
        Institutional FX Execution Infrastructure
      </h1>

      {/* rest of file unchanged */}
    </main>
  );
}
