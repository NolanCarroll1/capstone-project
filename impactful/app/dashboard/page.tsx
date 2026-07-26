import Link from "next/link";

export default function DashboardPage() {
	return (
		<main className="min-h-screen bg-[#f3f1ec] px-4 py-8 text-black sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
			<section className="w-full max-w-[1040px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
				<div className="grid lg:grid-cols-[1.05fr_0.95fr]">
					<div className="bg-black px-6 py-8 text-white lg:px-10 lg:py-12">
						<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#8f98aa]">
							DASHBOARD
						</p>
						<h1 className="mt-4 font-sans text-[44px] font-bold leading-[0.95] tracking-[-0.06em] text-white">
							Your learning home.
						</h1>
						<p className="mt-5 max-w-[320px] font-sans text-[17px] leading-[1.65] text-[#c7cfdd]">
							Track your progress, jump back into the latest module, and review your results.
						</p>

						<div className="mt-10 rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
							<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
								NEXT STEP
							</p>
							<p className="mt-2 font-sans text-[16px] leading-[1.55] text-white">
								Open Modules to choose a lesson and continue the flow.
							</p>
						</div>
					</div>

					<div className="px-6 py-8 lg:px-10 lg:py-12">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
									OVERVIEW
								</p>
								<h2 className="mt-2 font-sans text-[30px] font-bold tracking-[-0.04em] text-black">
									Current progress
								</h2>
							</div>
							<Link href="/modules" className="rounded-full bg-[#eef1f5] px-3 py-1 font-sans text-[12px] font-semibold text-[#667085] transition-colors hover:bg-[#e3e7ee]">
								View modules
							</Link>
						</div>

						<div className="mt-8 grid gap-4 sm:grid-cols-2">
							<div className="rounded-[20px] border border-[#e4e8ef] bg-[#fafbfc] px-5 py-5">
								<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
									Continue
								</p>
								<h3 className="mt-3 font-sans text-[24px] font-bold tracking-[-0.04em] text-black">
									Deceptive Design
								</h3>
								<p className="mt-3 font-sans text-[15px] leading-[1.55] text-[#5d6778]">
									Resume the module you started most recently.
								</p>
								<Link href="/modules/deceptive-design" className="mt-6 inline-flex h-[44px] items-center justify-center bg-black px-4 font-mono text-[13px] font-bold tracking-[0.18em] text-white">
									[ OPEN ]
								</Link>
							</div>

							<div className="rounded-[20px] border border-[#e4e8ef] bg-[#fafbfc] px-5 py-5">
								<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98a0b3]">
									Results
								</p>
								<h3 className="mt-3 font-sans text-[24px] font-bold tracking-[-0.04em] text-black">
									Your stats
								</h3>
								<p className="mt-3 font-sans text-[15px] leading-[1.55] text-[#5d6778]">
									See how your choices affected trust, revenue, and population.
								</p>
								<Link href="/stats" className="mt-6 inline-flex h-[44px] items-center justify-center border-2 border-black bg-white px-4 font-mono text-[13px] font-bold tracking-[0.18em] text-black">
									[ VIEW STATS ]
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}