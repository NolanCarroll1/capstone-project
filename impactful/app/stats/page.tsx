type StatsPageProps = {
	searchParams?: {
		trust?: string;
		revenue?: string;
		population?: string;
		choiceCount?: string;
	};
};

function parseNumber(value: string | undefined, fallback: number) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function getBarWidth(current: number, baseline: number) {
	const ratio = current / Math.max(current, baseline, 1);
	return `${Math.max(20, Math.round(ratio * 100))}%`;
}

function StatCard({
	label,
	value,
	from,
	description,
	barWidth,
	positive = true,
}: {
	label: string;
	value: number;
	from: number;
	description: string;
	barWidth: string;
	positive?: boolean;
}) {
	const change = value - from;
	const isNegative = change < 0;

	return (
		<div className="rounded-[16px] border border-[#eceff3] bg-white px-4 py-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-[#7d8598]">
						{label}
					</p>
					<div className="mt-3 flex items-baseline gap-2">
						<p className="font-sans text-[32px] font-bold leading-none tracking-[-0.05em] text-black">
							{value}
						</p>
						<p className="font-sans text-[13px] text-[#94a0b4]">from {from}</p>
					</div>
				</div>

				<div className="rounded-[4px] bg-[#f2f4f7] px-2 py-1 font-sans text-[12px] font-semibold text-[#a0a8b7]">
					{isNegative ? "▼" : positive ? "▲" : "►"} {change > 0 ? `+${change}` : change}
				</div>
			</div>

			<div className="mt-4 h-2 rounded-full bg-[#eef1f5]">
				<div className={`h-full rounded-full ${isNegative ? "bg-[#aeb7c4]" : "bg-[#4b5563]"}`} style={{ width: barWidth }} />
			</div>

			<p className="mt-3 max-w-[260px] font-sans text-[13px] leading-[1.45] text-[#707989]">
				{description}
			</p>
		</div>
	);
}

export default function StatsPage({ searchParams }: StatsPageProps) {
	const trust = parseNumber(searchParams?.trust, 38);
	const revenue = parseNumber(searchParams?.revenue, 1420);
	const population = parseNumber(searchParams?.population, 515);
	const choiceCount = parseNumber(searchParams?.choiceCount, 5);

	const stats = [
		{
			label: "TRUST",
			value: trust,
			from: 50,
			description: "Citizens noticed the tradeoffs in your consent and data choices.",
			barWidth: getBarWidth(trust, 50),
		},
		{
			label: "REVENUE",
			value: revenue,
			from: 1000,
			description: "Your decisions shaped how much the town could earn from the marketplace.",
			barWidth: getBarWidth(revenue, 1000),
		},
		{
			label: "POPULATION",
			value: population,
			from: 500,
			description: "Some citizens stayed, some left, and some arrived based on the experience you built.",
			barWidth: getBarWidth(population, 500),
		},
	] as const;

	return (
		<main className="min-h-screen bg-[#f5f6f8] px-4 py-8 text-black sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
			<section className="w-full max-w-[393px] lg:grid lg:max-w-[1180px] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
				<div>
					<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
						ALL 5 PHASES COMPLETE
					</p>
					<h1 className="mt-2 font-mono text-[40px] font-bold leading-[0.95] tracking-[-0.06em] text-black">
						Town Stats
					</h1>

					<div className="mt-3 inline-flex bg-black px-4 py-2">
						<p className="font-mono text-[12px] font-bold tracking-[0.18em] text-white">
							DECEPTIVE DESIGN MODULE
						</p>
					</div>

					<div className="mt-8 space-y-4">
						{stats.map((stat) => (
							<StatCard key={stat.label} {...stat} />
						))}
					</div>
				</div>

				<div className="mt-8 lg:mt-0">
					<div className="rounded-[16px] bg-black px-4 py-5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
						<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7d8598]">
							REFLECTION
						</p>
						<p className="mt-3 max-w-[320px] font-sans text-[16px] leading-[1.65] tracking-[-0.01em] text-[#e4e7ec]">
							Your choices shaped a town that is profitable but fragile. Revenue grew, but
							trust dropped — and a town without trust struggles to hold its population as
							they become more aware of how they&apos;ve been treated. Every design decision
							has a cost. The question is who pays it.
						</p>
					</div>

					<div className="mt-8 space-y-3">
						<a
							href="/tutorial"
							className="flex h-[44px] items-center justify-center border-2 border-black bg-white font-mono text-[14px] font-bold tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white"
						>
							[ NEW STORY ]
						</a>

						<button
							type="button"
							className="flex h-[44px] w-full items-center justify-center bg-black font-mono text-[14px] font-bold tracking-[0.18em] text-white transition-colors hover:bg-[#111827]"
						>
							[ SHARE RESULTS ]
						</button>
					</div>
					<p className="mt-6 font-sans text-[12px] text-[#98a0b3]">
						Choices made: {choiceCount} / 5
					</p>
				</div>
			</section>
		</main>
	);
}