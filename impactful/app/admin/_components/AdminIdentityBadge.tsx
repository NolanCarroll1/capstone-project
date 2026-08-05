"use client";

import { useSyncExternalStore } from "react";

import { getSessionSnapshot, subscribeToSession } from "@/lib/auth/session";

function getInitialsFromName(name?: string) {
	if (!name) {
		return null;
	}

	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length >= 2) {
		return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
	}

	if (parts.length === 1 && parts[0].length > 0) {
		return parts[0].slice(0, 2).toUpperCase();
	}

	return null;
}

function getInitialsFromEmail(email?: string) {
	if (!email) {
		return null;
	}

	const localPart = email.split("@")[0] ?? "";
	const chunks = localPart.split(/[._\-\s]+/).filter(Boolean);

	if (chunks.length >= 2) {
		return `${chunks[0][0] ?? ""}${chunks[1][0] ?? ""}`.toUpperCase();
	}

	if (chunks.length === 1) {
		const source = chunks[0].replace(/[^a-zA-Z0-9]/g, "");
		if (source.length >= 2) {
			return source.slice(0, 2).toUpperCase();
		}
		if (source.length === 1) {
			return source.toUpperCase();
		}
	}

	return null;
}

export function AdminIdentityBadge() {
	const session = useSyncExternalStore(subscribeToSession, getSessionSnapshot, () => null);
	const initials =
		getInitialsFromName(session?.name) ??
		getInitialsFromEmail(session?.email) ??
		(session?.role === "admin" ? "AD" : "US");

	return <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#f6ffe2]">{initials}</span>;
}
