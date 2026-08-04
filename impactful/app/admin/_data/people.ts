export type MemberRole = "User" | "Admin";

export type Member = {
	id: string;
	name: string;
	email: string;
	role: MemberRole;
	progress: number;
	lastActive: string;
};

export const members: Member[] = [
	{
		id: "m1",
		name: "Ava Ramirez",
		email: "ava.ramirez@impactful.org",
		role: "User",
		progress: 82,
		lastActive: "2 hours ago",
	},
	{
		id: "m2",
		name: "Jonah Pike",
		email: "jonah.pike@impactful.org",
		role: "User",
		progress: 45,
		lastActive: "Yesterday",
	},
	{
		id: "m3",
		name: "Mei Tanaka",
		email: "mei.tanaka@impactful.org",
		role: "Admin",
		progress: 100,
		lastActive: "3 days ago",
	},
	{
		id: "m4",
		name: "Darius Bell",
		email: "darius.bell@impactful.org",
		role: "Admin",
		progress: 100,
		lastActive: "Just now",
	},
	{
		id: "m5",
		name: "Sofia Nkemelu",
		email: "sofia.n@impactful.org",
		role: "User",
		progress: 18,
		lastActive: "5 days ago",
	},
	{
		id: "m6",
		name: "Grace Whitmore",
		email: "grace.w@impactful.org",
		role: "User",
		progress: 96,
		lastActive: "1 week ago",
	},
];