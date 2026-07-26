import Link from "next/link";

const modules = [
	{
		slug: "deceptive-design",
		title: "Deceptive Design",
		summary: "Learn how interface choices shape trust, revenue, and participation.",
		status: "Available now",
	},
	{
		slug: "privacy-patterns",
		title: "Privacy Patterns",
		summary: "Coming soon",
		status: "Locked",
	},
	{
		slug: "dark-patterns",
		title: "Dark Patterns",
		summary: "Coming soon",
		status: "Locked",
	},
] as const;

export default function ModulesPage() {
	return (
		<main className="min-h-screen bg-[#f3f1ec] px-4 py-8 text-black sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
			<section className="w-full max-w-[1180px] overflow-hidden bg-white shadow-[0_20px_80px_rgba(0,0,0,0.12)] sm:rounded-[28px]">
				<div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
					<div className="bg-black px-6 py-8 text-white lg:px-8 lg:py-10">
						<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8f98aa]">
							MODULES
						</p>
						<h1 className="mt-4 font-sans text-[42px] font-bold leading-[0.96] tracking-[-0.06em] text-white">
							Choose a module.
						</h1>
						<p className="mt-5 max-w-[260px] font-sans text-[16px] leading-[1.6] text-[#c7cfdd]">
							Each module begins with a start page, then the tutorial, the game, and the final stats.
						</p>
						<div className="mt-10 rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
							<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
								PATH
							</p>
							<p className="mt-2 font-sans text-[16px] leading-[1.55] text-white">
								Dashboard → Modules → Start Page → Tutorial → Game → Stats
							</p>
						</div>
					</div>

					<div className="px-6 py-8 lg:px-10 lg:py-10">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
									LIBRARY
								</p>
								<h2 className="mt-2 font-sans text-[28px] font-bold tracking-[-0.04em] text-black">
									Available modules
								</h2>
							</div>
							<Link href="/dashboard" className="rounded-full bg-[#eef1f5] px-3 py-1 font-sans text-[12px] font-semibold text-[#667085] transition-colors hover:bg-[#e3e7ee]">
								Back to dashboard
							</Link>
						</div>

						<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{modules.map((module) => {
								const isAvailable = module.slug === "deceptive-design";

								const card = (
									<article
										className={`flex h-full flex-col justify-between rounded-[20px] border px-5 py-5 transition-transform hover:-translate-y-0.5 ${
											isAvailable ? "border-black bg-black text-white" : "border-[#e4e8ef] bg-white text-black"
										}`}
									>
										<div>
											<p className={`font-sans text-[11px] font-semibold uppercase tracking-[0.18em] ${isAvailable ? "text-[#8f98aa]" : "text-[#98a0b3]"}`}>
												{module.status}
											</p>
											<h3 className="mt-3 font-sans text-[24px] font-bold leading-[1.08] tracking-[-0.04em]">
												{module.title}
											</h3>
											<p className={`mt-3 max-w-[240px] font-sans text-[15px] leading-[1.55] ${isAvailable ? "text-[#d1d7e2]" : "text-[#5d6778]"}`}>
												{module.summary}
											</p>
										</div>
										<div className="mt-8 flex items-center justify-between">
											<span className={`font-mono text-[13px] font-bold tracking-[0.18em] ${isAvailable ? "text-white" : "text-black"}`}>
												{isAvailable ? "[ START MODULE ]" : "[ LOCKED ]"}
											</span>
											<span className={`${isAvailable ? "text-white" : "text-black"}`}>→</span>
										</div>
									</article>
								);

								return isAvailable ? (
									<Link key={module.slug} href={`/modules/${module.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
										{card}
									</Link>
								) : (
									<div key={module.slug} aria-disabled="true" className="opacity-75">
										{card}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}