"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const topMascotSrc = "/assets/figma-capstone/tutorial-top-mascot-node-1118-1896.png";
const sheetMascotSrc = "/assets/figma-capstone/tutorial-sheet-mascot-node-1118-1976.png";
const wordmarkSrc = "/assets/figma-capstone/story-begins-impactful-wordmark-node-1117-939.png";

const tutorialSlides = [
	{
		eyebrow: "HOW IT WORKS",
		title: "You run a digital town",
		description: "Each decision you make shapes your citizens' experience and your town's health over time.",
		primaryLabel: "Next →",
	},
	{
		eyebrow: "MAKING CHOICES",
		title: "Three options. One path.",
		description: "Each phase has a real design dilemma. Choose A, B, or C — each reflects a different ethical stance.",
		primaryLabel: "Next →",
	},
	{
		eyebrow: "YOUR IMPACT",
		title: "Every choice has a cost",
		description: "After each choice you'll see how Trust, Revenue, and Population changed. Your stats tell the story.",
		primaryLabel: "Let's Play",
	},
] as const;

type TutorialStep = 1 | 2 | 3;

type TutorialScreenProps = {
	moduleSlug?: string;
};

export function TutorialScreen({ moduleSlug = "deceptive-design" }: TutorialScreenProps) {
	const [step, setStep] = useState<TutorialStep>(1);
	const router = useRouter();
	const currentSlide = tutorialSlides[step - 1];

	const goNext = () => setStep((current) => Math.min(current + 1, 3) as TutorialStep);
	const goBack = () => setStep((current) => Math.max(current - 1, 1) as TutorialStep);
	const startPlaying = () => {
		router.push(`/modules/${moduleSlug}/game`);
	};

	return (
		<main className="min-h-dvh bg-[#f1f3f5] text-black">
			<section className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-white">
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
						<button type="button" aria-label="Open menu" className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[#08394d]">
							<span className="text-[22px] leading-none">≡</span>
						</button>
					</div>
				</header>

				<div className="h-[calc(100dvh-72px)] overflow-hidden px-[clamp(16px,5.4vw,24px)] pb-[clamp(14px,4vw,24px)] pt-[clamp(12px,4vw,20px)]">
					<div className="flex items-center justify-between gap-4">
						<p className="font-sans text-[12px] font-bold tracking-[0.1em] text-[#6a7282]">PHASE 1 OF 5</p>
						<div className="flex gap-1.5">
							<span className="h-1.5 w-5 rounded-full bg-[#08394d]" />
							<span className="h-1.5 w-1.5 rounded-full bg-[#d1d5db]" />
							<span className="h-1.5 w-1.5 rounded-full bg-[#d1d5db]" />
							<span className="h-1.5 w-1.5 rounded-full bg-[#d1d5db]" />
							<span className="h-1.5 w-1.5 rounded-full bg-[#d1d5db]" />
						</div>
					</div>

					<p className="mt-[clamp(12px,3.6vw,20px)] font-mono text-[11px] font-bold tracking-[0.08em] text-[#99a1af]">SCENARIO</p>

					<div className="mt-2 flex items-start gap-[clamp(8px,2.8vw,12px)]">
						<div className="relative h-[clamp(116px,37vw,160px)] w-[clamp(84px,27vw,117px)] shrink-0 overflow-hidden">
							<Image
								src={topMascotSrc}
								alt=""
								aria-hidden
								width={778}
								height={520}
								unoptimized
								className="absolute max-w-none"
								style={{ width: "664.94%", height: "325.08%", left: "-564.94%", top: "-225.08%" }}
							/>
						</div>

						<div className="rounded-[20px] bg-[rgba(255,141,0,0.24)] px-[clamp(12px,4vw,20px)] py-[clamp(12px,3.8vw,16px)]">
							<p className="font-sans text-[clamp(14px,4.2vw,15px)] font-bold leading-[1.52] text-[#1e1c1c]">
								Your town’s digital marketplace is launching. Every visit needs a cookie consent experience. How should it work?
							</p>
						</div>
					</div>

					<div className="-mx-[clamp(16px,5.4vw,24px)] mt-[clamp(14px,4vw,24px)] overflow-hidden px-[clamp(16px,5.4vw,24px)] pb-[clamp(10px,3.2vw,16px)]">
						<div className="flex gap-4">
							<div className="relative w-[calc(100vw-56px)] max-w-[360px] shrink-0 rounded-[24px] border-2 border-[#f1f3f6] bg-white p-[clamp(18px,5.6vw,26px)] text-left shadow-[0px_4px_0px_#eff1f5]">
								<p className="font-mono text-[clamp(20px,6vw,22px)] font-bold leading-[1.2] text-[#121212]">OPTION A</p>
								<p className="pt-2 font-sans text-[clamp(14px,4.3vw,16px)] leading-[1.4] text-[#08394d]">Equal-sized Accept and Decline buttons with plain-language explanation. Citizens choose freely.</p>
								<div className="mt-[clamp(12px,3.8vw,20px)] border-2 border-[#d7dae0] bg-white p-[clamp(10px,3.4vw,12px)] shadow-[inset_0px_4px_0px_#c9ced6]">
									<p className="font-sans text-[12px] font-bold leading-4 text-black">We use cookies</p>
									<p className="mt-3 font-sans text-[12px] leading-4 text-[#6a7282]">We collect browsing data to improve your experience. You choose what to share.</p>
									<div className="mt-3 grid grid-cols-2 gap-3">
										<div className="rounded-[4px] bg-[#85d79a] py-2 text-center font-sans text-[12px] font-bold text-[#0f6826]">Accept</div>
										<div className="rounded-[4px] bg-[#ffe0d7] py-2 text-center font-sans text-[12px] font-bold text-[#9f2600]">Decline</div>
									</div>
								</div>
							</div>
							<div className="w-[calc(100vw-56px)] max-w-[360px] shrink-0 rounded-[24px] border-2 border-[#f1f3f6] bg-white opacity-30" />
						</div>
					</div>

					<div className="mt-[clamp(8px,2.8vw,12px)] flex items-center justify-center gap-[clamp(10px,3.2vw,16px)]">
						<div className="flex h-[clamp(36px,10vw,40px)] w-[clamp(36px,10vw,40px)] items-center justify-center rounded-full bg-[#e5e7eb] font-mono text-[clamp(13px,3.8vw,14px)] font-bold text-[#9ca3af]">A</div>
						<div className="flex h-[clamp(36px,10vw,40px)] w-[clamp(36px,10vw,40px)] items-center justify-center rounded-full bg-[#e5e7eb] font-mono text-[clamp(13px,3.8vw,14px)] font-bold text-[#9ca3af]">B</div>
						<div className="flex h-[clamp(36px,10vw,40px)] w-[clamp(36px,10vw,40px)] items-center justify-center rounded-full bg-[#e5e7eb] font-mono text-[clamp(13px,3.8vw,14px)] font-bold text-[#9ca3af]">C</div>
					</div>

					<button type="button" className="mt-[clamp(14px,4vw,24px)] h-[clamp(46px,13vw,50px)] w-full rounded-full bg-[#ffe4c3] px-6 font-sans text-[clamp(15px,4.2vw,16px)] font-bold leading-none text-[#fff7ea] shadow-[0_4px_0_#ffc987]">
						Choose This Path
					</button>

					<div className="mt-[clamp(10px,3vw,16px)] flex items-center justify-between gap-3">
						<p className="font-sans text-[clamp(11px,3.2vw,12px)] text-[#99a1af]">Choices made: 0 / 5</p>
						<div className="shrink-0 rounded-full border border-[#d1d5db] px-3 py-1 font-mono text-[11px] font-bold tracking-[0.08em] text-[#4b5563]">RESET</div>
					</div>
				</div>

				<div className="pointer-events-none absolute inset-0 z-10 bg-[rgba(0,0,0,0.35)]" />

				<section
					className="absolute inset-x-0 bottom-0 z-20 flex h-[clamp(320px,46dvh,420px)] flex-col rounded-t-[24px] bg-white px-[clamp(16px,5.6vw,24px)] pt-[clamp(14px,4.6vw,20px)] shadow-[0_-8px_20px_rgba(0,0,0,0.18)]"
					style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
				>
					<div className="relative flex items-center pb-5">
						<div className="absolute left-1/2 top-[-8px] h-1 w-10 -translate-x-1/2 rounded-full bg-[#e5e7eb]" />
						<button
							type="button"
							onClick={startPlaying}
							className="ml-auto font-mono text-[12px] font-bold tracking-[0.1em] text-[#99a1af]"
						>
							SKIP
						</button>
					</div>

					<div className="flex items-center gap-2 pb-5">
						{[1, 2, 3].map((index) => {
							const isActive = index === step;
							return isActive ? (
								<div key={index} className="h-[6px] w-5 rounded-full bg-[#ff8d00]" />
							) : (
								<div key={index} className="h-[6px] w-[6px] rounded-full bg-[#e5e7eb]" />
							);
						})}
					</div>

					<div className="min-h-0 flex-1 overflow-hidden">
						<div className="flex min-h-full items-center">
							<div className="flex items-start gap-[clamp(10px,3.5vw,16px)] pb-[clamp(12px,3.4dvh,18px)]">
								<div className="relative h-[clamp(52px,8dvh,80px)] w-[clamp(50px,7.8dvh,76px)] shrink-0 overflow-hidden">
								<img
									src={sheetMascotSrc}
									alt=""
									aria-hidden
									className="absolute max-w-none"
									style={{ width: "412.9%", height: "266.67%", left: "-105.65%", top: "-13.54%" }}
								/>
								</div>
								<div className="min-w-0">
									<p className="font-mono text-[clamp(9px,1.3dvh,11px)] font-bold tracking-[0.1em] text-[#99a1af]">{currentSlide.eyebrow}</p>
									<p className="pt-1 font-sans text-[clamp(15px,2.6dvh,20px)] font-bold leading-[1.3] text-black">{currentSlide.title}</p>
									<p className="pt-1 font-sans text-[clamp(12px,2dvh,15px)] leading-[1.55] text-[#6a7282]">{currentSlide.description}</p>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-auto -mx-[clamp(16px,5.6vw,24px)] flex gap-[clamp(8px,2.8vw,12px)] bg-white px-[clamp(16px,5.6vw,24px)] pb-[max(0px,env(safe-area-inset-bottom))] pt-2">
						{step > 1 ? (
							<button
								type="button"
								onClick={goBack}
								className="h-[clamp(46px,13vw,50px)] min-w-0 flex-1 rounded-full border-[1.827px] border-[#e5e7eb] bg-white px-3 font-sans text-[14px] font-bold leading-[1.2] text-[#6a7282]"
							>
								← Back
							</button>
						) : null}

						<button
							type="button"
							onClick={step < 3 ? goNext : startPlaying}
							className="h-[clamp(46px,13vw,50px)] min-w-0 flex-1 rounded-full bg-[#ff8d00] px-3 font-sans text-[clamp(14px,3.8vw,15px)] font-bold leading-[1.2] text-white shadow-[0_4px_0_#b46300]"
						>
							{currentSlide.primaryLabel}
						</button>
					</div>
				</section>
			</section>
		</main>
	);
}
