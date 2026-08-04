"use client";

import Link from "next/link";
import { useState } from "react";
import { MobileBottomNav } from "../_components/MobileBottomNav";
import { LogoutButton } from "../_components/LogoutButton";
import { RequireSession } from "../_components/RequireSession";

type ProfileAction = {
	icon: string;
	label: string;
	href?: string;
};

const profileActions: ProfileAction[] = [
	{ icon: "★", label: "My Badges" },
	{ icon: "■", label: "Security Settings" },
	{ icon: "◆", label: "Notifications" },
	{ icon: "▤", label: "Module History", href: "/modules/deceptive-design" },
];

function ActionRow({ action }: { action: ProfileAction }) {
	const content = (
		<>
			<div className="flex items-center gap-3">
				<span className="font-sans text-[16px] leading-none text-black">{action.icon}</span>
				<span className="font-sans text-[14px] font-medium text-black">{action.label}</span>
			</div>
			<span className="font-sans text-[18px] leading-none text-[#d1d5dc]">›</span>
		</>
	);

	if (action.href) {
		return (
			<Link href={action.href} className="flex h-14 items-center justify-between px-5">
				{content}
			</Link>
		);
	}

	return (
		<button
			type="button"
			className="flex h-14 w-full items-center justify-between px-5 text-left"
			aria-label={`${action.label} (coming soon)`}
		>
			{content}
		</button>
	);
}

export default function ProfilePage() {
	const [darkModeEnabled, setDarkModeEnabled] = useState(false);

	return (
		<RequireSession>
			<main className="min-h-dvh bg-white pb-[calc(96px+env(safe-area-inset-bottom))] text-black sm:flex sm:justify-center">
				<section className="mx-auto w-full max-w-107.5">
				<header className="flex items-center justify-between px-[clamp(14px,4.5vw,20px)] pb-[clamp(10px,2.8vw,16px)] pt-[calc(16px+env(safe-area-inset-top))]">
					<Link href="/dashboard" className="font-mono text-[clamp(12px,3.2vw,14px)] text-[#6a7282]">
						← BACK
					</Link>
					<p className="font-mono text-[clamp(12px,3.2vw,14px)] font-bold tracking-[0.12em] text-black">PROFILE</p>
					<div className="w-[clamp(28px,8vw,40px)]" aria-hidden="true" />
				</header>

				<div className="px-[clamp(14px,4.5vw,20px)] pb-[clamp(18px,5vw,24px)] pt-[clamp(8px,2.8vw,16px)] text-center">
					<div className="mx-auto flex h-[clamp(78px,24vw,96px)] w-[clamp(78px,24vw,96px)] items-center justify-center rounded-full bg-black shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]">
						<span className="font-sans text-[clamp(24px,7vw,30px)] font-bold leading-none text-white">JD</span>
					</div>
					<h1 className="mt-[clamp(12px,3.5vw,16px)] font-sans text-[clamp(28px,8.6vw,38px)] font-bold leading-[1.05] tracking-[-0.04em] text-black">
						Jane Doe
					</h1>
					<p className="mt-1 wrap-break-word font-sans text-[clamp(13px,3.7vw,14px)] text-[#6a7282]">
						User · jane.doe@impactful.app
					</p>
					<button
						type="button"
						className="mt-[clamp(12px,3.5vw,16px)] rounded-full bg-[#ff8d00] px-[clamp(14px,4.5vw,16px)] py-[clamp(10px,3.2vw,12px)] font-sans text-[clamp(15px,4.2vw,16px)] font-bold leading-none text-white"
					>
						Edit Profile
					</button>
				</div>

				<div className="px-[clamp(10px,3.8vw,16px)]">
					<div className="overflow-hidden rounded-2xl border border-[#f1f5f9] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)]">
						{profileActions.map((action) => (
							<div key={action.label} className="border-b border-[#f8fafc] last:border-b-0">
								<ActionRow action={action} />
							</div>
						))}

						<div className="flex h-14 items-center justify-between px-5">
							<div className="flex items-center gap-3">
								<span className="font-sans text-[clamp(15px,4.2vw,16px)] leading-none text-black">◑</span>
								<span className="font-sans text-[clamp(13px,3.7vw,14px)] font-medium text-black">Dark Mode</span>
							</div>
							<button
								type="button"
								onClick={() => setDarkModeEnabled((current) => !current)}
								aria-pressed={darkModeEnabled}
								className={`relative h-6 w-10 rounded-full transition-colors ${
									darkModeEnabled ? "bg-black" : "bg-[#e5e7eb]"
								}`}
							>
								<span
									className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)] transition-all ${
										darkModeEnabled ? "left-5" : "left-1"
									}`}
								/>
							</button>
						</div>

						<LogoutButton
							variant="ghost"
							className="flex h-14 w-full items-center justify-between px-5 text-[#99a1af] hover:bg-transparent hover:text-[#6a7282]"
						>
							<div className="flex items-center gap-3">
								<span className="font-sans text-[clamp(15px,4.2vw,16px)] leading-none text-[#99a1af]">→</span>
								<span className="font-sans text-[clamp(13px,3.7vw,14px)] font-medium text-[#99a1af]">Sign Out</span>
							</div>
							<span className="font-sans text-[18px] leading-none text-[#d1d5dc]">›</span>
						</LogoutButton>
					</div>
				</div>
			</section>

			<MobileBottomNav />
		</main>
		</RequireSession>
	);
}
