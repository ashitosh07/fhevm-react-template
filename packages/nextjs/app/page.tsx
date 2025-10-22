import { FHECounterDemo } from "./_components/FHECounterDemo";
import { FHECounterUniversalDemo } from "./_components/FHECounterUniversalDemo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-300/20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🚀</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Universal FHEVM SDK
              </h1>
              <p className="text-lg opacity-70">Framework-Agnostic • Developer-Friendly • Minimal Boilerplate</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <div className="badge badge-primary badge-lg">React</div>
            <div className="badge badge-secondary badge-lg">Vue</div>
            <div className="badge badge-accent badge-lg">Node.js</div>
            <div className="badge badge-info badge-lg">TypeScript</div>
          </div>
        </div>

        <div className="flex flex-col gap-12 max-w-6xl mx-auto">
          {/* New Universal SDK Demo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-success to-success/70 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">NEW</span>
              </div>
              <h2 className="text-2xl font-bold">Universal SDK Demo</h2>
              <div className="badge badge-success">90% Less Code</div>
            </div>
            <FHECounterUniversalDemo />
          </div>
          
          {/* Original Demo for Comparison */}
          <div className="divider divider-neutral">
            <div className="flex items-center gap-2 px-4 py-2 bg-base-200 rounded-full">
              <span className="text-sm opacity-60">Legacy Implementation (for comparison)</span>
              <div className="badge badge-warning badge-sm">Legacy</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-warning to-warning/70 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">OLD</span>
              </div>
              <h2 className="text-2xl font-bold opacity-70">Legacy SDK Implementation</h2>
              <div className="badge badge-warning">Complex Setup</div>
            </div>
            <div className="opacity-75">
              <FHECounterDemo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
