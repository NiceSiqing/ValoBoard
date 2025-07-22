// /pages/index.tsx 或 /app/page.tsx
import { useState } from "react";
import { OnboardingModal } from "@/components/OnboardingModal";
import { supabase } from "@/supabase";
export default function HomePage() {
  // 初次加载显示新手引导
  const [showOnboarding, setShowOnboarding] = useState(true);
    // 处理新手引导完成
  const handleOnboardingComplete = async () => {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (user) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ onboardingCompleted: true })
        .eq("user_id", user.id);

      if (updateError) {
        // 可以弹 toast 或 alert
        console.error(updateError.message);
      } else {
        setShowOnboarding(false); // 关闭引导弹窗
      }
    }
  };
  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
      )}
      {/* 下面是引导完成后正常页面内容 */}
      {!showOnboarding && (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl text-primary font-bold">欢迎来到首页！</h1>
        </div>
      )}
    </>
  );
}
