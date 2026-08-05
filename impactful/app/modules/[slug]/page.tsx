import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { ModuleTopMenu } from "../_components/ModuleTopMenu";
import { adminAssets } from "@/app/admin/_assets";

type ModuleInfo = {
	continuePhase: string;
	progress: number;
	currentScenario: string;
};

const moduleMap: Record<string, ModuleInfo> = {
	"deceptive-design": {
		continuePhase: "Phase 1 | Cookie Consent",
		progress: 20,
		currentScenario: "Deceptive Design",
	},
};

const moduleTiles = [
	{
		label: "LIVE",
		title: "Deceptive Design",
		background: "#ff8d00",
		badgeBackground: "rgba(255,255,255,0.2)",
		imageOpacity: 1,
		href: "/modules/deceptive-design",
	},
	{
		label: "SOON",
		title: "",
		background: "#6b7280",
		badgeBackground: "rgba(0,0,0,0.2)",
		imageOpacity: 0.75,
	},
	{
		label: "SOON",
		title: "",
		background: "#7c3aed",
		badgeBackground: "rgba(0,0,0,0.2)",
		imageOpacity: 0.75,
	},
	{
		label: "SOON",
		title: "",
		background: "#0e9f6e",
		badgeBackground: "rgba(0,0,0,0.2)",
		imageOpacity: 0.75,
	},
] as const;

type ModuleTileProps = {
	label: string;
	title: string;
	background: string;
	badgeBackground: string;
	imageOpacity: number;
	href?: string;
};

function ModuleTile({
	label,
	title,
	background,
	badgeBackground,
	imageOpacity,
	href,
}: ModuleTileProps) {
	const tile = (
		<div
			className="relative aspect-[164.68/189.99] overflow-hidden rounded-[18px] p-4 shadow-[4px_4px_2px_rgba(0,0,0,0.1)]"
			style={{ backgroundColor: background, opacity: imageOpacity }}
		>
			<span
				className="inline-flex rounded-full px-2 py-[2px] font-mono text-[10px] font-bold leading-[15px] tracking-[0.04em] text-white"
				style={{ backgroundColor: badgeBackground }}
			>
				{label}
			</span>
			<div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/20" />
			<Image
				src={adminAssets.mascot}
				alt=""
				aria-hidden
				width={104}
				height={113}
				unoptimized
				className="pointer-events-none absolute left-[50%] top-[50%] h-[113px] w-[104px] -translate-x-1/2 -translate-y-[45%] select-none object-contain"
				style={{ imageRendering: "pixelated" }}
			/>
			{title ? (
				<p className="absolute bottom-4 left-4 max-w-30 font-sans text-[16px] font-semibold leading-6 tracking-[-0.03em] text-white">
					{title}
				</p>
			) : null}
		</div>
	);

	if (href) {
		return (
			<Link href={href} className="block">
				{tile}
			</Link>
		);
	}

	return tile;
}

export default async function ModuleStartPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const moduleInfo = moduleMap[slug] ?? moduleMap["deceptive-design"];
	const tutorialHref = `/modules/${slug}/tutorial`;

	return (
		<main className="min-h-dvh w-full bg-white text-black">
			<section className="mx-auto min-h-dvh w-full max-w-[430px] bg-white">
				<header className="border-b border-[#f3f4f6] bg-[#eef1f4] px-6 py-4">
					<div className="flex items-center justify-between">
						<p className="font-sans text-[26px] font-bold lowercase leading-none tracking-[-0.04em] text-[#2b3b38]">
							impactful
						</p>
						<ModuleTopMenu />
					</div>
				</header>

				<div className="px-6 pb-10 pt-8">
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-4">
							<Image
								src={adminAssets.mascot}
								alt=""
								aria-hidden
								width={73}
								height={100}
								unoptimized
								className="h-[100px] w-[73px] object-contain"
								style={{ imageRendering: "pixelated" }}
							/>
							<div>
								<h1 className="font-sans text-[20px] font-bold leading-[30px] tracking-[-0.04em] text-[#2a3447]">
									Hi, Jane
								</h1>
								<p className="mt-1 font-sans text-[12px] leading-[18px] text-black/50">
									Let&apos;s learn something new!
								</p>
							</div>
						</div>
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0e6b7c] font-sans text-[14px] font-bold text-white">
							JD
						</div>
					</div>

					<div className="mt-5 flex h-[51px] items-center gap-3 rounded-[15px] bg-[#eef1f4] px-4">
						<Search className="h-[18px] w-[18px] text-black/40" />
						<span className="font-sans text-[16px] leading-6 text-black/40">Search modules</span>
					</div>

					<p className="pb-3 pt-6 font-sans text-[16px] font-semibold leading-6 text-black">
						Continue module
					</p>

					<Link
						href={tutorialHref}
						className="relative block overflow-hidden rounded-[18px] bg-[#08394d] px-5 py-5 text-white shadow-[4px_4px_2px_rgba(0,0,0,0.1)]"
					>
						<div className="absolute -left-8 -top-8 h-44 w-44 rounded-full bg-[#ff8d00] opacity-20" />
						<div className="relative">
							<p className="font-sans text-[30px] font-bold leading-[22.5px] tracking-[-0.03em]">
								{moduleInfo.currentScenario}
							</p>
							<p className="mt-3 font-sans text-[8px] font-medium leading-3 text-white/60">
								{moduleInfo.continuePhase}
							</p>
							<div className="mt-4 flex items-center gap-3">
								<div className="h-[3px] flex-1 rounded-full bg-white/20">
									<div className="h-full rounded-full bg-[#ff8d00]" style={{ width: `${moduleInfo.progress}%` }} />
								</div>
								<span className="font-sans text-[7px] leading-[10px] text-white/60">{moduleInfo.progress}%</span>
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff8d00] text-[10px] text-white">
									▶
								</span>
							</div>
						</div>
					</Link>

					<p className="pb-3 pt-8 font-sans text-[16px] font-semibold leading-6 text-black">
						All Modules
					</p>

					<div className="grid grid-cols-2 gap-4">
						{moduleTiles.map((tile) => (
							<ModuleTile key={`${tile.label}-${tile.background}`} {...tile} />
						))}
					</div>
				</div>
			</section>
		</main>
	);
}