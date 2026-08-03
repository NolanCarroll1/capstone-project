import type { LearningModule } from "./types";

const createdAt = "2026-07-15T16:00:00.000Z";
const updatedAt = "2026-08-01T18:12:00.000Z";

function createDraftModuleSeed(params: {
	id: string;
	title: string;
	slug: string;
	updatedAt: string;
}): LearningModule {
	return {
		id: params.id,
		title: params.title,
		slug: params.slug,
		description: deceptiveDesignSeedModule.description,
		introduction: deceptiveDesignSeedModule.introduction,
		tutorial: deceptiveDesignSeedModule.tutorial,
		estimatedMinutes: deceptiveDesignSeedModule.estimatedMinutes,
		status: "draft",
		thumbnail: deceptiveDesignSeedModule.thumbnail,
		phases: [],
		createdAt,
		updatedAt: params.updatedAt,
	};
}

export const deceptiveDesignSeedModule: LearningModule = {
	id: "module-deceptive-design",
	title: "Deceptive Design",
	slug: "deceptive-design",
	description:
		"An interactive module where users weigh growth goals against ethical product design decisions.",
	introduction:
		"You are advising a civic tech platform that serves students and local residents. Each product decision changes trust, revenue, and participation across the community.",
		tutorial:
			"In each phase, choose one of three approaches. Your path changes trust, growth, and reach. There are no perfect outcomes, only tradeoffs.",
	estimatedMinutes: 18,
	status: "published",
	thumbnail:
		"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
	createdAt,
	updatedAt,
	phases: [
		{
			id: "phase-consent-banner",
			position: 1,
			title: "Consent Banner",
			scenarioTitle: "Cookie Consent on First Visit",
			scenarioDescription:
				"Your team needs better analytics. Leadership asks for a banner strategy that maximizes opt-in rates.",
			callout:
				"The decision sets the tone for whether users feel respected or manipulated from their first interaction.",
			choices: [
				{
					id: "phase1-choice-a",
					label: "A",
					title: "Equal, plain-language options",
					description:
						"Offer Accept and Decline with equal prominence and clear privacy language.",
					preview:
						"Citizens feel informed and respected. Opt-in is lower at first, but trust rises.",
					effects: { trust: 8, revenue: -3, population: 5 },
				},
				{
					id: "phase1-choice-b",
					label: "B",
					title: "Nudged consent",
					description:
						"Highlight Accept and tuck Decline behind secondary text.",
					preview:
						"Short-term analytics improve, but users begin to question intent.",
					effects: { trust: -4, revenue: 4, population: 1 },
				},
				{
					id: "phase1-choice-c",
					label: "C",
					title: "Forced acceptance",
					description:
						"Block access until users accept tracking and marketing cookies.",
					preview:
						"Data spikes fast, but word spreads that the platform is coercive.",
					effects: { trust: -10, revenue: 8, population: -5 },
				},
			],
		},
		{
			id: "phase-pricing-clarity",
			position: 2,
			title: "Pricing Clarity",
			scenarioTitle: "Checkout for Training Certificates",
			scenarioDescription:
				"The certificate marketplace underperforms. The team considers new pricing display tactics.",
			callout:
				"How prices are framed can influence conversion, but hidden fees can erode long-term confidence.",
			choices: [
				{
					id: "phase2-choice-a",
					label: "A",
					title: "Transparent total cost",
					description:
						"Show full price breakdown before users click Continue.",
					preview:
						"Checkout completion grows slowly, but complaints drop significantly.",
					effects: { trust: 7, revenue: 1, population: 4 },
				},
				{
					id: "phase2-choice-b",
					label: "B",
					title: "Low headline, late fees",
					description:
						"Advertise a low entry price and reveal service fees on the final step.",
					preview:
						"Revenue rises now, but social channels fill with frustration.",
					effects: { trust: -6, revenue: 6, population: -1 },
				},
				{
					id: "phase2-choice-c",
					label: "C",
					title: "Auto-add premium bundle",
					description:
						"Pre-select extras and require users to opt out manually.",
					preview:
						"Average order value jumps, but support tickets and refunds spike.",
					effects: { trust: -9, revenue: 9, population: -4 },
				},
			],
		},
		{
			id: "phase-notification-consent",
			position: 3,
			title: "Notification Strategy",
			scenarioTitle: "Re-engaging Inactive Users",
			scenarioDescription:
				"Engagement dropped over the semester. Product wants aggressive reminders to increase return rates.",
			callout:
				"Notification volume can lift activity, but overreach may push users away permanently.",
			choices: [
				{
					id: "phase3-choice-a",
					label: "A",
					title: "Preference-based reminders",
					description:
						"Let users choose channels and frequency in a simple settings panel.",
					preview:
						"Return rates improve moderately with minimal unsubscribe churn.",
					effects: { trust: 6, revenue: 2, population: 3 },
				},
				{
					id: "phase3-choice-b",
					label: "B",
					title: "Default high-frequency reminders",
					description:
						"Enable daily reminders by default, with opt-out buried in settings.",
					preview:
						"Engagement spikes briefly, then opt-outs increase.",
					effects: { trust: -5, revenue: 5, population: -1 },
				},
				{
					id: "phase3-choice-c",
					label: "C",
					title: "Cross-channel pressure campaign",
					description:
						"Push email, SMS, and in-app alerts regardless of prior consent context.",
					preview:
						"Short-term participation rises while long-term retention drops sharply.",
					effects: { trust: -11, revenue: 7, population: -6 },
				},
			],
		},
		{
			id: "phase-data-sharing",
			position: 4,
			title: "Data Partnerships",
			scenarioTitle: "Sponsor Reporting Requests",
			scenarioDescription:
				"A major sponsor asks for more granular user data to justify future funding.",
			callout:
				"The way data is shared can affect funding and your institution's ethical standing.",
			choices: [
				{
					id: "phase4-choice-a",
					label: "A",
					title: "Aggregate anonymized reporting",
					description:
						"Share high-level trends only, with no personally identifiable details.",
					preview:
						"Funding conversations continue with strong institutional trust.",
					effects: { trust: 9, revenue: -1, population: 4 },
				},
				{
					id: "phase4-choice-b",
					label: "B",
					title: "Limited identifiable slices",
					description:
						"Provide small user cohorts with identifying metadata for sponsor analysis.",
					preview:
						"Sponsor confidence rises, but internal concerns increase.",
					effects: { trust: -5, revenue: 5, population: -2 },
				},
				{
					id: "phase4-choice-c",
					label: "C",
					title: "Broad behavioral export",
					description:
						"Deliver detailed activity logs tied to user identifiers.",
					preview:
						"Sponsor payout improves now, but reputational risk escalates.",
					effects: { trust: -12, revenue: 10, population: -7 },
				},
			],
		},
		{
			id: "phase-offboarding",
			position: 5,
			title: "Offboarding Experience",
			scenarioTitle: "Account Deletion Flow",
			scenarioDescription:
				"Policy updates require a clearer account deletion process, but growth teams fear churn impact.",
			callout:
				"How easy it is to leave often signals whether users can truly trust the platform.",
			choices: [
				{
					id: "phase5-choice-a",
					label: "A",
					title: "Simple two-step deletion",
					description:
						"Provide an obvious path with confirmation and plain language consequences.",
					preview:
						"A few users leave, but confidence in governance improves.",
					effects: { trust: 8, revenue: -2, population: 2 },
				},
				{
					id: "phase5-choice-b",
					label: "B",
					title: "Retention prompts first",
					description:
						"Show one retention offer before deletion can proceed.",
					preview:
						"Some users stay, but a portion reports frustration.",
					effects: { trust: -3, revenue: 3, population: 0 },
				},
				{
					id: "phase5-choice-c",
					label: "C",
					title: "Hidden cancellation route",
					description:
						"Require support contact and delayed processing to complete deletion.",
					preview:
						"Churn drops temporarily while legal and trust risks escalate.",
					effects: { trust: -10, revenue: 6, population: -5 },
				},
			],
		},
	],
};

export const sampleModules: LearningModule[] = [
	deceptiveDesignSeedModule,
	createDraftModuleSeed({
		id: "module-advocacy-101",
		title: "Advocacy 101",
		slug: "advocacy-101",
		updatedAt: "2026-07-25T13:45:00.000Z",
	}),
	createDraftModuleSeed({
		id: "module-community-listening",
		title: "Community Listening",
		slug: "community-listening",
		updatedAt: "2026-07-19T09:20:00.000Z",
	}),
	createDraftModuleSeed({
		id: "module-ethical-storytelling",
		title: "Ethical Storytelling",
		slug: "ethical-storytelling",
		updatedAt: "2026-07-02T16:10:00.000Z",
	}),
];
