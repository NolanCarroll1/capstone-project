import Link from "next/link";

const moduleMap = {
	"deceptive-design": {
		title: "Deceptive Design",
		subtitle: "Module start page",
		description:
			"Read the setup, then continue into the tutorial to learn how the town simulation works.",
	},
} as const;

export default async function ModuleStartPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const moduleInfo = moduleMap[slug as keyof typeof moduleMap];

	if (!moduleInfo) {
		return (
			<main className="min-h-screen bg-[#f3f1ec] px-4 py-8 text-black sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
				<section className="w-full max-w-180 rounded-3xl bg-white px-6 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
					<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
						Module not found
					</p>
					<h1 className="mt-3 font-sans text-[32px] font-bold tracking-tighter text-black">
						That module is not available yet.
					</h1>
						<Link href="/dashboard" className="mt-8 inline-flex h-12 items-center justify-center bg-black px-6 font-mono text-[14px] font-bold tracking-[0.18em] text-white">
							[ BACK ]
					</Link>
				</section>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-[#f3f1ec] px-4 py-8 text-black sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
			<section className="grid w-full max-w-260 overflow-hidden bg-white shadow-[0_20px_80px_rgba(0,0,0,0.12)] lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[28px]">
				<div className="bg-black px-6 py-8 text-white lg:px-10 lg:py-12">
					<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8f98aa]">
						{moduleInfo.subtitle}
					</p>
					<h1 className="mt-4 font-sans text-[44px] font-bold leading-[0.95] tracking-[-0.06em] text-white">
						{moduleInfo.title}
					</h1>
					<p className="mt-5 max-w-85 font-sans text-[17px] leading-[1.65] text-[#c7cfdd]">
						{moduleInfo.description}
					</p>
				</div>

				<div className="px-6 py-8 lg:px-10 lg:py-12">
					<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
						BEFORE YOU START
					</p>
					<h2 className="mt-3 font-sans text-[30px] font-bold leading-[1.05] tracking-tighter text-black">
						What happens next
					</h2>

					<div className="mt-6 space-y-4">
						<div className="rounded-[18px] border border-[#e4e8ef] bg-[#fafbfc] px-4 py-4">
							<p className="font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-[#7d8598]">
								Step 1
							</p>
							<p className="mt-2 font-sans text-[16px] leading-[1.6] text-[#344054]">
								Continue into the tutorial to learn the core rules.
							</p>
						</div>

						<div className="rounded-[18px] border border-[#e4e8ef] bg-[#fafbfc] px-4 py-4">
							<p className="font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-[#7d8598]">
								Step 2
							</p>
							<p className="mt-2 font-sans text-[16px] leading-[1.6] text-[#344054]">
								Then the game opens, and your decisions lead into the final stats screen.
							</p>
						</div>
					</div>

					<div className="mt-8 flex gap-4">
						<Link href="/dashboard" className="flex h-13 flex-1 items-center justify-center border-2 border-black bg-white font-mono text-[15px] font-bold tracking-[0.18em] text-black">
							[ BACK ]
						</Link>
						<Link href={`/modules/${slug}/tutorial`} className="flex h-13 flex-1 items-center justify-center bg-black font-mono text-[15px] font-bold tracking-[0.18em] text-white">
							[ CONTINUE ]
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}