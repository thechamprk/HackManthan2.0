import { useState } from 'react';

function Landing({ onNavigate }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!customerId.trim()) return;

    const params = new URLSearchParams({ customerId: customerId.trim() });
    if (name.trim()) {
      params.set('name', name.trim());
    }

    onNavigate(`/app?${params.toString()}`);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-12 md:px-8">
      <section className="glass-card w-full animate-fade-up rounded-3xl p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-300">HackManthan Project</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">HindsightHub</h1>
        <p className="mt-3 text-base text-slate-300 md:text-lg">AI Support with Persistent Memory</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {['Persistent Memory', 'Fast AI Responses', 'Pattern Learning', 'Analytics Dashboard'].map((feature) => (
            <article key={feature} className="glass-card rounded-2xl p-4">
              <h2 className="font-heading text-lg font-bold text-white">{feature}</h2>
              <p className="mt-2 text-sm text-slate-300">Built for high-quality support with consistent context and learning.</p>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="mt-8 rounded-xl bg-gradient-to-r from-[var(--purple)] to-[var(--teal)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          onClick={() => setShowModal(true)}
        >
          Get Started
        </button>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form className="glass-card w-full max-w-md animate-fade-up rounded-2xl p-6" onSubmit={handleSubmit}>
            <h2 className="font-heading text-2xl font-bold">Welcome to HindsightHub</h2>
            <p className="mt-1 text-sm text-slate-300">Enter your profile to continue</p>

            <label className="mt-5 block text-sm text-slate-300">
              Name
              <input
                className="mt-2 w-full rounded-xl"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </label>
            <label className="mt-4 block text-sm text-slate-300">
              Customer ID
              <input
                className="mt-2 w-full rounded-xl"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                placeholder="cust_001"
                required
              />
            </label>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-200"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[var(--purple)] to-[var(--teal)] px-4 py-2 text-sm font-semibold"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default Landing;
