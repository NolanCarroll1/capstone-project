"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/admin/helpers";
import { ensureSeededModules, getModuleById, listModules } from "@/lib/admin/repository";
import type { LearningModule } from "@/lib/admin/types";
import { useEffect, useMemo, useState } from "react";

function EffectPill({ label, value }: { label: string; value: number }) {
	const tone = value >= 0 ? "text-[#166534] bg-[#e8f5ee]" : "text-[#b42318] bg-[#fff5f5]";
	const signed = value > 0 ? `+${value}` : String(value);

	return (
		<span className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold ${tone}`}>
			{label}: {signed}
		</span>
	);
}

export function ModulePreviewPanel({ moduleId }: { moduleId?: string }) {
	const [moduleData, setModuleData] = useState<LearningModule | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			ensureSeededModules();
			if (moduleId) {
				setModuleData(getModuleById(moduleId));
				setIsLoading(false);
				return;
			}

			const [latest] = listModules();
			setModuleData(latest ?? null);
			setIsLoading(false);
		}, 0);

		return () => {
			window.clearTimeout(timer);
		};
	}, [moduleId]);

	const phaseCount = useMemo(() => moduleData?.phases.length ?? 0, [moduleData]);

	if (isLoading) {
		return (
			<section className="rounded-2xl border border-[#e8ebf0] bg-white p-5">
				<p className="font-sans text-[14px] text-[#667388]">Loading preview...</p>
			</section>
		);
	}

	if (!moduleData) {
		return (
			<section className="rounded-2xl border border-[#e8ebf0] bg-white p-5">
				<p className="font-sans text-[14px] text-[#b42318]">No module found to preview.</p>
				<Link href="/admin/modules" className="mt-3 inline-flex text-[13px] font-semibold text-[#4b5563] underline">
					Return to modules
				</Link>
			</section>
		);
	}

	return (
		<section className="admin-card p-4 sm:p-5">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#95a0b2]">
						Preview Experience
					</p>
					<h2 className="mt-1 font-sans text-[24px] font-semibold tracking-[-0.03em] text-black">
						{moduleData.title}
					</h2>
					<p className="mt-2 font-sans text-[13px] text-[#667388]">
						{phaseCount} phases • {moduleData.estimatedMinutes} min • updated {formatDate(moduleData.updatedAt)}
					</p>
				</div>
				<div className="flex gap-2">
					<Link
						href={`/admin/modules/${moduleData.id}/edit`}
						className="inline-flex h-9 items-center justify-center rounded-lg border border-[#dde2ea] px-3 font-sans text-[12px] font-semibold text-[#4b5563]"
					>
						Edit Module
					</Link>
				</div>
			</div>

			<div className="admin-soft-panel mt-4 p-4">
				<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f9bb0]">Introduction</p>
				<p className="mt-2 font-sans text-[14px] leading-[1.6] text-[#445064]">{moduleData.introduction || "No introduction content."}</p>
			</div>

			<div className="admin-soft-panel mt-3 p-4">
				<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f9bb0]">Tutorial</p>
				<p className="mt-2 font-sans text-[14px] leading-[1.6] text-[#445064]">{moduleData.tutorial || "No tutorial content."}</p>
			</div>

			{moduleData.thumbnail ? (
				<div className="mt-3 overflow-hidden rounded-xl border border-[#e8edf4] bg-white">
					<Image
						src={moduleData.thumbnail}
						alt={`${moduleData.title} thumbnail`}
						width={1200}
						height={440}
						unoptimized
						className="h-44 w-full object-cover"
					/>
				</div>
			) : null}

			<div className="mt-4 space-y-4 lg:space-y-5">
				{moduleData.phases.map((phase) => (
					<article key={phase.id} className="rounded-xl border border-[#e9edf2] bg-[#fbfcfd] p-4 sm:p-5">
						<div className="flex items-center justify-between gap-2">
							<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f9bb0]">
								Phase {phase.position}
							</p>
							<p className="font-sans text-[12px] text-[#667388]">{phase.title}</p>
						</div>
						<h3 className="mt-2 font-sans text-[20px] font-semibold tracking-[-0.02em] text-black">{phase.scenarioTitle}</h3>
						<p className="mt-1 font-sans text-[14px] leading-[1.55] text-[#556173]">{phase.scenarioDescription}</p>
						<p className="mt-3 rounded-lg bg-[#f8fafc] px-3 py-2 font-sans text-[13px] text-[#49556a]">{phase.callout}</p>

						{phase.image ? (
							<div className="mt-3 overflow-hidden rounded-lg border border-[#e8edf4] bg-white">
								<Image
									src={phase.image}
									alt={`${phase.title} visual`}
									width={1200}
									height={400}
									unoptimized
									className="h-40 w-full object-cover"
								/>
							</div>
						) : null}

						<div className="mt-3 space-y-2">
							{phase.choices.map((choice) => (
								<div key={choice.id} className="rounded-lg border border-[#edf0f4] p-3">
									<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f9bb0]">
										Choice {choice.label}
									</p>
									<p className="mt-1 font-sans text-[16px] font-semibold text-black">{choice.title}</p>
									<p className="mt-1 font-sans text-[13px] leading-[1.55] text-[#556173]">{choice.description}</p>
									<p className="mt-2 rounded bg-[#f5f7fa] px-2.5 py-2 font-sans text-[12px] text-[#5f6b7e]">{choice.preview}</p>
									{choice.image ? (
										<div className="mt-2 overflow-hidden rounded-lg border border-[#e8edf4] bg-white">
											<Image
												src={choice.image}
												alt={`${choice.title} visual`}
												width={900}
												height={280}
												unoptimized
												className="h-28 w-full object-cover"
											/>
										</div>
									) : null}
									<div className="mt-2 flex flex-wrap gap-1.5">
										<EffectPill label="Trust" value={choice.effects.trust} />
										<EffectPill label="Revenue" value={choice.effects.revenue} />
										<EffectPill label="Population" value={choice.effects.population} />
									</div>
								</div>
							))}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
