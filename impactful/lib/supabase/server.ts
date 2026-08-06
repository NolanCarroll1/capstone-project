import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseServerEnv() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url) {
		throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
	}

	if (!anonKey) {
		throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
	}

	return { url, anonKey };
}

export function createSupabaseServerClient(accessToken?: string): SupabaseClient {
	const { url, anonKey } = getSupabaseServerEnv();
	return createClient(url, anonKey, {
		global: accessToken
			? {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			: undefined,
	});
}
