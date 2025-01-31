import { createClient, type User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
    console.error("Supabase URL is not set");
    throw new Error("Supabase URL is not set");
}

if (!supabaseAnonKey) {
    console.error("Supabase anon key is not set");
    throw new Error("Supabase anon key is not set");
}

type Profile = {
    id: string
    name: string
    email: string
    avatar: string
    credits: number
    plan: string
}

export type { User, Profile };
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
