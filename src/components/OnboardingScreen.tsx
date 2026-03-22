import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

const MASSAGE_TYPES = [
  "Swedish",
  "Deep Tissue",
  "Hot Stone",
  "Thai",
  "Sports",
  "Aromatherapy",
  "Reflexology",
  "Shiatsu",
];

export function OnboardingScreen() {
  const { signOut } = useAuthActions();
  const createProfile = useMutation(api.profiles.createProfile);
  const [step, setStep] = useState<"role" | "details">("role");
  const [role, setRole] = useState<"hotel" | "masseur" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [hotelCity, setHotelCity] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("80");

  const handleRoleSelect = (selectedRole: "hotel" | "masseur") => {
    setRole(selectedRole);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    setError("");

    try {
      await createProfile({
        role,
        name,
        email,
        phone: phone || undefined,
        hotelName: role === "hotel" ? hotelName : undefined,
        hotelAddress: role === "hotel" ? hotelAddress : undefined,
        hotelCity: role === "hotel" ? hotelCity : undefined,
        bio: role === "masseur" ? bio : undefined,
        specialties: role === "masseur" ? specialties : undefined,
        hourlyRate: role === "masseur" ? parseFloat(hourlyRate) : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/3 -right-1/4 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="text-white font-light">Massage<span className="text-amber-400">Link</span></span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          Sign out
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-lg">
          {step === "role" ? (
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl text-white font-light mb-3">Welcome to MassageLink</h1>
              <p className="text-white/40 mb-8 sm:mb-10 text-sm sm:text-base">Choose how you want to use the platform</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Hotel Option */}
                <button
                  onClick={() => handleRoleSelect("hotel")}
                  className="group p-6 sm:p-8 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-amber-400/30 hover:bg-white/[0.04] transition-all text-left"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:from-amber-400/20 group-hover:to-amber-600/20 transition-all">
                    <span className="text-2xl sm:text-3xl">🏨</span>
                  </div>
                  <h3 className="text-lg sm:text-xl text-white font-medium mb-2">I'm a Hotel</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Offer massage services to guests without hiring full-time staff
                  </p>
                </button>

                {/* Masseur Option */}
                <button
                  onClick={() => handleRoleSelect("masseur")}
                  className="group p-6 sm:p-8 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-amber-400/30 hover:bg-white/[0.04] transition-all text-left"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:from-amber-400/20 group-hover:to-amber-600/20 transition-all">
                    <span className="text-2xl sm:text-3xl">💆</span>
                  </div>
                  <h3 className="text-lg sm:text-xl text-white font-medium mb-2">I'm a Masseur</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Get flexible bookings from hotels and earn on your terms
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setStep("role")}
                className="flex items-center gap-2 text-white/40 hover:text-white/60 mb-6 sm:mb-8 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <h1 className="text-2xl sm:text-3xl text-white font-light mb-2">
                {role === "hotel" ? "Hotel Details" : "Masseur Profile"}
              </h1>
              <p className="text-white/40 mb-6 sm:mb-8 text-sm sm:text-base">
                {role === "hotel"
                  ? "Tell us about your property"
                  : "Set up your professional profile"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                    placeholder="+49 123 456 7890"
                  />
                </div>

                {role === "hotel" ? (
                  <>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                        Hotel Name
                      </label>
                      <input
                        type="text"
                        required
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                        placeholder="Grand Hotel Berlin"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        required
                        value={hotelAddress}
                        onChange={(e) => setHotelAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                        placeholder="Friedrichstraße 123"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={hotelCity}
                        onChange={(e) => setHotelCity(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                        placeholder="Berlin"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm resize-none"
                        placeholder="Tell hotels about your experience and approach..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
                        Specialties
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {MASSAGE_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleSpecialty(type)}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                              specialties.includes(type)
                                ? "bg-amber-400 text-black"
                                : "bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                        Hourly Rate (€)
                      </label>
                      <input
                        type="number"
                        required
                        min="20"
                        max="500"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                        placeholder="80"
                      />
                      <p className="mt-2 text-xs text-white/30">
                        You'll receive €{(parseFloat(hourlyRate || "0") * 0.85).toFixed(2)}/hr after 15% platform fee
                      </p>
                    </div>
                  </>
                )}

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 text-sm tracking-wide"
                >
                  {loading ? "Creating Profile..." : "Complete Setup"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
