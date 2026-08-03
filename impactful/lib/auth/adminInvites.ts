const INVITED_ADMINS_KEY = "impactful-admin-invites-v2";
const ADMIN_ACCOUNTS_KEY = "impactful-admin-accounts-v1";
const INVITES_EVENT = "impactful-admin-invites-change";

const DEFAULT_ADMIN_EMAIL = "admin@impactful.org";
const DEFAULT_ADMIN_PASSWORD = "password";

export type AdminInviteRecord = {
	email: string;
	code: string;
	invitedAt: string;
	claimedAt?: string;
};

type AdminAccountRecord = {
	email: string;
	password: string;
	createdAt: string;
};

type AdminAccountSummary = {
	email: string;
	createdAt: string;
};

const NO_STORAGE_CACHE_KEY = "__no_storage__";
const EMPTY_EMAIL_LIST: string[] = [];
const EMPTY_INVITE_LIST: AdminInviteRecord[] = [];
const EMPTY_ACCOUNT_LIST: AdminAccountSummary[] = [];

let inviteEmailsCacheKey: string | null = null;
let inviteEmailsCache: string[] = EMPTY_EMAIL_LIST;

let invitesCacheKey: string | null = null;
let invitesCache: AdminInviteRecord[] = EMPTY_INVITE_LIST;

let adminAccountsCacheKey: string | null = null;
let adminAccountsCache: AdminAccountSummary[] = EMPTY_ACCOUNT_LIST;

function canUseStorage() {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeEmail(email: string) {
	const normalized = email.trim().toLowerCase();
	if (normalized.endsWith("@impactful")) {
		return `${normalized}.org`;
	}

	return normalized;
}

function isValidEmail(email: string) {
	return /^\S+@\S+\.\S+$/.test(email);
}

function generateInviteCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const length = 8;

	if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
		const values = new Uint32Array(length);
		window.crypto.getRandomValues(values);
		return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
	}

	return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function readStoredInvites(): AdminInviteRecord[] {
	if (!canUseStorage()) {
		return [];
	}

	const raw = window.localStorage.getItem(INVITED_ADMINS_KEY);
	if (!raw) {
		return [];
	}

	try {
		const parsed = JSON.parse(raw) as AdminInviteRecord[];
		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed
			.map((record) => ({
				email: normalizeEmail(record.email ?? ""),
				code: String(record.code ?? "").trim().toUpperCase(),
				invitedAt: record.invitedAt ?? new Date().toISOString(),
				claimedAt: record.claimedAt,
			}))
			.filter((record) => Boolean(record.email && record.code));
	} catch {
		return [];
	}
}

function readStoredAccounts(): AdminAccountRecord[] {
	if (!canUseStorage()) {
		return [{ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD, createdAt: new Date().toISOString() }];
	}

	const raw = window.localStorage.getItem(ADMIN_ACCOUNTS_KEY);
	if (!raw) {
		const seeded = [{ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD, createdAt: new Date().toISOString() }];
		window.localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(seeded));
		return seeded;
	}

	try {
		const parsed = JSON.parse(raw) as AdminAccountRecord[];
		if (!Array.isArray(parsed)) {
			return [];
		}

		const normalized = parsed
			.map((record) => ({
				email: normalizeEmail(record.email ?? ""),
				password: String(record.password ?? ""),
				createdAt: record.createdAt ?? new Date().toISOString(),
			}))
			.filter((record) => Boolean(record.email && record.password));

		if (!normalized.some((record) => record.email === DEFAULT_ADMIN_EMAIL)) {
			normalized.unshift({ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD, createdAt: new Date().toISOString() });
			window.localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(normalized));
		}

		return normalized;
	} catch {
		return [{ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD, createdAt: new Date().toISOString() }];
	}
}

function writeStoredInvites(invites: AdminInviteRecord[]) {
	if (!canUseStorage()) {
		return;
	}

	window.localStorage.setItem(INVITED_ADMINS_KEY, JSON.stringify(invites));
	inviteEmailsCacheKey = null;
	invitesCacheKey = null;
	window.dispatchEvent(new Event(INVITES_EVENT));
}

function writeStoredAccounts(accounts: AdminAccountRecord[]) {
	if (!canUseStorage()) {
		return;
	}

	window.localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
	adminAccountsCacheKey = null;
	window.dispatchEvent(new Event(INVITES_EVENT));
}

export function listInvitedAdminEmails() {
	const cacheKey = canUseStorage()
		? (window.localStorage.getItem(INVITED_ADMINS_KEY) ?? "")
		: NO_STORAGE_CACHE_KEY;

	if (inviteEmailsCacheKey === cacheKey) {
		return inviteEmailsCache;
	}

	inviteEmailsCache = readStoredInvites().filter((invite) => !invite.claimedAt).map((invite) => invite.email);
	inviteEmailsCacheKey = cacheKey;
	return inviteEmailsCache;
}

export function listAdminInvites() {
	const cacheKey = canUseStorage()
		? (window.localStorage.getItem(INVITED_ADMINS_KEY) ?? "")
		: NO_STORAGE_CACHE_KEY;

	if (invitesCacheKey === cacheKey) {
		return invitesCache;
	}

	invitesCache = [...readStoredInvites()].sort((a, b) => b.invitedAt.localeCompare(a.invitedAt));
	invitesCacheKey = cacheKey;
	return invitesCache;
}

export function listAdminAccounts() {
	const cacheKey = canUseStorage()
		? (window.localStorage.getItem(ADMIN_ACCOUNTS_KEY) ?? "")
		: NO_STORAGE_CACHE_KEY;

	if (adminAccountsCacheKey === cacheKey) {
		return adminAccountsCache;
	}

	adminAccountsCache = readStoredAccounts().map((account) => ({ email: account.email, createdAt: account.createdAt }));
	adminAccountsCacheKey = cacheKey;
	return adminAccountsCache;
}

export function isAdminInvited(email: string) {
	const normalized = normalizeEmail(email);
	if (!normalized) {
		return false;
	}

	return readStoredInvites().some((invite) => invite.email === normalized && !invite.claimedAt);
}

export function inviteAdmin(email: string) {
	const normalized = normalizeEmail(email);
	if (!normalized) {
		return { ok: false as const, message: "Enter an email address first." };
	}
	if (!isValidEmail(normalized)) {
		return { ok: false as const, message: "Enter a valid email address." };
	}

	const invites = readStoredInvites();
	const accounts = readStoredAccounts();

	if (accounts.some((account) => account.email === normalized)) {
		return { ok: false as const, message: "That email already has an admin account." };
	}

	const existing = invites.find((invite) => invite.email === normalized && !invite.claimedAt);
	if (existing) {
		return {
			ok: true as const,
			message: `Invite already active. Share code ${existing.code} with ${normalized}.`,
			code: existing.code,
		};
	}

	const code = generateInviteCode();
	const nextInvite: AdminInviteRecord = {
		email: normalized,
		code,
		invitedAt: new Date().toISOString(),
	};

	writeStoredInvites([nextInvite, ...invites]);
	return {
		ok: true as const,
		message: `Invite created for ${normalized}. Share code ${code}.`,
		code,
	};
}

export function authenticateAdmin(email: string, password: string) {
	const normalized = normalizeEmail(email);
	if (!normalized || !password) {
		return false;
	}

	const accounts = readStoredAccounts();
	return accounts.some((account) => account.email === normalized && account.password === password);
}

export function registerAdminFromInvite({
	email,
	code,
	password,
}: {
	email: string;
	code: string;
	password: string;
}) {
	const normalized = normalizeEmail(email);
	const normalizedCode = code.trim().toUpperCase();

	if (!normalized || !normalizedCode || !password) {
		return { ok: false as const, message: "Email, invite code, and password are required." };
	}
	if (!isValidEmail(normalized)) {
		return { ok: false as const, message: "Enter a valid email address." };
	}
	if (password.length < 8) {
		return { ok: false as const, message: "Password must be at least 8 characters." };
	}

	const invites = readStoredInvites();
	const invite = invites.find((entry) => entry.email === normalized && !entry.claimedAt);
	if (!invite) {
		return { ok: false as const, message: "No active invite found for that email." };
	}
	if (invite.code !== normalizedCode) {
		return { ok: false as const, message: "Invite code does not match." };
	}

	const accounts = readStoredAccounts();
	if (accounts.some((account) => account.email === normalized)) {
		return { ok: false as const, message: "That admin account already exists." };
	}

	const createdAt = new Date().toISOString();
	writeStoredAccounts([{ email: normalized, password, createdAt }, ...accounts]);
	writeStoredInvites(
		invites.map((entry) =>
			entry.email === normalized && !entry.claimedAt
				? { ...entry, claimedAt: createdAt }
				: entry,
		),
	);

	return { ok: true as const, message: "Admin account created. You can now sign in." };
}

export function subscribeToAdminInvites(listener: () => void) {
	if (!canUseStorage()) {
		return () => undefined;
	}

	const handleChange = () => listener();
	window.addEventListener("storage", handleChange);
	window.addEventListener(INVITES_EVENT, handleChange);

	return () => {
		window.removeEventListener("storage", handleChange);
		window.removeEventListener(INVITES_EVENT, handleChange);
	};
}