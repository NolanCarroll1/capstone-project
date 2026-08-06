"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { LogoutButton } from "../../_components/LogoutButton";
import { getSessionSnapshot, subscribeToSession } from "@/lib/auth/session";

type ModuleInfo = {
	moduleLabel: string;
	description: string;
};

const moduleMap: Record<string, ModuleInfo> = {
	"deceptive-design": {
		moduleLabel: "DECEPTIVE DESIGN MODULE",
		description:
			"You’re in charge of a growing digital town. Every design choice you make shapes how your citizens experience their world.",
	},
};

const illustrationSrc = "/assets/figma-capstone/story-begins-house-node-1117-930.png";
const wordmarkSrc = "/assets/figma-capstone/story-begins-impactful-wordmark-node-1117-939.png";

function ModuleTopMenu() {
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

export default function ModuleStartPage() {
	const params = useParams<{ slug?: string }>();
	const slug = typeof params?.slug === "string" ? params.slug : "deceptive-design";
	const moduleInfo = moduleMap[slug] ?? moduleMap["deceptive-design"];
	const tutorialHref = `/modules/${slug}/tutorial`;

	return (
		<main className="min-h-dvh w-full bg-white text-black">
			<section className="mx-auto flex min-h-dvh w-full max-w-screen-sm flex-col bg-white">
				<header className="sticky top-0 z-30 border-b border-[#f3f4f6] bg-[#eef1f4] px-[clamp(16px,6vw,24px)] py-[clamp(12px,4vw,16px)]">
					<div className="flex items-center justify-between">
						<Image
							src={wordmarkSrc}
							alt="Impactful"
							width={107}
							height={48}
							unoptimized
							className="h-[clamp(38px,11vw,48px)] w-auto object-contain"
						/>
						<ModuleTopMenu />
					</div>
				</header>

				<div className="flex flex-1 flex-col px-[clamp(16px,6vw,24px)] pb-[clamp(24px,8vw,40px)] pt-[clamp(16px,5vw,24px)]">
					<Link
						href="/dashboard"
						className="inline-flex w-fit items-center gap-2 font-mono text-[clamp(12px,3.6vw,14px)] font-medium leading-5 text-[#99a1af]"
					>
						<span aria-hidden>←</span>
						BACK
					</Link>

					<div className="flex flex-1 flex-col items-center justify-center pt-[clamp(8px,2.8vh,16px)] [@media(max-height:700px)]:justify-start [@media(max-height:700px)]:pt-3">
						<Image
							src={illustrationSrc}
							alt=""
							aria-hidden
							width={266}
							height={266}
							unoptimized
							className="h-auto w-full max-w-[clamp(200px,62vw,266px)] shrink-0 object-cover"
						/>

						<p className="mt-[clamp(14px,4.6vh,40px)] font-mono text-center text-[clamp(11px,3vw,12px)] font-bold leading-4 tracking-[0.1em] text-[#99a1af]">
							{moduleInfo.moduleLabel}
						</p>

						<h1 className="mt-[clamp(12px,3vh,24px)] text-center font-sans text-[clamp(30px,9vw,36px)] font-bold leading-tight tracking-[-0.03em] text-black">
							Your Story
							<br />
							Begins
						</h1>

						<p className="mt-[clamp(12px,3vh,24px)] max-w-[346px] text-center font-sans text-[clamp(14px,3.8vw,15px)] leading-relaxed text-[#6a7282]">
							{moduleInfo.description}
						</p>
					</div>

					<div>
						<Link
							href={tutorialHref}
							className="flex h-[clamp(52px,14vw,56px)] w-full items-center justify-center rounded-full bg-[#ff8d00] font-sans text-[clamp(15px,4.2vw,16px)] font-bold leading-6 text-white shadow-[0_4px_0_#b46300]"
						>
							Begin Your Story
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}