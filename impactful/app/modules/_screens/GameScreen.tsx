"use client";

import { forwardRef, useEffect, useReducer, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Mascot } from "../../admin/_components/Mascot";
import { useRouter } from "next/navigation";

const figmaChevronIcon = "http://localhost:3845/assets/495276258fcba1d3f857200f1e5584f3c06587ed.svg";


// Top-half decorative/arrow asset from Figma (static for now)
const figmaTopArrow = "https://www.figma.com/api/mcp/asset/9589f4be-6a14-4fd8-bf88-49b6980f03fd.png";

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
	roundPhase?: number;
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
	style,
}: {
	children: string;
	className: string;
	onClick?: () => void;
	ariaLabel?: string;
	disabled?: boolean;
	style?: CSSProperties;
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
			style={style}
		>
			{children}
		</button>
	);
}

const firstRoundCardBase =
	"w-85.5 shrink-0 snap-center rounded-2xl bg-white p-6 text-[#0f1724] shadow-sm transition-colors duration-200 lg:w-88.5";

const FirstRoundChoiceCard = forwardRef<HTMLElement, ChoiceCardProps>(function FirstRoundChoiceCard(
	{ choice, isActive, isComplete, onActivate, onChoose },
	ref,
) {
	const cardWidthClass = choice.id === "B" ? "lg:w-87.5" : "lg:w-88.5";

	return (
		<article
			ref={ref}
			className={`${cardWidthClass} shrink-0 snap-center text-[#0f1724]`}
			style={{
				backgroundColor: '#ffffff',
				border: '1.827px solid #e5e7eb',
				borderRadius: 24,
				padding: 25.827,
				boxShadow: '0px 4px 0px #e5e7eb',
			}}
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
				<p className="font-mono text-xl font-bold leading-none">{choice.name}</p>
				<FigmaChevron expanded={isActive} />
			</button>

			<div className="flex flex-col gap-2 mt-3">
				<h2 className="font-sans text-lg font-bold leading-none tracking-normal text-slate-900">{choice.title}</h2>
				<p className="max-w-md font-sans text-sm font-normal leading-6 text-slate-600">{choice.description}</p>
			</div>

			{isActive ? (
				<div style={{
					border: '1.827px solid #e5e7eb',
					borderRadius: 8,
					padding: 13.827,
					backgroundColor: '#ffffff'
				}}>
					{/* Preview area */}
					<div className="flex flex-col gap-3">
						<div>
							<p className="font-sans text-sm font-semibold" style={{fontSize:12}}>{choice.id === "A" ? "We use cookies" : "Preview"}</p>
							<p className="mt-1 text-sm" style={{color: '#6a7282', fontSize:12}}>{choice.id === "A" ? "We collect browsing data to improve your experience. You choose what to share." : choice.preview}</p>
						</div>
						<div className="flex gap-3">
							{choice.id === "A" ? (
								<>
									<FigmaButton ariaLabel="Accept" className="flex h-9 flex-1 items-center justify-center rounded" style={{backgroundColor: '#85d79a', color: '#0f6826', borderRadius:4, padding:'8px 12px', fontWeight:700}}>Accept</FigmaButton>
									<FigmaButton ariaLabel="Decline" className="flex h-9 flex-1 items-center justify-center rounded" style={{backgroundColor: '#ffe0d7', color: '#9f2600', borderRadius:4, padding:'8px 12px', fontWeight:700}}>Decline</FigmaButton>
								</>
							) : choice.id === "B" ? (
								<>
									<FigmaButton ariaLabel="Accept" className="flex h-9 flex-1 items-center justify-center rounded" style={{backgroundColor: '#dcf5e3', color: '#186620', borderRadius:4, padding:'8px 12px', fontWeight:700}}>Accept</FigmaButton>
									<FigmaButton ariaLabel="Learn More" className="flex h-9 flex-1 items-center justify-center rounded" style={{backgroundColor: '#d9f0f7', color: '#004b6a', borderRadius:4, padding:'8px 12px', fontWeight:700}}>Learn More</FigmaButton>
								</>
							) : (
								<FigmaButton ariaLabel="Accept All" className="flex h-9 w-full items-center justify-center rounded" style={{backgroundColor: '#d9f0f7', color: '#004b6a', borderRadius:4, padding:'8px 12px', fontWeight:700}}>Accept All</FigmaButton>
							)}
						</div>
					</div>
				</div>
			) : null}

		</article>
	);
});

const ChoiceCard = forwardRef<HTMLElement, ChoiceCardProps>(function ChoiceCard(
	{ choice, isActive, isComplete, onActivate, onChoose, roundPhase },
	ref,
) {
	const statTiles = [
		{ label: "Trust", value: choice.delta.trust ?? 0 },
		{ label: "Revenue", value: choice.delta.revenue ?? 0 },
		{ label: "Pop.", value: choice.delta.population ?? 0 },
	] as const;

	function renderVariantPreview() {
		const key = `${roundPhase}-${choice.id}`;
		switch (key) {
			case "2-A":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Quick start</p>
						<div className="mt-2 flex flex-col gap-2">
							<input aria-label="email" placeholder="Email" className="rounded-md border border-[#e6e9ee] px-3 py-2 text-sm" />
							<input aria-label="password" placeholder="Password" className="rounded-md border border-[#e6e9ee] px-3 py-2 text-sm" />
							<div className="mt-2 flex gap-2">
								<button className="flex-1 rounded-md" style={{backgroundColor:'#85d79a', color:'#0f6826', fontWeight:700, padding:'8px 12px'}}>Join</button>
								<button className="flex-1 rounded-md border border-[#dfe6ea]" style={{backgroundColor:'#ffffff', color:'#374151', padding:'8px 12px'}}>Maybe later</button>
							</div>
						</div>
					</div>
				);
			case "2-B":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Guided setup — Step 1 of 3</p>
						<div className="mt-3 h-3 w-full rounded-full bg-[#eef3f7] overflow-hidden">
							<div style={{width:'33%', height:'100%', background:'#004b6a'}} />
						</div>
						<button className="mt-3 w-full rounded-md" style={{backgroundColor:'#d9f0f7', color:'#004b6a', fontWeight:700, padding:'8px 12px'}}>Continue</button>
					</div>
				);
			case "2-C":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Social login</p>
						<div className="mt-3 flex flex-col gap-2">
							<button className="rounded-md border px-3 py-2 text-sm" style={{borderColor:'#d1d5dc'}}>Continue with Google</button>
							<button className="rounded-md border px-3 py-2 text-sm" style={{borderColor:'#d1d5dc'}}>Continue with Facebook</button>
						</div>
					</div>
				);
			case "3-A":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Respect the no</p>
						<p className="mt-2 text-sm text-[#6a7282]">Notifications will remain off. Users can enable them in settings.</p>
						<button className="mt-3 rounded-md" style={{backgroundColor:'#dcf5e3', color:'#186620', fontWeight:700, padding:'8px 12px'}}>Got it</button>
					</div>
				);
			case "3-B":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Gentle reminder</p>
						<p className="mt-2 text-sm text-[#6a7282]">We may show you a reminder after 30 days. Once per month max.</p>
						<div className="mt-3 flex gap-2">
							<button className="flex-1 rounded-md border" style={{borderColor:'#e6e9ee', padding:'8px 12px'}}>Later</button>
							<button className="flex-1 rounded-md" style={{backgroundColor:'#d9f0f7', color:'#004b6a', fontWeight:700, padding:'8px 12px'}}>Yes</button>
						</div>
					</div>
				);
			case "3-C":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Persistent prompts</p>
						<p className="mt-2 text-sm text-[#6a7282]">We will ask on every visit with stronger language.</p>
						<button className="mt-3 w-full rounded-md" style={{backgroundColor:'#ffffff', color:'#121212', border:'1px solid #d1d5dc', padding:'8px 12px'}}>Allow Notifications</button>
					</div>
				);
			case "4-A":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Better content</p>
						<ul className="mt-2 list-inside list-decimal text-sm text-[#374151]">
							<li>Curated listings</li>
							<li>Community highlights</li>
							<li>Quality filters</li>
						</ul>
					</div>
				);
			case "4-B":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Gamification</p>
						<div className="mt-3 flex items-center gap-2">
							<div className="rounded-full px-3 py-1" style={{background:'#ffecd8', color:'#b45309'}}>Streak 5</div>
							<button className="ml-auto rounded-md" style={{backgroundColor:'#d9f0f7', color:'#004b6a', padding:'8px 12px', fontWeight:700}}>Redeem</button>
						</div>
					</div>
				);
			case "4-C":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">FOMO engine</p>
						<p className="mt-2 text-sm text-[#6a7282]">Only 2 items left — exclusive deal.</p>
						<div className="mt-3 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-white">00:12</div>
					</div>
				);
			case "5-A":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Transparent checkout</p>
						<div className="mt-2 text-sm text-[#374151]">
							<p>Item total: $24.00</p>
							<p>Shipping: $4.00</p>
							<p className="font-bold mt-1">Total: $28.00</p>
						</div>
						<button className="mt-3 w-full rounded-md" style={{backgroundColor:'#85d79a', color:'#0f6826', fontWeight:700, padding:'8px 12px'}}>Confirm Order</button>
					</div>
				);
			case "5-B":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Progressive disclosure</p>
						<p className="mt-2 text-sm text-[#6a7282]">Prices shown now, shipping after address.</p>
						<button className="mt-3 w-full rounded-md" style={{backgroundColor:'#d9f0f7', color:'#004b6a', fontWeight:700, padding:'8px 12px'}}>Calculate Shipping</button>
					</div>
				);
			case "5-C":
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Drip pricing</p>
						<ul className="mt-2 text-sm text-[#374151]">
							<li>Base price: $10.00</li>
							<li>Service fee: $2.00</li>
							<li>Processing: $1.00</li>
							<li className="font-bold mt-1">Total: $13.00</li>
						</ul>
					</div>
				);
			default:
				return (
					<div>
						<p className="font-sans text-sm font-semibold">Preview</p>
						<p className="mt-2 text-sm text-[#6a7282]">{choice.preview}</p>
					</div>
				);
		}
	}

	return (
		<article
			ref={ref}
			className={`w-85.5 shrink-0 snap-center transition-colors duration-200 lg:w-88.5`}
			style={{
				backgroundColor: '#ffffff',
				border: isActive ? '2px solid #000000' : '1.827px solid #e5e7eb',
				borderRadius: 24,
				padding: 20,
				boxShadow: isActive ? '0px 6px 0px #e5e7eb' : '0px 4px 0px #e5e7eb',
			}}
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
				<p className="font-mono text-[22px] font-bold leading-none text-[#0f1724]">{choice.name}</p>
				<FigmaChevron expanded={isActive} />
			</button>

			<div className="flex flex-col gap-1">
				<h2 className="font-sans text-[17px] font-bold leading-none tracking-normal text-[#0f1724]">
					{choice.title}
				</h2>
				<p className="max-w-75.5 font-sans text-[17px] font-normal leading-none tracking-normal text-[#9aa4b2]">
					{choice.description}
				</p>
			</div>

			{isActive ? (
				<div className="mt-4 rounded-2xl border-2 border-[#7c7c7c] bg-white p-3 text-[#121212]">
					<div className="flex flex-col gap-4">
						{renderVariantPreview()}
					</div>
				</div>
			) : (
				<p className="mt-4 max-w-75 font-sans text-[11px] leading-normal text-[#8f98aa]">
					Swipe to reveal this option&apos;s detail state.
				</p>
			)}

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
	const [expandedChoices, setExpandedChoices] = useState<Record<Phase, ChoiceKey>>({
		1: "A",
		2: "A",
		3: "A",
		4: "A",
		5: "A",
	});

	const currentRound = rounds[state.phase - 1];
	const isComplete = state.complete;
	const expandedChoice = expandedChoices[state.phase] ?? "A";

	useEffect(() => {
		choiceRefs.current[expandedChoice]?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	}, [expandedChoice, state.phase]);

	const choosePath = (choice: Choice) => {
		const nextTrust = Math.max(0, state.trust + (choice.delta.trust ?? 0));
		const nextRevenue = Math.max(0, state.revenue + (choice.delta.revenue ?? 0));
		const nextPopulation = Math.max(0, state.population + (choice.delta.population ?? 0));
		const nextChoiceCount = state.choiceCount + 1;

		dispatch({ type: "apply-choice", delta: choice.delta });
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (state.phase === 5) {
			router.push(
				`/modules/${moduleSlug}/stats?trust=${nextTrust}&revenue=${nextRevenue}&population=${nextPopulation}&choiceCount=${nextChoiceCount}`,
			);
		}
	};

	return (
		<main className="min-h-screen bg-white text-black">
			<section className="mx-auto flex min-h-screen w-full max-w-98.25 flex-col px-6 py-10 lg:max-w-98.25">
				{/* Figma static overlay image (top half) — decorative, pointer-events-none */}
				<div className="figma-top-overlay relative w-full pointer-events-none" aria-hidden="true" style={{height: 220}}>
					<img src={figmaTopArrow} alt="" className="absolute left-1/2 top-0 -translate-x-1/2 object-none" style={{maxWidth: "900px", opacity: 0.98}} />
				</div>

				
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
					{/* Illustration + callout layout from Figma (mascot replaced) */}
					<div className="flex items-start gap-5">
						{/* Use the admin Mascot component for consistent branding */}
						<Mascot size={96} className="flex-none rounded-lg" />
						<div className="rounded-lg p-5" style={{ backgroundColor: 'rgba(85,137,244,0.05)' }}>
							<p className="font-sans text-xs font-bold leading-4 tracking-widest text-slate-400">
								SCENARIO
							</p>
							<h1 className="pt-3 font-sans text-2xl font-bold leading-7 text-slate-900">
								{currentRound.scenarioTitle}
							</h1>
							<p className="pt-3 font-sans text-sm font-normal leading-6 text-slate-700 max-w-xl">
								{currentRound.scenarioDescription}
							</p>
						</div>
					</div>
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
										roundPhase={currentRound.phase}
										onActivate={() => setExpandedChoices((current) => ({ ...current, [state.phase]: choice.id }))}
										onChoose={() => choosePath(choice)}
									/>
								);
								})}
						</div>
					</div>

					{/* Selection dots and global CTA to mirror the Figma layout */}
					<div className="mt-4 flex flex-col items-center gap-4">
						<div className="flex items-center gap-3">
							{currentRound.choices.map((c) => (
								<button
									key={c.id}
									type="button"
									onClick={() => setExpandedChoices((current) => ({ ...current, [state.phase]: c.id }))}
									className={`h-9 w-9 rounded-full flex items-center justify-center font-mono font-bold ${c.id === expandedChoice ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-500"}`}>
									{c.id}
								</button>
							))}
						</div>

						<button
							type="button"
							onClick={() => {
								const choice = currentRound.choices.find((item) => item.id === expandedChoice);
								if (choice && !isComplete) choosePath(choice);
							}}
							className="mt-2 w-64 rounded-full bg-orange-400 px-6 py-3 text-center font-sans font-bold text-white shadow-md"
							disabled={isComplete}
						>
							Choose This Path
						</button>
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
		</main>
	);
}
