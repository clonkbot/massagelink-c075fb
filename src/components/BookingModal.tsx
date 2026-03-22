import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface BookingModalProps {
  masseur: Doc<"profiles">;
  onClose: () => void;
}

const MASSAGE_TYPES = [
  "Swedish Massage",
  "Deep Tissue",
  "Hot Stone",
  "Thai Massage",
  "Sports Massage",
  "Aromatherapy",
  "Reflexology",
  "Couples Massage",
];

const DURATIONS = [
  { value: 30, label: "30 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
  { value: 120, label: "120 min" },
];

export function BookingModal({ masseur, onClose }: BookingModalProps) {
  const createBooking = useMutation(api.bookings.createBooking);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [massageType, setMassageType] = useState(MASSAGE_TYPES[0]);
  const [guestName, setGuestName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [notes, setNotes] = useState("");

  const hourlyRate = masseur.hourlyRate || 80;
  const totalPrice = (hourlyRate * duration) / 60;
  const platformFee = totalPrice * 0.15;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createBooking({
        masseurId: masseur._id,
        date,
        startTime: time,
        duration,
        guestName: guestName || undefined,
        roomNumber: roomNumber || undefined,
        massageType,
        notes: notes || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
      ></div>

      <div className="relative bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#111] border-b border-white/5 p-4 sm:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl text-white font-light">Book Massage</h2>
            <p className="text-sm text-white/40">with {masseur.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white/60 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl text-white mb-2">Booking Requested!</h3>
            <p className="text-white/40 mb-6">
              {masseur.name} will receive your request and confirm shortly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-amber-400 text-black rounded-xl text-sm font-medium hover:bg-amber-300 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDuration(d.value)}
                    className={`py-2.5 rounded-xl text-sm transition-all ${
                      duration === d.value
                        ? "bg-amber-400 text-black"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Massage Type */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                Massage Type
              </label>
              <select
                value={massageType}
                onChange={(e) => setMassageType(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400/50 transition-all text-sm appearance-none cursor-pointer"
              >
                {MASSAGE_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-[#111]">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                  Guest Name (optional)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                  Room (optional)
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm"
                  placeholder="Suite 401"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
                Special Requests (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-all text-sm resize-none"
                placeholder="Any special instructions or preferences..."
              />
            </div>

            {/* Pricing Summary */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/40">
                  €{hourlyRate}/hr × {duration} min
                </span>
                <span className="text-white">€{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/40">Platform fee (15%)</span>
                <span className="text-white/60">€{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-white/5">
                <span className="text-white">Total</span>
                <span className="text-amber-400 font-medium">€{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 text-sm tracking-wide"
            >
              {loading ? "Sending Request..." : "Request Booking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
