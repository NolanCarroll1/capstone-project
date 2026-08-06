"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { FullTopMenu } from "../_components/FullTopMenu";

const wordmarkSrc = "/assets/figma-capstone/story-begins-impactful-wordmark-node-1117-939.png";
const mascotSrc = "/assets/figma-capstone/stats/mascot.png";
const trustSrc = "/assets/figma-capstone/stats/trust.png";
const revenueSrc = "/assets/figma-capstone/stats/revenue.png";
const populationSrc = "/assets/figma-capstone/stats/population.png";
const shareIconSrc = "/assets/figma-capstone/stats/share.svg";

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

function StatCard({
	iconSrc,
	label,
	value,
	from,
}: {
	iconSrc: string;
	label: string;
	value: number;
	from: number;
}) {
	const change = value - from;
	const delta = change > 0 ? `+${change}` : `${change}`;

	return (
		<div className="h-[158.54px] rounded-4xl border-[1.804px] border-[#f1f3f6] bg-white p-[17.804px] shadow-[0px_4px_0px_#eff1f5]">
			<div className="mx-auto h-12 w-12">
				<Image src={iconSrc} alt="" width={48} height={48} unoptimized className="h-12 w-12 object-contain" />
			</div>
			<p className="pt-2 text-center font-sans text-[22px] font-bold leading-5.5 text-black">{value}</p>
			<p className="pt-1 text-center font-mono text-[10px] font-bold tracking-widest text-[#99a1af]">{label}</p>
			<div className="mx-auto mt-2 inline-flex rounded-full bg-[#f0fdf4] px-2 py-0.5">
				<p className="text-center font-sans text-[12px] font-bold text-[#15803d]">{delta}</p>
			</div>
		</div>
	);
}

export function StatsScreen({ searchParams, moduleSlug = "deceptive-design" }: StatsPageProps) {
	const [reflection, setReflection] = useState("");
	const trust = parseNumber(searchParams?.trust, 38);
	const revenue = parseNumber(searchParams?.revenue, 1420);
	const population = parseNumber(searchParams?.population, 515);
	const choiceCount = parseNumber(searchParams?.choiceCount, 5);
	const shareParams = new URLSearchParams({
		trust: String(trust),
		revenue: String(revenue),
		population: String(population),
		choiceCount: String(choiceCount),
	});
	const shareHref = `/modules/${moduleSlug}/share?${shareParams.toString()}`;

	const stats = [
		{
			iconSrc: trustSrc,
			label: "TRUST",
			value: trust,
			from: 50,
		},
		{
			iconSrc: revenueSrc,
			label: "REVENUE",
			value: revenue,
			from: 1000,
		},
		{
			iconSrc: populationSrc,
			label: "POPULATION",
			value: population,
			from: 500,
		},
	] as const;

	return (
		<main className="min-h-dvh bg-[#f1f3f5] text-black">
			<section className="relative mx-auto min-h-dvh w-full max-w-107.5 bg-white">
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
						<FullTopMenu />
					</div>
				</header>

				<div className="px-6 pb-6 pt-10">
					<div className="mx-auto w-full max-w-86.25">
					<div className="flex flex-col items-center">
						<Image src={mascotSrc} alt="Town mascot" width={112} height={112} unoptimized className="h-28 w-28 object-contain" />
						<p className="pt-4 font-mono text-xs font-bold tracking-widest text-[#99a1af]">ALL {choiceCount} PHASES COMPLETE</p>
						<h1 className="pt-1 text-center font-sans text-[28px] font-bold leading-8.75 text-black">Your Town Results</h1>
					</div>

					<div className="grid grid-cols-[107.07px_107.08px_107.07px] gap-3 pt-8">
						{stats.map((stat) => (
							<StatCard key={stat.label} {...stat} />
						))}
					</div>

					<div className="pt-8">
						<p className="font-mono text-xs font-bold tracking-widest text-[#99a1af]">YOUR REFLECTION</p>
						<div className="mt-3 rounded-[24px] border-[1.804px] border-[#f1f3f6] bg-white p-[21.804px] shadow-[0px_4px_0px_#eff1f5]">
							<p className="max-w-75.5 pb-3 font-sans text-sm leading-[1.38] text-[#6a7282]">
								What did you learn from your choices? What would you do differently?
							</p>
							<textarea
								value={reflection}
								onChange={(event) => setReflection(event.target.value)}
								placeholder="Write your thoughts here..."
								className="h-27.75 w-full resize-none rounded-2xl border-[1.804px] border-[#f1f3f6] bg-[#f8f8f8] px-[17.804px] py-[13.804px] font-sans text-sm text-black/70 outline-none"
							/>
							<button
								type="button"
								className="mt-4.5 h-[35.977px] w-[165.947px] rounded-full bg-[#ff8d00] px-8 font-mono text-xs font-bold tracking-widest text-white opacity-40 shadow-[0px_3px_0px_#b46300]"
							>
								SAVE REFLECTION
							</button>
						</div>
					</div>

					<div className="pt-6">
						<Link
							href={shareHref}
							className="flex h-[54.48px] w-full items-center justify-center gap-2 rounded-[1000px] bg-[#0e6b7c] font-sans text-[15px] font-bold text-white shadow-[0px_4px_0px_#07505e]"
						>
							<Image src={shareIconSrc} alt="" width={18} height={18} className="h-4.5 w-4.5" />
							<span className="leading-none">Share My Results</span>
						</Link>

						<Link
							href={`/modules/${moduleSlug}/tutorial`}
							className="mt-3 flex h-[54.48px] w-full items-center justify-center rounded-[1000px] bg-[#ff8d00] text-center font-sans text-[15px] font-bold text-white shadow-[0px_4px_0px_#b46300]"
						>
							Play Again
						</Link>
					</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default function StatsPage({ searchParams }: StatsPageProps) {
	return <StatsScreen searchParams={searchParams} />;
}
