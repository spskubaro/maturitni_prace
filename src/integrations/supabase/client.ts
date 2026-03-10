import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Chybí Supabase konfigurace. Zkontroluj VITE_SUPABASE_URL a VITE_SUPABASE_PUBLISHABLE_KEY.");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // localStorage - session prezije zavreni tabu/prohlizece a funguje
    // spolecne ve vsech tabech stejneho prohlizece (standardni chovani)
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
