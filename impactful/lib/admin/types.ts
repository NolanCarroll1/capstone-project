export type ModuleChoice = {
	id: string;
	label: string;
	title: string;
	description: string;
	preview: string;
	image?: string;
	effects: {
		trust: number;
		revenue: number;
		population: number;
	};
};

export type ModulePhase = {
	id: string;
	position: number;
	title: string;
	scenarioTitle: string;
	scenarioDescription: string;
	callout: string;
	image?: string;
	choices: ModuleChoice[];
};

export type LearningModuleStatus = "draft" | "published";

export type LearningModule = {
	id: string;
	title: string;
	slug: string;
	description: string;
	introduction: string;
	tutorial: string;
	estimatedMinutes: number;
	status: LearningModuleStatus;
	thumbnail?: string;
	phases: ModulePhase[];
	createdAt: string;
	updatedAt: string;
};

export type LearningModuleDraft = Omit<LearningModule, "createdAt" | "updatedAt">;
