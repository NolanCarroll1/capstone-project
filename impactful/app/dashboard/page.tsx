"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

import { LogoutButton } from "../_components/LogoutButton";
import { RequireSession } from "../_components/RequireSession";

type DashboardTile = {
	label: string;
	title: string;
	background: string;
	badgeBackground: string;
	opacity: number;
	href?: string;
};

const moduleTiles: DashboardTile[] = [
	{
		label: "LIVE",
		title: "Deceptive Design",
		background: "#ff8d00",
		badgeBackground: "rgba(255,255,255,0.2)",
		opacity: 1,
		href: "/modules/deceptive-design",
	},
	{
		label: "SOON",
		title: "",
		background: "#6b7280",
		badgeBackground: "rgba(0,0,0,0.2)",
		opacity: 0.7,
	},
	{
		label: "SOON",
		title: "",
		background: "#7c3aed",
		badgeBackground: "rgba(0,0,0,0.2)",
		opacity: 0.7,
	},
	{
		label: "SOON",
		title: "",
		background: "#0e9f6e",
		badgeBackground: "rgba(0,0,0,0.2)",
		opacity: 0.7,
	},
];

function WelcomeMascot({
	width,
	height,
	className,
}: {
	width: number;
	height: number;
	className?: string;
}) {
	return (
		<div
			className={`relative overflow-hidden ${className ?? ""}`}
			style={{ width, height }}
		>
			<Image
				src="/assets/welcome-logo-node-686-16004-latest.png"
				alt=""
				aria-hidden
				width={711}
				height={441}
				unoptimized
				className="pointer-events-none absolute max-w-none select-none"
				style={{
					height: "441.38%",
					width: "711.11%",
					left: "-19.91%",
					top: "-100%",
				}}
			/>
		</div>
	);
}

function DashboardTopMenu() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				aria-label={open ? "Close menu" : "Open menu"}
				onClick={() => setOpen((value) => !value)}
				className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[#08394d] transition-colors hover:bg-[#dfe7ef]"
			>
				{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</button>

			{open ? (
				<div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)}>
					<nav
						aria-label="Dashboard navigation"
						onClick={(event) => event.stopPropagation()}
						className="absolute left-1/2 top-0 w-full max-w-[393px] -translate-x-1/2 rounded-b-[28px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
					>
						<div className="flex items-center justify-between px-6 pb-4 pt-6">
							<p className="font-mono text-[12px] font-bold tracking-[0.1em] text-[#99a1af]">MENU</p>
							<button
								type="button"
								aria-label="Close menu"
								onClick={() => setOpen(false)}
								className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#99a1af] transition-colors hover:bg-[#f3f4f6]"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<div className="px-6 pb-6">
							<div className="flex items-center gap-3 rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-[17px] py-[13px]">
								<Search className="h-4 w-4 text-[#99a1af]" />
								<span className="font-sans text-[14px] text-[#999999]">Search</span>
							</div>
						</div>

						<div className="px-6 pb-3">
							<p className="font-mono text-[11px] tracking-[0.06em] text-[#99a1af]">NAVIGATE</p>
						</div>

						<ul className="space-y-5 px-6 pb-8">
							<li>
								<Link
									href="/profile"
									onClick={() => setOpen(false)}
									className="block font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666]"
								>
									My Profile
								</Link>
							</li>
							<li>
								<Link
									href="/admin"
									onClick={() => setOpen(false)}
									className="block font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666]"
								>
									Admin Panel
								</Link>
							</li>
							<li>
								<Link
									href="/modules/deceptive-design"
									onClick={() => setOpen(false)}
									className="block font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666]"
								>
									Deceptive Design
								</Link>
							</li>
							<li className="pt-1">
								<LogoutButton
									redirectTo="/login"
									onLoggedOut={() => setOpen(false)}
									variant="ghost"
									className="h-auto justify-start p-0 font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666] hover:bg-transparent hover:text-[#444]"
								>
									Log out
								</LogoutButton>
							</li>
						</ul>
					</nav>
				</div>
			) : null}
		</>
	);
}

function ModuleTile({ label, title, background, badgeBackground, opacity, href }: DashboardTile) {
	const tile = (
		<div
			className="relative aspect-[164.68/189.99] overflow-hidden rounded-[18px] p-4 shadow-[4px_4px_2px_rgba(0,0,0,0.1)]"
			style={{ backgroundColor: background, opacity }}
		>
			<span
				className="inline-flex rounded-full px-2 py-0.5 font-mono text-[10px] font-bold leading-3.75 tracking-[0.04em] text-white"
				style={{ backgroundColor: badgeBackground }}
			>
				{label}
			</span>
			<div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/20" />
			<WelcomeMascot
				width={104}
				height={113}
				className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[-78%]"
			/>
			{title ? (
				<p className="absolute bottom-4 left-4 max-w-30 font-sans text-[16px] font-semibold leading-6 tracking-[-0.03em] text-white">
					{title}
				</p>
			) : null}
		</div>
	);

	if (href) {
		return (
			<Link href={href} className="block">
				{tile}
			</Link>
		);
	}

	return tile;
}

export default function DashboardPage() {
	return (
		<RequireSession>
			<main className="min-h-dvh w-full bg-white text-black">
				<section className="mx-auto min-h-dvh w-full max-w-107.5 bg-white">
					<header className="border-b border-[#f3f4f6] bg-[#eef1f4] px-6 py-4">
						<div className="flex items-center justify-between">
							<p className="font-sans text-[26px] font-bold lowercase leading-none tracking-[-0.04em] text-[#2b3b38]">
								impactful
							</p>
							<DashboardTopMenu />
						</div>
					</header>

					<div className="px-6 pb-10 pt-8">
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-4">
								<WelcomeMascot width={73} height={100} className="pointer-events-none shrink-0" />
								<div>
									<h1 className="font-sans text-[20px] font-bold leading-7.5 tracking-[-0.04em] text-[#2a3447]">
										Hi, Jane
									</h1>
									<p className="mt-1 font-sans text-[12px] leading-4.5 text-black/50">
										Let&apos;s learn something new!
									</p>
								</div>
							</div>
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0e6b7c] font-sans text-[14px] font-bold text-white">
								JD
							</div>
						</div>

						<div className="mt-5 flex h-12.75 items-center gap-3 rounded-[15px] bg-[#eef1f4] px-4">
							<Search className="h-4.5 w-4.5 text-black/40" />
							<span className="font-sans text-[16px] leading-6 text-black/40">Search modules</span>
						</div>

						<p className="pb-3 pt-6 font-sans text-[16px] font-semibold leading-6 text-black">Continue module</p>

						<Link
							href="/modules/deceptive-design"
							className="relative block overflow-hidden rounded-[18px] bg-[#08394d] px-5 py-5 text-white shadow-[4px_4px_2px_rgba(0,0,0,0.1)]"
						>
							<div className="absolute -left-8 -top-8 h-44 w-44 rounded-full bg-[#ff8d00] opacity-20" />
							<div className="relative">
								<p className="font-sans text-[30px] font-bold leading-[22.5px] tracking-[-0.03em]">Deceptive Design</p>
								<p className="mt-3 font-sans text-[8px] font-medium leading-3 text-white/60">Phase 1 | Cookie Consent</p>
								<div className="mt-4 flex items-center gap-3">
									<div className="h-0.75 flex-1 rounded-full bg-white/20">
										<div className="h-full w-1/5 rounded-full bg-[#ff8d00]" />
									</div>
									<span className="font-sans text-[7px] leading-2.5 text-white/60">20%</span>
									<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff8d00] text-[10px] text-white">▶</span>
								</div>
							</div>
						</Link>

						<p className="pb-3 pt-8 font-sans text-[16px] font-semibold leading-6 text-black">All Modules</p>

						<div className="grid grid-cols-2 gap-4">
							{moduleTiles.map((tile) => (
								<ModuleTile key={`${tile.label}-${tile.background}`} {...tile} />
							))}
						</div>
					</div>
				</section>
			</main>
		</RequireSession>
	);
}
