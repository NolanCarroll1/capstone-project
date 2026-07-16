"use client";

import { useState } from "react";

const stepLabels = ["HOW IT WORKS", "MAKING CHOICES", "SEEING IMPACT"];

const choices = [
	{
		key: "A",
		label: "The ethical route",
		active: true,
	},
	{
		key: "B",
		label: "The middle ground",
		active: false,
	},
	{
		key: "C",
		label: "The aggressive route",
		active: false,
	},
];

const impactStats = [
	{
		label: "Trust",
		value: "50",
		delta: "-12",
		endValue: "38",
		progress: "8%",
	},
	{
		label: "Revenue",
		value: "1000",
		delta: "+420",
		endValue: "1420",
		progress: "94%",
	},
];

type TutorialStep = 1 | 2 | 3;

export default function TutorialPage() {
	const [step, setStep] = useState<TutorialStep>(1);

	const goNext = () => setStep((current) => Math.min(current + 1, 3) as TutorialStep);
	const goBack = () => setStep((current) => Math.max(current - 1, 1) as TutorialStep);

	return (
		<main className="min-h-screen bg-black px-0 py-0 text-white sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
			<section className="flex min-h-screen w-full flex-col overflow-hidden bg-black sm:min-h-[852px] sm:max-w-[393px]">
				<header className="px-8 pb-12 pt-12">
					<p className="font-sans text-[12px] font-semibold tracking-[0.18em] text-[#8e98ac]">
						TUTORIAL
					</p>

					<div className="mt-8 space-y-5">
						{stepLabels.map((label, index) => {
							const stepNumber = (index + 1) as TutorialStep;
							const isActive = step === stepNumber;
							const isComplete = step > stepNumber;

							return (
								<div key={label} className="flex items-center gap-4">
									<div
										className={`flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-bold ${
											isComplete
												? "bg-[#334155] text-white"
												: isActive
													? "bg-white text-black"
													: "bg-[#1f2937] text-[#4b5563]"
										}`}
									>
										{isComplete ? "✓" : stepNumber}
									</div>
									<p
										className={`font-sans text-[16px] font-semibold tracking-[0.04em] ${
											isActive ? "text-white" : isComplete ? "text-[#6b7280]" : "text-[#344152]"
										}`}
									>
										{label}
									</p>
								</div>
							);
						})}
					</div>

					<div className="mt-10 flex items-center gap-3">
						{stepLabels.map((_, index) => {
							const barStep = index + 1;
							const filled = step >= barStep;
							return (
								<div
									key={barStep}
									className={`h-1 flex-1 rounded-full ${filled ? "bg-white" : "bg-[#2f3a4a]"}`}
								/>
							);
						})}
					</div>

					<p className="mt-3 font-sans text-[14px] text-[#8e98ac]">{step} of 3</p>
				</header>

				<section className="mt-auto bg-white px-8 pb-10 pt-10 text-black">
					{step === 1 ? (
						<div className="space-y-5">
							<p className="font-sans text-[12px] font-semibold tracking-[0.18em] text-[#a0a8b7]">
								HOW IT WORKS
							</p>

							<h1 className="max-w-[280px] font-sans text-[34px] font-bold leading-[1.08] tracking-[-0.05em] text-black">
								You run a digital town
							</h1>

							<p className="max-w-[330px] font-sans text-[18px] leading-[1.55] tracking-[-0.01em] text-[#546176]">
								You&apos;re the designer behind a growing online community. Each decision you
								make — from cookie banners to checkout flows — shapes your citizens&apos;
								experience and the town&apos;s health over time.
							</p>
						</div>
					) : step === 2 ? (
						<div>
							<div className="space-y-5">
								<p className="font-sans text-[12px] font-semibold tracking-[0.18em] text-[#a0a8b7]">
									MAKING CHOICES
								</p>

								<h1 className="max-w-[280px] font-sans text-[34px] font-bold leading-[1.08] tracking-[-0.05em] text-black">
									Three options. One path.
								</h1>

								<p className="max-w-[330px] font-sans text-[18px] leading-[1.55] tracking-[-0.01em] text-[#546176]">
									Each phase presents a real design dilemma. You choose from three options
									— A, B, or C — each reflecting a different ethical stance. There are no
									objectively right answers, only consequences.
								</p>
							</div>

							<div className="mt-10 space-y-4">
								{choices.map((choice) => (
									<button
										key={choice.key}
										type="button"
										className={`flex w-full items-center gap-4 rounded-[16px] border px-4 py-4 text-left transition-colors ${
											choice.active
												? "border-[#2f3640] bg-white"
												: "border-[#e0e5ee] bg-white"
										}`}
									>
										<div
											className={`flex h-10 w-10 items-center justify-center rounded-[6px] text-[16px] font-bold ${
												choice.active ? "bg-black text-white" : "bg-[#f0f2f6] text-[#4b5563]"
											}`}
										>
											{choice.key}
										</div>
										<p className="font-sans text-[16px] text-[#5a6475]">{choice.label}</p>
									</button>
								))}
							</div>
						</div>
					) : (
						<div>
							<div className="space-y-5">
								<p className="font-sans text-[12px] font-semibold tracking-[0.18em] text-[#a0a8b7]">
									SEEING IMPACT
								</p>

								<h1 className="max-w-[280px] font-sans text-[34px] font-bold leading-[1.08] tracking-[-0.05em] text-black">
									Every choice has a cost
								</h1>

								<p className="max-w-[330px] font-sans text-[18px] leading-[1.55] tracking-[-0.01em] text-[#546176]">
									After each choice, you&apos;ll see how your town&apos;s Trust, Revenue, and
									Population changed — and why. At the end of all 5 phases, your final
									stats tell the story of the town you built.
								</p>
							</div>

							<div className="mt-10 space-y-4">
								{impactStats.map((stat) => (
									<article
										key={stat.label}
										className="rounded-[16px] border border-[#e6ebf2] px-4 py-4"
									>
										<div className="flex items-center justify-between">
											<p className="font-sans text-[12px] font-semibold tracking-[0.18em] text-[#7f8798]">
												{stat.label}
											</p>
											<div className="rounded bg-[#eef1f5] px-2 py-1 text-[12px] font-semibold text-[#737b8c]">
												{stat.delta === "+420" ? "▲ +420" : "▼ -12"}
											</div>
										</div>

										<div className="mt-3 flex items-center gap-3">
											<p className="font-sans text-[14px] text-[#a0a8b7]">{stat.value}</p>
											<div className="h-[6px] flex-1 rounded-full bg-[#edf0f4]">
												<div
													className={`h-full rounded-full ${stat.label === "Trust" ? "bg-[#c6ccd6]" : "bg-[#394150]"}`}
													style={{ width: stat.progress }}
												/>
											</div>
											<p className="font-sans text-[14px] font-semibold text-black">{stat.endValue}</p>
										</div>
									</article>
								))}
							</div>
						</div>
					)}

					<div className="mt-10 flex gap-4">
						{step > 1 ? (
							<button
								type="button"
								onClick={goBack}
								className="flex h-[52px] flex-1 items-center justify-center border-2 border-black bg-white font-mono text-[16px] font-bold tracking-[0.18em] text-black transition-colors duration-200 hover:bg-[#f4f4f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
							>
								← BACK
							</button>
						) : null}

						{step < 3 ? (
							<button
								type="button"
								onClick={goNext}
								className="flex h-[52px] flex-1 items-center justify-center bg-black font-mono text-[16px] font-bold tracking-[0.18em] text-white transition-colors duration-200 hover:bg-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
							>
								NEXT →
							</button>
						) : (
							<button
								type="button"
								className="flex h-[52px] flex-1 items-center justify-center bg-black px-6 whitespace-nowrap text-center font-mono text-[16px] font-bold tracking-[0.12em] text-white transition-colors duration-200 hover:bg-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
							>
								<span>[ START PLAYING ]</span>
								<span aria-hidden="true" className="ml-2 text-[14px] leading-none">
									→
								</span>
							</button>
						)}
					</div>
				</section>
			</section>
		</main>
	);
}
