function Documentation() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-6 md:px-6 lg:px-8">
      <section className="glass-card rounded-2xl p-6">
        <h2 className="font-heading text-2xl font-bold">Project Documentation</h2>
        <p className="mt-3 text-slate-300">Hindsight Expert retrieves similar memory cases, generates contextual LLM responses, and stores every interaction for continuous improvement.</p>
      </section>
      <section className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold">API Endpoints</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>POST /api/support</li>
          <li>PUT /api/support/:interactionId/effectiveness</li>
          <li>GET /api/analytics/dashboard</li>
          <li>GET /api/analytics/metrics</li>
          <li>GET /api/analytics/interactions</li>
        </ul>
      </section>
    </main>
  );
}

export default Documentation;
