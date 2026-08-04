"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { slugify } from "@/lib/admin/helpers";
import {
	createEmptyModule,
	ensureSeededModules,
	getModuleById,
	getUniqueSlug,
	listModules,
	saveModule,
} from "@/lib/admin/repository";
import type { LearningModule, ModuleChoice, ModulePhase } from "@/lib/admin/types";

type ModuleEditorFormProps = {
	mode: "create" | "edit";
	moduleId?: string;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
	return (
		<p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a8a7d]">
			{children}
		</p>
	);
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			{...props}
			className={`h-11 w-full rounded-xl border border-[#d6dfd0] bg-white px-3 text-[14px] text-black outline-none transition-colors placeholder:text-[#93a094] focus:border-[#1f9a63] ${props.className ?? ""}`}
		/>
	);
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<textarea
			{...props}
			className={`w-full rounded-xl border border-[#d6dfd0] bg-white px-3 py-3 text-[14px] text-black outline-none transition-colors placeholder:text-[#93a094] focus:border-[#1f9a63] ${props.className ?? ""}`}
		/>
	);
}

function ChoiceCard({
	choice,
	onChange,
}: {
	choice: ModuleChoice;
	onChange: (updated: ModuleChoice) => void;
}) {
	return (
		<div className="rounded-xl border border-[#dde7db] bg-[#f8fcf5] p-3 sm:p-4">
			<div className="flex items-center justify-between gap-3">
				<p className="font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
					Choice {choice.label}
				</p>
			</div>

			<div className="mt-3 space-y-3">
				<div>
					<FieldLabel>Choice title</FieldLabel>
					<TextInput
						value={choice.title}
						onChange={(event) => onChange({ ...choice, title: event.target.value })}
						placeholder="e.g. Equal, plain-language options"
					/>
				</div>
				<div>
					<FieldLabel>Description</FieldLabel>
					<TextArea
						rows={2}
						value={choice.description}
						onChange={(event) => onChange({ ...choice, description: event.target.value })}
						placeholder="Explain what the choice does."
					/>
				</div>
				<div>
					<FieldLabel>Preview text</FieldLabel>
					<TextArea
						rows={2}
						value={choice.preview}
						onChange={(event) => onChange({ ...choice, preview: event.target.value })}
						placeholder="What should admins expect after this choice?"
					/>
				</div>
				<div>
					<FieldLabel>Choice image URL (optional)</FieldLabel>
					<TextInput
						value={choice.image ?? ""}
						onChange={(event) => onChange({ ...choice, image: event.target.value })}
						placeholder="https://..."
					/>
				</div>
				<div className="grid grid-cols-3 gap-2">
					<div>
						<FieldLabel>Trust</FieldLabel>
						<TextInput
							type="number"
							step={1}
							value={choice.effects.trust}
							onChange={(event) =>
								onChange({
									...choice,
									effects: { ...choice.effects, trust: Number(event.target.value) || 0 },
								})
							}
						/>
					</div>
					<div>
						<FieldLabel>Growth</FieldLabel>
						<TextInput
							type="number"
							step={1}
							value={choice.effects.revenue}
							onChange={(event) =>
								onChange({
									...choice,
									effects: { ...choice.effects, revenue: Number(event.target.value) || 0 },
								})
							}
						/>
					</div>
					<div>
						<FieldLabel>Reach</FieldLabel>
						<TextInput
							type="number"
							step={1}
							value={choice.effects.population}
							onChange={(event) =>
								onChange({
									...choice,
									effects: { ...choice.effects, population: Number(event.target.value) || 0 },
								})
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function validateForPublish(moduleData: LearningModule) {
	const errors: string[] = [];

	if (!moduleData.title.trim()) {
		errors.push("Module title is required.");
	}
	if (!moduleData.slug.trim()) {
		errors.push("Slug is required.");
	}
	if (!moduleData.description.trim()) {
		errors.push("Short description is required.");
	}
	if (!moduleData.introduction.trim()) {
		errors.push("Introduction content is required.");
	}
	if (!moduleData.tutorial.trim()) {
		errors.push("Tutorial content is required.");
	}
	if (moduleData.phases.length === 0) {
		errors.push("At least one phase is required.");
	}

	for (const phase of moduleData.phases) {
		if (!phase.title.trim()) {
			errors.push(`Phase ${phase.position}: phase title is required.`);
		}
		if (!phase.scenarioTitle.trim()) {
			errors.push(`Phase ${phase.position}: scenario title is required.`);
		}
		if (!phase.scenarioDescription.trim()) {
			errors.push(`Phase ${phase.position}: scenario description is required.`);
		}
		if (!phase.callout.trim()) {
			errors.push(`Phase ${phase.position}: callout text is required.`);
		}

		if (phase.choices.length !== 3) {
			errors.push(`Phase ${phase.position}: exactly three choices are required.`);
		}

		for (const choice of phase.choices) {
			if (!choice.title.trim()) {
				errors.push(`Phase ${phase.position}, choice ${choice.label}: title is required.`);
			}
			if (!choice.description.trim()) {
				errors.push(`Phase ${phase.position}, choice ${choice.label}: description is required.`);
			}
			if (!choice.preview.trim()) {
				errors.push(`Phase ${phase.position}, choice ${choice.label}: preview text is required.`);
			}
		}
	}

	return errors;
}

export function ModuleEditorForm({ mode, moduleId }: ModuleEditorFormProps) {
	const router = useRouter();
	const [moduleData, setModuleData] = useState<LearningModule | null>(null);
	const [baselineSnapshot, setBaselineSnapshot] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [slugTouched, setSlugTouched] = useState(false);
	const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({});

	useEffect(() => {
		const timer = window.setTimeout(() => {
			ensureSeededModules();
			const existingModules = listModules();

			if (mode === "create") {
				const empty = createEmptyModule(existingModules);
				setModuleData(empty);
				setBaselineSnapshot(JSON.stringify(empty));
				setIsLoading(false);
				return;
			}

			if (!moduleId) {
				setModuleData(null);
				setIsLoading(false);
				return;
			}

			const existing = getModuleById(moduleId);
			setModuleData(existing);
			setBaselineSnapshot(existing ? JSON.stringify(existing) : "");
			setIsLoading(false);
		}, 0);

		return () => {
			window.clearTimeout(timer);
		};
	}, [mode, moduleId]);

	const isDirty = useMemo(() => {
		if (!moduleData) {
			return false;
		}

		return JSON.stringify(moduleData) !== baselineSnapshot;
	}, [moduleData, baselineSnapshot]);

	useEffect(() => {
		if (!isDirty) {
			return;
		}

		const onBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			event.returnValue = "";
		};

		window.addEventListener("beforeunload", onBeforeUnload);
		return () => window.removeEventListener("beforeunload", onBeforeUnload);
	}, [isDirty]);

	useEffect(() => {
		if (!isDirty) {
			return;
		}

		const onDocumentClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement | null;
			const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
			if (!anchor) {
				return;
			}

			const href = anchor.getAttribute("href");
			if (!href || href.startsWith("#")) {
				return;
			}

			const nextUrl = new URL(anchor.href, window.location.href);
			const isSamePage =
				nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search;

			if (isSamePage) {
				return;
			}

			const shouldLeave = window.confirm("You have unsaved changes. Leave this page anyway?");
			if (!shouldLeave) {
				event.preventDefault();
				event.stopPropagation();
			}
		};

		document.addEventListener("click", onDocumentClick, true);
		return () => document.removeEventListener("click", onDocumentClick, true);
	}, [isDirty]);

	if (isLoading) {
		return (
			<section className="rounded-2xl border border-[#e8ebf0] bg-white p-5">
				<p className="font-sans text-[14px] text-[#667388]">Loading module editor...</p>
			</section>
		);
	}

	if (!moduleData) {
		return (
			<section className="rounded-2xl border border-[#e8ebf0] bg-white p-5">
				<p className="font-sans text-[14px] text-[#b42318]">Module not found.</p>
			</section>
		);
	}

	const updateModule = (next: LearningModule) => {
		setModuleData(next);
	};

	const updatePhase = (phaseId: string, updater: (phase: ModulePhase) => ModulePhase) => {
		updateModule({
			...moduleData,
			phases: moduleData.phases.map((phase) => (phase.id === phaseId ? updater(phase) : phase)),
		});
	};

	const togglePhase = (phaseId: string) => {
		setOpenPhases((current) => ({
			...current,
			[phaseId]: !current[phaseId],
		}));
	};

	const exportModuleJson = () => {
		const blob = new Blob([JSON.stringify(moduleData, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `${moduleData.slug || "module"}.json`;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(url);
	};

	const saveWithStatus = async (status: LearningModule["status"], openPreview = false) => {
		setIsSaving(true);

		const slug = slugify(moduleData.slug || moduleData.title);
		const allModules = listModules();
		const conflicting = allModules.filter((module) => module.id !== moduleData.id);
		const uniqueSlug = getUniqueSlug(slug || "module", conflicting);
		const toSave: LearningModule = {
			...moduleData,
			status,
			slug: uniqueSlug,
		};

		if (status === "published") {
			const validationErrors = validateForPublish(toSave);
			if (validationErrors.length > 0) {
				window.alert(`Cannot publish yet:\n\n${validationErrors.slice(0, 8).join("\n")}`);
				setIsSaving(false);
				return;
			}
		}

		saveModule(toSave);
		const persisted = getModuleById(toSave.id);
		const snapshotTarget = persisted ?? toSave;
		setModuleData(snapshotTarget);
		setBaselineSnapshot(JSON.stringify(snapshotTarget));
		setIsSaving(false);

		if (openPreview) {
			router.push(`/admin/modules/${toSave.id}/preview`);
			return;
		}

		if (mode === "create") {
			router.replace(`/admin/modules/${toSave.id}/edit`);
		}
	};

	return (
		<section className="animate-rise-in space-y-5">
			<div className="card-surface rounded-3xl p-4 sm:p-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#95a0b2]">
							{mode === "create" ? "Create Module" : "Edit Module"}
						</p>
						<h2 className="admin-responsive-title mt-1 font-sans font-semibold text-black">
							{mode === "create" ? "Create New Module" : moduleData.title || "Untitled Module"}
						</h2>
						<p className="mt-1 font-sans text-[13px] text-[#5f6c62]">
							5 fixed phases, 3 choices in each phase.
						</p>
					</div>
					{isDirty ? (
						<span className="rounded-full bg-[#ecf8ef] px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f9a63]">
							Unsaved changes
						</span>
					) : (
						<span className="rounded-full bg-[#e8f5ee] px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#166534]">
							All changes saved
						</span>
					)}
				</div>
				<div className="mt-4 flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => {
							if (!isDirty || window.confirm("Discard unsaved changes and cancel?")) {
								router.push("/admin/modules");
							}
						}}
						className="inline-flex h-9 items-center justify-center rounded-full border border-[#d6e0d1] bg-white px-3 font-sans text-[12px] font-semibold text-[#2f4038]"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => saveWithStatus(moduleData.status, true)}
						disabled={isSaving}
						className="inline-flex h-9 items-center justify-center rounded-full border border-[#d6e0d1] bg-white px-3 font-sans text-[12px] font-semibold text-[#2f4038] disabled:opacity-50"
					>
						Preview
					</button>
					<button
						type="button"
						onClick={() => saveWithStatus("draft")}
						disabled={isSaving}
						className="inline-flex h-9 items-center justify-center rounded-full border border-[#d6e0d1] bg-white px-3 font-sans text-[12px] font-semibold text-[#2f4038] disabled:opacity-50"
					>
						Save Draft
					</button>
					<button
						type="button"
						onClick={exportModuleJson}
						className="inline-flex h-9 items-center justify-center rounded-full border border-[#d6e0d1] bg-white px-3 font-sans text-[12px] font-semibold text-[#2f4038]"
					>
						Export JSON
					</button>
					<button
						type="button"
						onClick={() => saveWithStatus("published")}
						disabled={isSaving}
						className="inline-flex h-9 items-center justify-center rounded-full bg-[#1f9a63] px-3 font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-50"
					>
						Publish
					</button>
				</div>
			</div>

			<div className="admin-editor-grid">
				<div className="card-surface admin-editor-sidebar rounded-3xl p-4 sm:p-5">
						<h3 className="display-title flex items-center gap-2.5 text-base text-black">
							<span aria-hidden="true" className="h-3.5 w-1 rounded-full bg-[#1f9a63]" />
							Module Details
						</h3>
					<p className="mt-2 font-sans text-[13px] leading-[1.55] text-[#667388]">
						Set the module framing content before editing each phase.
					</p>
					<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
					<div className="sm:col-span-2">
						<FieldLabel>Module title</FieldLabel>
						<TextInput
							value={moduleData.title}
							onChange={(event) => {
								const nextTitle = event.target.value;
								const nextSlug = slugTouched ? moduleData.slug : slugify(nextTitle);
								updateModule({ ...moduleData, title: nextTitle, slug: nextSlug });
							}}
							placeholder="e.g. Deceptive Design"
						/>
					</div>
					<div>
						<FieldLabel>Slug</FieldLabel>
						<TextInput
							value={moduleData.slug}
							onChange={(event) => {
								setSlugTouched(true);
								updateModule({ ...moduleData, slug: slugify(event.target.value) });
							}}
							placeholder="deceptive-design"
						/>
					</div>
					<div>
						<FieldLabel>Estimated completion minutes</FieldLabel>
						<TextInput
							type="number"
							min={1}
							value={moduleData.estimatedMinutes}
							onChange={(event) =>
								updateModule({
									...moduleData,
									estimatedMinutes: Math.max(1, Number(event.target.value) || 1),
								})
							}
						/>
					</div>
					<div className="sm:col-span-2">
						<FieldLabel>Short description</FieldLabel>
						<TextArea
							rows={3}
							value={moduleData.description}
							onChange={(event) => updateModule({ ...moduleData, description: event.target.value })}
							placeholder="One clear sentence about what users will practice."
						/>
					</div>
					<div className="sm:col-span-2">
						<FieldLabel>Introduction content</FieldLabel>
						<TextArea
							rows={4}
							value={moduleData.introduction}
							onChange={(event) => updateModule({ ...moduleData, introduction: event.target.value })}
							placeholder="What context should the learner see before starting?"
						/>
					</div>
					<div className="sm:col-span-2">
						<FieldLabel>Tutorial content</FieldLabel>
						<TextArea
							rows={4}
							value={moduleData.tutorial}
							onChange={(event) => updateModule({ ...moduleData, tutorial: event.target.value })}
							placeholder="Tell users how to move through phases and compare outcomes."
						/>
					</div>
					<div className="sm:col-span-2">
						<FieldLabel>Optional image or thumbnail URL</FieldLabel>
						<TextInput
							value={moduleData.thumbnail ?? ""}
							onChange={(event) => updateModule({ ...moduleData, thumbnail: event.target.value })}
							placeholder="https://..."
						/>
					</div>
					</div>
				</div>

				<div className="card-surface rounded-3xl p-4 sm:p-5">
					<div className="flex items-center justify-between gap-3">
						<h3 className="display-title flex items-center gap-2.5 text-base text-black">
							<span aria-hidden="true" className="h-3.5 w-1 rounded-full bg-[#1f9a63]" />
							Phase Editor
						</h3>
						<span className="rounded-full bg-[#edf6ee] px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2b4e3d]">
							Template flow locked
						</span>
					</div>
					<p className="mt-2 font-sans text-[13px] leading-[1.55] text-[#667388]">
						Edit each phase and choice. Keep wording short and each option meaningfully different.
					</p>

					<div className="mt-4 space-y-4">
						{moduleData.phases.map((phase) => (
							<article key={phase.id} className="rounded-2xl border border-[#dde7db] bg-white">
								{(() => {
									const isOpen = openPhases[phase.id] ?? phase.position === 1;
									return (
										<>
										<button
											type="button"
											onClick={() => togglePhase(phase.id)}
											className="flex w-full items-center gap-3 p-4 text-left"
										>
											<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef3ee] text-sm font-bold text-[#1f3e31]">
												{phase.position}
											</span>
											<span className="min-w-0 flex-1">
												<span className="block truncate text-[16px] font-semibold text-black">
													{phase.title || `Phase ${phase.position}`}
												</span>
												<span className="block truncate text-xs text-[#60756a]">
													{phase.scenarioTitle || "No scenario title"} · {phase.choices.length} choices
												</span>
											</span>
											<span
												className={`ml-auto inline-block text-[18px] leading-none text-[#5f6c62] transition-transform ${isOpen ? "rotate-180" : ""}`}
												aria-hidden="true"
											>
												⌄
											</span>
										</button>

										{isOpen ? (
											<div className="border-t border-[#e0e9df] p-4 sm:p-5">
												<div className="grid gap-3 sm:grid-cols-2">
													<div>
														<FieldLabel>Phase title</FieldLabel>
														<TextInput
															value={phase.title}
															onChange={(event) =>
																updatePhase(phase.id, (current) => ({ ...current, title: event.target.value }))
															}
															placeholder="e.g. Consent Banner"
														/>
													</div>
													<div>
														<FieldLabel>Position</FieldLabel>
														<TextInput type="number" value={phase.position} readOnly />
													</div>
													<div className="sm:col-span-2">
														<FieldLabel>Scenario title</FieldLabel>
														<TextInput
															value={phase.scenarioTitle}
															onChange={(event) =>
																updatePhase(phase.id, (current) => ({ ...current, scenarioTitle: event.target.value }))
															}
															placeholder="e.g. Cookie Consent on First Visit"
														/>
													</div>
													<div className="sm:col-span-2">
														<FieldLabel>Scenario description</FieldLabel>
														<TextArea
															rows={2}
															value={phase.scenarioDescription}
															onChange={(event) =>
																updatePhase(phase.id, (current) => ({
																	...current,
																	scenarioDescription: event.target.value,
																}))
															}
															placeholder="What challenge is being presented?"
														/>
													</div>
													<div className="sm:col-span-2">
														<FieldLabel>Callout or context text</FieldLabel>
														<TextArea
															rows={2}
															value={phase.callout}
															onChange={(event) =>
																updatePhase(phase.id, (current) => ({ ...current, callout: event.target.value }))
															}
															placeholder="Additional context shown between scenario and choices."
														/>
													</div>
													<div className="sm:col-span-2">
														<FieldLabel>Phase image URL (optional)</FieldLabel>
														<TextInput
															value={phase.image ?? ""}
															onChange={(event) =>
																updatePhase(phase.id, (current) => ({ ...current, image: event.target.value }))
															}
															placeholder="https://..."
														/>
													</div>
												</div>

												<div className="mt-4 space-y-3">
													<h5 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
														Choice Editor
													</h5>
													{phase.choices.map((choice, choiceIndex) => (
														<ChoiceCard
															key={choice.id}
															choice={choice}
															onChange={(updatedChoice) => {
																updatePhase(phase.id, (current) => {
																	const nextChoices = [...current.choices];
																	nextChoices[choiceIndex] = { ...updatedChoice, label: ["A", "B", "C"][choiceIndex] };
																	return { ...current, choices: nextChoices };
																});
															}}
														/>
													))}
												</div>
											</div>
										) : null}
										</>
									);
								})()}
							</article>
						))}
					</div>
				</div>
				</div>


		</section>
	);
}
