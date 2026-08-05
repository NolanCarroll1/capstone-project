const SESSION_KEY = "impactful-session-v1";
const SESSION_EVENT = "impactful-session-change";
const LEGACY_USER_SESSION: SessionData = { status: "active", role: "user" };

let lastSessionRaw: string | null | undefined;
let lastSessionSnapshot: SessionData | null | undefined;

export type SessionRole = "user" | "admin";

export type SessionData = {
	status: "active";
	role: SessionRole;
	email?: string;
	name?: string;
};

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

function canUseStorage() {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getActiveSession(): SessionData | null {
	if (!canUseStorage()) {
		return null;
	}

	const raw = window.localStorage.getItem(SESSION_KEY);
	if (raw === lastSessionRaw && lastSessionSnapshot !== undefined) {
		return lastSessionSnapshot;
	}

	lastSessionRaw = raw;

	if (!raw) {
		lastSessionSnapshot = null;
		return lastSessionSnapshot;
	}

	if (raw === "active") {
		lastSessionSnapshot = LEGACY_USER_SESSION;
		return lastSessionSnapshot;
	}

	try {
		const parsed = JSON.parse(raw) as Partial<SessionData>;
		if (parsed.status === "active" && (parsed.role === "user" || parsed.role === "admin")) {
			lastSessionSnapshot = {
				status: "active",
				role: parsed.role,
				email: normalizeEmail(parsed.email),
				name: normalizeName(parsed.name),
			};
			return lastSessionSnapshot;
		}
	} catch {
		lastSessionSnapshot = null;
		return lastSessionSnapshot;
	}

	lastSessionSnapshot = null;
	return lastSessionSnapshot;
}

export function hasActiveSession() {
	return getActiveSession() !== null;
}

export function setActiveSession(role: SessionRole = "user", email?: string, name?: string) {
	if (!canUseStorage()) {
		return;
	}

	const nextSession: SessionData = {
		status: "active",
		role,
		email: normalizeEmail(email),
		name: normalizeName(name),
	};
	const nextRaw = JSON.stringify(nextSession);
	lastSessionRaw = nextRaw;
	lastSessionSnapshot = nextSession;
	window.localStorage.setItem(SESSION_KEY, nextRaw);
	window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearActiveSession() {
	if (!canUseStorage()) {
		return;
	}

	lastSessionRaw = null;
	lastSessionSnapshot = null;
	window.localStorage.removeItem(SESSION_KEY);
	window.dispatchEvent(new Event(SESSION_EVENT));
}

export function subscribeToSession(listener: () => void) {
	if (!canUseStorage()) {
		return () => undefined;
	}

	const handleChange = () => listener();
	window.addEventListener("storage", handleChange);
	window.addEventListener(SESSION_EVENT, handleChange);

	return () => {
		window.removeEventListener("storage", handleChange);
		window.removeEventListener(SESSION_EVENT, handleChange);
	};
}

export function getSessionSnapshot() {
	return getActiveSession();
}

export function getPostLoginHref(session: SessionData | null) {
	if (!session) {
		return "/login";
	}

	return session.role === "admin" ? "/admin" : "/dashboard";
}