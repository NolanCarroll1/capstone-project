"use client";

import { forwardRef, useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const figmaChevronIcon = "http://localhost:3845/assets/495276258fcba1d3f857200f1e5584f3c06587ed.svg";

// Decorative assets exported from the Figma node
const imgLoadAnimation1 = "http://localhost:3845/assets/a40b3b75b85cd3fb65704718346495d8a3f3abb7.png";
const imgVector = "http://localhost:3845/assets/6f94b82ac36807c02bc700c1f9cb6d065d8b9546.svg";
const imgFrame = "http://localhost:3845/assets/4b06a57733e51432639d099e3368a907a745c642.svg";

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

type ChoiceCardProps = {
	choice: Choice;
	isActive: boolean;
	isComplete: boolean;
	onActivate: () => void;
	onChoose: () => void;
};

type Action =
	| {
		type: "apply-choice";
		delta: StatDelta;
	}
	| {
		type: "reset";
	};

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
				preview: "Cookie Policy\nsettings — privacy",
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
			"Citizens who declined notifications before — should you ask them again?",
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

function ChoicePreview({ text }: { text: string }) {
	return (
		<div className="rounded-[18px] border border-[#dde3ea] bg-[#f7f8fa] p-3 text-[#1f2937]">
			<div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-[#9ca3af]">
				<span>Preview</span>
				<span className="inline-flex gap-0.75">
					<span className="h-2 w-2 rounded-full bg-[#d4d8de]" />
					<span className="h-2 w-2 rounded-full bg-[#d4d8de]" />
					<span className="h-2 w-2 rounded-full bg-[#d4d8de]" />
				</span>
			</div>
			<div className="mt-3 rounded-[14px] border border-[#ebeff4] bg-white p-4 text-[11px] leading-normal text-[#425062] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
				{text.split("\n").map((line, index) => (
					<p key={`${line}-${index}`}>{line}</p>
				))}
			</div>
		</div>
	);
}

function FigmaChevron({ expanded }: { expanded: boolean }) {
	return (
		<span className={`inline-flex h-6 w-6 items-center justify-center transition-transform ${expanded ? "-rotate-90" : "rotate-180"}`}>
			<img alt="" aria-hidden="true" className="block h-6 w-6 max-w-none" src={figmaChevronIcon} />
		</span>
	);
}

function FigmaButton({
	children,
	className,
	onClick,
	ariaLabel,
	disabled,
}: {
	children: string;
	className: string;
	onClick?: () => void;
	ariaLabel?: string;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			aria-label={ariaLabel}
			disabled={disabled}
			onClick={(event) => {
				event.stopPropagation();
				onClick?.();
			}}
			className={className}
		>
			{children}
		</button>
	);
}

const firstRoundCardBase =
	"w-85.5 shrink-0 snap-center rounded-3xl bg-[#121212] p-6 text-white shadow-none transition-colors duration-200 lg:w-88.5";

const FirstRoundChoiceCard = forwardRef<HTMLElement, ChoiceCardProps>(function FirstRoundChoiceCard(
	{ choice, isActive, isComplete, onActivate, onChoose },
	ref,
) {
	const cardWidthClass = choice.id === "B" ? "lg:w-87.5" : "lg:w-88.5";
	const isBordered = isActive && choice.id !== "B";

	return (
		<article
			ref={ref}
			className={`${firstRoundCardBase} ${cardWidthClass} ${isBordered ? "border-2 border-black" : "border border-transparent"}`}
			onClick={onActivate}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onActivate();
				}
			}}
			tabIndex={0}
			role="button"
			aria-expanded={isActive}
			aria-label={`${choice.title}, ${isActive ? "expanded" : "collapsed"}`}
		>
			<button
				type="button"
				className="flex w-full items-center justify-between"
				onClick={(event) => {
					event.stopPropagation();
					onActivate();
				}}
			>
				<p className="font-mono text-[22px] font-bold leading-none text-white">{choice.name}</p>
				<FigmaChevron expanded={isActive} />
			</button>

			<div className="flex flex-col gap-1">
				<h2 className="font-sans text-[17px] font-bold leading-none tracking-normal text-white">
					{choice.title}
				</h2>
				<p className="max-w-75.5 font-sans text-[17px] font-normal leading-none tracking-normal text-[#9aa4b2]">
					{choice.description}
				</p>
			</div>

			{isActive ? (
				choice.id === "A" ? (
					<div className="rounded-2xl border-2 border-[#6b7280] bg-white p-3 text-[#121212]">
						<div className="flex flex-col gap-3.5">
							<div className="flex flex-col gap-1">
								<p className="font-sans text-[15px] font-bold leading-none text-[#121212]">We use cookies</p>
								<p className="font-sans text-[13px] font-normal leading-none text-[#6b7280]">
									We collect browsing data to improve your experience. You choose what to share.
								</p>
							</div>
							<div className="flex gap-4">
								<FigmaButton
									ariaLabel="Accept"
									className="flex h-8 flex-1 items-center justify-center rounded-full bg-[#0c3310] px-4 font-sans text-[14px] font-bold leading-none text-[#85d79a]"
								>
									Accept
								</FigmaButton>
								<FigmaButton
									ariaLabel="Decline"
									className="flex h-8 flex-1 items-center justify-center rounded-full bg-[#4a1100] px-4 font-sans text-[14px] font-bold leading-none text-[#ff957c]"
								>
									Decline
								</FigmaButton>
							</div>
						</div>
					</div>
				) : choice.id === "B" ? (
					<div className="rounded-2xl border-2 border-[#7c7c7c] bg-white p-3 text-[#121212]">
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1">
								<p className="font-sans text-[15px] font-bold leading-none text-[#121212]">Preview</p>
								<p className="font-sans text-[13px] font-normal leading-none text-[#323232]">
									We use cookies to improve your experience.
								</p>
							</div>
							<div className="flex gap-4">
								<FigmaButton
									ariaLabel="Accept"
									className="flex h-8 flex-1 items-center justify-center rounded-full bg-[#0c3310] px-4 font-sans text-[14px] font-bold leading-none text-[#85d79a]"
								>
									Accept
								</FigmaButton>
								<FigmaButton
									ariaLabel="Learn More"
									className="flex h-8 flex-1 items-center justify-center rounded-full bg-[#003c54] px-4 font-sans text-[14px] font-bold leading-none text-[#b8e0ee]"
								>
									Learn More
								</FigmaButton>
							</div>
						</div>
					</div>
				) : (
					<div className="rounded-2xl border-[0.665px] border-[#6b7280] bg-white p-4 text-[#121212]">
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1">
								<p className="font-sans text-[15px] font-bold leading-none text-[#9aa4b2]">Cookie Policy</p>
								<p className="text-center font-mono text-[12px] font-normal not-italic leading-none text-[#323232]">
									settings — privacy
								</p>
							</div>
							<FigmaButton
								ariaLabel="Accept All"
								className="flex h-8 w-full items-center justify-center rounded-full bg-[#003c54] px-4 font-sans text-[14px] font-bold leading-none text-[#b8e0ee]"
							>
								Accept All
							</FigmaButton>
						</div>
					</div>
				)
			) : null}

			<FigmaButton
				ariaLabel="Choose This Path"
				className="flex h-10.75 w-full items-center justify-center rounded-full bg-[#ff8d00] px-4 font-sans text-[16px] font-bold leading-none text-white"
				onClick={onChoose}
				disabled={isComplete}
			>
				Choose This Path
			</FigmaButton>
		</article>
	);
});

const ChoiceCard = forwardRef<HTMLElement, ChoiceCardProps>(function ChoiceCard(
	{ choice, isActive, isComplete, onActivate, onChoose },
	ref,
) {
	const statTiles = [
		{ label: "Trust", value: choice.delta.trust ?? 0 },
		{ label: "Revenue", value: choice.delta.revenue ?? 0 },
		{ label: "Pop.", value: choice.delta.population ?? 0 },
	] as const;

	return (
		<article
			ref={ref}
			className={`w-85.5 shrink-0 snap-center rounded-3xl bg-[#121212] p-6 text-white shadow-none transition-colors duration-200 lg:w-88.5 ${
				isActive ? "border-2 border-black" : "border border-transparent"
			}`}
			onClick={onActivate}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onActivate();
				}
			}}
			tabIndex={0}
			role="button"
			aria-expanded={isActive}
			aria-label={`${choice.title}, ${isActive ? "expanded" : "collapsed"}`}
		>
			<button
				type="button"
				className="flex w-full items-center justify-between"
				onClick={(event) => {
					event.stopPropagation();
					onActivate();
				}}
			>
				<p className="font-mono text-[22px] font-bold leading-none text-white">{choice.name}</p>
				<FigmaChevron expanded={isActive} />
			</button>

			<div className="flex flex-col gap-1">
				<h2 className="font-sans text-[17px] font-bold leading-none tracking-normal text-white">
					{choice.title}
				</h2>
				<p className="max-w-75.5 font-sans text-[17px] font-normal leading-none tracking-normal text-[#9aa4b2]">
					{choice.description}
				</p>
			</div>

			{isActive ? (
				<div className="mt-4 rounded-2xl border-2 border-[#7c7c7c] bg-white p-3 text-[#121212]">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<p className="font-sans text-[15px] font-bold leading-none text-[#121212]">Preview</p>
							<p className="font-sans text-[13px] font-normal leading-none text-[#323232]">
								{choice.preview}
							</p>
						</div>
						<div className="flex gap-4">
							{statTiles.map((stat) => (
								<div key={stat.label} className="flex flex-1 flex-col items-center justify-center rounded-full bg-[#f7f8fa] px-2 py-2 text-center">
									<p className="font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#97a0b0]">
										{stat.label}
									</p>
									<p className={`mt-1 font-mono text-[13px] font-bold ${stat.value >= 0 ? "text-black" : "text-[#a01b1b]"}`}>
										{stat.value >= 0 ? `+${stat.value}` : stat.value}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			) : (
				<p className="mt-4 max-w-75 font-sans text-[11px] leading-normal text-[#8f98aa]">
					Swipe to reveal this option&apos;s detail state.
				</p>
			)}

			<div className="mt-4">
				<button
					type="button"
					disabled={isComplete}
					onClick={(event) => {
						event.stopPropagation();
						onChoose();
					}}
					className="flex h-11 w-full items-center justify-center rounded-xl border border-[#dfe4ea] bg-[#f7f6f2] px-4 font-mono text-[11px] font-bold tracking-[0.22em] text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
				>
					[ CHOOSE THIS PATH ]
				</button>
			</div>
		</article>
	);
});

function StatRow({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<p className="font-sans text-[13px] text-[#6b7280]">{label}</p>
			<p className="font-sans text-[13px] font-semibold text-black">{value}</p>
		</div>
	);
}

type GameScreenProps = {
	moduleSlug?: string;
};

export function GameScreen({ moduleSlug = "deceptive-design" }: GameScreenProps) {
	const [state, dispatch] = useReducer(gameReducer, initialState);
	const router = useRouter();
	const choiceRefs = useRef<Record<ChoiceKey, HTMLElement | null>>({
		A: null,
		B: null,
		C: null,
	});
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const [expandedChoices, setExpandedChoices] = useState<Record<Phase, ChoiceKey>>({
		1: "A",
		2: "A",
		3: "A",
		4: "A",
		5: "A",
	});
	const [announcements, setAnnouncements] = useState<string[]>([]);

	const currentRound = rounds[state.phase - 1];
	const isComplete = state.complete;
	const expandedChoice = expandedChoices[state.phase] ?? "A";

	useEffect(() => {
		choiceRefs.current[expandedChoice]?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
		// Announce selection for screen readers
		setAnnouncements((a) => [...a.slice(-2), `${currentRound.phaseLabel} — selected ${expandedChoice}`]);
	}, [expandedChoice, state.phase, currentRound.phaseLabel]);

	// Keyboard navigation: left/right to navigate options, Enter/Space to choose
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "ArrowRight") {
				e.preventDefault();
				setExpandedChoices((cur) => {
					const curKey = cur[state.phase];
					const order: ChoiceKey[] = ["A", "B", "C"];
					const idx = order.indexOf(curKey);
					const next = order[Math.min(order.length - 1, idx + 1)];
					return { ...cur, [state.phase]: next };
				});
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				setExpandedChoices((cur) => {
					const curKey = cur[state.phase];
					const order: ChoiceKey[] = ["A", "B", "C"];
					const idx = order.indexOf(curKey);
					const prev = order[Math.max(0, idx - 1)];
					return { ...cur, [state.phase]: prev };
				});
			} else if (e.key === "Enter" || e.key === " ") {
				// trigger choose for focused card or expandedChoice
				const choice = currentRound.choices.find((c) => c.id === expandedChoice);
				if (choice) {
					e.preventDefault();
					choosePath(choice);
				}
			}
		}

		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [state.phase, expandedChoice, currentRound.choices]);

	const choosePath = (choice: Choice) => {
		const nextTrust = Math.max(0, state.trust + (choice.delta.trust ?? 0));
		const nextRevenue = Math.max(0, state.revenue + (choice.delta.revenue ?? 0));
		const nextPopulation = Math.max(0, state.population + (choice.delta.population ?? 0));
		const nextChoiceCount = state.choiceCount + 1;

		dispatch({ type: "apply-choice", delta: choice.delta });
		window.scrollTo({ top: 0, behavior: "smooth" });

		// Announce choice applied
		setAnnouncements((a) => [...a.slice(-3), `${choice.title} chosen. Trust ${nextTrust}, Revenue ${nextRevenue}, Population ${nextPopulation}`]);

		if (state.phase === 5) {
			router.push(
				`/modules/${moduleSlug}/stats?trust=${nextTrust}&revenue=${nextRevenue}&population=${nextPopulation}&choiceCount=${nextChoiceCount}`,
			);
		}
	};

	return (
		<main className="min-h-screen bg-white text-black relative overflow-hidden">
			{/* Decorative/figma assets positioned behind the content */}
			<img src={imgLoadAnimation1} alt="" aria-hidden className="pointer-events-none absolute -left-16 -top-24 w-72 opacity-80" />
			<img src={imgVector} alt="" aria-hidden className="pointer-events-none absolute right-[-8%] top-10 w-96 opacity-30" />
			<img src={imgFrame} alt="" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-5" />

			<section className="mx-auto flex min-h-screen w-full max-w-98.25 flex-col px-6 py-10 lg:max-w-98.25">
				<div className="flex items-center justify-between gap-4">
					<p className="font-sans text-[12px] font-bold leading-4 tracking-widest text-[#6a7282]">
						{currentRound.phaseLabel}
					</p>

					<div className="flex items-start gap-1.5">
						{rounds.map((round) => (
							<span
								key={round.phase}
								className={`h-3 w-3 rounded-full ${round.phase <= state.phase ? "bg-black" : "bg-[#d1d5db]"}`}
							/>
						))}
					</div>
				</div>

				<div className="pt-8">
					<div className="rounded-[14px] bg-black p-7 text-white">
						<p className="font-sans text-[12px] font-bold leading-4 tracking-widest text-[#99a1af]">
							SCENARIO
						</p>
						<h1 className="pt-3 font-sans text-[24px] font-bold leading-8 text-white">
							{currentRound.scenarioTitle}
						</h1>
						<p className="pt-4 font-sans text-[14px] font-normal leading-[22.75px] text-[#99a1af]">
							{currentRound.scenarioDescription}
						</p>
					</div>

					<div className="mt-5 rounded-[14px] border border-[#e5e7eb] bg-white p-[20.609px]">
						<p className="font-sans text-[14px] font-semibold leading-[22.75px] text-[#364153]">
							{currentRound.callout}
						</p>
					</div>

					<div className="mt-5 rounded-[14px] border border-[#e5e7eb] bg-white p-[20.609px]">
						<p className="font-sans text-[12px] font-bold leading-4 tracking-widest text-[#6a7282]">
							CURRENT TOWN STATS
						</p>
						<div className="pt-3">
							<div className="flex items-center justify-between py-3">
								<p className="font-sans text-[14px] font-normal leading-5 text-[#6a7282]">Trust</p>
								<p className="font-sans text-[14px] font-bold leading-5 text-black">{state.trust}</p>
							</div>
							<div className="flex items-center justify-between py-3">
								<p className="font-sans text-[14px] font-normal leading-5 text-[#6a7282]">Revenue</p>
								<p className="font-sans text-[14px] font-bold leading-5 text-black">{state.revenue}</p>
							</div>
							<div className="flex items-center justify-between py-3">
								<p className="font-sans text-[14px] font-normal leading-5 text-[#6a7282]">Population</p>
								<p className="font-sans text-[14px] font-bold leading-5 text-black">{state.population}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="pt-8">
					<p className="font-sans text-[12px] font-bold leading-4 tracking-widest text-[#99a1af]">
						CHOOSE ONE PATH
					</p>
				</div>

				<div className="pt-8 pb-4">
					<div className="-mx-6 overflow-x-auto px-6 pb-6 scrollbar-none">
						<div className="flex snap-x snap-mandatory gap-6 pr-6">
						{currentRound.phase === 1
							? currentRound.choices.map((choice) => {
								const isActive = choice.id === expandedChoice;

								return (
									<FirstRoundChoiceCard
										key={choice.id}
										ref={(node) => {
											choiceRefs.current[choice.id] = node;
										}}
										choice={choice}
										isActive={isActive}
										isComplete={isComplete}
										onActivate={() => setExpandedChoices((current) => ({ ...current, [state.phase]: choice.id }))}
										onChoose={() => choosePath(choice)}
										className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
									/>
								);
							})
							: currentRound.choices.map((choice) => {
								const isActive = choice.id === expandedChoice;

								return (
									<ChoiceCard
										key={choice.id}
										ref={(node) => {
											choiceRefs.current[choice.id] = node;
										}}
										choice={choice}
										isActive={isActive}
										isComplete={isComplete}
										onActivate={() => setExpandedChoices((current) => ({ ...current, [state.phase]: choice.id }))}
										onChoose={() => choosePath(choice)}
										className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
									/>
								);
							})}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between gap-4 pt-2">
					<p className="font-sans text-[12px] text-[#99a1af]">
						Choices made: {state.choiceCount} / 5
					</p>

					<button
						type="button"
						onClick={() => dispatch({ type: "reset" })}
						className="rounded-full border border-black px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.14em] text-black"
					>
						RESET
					</button>
				</div>

				{isComplete ? (
					<div className="mt-4 rounded-[14px] border border-black bg-black px-4 py-4 text-white">
						<p className="font-sans text-[12px] font-semibold tracking-[0.18em] text-[#8e98ac]">
							STORY COMPLETE
						</p>
						<p className="mt-2 font-sans text-[14px] leading-normal text-[#d3d8e1]">
							You&apos;ve completed all five rounds. Reset to try a different path through the town.
						</p>
					</div>
				) : null}
			</section>

			{/* Live region for screen reader announcements (visually hidden) */}
			<div
				aria-live="polite"
				aria-atomic="true"
				style={{
					position: "absolute",
					width: 1,
					height: 1,
					overflow: "hidden",
					clip: "rect(0 0 0 0)",
					whiteSpace: "nowrap",
					border: 0,
					padding: 0,
				}}
			>
				{announcements.slice(-1)[0]}
			</div>
		</main>
	);
}
