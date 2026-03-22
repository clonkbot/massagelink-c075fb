import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AuthScreen } from "./components/AuthScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { HotelDashboard } from "./components/HotelDashboard";
import { MasseurDashboard } from "./components/MasseurDashboard";
import { Footer } from "./components/Footer";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-amber-400/20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin"></div>
        </div>
        <p className="text-amber-100/60 tracking-[0.3em] uppercase text-xs font-light">Loading</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const profile = useQuery(api.profiles.getMyProfile);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Still loading profile
  if (profile === undefined) {
    return <LoadingScreen />;
  }

  // No profile yet - show onboarding
  if (profile === null) {
    return <OnboardingScreen />;
  }

  // Show appropriate dashboard
  if (profile.role === "hotel") {
    return <HotelDashboard profile={profile} />;
  }

  return <MasseurDashboard profile={profile} />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <AppContent />
      <Footer />
    </div>
  );
}
