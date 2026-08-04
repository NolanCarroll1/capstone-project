import type { ModuleChoice, ModulePhase } from "./types";

export function createId(prefix = "id") {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return `${prefix}-${crypto.randomUUID()}`;
	}

	return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
}

export function slugify(input: string) {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export function formatDate(isoString: string) {
	const parsed = new Date(isoString);

	if (Number.isNaN(parsed.getTime())) {
		return "Unknown";
	}

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(parsed);
}

export function nowIso() {
	return new Date().toISOString();
}

function createDefaultChoice(label: string): ModuleChoice {
	return {
		id: createId("choice"),
		label,
		title: "",
		description: "",
		preview: "",
		effects: {
			trust: 0,
			revenue: 0,
			population: 0,
		},
	};
}

export function createDefaultPhase(position: number): ModulePhase {
	return {
		id: createId("phase"),
		position,
		title: `Phase ${position}`,
		scenarioTitle: "",
		scenarioDescription: "",
		callout: "",
		choices: [createDefaultChoice("A"), createDefaultChoice("B"), createDefaultChoice("C")],
	};
}
