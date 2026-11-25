"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-slate-500">Please try again. If the problem continues, come back later.</p>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </main>
  );
}