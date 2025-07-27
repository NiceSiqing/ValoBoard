import { useState } from "react";
import { supabase } from "@/supabase";
import type { UserData } from "./OnboardingModal";

type JoinStatus = "idle" | "loading" | "pending" | "error" | "success";

export function useJoinCompany(userData: UserData) {
  const [status, setStatus] = useState<JoinStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const joinCompany = async (companyCode: string) => {
    setStatus("loading");
    setErrorMsg("");

    // 1. 校验公司码
    const { data: company, error } = await supabase
      .from("companies")
      .select("*")
      .eq("company_code", companyCode)
      .single();

    if (error || !company) {
      setStatus("error");
      setErrorMsg("Invalid company code.");
      return;
    }

    // 2. 插入用户，待审核
    const { error: insertErr } = await supabase
      .from("users")
      .insert([{
        full_name: userData.fullName,
        gender: userData.gender,
        country_code: userData.countryCode,
        phone: userData.phoneNumber,
        avatar_url: userData.avatarPreview, 
        role: userData.userRole, // 这里直接用 userData.userRole
        company_code: companyCode,
        email: userData.email, 
        application_status: "pending",
      }])
      .select("id"); // 可以加 select 方便后续

    if (insertErr) {
      setStatus("error");
      setErrorMsg("Failed to join company.");
      return;
    }

    setStatus("pending");
  };

  return { status, errorMsg, joinCompany };
}
