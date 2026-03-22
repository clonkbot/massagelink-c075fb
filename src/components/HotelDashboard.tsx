import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { BookingModal } from "./BookingModal";

interface HotelDashboardProps {
  profile: Doc<"profiles">;
}

interface EnrichedBooking extends Doc<"bookings"> {
  hotel: Doc<"profiles"> | null;
  masseur: Doc<"profiles"> | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  accepted: "bg-green-400/10 text-green-400 border-green-400/20",
  declined: "bg-red-400/10 text-red-400 border-red-400/20",
  completed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  cancelled: "bg-gray-400/10 text-gray-400 border-gray-400/20",
};

export function HotelDashboard({ profile }: HotelDashboardProps) {
  const { signOut } = useAuthActions();
  const masseurs = useQuery(api.profiles.listAvailableMasseurs);
  const bookings = useQuery(api.bookings.getMyBookings);
  const stats = useQuery(api.bookings.getBookingStats);
  const updateStatus = useMutation(api.bookings.updateBookingStatus);

  const [activeTab, setActiveTab] = useState<"browse" | "bookings">("browse");
  const [selectedMasseur, setSelectedMasseur] = useState<Doc<"profiles"> | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCancel = async (bookingId: Id<"bookings">) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      await updateStatus({ bookingId, status: "cancelled" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-[200px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/3 rounded-full blur-[180px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-light">Massage<span className="text-amber-400">Link</span></h1>
                <p className="text-xs text-white/40">{profile.hotelName}</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-6">
              <nav className="flex gap-1 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab("browse")}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    activeTab === "browse"
                      ? "bg-amber-400 text-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Browse Masseurs
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    activeTab === "bookings"
                      ? "bg-amber-400 text-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  My Bookings
                </button>
              </nav>
              <button
                onClick={() => signOut()}
                className="text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Sign out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-white/60"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pb-2 border-t border-white/5 pt-4 space-y-2">
              <button
                onClick={() => { setActiveTab("browse"); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm ${
                  activeTab === "browse" ? "bg-amber-400 text-black" : "text-white/60"
                }`}
              >
                Browse Masseurs
              </button>
              <button
                onClick={() => { setActiveTab("bookings"); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-3 rounded-xl text-left text-sm ${
                  activeTab === "bookings" ? "bg-amber-400 text-black" : "text-white/60"
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => signOut()}
                className="w-full px-4 py-3 rounded-xl text-left text-sm text-white/40"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { label: "Pending", value: stats.pending, color: "text-yellow-400" },
              { label: "Active", value: stats.accepted, color: "text-green-400" },
              { label: "Completed", value: stats.completed, color: "text-blue-400" },
              { label: "Total Spent", value: `€${stats.totalEarnings.toFixed(0)}`, color: "text-amber-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5"
              >
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/40 mb-1">{stat.label}</p>
                <p className={`text-xl sm:text-2xl font-light ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "browse" ? (
          <div>
            <h2 className="text-xl sm:text-2xl text-white font-light mb-4 sm:mb-6">Available Masseurs</h2>
            {masseurs === undefined ? (
              <div className="text-center py-12 text-white/40">Loading...</div>
            ) : masseurs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💆</div>
                <p className="text-white/40">No masseurs available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {masseurs.map((masseur: Doc<"profiles">) => (
                  <div
                    key={masseur._id}
                    className="group bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6 hover:border-amber-400/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                        <span className="text-xl sm:text-2xl">💆</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm">{masseur.rating?.toFixed(1) || "5.0"}</span>
                        <span className="text-white/30 text-xs">({masseur.totalReviews || 0})</span>
                      </div>
                    </div>

                    <h3 className="text-lg text-white font-medium mb-1">{masseur.name}</h3>
                    <p className="text-amber-400 font-medium mb-3">€{masseur.hourlyRate}/hr</p>

                    {masseur.bio && (
                      <p className="text-sm text-white/40 mb-4 line-clamp-2">{masseur.bio}</p>
                    )}

                    {masseur.specialties && masseur.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {masseur.specialties.slice(0, 3).map((specialty: string) => (
                          <span
                            key={specialty}
                            className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-white/60"
                          >
                            {specialty}
                          </span>
                        ))}
                        {masseur.specialties.length > 3 && (
                          <span className="px-2 py-0.5 text-[10px] text-white/40">
                            +{masseur.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedMasseur(masseur)}
                      className="w-full py-3 bg-amber-400/10 text-amber-400 rounded-xl hover:bg-amber-400 hover:text-black transition-all text-sm font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl sm:text-2xl text-white font-light mb-4 sm:mb-6">My Bookings</h2>
            {bookings === undefined ? (
              <div className="text-center py-12 text-white/40">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-white/40">No bookings yet</p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 text-amber-400 text-sm hover:underline"
                >
                  Browse available masseurs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: EnrichedBooking) => (
                  <div
                    key={booking._id}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-xl flex items-center justify-center shrink-0">
                          <span className="text-xl">💆</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{booking.masseur?.name}</h3>
                          <p className="text-sm text-white/40">
                            {booking.date} at {booking.startTime} · {booking.duration}min
                          </p>
                          <p className="text-sm text-white/60">{booking.massageType}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 justify-between sm:justify-end">
                        <span
                          className={`px-3 py-1 rounded-full text-xs border capitalize ${STATUS_STYLES[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-amber-400 font-medium">€{booking.totalPrice.toFixed(2)}</span>
                        {booking.status === "pending" && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="px-3 py-1 text-xs text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {(booking.guestName || booking.roomNumber) && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-sm text-white/40">
                        {booking.guestName && <span>Guest: {booking.guestName}</span>}
                        {booking.roomNumber && <span>Room: {booking.roomNumber}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {selectedMasseur && (
        <BookingModal
          masseur={selectedMasseur}
          onClose={() => setSelectedMasseur(null)}
        />
      )}
    </div>
  );
}
