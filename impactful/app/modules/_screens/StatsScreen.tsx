import Image from "next/image";
import Link from "next/link";

type StatsPageProps = {
	searchParams?: {
		trust?: string;
		revenue?: string;
		population?: string;
		choiceCount?: string;
	};
	moduleSlug?: string;
};

function parseNumber(value: string | undefined, fallback: number) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function getBarWidth(current: number, baseline: number) {
	const ratio = current / Math.max(current, baseline, 1);
	return `${Math.max(20, Math.round(ratio * 100))}%`;
}

function CroppedMascot() {
	return (
		<div className="relative h-[100px] w-[73px] overflow-hidden" aria-hidden>
			<Image
				src="/assets/welcome-logo-node-686-16004-latest.png"
				alt=""
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

function StatCard({
	label,
	value,
	from,
	description,
	barWidth,
	accent,
}: {
	label: string;
	value: number;
	from: number;
	description: string;
	barWidth: string;
	accent: {
		cardBg: string;
		trackBg: string;
		barPositive: string;
		barNegative: string;
		badgePositiveBg: string;
		badgePositiveText: string;
		badgeNegativeBg: string;
		badgeNegativeText: string;
	};
}) {
	const change = value - from;
	const isNegative = change < 0;
	const isNeutral = change === 0;
	const deltaSymbol = isNegative ? "▼" : isNeutral ? "■" : "▲";

	return (
		<div className="rounded-2xl border border-[#eceff3] px-4 py-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]" style={{ backgroundColor: accent.cardBg }}>
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-[#7d8598]">
						{label}
					</p>
					<div className="mt-3 flex items-baseline gap-2">
						<p className="font-sans text-[32px] font-bold leading-none tracking-tighter text-black">
							{value}
						</p>
						<p className="font-sans text-[13px] text-[#94a0b4]">from {from}</p>
					</div>
				</div>

				<div
					className="rounded-full px-2.5 py-1 font-sans text-[12px] font-semibold"
					style={{
						backgroundColor: isNegative ? accent.badgeNegativeBg : accent.badgePositiveBg,
						color: isNegative ? accent.badgeNegativeText : accent.badgePositiveText,
					}}
				>
					{deltaSymbol} {change > 0 ? `+${change}` : change}
				</div>
			</div>

			<div className="mt-4 h-2 rounded-full" style={{ backgroundColor: accent.trackBg }}>
				<div
					className="h-full rounded-full"
					style={{ width: barWidth, backgroundColor: isNegative ? accent.barNegative : accent.barPositive }}
				/>
			</div>

			<p className="mt-3 max-w-65 font-sans text-[13px] leading-[1.45] text-[#707989]">
				{description}
			</p>
		</div>
	);
}

export function StatsScreen({ searchParams, moduleSlug = "deceptive-design" }: StatsPageProps) {
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
			accent: {
				cardBg: "#f5f9ff",
				trackBg: "#dbeafe",
				barPositive: "#2563eb",
				barNegative: "#dc2626",
				badgePositiveBg: "#dcfce7",
				badgePositiveText: "#15803d",
				badgeNegativeBg: "#fee2e2",
				badgeNegativeText: "#b91c1c",
			},
		},
		{
			label: "REVENUE",
			value: revenue,
			from: 1000,
			description: "Your decisions shaped how much the town could earn from the marketplace.",
			barWidth: getBarWidth(revenue, 1000),
			accent: {
				cardBg: "#fff8f1",
				trackBg: "#ffedd5",
				barPositive: "#ff8d00",
				barNegative: "#dc2626",
				badgePositiveBg: "#dcfce7",
				badgePositiveText: "#15803d",
				badgeNegativeBg: "#fee2e2",
				badgeNegativeText: "#b91c1c",
			},
		},
		{
			label: "POPULATION",
			value: population,
			from: 500,
			description: "Some citizens stayed, some left, and some arrived based on the experience you built.",
			barWidth: getBarWidth(population, 500),
			accent: {
				cardBg: "#f4fbf6",
				trackBg: "#dcfce7",
				barPositive: "#16a34a",
				barNegative: "#dc2626",
				badgePositiveBg: "#dcfce7",
				badgePositiveText: "#15803d",
				badgeNegativeBg: "#fee2e2",
				badgeNegativeText: "#b91c1c",
			},
		},
	] as const;

	return (
		<main className="min-h-screen bg-[#f5f6f8] px-4 py-8 text-black sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
			<section className="w-full max-w-98.25 lg:grid lg:max-w-295 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
				<div>
					<div className="mb-6 flex items-start gap-4">
						<CroppedMascot />
						<div className="pt-1">
							<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
								ALL 5 PHASES COMPLETE
							</p>
							<h1 className="mt-2 font-mono text-[40px] font-bold leading-[0.95] tracking-[-0.06em] text-black">
								Town Stats
							</h1>
						</div>
					</div>

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
					<div className="rounded-2xl bg-black px-4 py-5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
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
						<Link
							href={`/modules/${moduleSlug}/tutorial`}
							className="flex h-11 items-center justify-center rounded-[14px] border-2 border-black bg-white font-mono text-[14px] font-bold tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white"
						>
							[ NEW STORY ]
						</Link>

						<Link
							href="/dashboard"
							className="flex h-11 items-center justify-center rounded-[14px] border-2 border-black bg-white font-mono text-[14px] font-bold tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white"
						>
							[ DASHBOARD ]
						</Link>

						<button
							type="button"
							className="flex h-11 w-full items-center justify-center rounded-[14px] bg-[#ff8d00] font-mono text-[14px] font-bold tracking-[0.18em] text-white transition-colors hover:bg-[#ff9d1a]"
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

export default function StatsPage({ searchParams }: StatsPageProps) {
	return <StatsScreen searchParams={searchParams} />;
}
