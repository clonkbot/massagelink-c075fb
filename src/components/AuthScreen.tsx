import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl rotate-6 opacity-80"></div>
              <div className="absolute inset-0 bg-[#0a0a0a] rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-3">
              Massage<span className="text-amber-400">Link</span>
            </h1>
            <p className="text-sm sm:text-base text-white/40 font-light tracking-wide">
              Hotels & Masseurs, connected on-demand
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl text-white/90 font-light mb-6 sm:mb-8 text-center">
              {flow === "signIn" ? "Welcome back" : "Create your account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2 font-medium">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2 font-medium">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : flow === "signIn" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <button
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                className="text-sm text-white/40 hover:text-amber-400/80 transition-colors"
              >
                {flow === "signIn" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: "🏨", label: "Hotels" },
              { icon: "💆", label: "Masseurs" },
              { icon: "⚡", label: "On-demand" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xl sm:text-2xl mb-2">{item.icon}</div>
                <div className="text-[10px] sm:text-xs text-white/30 uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
