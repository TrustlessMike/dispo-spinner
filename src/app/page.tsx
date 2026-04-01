import { DispoWheel } from "@/components/DispoWheel";

export default function Home() {
  return (
    <div className="relative min-h-full flex-1 overflow-hidden bg-[#0c0c0e] text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 92, 255, 0.35), transparent),
            radial-gradient(ellipse 60% 40% at 100% 50%, rgba(255, 92, 138, 0.2), transparent),
            radial-gradient(ellipse 50% 30% at 0% 80%, rgba(0, 212, 170, 0.15), transparent)
          `,
        }}
      />
      <main className="relative mx-auto flex min-h-full max-w-lg flex-col items-center justify-center gap-10 px-6 py-16">
        <header className="text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
            Dispo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Spinner
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
            Tap spin. Let the wheel pick the move.
          </p>
        </header>

        <DispoWheel />

        <p className="text-center text-xs text-zinc-600">
          Deploy on Vercel from GitHub — push this repo and import the project.
        </p>
      </main>
    </div>
  );
}
