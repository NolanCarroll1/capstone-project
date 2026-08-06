"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReducer, useRef, useState, useSyncExternalStore } from "react";

import { LogoutButton } from "@/app/_components/LogoutButton";
import { getSessionSnapshot, subscribeToSession } from "@/lib/auth/session";

type StatKey = "trust" | "revenue" | "population";
type Phase = 1 | 2 | 3 | 4 | 5;
type ChoiceKey = "A" | "B" | "C";

type GameState = {
	trust: number;
	revenue: number;
	population: number;
	choiceCount: number;
	phase: Phase;
	complete: boolean;
};

type StatDelta = Partial<Record<StatKey, number>>;

type Choice = {
	id: ChoiceKey;
	name: string;
	title: string;
	description: string;
	preview: string;
	delta: StatDelta;
};

type RoundConfig = {
	phase: Phase;
	phaseLabel: string;
	scenarioTitle: string;
	scenarioDescription: string;
	callout: string;
	choices: Choice[];
};

type Action =
	| {
			type: "apply-choice";
			delta: StatDelta;
	  }
	| {
			type: "reset";
	  };

const wordmarkSrc = "/assets/figma-capstone/story-begins-impactful-wordmark-node-1117-939.png";
const topMascotSrc = "/assets/figma-capstone/tutorial-top-mascot-node-1118-1896.png";

const initialState: GameState = {
	trust: 50,
	revenue: 1000,
	population: 500,
	choiceCount: 0,
	phase: 1,
	complete: false,
};

const rounds: RoundConfig[] = [
	{
		phase: 1,
		phaseLabel: "PHASE 1 OF 5",
		scenarioTitle: "Cookie Consent",
		scenarioDescription:
			"Your town's digital marketplace is launching. Every visit needs a cookie consent experience. How should it work?",
		callout:
			"Advertisers want tracking data. Citizens value privacy. This is their first interaction with your town.",
		choices: [
			{
				id: "A",
				name: "OPTION A",
				title: "Transparent Consent",
				description:
					"Equal-sized Accept and Decline buttons with plain-language explanation. Citizens choose freely.",
				preview:
					"We use cookies\n\nWe collect browsing data to improve your experience. You choose what to share.",
				delta: { trust: 8, revenue: -20, population: 4 },
			},
			{
				id: "B",
				name: "OPTION B",
				title: "Quick Notice",
				description:
					"A compact banner with Accept up front and a 'Manage Preferences' link for those who dig deeper.",
				preview: "We use cookies to improve your experience.",
				delta: { trust: -2, revenue: 14, population: 2 },
			},
			{
				id: "C",
				name: "OPTION C",
				title: "Full Coverage",
				description:
					"A full-screen overlay ensures every visitor makes a choice. The accept option is optimized for conversion.",
				preview: "Cookie Policy\nsettings - privacy",
				delta: { trust: -12, revenue: 45, population: -6 },
			},
		],
	},
	{
		phase: 2,
		phaseLabel: "PHASE 2 OF 5",
		scenarioTitle: "Marketplace Membership",
		scenarioDescription:
			"Citizens need memberships to use the marketplace. How detailed should the process be?",
		callout:
			"More data means better personalization, but friction at signup drives citizens away before they even start.",
		choices: [
			{
				id: "A",
				name: "OPTION A",
				title: "Quick Start",
				description:
					"Email and password only. Everything else is optional and can be added later.",
				preview: "Quick start\n\nMinimal signup fields with an optional profile setup later.",
				delta: { trust: 5, revenue: 10, population: 6 },
			},
			{
				id: "B",
				name: "OPTION B",
				title: "Guided Setup",
				description:
					"A multi-step wizard that collects info gradually. Feels friendly, gets good data.",
				preview: "Guided setup\n\nStep-by-step membership flow with gentle prompts.",
				delta: { trust: 2, revenue: 18, population: 4 },
			},
			{
				id: "C",
				name: "OPTION C",
				title: "Social Login",
				description:
					"Only allow signup through social media accounts. Maximizes data collection with minimal friction.",
				preview: "Social login\n\nFast signup through existing social accounts.",
				delta: { trust: -6, revenue: 28, population: 3 },
			},
		],
	},
	{
		phase: 3,
		phaseLabel: "PHASE 3 OF 5",
		scenarioTitle: "Re-Engagement",
		scenarioDescription:
			"Citizens who declined notifications before - should you ask them again?",
		callout:
			"Notifications drive traffic, but repeated prompts erode the trust you already have with these citizens.",
		choices: [
			{
				id: "A",
				name: "OPTION A",
				title: "Respect the No",
				description:
					"If a citizen declined, don't ask again. Make the option available in settings for those who change their minds.",
				preview: "Respect the no\n\nNotification requests stay off unless a user re-enables them.",
				delta: { trust: 8, revenue: -6, population: 2 },
			},
			{
				id: "B",
				name: "OPTION B",
				title: "Gentle Reminder",
				description:
					"After 30 days, show a non-intrusive banner suggesting notifications. Once per month maximum.",
				preview: "Gentle reminder\n\nA soft follow-up after a cooling-off period.",
				delta: { trust: 2, revenue: 10, population: 3 },
			},
			{
				id: "C",
				name: "OPTION C",
				title: "Persistent Prompts",
				description:
					"Show notification prompts on every visit with increasingly urgent language. Make them hard to dismiss.",
				preview: "Persistent prompts\n\nRepeated requests with stronger wording over time.",
				delta: { trust: -10, revenue: 24, population: -5 },
			},
		],
	},
	{
		phase: 4,
		phaseLabel: "PHASE 4 OF 5",
		scenarioTitle: "Marketplace Marketing",
		scenarioDescription:
			"Your engagement data shows citizens are spending less time on the marketplace. How do you bring them back?",
		callout:
			"Declining time-on-site means lower ad revenue. But dark patterns can permanently damage citizen trust.",
		choices: [
			{
				id: "A",
				name: "OPTION A",
				title: "Better Content",
				description:
					"Invest in curating higher-quality listings and genuine community features instead of attention tricks.",
				preview: "Better content\n\nFocus on value, not manipulation.",
				delta: { trust: 9, revenue: -14, population: 8 },
			},
			{
				id: "B",
				name: "OPTION B",
				title: "Gamification",
				description:
					"Add streaks, points, and rewards for daily visits. Give citizens a reason to return.",
				preview: "Gamification\n\nStreaks and points nudge repeat visits.",
				delta: { trust: 0, revenue: 18, population: 6 },
			},
			{
				id: "C",
				name: "OPTION C",
				title: "FOMO Engine",
				description:
					"Create artificial scarcity, fake timers, and manipulated social proof to drive compulsive checking.",
				preview: "FOMO engine\n\nUrgent timers and scarcity messaging.",
				delta: { trust: -14, revenue: 34, population: -7 },
			},
		],
	},
	{
		phase: 5,
		phaseLabel: "PHASE 5 OF 5",
		scenarioTitle: "Checkout Experience",
		scenarioDescription:
			"Citizens are buying from your marketplace. Design the checkout flow.",
		callout:
			"Hidden fees boost short-term revenue but destroy the trust citizens place in your marketplace.",
		choices: [
			{
				id: "A",
				name: "OPTION A",
				title: "Transparent Checkout",
				description:
					"Show all costs upfront. Tax, shipping, and fees visible from the start. No surprises at the last step.",
				preview: "Transparent checkout\n\nEverything is shown before payment.",
				delta: { trust: 14, revenue: -12, population: 10 },
			},
			{
				id: "B",
				name: "OPTION B",
				title: "Progressive Disclosure",
				description:
					"Show item prices upfront. Calculate shipping and tax after entering the address, before final confirmation.",
				preview: "Progressive disclosure\n\nCosts appear step by step.",
				delta: { trust: 1, revenue: 18, population: 4 },
			},
			{
				id: "C",
				name: "OPTION C",
				title: "Drip Pricing",
				description:
					"Show a low initial price. Add fees gradually through the checkout: service fee, processing fee, handling fee.",
				preview: "Drip pricing\n\nA low price that grows with fees.",
				delta: { trust: -16, revenue: 40, population: -8 },
			},
		],
	},
];

function clampStat(value: number) {
	return Math.max(0, value);
}

function gameReducer(state: GameState, action: Action): GameState {
	switch (action.type) {
		case "apply-choice": {
			if (state.complete) {
				return state;
			}

			const nextPhase = state.phase < 5 ? ((state.phase + 1) as Phase) : state.phase;
			const nextChoiceCount = state.choiceCount + 1;

			return {
				trust: clampStat(state.trust + (action.delta.trust ?? 0)),
				revenue: clampStat(state.revenue + (action.delta.revenue ?? 0)),
				population: clampStat(state.population + (action.delta.population ?? 0)),
				choiceCount: nextChoiceCount,
				phase: nextPhase,
				complete: state.phase === 5,
			};
		}
		case "reset":
			return initialState;
		default:
			return state;
	}
}

function GameTopMenu() {
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
						aria-label="Game navigation"
						onClick={(event) => event.stopPropagation()}
						className="absolute left-1/2 top-0 w-full max-w-[430px] -translate-x-1/2 rounded-b-[28px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
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

function ChoiceCard({
	choice,
	phase,
	isSelected,
	onSelect,
	reference,
}: {
	choice: Choice;
	phase: Phase;
	isSelected: boolean;
	onSelect: () => void;
	reference: (node: HTMLButtonElement | null) => void;
}) {
	const previewContent = (() => {
		if (phase === 5) {
			switch (choice.id) {
				case "A":
					return (
						<>
							<p className="font-sans text-[12px] font-bold leading-4 text-black">Order Summary</p>
							<div className="mt-3 space-y-2 border-b border-[#f3f4f6] pb-2">
								<div className="flex items-center justify-between">
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">Item total</span>
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">$24.00</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">Shipping</span>
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">$3.50</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">Tax</span>
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">$1.92</span>
								</div>
							</div>
							<div className="mt-2 flex items-center justify-between">
								<span className="font-sans text-[12px] font-bold leading-4 text-black">Total</span>
								<span className="font-sans text-[12px] font-bold leading-4 text-black">$29.42</span>
							</div>
							<div className="mt-3 rounded-[4px] bg-[#85d79a] py-2 text-center font-sans text-[12px] font-bold text-[#186620]">Confirm Order</div>
						</>
					);
				case "B":
					return (
						<>
							<div className="flex items-center justify-between border-b border-[#f3f4f6] pb-2">
								<span className="font-sans text-[12px] leading-4 text-[#6a7282]">Items</span>
								<span className="font-sans text-[12px] leading-4 text-[#6a7282]">$24.00</span>
							</div>
							<div className="mt-3 rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] p-3">
								<p className="font-sans text-[12px] leading-4 text-[#99a1af]">Enter address to calculate shipping &amp; tax</p>
								<div className="mt-2 rounded-[12px] border border-[#d1d5dc] px-3 py-2 font-sans text-[12px] leading-4 text-[#99a1af]">Street address</div>
							</div>
							<div className="mt-3 rounded-[4px] bg-[#d9f0f7] py-2 text-center font-sans text-[12px] font-bold text-[#004b6a]">Calculate &amp; Continue</div>
						</>
					);
				case "C":
					return (
						<>
							<div className="flex items-center justify-between border-b border-[#f3f4f6] pb-2">
								<span className="font-sans text-[12px] leading-4 text-[#6a7282]">Item</span>
								<span className="font-sans text-[12px] font-bold leading-4 text-black">$24.00</span>
							</div>
							<div className="mt-3 space-y-2 border-b border-[#f3f4f6] pb-2">
								<div className="flex items-center justify-between">
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">Service fee</span>
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">+$2.40</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">Processing fee</span>
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">+$1.20</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">Handling fee</span>
									<span className="font-sans text-[12px] leading-4 text-[#6a7282]">+$1.50</span>
								</div>
							</div>
							<div className="mt-2 flex items-center justify-between">
								<span className="font-sans text-[12px] font-bold leading-4 text-black">Total</span>
								<span className="font-sans text-[12px] font-bold leading-4 text-black">$29.10</span>
							</div>
						</>
					);
				default:
					return null;
			}
		}

		if (phase === 4) {
			switch (choice.id) {
				case "A":
					return (
						<>
							<p className="font-sans text-[12px] font-bold leading-4 text-black">Curated for you</p>
							<div className="mt-3 space-y-2">
								<div className="flex items-center gap-2 border-b border-[#f3f4f6] pb-2">
									<div className="h-8 w-8 rounded-[14px] bg-[#f3f4f6]" />
									<p className="font-sans text-[12px] leading-4 text-[#364153]">Local Artisan Goods</p>
								</div>
								<div className="flex items-center gap-2 border-b border-[#f3f4f6] pb-2">
									<div className="h-8 w-8 rounded-[14px] bg-[#f3f4f6]" />
									<p className="font-sans text-[12px] leading-4 text-[#364153]">Community Picks</p>
								</div>
								<div className="flex items-center gap-2 border-b border-[#f3f4f6] pb-2">
									<div className="h-8 w-8 rounded-[14px] bg-[#f3f4f6]" />
									<p className="font-sans text-[12px] leading-4 text-[#364153]">New This Week</p>
								</div>
							</div>
						</>
					);
				case "B":
					return (
						<>
							<div className="flex items-center justify-between">
								<p className="font-sans text-[12px] font-bold leading-4 text-black">Your Streak</p>
								<p className="font-sans text-[12px] font-bold leading-4 text-black">7 days</p>
							</div>
							<div className="mt-3 grid grid-cols-7 gap-1">
								{Array.from({ length: 7 }).map((_, i) => (
									<div key={i} className="h-6 rounded-[10px] bg-[#ff8d00]" />
								))}
							</div>
							<div className="mt-3 rounded-[4px] bg-[#d9f0f7] px-3 py-2 text-center font-sans text-[12px] font-semibold leading-4 text-[#004b6a]">
								250 pts - Redeem
							</div>
						</>
					);
				case "C":
					return (
						<>
							<div className="rounded-[14px] border border-[#e5e7eb] px-[12.609px] py-[12px]">
								<p className="font-sans text-[12px] font-bold leading-4 text-black">Only 2 left in stock!</p>
								<div className="mt-2 flex items-center gap-2">
									<span className="h-2 w-2 rounded-full bg-[#99a1af]" />
									<p className="font-sans text-[12px] leading-4 text-[#4a5565]">47 people viewing this now</p>
								</div>
								<div className="mt-2 flex items-center gap-2">
									<p className="font-sans text-[12px] font-bold leading-4 text-[#6a7282]">Offer ends in:</p>
									<span className="rounded-full bg-black px-2 py-0.5 font-sans text-[12px] font-bold leading-4 text-white">09:59</span>
								</div>
							</div>
						</>
					);
				default:
					return null;
			}
		}

		if (phase === 3) {
			switch (choice.id) {
				case "A":
					return (
						<>
							<p className="font-sans text-[12px] leading-4 text-[#4a5565]">Notification preference saved.</p>
							<p className="mt-3 font-sans text-[12px] leading-4 text-[#6a7282]">
								You can update this anytime in <span className="underline">Settings -&gt; Notifications</span>.
							</p>
							<div className="mt-3 rounded-[4px] bg-[#dcf5e3] py-2 text-center font-sans text-[12px] font-bold text-[#186620]">Got it</div>
						</>
					);
				case "B":
					return (
						<>
							<div className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] p-[12.609px]">
								<div className="flex items-start gap-2">
									<p className="flex-1 font-sans text-[12px] leading-4 text-[#364153]">Stay updated - turn on notifications?</p>
									<div className="flex shrink-0 items-center gap-2">
										<span className="font-sans text-[16px] font-medium leading-6 text-[#99a1af]">Later</span>
										<span className="font-sans text-[16px] font-bold leading-6 text-black">Yes</span>
									</div>
								</div>
							</div>
							<p className="mt-3 text-center font-sans text-[12px] leading-4 text-[#99a1af]">Shown once a month</p>
						</>
					);
				case "C":
					return (
						<>
							<div className="w-full rounded-[14px] px-[clamp(10px,3vw,12px)] pb-[clamp(6px,2vw,8px)] pt-[clamp(8px,2.6vw,12px)]">
								<p className="font-sans text-[12px] font-bold leading-4 text-[#121212]">⚠️ You are missing important updates!</p>
								<p className="mt-[clamp(6px,1.8vw,8px)] font-sans text-[12px] leading-4 text-[#6a7282]">Enable notifications NOW to stay informed.</p>
								<div className="mt-[clamp(10px,3vw,12px)] rounded-full bg-white py-[clamp(6px,2vw,8px)] text-center font-sans text-[clamp(14px,4.2vw,16px)] font-bold leading-6 text-black">
									Allow Notifications
								</div>
								<p className="mt-[clamp(6px,1.8vw,8px)] text-center font-sans text-[12px] leading-4 text-[#6a7282]">x Maybe later (limited)</p>
							</div>
						</>
					);
				default:
					return null;
			}
		}

		if (phase === 2) {
			switch (choice.id) {
				case "A":
					return (
						<>
							<p className="font-sans text-[12px] font-bold leading-4 text-black">Create your account</p>
							<div className="mt-3 rounded-[14px] border border-[#d1d5dc] px-[12.609px] py-[8.609px] font-sans text-[12px] leading-4 text-[#99a1af]">Email address</div>
							<div className="mt-2 rounded-[14px] border border-[#d1d5dc] px-[12.609px] py-[8.609px] font-sans text-[12px] leading-4 text-[#99a1af]">Password</div>
							<div className="mt-3 rounded-[4px] bg-[#85d79a] py-2 text-center font-sans text-[12px] font-bold text-[#0f6826]">Join Now</div>
						</>
					);
				case "B":
					return (
						<>
							<div className="flex gap-1">
								<span className="h-1 w-full rounded-full bg-black" />
								<span className="h-1 w-full rounded-full bg-[#e5e7eb]" />
								<span className="h-1 w-full rounded-full bg-[#e5e7eb]" />
							</div>
							<p className="mt-2 font-sans text-[12px] font-bold leading-4 text-black">Step 1 of 3 - Basic Info</p>
							<div className="mt-3 rounded-[14px] border border-[#d1d5dc] px-[12.609px] py-[8.609px] font-sans text-[12px] leading-4 text-[#99a1af]">Full name</div>
							<div className="mt-3 rounded-[4px] bg-[#d9f0f7] py-2 text-center font-sans text-[12px] font-bold text-[#004b6a]">Continue -&gt;</div>
						</>
					);
				case "C":
					return (
						<>
							<p className="font-sans text-[12px] font-bold leading-4 text-black">Sign in to continue</p>
							<div className="mt-3 border border-[#d1d5dc] py-[8.609px] text-center font-sans text-[12px] leading-4 text-[#364153]">Continue with Google</div>
							<div className="mt-2 border border-[#d1d5dc] py-[8.609px] text-center font-sans text-[12px] leading-4 text-[#364153]">Continue with Facebook</div>
							<p className="mt-2 text-center font-sans text-[12px] leading-4 text-[#99a1af]">No email signup available</p>
						</>
					);
				default:
					return null;
			}
		}

		switch (choice.id) {
			case "A":
				return (
					<>
						<p className="font-sans text-[12px] font-bold leading-4 text-black">We use cookies</p>
						<p className="mt-3 font-sans text-[12px] leading-4 text-[#6a7282]">
							We collect browsing data to improve your experience. You choose what to share.
						</p>
						<div className="mt-3 grid grid-cols-2 gap-3">
							<div className="rounded-[4px] bg-[#85d79a] py-2 text-center font-sans text-[12px] font-bold text-[#0f6826]">Accept</div>
							<div className="rounded-[4px] bg-[#ffe0d7] py-2 text-center font-sans text-[12px] font-bold text-[#9f2600]">Decline</div>
						</div>
					</>
				);
			case "B":
				return (
					<>
						<p className="font-sans text-[12px] font-bold leading-4 text-black">Preview</p>
						<p className="mt-3 font-sans text-[12px] leading-4 text-[#6a7282]">We use cookies to improve your experience.</p>
						<div className="mt-3 grid grid-cols-2 gap-3">
							<div className="rounded-[4px] bg-[#dcf5e3] py-2 text-center font-sans text-[12px] font-bold text-[#186620]">Accept</div>
							<div className="rounded-[4px] bg-[#d9f0f7] py-2 text-center font-sans text-[12px] font-bold text-[#004b6a]">Learn More</div>
						</div>
					</>
				);
			case "C":
				return (
					<>
						<p className="font-sans text-[12px] font-bold leading-4 text-[#08394d]">Cookie Policy</p>
						<p className="mt-3 text-center font-sans text-[12px] leading-4 text-[#6a7282]">settings - privacy</p>
						<div className="mt-3 rounded-[4px] bg-[#d9f0f7] py-2 text-center font-sans text-[12px] font-bold text-[#004b6a]">Accept All</div>
					</>
				);
			default:
				return null;
		}
	})();

	return (
		<button
			type="button"
			ref={reference}
			onClick={onSelect}
			className="relative w-[calc(100vw-56px)] max-w-[360px] shrink-0 snap-center rounded-[24px] border-2 bg-white p-[clamp(18px,5.6vw,26px)] text-left transition-all"
			style={{
				borderColor: isSelected ? "#acb101" : "#f1f3f6",
				boxShadow: isSelected ? "0px 4px 0px #acb101" : "0px 4px 0px #eff1f5",
			}}
		>
			{isSelected ? (
				<span className="absolute right-[clamp(10px,3.4vw,16px)] top-[clamp(10px,3.4vw,16px)] inline-flex h-[clamp(20px,6vw,24px)] w-[clamp(20px,6vw,24px)] items-center justify-center rounded-full bg-[#acb101] text-[clamp(10px,3vw,12px)] font-bold text-white">
					✓
				</span>
			) : null}

			<div className="flex items-start justify-between gap-3">
				<p className="font-mono text-[clamp(20px,6vw,22px)] font-bold leading-[1.2] text-[#121212]">{choice.name}</p>
			</div>

			<div>
				<p className="font-sans text-[clamp(14px,4.3vw,16px)] leading-[1.4] text-[#08394d]">{choice.description}</p>
			</div>

			<div
				className="mt-[clamp(12px,3.8vw,20px)] border-2 bg-white p-[clamp(10px,3.4vw,12px)]"
				style={{
					borderColor: isSelected ? "#acb101" : "#d7dae0",
					boxShadow: isSelected ? "inset 0px 4px 0px #acb101" : "inset 0px 4px 0px #c9ced6",
				}}
			>
				{previewContent}
			</div>
		</button>
	);
}

type GameScreenProps = {
	moduleSlug?: string;
};

export function GameScreen({ moduleSlug = "deceptive-design" }: GameScreenProps) {
	const router = useRouter();
	const [state, dispatch] = useReducer(gameReducer, initialState);
	const optionsScrollerRef = useRef<HTMLDivElement | null>(null);
	const [selectedChoiceByPhase, setSelectedChoiceByPhase] = useState<Record<Phase, ChoiceKey | null>>({
		1: null,
		2: null,
		3: null,
		4: null,
		5: null,
	});
	const choiceRefs = useRef<Record<ChoiceKey, HTMLButtonElement | null>>({
		A: null,
		B: null,
		C: null,
	});

	const currentRound = rounds[state.phase - 1];
	const selectedChoiceId = selectedChoiceByPhase[state.phase];
	const selectedChoice = currentRound.choices.find((choice) => choice.id === selectedChoiceId) ?? null;
	const isComplete = state.complete;

	const selectChoice = (choiceId: ChoiceKey) => {
		setSelectedChoiceByPhase((current) => {
			const currentChoice = current[state.phase];
			const nextChoice = currentChoice === choiceId ? null : choiceId;

			if (nextChoice) {
				choiceRefs.current[nextChoice]?.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "center",
				});
			}

			return { ...current, [state.phase]: nextChoice };
		});
	};

	const confirmChoice = () => {
		if (!selectedChoice || isComplete) {
			return;
		}

		const nextTrust = clampStat(state.trust + (selectedChoice.delta.trust ?? 0));
		const nextRevenue = clampStat(state.revenue + (selectedChoice.delta.revenue ?? 0));
		const nextPopulation = clampStat(state.population + (selectedChoice.delta.population ?? 0));
		const nextChoiceCount = state.choiceCount + 1;
		const nextPhase = state.phase < 5 ? ((state.phase + 1) as Phase) : state.phase;

		dispatch({ type: "apply-choice", delta: selectedChoice.delta });
		setSelectedChoiceByPhase((current) => ({ ...current, [nextPhase]: null }));
		window.scrollTo({ top: 0, behavior: "smooth" });
		requestAnimationFrame(() => {
			optionsScrollerRef.current?.scrollTo({ left: 0, behavior: "auto" });
		});

		if (state.phase === 5) {
			router.push(
				`/modules/${moduleSlug}/stats?trust=${nextTrust}&revenue=${nextRevenue}&population=${nextPopulation}&choiceCount=${nextChoiceCount}`,
			);
		}
	};

	return (
		<main className="min-h-dvh w-full bg-[#f1f3f5] text-black">
			<section className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white">
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
						<GameTopMenu />
					</div>
				</header>

				<div className="flex-1 px-[clamp(16px,5.4vw,24px)] pb-[clamp(16px,6vw,32px)] pt-[clamp(12px,4vw,20px)] [@media(max-height:720px)]:pb-4 [@media(max-height:720px)]:pt-3">
					<div className="flex items-center justify-between gap-4">
						<p className="font-sans text-[12px] font-bold tracking-[0.1em] text-[#6a7282]">{currentRound.phaseLabel}</p>
						<div className="flex gap-1.5">
							{rounds.map((round) => (
								<span
									key={round.phase}
									className={`h-1.5 rounded-full ${round.phase <= state.phase ? "w-5 bg-[#08394d]" : "w-1.5 bg-[#d1d5db]"}`}
								/>
							))}
						</div>
					</div>

					<p className="mt-[clamp(12px,3.6vw,20px)] font-mono text-[11px] font-bold tracking-[0.08em] text-[#99a1af]">SCENARIO</p>

					<div className="mt-2 flex items-start gap-[clamp(8px,2.8vw,12px)]">
						<div className="relative h-[clamp(116px,37vw,160px)] w-[clamp(84px,27vw,117px)] shrink-0 overflow-hidden">
							<Image
								src={topMascotSrc}
								alt=""
								aria-hidden
								width={778}
								height={520}
								unoptimized
								className="absolute max-w-none"
								style={{ width: "664.94%", height: "325.08%", left: "-564.94%", top: "-225.08%" }}
							/>
						</div>

						<div className="rounded-[20px] bg-[rgba(255,141,0,0.24)] px-[clamp(12px,4vw,20px)] py-[clamp(12px,3.8vw,16px)]">
							<p className="font-sans text-[clamp(14px,4.2vw,15px)] font-bold leading-[1.52] text-[#1e1c1c]">
								{currentRound.scenarioDescription}
							</p>
						</div>
					</div>

					<div ref={optionsScrollerRef} className="-mx-[clamp(16px,5.4vw,24px)] mt-[clamp(14px,4vw,24px)] overflow-x-auto px-[clamp(16px,5.4vw,24px)] pb-[clamp(10px,3.2vw,16px)] scrollbar-none">
						<div className="flex snap-x snap-mandatory gap-4">
							{currentRound.choices.map((choice) => (
								<ChoiceCard
									key={choice.id}
									choice={choice}
									phase={state.phase}
									isSelected={choice.id === selectedChoiceId}
									onSelect={() => selectChoice(choice.id)}
									reference={(node) => {
										choiceRefs.current[choice.id] = node;
									}}
								/>
							))}
							<div
								aria-hidden
								className="shrink-0"
								style={{ width: "calc((100% - min(360px, calc(100vw - 56px))) / 2)" }}
							/>
						</div>
					</div>

					<div className="mt-[clamp(8px,2.8vw,12px)] flex items-center justify-center gap-[clamp(10px,3.2vw,16px)]">
						{currentRound.choices.map((choice) => {
							const selected = choice.id === selectedChoiceId;
							return (
								<button
									key={choice.id}
									type="button"
									onClick={() => selectChoice(choice.id)}
									className={`flex h-[clamp(36px,10vw,40px)] w-[clamp(36px,10vw,40px)] items-center justify-center rounded-full font-mono text-[clamp(13px,3.8vw,14px)] font-bold transition-colors ${
										selected ? "bg-[#acb101] text-white" : "bg-[#e5e7eb] text-[#9ca3af]"
									}`}
								>
									{choice.id}
								</button>
							);
						})}
					</div>

					<button
						type="button"
						onClick={confirmChoice}
						disabled={!selectedChoice || isComplete}
						className="mt-[clamp(14px,4vw,24px)] h-[clamp(46px,13vw,50px)] w-full rounded-full bg-[#ff8d00] px-6 font-sans text-[clamp(15px,4.2vw,16px)] font-bold leading-none text-white shadow-[0_4px_0_#b46300] transition-opacity disabled:cursor-not-allowed disabled:bg-[#ffe4c3] disabled:text-[#fff7ea] disabled:shadow-[0_4px_0_#ffc987]"
					>
						Choose This Path
					</button>

					<div className="mt-[clamp(10px,3vw,16px)] flex items-center justify-between gap-3">
						<p className="font-sans text-[clamp(11px,3.2vw,12px)] text-[#99a1af]">Choices made: {state.choiceCount} / 5</p>
						<button
							type="button"
							onClick={() => {
								dispatch({ type: "reset" });
								setSelectedChoiceByPhase({ 1: null, 2: null, 3: null, 4: null, 5: null });
							}}
							className="shrink-0 rounded-full border border-[#d1d5db] px-3 py-1 font-mono text-[11px] font-bold tracking-[0.08em] text-[#4b5563]"
						>
							RESET
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}
