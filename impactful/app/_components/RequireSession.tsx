"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { getPostLoginHref, getSessionSnapshot, subscribeToSession, type SessionRole } from "@/lib/auth/session";

export function RequireSession({
	children,
	requiredRole,
	redirectTo,
}: {
	children: React.ReactNode;
	requiredRole?: SessionRole;
	redirectTo?: string;
}) {
	const router = useRouter();
	const session = useSyncExternalStore(subscribeToSession, getSessionSnapshot, () => null);

	useEffect(() => {
		if (!session) {
			router.replace(redirectTo ?? "/login");
			return;
		}

		if (requiredRole && session.role !== requiredRole) {
			router.replace(redirectTo ?? getPostLoginHref(session));
		}
	}, [redirectTo, requiredRole, router, session]);

	if (!session || (requiredRole && session.role !== requiredRole)) {
		return null;
	}

	return <>{children}</>;
}