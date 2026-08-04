export type CustomizationType = "theme" | "text" | "setting";

export type Customization = {
	id: string;
	name: string;
	description?: string;
	type: CustomizationType;
	enabled: boolean;
	updatedAt: string;
};

export const customizations: Customization[] = [
	{
		id: "c1",
		name: "Primary color",
		description: "Brand primary color used across the app",
		type: "theme",
		enabled: true,
		updatedAt: "2026-07-15T10:32:00Z",
	},
	{
		id: "c2",
		name: "Onboarding text",
		description: "Welcome text shown on first launch",
		type: "text",
		enabled: true,
		updatedAt: "2026-07-28T08:12:00Z",
	},
	{
		id: "c3",
		name: "Enable analytics",
		description: "Toggle collection of anonymous usage data",
		type: "setting",
		enabled: false,
		updatedAt: "2026-06-03T16:50:00Z",
	},
	{
		id: "c4",
		name: "Header font size",
		description: "Accessible header sizing override",
		type: "theme",
		enabled: true,
		updatedAt: "2026-07-01T11:05:00Z",
	},
];
