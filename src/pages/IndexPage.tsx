// /pages/index.tsx
import { useState, useEffect } from "react";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import Dashboard from "@/components/dashboard/Dashboard";
import { supabase } from "@/supabase";

export default function IndexPage() {
  const [checking, setChecking] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
   
  const handleOnboardingComplete = async () => {
    // 1. 更新 auth user_metadata
    await supabase.auth.updateUser({
      data: { completed: true }
    });
    
    // 2. 更新本地状态
    setShowOnboarding(false);
  };
  // 检查是否需要引导
  useEffect(() => {
    async function checkOnboarding() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (user) {
        // 检查 user_metadata 中的 completed 状态
        const isComplete = user.user_metadata?.completed || false;
        setShowOnboarding(!isComplete);
      }
      setChecking(false);
    }
    checkOnboarding();
  }, []);

  if (checking) return <div>Loading...</div>;

  if (showOnboarding) {
    return (
      <OnboardingModal
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return <Dashboard />;
}