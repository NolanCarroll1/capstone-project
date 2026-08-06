"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { LogoutButton } from "../_components/LogoutButton";
import { RequireSession } from "../_components/RequireSession";
import { getSessionSnapshot, subscribeToSession } from "@/lib/auth/session";

type DashboardTile = {
	label: string;
	title?: string;
	background: string;
	badgeBackground: string;
	badgeTextColor: string;
	opacity: number;
	mascot: "live" | "soon";
	mascotLeft: number;
	mascotTop: number;
	href?: string;
};

const MODULE_TILE_BASE_WIDTH = 164.68;
const MODULE_TILE_BASE_HEIGHT = 189.99;
const MODULE_TILE_TITLE_WIDTH = (133 / MODULE_TILE_BASE_WIDTH) * 100;
const MODULE_TILE_PADDING_X = (16 / MODULE_TILE_BASE_WIDTH) * 100;
const MODULE_TILE_PADDING_BOTTOM = (16 / MODULE_TILE_BASE_HEIGHT) * 100;
const MODULE_TILE_HALO_LEFT = (76.69 / MODULE_TILE_BASE_WIDTH) * 100;
const MODULE_TILE_HALO_TOP = (-24 / MODULE_TILE_BASE_HEIGHT) * 100;
const MODULE_TILE_HALO_SIZE_W = (112 / MODULE_TILE_BASE_WIDTH) * 100;
const MODULE_TILE_HALO_SIZE_H = (112 / MODULE_TILE_BASE_HEIGHT) * 100;
const MODULE_TILE_BADGE_LEFT = (12 / MODULE_TILE_BASE_WIDTH) * 100;
const MODULE_TILE_BADGE_TOP = (12 / MODULE_TILE_BASE_HEIGHT) * 100;

const tileMascotAssets = {
	live: "/assets/figma-capstone/all-modules-live-mascot-node-1115-801-exact.png",
	soon: "/assets/figma-capstone/all-modules-soon-mascot-node-1115-806-exact.png",
} as const;

const moduleTiles: DashboardTile[] = [
	{
		label: "LIVE",
		title: "Deceptive Design",
		background: "#ff8d00",
		badgeBackground: "rgba(255,255,255,0.2)",
		badgeTextColor: "#ffffff",
		opacity: 1,
		mascot: "live",
		mascotLeft: 34,
		mascotTop: 31.93,
		href: "/modules/deceptive-design",
	},
	{
		label: "SOON",
		background: "#6b7280",
		badgeBackground: "rgba(0,0,0,0.2)",
		badgeTextColor: "rgba(255,255,255,0.8)",
		opacity: 0.7,
		mascot: "soon",
		mascotLeft: 32.32,
		mascotTop: 21.93,
	},
	{
		label: "SOON",
		background: "#7c3aed",
		badgeBackground: "rgba(0,0,0,0.2)",
		badgeTextColor: "rgba(255,255,255,0.8)",
		opacity: 0.7,
		mascot: "soon",
		mascotLeft: 32,
		mascotTop: 21.94,
	},
	{
		label: "SOON",
		background: "#0e9f6e",
		badgeBackground: "rgba(0,0,0,0.2)",
		badgeTextColor: "rgba(255,255,255,0.8)",
		opacity: 0.7,
		mascot: "soon",
		mascotLeft: 32.32,
		mascotTop: 21.94,
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

function getDisplayFirstName(name?: string, email?: string) {
	const nameParts = getNameParts(name);
	if (nameParts.length > 0) {
		return nameParts[0];
	}

	const emailChunks = getEmailChunks(email);
	if (emailChunks.length > 0) {
		return emailChunks[0];
	}

	return "there";
}

function getDisplayInitials(name?: string, email?: string, role?: "user" | "admin") {
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

	return role === "admin" ? "AD" : "US";
}

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
				src="/assets/figma-capstone/dashboard-welcome-mascot-node-1115-756.png"
				alt=""
				aria-hidden
				width={1536}
				height={1024}
				unoptimized
				className="pointer-events-none absolute max-w-none select-none"
				style={{
					height: "325.08%",
					width: "664.94%",
					left: "-564.94%",
					top: "-225.08%",
				}}
			/>
		</div>
	);
}

function DashboardTopMenu() {
	const [open, setOpen] = useState(false);
	const session = useSyncExternalStore(subscribeToSession, getSessionSnapshot, () => null);
	const canAccessAdmin = session?.role === "admin";

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
						className="absolute left-1/2 top-0 w-full max-w-screen-sm -translate-x-1/2 rounded-b-[28px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
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
							{canAccessAdmin ? (
								<li>
									<Link
										href="/admin"
										onClick={() => setOpen(false)}
										className="block font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666]"
									>
										Admin Panel
									</Link>
								</li>
							) : null}
							<li>
								<Link
									href="/dashboard"
									onClick={() => setOpen(false)}
									className="block font-sans text-[24px] font-normal leading-5 tracking-[-0.01em] text-[#666666]"
								>
									Dashboard
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

function ModuleTileMascot({
	variant,
	left,
	top,
}: {
	variant: DashboardTile["mascot"];
	left: number;
	top: number;
}) {
	const placement =
		variant === "live"
			? {
				src: tileMascotAssets.live,
				width: 99,
				height: 98,
				imageWidth: "672.11%",
				imageHeight: "451.11%",
				imageLeft: "-126.46%",
				imageTop: "-102.2%",
			}
			: {
				src: tileMascotAssets.soon,
				width: 104,
				height: 113,
				imageWidth: "436.36%",
				imageHeight: "269.47%",
				imageLeft: "-220.45%",
				imageTop: "-138.42%",
			};

	const mascotLeft = `${(left / MODULE_TILE_BASE_WIDTH) * 100}%`;
	const mascotTop = `${(top / MODULE_TILE_BASE_HEIGHT) * 100}%`;
	const mascotWidth = `${(placement.width / MODULE_TILE_BASE_WIDTH) * 100}%`;
	const mascotHeight = `${(placement.height / MODULE_TILE_BASE_HEIGHT) * 100}%`;

	return (
		<div
			className="pointer-events-none absolute overflow-hidden select-none"
			style={{
				left: mascotLeft,
				top: mascotTop,
				width: mascotWidth,
				height: mascotHeight,
			}}
		>
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<img
					src={placement.src}
					alt=""
					aria-hidden={true}
					className="absolute block max-w-none"
					style={{
						width: placement.imageWidth,
						height: placement.imageHeight,
						left: placement.imageLeft,
						top: placement.imageTop,
					}}
				/>
			</div>
		</div>
	);
}

function ModuleTile({
	label,
	title,
	background,
	badgeBackground,
	badgeTextColor,
	opacity,
	mascot,
	mascotLeft,
	mascotTop,
	href,
}: DashboardTile) {
	const tilePaddingX = `${MODULE_TILE_PADDING_X}%`;
	const tilePaddingBottom = `${MODULE_TILE_PADDING_BOTTOM}%`;
	const titleWidth = `${MODULE_TILE_TITLE_WIDTH}%`;
	const haloLeft = `${MODULE_TILE_HALO_LEFT}%`;
	const haloTop = `${MODULE_TILE_HALO_TOP}%`;
	const haloWidth = `${MODULE_TILE_HALO_SIZE_W}%`;
	const haloHeight = `${MODULE_TILE_HALO_SIZE_H}%`;
	const badgeLeft = `${MODULE_TILE_BADGE_LEFT}%`;
	const badgeTop = `${MODULE_TILE_BADGE_TOP}%`;

	const tile = (
		<div
			className="relative aspect-[164.68/189.99] w-full overflow-hidden rounded-[18px] shadow-[4px_4px_2px_rgba(0,0,0,0.1)]"
			style={{ backgroundColor: background, opacity }}
		>
			<div
				className="relative size-full overflow-hidden rounded-[inherit]"
				style={{ paddingInline: tilePaddingX, paddingBottom: tilePaddingBottom }}
			>
				<div className="flex h-full flex-col items-start justify-end">
					{title ? (
						<div className="relative w-full shrink-0">
							<div className="relative size-full">
								<p
									className="[word-break:break-word] font-sans text-[clamp(13px,1.06vw+9.6px,16px)] font-semibold leading-[1.5] text-white"
									style={{ width: titleWidth }}
								>
									{title}
								</p>
							</div>
						</div>
					) : (
						<div className="relative h-6 w-full shrink-0" aria-hidden />
					)}
				</div>

				<div
					className="absolute rounded-full bg-white/20"
					style={{ left: haloLeft, top: haloTop, width: haloWidth, height: haloHeight }}
				/>
				<div
					className="absolute rounded-full px-2 py-[2px]"
					style={{ left: badgeLeft, top: badgeTop, backgroundColor: badgeBackground }}
				>
					<p
						className="font-mono text-[10px] font-bold leading-[15px] tracking-[0.04em]"
						style={{ color: badgeTextColor }}
					>
						{label}
					</p>
				</div>
				<ModuleTileMascot variant={mascot} left={mascotLeft} top={mascotTop} />
			</div>
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
	const session = useSyncExternalStore(subscribeToSession, getSessionSnapshot, () => null);
	const greetingName = getDisplayFirstName(session?.name, session?.email);
	const initials = getDisplayInitials(session?.name, session?.email, session?.role);

	return (
		<RequireSession>
			<main className="min-h-dvh w-full bg-white text-black">
				<section className="mx-auto min-h-dvh w-full max-w-screen-sm bg-white">
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
							<DashboardTopMenu />
						</div>
					</header>

					<div className="px-6 pb-10 pt-8">
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-4">
								<WelcomeMascot width={73} height={100} className="pointer-events-none shrink-0" />
								<div>
									<h1 className="font-sans text-[20px] font-bold leading-7.5 tracking-[-0.04em] text-[#2a3447]">
										Hi, {greetingName}
									</h1>
									<p className="mt-1 font-sans text-[12px] leading-4.5 text-black/50">
										Let&apos;s learn something new!
									</p>
								</div>
							</div>
							<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0e6b7c] font-sans text-[14px] font-bold text-white">
								{initials}
							</div>
						</div>

						<div className="mt-5 flex h-12.75 items-center gap-3 rounded-[15px] bg-[#eef1f4] px-4">
							<Search className="h-4.5 w-4.5 text-black/40" />
							<span className="font-sans text-[16px] leading-6 text-black/40">Search modules</span>
						</div>

						<p className="pb-3 pt-6 font-sans text-[16px] font-semibold leading-6 text-black">Continue module</p>

						<Link
							href="/modules/deceptive-design"
							className="relative block h-[122.48px] overflow-hidden rounded-[18px] bg-[#08394d] text-white shadow-[4px_4px_2px_rgba(0,0,0,0.1)]"
						>
							<div className="absolute -left-8 -top-8 h-44 w-44 rounded-full bg-[#ff8d00] opacity-20" />
							<div className="relative flex h-full flex-col p-5">
								<p className="font-sans text-[15px] font-bold leading-[22.5px] text-white">Deceptive Design</p>
								<p className="pt-1 font-sans text-[8px] font-medium leading-3 text-white/60">Phase 1 | Cookie Consent</p>
								<div className="mt-auto flex items-center gap-3 pt-4">
									<div className="h-[2.997px] flex-1 rounded-full bg-white/20">
										<div className="h-full w-1/5 rounded-full bg-[#ff8d00]" />
									</div>
									<span className="font-sans text-[7px] font-light leading-[10.5px] text-white/60">20%</span>
									<span className="flex h-[27.99px] w-[27.99px] items-center justify-center rounded-full bg-[#ff8d00] text-[10px] text-white">▶</span>
								</div>
							</div>
						</Link>

						<p className="pb-0 pt-7 font-sans text-[16px] font-semibold leading-6 text-black">All Modules</p>

						<div className="grid grid-cols-2 gap-4 pt-3">
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
