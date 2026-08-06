import { createDefaultPhase, createId, nowIso, slugify } from "./helpers";
import { sampleModules } from "./sampleData";
import type { LearningModule, LearningModuleStatus, ModulePhase } from "./types";
import * as serverApi from "@/lib/admin/serverApi";

const STORAGE_KEY = "impactful-admin-modules-v1";
const SEEDED_KEY = "impactful-admin-seeded-v1";

function normalizeLegacyTerms(text: string) {
	return text
			.replace(/\bFellows\b/g, "Users")
			.replace(/\bfellows\b/g, "users")
			.replace(/\bUVU\b/g, "Impactful")
			.replace(/\bmetrics\b/g, "outcomes")
			.replace(/\bMetrics\b/g, "Outcomes");
}

function canUseStorage() {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function canUseSupabase() {
	return typeof window !== "undefined" && Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function readStoredModules(): LearningModule[] {
	if (!canUseStorage()) {
			return sampleModules;
	}

	const raw = window.localStorage.getItem(STORAGE_KEY);

	if (!raw) {
			return [];
	}

	try {
			const parsed = JSON.parse(raw) as LearningModule[];
			return Array.isArray(parsed) ? parsed : [];
	} catch {
			return [];
	}
}

function writeStoredModules(modules: LearningModule[]) {
	if (!canUseStorage()) {
			return;
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));

	// Mirror changes to server API in the background when available (best-effort).
	if (canUseSupabase()) {
			(async () => {
				try {
					for (const m of modules) {
						await serverApi.apiSaveModule(m).catch((err) => {
							// don't fail the UI — log for debugging
							console.warn("module upsert failed", m.id, err);
						});
					}
				} catch (err) {
					console.warn("Server sync failed", err);
				}
			})();
	}
}

function sortByUpdatedDesc(modules: LearningModule[]) {
	return [...modules].sort((a, b) => {
			const aTime = new Date(a.updatedAt).getTime();
			const bTime = new Date(b.updatedAt).getTime();
			return bTime - aTime;
	});
}

function normalizeChoices(choices: ModulePhase["choices"]) {
	const labels = ["A", "B", "C"];
	const nextChoices = labels.map((label, index) => {
			const existing = choices[index];

			if (!existing) {
				return {
					id: createId("choice"),
					label,
					title: "",
					description: "",
					preview: "",
					image: "",
					effects: {
						trust: 0,
						revenue: 0,
						population: 0,
					},
				};
			}

			return {
				...existing,
				label,
				title: normalizeLegacyTerms((existing.title || "").trim()),
				description: normalizeLegacyTerms((existing.description || "").trim()),
				preview: normalizeLegacyTerms((existing.preview || "").trim()),
				image: existing.image?.trim() || "",
				effects: {
					trust: Number(existing.effects?.trust ?? 0),
					revenue: Number(existing.effects?.revenue ?? 0),
					population: Number(existing.effects?.population ?? 0),
				},
			};
	});

	return nextChoices;
}

function getTemplateModule() {
	return sampleModules.find((module) => module.slug === "deceptive-design") ?? sampleModules[0];
}

function alignPhasesToTemplate(phases: ModulePhase[], status: LearningModuleStatus) {
	if (status === "draft" && phases.length === 0) {
			return [];
	}

	const template = getTemplateModule();

	if (!template) {
			return phases;
	}

	const templatePhases = template.phases;

	return templatePhases.map((templatePhase, index) => {
			const existing = phases[index];

			if (!existing) {
				return {
					...templatePhase,
					id: createId("phase"),
					position: index + 1,
					image: templatePhase.image?.trim() || "",
					choices: normalizeChoices(templatePhase.choices).map((choice) => ({
						...choice,
						id: createId("choice"),
					})),
				};
			}

			return {
				...existing,
				position: index + 1,
				image: existing.image?.trim() || "",
				choices: normalizeChoices(existing.choices),
			};
	});
}

function normalizeModule(module: LearningModule): LearningModule {
	const sortedInput = module.phases
			.slice()
			.sort((a, b) => a.position - b.position)
			.map((phase) => ({
				...phase,
				title: normalizeLegacyTerms((phase.title || "").trim()),
				scenarioTitle: normalizeLegacyTerms((phase.scenarioTitle || "").trim()),
				scenarioDescription: normalizeLegacyTerms((phase.scenarioDescription || "").trim()),
				callout: normalizeLegacyTerms((phase.callout || "").trim()),
				image: phase.image?.trim() || "",
			}));

	const phases = alignPhasesToTemplate(sortedInput, module.status);

	return {
			...module,
			title: normalizeLegacyTerms(module.title.trim()),
			slug: slugify(module.slug || module.title),
			description: normalizeLegacyTerms(module.description.trim()),
			introduction: normalizeLegacyTerms(module.introduction.trim()),
			tutorial: normalizeLegacyTerms(module.tutorial.trim()),
			estimatedMinutes: Math.max(1, Number(module.estimatedMinutes) || 1),
			thumbnail: module.thumbnail?.trim() || undefined,
			phases,
	};
}

export function ensureSeededModules() {
	if (!canUseStorage()) {
			return;
	}

	const seeded = window.localStorage.getItem(SEEDED_KEY);
	const existing = readStoredModules();
	const existingIds = new Set(existing.map((module) => module.id));
	const missingBaselineModules = sampleModules.filter((module) => !existingIds.has(module.id));

	if (missingBaselineModules.length > 0) {
			const merged = sortByUpdatedDesc([...existing, ...missingBaselineModules]);
			writeStoredModules(merged);
			window.localStorage.setItem(SEEDED_KEY, "true");

			// Also seed into server via API if available (best-effort)
			if (canUseSupabase()) {
				(async () => {
					try {
						for (const m of merged) {
							await serverApi.apiSaveModule(m).catch(() => {
								// ignore individual failures
							});
						}
					} catch (e) {
						// ignore
					}
				})();
			}

			return;
	}

	if (seeded && existing.length > 0) {
			return;
	}

	writeStoredModules(sampleModules);
	window.localStorage.setItem(SEEDED_KEY, "true");

	if (canUseSupabase()) {
			(async () => {
				try {
					for (const m of sampleModules) {
						await serverApi.apiSaveModule(m).catch(() => {});
					}
				} catch (e) {
					// ignore
				}
			})();
	}
}

export function listModules() {
	const modules = readStoredModules().map((module) => normalizeModule(module));
	return sortByUpdatedDesc(modules);
}

export function getModuleById(moduleId: string) {
	const modules = readStoredModules();
	const found = modules.find((module) => module.id === moduleId);
	return found ? normalizeModule(found) : null;
}

export function saveModule(module: LearningModule) {
	const normalized = normalizeModule(module);
	const modules = readStoredModules();
	const index = modules.findIndex((item) => item.id === normalized.id);

	if (index >= 0) {
			const existing = modules[index];
			modules[index] = {
				...normalized,
				createdAt: existing.createdAt,
				updatedAt: nowIso(),
			};
	} else {
			modules.push({
				...normalized,
				createdAt: nowIso(),
				updatedAt: nowIso(),
			});
	}

	writeStoredModules(modules);
	return normalized;
}

export function deleteModule(moduleId: string) {
	const modules = readStoredModules();
	const nextModules = modules.filter((module) => module.id !== moduleId);
	writeStoredModules(nextModules);

	// Best-effort: also remove on server when available
	if (canUseSupabase()) {
			(async () => {
				try {
					await serverApi.apiDeleteModule(moduleId);
				} catch (e) {
					// ignore
				}
			})();
	}
}

export function duplicateModule(moduleId: string) {
	const modules = readStoredModules();
	const original = modules.find((module) => module.id === moduleId);

	if (!original) {
			return null;
	}

	const slugBase = `${original.slug}-copy`;
	const uniqueSlug = getUniqueSlug(slugBase, modules);
	const timestamp = nowIso();

	const clone: LearningModule = {
			...original,
			id: createId("module"),
			title: `${original.title} (Copy)`,
			slug: uniqueSlug,
			status: "draft",
			createdAt: timestamp,
			updatedAt: timestamp,
			phases: original.phases.map((phase) => ({
				...phase,
				id: createId("phase"),
				choices: phase.choices.map((choice) => ({
					...choice,
					id: createId("choice"),
				})),
			})),
	};

	modules.push(clone);
	writeStoredModules(modules);

	// Best-effort: upsert new clone to server as well
	if (canUseSupabase()) {
			(async () => {
				try {
					await serverApi.apiSaveModule(clone).catch(() => {});
				} catch (e) {
					// ignore
				}
			})();
	}

	return clone;
}

export function setModuleStatus(moduleId: string, status: LearningModuleStatus) {
	const modules = readStoredModules();
	const index = modules.findIndex((module) => module.id === moduleId);

	if (index < 0) {
			return null;
	}

	const updated = {
			...modules[index],
			status,
			updatedAt: nowIso(),
	};

	modules[index] = updated;
	writeStoredModules(modules);

	// Best-effort: mirror status change to server
	if (canUseSupabase()) {
			(async () => {
				try {
					await serverApi.apiSetModuleStatus(updated.id, updated.status).catch(() => {});
				} catch (e) {
					// ignore
				}
			})();
	}

	return updated;
}

export function getUniqueSlug(baseSlug: string, existingModules: LearningModule[]) {
	const normalizedBase = slugify(baseSlug) || "module";
	let slug = normalizedBase;
	let counter = 2;

	while (existingModules.some((module) => module.slug === slug)) {
			slug = `${normalizedBase}-${counter}`;
			counter += 1;
	}

	return slug;
}

export function createEmptyModule(existingModules: LearningModule[] = []): LearningModule {
	const baseTitle = "Untitled Module";
	const baseSlug = getUniqueSlug("untitled-module", existingModules);
	const timestamp = nowIso();
	const labels = ["A", "B", "C"];
	const templateModule = getTemplateModule();

	const templatePhases = templateModule
			? templateModule.phases.map((phase, phaseIndex) => ({
				...phase,
				id: createId("phase"),
				position: phaseIndex + 1,
				image: phase.image?.trim() || "",
				choices: phase.choices.map((choice, choiceIndex) => ({
					...choice,
					id: createId("choice"),
					label: labels[choiceIndex] ?? choice.label,
					image: choice.image?.trim() || "",
				})),
			}))
			: [createDefaultPhase(1)];

	return {
			id: createId("module"),
			title: baseTitle,
			slug: baseSlug,
			description: templateModule?.description ?? "",
			introduction: templateModule?.introduction ?? "",
			tutorial: templateModule?.tutorial ?? "",
			estimatedMinutes: templateModule?.estimatedMinutes ?? 10,
			status: "draft",
			thumbnail: templateModule?.thumbnail ?? "",
			phases: templatePhases,
			createdAt: timestamp,
			updatedAt: timestamp,
	};
}

export function reorderPhases(phases: ModulePhase[]) {
	return phases
			.slice()
			.sort((a, b) => a.position - b.position)
			.map((phase, index) => ({
				...phase,
				position: index + 1,
			}));
}
