"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearActiveSession } from "@/lib/auth/session";

export function LogoutButton({
	className,
	children = "Log out",
	variant = "ghost",
	onLoggedOut,
	redirectTo = "/login",
}: {
	className?: string;
	children?: React.ReactNode;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	onLoggedOut?: () => void;
	redirectTo?: string;
}) {
	const router = useRouter();

	return (
		<Button
			type="button"
			variant={variant}
			onClick={async () => {
				await clearActiveSession();
				onLoggedOut?.();
				router.replace(redirectTo);
			}}
			className={cn(className)}
		>
			{children}
		</Button>
	);
}