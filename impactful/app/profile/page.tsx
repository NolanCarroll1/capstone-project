"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useSyncExternalStore } from "react";

import { LogoutButton } from "../_components/LogoutButton";
import { MobileBottomNav } from "../_components/MobileBottomNav";
import { RequireSession } from "../_components/RequireSession";
import { FullTopMenu } from "../modules/_components/FullTopMenu";
import { getSessionSnapshot, subscribeToSession } from "@/lib/auth/session";

type ProfileAction = {
	iconSrc: string;
	label: string;
	description: string;
	href?: string;
};

const profileActions: ProfileAction[] = [
	{
		iconSrc: "/assets/figma-capstone/profile/security-settings.png",
		label: "Security Settings",
		description: "Password & 2FA",
	},
	{
		iconSrc: "/assets/figma-capstone/profile/notifications.png",
		label: "Notifications",
		description: "Manage alerts",
		href: "/profile/notifications",
	},
];

function toTitleCase(value: string) {
	return value
		.toLowerCase()
		.replace(/(^|[\s\-'])[a-z]/g, (match) => match.toUpperCase());
}

function getNameParts(name?: string) {
	if (!name) {
		return [];
	}

	return name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => toTitleCase(part));
}

function getEmailChunks(email?: string) {
	if (!email) {
		return [];
	}

	const localPart = email.split("@")[0] ?? "";
	return localPart
		.split(/[._\-\s]+/)
		.filter(Boolean)
		.map((chunk) => toTitleCase(chunk));
}

function getDisplayName(name?: string) {
	const nameParts = getNameParts(name);
	if (nameParts.length > 0) {
		return nameParts.join(" ");
	}

	return "Impactful User";
}

function getDisplayInitials(name?: string, email?: string) {
	const nameParts = getNameParts(name);
	if (nameParts.length >= 2) {
		return `${nameParts[0][0] ?? ""}${nameParts[nameParts.length - 1][0] ?? ""}`.toUpperCase();
	}
	if (nameParts.length === 1) {
		return nameParts[0].slice(0, 2).toUpperCase();
	}

	const emailChunks = getEmailChunks(email);
	if (emailChunks.length >= 2) {
		return `${emailChunks[0][0] ?? ""}${emailChunks[1][0] ?? ""}`.toUpperCase();
	}
	if (emailChunks.length === 1) {
		return emailChunks[0].slice(0, 2).toUpperCase();
	}

	return "IU";
}

function ActionRow({ action }: { action: ProfileAction }) {
	const content = (
		<>
			<div className="flex items-center gap-4">
				<div className="relative h-12 w-12 shrink-0">
					<Image src={action.iconSrc} alt="" fill sizes="48px" className="object-contain" />
				</div>
				<div>
					<p className="font-sans text-[15px] font-bold leading-[1.5] text-black">{action.label}</p>
					<p className="mt-0.5 font-sans text-[13px] font-medium leading-[1.5] text-[#99a1af]">{action.description}</p>
				</div>
			</div>
			<ChevronRight className="h-4 w-4 text-[#c5cbd7]" />
		</>
	);

	if (action.href) {
		return (
			<Link href={action.href} className="flex w-full items-center justify-between px-[22px] py-[18px]">
				{content}
			</Link>
		);
	}

	return (
		<button
			type="button"
			className="flex w-full items-center justify-between px-[22px] py-[18px] text-left"
			aria-label={`${action.label} (coming soon)`}
		>
			{content}
		</button>
	);
}

export default function ProfilePage() {
	const session = useSyncExternalStore(subscribeToSession, getSessionSnapshot, () => null);
	const displayName = getDisplayName(session?.name);
	const displayEmail = session?.email ?? "No email";
	const initials = getDisplayInitials(session?.name, session?.email);

	return (
		<RequireSession>
			<main className="min-h-dvh bg-[#f8f8f8] pb-[calc(96px+env(safe-area-inset-bottom))] text-black sm:flex sm:justify-center">
				<section className="mx-auto min-h-dvh w-full max-w-screen-sm bg-[#f8f8f8]">
					<header className="sticky top-0 z-30 border-b border-[#f3f4f6] bg-[#eef1f4] px-6 py-4">
						<div className="flex items-center justify-between">
							<Image
								src="/assets/figma-capstone/dashboard-impactful-wordmark-node-1115-748.png"
								alt="Impactful"
								width={100}
								height={48}
								unoptimized
								className="h-12 w-[100px] object-contain"
							/>
							<FullTopMenu />
						</div>
					</header>

					<div className="px-6 py-6">
						<div className="rounded-3xl border-[1.836px] border-[#f1f3f6] bg-white px-[26px] py-[24px] text-center shadow-[0px_4px_0px_#eff1f5]">
							<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0e6b7c]">
								<span className="font-sans text-2xl font-bold leading-8 text-white">{initials}</span>
							</div>
							<h2 className="mt-3 font-sans text-[18px] font-bold leading-[1.5] text-black">{displayName}</h2>
							<p className="mt-0.5 break-words font-sans text-[13px] leading-[1.5] text-[#99a1af]">{displayEmail}</p>
							<Link
								href="/profile/edit"
								className="mt-4 inline-flex rounded-full bg-[#ff8d00] px-6 py-2.5 font-mono text-xs font-bold tracking-[0.1em] text-white shadow-[0px_3px_0px_#b46300]"
							>
								EDIT PROFILE
							</Link>
						</div>

						<div className="pt-6">
							<p className="font-mono text-xs font-bold tracking-[0.1em] text-[#99a1af]">SETTINGS</p>
							<div className="space-y-3 pt-3">
								{profileActions.map((action) => (
									<div key={action.label} className="rounded-[20px] border-[1.836px] border-[#f1f3f6] bg-white shadow-[0px_4px_0px_#eff1f5]">
										<ActionRow action={action} />
									</div>
								))}
							</div>
						</div>

						<LogoutButton
							variant="ghost"
							className="mt-6 flex h-[50px] w-full items-center justify-center rounded-full border-[1.836px] border-[#e5e7eb] bg-transparent px-5 font-sans text-[15px] font-bold text-[#99a1af] hover:bg-transparent hover:text-[#7f8898]"
						>
							Sign Out
						</LogoutButton>
					</div>
				</section>

				<MobileBottomNav />
			</main>
		</RequireSession>
	);
}
