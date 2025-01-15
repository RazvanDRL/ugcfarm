import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
    console.error("Supabase URL is not set");
    throw new Error("Supabase URL is not set");
}

if (!supabaseServiceRoleKey) {
    console.error("Supabase service role key is not set");
    throw new Error("Supabase service role key is not set");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
