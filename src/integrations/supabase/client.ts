import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Chybí Supabase konfigurace. Zkontroluj VITE_SUPABASE_URL a VITE_SUPABASE_PUBLISHABLE_KEY.");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // Udrzi session jen v ramci aktualni karty/okna (sessionStorage),
    // po zavreni okna se uzivatel neprihlasi automaticky znovu.
    storage: sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
