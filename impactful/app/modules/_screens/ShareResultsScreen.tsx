"use client";

import Image from "next/image";
import Link from "next/link";

import { FullTopMenu } from "../_components/FullTopMenu";

const wordmarkSrc = "/assets/figma-capstone/story-begins-impactful-wordmark-node-1117-939.png";
const impactfulSrc = "/assets/figma-capstone/share/impactful.png";
const trustSrc = "/assets/figma-capstone/share/trust.png";
const revenueSrc = "/assets/figma-capstone/share/revenue.png";
const populationSrc = "/assets/figma-capstone/share/population.png";
const linkImageSrc = "/assets/figma-capstone/share/link.png";
const backIconSrc = "/assets/figma-capstone/share/back.svg";
const instagramIconSrc = "/assets/figma-capstone/share/instagram.svg";
const xIconSrc = "/assets/figma-capstone/share/x.svg";
const facebookIconSrc = "/assets/figma-capstone/share/facebook.svg";
const linkedinIconSrc = "/assets/figma-capstone/share/linkedin.svg";

type ShareResultsScreenProps = {
	moduleSlug?: string;
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

function StatPill({
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
	const delta = value - from;
	const deltaText = delta > 0 ? `+${delta}` : `${delta}`;

	return (
		<div className="h-[135.45px] rounded-2xl bg-white/10 p-3">
			<div className="flex justify-center">
				<Image src={iconSrc} alt="" width={40} height={40} unoptimized className="h-[39.993px] w-[39.993px] object-contain" />
			</div>
			<p className="pt-1 text-center font-sans text-[18px] font-bold leading-7 text-white">{value}</p>
			<p className="text-center font-mono text-[10px] font-bold tracking-[0.1em] text-white/60">{label}</p>
			<div className="pt-1 text-center">
				<span className="inline-flex rounded-full bg-[#22c55e]/25 px-2 py-0.5 font-sans text-xs font-bold text-[#86efac]">
					{deltaText}
				</span>
			</div>
		</div>
	);
}

export function ShareResultsScreen({ searchParams, moduleSlug = "deceptive-design" }: ShareResultsScreenProps) {
	const trust = parseNumber(searchParams?.trust, 38);
	const revenue = parseNumber(searchParams?.revenue, 1420);
	const population = parseNumber(searchParams?.population, 515);
	const choiceCount = parseNumber(searchParams?.choiceCount, 5);

	const statsParams = new URLSearchParams({
		trust: String(trust),
		revenue: String(revenue),
		population: String(population),
		choiceCount: String(choiceCount),
	});

	const statsHref = `/modules/${moduleSlug}/stats?${statsParams.toString()}`;
	const shareText = `I shaped my digital community. Trust: ${trust}, Revenue: ${revenue}, Population: ${population}.`;

	const shareTargets = [
		{ label: "Instagram", iconSrc: instagramIconSrc },
		{ label: "X / Twitter", iconSrc: xIconSrc },
		{ label: "Facebook", iconSrc: facebookIconSrc },
		{ label: "LinkedIn", iconSrc: linkedinIconSrc },
	] as const;

	const onCopyText = async () => {
		try {
			await navigator.clipboard.writeText(shareText);
		} catch {
			// Fail silently if clipboard is unavailable.
		}
	};

	return (
		<main className="min-h-dvh bg-[#f8f8f8] text-black">
			<section className="mx-auto min-h-dvh w-full max-w-98.25 bg-[#f8f8f8]">
				<div className="sticky top-0 z-30 bg-[#eef1f4]">
					<header className="border-b border-[#f3f4f6] px-[clamp(16px,6vw,24px)] py-[clamp(12px,4vw,16px)]">
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

					<header className="flex items-center gap-4 border-b-[0.612px] border-[#f3f4f6] px-6 py-4">
						<Link href={statsHref} aria-label="Back to stats" className="inline-flex h-8 w-8 items-center justify-center rounded-full">
							<Image src={backIconSrc} alt="" width={18} height={18} className="h-[17.998px] w-[17.998px]" />
						</Link>
						<h1 className="font-sans text-[17px] font-bold leading-[25.5px] text-black">Share Your Results</h1>
					</header>
				</div>

				<div className="px-6 py-6">
					<div className="relative h-[375.905px] w-[344.94px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#08394d] to-[#0e6b7c]">
						<div className="absolute -top-8 left-[216.94px] h-40 w-40 rounded-full bg-[#ff8d00]/20" />
						<div className="absolute left-[-23.99px] top-[287.91px] h-[127.992px] w-[127.992px] rounded-full bg-[#ff8d00]/10" />

						<div className="absolute left-6 top-6 w-[296.952px]">
							<Image src={impactfulSrc} alt="Impactful" width={96} height={48} unoptimized className="h-[47.997px] w-[96.204px] object-contain" />
							<p className="pt-4 font-mono text-xs font-bold tracking-[0.1em] text-white/60">MY TOWN RESULTS</p>
							<p className="pt-1 font-sans text-[20px] font-bold leading-7 text-white">I shaped my digital community.</p>

							<div className="grid grid-cols-[90.98px_90.99px_90.99px] gap-3 pt-5">
								<StatPill iconSrc={trustSrc} label="TRUST" value={trust} from={50} />
								<StatPill iconSrc={revenueSrc} label="REVENUE" value={revenue} from={1000} />
								<StatPill iconSrc={populationSrc} label="POPULATION" value={population} from={500} />
							</div>

							<p className="pt-4 text-center font-mono text-[11px] text-white/40">impactful.uvu.edu</p>
						</div>
					</div>

					<div className="w-[344.94px] pt-5">
						<p className="font-mono text-xs font-bold tracking-[0.1em] text-[#99a1af]">SHARE TO</p>
						<div className="grid h-[127.323px] grid-cols-[166.47px_166.47px] grid-rows-[57.67px_57.67px] gap-3 pt-3">
							{shareTargets.map((target) => (
								<button
									key={target.label}
									type="button"
									className="flex items-center gap-3 rounded-[20px] border-[1.836px] border-[#f1f3f6] bg-white px-4 shadow-[0px_4px_0px_#eff1f5]"
								>
									<Image src={target.iconSrc} alt="" width={22} height={22} className="h-[21.995px] w-[21.995px]" />
									<span className="font-sans text-sm font-bold leading-[21px] text-black">{target.label}</span>
								</button>
							))}
						</div>
					</div>

					<div className="pt-5">
						<button
							type="button"
							onClick={onCopyText}
							className="flex w-[344.94px] items-center gap-3 rounded-[20px] border-[1.836px] border-[#f1f3f6] bg-white px-5 py-4 shadow-[0px_4px_0px_#eff1f5]"
						>
							<Image src={linkImageSrc} alt="" width={40} height={40} unoptimized className="h-[39.993px] w-[39.993px] object-contain" />
							<span className="font-sans text-sm font-bold leading-[21px] text-black">Copy shareable text</span>
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}

export default function ShareResultsPage({ searchParams, moduleSlug }: ShareResultsScreenProps) {
	return <ShareResultsScreen moduleSlug={moduleSlug} searchParams={searchParams} />;
}