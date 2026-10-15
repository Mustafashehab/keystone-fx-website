"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PasswordRecoveryRedirect() {
  useEffect(() => {
    if (window.location.pathname === "/portal/reset-password") return;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.get("type") === "recovery") {
      window.location.replace("/portal/reset-password" + window.location.hash);
      return;
    }
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (event === "PASSWORD_RECOVERY") window.location.replace("/portal/reset-password");
    });
    return () => subscription.unsubscribe();
  }, []);
  return null;
}
