"use client";

import Link from "next/link";
import { MobileBottomNav } from "../_components/MobileBottomNav";

const moduleCards = [
	{
		href: "/modules/deceptive-design",
		label: "LIVE",
		title: "Deceptive Design",
		variant: "live" as const,
	},
	{
		label: "SOON",
		title: "Community Listening",
		variant: "soon" as const,
	},
	{
		label: "SOON",
		title: "Ethical Storytelling",
		variant: "soon" as const,
	},
	{
		label: "SOON",
		title: "Advocacy 101",
		variant: "soon" as const,
	},
] as const;

function ModuleCard({ card }: { card: (typeof moduleCards)[number] }) {
	const isLive = card.variant === "live";
	const content = (
		<div
			className={`flex aspect-156/200 w-full flex-col justify-between rounded-2xl p-[clamp(16px,4vw,24px)] ${
				isLive ? "bg-black text-white" : "bg-[#f3f4f6] text-black opacity-60"
			}`}
		>
			<span
				className={`inline-flex w-fit px-[clamp(10px,2.8vw,12px)] py-[clamp(4px,1vw,4px)] font-sans text-[clamp(10px,2.5vw,12px)] font-bold uppercase tracking-widest ${
					isLive ? "bg-white text-black" : "bg-[#d1d5dc] text-[#364153]"
				}`}
			>
				{card.label}
			</span>
			<p
				className={`max-w-[8.8rem] font-sans text-[clamp(17px,4.5vw,20px)] font-bold leading-[1.12] tracking-[-0.04em] ${
					isLive ? "text-white" : "text-[#111827]"
				}`}
			>
				{card.title}
			</p>
		</div>
	);

	if (isLive && card.href) {
		return (
			<Link href={card.href} className="block">
				{content}
			</Link>
		);
	}

	return content;
}

export default function DashboardPage() {
	return (
			<main className="min-h-dvh w-full overflow-hidden bg-white pb-28 text-black">
				<section className="flex min-h-dvh w-full flex-col bg-white text-black">
					<header className="bg-black px-[clamp(24px,8vw,32px)] pb-[clamp(28px,7vw,40px)] pt-[clamp(28px,7vw,40px)] text-white">
						<div className="pt-[clamp(24px,12vw,48px)]">
							<div className="flex items-center justify-between gap-3">
								<p className="font-sans text-[clamp(11px,2.8vw,12px)] font-semibold uppercase tracking-[1.2px] text-[#99a1af]">
									WELCOME
								</p>
								<Link
									href="/profile"
									className="font-mono text-[clamp(11px,2.8vw,12px)] uppercase tracking-[0.14em] text-[#99a1af]"
								>
									PROFILE →
								</Link>
							</div>
							<h1 className="mt-[clamp(16px,4.5vw,20px)] font-sans text-[clamp(42px,12vw,48px)] font-bold leading-[1.03] tracking-[-0.06em] text-white">
								Impact
								<br />
								<span className="text-[#99a1af]">Starts Here</span>
							</h1>
							<p className="mt-[clamp(16px,4vw,20px)] max-w-[20.6rem] font-sans text-[clamp(15px,4vw,16px)] leading-[1.62] text-[#99a1af]">
								A growing library of training modules to help fellows build the skills, ethics,
								and digital fluency to drive real social change.
							</p>
							<div className="mt-[clamp(36px,9vw,48px)] flex items-center gap-[clamp(12px,4vw,24px)] font-sans text-[clamp(11px,2.8vw,12px)] uppercase tracking-[0.08em] text-[#6a7282]">
								<span>5 phases per module</span>
								<span className="text-[#3f4654]">·</span>
								<span>10+ scenarios</span>
							</div>
						</div>
					</header>

					<section className="flex-1 bg-white px-[clamp(24px,8vw,32px)] py-[clamp(24px,7vw,40px)] text-black">
						<div className="flex items-end justify-between gap-4">
							<div>
								<p className="font-sans text-[clamp(11px,2.8vw,12px)] font-semibold uppercase tracking-[1.2px] text-[#6a7282]">
									MODULES
								</p>
								<h2 className="mt-2 font-sans text-[clamp(22px,6vw,24px)] font-bold leading-[1.05] tracking-tighter text-black">
									Choose your training
								</h2>
							</div>
							<p className="pb-1 font-sans text-[clamp(11px,2.8vw,12px)] font-bold uppercase tracking-[0.08em] text-[#99a1af]">
								1 OF 9 LIVE
							</p>
						</div>

						<div className="mt-[clamp(24px,6vw,32px)] grid grid-cols-2 gap-[clamp(12px,4vw,16px)]">
							{moduleCards.map((card) => (
								<ModuleCard key={card.title} card={card} />
							))}
						</div>
					</section>
				</section>

				<MobileBottomNav />
			</main>
	);
}