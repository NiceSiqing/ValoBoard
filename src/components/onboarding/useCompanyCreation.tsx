import { useState } from "react";
import { supabase } from "@/supabase";
import type { UserData } from "./OnboardingModal";

export function useCompanyCreation(userData: UserData) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const generateCompanyCode = async (companyName: string) => {
    setIsLoading(true);
    try {
      const email = userData.email;
      const { avatarFile } = userData;
      if (!avatarFile) throw new Error("No avatar file found.");

      // 上传头像
      const ext = avatarFile.name.split('.').pop();
      const filename = `avatars/${userData.fullName.replace(/\s/g, "_")}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filename, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadError) throw new Error("Failed to upload avatar: " + uploadError.message);

      const { data } = supabase.storage.from("avatars").getPublicUrl(filename);
      const avatarUrl = data.publicUrl;

      // 1. 先插入用户，拿到 userId
      const { data: userRes, error: userErr } = await supabase
        .from("users")
        .insert([{
          full_name: userData.fullName,
          gender: userData.gender,
          country_code: userData.countryCode,
          phone: userData.phoneNumber,
          avatar_url: avatarUrl,
          role: "administrator",
          email,
        }])
        .select("id"); // <-- 这里返回 userId

      if (userErr || !userRes || !userRes[0]?.id) throw new Error("Failed to insert user: " + (userErr?.message || ""));
      const userId = userRes[0].id;

      // 2. 再插入公司，把自己加进 members/administrators
      const { data: companyRes, error: companyErr } = await supabase
        .from("companies")
        .insert([{
          name: companyName,
          members: [userId],
          administrators: [userId],
        }])
        .select("company_code");

      if (companyErr || !companyRes || !companyRes[0]?.company_code) throw new Error("Failed to create company: " + (companyErr?.message || ""));
      const company_code = companyRes[0].company_code;

      // 3. 回头把 users 表的 company_code 补上
      const { error: updateErr } = await supabase
        .from("users")
        .update({ company_code })
        .eq("id", userId);

      if (updateErr) throw new Error("Failed to update user with company_code: " + updateErr.message);

      setGeneratedCode(company_code);
      setEmailSent(true);
    } catch (err: any) {
      alert(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, generatedCode, emailSent, generateCompanyCode };
}
