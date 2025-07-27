// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";

export default function PrivateRoute() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        setAuthed(false);
      } else {
        setAuthed(true);
      }
      setCheckingAuth(false);
    };
    checkLogin();
  }, []);

  if (checkingAuth) {
    return null; // 或者显示 loading
  }

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
