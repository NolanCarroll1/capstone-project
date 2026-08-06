import type { Session as SupabaseSession, User as SupabaseUser } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type SessionRole = "user" | "admin";

export type SessionData = {
	status: "active";
	role: SessionRole;
	email?: string;
	name?: string;
	userId: string;
};

type SessionSnapshot = SessionData | null | undefined;

type ProfileRecord = {
	id: string;
	email?: string | null;
	full_name?: string | null;
	name?: string | null;
	role?: string | null;
};

const listeners = new Set<() => void>();

let snapshot: SessionSnapshot = undefined;
let initialized = false;
let unsubscribeAuthListener: (() => void) | null = null;

function normalizeEmail(email: string | undefined) {
	if (!email) {
		return undefined;
	}

	const trimmed = email.trim().toLowerCase();
	return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeName(name: string | undefined) {
	if (!name) {
		return undefined;
	}

	const normalized = name.trim().replace(/\s+/g, " ");
	return normalized.length > 0 ? normalized : undefined;
}

function resolveRole(user: SupabaseUser): SessionRole {
	return user.user_metadata?.role === "admin" ? "admin" : "user";
}

function toSessionData(session: SupabaseSession | null): SessionData | null {
	if (!session?.user) {
		return null;
	}

	const { user } = session;
	const metadataName =
		typeof user.user_metadata?.full_name === "string"
			? user.user_metadata.full_name
			: typeof user.user_metadata?.name === "string"
				? user.user_metadata.name
				: undefined;

	return {
		status: "active",
		role: resolveRole(user),
		email: normalizeEmail(user.email),
		name: normalizeName(metadataName),
		userId: user.id,
	};
}

function notifyListeners() {
	for (const listener of listeners) {
		listener();
	}
}

function canUseBrowserAuth() {
	return typeof window !== "undefined";
}

function resolveProfileRole(role: string | null | undefined): SessionRole {
	return role === "admin" ? "admin" : "user";
}

async function upsertProfileForSession(session: SessionData) {
	if (!canUseBrowserAuth()) {
		return;
	}

	const supabase = getSupabaseBrowserClient();
	const metadataName =
		typeof session.name === "string"
			? session.name
			: undefined;

	const { error } = await supabase.from("profiles").upsert(
		{
			id: session.userId,
			email: session.email,
			full_name: normalizeName(metadataName),
			role: session.role,
		},
		{ onConflict: "id" },
	);

	if (error) {
		if (!/undefined table|does not exist|relation "profiles"|Could not find the table/i.test(error.message)) {
			console.warn("Failed to sync Supabase profile", error);
		}
	}
}

async function hydrateSessionFromProfile(session: SessionData): Promise<SessionData> {
	await upsertProfileForSession(session);

	if (!canUseBrowserAuth()) {
		return session;
	}

	const supabase = getSupabaseBrowserClient();
	const { data, error } = await supabase.from("profiles").select("id, email, full_name, name, role").eq("id", session.userId).maybeSingle();
	if (error) {
		if (!/undefined table|does not exist|relation "profiles"|Could not find the table/i.test(error.message)) {
			console.warn("Failed to fetch Supabase profile", error);
		}
		return session;
	}

	const profile = data as ProfileRecord | null;
	if (!profile) {
		return session;
	}

	const nextRole = resolveProfileRole(profile.role);
	const nextName = normalizeName(profile.full_name ?? profile.name ?? session.name);
	const nextEmail = normalizeEmail(profile.email ?? session.email);

	return {
		...session,
		role: nextRole,
		name: nextName,
		email: nextEmail,
	};
}

async function syncSnapshotFromSession(session: SupabaseSession | null) {
	const baseSession = toSessionData(session);
	if (!baseSession) {
		snapshot = null;
		notifyListeners();
		return null;
	}

	const hydratedSession = await hydrateSessionFromProfile(baseSession);
	snapshot = hydratedSession;
	notifyListeners();
	return hydratedSession;
}

function ensureInitialized() {
	if (!canUseBrowserAuth() || initialized) {
		return;
	}

	initialized = true;
	const supabase = getSupabaseBrowserClient();
	const { data } = supabase.auth.onAuthStateChange((_event, session) => {
		void syncSnapshotFromSession(session);
	});
	unsubscribeAuthListener = () => data.subscription.unsubscribe();
	void refreshSessionSnapshot();
}

export async function refreshSessionSnapshot() {
	if (!canUseBrowserAuth()) {
		return null;
	}

	const supabase = getSupabaseBrowserClient();
	const { data, error } = await supabase.auth.getSession();
	if (error) {
		console.error("Failed to fetch Supabase session", error);
		snapshot = null;
		notifyListeners();
		return null;
	}

	return syncSnapshotFromSession(data.session);
}

export function getSessionSnapshot() {
	if (canUseBrowserAuth()) {
		ensureInitialized();
	}

	return snapshot;
}

export function subscribeToSession(listener: () => void) {
	if (!canUseBrowserAuth()) {
		return () => undefined;
	}

	ensureInitialized();
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && unsubscribeAuthListener) {
			unsubscribeAuthListener();
			unsubscribeAuthListener = null;
			initialized = false;
			snapshot = undefined;
		}
	};
}

export function getPostLoginHref(session: SessionData | null) {
	if (!session) {
		return "/login";
	}

	return session.role === "admin" ? "/admin" : "/dashboard";
}

export async function clearActiveSession() {
	if (!canUseBrowserAuth()) {
		return;
	}

	const supabase = getSupabaseBrowserClient();
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw error;
	}

	snapshot = null;
	notifyListeners();
}