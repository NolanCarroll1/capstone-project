"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const topMascotSrc = "/assets/figma-capstone/tutorial-top-mascot-node-1118-1896.png";
const sheetMascotSrc = "/assets/figma-capstone/tutorial-sheet-mascot-node-1118-1976.png";

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
		<main className="min-h-dvh bg-white text-black">
			<section className="relative mx-auto min-h-dvh w-full max-w-[430px] overflow-hidden bg-[#f4f4f4]">
				<div className="relative z-0 px-[clamp(12px,4.2vw,16px)] pb-[clamp(108px,34vh,240px)] pt-[clamp(24px,6vh,43px)]">
					<div className="relative h-[clamp(38px,7.5vh,48px)] overflow-hidden">
						<button
							type="button"
							onClick={() => router.push(`/modules/${moduleSlug}`)}
							aria-label="Back"
							className="absolute left-1 top-[clamp(10px,2.8vh,16px)] text-[clamp(18px,5vw,22px)] leading-none text-[#6f7790]"
						>
							←
						</button>
						<div className="absolute left-1/2 top-[clamp(16px,3.2vh,21px)] h-1.5 w-[clamp(84px,28vw,100px)] -translate-x-1/2 rounded bg-[#99a1af]" />
						<div className="absolute left-1/2 top-[clamp(16px,3.2vh,21px)] h-1.5 w-[clamp(16px,5.6vw,20px)] -translate-x-[calc(clamp(84px,28vw,100px)/2)] rounded bg-[#08394d]" />
					</div>

					<div className="mt-[clamp(8px,2.2vh,12px)] flex items-center gap-[clamp(8px,2.8vw,12px)]">
						<div className="relative h-[clamp(116px,37vw,160px)] w-[clamp(84px,27vw,117px)] shrink-0 overflow-hidden">
							<img
								src={topMascotSrc}
								alt=""
								aria-hidden
								className="absolute max-w-none"
								style={{ width: "664.94%", height: "325.08%", left: "-564.94%", top: "-225.08%" }}
							/>
						</div>
						<div className="rounded-[20px] bg-[rgba(85,137,244,0.05)] px-[clamp(12px,4vw,20px)] py-[clamp(12px,3.8vw,16px)]">
							<p className="font-sans text-[clamp(12px,3.8vw,14px)] font-bold leading-[1.55] text-[#1e1c1c]">
								Your town’s digital marketplace is launching. Every visitor needs a cookie consent experience.
								How should it work?
							</p>
						</div>
					</div>

					<div className="mt-[clamp(12px,3vh,16px)] rounded-[24px] border-[1.827px] border-[#e5e7eb] bg-white p-[clamp(16px,5vw,26px)] shadow-[0_4px_0_#e5e7eb]">
						<p className="font-mono text-[clamp(17px,5.8vw,22px)] font-bold leading-[1.25] text-[#121212]">OPTION A</p>
						<p className="mt-[clamp(10px,3vh,20px)] font-sans text-[clamp(15px,4.5vw,17px)] font-bold leading-[1.45] text-[#121212]">Transparent Consent</p>
						<p className="mt-1 font-sans text-[clamp(14px,4.2vw,16px)] leading-[1.4] text-[#08394d]">
							Equal-sized Accept and Decline buttons with plain-language explanation. Citizens choose freely.
						</p>
						<div className="mt-[clamp(10px,3vh,20px)] rounded-[8px] border-[1.827px] border-[#e5e7eb] p-[clamp(10px,3.8vw,14px)] shadow-[inset_0_4px_0_#e5e7eb]">
							<p className="font-sans text-[12px] font-bold leading-4 text-black">We use cookies</p>
							<p className="mt-[clamp(8px,2.6vw,12px)] font-sans text-[12px] leading-4 text-[#6a7282]">
								We collect browsing data to improve your experience. You choose what to share.
							</p>
							<div className="mt-[clamp(8px,2.6vw,12px)] grid grid-cols-2 gap-[clamp(8px,2.8vw,12px)]">
								<div className="rounded bg-[#85d79a] py-[clamp(6px,2vw,8px)] text-center font-sans text-[12px] font-bold text-[#0f6826]">Accept</div>
								<div className="rounded bg-[#ffe0d7] py-[clamp(6px,2vw,8px)] text-center font-sans text-[12px] font-bold text-[#9f2600]">Decline</div>
							</div>
						</div>
					</div>
				</div>

				<div className="pointer-events-none absolute inset-0 z-10 bg-[rgba(0,0,0,0.35)]" />

				<section
					className="absolute inset-x-0 bottom-0 z-20 flex max-h-[78dvh] flex-col rounded-t-[24px] bg-white px-[clamp(16px,5.6vw,24px)] pt-[clamp(14px,4.6vw,20px)] shadow-[0_-8px_20px_rgba(0,0,0,0.18)]"
					style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
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

					<div className="min-h-0 flex-1 overflow-y-auto">
						<div className="flex items-start gap-[clamp(10px,3.5vw,16px)] pb-[clamp(16px,4.8vw,24px)]">
							<div className="relative h-[clamp(58px,20vw,70px)] w-[clamp(56px,19vw,68px)] shrink-0 overflow-hidden">
								<img
									src={sheetMascotSrc}
									alt=""
									aria-hidden
									className="absolute max-w-none"
									style={{ width: "412.9%", height: "266.67%", left: "-105.65%", top: "-13.54%" }}
								/>
							</div>
							<div className="min-w-0">
								<p className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#99a1af]">{currentSlide.eyebrow}</p>
								<p className="pt-1 font-sans text-[clamp(15px,4.6vw,17px)] font-bold leading-[1.35] text-black">{currentSlide.title}</p>
								<p className="pt-1 font-sans text-[clamp(12px,3.8vw,13px)] leading-[1.6] text-[#6a7282]">{currentSlide.description}</p>
							</div>
						</div>
					</div>

					<div className="sticky bottom-0 z-10 -mx-[clamp(16px,5.6vw,24px)] flex gap-[clamp(8px,2.8vw,12px)] bg-white px-[clamp(16px,5.6vw,24px)] pb-[max(0px,env(safe-area-inset-bottom))] pt-2">
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
