"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";

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
				preview: "Quick notice\n\nAccept or adjust preferences later.",
				delta: { trust: -2, revenue: 14, population: 2 },
			},
			{
				id: "C",
				name: "OPTION C",
				title: "Full Coverage",
				description:
					"A full-screen overlay ensures every visitor makes a choice. The accept option is optimized for clicks.",
				preview: "Full coverage\n\nChoose to continue browsing.",
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
		<div className="rounded-[10px] bg-[#f4f6f8] p-3 text-[#1f2937]">
			<div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-[#b3bac6]">
				<span className="inline-flex gap-[3px]">
					<span className="h-2 w-2 rounded-full bg-[#d4d8de]" />
					<span className="h-2 w-2 rounded-full bg-[#d4d8de]" />
					<span className="h-2 w-2 rounded-full bg-[#d4d8de]" />
				</span>
				<span>Preview</span>
			</div>
			<div className="mt-2 rounded-[8px] bg-white p-3 text-[10px] leading-[1.45] text-[#404957] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
				{text.split("\n").map((line, index) => (
					<p key={`${line}-${index}`}>{line}</p>
				))}
			</div>
		</div>
	);
}

function StatRow({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<p className="font-sans text-[13px] text-[#6b7280]">{label}</p>
			<p className="font-sans text-[13px] font-semibold text-black">{value}</p>
		</div>
	);
}

export default function GamePage() {
	const [state, dispatch] = useReducer(gameReducer, initialState);
	const router = useRouter();
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

	const choosePath = (choice: Choice) => {
		const nextTrust = Math.max(0, state.trust + (choice.delta.trust ?? 0));
		const nextRevenue = Math.max(0, state.revenue + (choice.delta.revenue ?? 0));
		const nextPopulation = Math.max(0, state.population + (choice.delta.population ?? 0));
		const nextChoiceCount = state.choiceCount + 1;

		dispatch({ type: "apply-choice", delta: choice.delta });
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (state.phase === 5) {
			router.push(
				`/stats?trust=${nextTrust}&revenue=${nextRevenue}&population=${nextPopulation}&choiceCount=${nextChoiceCount}`,
			);
		}
	};

	return (
		<main className="min-h-screen bg-[#f3f1ec] px-0 py-0 text-black sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
			<section className="flex min-h-screen w-full flex-col bg-white sm:min-h-[852px] sm:max-w-[393px] lg:flex-row lg:max-w-[1180px] lg:min-h-[768px] lg:overflow-hidden lg:rounded-none lg:shadow-none">
				<header className="px-4 pb-5 pt-6 lg:w-[404px] lg:shrink-0 lg:px-10 lg:pb-10 lg:pt-10">
					<div className="flex items-center justify-between gap-4">
						<p className="font-sans text-[12px] font-semibold tracking-[0.18em] text-[#8e98ac]">
							{currentRound.phaseLabel}
						</p>

						<div className="flex items-center gap-1.5">
							{rounds.map((round) => (
								<span
									key={round.phase}
									className={`h-2.5 w-2.5 rounded-full ${round.phase <= state.phase ? "bg-black" : "bg-[#d8dce2]"}`}
								/>
							))}
						</div>
					</div>

					<div className="mt-4 rounded-[14px] bg-black px-4 py-5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
						<p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-[#7d8598]">
							SCENARIO
						</p>
						<h1 className="mt-3 font-sans text-[28px] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
							{currentRound.scenarioTitle}
						</h1>
						<p className="mt-3 max-w-[306px] font-sans text-[12px] leading-[1.55] text-[#8f98aa]">
							{currentRound.scenarioDescription}
						</p>
					</div>

					<div className="mt-4 rounded-[14px] border border-[#e7ebf1] bg-white px-4 py-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
						<p className="max-w-[303px] font-sans text-[13px] leading-[1.5] text-[#344054]">
							{currentRound.callout}
						</p>
					</div>

					<div className="mt-4 rounded-[14px] border border-[#e7ebf1] bg-white px-4 py-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
						<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#99a1af]">
							Current Town Stats
						</p>
						<div className="mt-4 space-y-3">
							<StatRow label="Trust" value={state.trust} />
							<StatRow label="Revenue" value={state.revenue} />
							<StatRow label="Population" value={state.population} />
						</div>
					</div>
				</header>

				<section className="flex-1 px-4 pb-6 lg:px-10 lg:py-10">
					<p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9aa3b2]">
						Choose one path
					</p>

					<div className="space-y-3">
						{currentRound.choices.map((choice) => {
							const isActive = choice.id === expandedChoice;

							return (
								<article
									key={choice.id}
									className={`rounded-[12px] border bg-white px-3 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02)] ${
										isActive ? "border-black" : "border-[#dfe4ea]"
									}`}
									onClick={() => setExpandedChoices((current) => ({ ...current, [state.phase]: choice.id }))}
									onKeyDown={(event) => {
										if (event.key === "Enter" || event.key === " ") {
											event.preventDefault();
											setExpandedChoices((current) => ({ ...current, [state.phase]: choice.id }));
										}
									}}
									tabIndex={0}
									role="button"
									aria-expanded={isActive}
									aria-label={`${choice.title}, ${isActive ? "preview open" : "preview closed"}`}
								>
									<div className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-2">
											<span
												className={`inline-flex items-center justify-center rounded-[2px] px-2 py-1 text-[10px] font-bold tracking-[0.16em] ${
													isActive ? "bg-black text-white" : "bg-[#eef1f5] text-[#4b5563]"
												}`}
											>
												{choice.name}
											</span>
										</div>

										<button
											type="button"
											onClick={(event) => {
												event.stopPropagation();
												setExpandedChoices((current) => ({ ...current, [state.phase]: choice.id }));
											}}
											className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8f98aa]"
										>
											{isActive ? "▲ preview" : "▼ preview"}
										</button>
									</div>

									<div className="mt-3">
										<h2 className="font-sans text-[18px] font-semibold leading-[1.2] text-black">
											{choice.title}
										</h2>
										<p className="mt-2 max-w-[318px] font-sans text-[12px] leading-[1.45] text-[#5b6576]">
											{choice.description}
										</p>
									</div>

									{isActive ? (
										<div className="mt-3">
											<ChoicePreview text={choice.preview} />
										</div>
									) : null}

									<div className="mt-3 flex justify-center">
										<button
											type="button"
											disabled={isComplete}
											onClick={(event) => {
												event.stopPropagation();
												choosePath(choice);
											}}
											className="flex h-10 w-full items-center justify-center border border-[#e5e9ef] bg-[#f8f8f6] px-4 font-mono text-[12px] font-bold tracking-[0.2em] text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
										>
											[ CHOOSE THIS PATH ]
										</button>
									</div>
								</article>
							);
						})}
					</div>

					<div className="mt-4 flex items-center justify-between gap-4">
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
							<p className="mt-2 font-sans text-[14px] leading-[1.5] text-[#d3d8e1]">
								You&apos;ve completed all five rounds. Reset to try a different path through the town.
							</p>
						</div>
					) : null}
				</section>
			</section>
		</main>
	);
}