import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

interface MasseurDashboardProps {
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

export function MasseurDashboard({ profile }: MasseurDashboardProps) {
  const { signOut } = useAuthActions();
  const bookings = useQuery(api.bookings.getMyBookings);
  const stats = useQuery(api.bookings.getBookingStats);
  const updateStatus = useMutation(api.bookings.updateBookingStatus);
  const updateProfile = useMutation(api.profiles.updateProfile);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleStatusUpdate = async (bookingId: Id<"bookings">, status: "accepted" | "declined" | "completed") => {
    await updateStatus({ bookingId, status });
  };

  const toggleAvailability = async () => {
    await updateProfile({ available: !profile.available });
  };

  const pendingBookings = bookings?.filter((b: EnrichedBooking) => b.status === "pending") || [];
  const activeBookings = bookings?.filter((b: EnrichedBooking) => b.status === "accepted") || [];
  const pastBookings = bookings?.filter((b: EnrichedBooking) => ["completed", "declined", "cancelled"].includes(b.status)) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-[200px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/3 rounded-full blur-[180px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-light">Massage<span className="text-amber-400">Link</span></h1>
                <p className="text-xs text-white/40">{profile.name}</p>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAvailability}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                  profile.available
                    ? "bg-green-400/10 text-green-400 border border-green-400/20"
                    : "bg-red-400/10 text-red-400 border border-red-400/20"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${profile.available ? "bg-green-400" : "bg-red-400"}`}></span>
                {profile.available ? "Available" : "Unavailable"}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="hidden sm:block p-2 text-white/40 hover:text-white/60 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={() => signOut()}
                className="hidden sm:block text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Sign out
              </button>

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
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pb-2 border-t border-white/5 pt-4 space-y-2">
              <button
                onClick={toggleAvailability}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
                  profile.available
                    ? "bg-green-400/10 text-green-400"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${profile.available ? "bg-green-400" : "bg-red-400"}`}></span>
                {profile.available ? "Available" : "Unavailable"}
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
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { label: "Pending", value: stats.pending, color: "text-yellow-400" },
              { label: "Active", value: stats.accepted, color: "text-green-400" },
              { label: "Completed", value: stats.completed, color: "text-blue-400" },
              { label: "Earnings", value: `€${stats.totalEarnings.toFixed(0)}`, color: "text-amber-400" },
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

        {/* Rate Info */}
        <div className="bg-gradient-to-r from-amber-400/10 to-amber-600/10 border border-amber-400/20 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-white/60 text-sm">Your hourly rate</p>
              <p className="text-2xl sm:text-3xl text-amber-400 font-light">€{profile.hourlyRate}/hr</p>
              <p className="text-xs text-white/40 mt-1">
                You receive €{((profile.hourlyRate || 0) * 0.85).toFixed(2)}/hr after 15% platform fee
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.specialties?.map((s: string) => (
                <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/60">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl text-white font-light mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              Pending Requests
            </h2>
            <div className="space-y-4">
              {pendingBookings.map((booking: EnrichedBooking) => (
                <div
                  key={booking._id}
                  className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                          <span className="text-lg">🏨</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{booking.hotel?.hotelName}</h3>
                          <p className="text-xs text-white/40">{booking.hotel?.hotelCity}</p>
                        </div>
                      </div>
                      <div className="ml-13 space-y-1 text-sm">
                        <p className="text-white/60">
                          <span className="text-white">{booking.date}</span> at <span className="text-white">{booking.startTime}</span>
                        </p>
                        <p className="text-white/60">
                          {booking.duration} min · {booking.massageType}
                        </p>
                        <p className="text-amber-400 font-medium">
                          €{booking.masseurEarnings.toFixed(2)} <span className="text-white/40 font-normal">(after fees)</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <button
                        onClick={() => handleStatusUpdate(booking._id, "accepted")}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-green-400 text-black rounded-xl text-sm font-medium hover:bg-green-300 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking._id, "declined")}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm hover:bg-white/10 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl text-white font-light mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Active Bookings
            </h2>
            <div className="space-y-4">
              {activeBookings.map((booking: EnrichedBooking) => (
                <div
                  key={booking._id}
                  className="bg-green-400/5 border border-green-400/20 rounded-2xl p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                          <span className="text-lg">🏨</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{booking.hotel?.hotelName}</h3>
                          <p className="text-xs text-white/40">{booking.hotel?.hotelAddress}, {booking.hotel?.hotelCity}</p>
                        </div>
                      </div>
                      <div className="ml-13 space-y-1 text-sm">
                        <p className="text-white/60">
                          <span className="text-white">{booking.date}</span> at <span className="text-white">{booking.startTime}</span>
                        </p>
                        <p className="text-white/60">
                          {booking.duration} min · {booking.massageType}
                        </p>
                        {booking.guestName && <p className="text-white/40">Guest: {booking.guestName}</p>}
                        {booking.roomNumber && <p className="text-white/40">Room: {booking.roomNumber}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, "completed")}
                      className="px-6 py-2.5 bg-blue-400 text-black rounded-xl text-sm font-medium hover:bg-blue-300 transition-colors"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-xl text-white font-light mb-4">Past Bookings</h2>
            <div className="space-y-3">
              {pastBookings.map((booking: EnrichedBooking) => (
                <div
                  key={booking._id}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-lg">🏨</span>
                      </div>
                      <div>
                        <h3 className="text-white/80">{booking.hotel?.hotelName}</h3>
                        <p className="text-sm text-white/40">
                          {booking.date} · {booking.massageType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border capitalize ${STATUS_STYLES[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                      {booking.status === "completed" && (
                        <span className="text-green-400 font-medium">+€{booking.masseurEarnings.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bookings?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💆</div>
            <h3 className="text-xl text-white/80 mb-2">No bookings yet</h3>
            <p className="text-white/40 max-w-md mx-auto">
              {profile.available
                ? "You're marked as available. Hotels can see your profile and send booking requests."
                : "Mark yourself as available to receive booking requests from hotels."}
            </p>
            {!profile.available && (
              <button
                onClick={toggleAvailability}
                className="mt-6 px-6 py-3 bg-amber-400 text-black rounded-xl text-sm font-medium hover:bg-amber-300 transition-colors"
              >
                Go Available
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
