import Image from "next/image";
import Link from "next/link";

type ModuleInfo = {
	title: string;
	subtitle: string;
	description: string;
	phase: string;
	meta: string[];
};

const moduleMap: Record<string, ModuleInfo> = {
	"deceptive-design": {
		title: "Digital Citizen",
		subtitle: "Deceptive Design module",
		description:
			"You're in charge of a growing digital town. Every design choice you make shapes how your citizens experience their online world. The path you choose decides what kind of community this becomes — and every decision leads somewhere different.",
		phase: "PHASE 1 OF 5",
		meta: ["5 phases", "10+ scenarios", "your path"],
	},
};

const illustrationSrc = "https://www.figma.com/api/mcp/asset/28e39449-71b0-4265-879e-596fca137b05";

export default async function ModuleStartPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const moduleInfo = moduleMap[slug] ?? moduleMap["deceptive-design"];
	const tutorialHref = `/modules/${slug}/tutorial`;

	return (
		<main className="min-h-dvh w-full overflow-x-hidden bg-white text-black">
			<section className="flex min-h-dvh w-full flex-col bg-white">
				<div className="flex flex-[0.9] min-h-0 flex-col items-center justify-center bg-black px-[clamp(24px,7vw,32px)] py-[clamp(32px,9vw,48px)] text-white">
					<Image
						src={illustrationSrc}
						alt=""
						width={220}
						height={220}
						unoptimized
						className="h-[clamp(180px,52vw,220px)] w-[clamp(180px,52vw,220px)] shrink-0 object-cover"
					/>
					<div className="mt-[clamp(24px,6vw,32px)] text-center">
						<p className="font-sans text-[clamp(22px,6vw,24px)] font-semibold leading-none tracking-wider text-[#99a1af]">
							{moduleInfo.title.toUpperCase()}
						</p>
						<p className="mt-2 font-sans text-[clamp(18px,5vw,20px)] leading-[1.2] text-[#6a7282]">
							{moduleInfo.subtitle}
						</p>
					</div>
				</div>

				<div className="flex flex-[1.1] min-h-0 flex-col justify-between overflow-y-auto px-[clamp(24px,7vw,32px)] py-[clamp(28px,8vw,44px)] text-black">
					<div>
						<div className="inline-flex border-[1.827px] border-black px-[17.827px] py-[5.827px]">
							<p className="font-mono text-[14px] font-bold leading-5 tracking-widest text-black">
								{moduleInfo.phase}
							</p>
						</div>

						<h1 className="mt-8 max-w-48 font-sans text-[clamp(32px,9vw,36px)] font-bold leading-tight tracking-[-0.06em] text-black">
							Your Story
							<br />
							Begins
						</h1>

						<p className="mt-6 max-w-79.25 font-sans text-[clamp(15px,4vw,16px)] leading-relaxed text-[#4a5565]">
							{moduleInfo.description}
						</p>

						<div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[clamp(11px,2.8vw,12px)] font-semibold leading-4 text-[#6a7282]">
							{moduleInfo.meta.map((item, index) => (
								<div key={item} className="flex items-center gap-6">
									<p>{item}</p>
									{index < moduleInfo.meta.length - 1 ? <span aria-hidden="true">·</span> : null}
								</div>
							))}
						</div>
					</div>

					<div className="mt-10">
						<Link
							href={tutorialHref}
								className="flex min-h-[clamp(54px,14vw,58px)] items-center justify-center border-[1.827px] border-black px-6 text-center font-mono text-[clamp(15px,4vw,16px)] font-bold tracking-widest text-black"
						>
							[ BEGIN YOUR STORY ] →
						</Link>
						<Link
							href="/dashboard"
								className="mx-auto mt-4 flex min-h-[clamp(46px,12vw,50px)] w-full max-w-44 items-center justify-center bg-black px-6 text-center font-mono text-[14px] font-bold tracking-widest text-white"
						>
								← [ BACK ]
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}